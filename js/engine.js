/*
 * engine.js
 * The recommendation engine. Takes the questionnaire answers and produces:
 *   - an estimated realistic athletic tier
 *   - academic eligibility flags
 *   - recommended target divisions/pathways (ranked)
 *   - a Reach / Target / Safety school shortlist filtered by affordability
 *   - a personalized action checklist and red flags
 *
 * All logic is transparent and rule-based so a parent (or a developer) can see
 * exactly why a recommendation was made.
 */

/* Map a raw athletic score to a tier label. */
function athleticTier(score) {
  if (score >= 82) return { key: "elite", label: "Elite / D1-caliber" };
  if (score >= 62) return { key: "high", label: "High / D2–NAIA-caliber" };
  if (score >= 40) return { key: "solid", label: "Solid / D3–NAIA-caliber" };
  return { key: "developing", label: "Developing / JUCO-first pathway" };
}

/* Compute a 0-100 athletic score from the athletic answers. */
function computeAthleticScore(a) {
  let s = 0;

  // Level currently playing (0-35)
  s += ({
    varsityStar: 35,
    varsityStarter: 28,
    varsityBench: 16,
    jv: 8,
    rec: 3,
  }[a.playingLevel] || 0);

  // Club / AAU exposure level (0-25)
  s += ({
    nationalCircuit: 25,
    regional: 16,
    local: 8,
    none: 0,
  }[a.clubLevel] || 0);

  // Self/coach-rated competitiveness vs peers (0-20)
  s += ({
    topInState: 20,
    topInRegion: 14,
    aboveAverage: 8,
    average: 3,
  }[a.competitiveness] || 0);

  // Recruiting interest signals (0-12)
  s += ({
    d1Interest: 12,
    someInterest: 7,
    campInvites: 4,
    none: 0,
  }[a.coachInterest] || 0);

  // Highlight film exists (0-8) — you can't get recruited without it
  if (a.hasFilm === "yes") s += 8;
  else if (a.hasFilm === "building") s += 3;

  // Earlier grade with strong profile = more runway (small bonus, capped)
  if ((a.grade === "9" || a.grade === "10") && s > 40) s += 5;

  return Math.max(0, Math.min(100, s));
}

/* Academic eligibility assessment. */
function assessAcademics(a) {
  const gpa = parseFloat(a.gpa);
  const flags = [];
  let eligibilityRisk = "low";

  if (isNaN(gpa)) {
    flags.push("Enter a GPA to check NCAA academic eligibility.");
  } else {
    if (gpa < 2.3) {
      eligibilityRisk = "high";
      flags.push(
        "GPA is below the NCAA D1 core-course minimum (2.3). Prioritize raising grades now, and consider a JUCO year to rebuild academics while playing."
      );
    } else if (gpa < 2.6) {
      eligibilityRisk = "medium";
      flags.push(
        "GPA is in the borderline zone for NCAA D1/D2. Focus on NCAA-approved CORE courses (not just overall GPA) and keep grades rising."
      );
    }
  }

  if (a.coreCourses === "unsure" || a.coreCourses === "behind") {
    flags.push(
      "Confirm your NCAA CORE-COURSE progress with your counselor — the NCAA counts 16 specific core courses, not your full transcript. Falling behind here disqualifies otherwise-eligible players."
    );
  }

  if (a.testScores === "none") {
    flags.push(
      "No test score yet. Many schools are test-optional, but a good SAT/ACT still unlocks MERIT aid — real money for a low-income family. Sit the test at least once."
    );
  }

  // Strong academics unlock merit + selective-D3 need aid
  const academicStrength =
    !isNaN(gpa) && gpa >= 3.5
      ? "strong"
      : !isNaN(gpa) && gpa >= 3.0
      ? "good"
      : "developing";

  return { flags, eligibilityRisk, academicStrength, gpa };
}

