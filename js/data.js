/*
 * data.js
 * Static reference data for the recruiting tool.
 *
 * IMPORTANT ON ACCURACY:
 * Costs and aid vary every year and by family. We deliberately keep school
 * affordability at a CATEGORICAL level (a low-income affordability rating, a
 * "meets full need" flag, and a "strong merit aid" flag) instead of quoting exact
 * dollar figures, because exact numbers go stale and mislead. Every family is told
 * to confirm real numbers on each school's official Net Price Calculator.
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
 * School dataset
 * region: NE, SE, MW, SW, W
 * type: public | private
 * lowIncomeAffordability: high | medium | low  (net cost to a low-income family)
 * meetsFullNeed: school pledges to cover ~100% of demonstrated financial need
 * meritAid: known for substantial non-need (merit/academic) scholarships
 * selectivity: open | moderate | selective | highly-selective
 * ------------------------------------------------------------------ */
const SCHOOLS = [
  /* ===================== NORTHEAST ===================== */
  { name: "University of Connecticut", division: "D1", state: "CT", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Blue-blood basketball; strong in-state value + need aid." },
  { name: "Rutgers University", division: "D1", state: "NJ", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Garden State Guarantee covers tuition for NJ families under an income threshold." },
  { name: "Villanova University", division: "D1", state: "PA", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need; elite program but very selective admits." },
  { name: "Providence College", division: "D1", state: "RI", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Big East; combine merit + need aid." },
  { name: "St. John's University", division: "D1", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "NYC; athletic + merit aid available." },
  { name: "Bentley University", division: "D2", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Strong academics + D2; pair partial athletic with need/merit aid." },
  { name: "Southern New Hampshire University", division: "D2", state: "NH", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Affordable; athletic + merit aid stack well." },
  { name: "Bloomsburg (Commonwealth U of PA)", division: "D2", state: "PA", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Affordable public D2 (PA State System)." },
  { name: "Amherst College", division: "D3", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "No athletic $ (D3 rule) but meets 100% of need, no loans. Can be near-free for low income." },
  { name: "Massachusetts Inst. of Technology", division: "D3", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need; free tuition under income threshold." },
  { name: "Bowdoin College", division: "D3", state: "ME", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need with no loans (NESCAC)." },
  { name: "University of Rochester", division: "D3", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "Meets full need AND offers merit scholarships." },
  { name: "SUNY Geneseo", division: "D3", state: "NY", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Public D3; NY TAP + Excelsior can cover tuition for low income." },
  { name: "The College of New Jersey (TCNJ)", division: "D3", state: "NJ", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Top public D3; strong value + merit aid." },
  { name: "Rochester Inst. of Technology (RIT)", division: "D3", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Strong merit scholarships; co-op program." },
  { name: "Ramapo College of New Jersey", division: "D3", state: "NJ", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Public D3; affordable in-state; NJ TAG grant for low income." },
  { name: "Monroe College", division: "JUCO", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Famous NYC JUCO pipeline to D1; aid makes it low-cost." },
  { name: "Hudson Valley Community College", division: "JUCO", state: "NY", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Affordable NY JUCO launchpad." },

  /* ===================== SOUTHEAST ===================== */
  { name: "University of North Carolina", division: "D1", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "Carolina Covenant: no-loan, full-need aid for low-income students." },
  { name: "University of Virginia", division: "D1", state: "VA", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "AccessUVA meets 100% of demonstrated need." },
  { name: "University of Georgia", division: "D1", state: "GA", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "HOPE/Zell Miller scholarships for GA residents; good value." },
  { name: "Florida State University", division: "D1", state: "FL", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Bright Futures + need aid; strong in-state value." },
  { name: "Virginia Commonwealth University", division: "D1", state: "VA", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "A10; affordable public with recent NCAA-tournament runs." },
  { name: "NC A&T State University", division: "D1", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Largest HBCU; affordable public (CAA)." },
  { name: "UNC Pembroke", division: "D2", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Very affordable NC public D2." },
  { name: "Winston-Salem State University", division: "D2", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "HBCU; affordable public D2 (CIAA)." },
  { name: "University of Tampa", division: "D2", state: "FL", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Strong D2 program; merit scholarships." },
  { name: "Emory University", division: "D3", state: "GA", region: "SE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "Meets full need; strong aid + some merit scholarships." },
  { name: "Washington and Lee University", division: "D3", state: "VA", region: "SE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "Meets full need; also large Johnson merit scholarships." },
  { name: "Rhodes College", division: "D3", state: "TN", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Memphis; strong merit scholarships." },
  { name: "Christopher Newport University", division: "D3", state: "VA", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Affordable public D3; merit aid for VA residents." },
  { name: "Berry College", division: "D3", state: "GA", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Generous merit scholarships; large scenic campus." },
  { name: "Life University", division: "NAIA", state: "GA", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "NAIA athletic + academic aid stack." },
  { name: "Montreat College", division: "NAIA", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "NC NAIA; athletic + academic aid stack." },
  { name: "Louisburg College", division: "JUCO", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Historic NC JUCO basketball pipeline to D1." },
  { name: "Chipola College", division: "JUCO", state: "FL", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Elite FL JUCO; strong D1 transfer record; very low cost." },
  { name: "Northwest Florida State College", division: "JUCO", state: "FL", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Elite JUCO pipeline to D1; very low cost of entry." },

  /* ===================== MIDWEST ===================== */
  { name: "University of Michigan", division: "D1", state: "MI", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "Go Blue Guarantee covers tuition for in-state low-income families." },
  { name: "University of Illinois Urbana-Champaign", division: "D1", state: "IL", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Illinois Commitment covers tuition for lower-income IL families." },
  { name: "Butler University", division: "D1", state: "IN", region: "MW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Big East; strong merit scholarships." },
  { name: "Xavier University", division: "D1", state: "OH", region: "MW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Big East; merit aid + strong hoops tradition." },
  { name: "University of Northern Iowa", division: "D1", state: "IA", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Affordable public D1 (MVC); good in-state value." },
  { name: "Wright State University", division: "D1", state: "OH", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Affordable public D1 (Horizon League)." },
  { name: "Grand Valley State University", division: "D2", state: "MI", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Powerhouse D2; affordable public + merit aid." },
  { name: "Truman State University", division: "D2", state: "MO", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Affordable public with academic reputation + merit aid." },
  { name: "Northwest Missouri State", division: "D2", state: "MO", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Affordable, winning D2 athletics culture." },
  { name: "University of Chicago", division: "D3", state: "IL", region: "MW", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "No Barriers program; free tuition under income threshold." },
  { name: "Washington University in St. Louis", division: "D3", state: "MO", region: "MW", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "Meets full need; also offers merit scholarships." },
  { name: "Carleton College", division: "D3", state: "MN", region: "MW", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need; top liberal-arts academics." },
  { name: "DePauw University", division: "D3", state: "IN", region: "MW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Strong merit scholarships; competitive D3." },
  { name: "Wisconsin–Whitewater", division: "D3", state: "WI", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "moderate", note: "Perennial D3 contender; affordable public." },
  { name: "Marian University (Indianapolis)", division: "NAIA", state: "IN", region: "MW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Strong NAIA program; athletic + academic aid." },
  { name: "Grand View University", division: "NAIA", state: "IA", region: "MW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Generous stacking of athletic + need aid." },
  { name: "Vincennes University", division: "JUCO", state: "IN", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Historic JUCO program; affordable launchpad." },
  { name: "Hutchinson Community College", division: "JUCO", state: "KS", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Powerhouse JUCO; strong transfer-up track record." },
  { name: "Indian Hills Community College", division: "JUCO", state: "IA", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Elite JUCO; strong pipeline to D1." },

  /* ===================== SOUTHWEST ===================== */
  { name: "University of Texas at Austin", division: "D1", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Texas Advance covers tuition for families under an income threshold." },
  { name: "Texas A&M University", division: "D1", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Aggie Assurance covers tuition for lower-income TX families." },
  { name: "University of Houston", division: "D1", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Cougar Promise; strong hoops; affordable public." },
  { name: "University of Oklahoma", division: "D1", state: "OK", region: "SW", type: "public", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Big 12; merit + need aid." },
  { name: "University of New Mexico", division: "D1", state: "NM", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "NM Lottery Scholarship can cover tuition; affordable." },
  { name: "University of Texas at El Paso (UTEP)", division: "D1", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Very affordable public D1; strong need aid." },
  { name: "West Texas A&M University", division: "D2", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Low tuition; strong regional D2 basketball." },
  { name: "Angelo State University", division: "D2", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Affordable TX public D2 (LSC); merit aid." },
  { name: "Texas A&M University–Kingsville", division: "D2", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Affordable public D2; athletic + merit aid." },
  { name: "Trinity University", division: "D3", state: "TX", region: "SW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Top TX D3; strong merit scholarships." },
  { name: "Southwestern University", division: "D3", state: "TX", region: "SW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "TX liberal-arts D3; merit scholarships." },
  { name: "University of Dallas", division: "D3", state: "TX", region: "SW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "D3; strong merit aid." },
  { name: "Austin College", division: "D3", state: "TX", region: "SW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "TX D3; generous merit scholarships." },
  { name: "Oklahoma City University", division: "NAIA", state: "OK", region: "SW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Storied NAIA basketball; athletic + academic aid." },
  { name: "Wayland Baptist University", division: "NAIA", state: "TX", region: "SW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Historic NAIA basketball; athletic + academic aid." },
  { name: "South Plains College", division: "JUCO", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Elite JUCO; strong D1 transfer pipeline; low cost." },
  { name: "Odessa College", division: "JUCO", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Affordable TX JUCO launchpad." },
  { name: "New Mexico Junior College", division: "JUCO", state: "NM", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Low-cost JUCO; transfer-up pathway." },

  /* ===================== WEST ===================== */
  { name: "University of California, Berkeley", division: "D1", state: "CA", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Blue and Gold Plan covers tuition for lower-income CA families." },
  { name: "UCLA", division: "D1", state: "CA", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Blue and Gold Plan covers tuition for lower-income CA families." },
  { name: "San Diego State University", division: "D1", state: "CA", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Affordable CA public; strong basketball; Cal Grant + need aid." },
  { name: "University of Nevada, Las Vegas", division: "D1", state: "NV", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Affordable public D1; storied hoops history." },
  { name: "Gonzaga University", division: "D1", state: "WA", region: "W", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Mid-major powerhouse; solid need + merit aid." },
  { name: "Saint Mary's College of California", division: "D1", state: "CA", region: "W", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "WCC; strong program; merit + need aid." },
  { name: "Cal Poly Pomona", division: "D2", state: "CA", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "moderate", note: "Affordable public D2; stack Cal Grant + Pell + partial athletic." },
  { name: "Cal State San Bernardino", division: "D2", state: "CA", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "moderate", note: "Very affordable CSU; Cal Grant + Pell can cover most costs." },
  { name: "Western Washington University", division: "D2", state: "WA", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "moderate", note: "Affordable public D2 (GNAC)." },
  { name: "Point Loma Nazarene University", division: "D2", state: "CA", region: "W", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "San Diego D2; merit + athletic aid." },
  { name: "Pomona College", division: "D3", state: "CA", region: "W", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need, no loans. D3 = academic/need aid only." },
  { name: "Claremont-Mudd-Scripps (CMS)", division: "D3", state: "CA", region: "W", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need; strong SCIAC athletics." },
  { name: "Occidental College", division: "D3", state: "CA", region: "W", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "selective", note: "Meets full need; LA liberal-arts D3 + merit aid." },
  { name: "University of Redlands", division: "D3", state: "CA", region: "W", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "SoCal D3; strong merit scholarships." },
  { name: "Whitworth University", division: "D3", state: "WA", region: "W", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Spokane D3; competitive program + merit aid." },
  { name: "The Master's University", division: "NAIA", state: "CA", region: "W", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Competitive NAIA West program." },
  { name: "Arizona Christian University", division: "NAIA", state: "AZ", region: "W", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "NAIA; athletic + academic aid stack." },
  { name: "College of Southern Idaho", division: "JUCO", state: "ID", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Elite JUCO; strong D1 transfer pipeline; low cost." },
  { name: "Salt Lake Community College", division: "JUCO", state: "UT", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Strong JUCO transfer record; Pell often covers most costs." },
];

/* Federal aid quick facts shown in the results strategy box */
const AID_FACTS = {
  pellMax: 7395, // approx annual max Pell Grant; verify current year
  ncaaFeeWaiver:
    "The NCAA Eligibility Center registration fee is WAIVED if your athlete received an SAT/ACT fee waiver (which free/reduced-lunch students qualify for). Ask the high-school counselor.",
  fafsa:
    "File the FAFSA every year — it's free and unlocks the Pell Grant, state grants, and most institutional need aid. The CSS Profile is an extra form some private schools require.",
};
