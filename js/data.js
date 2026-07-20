/*
 * data.js
 * Static reference data for the recruiting tool.
 *
 * IMPORTANT ON ACCURACY:
 * Costs and aid vary every year and by family. We deliberately keep school
 * affordability at a CATEGORICAL level (a low-income affordability rating and a
 * "meets full need" flag) instead of quoting exact dollar figures, because exact
 * numbers go stale and mislead. Every family is told to confirm real numbers on
 * each school's official Net Price Calculator before deciding.
 */

/* ------------------------------------------------------------------ *
 * Division / pathway facts (the education layer of the tool)
 * ------------------------------------------------------------------ */
const DIVISION_FACTS = {
  D1: {
    name: "NCAA Division I",
    athleticScholarships: true,
    scholarshipNote:
      "Full athletic scholarships available. Men's & women's basketball are 'headcount' sports, so awards are typically full rides — but roster spots are extremely limited and competition is national/international.",
    affordabilityForLowIncome:
      "Best case for a low-income family IF your athlete earns a scholarship: a full ride covers tuition, room, board, and books. Without a scholarship, D1 sticker prices are high.",
    realism: "Top ~1% of high-school players. Usually recruited by 10th–11th grade.",
  },
  D2: {
    name: "NCAA Division II",
    athleticScholarships: true,
    scholarshipNote:
      "Athletic scholarships available but 'equivalency' — usually PARTIAL. Coaches split ~10 scholarships across the roster, so most players get a portion. Partial athletic + need-based aid is a common combo.",
    affordabilityForLowIncome:
      "Strong pathway. Stack a partial athletic scholarship with federal Pell + state grants + institutional need aid to get close to a full ride.",
    realism: "Very strong varsity / regional-to-national club players.",
  },
  D3: {
    name: "NCAA Division III",
    athleticScholarships: false,
    scholarshipNote:
      "NO athletic scholarships — this is a rule, not a school choice. Aid is need-based and academic/merit only.",
    affordabilityForLowIncome:
      "Do NOT rule this out. For a low-income family, a well-endowed D3 that 'meets full financial need' can be CHEAPER than a partial D2 athletic scholarship. Strong grades unlock merit aid on top of need aid.",
    realism: "Wide range of levels — from very competitive to developmental. Great fit for strong students who play well.",
  },
  NAIA: {
    name: "NAIA",
    athleticScholarships: true,
    scholarshipNote:
      "Athletic scholarships available (often partial). Separate association from the NCAA with its own, generally simpler, eligibility process.",
    affordabilityForLowIncome:
      "Under-marketed and often generous. Athletic + academic aid frequently stack well. Worth targeting for affordability.",
    realism: "Comparable to D2 / strong D3. Many hidden-gem programs.",
  },
  JUCO: {
    name: "Junior College (NJCAA / JUCO)",
    athleticScholarships: true,
    scholarshipNote:
      "Two-year colleges. Athletic scholarships available at many. A launchpad, not a dead end.",
    affordabilityForLowIncome:
      "Lowest cost of entry. Play two years, raise your grades and film, then transfer up to a D1/D2 on scholarship. Best value-for-money starting point when academics or exposure aren't there yet.",
    realism: "Development pathway. Great for late bloomers, grade rebuilders, and under-recruited players.",
  },
};

/* ------------------------------------------------------------------ *
 * Representative school dataset
 * region: NE, SE, MW, SW, W
 * type: public | private
 * lowIncomeAffordability: high | medium | low  (net cost to a low-income family)
 * meetsFullNeed: true means the school pledges to cover 100% of demonstrated need
 * selectivity: open | moderate | selective | highly-selective
 * ------------------------------------------------------------------ */
