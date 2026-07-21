/*
 * app.js
 * Wizard UI: renders steps, collects answers, and renders results.
 */

/* ------------------------------------------------------------------ *
 * Questionnaire definition — grouped into 5 steps.
 * type: 'radio' | 'select' | 'number'
 * ------------------------------------------------------------------ */

/* Height dropdown options (4'8" to 7'0"), stored as inches. */
const HEIGHT_OPTIONS = (() => {
  const opts = [["", "Select…"]];
  for (let i = 56; i <= 84; i++) {
    opts.push([String(i), Math.floor(i / 12) + "'" + (i % 12) + '"']);
  }
  return opts;
})();

const STEPS = [
  {
    title: "The Player",
    intro: "Basic facts about your athlete.",
    questions: [
      {
        id: "grade", label: "What grade is your athlete in?", type: "radio",
        options: [
          ["9", "9th"], ["10", "10th"], ["11", "11th"], ["12", "12th"], ["postgrad", "Grad / gap year"],
        ],
      },
      {
        id: "gender", label: "Athlete's basketball program", type: "radio",
        options: [["mens", "Men's"], ["womens", "Women's"]],
      },
      {
        id: "position", label: "Primary position", type: "select",
        options: [
          ["", "Select…"], ["pg", "Point guard"], ["sg", "Shooting guard"],
          ["sf", "Small forward"], ["pf", "Power forward"], ["c", "Center"],
        ],
      },
      {
        id: "height", label: "Height (recruiting is about size FOR your position)", type: "select",
        options: HEIGHT_OPTIONS,
      },
      {
        id: "region", label: "Which region do you most want to attend college in?", type: "select",
        options: [
          ["", "Select…"], ["NE", "Northeast"], ["SE", "Southeast"],
          ["MW", "Midwest"], ["SW", "Southwest"], ["W", "West"],
        ],
      },
      {
        id: "homeState", label: "Home state (2-letter, e.g. TX)", type: "text",
        placeholder: "TX", maxlength: 2,
      },
    ],
  },
  {
    title: "The Game — an honest evaluation",
    intro:
      "We won't ask you to rate how good your athlete is — every parent (rightly!) loves their kid, and it's easy to be off by a level. Instead we ask only for FACTS a college coach can verify. That's what makes the result realistic.",
    questions: [
      {
        id: "playingLevel", label: "Right now, what is your athlete's role on their school team?", type: "radio",
        options: [
          ["startVarsity", "Starts on varsity"],
          ["rotationVarsity", "Plays regular minutes on varsity (rotation)"],
          ["benchVarsity", "On varsity, but limited minutes"],
          ["jv", "JV / freshman team"],
          ["none", "Not on a school team yet"],
        ],
      },
      {
        id: "madeVarsity", label: "When did they FIRST make varsity? (recruiting timing matters)", type: "radio",
        options: [
          ["fresh", "9th grade"],
          ["soph", "10th grade"],
          ["junior", "11th grade"],
          ["senior", "12th grade"],
          ["na", "Not on varsity yet"],
        ],
      },
      {
        id: "clubLevel", label: "Highest level of club / AAU / travel ball played", type: "radio",
        options: [
          ["nationalCircuit", "National circuit (Nike EYBL, Adidas 3SSB, UAA)"],
          ["regional", "Regional travel team"],
          ["local", "Local club only"],
          ["none", "No club / AAU"],
        ],
      },
      {
        id: "accolades", label: "Highest OFFICIAL honor earned (not a personal opinion)", type: "radio",
        options: [
          ["stateOrNational", "All-state or a national/state recruiting ranking"],
          ["allConfRegion", "All-conference or all-region selection"],
          ["teamHonor", "Team captain / team MVP"],
          ["none", "None yet"],
        ],
      },
      {
        id: "offers", label: "Actual college recruiting activity so far (the biggest reality signal)", type: "radio",
        options: [
          ["writtenD1D2", "Written scholarship offer(s) from D1/D2 programs"],
          ["verbalOrD3", "Verbal interest, D3/NAIA offers, or direct coach contact"],
          ["campInvites", "Camp / showcase invites only"],
          ["none", "No college coach has made contact yet"],
        ],
      },
      {
        id: "coachEval", label: "Has a NEUTRAL evaluator (a coach/trainer/recruiting service who is NOT the parent) told you a realistic level?", type: "radio",
        options: [
          ["d1d2", "Yes — they said D1/D2"],
          ["d3naia", "Yes — they said D3 / NAIA / JUCO"],
          ["noEval", "No neutral evaluation yet"],
        ],
      },
      {
        id: "hasFilm", label: "Do you have a highlight film?", type: "radio",
        options: [
          ["yes", "Yes — edited highlight video"],
          ["building", "Building one now"],
          ["no", "Not yet"],
        ],
      },
    ],
  },
  {
    title: "The Grades",
    intro: "Grades protect eligibility AND unlock real scholarship money.",
    questions: [
      {
        id: "gpa", label: "Current GPA (unweighted, 0.0–4.0)", type: "number",
        placeholder: "3.2", min: 0, max: 5, step: 0.1,
      },
      {
        id: "testScores", label: "SAT / ACT status", type: "radio",
        options: [
          ["strong", "Taken — strong score"],
          ["taken", "Taken — average score"],
          ["planned", "Planned, not yet taken"],
          ["none", "None"],
        ],
      },
      {
        id: "coreCourses", label: "NCAA core-course progress (16 required courses)", type: "radio",
        options: [
          ["onTrack", "On track"],
          ["behind", "Behind / need to catch up"],
          ["unsure", "Not sure what this is"],
        ],
      },
    ],
  },
  {
    title: "The Budget",
    intro: "This is the heart of it — we'll target schools your family can actually afford.",
    questions: [
      {
        id: "income", label: "Approximate household income", type: "radio",
        options: [
          ["under30", "Under $30,000"],
          ["30to60", "$30,000 – $60,000"],
          ["60to100", "$60,000 – $100,000"],
          ["over100", "Over $100,000"],
          ["skip", "Prefer not to say"],
        ],
      },
      {
        id: "pellEligible", label: "Do you expect to qualify for federal need-based aid (Pell Grant)?", type: "radio",
        options: [["yes", "Yes / likely"], ["no", "No"], ["unsure", "Not sure"]],
      },
      {
        id: "reducedLunch", label: "Is your athlete on free or reduced-price school lunch?", type: "radio",
        options: [["yes", "Yes"], ["no", "No"]],
      },
      {
        id: "maxOutOfPocket", label: "Realistic max your family can pay per year (after aid)", type: "radio",
        options: [
          ["under5", "Under $5,000"],
          ["5to15", "$5,000 – $15,000"],
          ["15to30", "$15,000 – $30,000"],
          ["flexible", "Flexible / depends on the school"],
        ],
      },
    ],
  },
  {
    title: "Preferences",
    intro: "Last step — let's narrow the map.",
    questions: [
      {
        id: "inState", label: "Prefer to stay in-state (usually cheaper at public schools)?", type: "radio",
        options: [["yes", "Yes, prefer in-state"], ["no", "No preference"]],
      },
      {
        id: "relocate", label: "Willing to relocate / travel far for the right opportunity?", type: "radio",
        options: [["yes", "Yes, open to anywhere"], ["no", "Prefer to stay close to home"]],
      },
      {
        id: "priority", label: "What matters most in the decision?", type: "radio",
        options: [
          ["athletics", "Playing time & the highest level possible"],
          ["balance", "A balance of basketball and academics"],
          ["academics", "Academics & long-term career first"],
          ["cost", "Lowest cost / least debt"],
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * State
 * ------------------------------------------------------------------ */
const answers = {};
let currentStep = 0;

const el = (id) => document.getElementById(id);

/* ------------------------------------------------------------------ *
 * View switching
 * ------------------------------------------------------------------ */
function showView(id) {
  document.querySelectorAll("main .card").forEach((c) => c.classList.remove("active-view"));
  el(id).classList.add("active-view");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ------------------------------------------------------------------ *
 * Render a step
 * ------------------------------------------------------------------ */
function renderStep() {
  const step = STEPS[currentStep];
  el("stepTotal").textContent = STEPS.length;
  el("stepNum").textContent = currentStep + 1;
  el("progressBar").style.width = ((currentStep + 1) / STEPS.length) * 100 + "%";

  let html = `<h2 class="step-title">${step.title}</h2><p class="step-intro">${step.intro}</p>`;

  step.questions.forEach((q) => {
    html += `<fieldset class="q" data-qid="${q.id}"><legend>${q.label}</legend>`;
    if (q.type === "radio") {
      html += `<div class="options">`;
      q.options.forEach(([val, text]) => {
        const checked = answers[q.id] === val ? "checked" : "";
        html += `
          <label class="opt">
            <input type="radio" name="${q.id}" value="${val}" ${checked}/>
            <span>${text}</span>
          </label>`;
      });
      html += `</div>`;
    } else if (q.type === "select") {
      html += `<select name="${q.id}">`;
      q.options.forEach(([val, text]) => {
        const sel = answers[q.id] === val ? "selected" : "";
        html += `<option value="${val}" ${sel}>${text}</option>`;
      });
      html += `</select>`;
    } else if (q.type === "number") {
      html += `<input type="number" name="${q.id}" value="${answers[q.id] || ""}"
        placeholder="${q.placeholder || ""}" min="${q.min}" max="${q.max}" step="${q.step}" inputmode="decimal"/>`;
    } else if (q.type === "text") {
      html += `<input type="text" name="${q.id}" value="${answers[q.id] || ""}"
        placeholder="${q.placeholder || ""}" maxlength="${q.maxlength || 40}"/>`;
    }
    html += `</fieldset>`;
  });

  el("stepContainer").innerHTML = html;
  el("backBtn").style.visibility = currentStep === 0 ? "hidden" : "visible";
  el("nextBtn").textContent = currentStep === STEPS.length - 1 ? "See my results" : "Next";
}

/* Save current step's inputs into `answers`. */
function saveStep() {
  const container = el("stepContainer");
  container.querySelectorAll("input, select").forEach((input) => {
    if (input.type === "radio") {
      if (input.checked) answers[input.name] = input.value;
    } else {
      let v = input.value.trim();
      if (input.name === "homeState") v = v.toUpperCase();
      if (v !== "") answers[input.name] = v;
    }
  });
}

/* ------------------------------------------------------------------ *
 * Results rendering
 * ------------------------------------------------------------------ */
function divisionCard(rank, d, index) {
  const facts = DIVISION_FACTS[d.key];
  const topBadge = index === 0 ? `<span class="badge best">Best fit for you</span>` : "";
  const schol = facts.athleticScholarships
    ? `<span class="pill yes">Athletic $ available</span>`
    : `<span class="pill no">No athletic $ (need/merit aid only)</span>`;
  return `
    <div class="division-card ${index === 0 ? "top" : ""}">
      <div class="division-head">
        <h4>${index + 1}. ${facts.name} ${topBadge}</h4>
        ${schol}
      </div>
      <p class="division-scholnote">${facts.scholarshipNote}</p>
      <p class="division-afford"><strong>For your budget:</strong> ${facts.affordabilityForLowIncome}</p>
      <details>
        <summary>Why this ranking for your athlete</summary>
        <ul>${d.reasons.map((r) => `<li>${r}</li>`).join("")}</ul>
      </details>
    </div>`;
}

function schoolItem(s) {
  const facts = DIVISION_FACTS[s.division];
  const need = s.meetsFullNeed ? `<span class="tag full-need">Meets full need</span>` : "";
  const merit = s.meritAid ? `<span class="tag merit">Merit $</span>` : "";
  // Income-aware verdict — the line that changes with the family's income.
  const v = s.verdict
    ? `<div class="school-verdict ${s.verdict.tone}">💵 ${s.verdict.text}</div>`
    : "";
  return `
    <li class="school">
      <div class="school-top">
        <span class="school-name">${s.name}</span>
        <span class="school-div">${facts.name.replace("NCAA ", "")}</span>
      </div>
      <div class="school-meta">${s.state} · ${s.type} ${need} ${merit}</div>
      ${v}
      <div class="school-note">${s.note}</div>
    </li>`;
}

function bucketColumn(title, sub, list) {
  const items = list.length
    ? `<ul class="school-list">${list.map(schoolItem).join("")}</ul>`
    : `<p class="empty">No strong matches in this bucket from our sample list — widen your search using the strategy below.</p>`;
  return `
    <div class="bucket">
      <h4>${title}</h4>
      <p class="bucket-sub">${sub}</p>
      ${items}
    </div>`;
}

function renderResults() {
  const rec = generateRecommendation(answers);

  const genderNote =
    answers.gender === "womens"
      ? "Women's basketball D1 offers 15 full 'headcount' scholarships per team — slightly more full-ride opportunity than the men's side."
      : "Men's basketball D1 offers 13 full 'headcount' scholarships per team — full rides exist but roster spots are very limited.";

  const financeNotes = rec.finances.notes.map((n) => `<li>${n}</li>`).join("");
  const academicFlags = rec.academics.flags.length
    ? `<div class="callout warn"><h4>Academic watch-outs</h4><ul>${rec.academics.flags
        .map((f) => `<li>${f}</li>`)
        .join("")}</ul></div>`
    : `<div class="callout ok"><h4>Academics</h4><p>No major academic eligibility flags based on what you entered. Keep grades up and stay on top of NCAA core courses.</p></div>`;

  const checklist = rec.checklist
    .map(
      (c, i) => `
      <li class="check">
        <label><input type="checkbox" data-check="${i}"/> <span>${c.text}</span></label>
      </li>`
    )
    .join("");

  const rc = rec.realityCheck;
  const validationBadge = {
    strong: `<span class="valid strong">Strong outside validation</span>`,
    some: `<span class="valid some">Some outside validation</span>`,
    little: `<span class="valid little">Needs an outside evaluation</span>`,
  }[rc.validation];
  const cappedNote = rec.scoreCaps && rec.scoreCaps.length
    ? `<span class="score-caption capped">↓ Held to a realistic ceiling for your athlete's grade</span>`
    : "";

  const sizeLine = rec.size
    ? `<p class="size-read ${rec.size.tone}">📏 Size read: ${rec.size.note}</p>`
    : "";

  const realityBox = `
    <div class="callout reality">
      <h4>🔎 Reality check — is this level realistic?</h4>
      <p class="funnel">${rc.funnel}</p>
      ${sizeLine}
      <p class="validation-line">Based on OBJECTIVE facts you entered (not opinion): ${validationBadge}</p>
      ${rc.messages.map((m) => `<p>${m}</p>`).join("")}
    </div>`;

  const html = `
    <h2>Your Recruiting Game Plan</h2>

    <div class="result-summary">
      <div class="tier-box">
        <span class="tier-label">Estimated realistic level</span>
        <span class="tier-value">${rec.tier.label}</span>
        <div class="score-bar"><div style="width:${rec.athleticScore}%"></div></div>
        <span class="score-caption">Athletic profile score: ${rec.athleticScore}/100 — built only from verifiable facts, not self-rating</span>
        ${cappedNote}
      </div>
      <p class="gender-note">${genderNote}</p>
    </div>

    ${realityBox}

    <h3>Best pathways for your family, ranked</h3>
    <p class="section-sub">We weigh your athlete's level, grades, AND budget together — because the cheapest path to college ball isn't always the highest division.</p>
    <div class="divisions">
      ${rec.rankedDivisions.map((d, i) => divisionCard(i + 1, d, i)).join("")}
    </div>

    <h3>Target school shortlist</h3>
    <p class="section-sub">Sorted into Reach / Target / Safety for your athlete, and filtered for your <strong>${
      { low: "lower-income", middle: "middle-income", high: "higher-income" }[rec.finances.incomeTier]
    }</strong> situation. The 💵 line on each card is our cost read <em>for your income</em> — it changes if your income changes. Build your own list of 15–30 from this model.</p>
    <div class="buckets">
      ${bucketColumn("🎯 Reach", "Ambitious — worth a shot", rec.shortlist.reach)}
      ${bucketColumn("✅ Target", "Realistic, strong-fit matches", rec.shortlist.target)}
      ${bucketColumn("🛟 Safety", "High-confidence, affordable options", rec.shortlist.safety)}
    </div>

    ${academicFlags}

    <div class="callout money">
      <h4>💰 Your money strategy</h4>
      <ul>${financeNotes}</ul>
      <p class="strategy-key">The winning move for most families: stack every source — athletic aid (if any) + Pell + state grants + institutional need aid + academic merit. Grades are worth real dollars everywhere, and are your ONLY athletic-equivalent aid at D3.</p>
    </div>

    <h3>Your action checklist</h3>
    <p class="section-sub">Do these in order. Check them off as you go — progress saves while this page is open.</p>
    <ul class="checklist">${checklist}</ul>
  `;

  el("resultsContent").innerHTML = html;
  showView("results");
}

/* ------------------------------------------------------------------ *
 * Wiring
 * ------------------------------------------------------------------ */
el("startBtn").addEventListener("click", () => {
  currentStep = 0;
  renderStep();
  showView("wizard");
});

el("nextBtn").addEventListener("click", () => {
  saveStep();
  if (currentStep < STEPS.length - 1) {
    currentStep++;
    renderStep();
  } else {
    renderResults();
  }
});

el("backBtn").addEventListener("click", () => {
  saveStep();
  if (currentStep > 0) {
    currentStep--;
    renderStep();
  }
});

el("restartBtn").addEventListener("click", () => {
  for (const k in answers) delete answers[k];
  currentStep = 0;
  showView("intro");
});

el("printBtn").addEventListener("click", () => window.print());

/* ------------------------------------------------------------------ *
 * Browse All Schools
 * ------------------------------------------------------------------ */
const REGION_LABEL = { NE: "Northeast", SE: "Southeast", MW: "Midwest", SW: "Southwest", W: "West" };

function renderBrowse() {
  const region = el("fRegion").value;
  const division = el("fDivision").value;
  const type = el("fType").value;
  const aid = el("fAid").value;
  const q = el("fSearch").value.trim().toLowerCase();

  let list = SCHOOLS.filter((s) => {
    if (region && s.region !== region) return false;
    if (division && s.division !== division) return false;
    if (type && s.type !== type) return false;
    if (aid === "fullneed" && !s.meetsFullNeed) return false;
    if (aid === "merit" && !s.meritAid) return false;
    if (aid === "athletic" && !DIVISION_FACTS[s.division].athleticScholarships) return false;
    if (q && !(s.name.toLowerCase().includes(q) || s.state.toLowerCase().includes(q))) return false;
    return true;
  });

  // Sort by region then division then name for a tidy browse.
  const divOrder = { D1: 0, D2: 1, D3: 2, NAIA: 3, JUCO: 4 };
  list.sort(
    (x, y) =>
      x.region.localeCompare(y.region) ||
      divOrder[x.division] - divOrder[y.division] ||
      x.name.localeCompare(y.name)
  );

  el("browseCount").textContent =
    `${list.length} college${list.length === 1 ? "" : "s"}` +
    (region ? ` in the ${REGION_LABEL[region]}` : " nationwide");

  el("browseList").innerHTML = list.length
    ? list.map(browseItem).join("")
    : `<li class="empty">No colleges match those filters. Try widening them.</li>`;
}

/* A browse card — no income verdict here (that's personalized in results). */
function browseItem(s) {
  const facts = DIVISION_FACTS[s.division];
  const need = s.meetsFullNeed ? `<span class="tag full-need">Meets full need</span>` : "";
  const merit = s.meritAid ? `<span class="tag merit">Merit $</span>` : "";
  const athletic = facts.athleticScholarships ? `<span class="tag athletic">Athletic $</span>` : "";
  const afford =
    s.lowIncomeAffordability === "high"
      ? `<span class="tag afford-high">Affordable</span>`
      : "";
  return `
    <li class="school">
      <div class="school-top">
        <span class="school-name">${s.name}</span>
        <span class="school-div">${facts.name.replace("NCAA ", "")}</span>
      </div>
      <div class="school-meta">${s.state} · ${REGION_LABEL[s.region]} · ${s.type} ${afford} ${need} ${merit} ${athletic}</div>
      <div class="school-note">${s.note}</div>
    </li>`;
}

["fRegion", "fDivision", "fType", "fAid"].forEach((id) =>
  el(id).addEventListener("change", renderBrowse)
);
el("fSearch").addEventListener("input", renderBrowse);

el("browseBtn").addEventListener("click", () => {
  renderBrowse();
  showView("browse");
});
el("browseBackBtn").addEventListener("click", () => showView("intro"));
el("browseStartBtn").addEventListener("click", () => {
  currentStep = 0;
  renderStep();
  showView("wizard");
});
