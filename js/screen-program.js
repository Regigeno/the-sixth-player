/*
 * Program health: school spirit, locker-room morale, grades, and depth.
 * The numbers are readable here. This screen does not raise or lower them.
 */
(function (SP) {
  "use strict";

  /**
   * Purpose: show the two culture numbers and the players who need
   * attention, using the same thresholds as the dashboard.
   */
  function renderProgram(root, ctx) {
    const mirza = ctx.world.schoolsById[ctx.world.playerSchoolId];
    const spirit = ctx.career.spirit;
    const watch = mirza.roster.filter(function (player) {
      return player.academics < SP.ACADEMIC_LINE;
    }).slice().sort(function (a, b) {
      return a.academics - b.academics;
    });
    const lowMorale = mirza.roster.filter(function (player) {
      return player.morale < SP.MORALE_CONCERN;
    }).slice().sort(function (a, b) {
      return a.morale - b.morale;
    });
    const openSpots = SP.VARSITY_SIZE - mirza.roster.length;

    const watchList = watch.length
      ? "<ul>" + watch.map(function (player) {
        return "<li><button type=\"button\" class=\"name-btn\" data-goto=\"roster\" data-player=\"" + SP.escapeHtml(player.id) + "\">" +
          SP.escapeHtml(SP.playerName(player)) + "</button> — grades " + player.academics + "</li>";
      }).join("") + "</ul>"
      : "<p>Nobody on the varsity is under the academic line.</p>";

    const moraleList = lowMorale.length
      ? "<ul>" + lowMorale.map(function (player) {
        return "<li><button type=\"button\" class=\"name-btn\" data-goto=\"roster\" data-player=\"" + SP.escapeHtml(player.id) + "\">" +
          SP.escapeHtml(SP.playerName(player)) + "</button> — morale " + player.morale + "</li>";
      }).join("") + "</ul>"
      : "<p>Nobody on the varsity is under " + SP.MORALE_CONCERN + " morale.</p>";

    root.innerHTML = [
      '<header class="screen-head">',
        '<p class="section-label">' + SP.escapeHtml(mirza.shortName) + "</p>",
        "<h1>Program health</h1>",
        "<p class=\"lede\">Two different problems sit in this building. The players are discouraged, and the students have stopped showing up. The second one is the sixth player.</p>",
      "</header>",
      '<div class="dash-grid">',
        '<section class="card">',
          "<h2>The sixth player</h2>",
          SP.meter("School spirit", spirit),
          "<p>In this gym the crowd is the sixth player. Spirit starts at " + spirit + " because the student body has lost faith. Wins, nights worth attending, and empty buildings will move it later. Nothing on this desk changes it.</p>",
        "</section>",
        '<section class="card">',
          "<h2>Locker room</h2>",
          SP.meter("Team morale", mirza.teamMorale),
          "<p>Team morale is the average of the nine varsity players. It is not a separate dial. A player under " + SP.MORALE_CONCERN + " is named below.</p>",
          moraleList,
        "</section>",
      "</div>",
      '<div class="dash-grid">',
        '<section class="card">',
          "<h2>Academic line</h2>",
          "<p>The line is " + SP.ACADEMIC_LINE + ". The office flags the risk and does not bench anyone yet.</p>",
          watchList,
        "</section>",
        '<section class="card">',
          "<h2>Depth</h2>",
          "<p>" + mirza.roster.length + " of " + SP.VARSITY_SIZE + " varsity spots are filled. " + openSpots + " are open.</p>",
          "<ul>",
            "<li>Freshmen — tryouts not held</li>",
            "<li>JV2 — tryouts not held</li>",
            "<li>JV — tryouts not held</li>",
            "<li>Varsity reserve — tryouts not held</li>",
            "<li>Varsity — " + mirza.roster.length + " players on file</li>",
          "</ul>",
        "</section>",
      "</div>"
    ].join("");
  }

  SP.screens = SP.screens || {};
  SP.screens.program = {
    id: "program",
    label: "Program",
    render: renderProgram
  };
})(window.SixthPlayer = window.SixthPlayer || {});
