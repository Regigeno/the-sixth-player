/*
 * The coach's saved season.
 * This step stores the coach's name, the phase, and school spirit.
 * Rosters live in the world, not in the save, so a saved office cannot
 * drift away from the league on the next visit.
 */
(function (SP) {
  "use strict";

  const STORAGE_KEY = "sixth-player-career-v1";

  SP.SCREENS = ["dashboard", "roster", "conference", "schedule", "program", "guide"];

  /**
   * Purpose: accept a clipboard name that can be shown in the header.
   * Letters from any language are allowed. Numbers and symbols are not,
   * except apostrophes, hyphens, spaces, and periods.
   */
  SP.validateCoachName = function (raw) {
    const trimmed = String(raw || "").trim().replace(/\s+/g, " ");
    if (!trimmed) {
      return { ok: false, error: "Enter the name you want on the clipboard." };
    }
    if (trimmed.length < 2) {
      return { ok: false, error: "Use at least 2 characters." };
    }
    if (trimmed.length > 24) {
      return { ok: false, error: "Use 24 characters or fewer." };
    }
    if (!/^[\p{L}][\p{L} .'\-]*$/u.test(trimmed)) {
      return { ok: false, error: "Use letters, spaces, apostrophes, or hyphens." };
    }
    return { ok: true, name: trimmed };
  };

  /**
   * Purpose: build a new preseason career. Spirit starts low because the
   * student body has stopped coming. The record is not stored: it is 0–0
   * until a later step actually plays games.
   */
  SP.createCareer = function (coachName) {
    return {
      version: 1,
      coachName: coachName,
      seasonLabel: "2026\u20132027",
      phase: "preseason",
      phaseLabel: "Preseason",
      weekLabel: "Tryouts ahead",
      spirit: 18,
      lastScreen: "dashboard"
    };
  };

  /**
   * Purpose: read a career back from this browser. A broken or outdated
   * save is ignored so the coach can start clean instead of seeing a
   * half-loaded office.
   */
  SP.readCareer = function () {
    let raw;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
    if (!raw) {
      return null;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return null;
    }
    if (!parsed || parsed.version !== 1) {
      return null;
    }

    const nameCheck = SP.validateCoachName(parsed.coachName);
    if (!nameCheck.ok) {
      return null;
    }

    const spirit = SP.clamp(Math.round(Number(parsed.spirit)), 0, 100);
    const lastScreen = SP.SCREENS.indexOf(parsed.lastScreen) === -1
      ? "dashboard"
      : parsed.lastScreen;

    return {
      version: 1,
      coachName: nameCheck.name,
      seasonLabel: "2026\u20132027",
      phase: "preseason",
      phaseLabel: "Preseason",
      weekLabel: "Tryouts ahead",
      spirit: Number.isFinite(spirit) ? spirit : 18,
      lastScreen: lastScreen
    };
  };

  /**
   * Purpose: keep the career in this browser. Returns false when storage
   * is blocked, so the office can say the visit will not survive a reload.
   * The in-memory career still works for the rest of the tab.
   */
  SP.writeCareer = function (career) {
    const stored = {
      version: 1,
      coachName: career.coachName,
      spirit: career.spirit,
      lastScreen: career.lastScreen,
      savedAt: new Date().toISOString()
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      return true;
    } catch (error) {
      return false;
    }
  };
})(window.SixthPlayer = window.SixthPlayer || {});