const SCHOOLS = [
  // ---- D1 ----
  { name: "University of Michigan", division: "D1", state: "MI", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: true, selectivity: "highly-selective", note: "Go Blue Guarantee covers tuition for in-state low-income families; strong need aid overall." },
  { name: "University of North Carolina", division: "D1", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: true, selectivity: "highly-selective", note: "Carolina Covenant: no-loan, full-need aid for low-income students." },
  { name: "University of Florida", division: "D1", state: "FL", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "selective", note: "Strong in-state value; Bright Futures + need aid." },
  { name: "University of Texas at Austin", division: "D1", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "selective", note: "Texas Advance covers tuition for families under income threshold." },
  { name: "University of California, Berkeley", division: "D1", state: "CA", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: true, selectivity: "highly-selective", note: "Blue and Gold Plan covers tuition for lower-income CA families." },
  { name: "Gonzaga University", division: "D1", state: "WA", region: "W", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, selectivity: "selective", note: "Mid-major powerhouse; solid need + merit aid." },
  { name: "Davidson College", division: "D1", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, selectivity: "highly-selective", note: "The Davidson Trust: meets full need with no loans." },

  // ---- D2 ----
  { name: "Cal Poly Pomona", division: "D2", state: "CA", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "moderate", note: "Affordable public D2; stack Cal Grant + Pell + partial athletic." },
  { name: "West Texas A&M University", division: "D2", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "moderate", note: "Low tuition; strong regional D2 basketball." },
  { name: "Northwest Missouri State", division: "D2", state: "MO", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "moderate", note: "Affordable, winning D2 athletics culture." },
  { name: "Bentley University", division: "D2", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, selectivity: "selective", note: "Strong academics + D2; combine partial athletic with need aid." },
  { name: "Nova Southeastern University", division: "D2", state: "FL", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, selectivity: "moderate", note: "Merit + partial athletic aid common." },

  // ---- D3 ----
  { name: "Amherst College", division: "D3", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, selectivity: "highly-selective", note: "No athletic $ (D3 rule) but meets 100% of need, no loans. Can be near-free for low income." },
  { name: "Williams College", division: "D3", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, selectivity: "highly-selective", note: "Elite academics + full-need aid; strong D3 hoops (NESCAC)." },
  { name: "Pomona College", division: "D3", state: "CA", region: "W", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, selectivity: "highly-selective", note: "Meets full need, no loans. D3 = academic/need aid only." },
  { name: "University of Chicago", division: "D3", state: "IL", region: "MW", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, selectivity: "highly-selective", note: "No Barriers program; free tuition under income threshold." },
  { name: "Ramapo College of New Jersey", division: "D3", state: "NJ", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "moderate", note: "Public D3; affordable in-state; TAG grant for NJ low income." },
  { name: "SUNY Geneseo", division: "D3", state: "NY", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "selective", note: "Public D3; NY TAP + Excelsior can cover tuition for low income." },
  { name: "Wisconsin–Whitewater", division: "D3", state: "WI", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "moderate", note: "Perennial D3 contender; affordable public." },
  { name: "Emory University", division: "D3", state: "GA", region: "SE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, selectivity: "highly-selective", note: "Meets full need; strong aid for low income." },

  // ---- NAIA ----
  { name: "Life University", division: "NAIA", state: "GA", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, selectivity: "open", note: "NAIA athletic aid + federal aid stack." },
  { name: "Oklahoma City University", division: "NAIA", state: "OK", region: "SW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, selectivity: "moderate", note: "Storied NAIA basketball; athletic + academic aid." },
  { name: "Grand View University", division: "NAIA", state: "IA", region: "MW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, selectivity: "open", note: "Generous stacking of athletic + need aid." },
  { name: "The Master's University", division: "NAIA", state: "CA", region: "W", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, selectivity: "moderate", note: "Competitive NAIA West program." },

  // ---- JUCO ----
  { name: "Northwest Florida State College", division: "JUCO", state: "FL", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "open", note: "Elite JUCO pipeline to D1; very low cost of entry." },
  { name: "Salt Lake Community College", division: "JUCO", state: "UT", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "open", note: "Strong JUCO transfer record; Pell often covers most costs." },
  { name: "Vincennes University", division: "JUCO", state: "IN", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "open", note: "Historic JUCO program; affordable launchpad." },
  { name: "Hutchinson Community College", division: "JUCO", state: "KS", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, selectivity: "open", note: "Powerhouse JUCO; strong transfer-up track record." },
];

/* Federal aid quick facts shown in the results strategy box */
const AID_FACTS = {
  pellMax: 7395, // approx annual max Pell Grant; verify current year
  ncaaFeeWaiver:
    "The NCAA Eligibility Center registration fee is WAIVED if your athlete received an SAT/ACT fee waiver (which free/reduced-lunch students qualify for). Ask the high-school counselor.",
  fafsa:
    "File the FAFSA every year — it's free and unlocks the Pell Grant, state grants, and most institutional need aid. The CSS Profile is an extra form some private schools require.",
};
