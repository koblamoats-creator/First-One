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

/* Map a raw athletic score to a tier label.
 * This tool is built for athletes who are NOT elite D1 recruits, so the labels
 * top out at "strong D2 / NAIA" — D1 is only ever surfaced separately, and only
 * when the athlete already has real D1 offers. */
function athleticTier(score) {
  if (score >= 78) return { key: "elite", label: "Top of this tool's range — strong D2 / NAIA fit" };
  if (score >= 58) return { key: "high", label: "College-ready — great fit for D2, NAIA & strong D3" };
  if (score >= 38) return { key: "solid", label: "Solid fit for D3, NAIA & JUCO" };
  return { key: "developing", label: "Best path: JUCO or prep school, then move up" };
}

/* Position group for size guidelines. */
function positionGroup(pos) {
  if (pos === "pg" || pos === "sg") return "guard";
  if (pos === "sf") return "wing";
  if (pos === "pf" || pos === "c") return "big";
  return null;
}

/* Format inches as feet'inches". */
function formatHeight(inches) {
  const ft = Math.floor(inches / 12);
  const inch = inches % 12;
  return ft + "'" + inch + '"';
}

/*
 * Position-relative size read. Returns the highest level where height is NOT a
 * headwind, a d1Headwind flag, and an encouraging, honest note. Returns null if
 * height/position weren't provided.
 */
function assessSize(a) {
  const h = parseInt(a.height, 10);
  const grp = positionGroup(a.position);
  if (!h || !grp) return null;

  const mins = SIZE_MIN[grp];
  const grpLabel = { guard: "guard", wing: "wing", big: "post player" }[grp];
  let ceiling, tone, note;

  if (h >= mins.D1) {
    ceiling = "D1";
    tone = "plus";
    note = `At ${formatHeight(h)}, size is an asset for a ${grpLabel} at every level. If the skill and recruiting activity are there, size won't hold you back.`;
  } else if (h >= mins.D2) {
    ceiling = "D2";
    tone = "neutral";
    note = `At ${formatHeight(h)}, size fits well at D2, D3, and NAIA for a ${grpLabel}. D1 is a tougher size match — possible with standout skill, but D2-and-below is the realistic target.`;
  } else if (h >= mins.D3) {
    ceiling = "D3";
    tone = "neutral";
    note = `At ${formatHeight(h)}, D3, NAIA, and JUCO are realistic size fits for a ${grpLabel}. To play up a level, elite skill, quickness, or shooting has to make up for size.`;
  } else {
    ceiling = "below";
    tone = "headwind";
    note = `At ${formatHeight(h)}, height is a real headwind for a ${grpLabel} — but undersized players DO earn spots with elite handle, speed, and shooting. Target D3, NAIA, and JUCO, lean into skill, and let film do the talking.`;
  }

  return { heightIn: h, group: grp, ceiling, tone, d1Headwind: h < mins.D1, note };
}

/*
 * Compute a 0-100 athletic score.
 *
 * ANTI-INFLATION DESIGN: parents naturally overrate their own kids, so we do
 * NOT ask them to judge talent. Every input here is an OBJECTIVE, verifiable
 * fact a coach would recognize — playing role, when they made varsity, AAU
 * circuit level, official honors, and (weighted heaviest) actual recruiting
 * activity and a neutral evaluator's read. Then reality caps keep the result
 * honest for the athlete's grade.
 */
