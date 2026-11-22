/*
 * First and last names for generated varsity players.
 * Conference 1 schools come from the season brief. Their players, and
 * every player outside Mirza's hand-built varsity, take names from here.
 */
(function (SP) {
  "use strict";

  SP.FIRST_NAMES = [
    "Aiden", "Mateo", "Jamal", "Darius", "Chris", "Marcus", "Elijah", "Hassan",
    "Kenji", "Omar", "Leo", "Miles", "Isaac", "Jonah", "Felix", "Grant",
    "Nico", "Tariq", "Colin", "Wesley", "Pablo", "Hiro", "Soren", "Emil",
    "Yusuf", "Quinn", "Riley", "Cameron", "Avery", "Beau", "Victor", "Antoine",
    "Desmond", "Ellis", "Frank", "Gavin", "Hugo", "Ivan", "Jalen", "Kai",
    "Liam", "Marco", "Nolan", "Oscar", "Peter", "Rafael", "Seth", "Tobias",
    "Ulises", "Vincent", "Wyatt", "Xavier", "Zach", "Arjun", "Bodhi", "Callum",
    "Diego", "Elias", "Farid", "Gabriel", "Henrik", "Idris", "Jasper", "Kofi",
    "Luca", "Malik", "Nabil", "Andre", "Omaru", "Paolo", "Rohan", "Sami",
    "Theo", "Kamal", "Yahya", "Arman"
  ];

  SP.LAST_NAMES = [
    "Bennett", "Walker", "Young", "Allen", "Wright", "Scott", "Green", "Baker",
    "Adams", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner",
    "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart",
    "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey",
    "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres",
    "Peterson", "Gray", "Ramirez", "James", "Watson", "Sanders", "Price",
    "Long", "Foster", "Russell", "Hayes", "West", "Ford", "Henry", "Shaw",
    "Warren", "Boyd", "Mason", "Hunt", "Webb", "Simpson", "Porter", "Fisher",
    "Harrison", "Gibson", "McCoy", "Reynolds", "Carlson", "Olson", "Hansen",
    "Berg", "Lund", "Dahl", "Ito", "Mori", "Chen", "Patel", "Shah", "Rahman",
    "Owusu", "Traore", "Diop", "Conte", "Bianchi", "Greco", "Silva", "Rocha",
    "Almeida", "Barbosa", "Ferreira", "Navarro", "Vargas", "Reyes", "Cruz",
    "Yamamoto", "Tanaka", "Suzuki", "Kobayashi", "Novak", "Keller", "Schneider",
    "Vogel", "Bauer", "Hoffman", "Horvath", "Duval", "Moretti", "Santana",
    "Espinoza", "Okeke", "Adebayo", "Mensah", "Diallo", "Cho", "Kim", "Sato",
    "Nguyen", "Costa", "Walsh", "Rossi", "Nowak", "Kowalski", "Singh", "Chang"
  ];

  /**
   * Purpose: hand out unique "First Last" pairs for generated players.
   * School surnames and Mirza's varsity last names are banned so the
   * coach never meets a second Hale or a player who shares a school's name.
   * The same seed rebuilds the same names.
   */
  SP.createNameSource = function (rng, bannedLastNames) {
    const banned = bannedLastNames || new Set();
    const lasts = SP.LAST_NAMES.filter(function (last) {
      return !banned.has(last.toLowerCase());
    });
    const used = new Set();

    if (!SP.FIRST_NAMES.length || !lasts.length) {
      throw new Error("The player name bank is empty.");
    }

    return function takeName() {
      for (let attempt = 0; attempt < 800; attempt += 1) {
        const first = SP.FIRST_NAMES[Math.floor(rng() * SP.FIRST_NAMES.length)];
        const last = lasts[Math.floor(rng() * lasts.length)];
        const full = (first + " " + last).toLowerCase();
        if (used.has(full)) {
          continue;
        }
        used.add(full);
        return { first: first, last: last };
      }
      throw new Error("Could not draw a unique player name.");
    };
  };
})(window.SixthPlayer = window.SixthPlayer || {});
