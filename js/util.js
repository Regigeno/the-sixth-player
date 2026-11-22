/*
 * Shared numbers, labels, and text helpers.
 * The season office is plain browser JavaScript. These helpers keep
 * ratings, names, and markup consistent on every screen.
 */
(function (SP) {
  "use strict";

  /* A full Mirza varsity would carry twelve players. The program is short. */
  SP.VARSITY_SIZE = 12;

  /* Players under this grade number show up on the academic watch list. */
  SP.ACADEMIC_LINE = 65;

  /* Players under this morale number are called out on the dashboard. */
  SP.MORALE_CONCERN = 35;

  /*
   * Overall is a weighted mix of the seven court skills.
   * Academics, morale, and potential are kept separate on purpose:
   * they matter off the ball and during the season, not inside OVR.
   */
  SP.STAT_WEIGHTS = {
    shooting: 0.18,
    finishing: 0.16,
    defense: 0.18,
    playmaking: 0.14,
    athleticism: 0.14,
    iq: 0.12,
    stamina: 0.08
  };

  SP.STAT_LABELS = [
    ["shooting", "Shooting"],
    ["finishing", "Finishing"],
    ["defense", "Defense"],
    ["playmaking", "Playmaking"],
    ["athleticism", "Athleticism"],
    ["iq", "Basketball IQ"],
    ["stamina", "Stamina"]
  ];

  SP.YEAR_LABELS = {
    Fr: "Freshman",
    So: "Sophomore",
    Jr: "Junior",
    Sr: "Senior"
  };

  SP.ROLE_LABELS = {
    starter: "Starter",
    sixth: "Sixth man",
    bench: "Bench"
  };

  /**
   * Purpose: turn a school or player id into a stable random seed so the
   * same roster is built every time the office opens.
   */
  SP.hashString = function (text) {
    let hash = 2166136261;
    const source = String(text);
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  };

  /**
   * Purpose: provide a repeatable 0–1 random stream from a seed.
   * Generated schools use this so reloading never renames the league.
   */
  SP.createRng = function (seed) {
    let state = seed >>> 0;
    return function rng() {
      state = (state + 0x6d2b79f5) >>> 0;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  };

  /**
   * Purpose: keep a rating inside the office scale, usually 0–100.
   */
  SP.clamp = function (value, min, max) {
    return Math.min(max, Math.max(min, value));
  };

  /**
   * Purpose: draw an inclusive whole number from a seeded stream.
   */
  SP.rangeInt = function (rng, min, max) {
    return min + Math.floor(rng() * (max - min + 1));
  };

  /**
   * Purpose: copy and shuffle a list without changing the original pool,
   * so jersey numbers can be dealt per school.
   */
  SP.shuffle = function (rng, list) {
    const copy = list.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      const held = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = held;
    }
    return copy;
  };

  /**
   * Purpose: average a list of numbers. Empty lists report 0 so a missing
   * roster cannot break the dashboard.
   */
  SP.average = function (values) {
    if (!values.length) {
      return 0;
    }
    let sum = 0;
    values.forEach(function (value) {
      sum += value;
    });
    return sum / values.length;
  };

  /**
   * Purpose: turn the seven court skills into the single overall shown
   * on the roster. The weights live on SP.STAT_WEIGHTS and sum to 1.
   */
  SP.overallFromStats = function (stats) {
    let total = 0;
    Object.keys(SP.STAT_WEIGHTS).forEach(function (key) {
      total += Number(stats[key]) * SP.STAT_WEIGHTS[key];
    });
    return Math.round(total);
  };

  /**
   * Purpose: show a player's year as a full word in sentences and panels.
   */
  SP.yearLabel = function (year) {
    return SP.YEAR_LABELS[year] || year;
  };

  /**
   * Purpose: show a depth-chart role in plain language.
   * "Sixth man" is the first player off the bench. The game's title
   * refers to the crowd; the role label is the basketball job.
   */
  SP.roleLabel = function (role) {
    return SP.ROLE_LABELS[role] || role;
  };

  /**
   * Purpose: build the display name used everywhere a player is named.
   */
  SP.playerName = function (player) {
    return player.first + " " + player.last;
  };

  /**
   * Purpose: render height in feet and inches, the unit coaches expect.
   */
  SP.formatHeight = function (inches) {
    const whole = Math.floor(inches / 12);
    const rest = inches % 12;
    return whole + "'" + rest + "\"";
  };

  /**
   * Purpose: format a win-loss record with an en dash. This desk always
   * passes 0 and 0, because the games have not been played.
   */
  SP.formatRecord = function (wins, losses) {
    return wins + "\u2013" + losses;
  };

  /**
   * Purpose: turn 1, 2, 3, 4 into 1st, 2nd, 3rd, 4th for ranks.
   */
  SP.ordinal = function (number) {
    const mod100 = number % 100;
    if (mod100 >= 11 && mod100 <= 13) {
      return number + "th";
    }
    switch (number % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
      default:
        return number + "th";
    }
  };

  /**
   * Purpose: make coach names and school names safe to place in HTML.
   */
  SP.escapeHtml = function (value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  /**
   * Purpose: accept only real hex colors before they are written into
   * a style attribute for a school swatch.
   */
  SP.swatchStyle = function (colors) {
    const primary = colors && /^#[0-9a-fA-F]{6}$/.test(colors[0]) ? colors[0] : "#16324f";
    const trim = colors && /^#[0-9a-fA-F]{6}$/.test(colors[1]) ? colors[1] : "#e2b657";
    return "--swatch:" + primary + ";--swatch-trim:" + trim;
  };

  /**
   * Purpose: team morale is the average of the players on that roster,
   * so the dashboard and the program screen cannot disagree.
   */
  SP.averageMorale = function (roster) {
    return Math.round(SP.average(roster.map(function (player) {
      return player.morale;
    })));
  };

  /**
   * Purpose: roster overall is the average player overall, distinct from
   * program strength, which also counts depth and reputation.
   */
  SP.rosterOverall = function (roster) {
    return Math.round(SP.average(roster.map(function (player) {
      return player.overall;
    })));
  };
})(window.SixthPlayer = window.SixthPlayer || {});
