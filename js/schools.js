/*
 * Division 1 boys basketball: six conferences, eight schools each.
 * Conference 1 is the league in the season brief. Mirza, the coach's
 * school, uses the Titans mascot from the season story.
 * Conferences 2 through 6 are the rest of the state, named here so the
 * office can show a full map before any game is scheduled.
 */
(function (SP) {
  "use strict";

  /**
   * Purpose: one-line identity for each conference on the map screen.
   * The lines match the program-strength spread of that conference.
   */
  SP.conferenceSummaries = {
    1: "Mirza's league. Eight programs, and the Titans are projected last.",
    2: "A balanced group. No giant at the top, and no empty night either.",
    3: "Strength sits in the top half. The bottom is still a full varsity.",
    4: "The deepest conference in Division 1. State contenders live here.",
    5: "A physical conference. The favorite is real, and the basement is soft.",
    6: "A rebuilding region. One program is dangerous. Most are searching."
  };

  /* Jersey colors that stay visible on the dark office background. */
  const PALETTE = [
    ["#2f6f9f", "#f0d48a"],
    ["#8a3e6a", "#f0d0e0"],
    ["#3f6b46", "#d7e6c8"],
    ["#8a5a2a", "#f3ddb0"],
    ["#244e8a", "#d5e2f7"],
    ["#7a3e2a", "#f3d2c4"],
    ["#3d5c4a", "#e7d27a"],
    ["#5a3d7a", "#e6d8f5"],
    ["#1f6f78", "#d4f0f2"],
    ["#7a5340", "#f0e0d4"],
    ["#3a4a7a", "#d9def5"],
    ["#6d5a1f", "#f3e7b8"],
    ["#6a2f3a", "#f4d5db"],
    ["#2a5a4a", "#d5efe4"],
    ["#4a5a2a", "#e4efc8"],
    ["#2a4a6a", "#d5e6f2"]
  ];

  /**
   * Purpose: turn a school name into the id used in saves, buttons, and
   * player ids. "Santos Madrid" becomes "santos-madrid".
   */
  function slug(name) {
    return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  /**
   * Purpose: build one school definition. Colors may be omitted for
   * generated schools; the palette assigns those after the list is made.
   */
  function school(conference, name, mascot, prestige, colors) {
    return {
      id: slug(name),
      name: name,
      mascot: mascot,
      conference: conference,
      prestige: prestige,
      colors: colors || null,
      playerSchool: name === "Mirza"
    };
  }

  const conferenceOne = [
    school(1, "Pearman", "Platypuses", 62, ["#1f7a4d", "#f2d15a"]),
    school(1, "Austrenga", "Kangaroos", 54, ["#8d3140", "#f0d48a"]),
    school(1, "Singh", "Olympians", 70, ["#3d2f7a", "#f4f1ea"]),
    school(1, "Grimm", "Reapers", 78, ["#8e2f2f", "#f0d0d0"]),
    school(1, "Santos Madrid", "Panthers", 66, ["#d4652f", "#f2e6d8"]),
    school(1, "Mirza", "Titans", 36, ["#16324f", "#e2b657"]),
    school(1, "Chang", "Dragons", 74, ["#a32030", "#e2b657"]),
    school(1, "Ruehs", "Gorillas", 58, ["#2f5d50", "#d5ddd8"])
  ];

  const restOfDivision = [
    school(2, "Okonkwo", "Stallions", 72),
    school(2, "Petrov", "Wolves", 68),
    school(2, "Nakamura", "Falcons", 64),
    school(2, "Bergstrom", "Vikings", 60),
    school(2, "Alvarez", "Comets", 56),
    school(2, "Kowalski", "Bison", 52),
    school(2, "Qureshi", "Scorpions", 49),
    school(2, "Nguyen", "Phoenix", 45),

    school(3, "Okafor", "Lions", 76),
    school(3, "Brennan", "Hawks", 71),
    school(3, "Ibarra", "Jaguars", 66),
    school(3, "Feldman", "Knights", 62),
    school(3, "Cho", "Tigers", 58),
    school(3, "Moreau", "Eagles", 54),
    school(3, "Diallo", "Cobras", 50),
    school(3, "Lindqvist", "Rams", 46),

    school(4, "Adeyemi", "Thunder", 88),
    school(4, "Rossi", "Sharks", 84),
    school(4, "Kapoor", "Spartans", 80),
    school(4, "Halvorsen", "Bears", 77),
    school(4, "Duarte", "Mustangs", 73),
    school(4, "Nowak", "Owls", 69),
    school(4, "Mensah", "Pythons", 65),
    school(4, "Sato", "Foxes", 61),

    school(5, "Abadi", "Hornets", 74),
    school(5, "MacLeod", "Highlanders", 69),
    school(5, "Vasquez", "Bulls", 65),
    school(5, "Eriksson", "Storm", 61),
    school(5, "Pruitt", "Ravens", 57),
    school(5, "El-Sayed", "Miners", 53),
    school(5, "Horvat", "Badgers", 49),
    school(5, "Leclerc", "Lynx", 44),

    school(6, "Boateng", "Wildcats", 67),
    school(6, "Kim", "Cougars", 58),
    school(6, "Sokolov", "Wolverines", 54),
    school(6, "Andersen", "Trojans", 50),
    school(6, "Costa", "Cardinals", 47),
    school(6, "Ibrahim", "Griffins", 43),
    school(6, "Walsh", "Pirates", 40),
    school(6, "Ferrara", "Bulldogs", 36)
  ];

  const defs = conferenceOne.concat(restOfDivision);
  let paletteIndex = 0;
  defs.forEach(function (def) {
    def.fullName = def.name + " High School";
    def.shortName = def.name + " " + def.mascot;
    if (!def.colors) {
      def.colors = PALETTE[paletteIndex % PALETTE.length];
      paletteIndex += 1;
    }
  });

  SP.schoolDefs = defs;

  /**
   * Purpose: collect surnames that generated players must not use,
   * including each part of a two-word school name.
   */
  SP.schoolSurnameBan = function () {
    const banned = new Set();
    SP.schoolDefs.forEach(function (def) {
      def.name.toLowerCase().split(/[^a-z0-9]+/).forEach(function (part) {
        if (part.length >= 3) {
          banned.add(part);
        }
      });
    });
    return banned;
  };
})(window.SixthPlayer = window.SixthPlayer || {});