/* Financial profile → affordability strategy. */
function assessFinances(a) {
  const notes = [];
  const lowIncome =
    a.income === "under30" ||
    a.income === "30to60" ||
    a.pellEligible === "yes" ||
    a.reducedLunch === "yes";

  // Three-way income tier drives WHICH kinds of schools we surface.
  let incomeTier;
  if (lowIncome) incomeTier = "low";
  else if (a.income === "over100") incomeTier = "high";
  else incomeTier = "middle"; // 60-100 or 'prefer not to say' with no low-income signal

  if (a.pellEligible === "yes" || a.income === "under30") {
    notes.push(
      "You likely qualify for the federal Pell Grant (up to ~$" +
        AID_FACTS.pellMax +
        "/yr) — that follows your athlete to almost any school. " +
        AID_FACTS.ncaaFeeWaiver
    );
  }

  if (a.reducedLunch === "yes") {
    notes.push(
      "Free/reduced lunch = your athlete qualifies for SAT/ACT fee waivers AND the NCAA Eligibility Center fee waiver. Don't pay these fees."
    );
  }

  notes.push(AID_FACTS.fafsa);

  if (incomeTier === "middle") {
    notes.push(
      "Middle-income tip: you may get less need-based aid, so MERIT (academic) scholarships and affordable in-state publics are your biggest levers. Strong grades and test scores are worth real money here."
    );
  }
  if (incomeTier === "high") {
    notes.push(
      "Higher-income tip: expect little need-based aid, so target schools with strong MERIT scholarships, good in-state public value, or an athletic scholarship (D1/D2/NAIA). Run each Net Price Calculator — sticker price is rarely what you pay."
    );
  }

  return {
    lowIncome,
    incomeTier, // 'low' | 'middle' | 'high'
    maxOutOfPocket: a.maxOutOfPocket, // 'under5','5to15','15to30','flexible'
    inStatePreference: a.inState === "yes",
    willingToRelocate: a.relocate === "yes",
    preferredRegion: a.region || "", // region they want to attend college in
    notes,
  };
}

/*
 * Rank the divisions/pathways for THIS family.
 * Returns an array of { key, score, reasons[] } sorted best-first.
 */
function rankDivisions(tier, academics, finances, a) {
  const scores = {
    D1: { score: 0, reasons: [] },
    D2: { score: 0, reasons: [] },
    D3: { score: 0, reasons: [] },
    NAIA: { score: 0, reasons: [] },
    JUCO: { score: 0, reasons: [] },
  };

  // --- Athletic realism drives the base score ---
  const tierWeights = {
    elite: { D1: 40, D2: 30, NAIA: 22, D3: 20, JUCO: 12 },
    high: { D1: 14, D2: 40, NAIA: 34, D3: 30, JUCO: 20 },
    solid: { D1: 4, D2: 22, NAIA: 30, D3: 38, JUCO: 26 },
    developing: { D1: 0, D2: 8, NAIA: 16, D3: 20, JUCO: 40 },
  }[tier.key];
  for (const k in tierWeights) {
    scores[k].score += tierWeights[k];
    scores[k].reasons.push(
      `Athletic tier (${tier.label}) makes ${k} a ${
        tierWeights[k] >= 30 ? "realistic" : tierWeights[k] >= 15 ? "possible" : "unlikely"
      } target.`
    );
  }

  // --- Financial fit ---
  if (finances.lowIncome) {
    // Athletic scholarships (D1/D2/NAIA/JUCO) are pure upside for low income.
    scores.D1.score += 10;
    scores.D2.score += 16;
    scores.NAIA.score += 14;
    scores.JUCO.score += 12;
    scores.D2.reasons.push(
      "Partial athletic $ at D2 can stack with Pell + state + need aid → close to a full ride."
    );
    scores.NAIA.reasons.push("NAIA athletic + academic aid stacks well for low-income families.");
    scores.JUCO.reasons.push("Lowest cost of entry; Pell often covers most of a JUCO year.");

    // D3 has NO athletic $, BUT meets-full-need D3s can be cheapest of all —
    // and that leverage grows with academic strength.
    if (academics.academicStrength === "strong") {
      scores.D3.score += 20;
      scores.D3.reasons.push(
        "Strong grades + low income = elite 'meets-full-need' D3s can be nearly FREE (need aid + merit). Often cheaper than a partial D2 scholarship."
      );
    } else if (academics.academicStrength === "good") {
      scores.D3.score += 10;
      scores.D3.reasons.push(
        "Good grades open need-based aid at many D3s — remember D3 gives no athletic money, so grades ARE your scholarship."
      );
    } else {
      scores.D3.reasons.push(
        "D3 gives no athletic money and your aid would be need-based only — raise grades to unlock it, or lean on athletic-scholarship divisions."
      );
    }
  }

  // In-state public preference boosts affordable public options broadly
  if (finances.inStatePreference) {
    scores.D1.reasons.push("Favor IN-STATE public D1s — in-state tuition + state grants cut cost sharply.");
    scores.D2.score += 4;
    scores.JUCO.score += 6;
  }

  // Not willing to relocate shrinks D1 realism (national recruiting)
  if (!finances.willingToRelocate) {
    scores.D1.score -= 6;
    scores.D1.reasons.push("Limited willingness to relocate narrows D1 options (D1 recruiting is national).");
  }

  // --- Academic eligibility risk can gate NCAA divisions ---
  if (academics.eligibilityRisk === "high") {
    scores.D1.score -= 20;
    scores.D2.score -= 10;
    scores.JUCO.score += 14;
    scores.JUCO.reasons.push(
      "Current grades put NCAA eligibility at risk → JUCO first lets your athlete play, rebuild grades, and transfer up on scholarship."
    );
    scores.NAIA.score += 6;
    scores.NAIA.reasons.push("NAIA eligibility rules are generally more flexible than NCAA D1.");
  } else if (academics.eligibilityRisk === "medium") {
    scores.D1.score -= 8;
    scores.JUCO.score += 6;
  }

  // Build sorted list
  return Object.entries(scores)
    .map(([key, v]) => ({ key, score: Math.round(v.score), reasons: v.reasons }))
    .sort((x, y) => y.score - x.score);
}

