/*
 * The rule book for this desk.
 * Later steps add tryouts, practices, and games. The rules below describe
 * only what the office does now, so a coach is never told a button will
 * simulate a result it cannot produce.
 */
(function (SP) {
  "use strict";

  /**
   * Purpose: explain the objective, the ratings, and how to move through
   * the office with a pointer or the keyboard.
   */
  function renderGuide(root) {
    const weights = Object.keys(SP.STAT_WEIGHTS).map(function (key) {
      const label = SP.STAT_LABELS.filter(function (entry) {
        return entry[0] === key;
      })[0][1];
      return "<li>" + SP.escapeHtml(label) + " — " + Math.round(SP.STAT_WEIGHTS[key] * 100) + "%</li>";
    }).join("");

    root.innerHTML = [
      '<header class="screen-head">',
        '<p class="section-label">The Sixth Player: Road to State</p>',
        "<h1>Season rules</h1>",
        "<p class=\"lede\">You are the new coach of the Mirza Titans. The job is to climb from the bottom of Conference 1 to a Division 1 state championship. This desk is the preseason office.</p>",
      "</header>",
      '<section class="card">',
        "<h2>What you can do here</h2>",
        "<ul>",
          "<li>Read the dashboard: record, projected finish, morale, and school spirit.</li>",
          "<li>Open any varsity player and sort the roster.</li>",
          "<li>Walk all six conferences. Rank is a projection, not a result.</li>",
          "<li>Read the Conference 1 slate. Dates are not assigned yet.</li>",
          "<li>Check grades, morale, and the empty roster spots.</li>",
        "</ul>",
      "</section>",
      '<section class="card">',
        "<h2>Ratings</h2>",
        "<ul>",
          "<li>Roster OVR averages the players on that varsity. Overall uses the weights below.</li>",
          weights,
          "<li>Academics, morale, and potential are not inside overall.</li>",
          "<li>Program strength is reputation: depth, recent history, and the building. Mirza can have capable players and a weak program at the same time.</li>",
          "<li>The academic line is " + SP.ACADEMIC_LINE + ". Below it, a player is on watch.</li>",
          "<li>Morale under " + SP.MORALE_CONCERN + " is flagged. Team morale is the average of the varsity.</li>",
          "<li>School spirit is the crowd. That crowd is the sixth player in the title. Noah Park's role, sixth man, is a different job: first player off the bench.</li>",
          "<li>A full varsity is " + SP.VARSITY_SIZE + " players. Mirza has fewer than that.</li>",
          "<li>Potential is room to grow. It is never lower than current overall. The office does not train anyone yet.</li>",
        "</ul>",
      "</section>",
      '<section class="card">',
        "<h2>Moving through the office</h2>",
        "<ul>",
          "<li>Use the season menu, or press 1 through 6 when you are not typing.</li>",
          "<li>1 dashboard, 2 roster, 3 conferences, 4 schedule, 5 program, 6 rules.</li>",
          "<li>On Conferences, Left and Right move between the six leagues.</li>",
          "<li>The season file is kept in this browser. No connection is required.</li>",
        "</ul>",
      "</section>",
      '<section class="card">',
        "<h2>Not on this desk yet</h2>",
        "<ul>",
          "<li>Tryouts for freshmen, JV2, JV, varsity reserve, and varsity.</li>",
          "<li>Practices, recruiting, injuries, and game night.</li>",
          "<li>Scores, standings that move, and the state tournament.</li>",
        "</ul>",
        "<p>The season can still end more than one way: a state title, players who earn a next level, or another quiet spring. Those outcomes start after this office.</p>",
      "</section>"
    ].join("");
  }

  SP.screens = SP.screens || {};
  SP.screens.guide = {
    id: "guide",
    label: "Rules",
    render: renderGuide
  };
})(window.SixthPlayer = window.SixthPlayer || {});
