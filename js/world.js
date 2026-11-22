/*
 * Assemble the Division 1 world the office reads.
 * Schools, rosters, preseason ranks, and opponent notes are built once
 * per page load. Nothing here plays a game or changes a score.
 */
(function (SP) {
  "use strict";

  /**
   * Purpose: rank each conference by program strength so the dashboard
   * can show a preseason projection without inventing wins.
   * Ties break by school name, which keeps the order stable.
   */
  function assignProjectionRanks(schools) {
    const groups = new Map();
    schools.forEach(function (school) {
      if (!groups.has(school.conference)) {
        groups.set(school.conference, []);
      }
      groups.get(school.conference).push(school);
    });

    groups.forEach(function (group) {
      const ranked = group.slice().sort(function (a, b) {
        return b.prestige - a.prestige || a.name.localeCompare(b.name);
      });
      ranked.forEach(function (school, index) {
        school.projectionRank = index + 1;
        school.conferenceSize = ranked.length;
      });
    });
  }

  /**
   * Purpose: copy school definitions into a fresh world object and fill
   * rosters. Calling this twice must not pile a second roster onto the
   * shared definitions.
   */
  SP.buildWorld = function () {
    const schools = SP.schoolDefs.map(function (def) {
      return {
        id: def.id,
        name: def.name,
        fullName: def.fullName,
        shortName: def.shortName,
        mascot: def.mascot,
        conference: def.conference,
        prestige: def.prestige,
        colors: def.colors.slice(),
        playerSchool: def.playerSchool
      };
    });

    SP.fillRosters(schools);
    assignProjectionRanks(schools);

    const schoolsById = {};
    const playersById = {};
    schools.forEach(function (school) {
      schoolsById[school.id] = school;
      school.roster.forEach(function (player) {
        playersById[player.id] = player;
      });
    });

    const playerSchool = schools.find(function (school) {
      return school.playerSchool;
    });

    return {
      seasonLabel: "2026\u20132027",
      division: "Division 1",
      sport: "Boys Basketball",
      playerSchoolId: playerSchool.id,
      schools: schools,
      schoolsById: schoolsById,
      playersById: playersById
    };
  };

  /**
   * Purpose: list one conference in projected order, favorite first.
   */
  SP.schoolsInConference = function (world, conferenceId) {
    return world.schools
      .filter(function (school) {
        return school.conference === conferenceId;
      })
      .sort(function (a, b) {
        return a.projectionRank - b.projectionRank;
      });
  };

  /**
   * Purpose: name the single strongest program in the state, so the
   * road beyond Conference 1 is visible from the first desk.
   */
  SP.stateFavorite = function (world) {
    return world.schools.slice().sort(function (a, b) {
      return b.prestige - a.prestige || a.name.localeCompare(b.name);
    })[0];
  };

  /**
   * Purpose: write a preseason scouting note from roster size and program
   * strength. It describes the gap. It does not predict a final score.
   */
  SP.scoutOpponent = function (opponent, mirza, conferenceSchools) {
    const others = conferenceSchools.filter(function (school) {
      return school.id !== mirza.id;
    });
    let closest = others[0];
    others.forEach(function (school) {
      const schoolGap = Math.abs(school.prestige - mirza.prestige);
      const closestGap = Math.abs(closest.prestige - mirza.prestige);
      if (schoolGap < closestGap) {
        closest = school;
      }
    });

    const gap = opponent.prestige - mirza.prestige;
    const depthGap = opponent.roster.length - mirza.roster.length;
    if (opponent.id === closest.id) {
      return opponent.name + " is the nearest program in this conference. They still dress " + opponent.roster.length + " to Mirza's " + mirza.roster.length + ", with program strength " + gap + " points higher.";
    }
    if (opponent.projectionRank === 1) {
      return opponent.name + " is the favorite. Program strength " + opponent.prestige + " against Mirza's " + mirza.prestige + ", and a full varsity with no soft spot big enough to ignore.";
    }
    if (gap >= 35) {
      return opponent.name + " is a measuring stick: roster overall " + opponent.rosterOverall + ", program strength " + opponent.prestige + ", and " + depthGap + " more varsity players than Mirza.";
    }
    if (gap >= 25) {
      return opponent.name + " should be favored. Roster overall is " + opponent.rosterOverall + " and the program-strength gap is " + gap + ".";
    }
    return opponent.name + " is ahead, with a complete roster and a program strength of " + opponent.prestige + ".";
  };
})(window.SixthPlayer = window.SixthPlayer || {});
