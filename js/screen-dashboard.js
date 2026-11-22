/*
 * Preseason dashboard: the coach's first desk.
 * It reports the program as it stands. It does not play games, run
 * tryouts, or change spirit.
 */
(function (SP) {
  "use strict";

  const COURT_SPOTS = {
    PG: ["50%", "74%"],
    SG: ["22%", "56%"],
    SF: ["78%", "56%"],
    PF: ["32%", "32%"],
    C: ["66%", "24%"]
  };

  /**
   * Purpose: place the five starters on a half-court diagram and link
   * each name to that player's scouting note.
   */
  function courtMarkup(starters) {
    return starters.map(function (player) {
      const spot = COURT_SPOTS[player.position];
      return (
        '<button type="button" class="court-player" style="--x:' + spot[0] + ';--y:' + spot[1] + '" data-goto="roster" data-player="' + SP.escapeHtml(player.id) + '">' +
          '<span class="num">' + player.jersey + "</span> " +
          SP.escapeHtml(player.last) +
          "<small>" + SP.escapeHtml(player.position) + "</small>" +
        "</button>"
      );
    }).join("");
  }

  /**
   * Purpose: list the facts a new coach needs before tryouts: record,
   * projected finish, morale, spirit, depth, and the Conference 1 sheet.
   */
  function renderDashboard(root, ctx) {
    const career = ctx.career;
    const mirza = ctx.world.schoolsById[ctx.world.playerSchoolId];
    const conference = SP.schoolsInConference(ctx.world, mirza.conference);
    const favorite = SP.stateFavorite(ctx.world);
    const watch = mirza.roster.filter(function (player) {
      return player.academics < SP.ACADEMIC_LINE;
    });
    const lowMorale = mirza.roster.filter(function (player) {
      return player.morale < SP.MORALE_CONCERN;
    });
    const openSpots = SP.VARSITY_SIZE - mirza.roster.length;
    const starters = mirza.roster.filter(function (player) {
      return player.role === "starter";
    });
    const sixth = mirza.roster.filter(function (player) {
      return player.role === "sixth";
    })[0];

    const alerts = [
      openSpots + " varsity " + (openSpots === 1 ? "spot is" : "spots are") + " empty. A full roster holds " + SP.VARSITY_SIZE + ".",
      "School spirit is " + career.spirit + ". The crowd — the sixth player — is not in the gym."
    ];
    if (watch.length) {
      const names = watch.map(SP.playerName).join(", ");
      alerts.push(names + (watch.length === 1 ? " is" : " are") + " below the academic line of " + SP.ACADEMIC_LINE + ".");
    }
    if (lowMorale.length) {
      alerts.push(lowMorale.length + " players are under " + SP.MORALE_CONCERN + " morale.");
    }

    const rows = conference.map(function (school) {
      return SP.schoolCells(school, school.id === mirza.id);
    }).join("");

    root.innerHTML = [
      '<header class="screen-head">',
        '<p class="section-label">' + SP.escapeHtml(career.seasonLabel + " · " + career.phaseLabel + " · " + career.weekLabel) + "</p>",
        "<h1>Dashboard</h1>",
        '<p class="lede">Coach ' + SP.escapeHtml(career.coachName) + " takes over " + SP.escapeHtml(mirza.fullName) + " " + SP.escapeHtml(mirza.mascot) + ". The record is " + SP.formatRecord(0, 0) + " because no game has been played.</p>",
      "</header>",
      '<div class="stat-row">',
        statCard("Record", SP.formatRecord(0, 0), "Games have not started.", "schedule", "View the slate"),
        statCard("Projected finish", SP.ordinal(mirza.projectionRank), "Of " + mirza.conferenceSize + " in Conference " + mirza.conference + ".", "conference", "Open Conference 1", mirza.conference),
        statCard("Locker room", String(mirza.teamMorale), "Average player morale.", "program", "Open program health"),
        statCard("Sixth player", String(career.spirit), "School spirit, out of 100.", "program", "Open program health"),
      "</div>",
      '<div class="dash-grid">',
        '<section class="card">',
          '<h2>Starting five</h2>',
          '<p class="lede">Select a name to open his scouting note. Noah Park is the sixth man, beside the floor.</p>',
          '<div class="lineup">',
            '<div class="court"><span class="rim" aria-hidden="true"></span>' + courtMarkup(starters) + "</div>",
            '<button type="button" class="sixth-card" data-goto="roster" data-player="' + SP.escapeHtml(sixth.id) + '">',
              '<span class="section-label">Sixth man</span>',
              "<strong>" + SP.escapeHtml(SP.playerName(sixth)) + "</strong>",
              "<span>#" + sixth.jersey + " · " + sixth.position + " · " + SP.escapeHtml(SP.yearLabel(sixth.year)) + "</span>",
              "<span>OVR " + sixth.overall + " · Potential " + sixth.potential + "</span>",
            "</button>",
          "</div>",
        "</section>",
        '<section class="card">',
          "<h2>Desk notes</h2>",
          '<ul class="alert-list">' + alerts.map(function (text) {
            return "<li>" + SP.escapeHtml(text) + "</li>";
          }).join("") + "</ul>",
          '<div class="btn-row">',
            '<button type="button" class="btn btn-primary" data-goto="roster">Review the roster</button>',
            '<button type="button" class="btn btn-secondary" data-goto="guide">Read the rules</button>',
          "</div>",
        "</section>",
      "</div>",
      '<section class="card">',
        "<h2>Conference " + mirza.conference + " projection</h2>",
        '<p class="lede">' + SP.escapeHtml(SP.conferenceSummaries[mirza.conference]) + " The strongest program in the state is " + SP.escapeHtml(favorite.shortName) + " in Conference " + favorite.conference + ".</p>",
        '<p class="fine">Roster OVR is the average of the players on the varsity. Program strength also counts depth, recent history, and the building. Mirza\'s program number sits under its roster number because the varsity is short and the gym is empty.</p>',
        '<div class="table-scroll">',
          '<table>' + SP.schoolHead() + "<tbody>" + rows + "</tbody></table>",
        "</div>",
      "</section>"
    ].join("");
  }

  /**
   * Purpose: build one status card that also navigates to the screen
   * where that fact is explained.
   */
  function statCard(label, value, detail, target, action, conferenceId) {
    const conference = conferenceId ? ' data-conference="' + conferenceId + '"' : "";
    return (
      '<button type="button" class="stat-card" data-goto="' + target + '"' + conference + ">" +
        '<span class="stat-label">' + SP.escapeHtml(label) + "</span>" +
        '<span class="stat-value num">' + SP.escapeHtml(value) + "</span>" +
        "<span>" + SP.escapeHtml(detail) + "</span>" +
        '<span class="card-go">' + SP.escapeHtml(action) + "</span>" +
      "</button>"
    );
  }

  SP.screens = SP.screens || {};
  SP.screens.dashboard = {
    id: "dashboard",
    label: "Dashboard",
    render: renderDashboard
  };
})(window.SixthPlayer = window.SixthPlayer || {});
