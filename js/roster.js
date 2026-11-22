/*
 * Varsity rosters.
 * Mirza's nine players are written by hand: the program is thin, and
 * these are the people the coach sees every day.
 * Every other school gets a full twelve-player varsity from its
 * program strength, so Conference 1 and the rest of the state can be
 * compared before tryouts.
 */
(function (SP) {
  "use strict";

  const JERSEYS = [
    1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25,
    30, 31, 32, 33, 34, 35, 40, 42, 44, 50, 55
  ];

  /* First five are the starting lineup. Offsets pull bench overalls down. */
  const SLOTS = [
    { position: "PG", year: "Sr", offset: 2 },
    { position: "SG", year: "Sr", offset: 4 },
    { position: "SF", year: "Jr", offset: 1 },
    { position: "PF", year: "Jr", offset: 0 },
    { position: "C", year: "Sr", offset: -1 },
    { position: "PG", year: "Jr", offset: -6 },
    { position: "SG", year: "So", offset: -7 },
    { position: "SF", year: "So", offset: -8 },
    { position: "PF", year: "Jr", offset: -10 },
    { position: "C", year: "So", offset: -11 },
    { position: "SF", year: "Fr", offset: -13 },
    { position: "SG", year: "Fr", offset: -14 }
  ];

  const BIAS = {
    PG: { shooting: 0, finishing: -4, defense: 0, playmaking: 10, athleticism: 2, iq: 6, stamina: 2 },
    SG: { shooting: 10, finishing: 2, defense: -2, playmaking: 0, athleticism: 2, iq: 0, stamina: 0 },
    SF: { shooting: 2, finishing: 2, defense: 4, playmaking: -2, athleticism: 4, iq: 0, stamina: 2 },
    PF: { shooting: -6, finishing: 6, defense: 4, playmaking: -6, athleticism: 2, iq: -2, stamina: 0 },
    C: { shooting: -10, finishing: 4, defense: 8, playmaking: -8, athleticism: -2, iq: -2, stamina: -2 }
  };

  const HEIGHT = {
    PG: [69, 75],
    SG: [72, 78],
    SF: [75, 80],
    PF: [77, 82],
    C: [79, 84]
  };

  const YEAR_RANK = { Fr: 1, So: 2, Jr: 3, Sr: 4 };
  const POSITION_RANK = { PG: 1, SG: 2, SF: 3, PF: 4, C: 5 };
  const ROLE_RANK = { starter: 1, sixth: 2, bench: 3 };

  /*
   * Mirza varsity. Nine names, three empty spots.
   * Noah Park is the sixth man. The crowd is the sixth player in the title.
   */
  const MIRZA_VARSITY = [
    {
      first: "Jordan", last: "Hale", jersey: 2, position: "PG", year: "Jr", heightIn: 71,
      shooting: 58, finishing: 55, defense: 60, playmaking: 70, athleticism: 62, iq: 64, stamina: 66,
      academics: 82, morale: 30, potential: 74, role: "starter",
      blurb: "Point guard who still sees the floor. He stopped believing the shots would fall."
    },
    {
      first: "Malik", last: "Reeves", jersey: 11, position: "SG", year: "Sr", heightIn: 74,
      shooting: 84, finishing: 76, defense: 52, playmaking: 62, athleticism: 74, iq: 64, stamina: 66,
      academics: 62, morale: 42, potential: 72, role: "starter",
      blurb: "The best scorer in the gym, and the grades that could take him off the floor."
    },
    {
      first: "Andre", last: "Coleman", jersey: 7, position: "SF", year: "Jr", heightIn: 77,
      shooting: 60, finishing: 68, defense: 66, playmaking: 52, athleticism: 80, iq: 54, stamina: 72,
      academics: 76, morale: 38, potential: 79, role: "starter",
      blurb: "Long, fast, and still learning where to be when the ball swings."
    },
    {
      first: "Luis", last: "Ortega", jersey: 32, position: "PF", year: "So", heightIn: 78,
      shooting: 48, finishing: 62, defense: 60, playmaking: 44, athleticism: 66, iq: 58, stamina: 70,
      academics: 80, morale: 36, potential: 82, role: "starter",
      blurb: "A sophomore body with a real chance to become the frontcourt."
    },
    {
      first: "Caleb", last: "Drummond", jersey: 44, position: "C", year: "Sr", heightIn: 80,
      shooting: 42, finishing: 66, defense: 74, playmaking: 40, athleticism: 52, iq: 63, stamina: 58,
      academics: 74, morale: 28, potential: 66, role: "starter",
      blurb: "Senior rim protector. He is tired of losing, and he plays like it."
    },
    {
      first: "Noah", last: "Park", jersey: 3, position: "SG", year: "So", heightIn: 73,
      shooting: 72, finishing: 64, defense: 58, playmaking: 60, athleticism: 76, iq: 66, stamina: 74,
      academics: 88, morale: 48, potential: 86, role: "sixth",
      blurb: "First player off the bench. The sixth man still wants the ball."
    },
    {
      first: "Evan", last: "Brooks", jersey: 5, position: "PG", year: "Fr", heightIn: 70,
      shooting: 54, finishing: 50, defense: 52, playmaking: 64, athleticism: 68, iq: 50, stamina: 70,
      academics: 84, morale: 40, potential: 80, role: "bench",
      blurb: "Freshman point guard called up because the room is thin."
    },
    {
      first: "Samir", last: "Haddad", jersey: 21, position: "SF", year: "Jr", heightIn: 76,
      shooting: 46, finishing: 58, defense: 74, playmaking: 48, athleticism: 70, iq: 60, stamina: 72,
      academics: 79, morale: 33, potential: 72, role: "bench",
      blurb: "Defends a wing. The offense stalls if the ball finds him in the corner."
    },
    {
      first: "Owen", last: "Briggs", jersey: 15, position: "PF", year: "Sr", heightIn: 79,
      shooting: 44, finishing: 60, defense: 62, playmaking: 42, athleticism: 55, iq: 58, stamina: 60,
      academics: 58, morale: 22, potential: 62, role: "bench",
      blurb: "Senior forward under the academic line, with one foot out of the program."
    }
  ];

  /**
   * Purpose: copy a stat line onto a player record, then set overall.
   * Potential is never allowed to sit below the current overall.
   */
  function finishPlayer(player) {
    player.overall = SP.overallFromStats(player);
    if (Number.isFinite(player.potential)) {
      player.potential = SP.clamp(Math.max(player.potential, player.overall), 1, 99);
    }
    return player;
  }

  /**
   * Purpose: build Mirza's varsity from the written list, in depth-chart order.
   */
  function buildMirzaRoster(school) {
    return MIRZA_VARSITY.map(function (source, index) {
      return finishPlayer({
        id: school.id + "-" + source.jersey,
        schoolId: school.id,
        first: source.first,
        last: source.last,
        jersey: source.jersey,
        position: source.position,
        year: source.year,
        heightIn: source.heightIn,
        shooting: source.shooting,
        finishing: source.finishing,
        defense: source.defense,
        playmaking: source.playmaking,
        athleticism: source.athleticism,
        iq: source.iq,
        stamina: source.stamina,
        academics: source.academics,
        morale: source.morale,
        potential: source.potential,
        role: source.role,
        order: index,
        blurb: source.blurb
      });
    });
  }

  /**
   * Purpose: give a non-Mirza school a twelve-player varsity whose starters
   * sit near that school's program strength and whose bench falls off.
   */
  function buildGeneratedRoster(school, takeName) {
    const rng = SP.createRng(SP.hashString("sixth-player-roster-v1:" + school.id));
    const jerseys = SP.shuffle(rng, JERSEYS).slice(0, SLOTS.length);

    return SLOTS.map(function (slot, index) {
      const name = takeName();
      const target = SP.clamp(
        Math.round(school.prestige + slot.offset + (rng() * 6 - 3)),
        40,
        93
      );
      const bias = BIAS[slot.position];
      const player = {
        id: school.id + "-" + jerseys[index],
        schoolId: school.id,
        first: name.first,
        last: name.last,
        jersey: jerseys[index],
        position: slot.position,
        year: slot.year,
        heightIn: SP.rangeInt(rng, HEIGHT[slot.position][0], HEIGHT[slot.position][1]),
        academics: rng() < 0.08 ? SP.rangeInt(rng, 50, 63) : SP.rangeInt(rng, 68, 95),
        morale: SP.clamp(Math.round(40 + (school.prestige - 60) * 0.45 + rng() * 18 - 9), 22, 92),
        role: index < 5 ? "starter" : "bench",
        order: index,
        blurb: ""
      };

      Object.keys(SP.STAT_WEIGHTS).forEach(function (key) {
        const jitter = Math.round(rng() * 10 - 5);
        player[key] = SP.clamp(Math.round(target + (bias[key] || 0) + jitter), 30, 99);
      });

      const span = { Fr: [12, 22], So: [8, 18], Jr: [3, 10], Sr: [0, 4] }[slot.year];
      finishPlayer(player);
      player.potential = SP.clamp(player.overall + SP.rangeInt(rng, span[0], span[1]), player.overall, 99);
      return player;
    });
  }

  /**
   * Purpose: attach a varsity to every school. Names are drawn in school-list
   * order from one seeded bank, so the league stays fixed between visits.
   * Reordering the school list would rename generated players.
   */
  SP.fillRosters = function (schools) {
    const banned = SP.schoolSurnameBan();
    MIRZA_VARSITY.forEach(function (player) {
      banned.add(player.last.toLowerCase());
    });
    const takeName = SP.createNameSource(
      SP.createRng(SP.hashString("sixth-player-names-v1")),
      banned
    );

    schools.forEach(function (school) {
      school.roster = school.playerSchool
        ? buildMirzaRoster(school)
        : buildGeneratedRoster(school, takeName);
      school.rosterOverall = SP.rosterOverall(school.roster);
      school.teamMorale = SP.averageMorale(school.roster);
    });
  };

  /**
   * Purpose: sort a roster for the varsity table without changing depth-chart
   * order on the school itself. Ties fall back to that depth-chart order.
   */
  SP.sortedRoster = function (roster, sort) {
    const direction = sort && sort.dir === -1 ? -1 : 1;
    const key = sort && sort.key ? sort.key : "order";
    const copy = roster.slice();

    copy.sort(function (a, b) {
      let compared = 0;
      switch (key) {
        case "jersey":
          compared = a.jersey - b.jersey;
          break;
        case "name":
          compared = (a.last + a.first).localeCompare(b.last + b.first);
          break;
        case "position":
          compared = POSITION_RANK[a.position] - POSITION_RANK[b.position];
          break;
        case "year":
          compared = YEAR_RANK[a.year] - YEAR_RANK[b.year];
          break;
        case "height":
          compared = a.heightIn - b.heightIn;
          break;
        case "overall":
          compared = a.overall - b.overall;
          break;
        case "morale":
          compared = a.morale - b.morale;
          break;
        case "academics":
          compared = a.academics - b.academics;
          break;
        case "role":
          compared = ROLE_RANK[a.role] - ROLE_RANK[b.role];
          break;
        default:
          compared = a.order - b.order;
      }
      if (compared === 0) {
        compared = a.order - b.order;
      }
      return compared * direction;
    });

    return copy;
  };
})(window.SixthPlayer = window.SixthPlayer || {});