function computeAthleticScore(a) {
  let s = 0;

  // Current role on the team — a fact, not an opinion (0-22)
  s += ({
    startVarsity: 22,
    rotationVarsity: 14,
    benchVarsity: 8,
    jv: 4,
    none: 0,
  }[a.playingLevel] || 0);

  // When they FIRST made varsity — timing is a strong talent signal (0-10)
  s += ({
    fresh: 10,
    soph: 8,
    junior: 4,
    senior: 2,
    na: 0,
  }[a.madeVarsity] || 0);

  // Club / AAU circuit — verifiable exposure level (0-16)
  s += ({
    nationalCircuit: 16,
    regional: 10,
    local: 5,
    none: 0,
  }[a.clubLevel] || 0);

  // Objective honors earned (0-14)
  s += ({
    stateOrNational: 14,
    allConfRegion: 9,
    teamHonor: 4,
    none: 0,
  }[a.accolades] || 0);

  // Actual recruiting activity — the SINGLE most reliable reality signal (0-26)
  s += ({
    writtenD1D2: 26,
    verbalOrD3: 16,
    campInvites: 7,
    none: 0,
  }[a.offers] || 0);

  // A NEUTRAL evaluator's division read — counters parent bias directly (0-12)
  s += ({
    d1d2: 12,
    d3naia: 7,
    noEval: 0,
  }[a.coachEval] || 0);

  // Younger athletes with a real foundation get runway credit (small, capped)
  if ((a.grade === "9" || a.grade === "10") && s > 35) s += 6;

  s = Math.max(0, Math.min(100, s));

  // --- REALITY CAPS (the honesty guardrail) -------------------------------
  // D1/D2 recruiting is largely done by the end of junior year. An 11th/12th
  // grader with ZERO recruiting activity and no neutral D1/D2 read cannot
  // realistically be scored "elite/D1", no matter how the other boxes look.
  const olderClass = a.grade === "11" || a.grade === "12" || a.grade === "postgrad";
  const noRecruiting = (a.offers === "none" || !a.offers);
  const noHighEval = a.coachEval !== "d1d2";

  const caps = [];
  if (olderClass && noRecruiting && noHighEval) {
    if (s > 61) { s = 61; caps.push("no-recruiting-junior-senior"); }
  }
  if (a.grade === "12" && noRecruiting && a.coachEval === "noEval") {
    if (s > 45) { s = 45; caps.push("senior-no-signals"); }
  }

  return { score: s, caps };
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
function rankDivisions(tier, academics, finances, a, size) {
  const scores = {
    D1: { score: 0, reasons: [] },
    D2: { score: 0, reasons: [] },
    D3: { score: 0, reasons: [] },
    NAIA: { score: 0, reasons: [] },
    JUCO: { score: 0, reasons: [] },
  };

  // --- Athletic realism drives the base score ---
  // This tool serves NON-elite athletes, so D1 starts at ZERO for everyone. It
  // is only added back below if the athlete already has genuine D1 activity.
  const tierWeights = {
    elite: { D1: 0, D2: 40, NAIA: 32, D3: 26, JUCO: 14 },
    high: { D1: 0, D2: 40, NAIA: 34, D3: 30, JUCO: 20 },
    solid: { D1: 0, D2: 22, NAIA: 30, D3: 38, JUCO: 26 },
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

  // --- D1 is NOT a target for this tool's audience unless the athlete ALREADY
  // has real D1 activity (a written D1/D2 offer or a neutral D1/D2 evaluation).
  // Only then do we acknowledge it as a pathway. ---
  if (a.offers === "writtenD1D2" || a.coachEval === "d1d2") {
    scores.D1.score += 40;
    scores.D1.reasons.push(
      "You already have D1-level interest — pursue those specific D1 programs directly (this is rare, and it's a good sign)."
    );
  } else {
    scores.D1.reasons.push(
      "D1 isn't a recruiting target here: D1 coaches recruit early and directly, so without an existing D1 offer your realistic, higher-opportunity paths are D2, NAIA, D3, and JUCO."
    );
  }

  // --- Position-relative SIZE realism: height is a real gate at D1, far less so
  // below it (where skill and speed matter more). Undersized players get pushed
  // toward the levels where they genuinely thrive. ---
  if (size && size.d1Headwind) {
    scores.D1.score -= size.ceiling === "below" ? 16 : 10;
    scores.D1.reasons.push(
      `At ${formatHeight(size.heightIn)} for a ${size.group}, D1 size expectations are a headwind — the realistic target is D2 and below.`
    );
    scores.D2.score += size.ceiling === "below" ? 4 : 8;
    scores.D3.score += 8;
    scores.NAIA.score += 8;
    scores.JUCO.score += size.ceiling === "below" ? 8 : 4;
    scores.D3.reasons.push("Size fits comfortably at D3/NAIA — coaches here prize skill and basketball IQ over pure height.");
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
 * Income-aware affordability verdict for a single school. Returns { tone, text }
 * where tone is 'good' | 'ok' | 'warn'. This makes the SAME school read
 * differently depending on the family's income — the clearest signal that the
 * tool is responding to money, not just admissions.
 */
function affordabilityVerdict(s, finances, inStatePublic) {
  const athletic = DIVISION_FACTS[s.division].athleticScholarships;
  const tier = finances.incomeTier;

  if (tier === "low") {
    if (s.meetsFullNeed) return { tone: "good", text: "Likely near-free — meets 100% of your need" };
    if (inStatePublic) return { tone: "good", text: "Very affordable — in-state tuition + Pell + state grants" };
    if (athletic && s.lowIncomeAffordability === "high") return { tone: "good", text: "Low cost if you earn athletic $ and stack Pell" };
    if (s.lowIncomeAffordability === "high") return { tone: "ok", text: "Affordable with Pell + state grants" };
    return { tone: "ok", text: "Moderate — combine any athletic $ with Pell; check the net price calculator" };
  }

  if (tier === "high") {
    if (inStatePublic) return { tone: "good", text: "Best value: in-state public tuition" };
    if (s.meritAid && athletic) return { tone: "good", text: "Discountable via merit and/or athletic scholarships" };
    if (s.meritAid) return { tone: "ok", text: "Discounted via merit scholarships (need aid won't apply)" };
    if (athletic) return { tone: "ok", text: "Value depends on the athletic scholarship offer" };
    if (s.meetsFullNeed) return { tone: "warn", text: "Expect near full sticker — need aid won't help at your income" };
    return { tone: "warn", text: "Likely full price — compare net price calculators carefully" };
  }

  // middle income
  if (inStatePublic) return { tone: "good", text: "Strong value: in-state public tuition + some aid" };
  if (s.meritAid) return { tone: "good", text: "Merit scholarships are your biggest lever here" };
  if (s.meetsFullNeed) return { tone: "ok", text: "May meet part of your need — run the net price calculator" };
  if (athletic) return { tone: "ok", text: "Partial athletic $ + some aid can add up" };
  return { tone: "ok", text: "Mixed — check the net price calculator for your number" };
}

/*
 * Pick schools for the shortlist, bucketed Reach/Target/Safety.
 * The KEY idea: the family's income tier changes WHICH schools score well AND
 * which are filtered out — so changing income visibly reshuffles the results.
 */
function buildShortlist(rankedDivisions, tier, academics, finances, a) {
  const topDivisions = rankedDivisions.slice(0, 3).map((d) => d.key);
  const preferred = finances.preferredRegion;

  const homeState = (a.homeState || "").toUpperCase();
  const isInStatePublic = (s) => s.type === "public" && s.state === homeState;

  // Candidate pool: schools in the recommended divisions.
  let pool = SCHOOLS.filter((s) => topDivisions.includes(s.division));

  // --- STEP 1: Region is a HARD constraint. A family that won't relocate must
  // never be shown schools in another region. Apply this BEFORE income filtering
  // so income filtering can never leak in out-of-region schools. ---
  let singleRegion = false;
  if (!finances.willingToRelocate && preferred) {
    const regional = pool.filter((s) => s.region === preferred);
    if (regional.length >= 6) {
      pool = regional;
      singleRegion = true;
    }
  }

  // --- STEP 2: Income-tier POOL FILTER. This is what makes the SCHOOL LIST (not
  // just the money note) genuinely change with income. If it would leave too few
  // schools to build a useful list, we RELAX it (keep the region intact and let
  // fit ordering + affordability verdicts do the work) rather than break region. ---
  const incomeKeeps = (s) => {
    const athletic = DIVISION_FACTS[s.division].athleticScholarships;
    if (finances.incomeTier === "high") {
      // Need-only privates are full sticker for a high earner → drop.
      const needOnlyPrivate = s.type === "private" && s.meetsFullNeed && !s.meritAid && !athletic;
      return !needOnlyPrivate;
    }
    if (finances.incomeTier === "low") {
      // Target genuinely affordable schools: meets-full-need or highly affordable.
      return s.meetsFullNeed || s.lowIncomeAffordability === "high";
    }
    // middle: drop the very-expensive need-only privates.
    const needOnlyPrivate =
      s.type === "private" && s.meetsFullNeed && !s.meritAid && !athletic &&
      s.lowIncomeAffordability !== "high";
    return !needOnlyPrivate;
  };
  const incomeFiltered = pool.filter(incomeKeeps);
  if (incomeFiltered.length >= 5) pool = incomeFiltered; // else relax, keep region

  const strong = academics.academicStrength === "strong";
  const good = academics.academicStrength === "good";

  // Score each school for fit — income tier drives the affordability weighting.
  const scored = pool.map((s) => {
    const facts = DIVISION_FACTS[s.division];
    let fit = 0;
    const reasons = [];
    const inStatePublic = isInStatePublic(s);

    if (finances.incomeTier === "low") {
      if (s.lowIncomeAffordability === "high") { fit += 3; }
      else if (s.lowIncomeAffordability === "medium") { fit += 1; }
      if (s.meetsFullNeed) { fit += 4; reasons.push("meets 100% of need — can be near-free for you"); }
      if (facts.athleticScholarships) { fit += 1; reasons.push("athletic aid can stack with your Pell/state grants"); }
      if (inStatePublic) { fit += 2; reasons.push("in-state public tuition"); }
    } else if (finances.incomeTier === "middle") {
      if (s.lowIncomeAffordability === "high") { fit += 2; }
      if (s.meritAid) { fit += 3; reasons.push("strong merit scholarships"); }
      if (s.meetsFullNeed) { fit += 2; reasons.push("may still meet part of your need"); }
      if (facts.athleticScholarships) { fit += 1; }
      if (inStatePublic) { fit += 3; reasons.push("in-state public tuition"); }
    } else {
      // HIGH income: need aid won't help; reward merit, in-state public, athletic.
      if (s.meritAid) { fit += 4; reasons.push("merit/academic scholarships (not income-based)"); }
      if (inStatePublic) { fit += 4; reasons.push("in-state public tuition — your best value lever"); }
      else if (s.type === "public") { fit += 1; }
      if (facts.athleticScholarships) { fit += 2; reasons.push("athletic scholarship is your other discount lever"); }
      // A higher-income family rarely starts at a two-year college by choice.
      if (s.division === "JUCO") { fit -= 4; }
      // meetsFullNeed gives a high earner nothing → no bonus.
    }

    // Region preference (applies for everyone).
    if (preferred && s.region === preferred) fit += 2;
    // Explicit in-state preference is an extra nudge on top of the value above.
    if (finances.inStatePreference && inStatePublic) fit += 2;

    // Selectivity vs academic strength decides reach/target/safety.
    const sel = s.selectivity;
    let bucket;
    if (sel === "highly-selective") bucket = strong ? "target" : "reach";
    else if (sel === "selective") bucket = strong ? "safety" : good ? "target" : "reach";
    else if (sel === "moderate") bucket = good || strong ? "safety" : "target";
    else bucket = "safety"; // open admission

    const verdict = affordabilityVerdict(s, finances, inStatePublic);
    return { ...s, fit, fitReasons: reasons, bucket, verdict };
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

  // If there's little OUTSIDE validation, the #1 priority is getting an honest,
  // independent read — before spending time/money on a target list.
  const weakSignals = (a.offers === "none" || !a.offers) && a.coachEval !== "d1d2";
  if (weakSignals) {
    items.push({
      done: false,
      text:
        "GET AN INDEPENDENT EVALUATION FIRST. Sign up for a college ID camp, a ranked showcase (e.g. an NCSA/verified event), or ask a non-parent coach or trainer for an honest division read. This confirms your athlete's true level so the rest of this plan targets the right schools.",
    });
  }

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

/*
 * Reality check — the honesty layer. Measures how much OUTSIDE validation the
 * profile has (parent opinion is deliberately excluded from scoring), states
 * the base-rate odds, and tells the family how to get a true read.
 */
function buildRealityCheck(a, scoreObj, size) {
  const funnel = RECRUITING_FUNNEL[a.gender === "womens" ? "womens" : "mens"];
  const messages = [];
  const capped = scoreObj.caps.length > 0;

  // The core framing of this whole tool: true D1 players already know.
  // (The position-relative size note is shown separately in its own line.)
  messages.push(
    "Who this tool is for: if your athlete were a lock D1 recruit, college coaches would almost certainly already be calling — that's how D1 works. This tool is built for the far more common (and hopeful!) situation: a good player who ISN'T sure where they fit. Your best real opportunities are usually D2, D3, NAIA, and JUCO — and those are excellent places to play, get an education, and even move up from."
  );

  // Count OBJECTIVE, external signals (nothing here is parent judgment).
  let ext = 0;
  if (a.offers === "writtenD1D2") ext += 3;
  else if (a.offers === "verbalOrD3") ext += 2;
  else if (a.offers === "campInvites") ext += 1;
  if (a.coachEval === "d1d2") ext += 2;
  else if (a.coachEval === "d3naia") ext += 1;
  if (a.accolades === "stateOrNational") ext += 2;
  else if (a.accolades === "allConfRegion") ext += 1;
  if (a.clubLevel === "nationalCircuit") ext += 1;

  const validation = ext >= 4 ? "strong" : ext >= 2 ? "some" : "little";

  if (capped) {
    messages.push(
      "We've held this estimate to a realistic ceiling for your athlete's grade. D1/D2 coaches do most of their recruiting by the end of junior year, and there's no college-coach activity on this profile yet — so a higher result wouldn't be honest. The encouraging part: JUCO, D3, and NAIA are wide open and regularly lead to moving up."
    );
  }

  if (validation === "little") {
    messages.push(
      "This estimate rests mostly on in-program facts with little OUTSIDE evaluation yet — and coaches, not parents, decide recruiting. The fastest way to a true read is an independent evaluation: a college ID camp, a ranked showcase, or an honest sit-down with a non-parent coach or trainer. Treat the level above as a hopeful ceiling until an outsider confirms it."
    );
  } else if (validation === "some") {
    messages.push(
      "You have some outside validation. Keep stacking objective evidence — showcases, camps, neutral coach evaluations — to confirm the level before committing time and money to a target list."
    );
  } else {
    messages.push(
      "Strong outside validation is on this profile — real coach activity and honors. That makes the estimate more trustworthy than most. Keep the evidence current."
    );
  }

  return { funnel, validation, capped, messages };
}

/* Top-level entry point. */
function generateRecommendation(answers) {
  const scoreObj = computeAthleticScore(answers);
  const tier = athleticTier(scoreObj.score);
  const size = assessSize(answers);
  const academics = assessAcademics(answers);
  const finances = assessFinances(answers);
  const realityCheck = buildRealityCheck(answers, scoreObj, size);
  const rankedDivisions = rankDivisions(tier, academics, finances, answers, size);
  const shortlist = buildShortlist(rankedDivisions, tier, academics, finances, answers);
  const checklist = buildChecklist(tier, academics, finances, answers);

  return {
    athleticScore: scoreObj.score,
    scoreCaps: scoreObj.caps,
    tier,
    size,
    realityCheck,
    academics,
    finances,
    rankedDivisions,
    shortlist,
    checklist,
  };
}
