# 🏀 Recruit Ready

**A free tool that helps families of any income find realistic, affordable college basketball programs to target for recruitment and scholarships — from D1 through D3, plus NAIA and JUCO.**

The whole goal: help a parent cut through the noise, honestly gauge where their young player realistically fits, and walk away with a **targeted list of schools** and a **step-by-step action plan** to get recruited and land a scholarship or affordable aid package.

---

## Why this exists

Recruiting advice is usually written for families who can afford $2,000 recruiting services and cross-country showcase travel. This tool is built for the family that **can't** — and turns their income situation into an *advantage* by aiming at the schools and aid programs that actually pay off for them.

It bakes in the facts that decide affordability:

| Pathway | Athletic scholarships? | The catch |
|---|---|---|
| **NCAA D1** | ✅ Full ("headcount") | Top ~1% of players; very few roster spots |
| **NCAA D2** | ✅ Usually **partial** ("equivalency") | Stack with need aid to approach a full ride |
| **NCAA D3** | ❌ **None** — rule, not choice | But elite D3s "meet full need" → can be nearly free for low income |
| **NAIA** | ✅ Often partial | Under-marketed, generous, simpler eligibility |
| **JUCO** | ✅ Many | Lowest cost of entry; play → rebuild → transfer up |

The single most important insight the tool teaches: **for a low-income family, the cheapest path to college basketball is not always the highest division.** A well-endowed D3 with strong grades can beat a partial D2 scholarship on total cost.

---

## What it does

A 5-step questionnaire (player → game → grades → budget → preferences) feeds a transparent, rule-based engine that returns:

1. **An honest athletic tier** (Elite / High / Solid / Developing) with a 0–100 score.
2. **Ranked pathways** (D1/D2/D3/NAIA/JUCO) weighing talent, grades, **and** budget together — each with the reasons why.
3. **A Reach / Target / Safety school shortlist** filtered by affordability-for-low-income and region.
4. **Academic eligibility watch-outs** (NCAA core courses, GPA sliding scale, test scores).
5. **A money strategy** (Pell, FAFSA, fee waivers, stacking aid).
6. **A personalized action checklist** to actually get recruited.

Everything runs **in the browser** — no data is uploaded or stored on any server.

---

## Run it

It's a zero-build static site. Any of these work:

```bash
# 1. Just open it
open index.html            # macOS   (xdg-open on Linux)

# 2. Or serve it locally
python3 -m http.server 8000     # then visit http://localhost:8000
```

### Deploy free
Because it's static, you can host it at no cost on **GitHub Pages**, Netlify, or Vercel:
- **GitHub Pages:** repo → *Settings → Pages → Deploy from branch → `main` / root*.

---

## Project structure

```
index.html        # markup + the 3 views (intro / wizard / results)
css/styles.css    # all styling, mobile + print friendly
js/data.js        # division facts + representative school dataset + aid facts
js/engine.js      # the recommendation engine (scoring, ranking, shortlist, checklist)
js/app.js         # wizard UI: questions, step flow, results rendering
```

To tune the logic, edit `js/engine.js`. To add schools or change the questions, edit `js/data.js` and the `STEPS` array in `js/app.js`.

---

## Honesty & accuracy notes

- This tool gives **realistic guidance, not guarantees** or official eligibility rulings.
- School costs and aid **change every year**. The dataset keeps affordability at a *categorical* level on purpose and always points families to each school's official **Net Price Calculator** for their real number.
- Verify eligibility at the **NCAA Eligibility Center** (`eligibilitycenter.org`) and the **NAIA Eligibility Center** (`play.mynaia.org`).

---

## Ideas for next versions

- Expand the school dataset (currently a representative sample across all divisions/regions).
- Save/resume a profile and email the plan.
- A coach-outreach email template generator.
- Filter by intended major.
