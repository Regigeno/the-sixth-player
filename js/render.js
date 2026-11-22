/*
 * Small HTML fragments shared by the season-office screens.
 */
(function (SP) {
  "use strict";

  /**
   * Purpose: draw a labeled 0–100 bar. The number is text, so the bar's
   * color is not the only way to read the value.
   */
  SP.meter = function (label, value) {
    const amount = SP.clamp(Math.round(Number(value) || 0), 0, 100);
    let tone = "";
    if (amount < 40) {
      tone = " is-low";
    } else if (amount >= 75) {
      tone = " is-high";
    }
    return (
      '<div class="meter' + tone + '">' +
        '<div class="meter-top"><span>' + SP.escapeHtml(label) + '</span>' +
        '<span class="num">' + amount + '</span></div>' +
        '<div class="meter-track" aria-hidden="true"><div class="meter-fill" style="width:' + amount + '%"></div></div>' +
      '</div>'
    );
  };

  /**
   * Purpose: mark a grade or morale figure when it crosses a watch line.
   */
  SP.watchPill = function (text) {
    return '<span class="pill">' + SP.escapeHtml(text) + '</span>';
  };

  /**
   * Purpose: render the school color chip beside a name.
   */
  SP.swatch = function (school) {
    return '<span class="swatch" style="' + SP.swatchStyle(school.colors) + '" aria-hidden="true"></span>';
  };

  /**
   * Purpose: one body row in a conference or schedule table.
   * `you` highlights Mirza. Rank, size, and both strength numbers are shown
   * so program reputation is not confused with roster overall.
   */
  SP.schoolCells = function (school, you) {
    const marker = you ? ' class="is-you"' : "";
    return (
      "<tr" + marker + ">" +
        "<td class=\"num\">" + school.projectionRank + "</td>" +
        "<td>" + SP.swatch(school) + SP.escapeHtml(school.shortName) +
          (you ? ' <span class="pill pill-you">You</span>' : "") + "</td>" +
        "<td class=\"num\">" + school.roster.length + "</td>" +
        "<td class=\"num\">" + school.rosterOverall + "</td>" +
        "<td class=\"num\">" + school.prestige + "</td>" +
      "</tr>"
    );
  };

  /**
   * Purpose: the column headers shared by the conference tables.
   */
  SP.schoolHead = function () {
    return (
      "<thead><tr>" +
        "<th scope=\"col\">Rank</th>" +
        "<th scope=\"col\">School</th>" +
        "<th scope=\"col\">Varsity</th>" +
        "<th scope=\"col\">Roster OVR</th>" +
        "<th scope=\"col\">Program strength</th>" +
      "</tr></thead>"
    );
  };
})(window.SixthPlayer = window.SixthPlayer || {});