/*
 * Pick schools for the shortlist, bucketed Reach/Target/Safety.
 * The KEY idea: the family's income tier changes WHICH schools score well, not
 * just how the list is filtered — so changing income/grades visibly reshuffles
 * the results.
 */
function buildShortlist(rankedDivisions, tier, academics, finances, a) {
  const topDivisions = rankedDivisions.slice(0, 3).map((d) => d.key);
  const preferred = finances.preferredRegion;

  // Candidate pool: schools in the recommended divisions.
  let pool = SCHOOLS.filter((s) => topDivisions.includes(s.division));

  // If they won't relocate, narrow to the region they want to attend in.
  // Fall back gracefully if that leaves too few to fill a useful list.
  let singleRegion = false;
  if (!finances.willingToRelocate && preferred) {
    const regional = pool.filter((s) => s.region === preferred);
    if (regional.length >= 6) {
      pool = regional;
      singleRegion = true;
    }
  }

  const strong = academics.academicStrength === "strong";
  const good = academics.academicStrength === "good";

  // Score each school for fit — income tier drives the affordability weighting.
  const scored = pool.map((s) => {
    const facts = DIVISION_FACTS[s.division];
    let fit = 0;
    const reasons = [];

    if (finances.incomeTier === "low") {
      if (s.lowIncomeAffordability === "high") { fit += 3; }
      else if (s.lowIncomeAffordability === "medium") { fit += 1; }
      if (s.meetsFullNeed) { fit += 3; reasons.push("meets 100% of need"); }
      if (facts.athleticScholarships) { fit += 1; reasons.push("athletic aid can stack with your need aid"); }
    } else if (finances.incomeTier === "middle") {
      if (s.lowIncomeAffordability === "high") { fit += 2; }
      if (s.meritAid) { fit += 3; reasons.push("strong merit scholarships"); }
      if (s.meetsFullNeed) { fit += 1; }
      if (facts.athleticScholarships) { fit += 1; }
      if (s.type === "public" && s.region === preferred) { fit += 1; reasons.push("affordable public option"); }
    } else {
      // high income: need aid won't help much; reward merit + athletic value.
      if (s.meritAid) { fit += 3; reasons.push("merit/academic scholarships"); }
      if (facts.athleticScholarships) { fit += 2; reasons.push("athletic scholarship potential"); }
      if (s.type === "public") { fit += 1; reasons.push("public-school value"); }
      // full-need schools give a high earner little, so no bonus here.
    }

    // Region + in-state preferences (apply for everyone).
    if (preferred && s.region === preferred) fit += 2;
    if (finances.inStatePreference && s.type === "public" && s.state === (a.homeState || "").toUpperCase()) {
      fit += 3; reasons.push("in-state public tuition");
    }

    // Selectivity vs academic strength decides reach/target/safety.
    const sel = s.selectivity;
    let bucket;
    if (sel === "highly-selective") bucket = strong ? "target" : "reach";
    else if (sel === "selective") bucket = strong ? "safety" : good ? "target" : "reach";
    else if (sel === "moderate") bucket = good || strong ? "safety" : "target";
    else bucket = "safety"; // open admission

    return { ...s, fit, fitReasons: reasons, bucket };
  });

  // Sort each bucket by fit (tie-break by name for stable, varied output).
  const byBucket = { reach: [], target: [], safety: [] };
  scored
    .sort((x, y) => y.fit - x.fit || x.name.localeCompare(y.name))
    .forEach((s) => byBucket[s.bucket].push(s));

  // In a nationwide search, spread picks across regions so the list doesn't
  // clump in one part of the country. When the user locked to one region, keep
  // the straight fit ordering.
  const finalize = (list, n) =>
    (singleRegion ? list : spreadByRegion(list)).slice(0, n);

  return {
    reach: finalize(byBucket.reach, 5),
    target: finalize(byBucket.target, 6),
    safety: finalize(byBucket.safety, 6),
  };
}

