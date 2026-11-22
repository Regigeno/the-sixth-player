# The Sixth Player: Road to State

A browser basketball management simulation. You are the new coach of the Mirza High School Titans, last in Conference 1, with a thin varsity and an empty gym. The crowd is the sixth player. This step is the preseason office: the title screen, the dashboard, and the navigation between the desk, roster, conferences, schedule, program health, and rules.

Tryouts, practices, and games are not in this step. The schedule has opponents and no scores. The record stays 0–0.

## Open it

Open `index.html` in a browser. The page uses vanilla HTML, CSS, and JavaScript. It does not load libraries, fonts, or anything else from the network. A season file is kept in `localStorage` under `sixth-player-career-v1`.

From the project folder you can also run:

```bash
python3 -m http.server 8000
```

Then visit `http://127.0.0.1:8000`.

Check the generated league without a browser:

```bash
node tools/check-world.js
```

## Layout

| Path | Purpose |
| --- | --- |
| `index.html` | Title screen, office shell, and script order |
| `css/main.css` | Title screen, dashboard, tables, and small-screen layout |
| `js/util.js` | Ratings, formatting, and the overall formula |
| `js/names.js` | Name bank for generated players |
| `js/schools.js` | Six conferences, eight schools each |
| `js/roster.js` | Mirza's hand-built varsity and every other roster |
| `js/world.js` | Builds the league, ranks, and scouting notes |
| `js/career.js` | Coach name, spirit, and the browser save |
| `js/render.js` | Shared meters and table cells |
| `js/nav.js` | Shows one screen at a time and handles keys 1–6 |
| `js/screen-*.js` | Dashboard, roster, conferences, schedule, program, rules |
| `js/main.js` | Starts the page and the clipboard form |
| `tools/check-world.js` | Checks school counts, rosters, and the rating formula |

Conference 1 is the league from the season brief: Pearman, Austrenga, Singh, Grimm, Santos Madrid, Mirza, Chang, and Ruehs. Mirza's mascot is the Titans. Conferences 2 through 6, and the varsity names outside Mirza's nine, are generated for this world and stay the same on every visit.

Major functions are documented in the file where they live. Each note says what the function is for.
