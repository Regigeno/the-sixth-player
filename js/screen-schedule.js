/*
 * The Conference 1 slate, without dates or scores.
 * Tip-off is assigned after tryouts. This screen only tells the coach
 * who is on the other bench.
 */
(function (SP) {
  "use strict";

  /**
   * Purpose: list Mirza's seven conference opponents with a scouting
   * note built from depth and program strength.
   */
  function renderSchedule(root, ctx) {
    const mirza = ctx.world.schoolsById[ctx.world.playerSchoolId];
    const conference = SP.schoolsInConference(ctx.world, mirza.conference);
    const opponents = conference.filter(function (school) {
      return school.id !== mirza.id;
    });

    const rows = opponents.map(function (school) {
      return (
        "<tr>" +
          "<td>" + SP.swatch(school) + SP.escapeHtml(school.shortName) + "</td>" +
          '<td class="num">' + SP.escapeHtml(SP.ordinal(school.projectionRank)) + "</td>" +
          '<td class="num">' + school.roster.length + "</td>" +
          '<td class="num">' + school.rosterOverall + "</td>" +
          '<td class="num">' + school.prestige + "</td>" +
          "<td>After tryouts</td>" +
          "<td>" + SP.escapeHtml(SP.scoutOpponent(school, mirza, conference)) + "</td>" +
        "</tr>"
      );
    }).join("");

    root.innerHTML = [
      '<header class="screen-head">',
        '<p class="section-label">Conference ' + mirza.conference + " · " + SP.escapeHtml(ctx.career.weekLabel) + "</p>",
        "<h1>Schedule</h1>",
        "<p class=\"lede\">Mirza will see each of these seven programs in conference play. Home-and-home dates are posted after tryouts. Non-conference games are not on the sheet yet. The record stays " + SP.formatRecord(0, 0) + ".</p>",
      "</header>",
      '<div class="table-scroll">',
        "<table>",
          '<caption class="visually-hidden">Conference 1 opponents, preseason projection, and scouting notes. No scores are listed.</caption>',
          "<thead><tr>",
            '<th scope="col">Opponent</th>',
            '<th scope="col">Projection</th>',
            '<th scope="col">Varsity</th>',
            '<th scope="col">Roster OVR</th>',
            '<th scope="col">Program strength</th>',
            '<th scope="col">Tip-off</th>',
            '<th scope="col">Scouting note</th>',
          "</tr></thead>",
          "<tbody>" + rows + "</tbody>",
        "</table>",
      "</div>"
    ].join("");
  }

  SP.screens = SP.screens || {};
  SP.screens.schedule = {
    id: "schedule",
    label: "Schedule",
    render: renderSchedule
  };
})(window.SixthPlayer = window.SixthPlayer || {});
