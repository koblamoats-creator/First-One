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
  // D1
  { name: "University of Connecticut", division: "D1", state: "CT", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Blue-blood basketball; strong in-state value + need aid." },
  { name: "Rutgers University", division: "D1", state: "NJ", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Garden State Guarantee covers tuition for NJ families under an income threshold." },
  { name: "UMass Amherst", division: "D1", state: "MA", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Affordable flagship; solid need + merit aid." },
  { name: "Stony Brook University (SUNY)", division: "D1", state: "NY", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Low SUNY tuition; NY TAP + Excelsior can cover it for low income." },
  { name: "Penn State University", division: "D1", state: "PA", region: "NE", type: "public", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Big Ten public; higher cost but broad merit + need aid." },
  { name: "Boston College", division: "D1", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need; ACC basketball." },
  { name: "Villanova University", division: "D1", state: "PA", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need; elite program but very selective admits." },
  { name: "Providence College", division: "D1", state: "RI", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Big East; combine merit + need aid." },
  { name: "Seton Hall University", division: "D1", state: "NJ", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Big East; solid merit scholarships." },
  { name: "St. John's University", division: "D1", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "NYC; athletic + merit aid available." },
  { name: "Fordham University", division: "D1", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "A10 conference; Bronx, NY; merit + need aid." },
  { name: "Fairfield University", division: "D1", state: "CT", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "MAAC; merit scholarships common." },
  { name: "Marist College", division: "D1", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "MAAC; strong merit aid." },
  { name: "Iona University", division: "D1", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "MAAC; NCAA-tournament regular; merit aid." },
  { name: "Merrimack College", division: "D1", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Recent D1 move (NEC); merit aid + growing program." },
  { name: "Syracuse University", division: "D1", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "ACC; large private; merit + need aid." },

  // D2
  { name: "Bentley University", division: "D2", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Strong academics + D2; pair partial athletic with need/merit aid." },
  { name: "Southern New Hampshire University", division: "D2", state: "NH", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Affordable; athletic + merit aid stack well." },
  { name: "Adelphi University", division: "D2", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Long Island; generous merit scholarships." },
  { name: "Pace University", division: "D2", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "NY metro D2; merit aid available." },
  { name: "Assumption University", division: "D2", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Northeast-10; merit scholarships." },
  { name: "American International College", division: "D2", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Athletic + merit aid; accessible admissions." },
  { name: "Bloomsburg (Commonwealth U of PA)", division: "D2", state: "PA", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Affordable public D2 (PA State System)." },
  { name: "East Stroudsburg University", division: "D2", state: "PA", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "moderate", note: "Low-cost public D2 in the Poconos." },
  { name: "Franklin Pierce University", division: "D2", state: "NH", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "NE-10; athletic + merit aid." },
  { name: "University of New Haven", division: "D2", state: "CT", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "CT private D2; merit scholarships." },

  // D3
  { name: "Amherst College", division: "D3", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "No athletic $ (D3 rule) but meets 100% of need, no loans. Can be near-free for low income." },
  { name: "Williams College", division: "D3", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Elite academics + full-need aid; strong D3 hoops (NESCAC)." },
  { name: "Tufts University", division: "D3", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need; competitive NESCAC basketball." },
  { name: "Massachusetts Inst. of Technology", division: "D3", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need; free tuition under income threshold." },
  { name: "Middlebury College", division: "D3", state: "VT", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need, no loans (NESCAC)." },
  { name: "Bowdoin College", division: "D3", state: "ME", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need with no loans (NESCAC)." },
  { name: "Hamilton College", division: "D3", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need; strong D3 program." },
  { name: "University of Rochester", division: "D3", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "Meets full need AND offers merit scholarships." },
  { name: "New York University", division: "D3", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need for admitted students; NYC." },
  { name: "Rochester Inst. of Technology (RIT)", division: "D3", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Strong merit scholarships; co-op program." },
  { name: "Stevens Institute of Technology", division: "D3", state: "NJ", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Merit aid; strong career outcomes." },
  { name: "Ithaca College", division: "D3", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Merit scholarships; solid D3 athletics." },
  { name: "Springfield College", division: "D3", state: "MA", region: "NE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Birthplace of basketball; strong sport-focused programs + merit aid." },
  { name: "SUNY Geneseo", division: "D3", state: "NY", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Public D3; NY TAP + Excelsior can cover tuition for low income." },
  { name: "SUNY Cortland", division: "D3", state: "NY", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "moderate", note: "Affordable public D3 with strong athletics tradition." },
  { name: "SUNY New Paltz", division: "D3", state: "NY", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "moderate", note: "Affordable public D3; NY state aid." },
  { name: "Ramapo College of New Jersey", division: "D3", state: "NJ", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Public D3; affordable in-state; NJ TAG grant for low income." },
  { name: "The College of New Jersey (TCNJ)", division: "D3", state: "NJ", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Top public D3; strong value + merit aid." },
  { name: "Rowan University", division: "D3", state: "NJ", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Affordable public; NJ state aid + merit." },

  // JUCO
  { name: "Monroe College", division: "JUCO", state: "NY", region: "NE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Famous NYC JUCO pipeline to D1; aid makes it low-cost." },
  { name: "SUNY Sullivan", division: "JUCO", state: "NY", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Public JUCO; Pell often covers most costs." },
  { name: "Hudson Valley Community College", division: "JUCO", state: "NY", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Affordable NY JUCO launchpad." },
  { name: "Northampton Community College", division: "JUCO", state: "PA", region: "NE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Low-cost PA JUCO; transfer-up pathway." },

  /* ===================== SOUTHEAST ===================== */
  // D1
  { name: "University of North Carolina", division: "D1", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "Carolina Covenant: no-loan, full-need aid for low-income students." },
  { name: "North Carolina State University", division: "D1", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "In-state value; Pack Promise for low-income NC students." },
  { name: "Davidson College", division: "D1", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "The Davidson Trust: meets full need with no loans." },
  { name: "UNC Greensboro", division: "D1", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Affordable public D1 (SoCon); good in-state value." },
  { name: "UNC Wilmington", division: "D1", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "CAA; affordable coastal public." },
  { name: "East Carolina University", division: "D1", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "AAC; affordable NC public." },
  { name: "High Point University", division: "D1", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Big South; strong merit scholarships." },
  { name: "Campbell University", division: "D1", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "CAA; merit + athletic aid." },
  { name: "NC A&T State University", division: "D1", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Largest HBCU; affordable public (CAA)." },
  { name: "University of Florida", division: "D1", state: "FL", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Strong in-state value; Bright Futures + need aid." },

  // D2
  { name: "UNC Pembroke", division: "D2", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Very affordable NC public D2 ($500 tuition program for some)." },
  { name: "Winston-Salem State University", division: "D2", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "HBCU; affordable public D2 (CIAA)." },
  { name: "Fayetteville State University", division: "D2", state: "NC", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "HBCU; low-cost NC public D2." },
  { name: "Lenoir-Rhyne University", division: "D2", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "SAC conference; merit + athletic aid." },
  { name: "Wingate University", division: "D2", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "SAC; merit scholarships." },
  { name: "Catawba College", division: "D2", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "SAC; strong merit aid." },

  // D3
  { name: "Emory University", division: "D3", state: "GA", region: "SE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "Meets full need; strong aid + some merit scholarships." },
  { name: "Guilford College", division: "D3", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "NC D3; merit scholarships." },
  { name: "Greensboro College", division: "D3", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "USA South D3; merit + accessible admissions." },
  { name: "Methodist University", division: "D3", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "NC D3; merit aid." },

  // JUCO / NAIA
  { name: "Louisburg College", division: "JUCO", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Historic NC JUCO basketball pipeline to D1." },
  { name: "Northwest Florida State College", division: "JUCO", state: "FL", region: "SE", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Elite JUCO pipeline to D1; very low cost of entry." },
  { name: "Montreat College", division: "NAIA", state: "NC", region: "SE", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "NC NAIA; athletic + academic aid stack." },

  /* ===================== MIDWEST ===================== */
  { name: "University of Michigan", division: "D1", state: "MI", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "Go Blue Guarantee covers tuition for in-state low-income families." },
  { name: "University of Chicago", division: "D3", state: "IL", region: "MW", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: true, selectivity: "highly-selective", note: "No Barriers program; free tuition under income threshold." },
  { name: "Wisconsin–Whitewater", division: "D3", state: "WI", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "moderate", note: "Perennial D3 contender; affordable public." },
  { name: "Northwest Missouri State", division: "D2", state: "MO", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Affordable, winning D2 athletics culture." },
  { name: "Grand View University", division: "NAIA", state: "IA", region: "MW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "open", note: "Generous stacking of athletic + need aid." },
  { name: "Vincennes University", division: "JUCO", state: "IN", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Historic JUCO program; affordable launchpad." },
  { name: "Hutchinson Community College", division: "JUCO", state: "KS", region: "MW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "open", note: "Powerhouse JUCO; strong transfer-up track record." },
  { name: "Calvin University", division: "D3", state: "MI", region: "MW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Strong D3 program; solid merit aid." },

  /* ===================== SOUTHWEST ===================== */
  { name: "University of Texas at Austin", division: "D1", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Texas Advance covers tuition for families under an income threshold." },
  { name: "West Texas A&M University", division: "D2", state: "TX", region: "SW", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Low tuition; strong regional D2 basketball." },
  { name: "Oklahoma City University", division: "NAIA", state: "OK", region: "SW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Storied NAIA basketball; athletic + academic aid." },
  { name: "Trinity University", division: "D3", state: "TX", region: "SW", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Top TX D3; strong merit scholarships." },

  /* ===================== WEST ===================== */
  { name: "University of California, Berkeley", division: "D1", state: "CA", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Blue and Gold Plan covers tuition for lower-income CA families." },
  { name: "Gonzaga University", division: "D1", state: "WA", region: "W", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "selective", note: "Mid-major powerhouse; solid need + merit aid." },
  { name: "Cal Poly Pomona", division: "D2", state: "CA", region: "W", type: "public", lowIncomeAffordability: "high", meetsFullNeed: false, meritAid: false, selectivity: "moderate", note: "Affordable public D2; stack Cal Grant + Pell + partial athletic." },
  { name: "Pomona College", division: "D3", state: "CA", region: "W", type: "private", lowIncomeAffordability: "high", meetsFullNeed: true, meritAid: false, selectivity: "highly-selective", note: "Meets full need, no loans. D3 = academic/need aid only." },
  { name: "The Master's University", division: "NAIA", state: "CA", region: "W", type: "private", lowIncomeAffordability: "medium", meetsFullNeed: false, meritAid: true, selectivity: "moderate", note: "Competitive NAIA West program." },
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