/*
 * Reorder a fit-sorted list so regions are interleaved (round-robin). Each
 * region's internal fit order is preserved, so we still surface the best of
 * each region first — just balanced across the country.
 */
function spreadByRegion(list) {
  const groups = {};
  list.forEach((s) => {
    (groups[s.region] = groups[s.region] || []).push(s);
  });
  const regions = Object.keys(groups);
  const out = [];
  let pulled = true;
  while (pulled) {
    pulled = false;
    for (const r of regions) {
      if (groups[r].length) {
        out.push(groups[r].shift());
        pulled = true;
      }
    }
  }
  return out;
}

/* Personalized action checklist. */
function buildChecklist(tier, academics, finances, a) {
  const items = [];

  // Universal, ordered by urgency
  items.push({
    done: false,
    text:
      "Register with the NCAA Eligibility Center (eligibilitycenter.org). " +
      (finances.lowIncome
        ? "Ask your counselor for the FEE WAIVER — free/reduced-lunch students don't pay."
        : "Required to compete at D1/D2."),
  });

  if (a.grade === "12" || a.grade === "11") {
    items.push({ done: false, text: "File the FAFSA as soon as it opens (Oct 1) — it's the key to Pell + state + institutional aid." });
  } else {
    items.push({ done: false, text: "Plan to file the FAFSA in the fall of junior/senior year — mark your calendar now." });
  }

  if (a.hasFilm !== "yes") {
    items.push({ done: false, text: "Build a 3–5 minute HIGHLIGHT film (best plays first) + a full-game link. No film = no recruiting. Free tools like Hudl or a phone + free editor work." });
  }

  items.push({
    done: false,
    text:
      "Email coaches directly at your top " +
      (finances.willingToRelocate ? "20–30" : "10–15") +
      " target schools: short intro, position, height, grad year, GPA, key stats, film link, and your game schedule. Personalize each one.",
  });

  if (academics.eligibilityRisk !== "low") {
    items.push({ done: false, text: "Meet your school counselor about NCAA CORE COURSES and a grade-recovery plan — protect eligibility before it's too late." });
  }

  if (academics.testScores === "none") {
    items.push({ done: false, text: "Sign up for one SAT or ACT (fee waiver if low income). Even at test-optional schools, a score can unlock merit money." });
  }

  items.push({ done: false, text: "Run the NET PRICE CALCULATOR on each target school's website — this gives YOUR real cost, not the sticker price. Do this before falling in love with any school." });

  items.push({ done: false, text: "Attend 1–2 ID camps / showcases at target schools where budget allows (many offer need-based camp fee waivers — just ask the coach)." });

  return items;
}

/* Top-level entry point. */
function generateRecommendation(answers) {
  const score = computeAthleticScore(answers);
  const tier = athleticTier(score);
  const academics = assessAcademics(answers);
  const finances = assessFinances(answers);
  const rankedDivisions = rankDivisions(tier, academics, finances, answers);
  const shortlist = buildShortlist(rankedDivisions, tier, academics, finances, answers);
  const checklist = buildChecklist(tier, academics, finances, answers);

  return {
    athleticScore: score,
    tier,
    academics,
    finances,
    rankedDivisions,
    shortlist,
    checklist,
  };
}
