/*
 * app.js
 * Wizard UI: renders steps, collects answers, and renders results.
 */

/* ------------------------------------------------------------------ *
 * Questionnaire definition — grouped into 5 steps.
 * type: 'radio' | 'select' | 'number'
 * ------------------------------------------------------------------ */
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
        id: "region", label: "Your home region", type: "select",
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
    title: "The Game",
    intro: "Be honest here — realistic input gives a realistic plan.",
    questions: [
      {
        id: "playingLevel", label: "Current level of play", type: "radio",
        options: [
          ["varsityStar", "Varsity — a top player / star on the team"],
          ["varsityStarter", "Varsity — regular starter"],
          ["varsityBench", "Varsity — role/bench player"],
          ["jv", "JV / freshman team"],
          ["rec", "Rec / just starting out"],
        ],
      },
      {
        id: "clubLevel", label: "Club / AAU / travel-ball exposure", type: "radio",
        options: [
          ["nationalCircuit", "National circuit (Nike EYBL, Adidas, UAA, etc.)"],
          ["regional", "Regional travel team"],
          ["local", "Local club only"],
          ["none", "No club / AAU"],
        ],
      },
      {
        id: "competitiveness", label: "Honestly, how does your athlete stack up against peers?", type: "radio",
        options: [
          ["topInState", "Among the best in the state"],
          ["topInRegion", "Among the best in the area/region"],
          ["aboveAverage", "Above average for their level"],
          ["average", "Average / still developing"],
        ],
      },
      {
        id: "coachInterest", label: "Any college recruiting interest so far?", type: "radio",
        options: [
          ["d1Interest", "Yes — including D1/D2 programs"],
          ["someInterest", "Some — a few schools reaching out"],
          ["campInvites", "Camp / showcase invites only"],
          ["none", "None yet"],
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
  const afford =
    s.lowIncomeAffordability === "high"
      ? `<span class="tag afford-high">High affordability</span>`
      : s.lowIncomeAffordability === "medium"
      ? `<span class="tag afford-med">Medium affordability</span>`
      : "";
  return `
    <li class="school">
      <div class="school-top">
        <span class="school-name">${s.name}</span>
        <span class="school-div">${facts.name.replace("NCAA ", "")}</span>
      </div>
      <div class="school-meta">${s.state} · ${s.type} ${afford} ${need}</div>
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

  const html = `
    <h2>Your Recruiting Game Plan</h2>

    <div class="result-summary">
      <div class="tier-box">
        <span class="tier-label">Estimated realistic level</span>
        <span class="tier-value">${rec.tier.label}</span>
        <div class="score-bar"><div style="width:${rec.athleticScore}%"></div></div>
        <span class="score-caption">Athletic profile score: ${rec.athleticScore}/100 (based on your honest inputs)</span>
      </div>
      <p class="gender-note">${genderNote}</p>
    </div>

    <h3>Best pathways for your family, ranked</h3>
    <p class="section-sub">We weigh your athlete's level, grades, AND budget together — because the cheapest path to college ball isn't always the highest division.</p>
    <div class="divisions">
      ${rec.rankedDivisions.map((d, i) => divisionCard(i + 1, d, i)).join("")}
    </div>

    <h3>Target school shortlist</h3>
    <p class="section-sub">A starter list from our sample database, sorted into Reach / Target / Safety for your athlete. Use this as a <em>model</em> for the kind of schools to research — then build your own list of 15–30.</p>
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
