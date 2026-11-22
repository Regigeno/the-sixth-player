/*
 * Checks the league the office builds.
 * Run from the project root: node tools/check-world.js
 * No packages. This does not open a browser.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const files = [
  "js/util.js",
  "js/names.js",
  "js/schools.js",
  "js/roster.js",
  "js/world.js",
  "js/career.js"
];

const sandbox = { console: console };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

files.forEach(function (file) {
  const code = fs.readFileSync(path.join(root, file), "utf8");
  vm.runInContext(code, sandbox, { filename: file });
});

const SP = sandbox.SixthPlayer;
const failures = [];

function check(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

function unique(list) {
  return new Set(list).size === list.length;
}

const weightSum = Object.keys(SP.STAT_WEIGHTS).reduce(function (sum, key) {
  return sum + SP.STAT_WEIGHTS[key];
}, 0);
check(Math.abs(weightSum - 1) < 0.0001, "stat weights must sum to 1");
check(unique(SP.FIRST_NAMES), "first names must be unique");
check(unique(SP.LAST_NAMES), "last names must be unique");

const nameCheck = SP.validateCoachName("José Muñoz");
check(nameCheck.ok && nameCheck.name === "José Muñoz", "unicode coach names should pass");
check(!SP.validateCoachName("").ok, "empty coach names should fail");
check(!SP.validateCoachName("A").ok, "one-letter coach names should fail");
check(!SP.validateCoachName("Coach 1").ok, "digits in a coach name should fail");
check(SP.validateCoachName("Mary-Jane O'Neil").ok, "apostrophes and hyphens should pass");

const world = SP.buildWorld();
const mirza = world.schoolsById.mirza;

check(world.schools.length === 48, "expected 48 schools, got " + world.schools.length);
check(unique(world.schools.map(function (school) { return school.id; })), "school ids must be unique");
check(unique(world.schools.map(function (school) { return school.mascot; })), "mascots must be unique");
check(mirza && mirza.playerSchool && mirza.mascot === "Titans", "Mirza must be the Titans");
check(mirza.roster.length === 9, "Mirza varsity must have 9 players");
check(mirza.projectionRank === 8, "Mirza must project last in Conference 1");

const banned = SP.schoolSurnameBan();
["hale", "reeves", "coleman", "ortega", "drummond", "park", "brooks", "haddad", "briggs"].forEach(function (last) {
  banned.add(last);
});

for (let conference = 1; conference <= 6; conference += 1) {
  const schools = SP.schoolsInConference(world, conference);
  check(schools.length === 8, "conference " + conference + " must have 8 schools");
  const ranks = schools.map(function (school) { return school.projectionRank; });
  check(ranks.join(",") === "1,2,3,4,5,6,7,8", "conference " + conference + " ranks must be 1 through 8");
  const strengths = schools.map(function (school) { return school.prestige; });
  check(unique(strengths), "conference " + conference + " program strengths must not tie");
}

const seenNames = new Set();
world.schools.forEach(function (school) {
  const expected = school.playerSchool ? 9 : 12;
  check(school.roster.length === expected, school.id + " roster size");
  const jerseys = school.roster.map(function (player) { return player.jersey; });
  check(unique(jerseys), school.id + " jersey numbers must be unique");
  const starters = school.roster.filter(function (player) { return player.role === "starter"; });
  check(starters.length === 5, school.id + " must have 5 starters");

  school.roster.forEach(function (player) {
    const full = player.first + " " + player.last;
    check(!seenNames.has(full.toLowerCase()), "duplicate player name " + full);
    seenNames.add(full.toLowerCase());
    if (!school.playerSchool) {
      check(!banned.has(player.last.toLowerCase()), full + " uses a reserved surname");
    }
    check(player.overall === SP.overallFromStats(player), full + " overall drifted");
    check(player.potential >= player.overall && player.potential <= 99, full + " potential");
    check(player.academics >= 1 && player.academics <= 100, full + " academics");
    check(player.morale >= 1 && player.morale <= 100, full + " morale");
    Object.keys(SP.STAT_WEIGHTS).forEach(function (key) {
      check(player[key] >= 1 && player[key] <= 99, full + " " + key);
    });
  });
});

check(SP.stateFavorite(world).id === "adeyemi", "Adeyemi should be the strongest program");
check(mirza.teamMorale < 50, "Mirza morale should start low");

const career = SP.createCareer("Alex Rivera");
check(career.spirit === 18 && career.phase === "preseason", "new career should be a low-spirit preseason");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("World checks passed.");
console.log("Schools:", world.schools.length, "Players:", seenNames.size);
console.log("Mirza roster OVR", mirza.rosterOverall, "morale", mirza.teamMorale, "strength", mirza.prestige);
mirza.roster.forEach(function (player) {
  console.log(
    player.jersey,
    player.first,
    player.last,
    player.position,
    player.role,
    "OVR",
    player.overall,
    "pot",
    player.potential,
    "grd",
    player.academics,
    "mor",
    player.morale
  );
});
