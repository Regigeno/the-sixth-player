/*
 * The six-conference map.
 * Ranks are a preseason projection from program strength. They will
 * not change until games exist.
 */
(function (SP) {
  "use strict";

  /**
   * Purpose: show one conference's eight schools, with Mirza marked when
   * the coach is looking at Conference 1.
   */
  function renderConference(root, ctx) {
    const selectedId = SP.ui.conferenceId || 1;
    const mirza = ctx.world.schoolsById[ctx.world.playerSchoolId];
    const schools = SP.schoolsInConference(ctx.world, selectedId);
    const favorite = SP.stateFavorite(ctx.world);

    const tabs = [1, 2, 3, 4, 5, 6].map(function (id) {
      const selected = id === selectedId;
      return (
        '<button type="button" class="tab" role="tab" id="tab-' + id + '" data-conference="' + id + '" aria-controls="conf-panel" aria-selected="' + (selected ? "true" : "false") + '" tabindex="' + (selected ? "0" : "-1") + '">' +
          "Conference " + id +
        "</button>"
      );
    }).join("");

    const rows = schools.map(function (school) {
      return SP.schoolCells(school, school.id === mirza.id);
    }).join("");

    root.innerHTML = [
      '<header class="screen-head">',
        '<p class="section-label">' + SP.escapeHtml(ctx.world.division + " · " + ctx.world.sport) + "</p>",
        "<h1>Conferences</h1>",
        "<p class=\"lede\">Six conferences, eight schools each. " + SP.escapeHtml(favorite.shortName) + " has the highest program strength in the state. Use the arrow keys to move between conferences.</p>",
      "</header>",
      '<div class="tabs" role="tablist" aria-label="Conferences">' + tabs + "</div>",
      '<section class="card" id="conf-panel" role="tabpanel" aria-labelledby="tab-' + selectedId + '">',
        "<h2>Conference " + selectedId + "</h2>",
        "<p>" + SP.escapeHtml(SP.conferenceSummaries[selectedId]) + "</p>",
        '<p class="fine">Rank is the preseason projection. It is not a standings page, because every team is ' + SP.formatRecord(0, 0) + ".</p>",
        '<div class="table-scroll">',
          "<table>" + SP.schoolHead() + "<tbody>" + rows + "</tbody></table>",
        "</div>",
      "</section>"
    ].join("");
  }

  SP.screens = SP.screens || {};
  SP.screens.conference = {
    id: "conference",
    label: "Conferences",
    render: renderConference
  };
})(window.SixthPlayer = window.SixthPlayer || {});
