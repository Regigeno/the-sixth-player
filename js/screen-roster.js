/*
 * Mirza varsity table and the scouting note for one player.
 * Other schools' players exist in the world. This screen is the coach's
 * own locker room, so it lists only the Titans.
 */
(function (SP) {
  "use strict";

  const COLUMNS = [
    ["jersey", "#"],
    ["name", "Name"],
    ["position", "Pos"],
    ["year", "Year"],
    ["height", "Ht"],
    ["overall", "OVR"],
    ["morale", "Morale"],
    ["academics", "Grades"],
    ["role", "Role"]
  ];

  /**
   * Purpose: describe the open scouting note, including the seven court
   * skills plus the off-court numbers overall leaves out.
   */
  function detailMarkup(player) {
    if (!player) {
      return (
        '<div class="detail" id="player-detail" tabindex="-1">' +
          "<h2>Scouting note</h2>" +
          "<p>Select a name to read how that player fits the varsity.</p>" +
        "</div>"
      );
    }

    const academic = player.academics < SP.ACADEMIC_LINE
      ? SP.watchPill("Academic watch")
      : "";
    const morale = player.morale < SP.MORALE_CONCERN
      ? SP.watchPill("Low morale")
      : "";
    const meters = SP.STAT_LABELS.map(function (entry) {
      return SP.meter(entry[1], player[entry[0]]);
    }).join("");

    return (
      '<div class="detail" id="player-detail" tabindex="-1">' +
        "<h2>" + SP.escapeHtml(SP.playerName(player)) + "</h2>" +
        "<p class=\"lede\">#" + player.jersey + " · " + SP.escapeHtml(player.position) + " · " +
          SP.escapeHtml(SP.yearLabel(player.year)) + " · " + SP.escapeHtml(SP.formatHeight(player.heightIn)) +
          " · " + SP.escapeHtml(SP.roleLabel(player.role)) + "</p>" +
        (player.blurb ? "<p>" + SP.escapeHtml(player.blurb) + "</p>" : "") +
        '<p class="detail-line"><span class="num">OVR ' + player.overall + "</span>" +
          '<span class="num">Potential ' + player.potential + "</span>" +
          academic + morale + "</p>" +
        '<div class="meter-grid">' + meters + SP.meter("Academics", player.academics) + SP.meter("Morale", player.morale) + "</div>" +
      "</div>"
    );
  }

  /**
   * Purpose: draw the sortable varsity table. Sorting is a view of the
   * same nine players; it does not change the depth chart.
   */
  function renderRoster(root, ctx) {
    const mirza = ctx.world.schoolsById[ctx.world.playerSchoolId];
    const sort = SP.ui.rosterSort;
    const players = SP.sortedRoster(mirza.roster, sort);
    const selected = mirza.roster.filter(function (player) {
      return player.id === SP.ui.selectedPlayerId;
    })[0] || null;
    const openSpots = SP.VARSITY_SIZE - mirza.roster.length;

    const head = COLUMNS.map(function (column) {
      const active = sort.key === column[0];
      const aria = active ? (sort.dir === 1 ? "ascending" : "descending") : "none";
      return (
        '<th scope="col" aria-sort="' + aria + '">' +
          '<button type="button" data-sort="' + column[0] + '">' + SP.escapeHtml(column[1]) +
            '<span class="visually-hidden">, sort</span></button>' +
        "</th>"
      );
    }).join("");

    const body = players.map(function (player) {
      const pressed = selected && selected.id === player.id ? "true" : "false";
      const grades = player.academics < SP.ACADEMIC_LINE
        ? player.academics + " " + SP.watchPill("Watch")
        : String(player.academics);
      const morale = player.morale < SP.MORALE_CONCERN
        ? player.morale + " " + SP.watchPill("Low")
        : String(player.morale);
      return (
        "<tr" + (pressed === "true" ? ' class="is-selected"' : "") + ">" +
          '<td class="num">' + player.jersey + "</td>" +
          "<td><button type=\"button\" class=\"name-btn\" data-player=\"" + SP.escapeHtml(player.id) + "\" aria-pressed=\"" + pressed + "\">" +
            SP.escapeHtml(SP.playerName(player)) + "</button></td>" +
          "<td>" + SP.escapeHtml(player.position) + "</td>" +
          "<td>" + SP.escapeHtml(SP.yearLabel(player.year)) + "</td>" +
          "<td>" + SP.escapeHtml(SP.formatHeight(player.heightIn)) + "</td>" +
          '<td class="num">' + player.overall + "</td>" +
          '<td class="num">' + morale + "</td>" +
          '<td class="num">' + grades + "</td>" +
          "<td>" + SP.escapeHtml(SP.roleLabel(player.role)) + "</td>" +
        "</tr>"
      );
    }).join("");

    root.innerHTML = [
      '<header class="screen-head">',
        '<p class="section-label">' + SP.escapeHtml(mirza.fullName) + "</p>",
        "<h1>Varsity roster</h1>",
        "<p class=\"lede\">" + mirza.roster.length + " players are on the varsity. " + openSpots + " spots are open. Tryouts for freshmen, JV2, JV, varsity reserve, and varsity have not been held.</p>",
      "</header>",
      detailMarkup(selected),
      '<p class="scroll-hint">Swipe sideways to see every column.</p>',
      '<div class="table-scroll">',
        '<table>',
          "<caption class=\"visually-hidden\">Mirza Titans varsity. Choose a column heading to sort. Choose a name to read the scouting note.</caption>",
          "<thead><tr>" + head + "</tr></thead>",
          "<tbody>" + body + "</tbody>",
        "</table>",
      "</div>"
    ].join("");
  }

  SP.screens = SP.screens || {};
  SP.screens.roster = {
    id: "roster",
    label: "Roster",
    render: renderRoster
  };
})(window.SixthPlayer = window.SixthPlayer || {});
