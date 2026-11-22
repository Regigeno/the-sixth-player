/*
 * Page startup.
 * Builds the league, connects the clipboard, and opens the title screen.
 * Game days, tryouts, and practices are not started here.
 */
(function (SP) {
  "use strict";

  /**
   * Purpose: show or clear the clipboard's name error.
   */
  function showNameError(message) {
    const error = document.getElementById("name-error");
    const input = document.getElementById("coach-name");
    error.hidden = false;
    error.textContent = message;
    input.setAttribute("aria-invalid", "true");
    input.focus();
  }

  /**
   * Purpose: remove the name error after a valid submit or a mode change.
   */
  function clearNameError() {
    const error = document.getElementById("name-error");
    const input = document.getElementById("coach-name");
    error.hidden = true;
    error.textContent = "";
    input.removeAttribute("aria-invalid");
  }

  /**
   * Purpose: show the right clipboard actions for a first visit, a saved
   * season, or a confirmed replacement of that save.
   */
  SP.refreshTitle = function () {
    const existing = SP.readCareer();
    const mode = SP.ui.titleMode;
    const savedMode = mode === "saved";
    const replacing = mode === "confirm-replace";

    document.getElementById("saved-blurb").hidden = !savedMode;
    if (existing && savedMode) {
      document.getElementById("saved-blurb").textContent =
        "Coach " + existing.coachName + " already has a preseason file in this browser.";
    }

    document.getElementById("continue-btn").hidden = !savedMode;
    document.getElementById("restart-btn").hidden = !savedMode;
    document.getElementById("name-field").hidden = savedMode;
    document.getElementById("replace-warning").hidden = !replacing;
    document.getElementById("keep-btn").hidden = !replacing;
    document.getElementById("start-btn").hidden = savedMode;
    document.getElementById("start-btn").textContent = replacing
      ? "Replace the saved season"
      : "Open the season office";
  };

  /**
   * Purpose: connect the clipboard form. Continue reopens the saved
   * office. Starting a season validates the coach's name first.
   */
  function bindTitle() {
    const form = document.getElementById("start-form");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (SP.ui.titleMode === "saved") {
        return;
      }
      const result = SP.validateCoachName(document.getElementById("coach-name").value);
      if (!result.ok) {
        showNameError(result.error);
        return;
      }
      clearNameError();
      SP.career = SP.createCareer(result.name);
      SP.ui.conferenceId = 1;
      SP.ui.selectedPlayerId = null;
      SP.ui.rosterSort = { key: "order", dir: 1 };
      SP.openScreen("dashboard");
    });

    document.getElementById("continue-btn").addEventListener("click", function () {
      const existing = SP.readCareer();
      if (!existing) {
        SP.ui.titleMode = "new";
        SP.refreshTitle();
        return;
      }
      SP.career = existing;
      SP.openScreen(existing.lastScreen || "dashboard");
    });

    document.getElementById("restart-btn").addEventListener("click", function () {
      SP.ui.titleMode = "confirm-replace";
      clearNameError();
      SP.refreshTitle();
      document.getElementById("coach-name").focus();
    });

    document.getElementById("keep-btn").addEventListener("click", function () {
      SP.ui.titleMode = "saved";
      clearNameError();
      SP.refreshTitle();
      document.getElementById("continue-btn").focus();
    });
  }

  /**
   * Purpose: choose the clipboard mode from whatever this browser has saved,
   * then put focus on the action the coach is most likely to take.
   */
  function presentTitle() {
    const existing = SP.readCareer();
    SP.ui.titleMode = existing ? "saved" : "new";
    SP.openTitle();
    if (existing) {
      document.getElementById("continue-btn").focus();
    } else {
      document.getElementById("coach-name").focus();
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    try {
      SP.world = SP.buildWorld();
      SP.bindShell();
      bindTitle();
      presentTitle();
      document.documentElement.setAttribute("data-ready", "true");
    } catch (error) {
      const main = document.getElementById("main");
      const note = document.createElement("p");
      note.className = "boot-error";
      note.setAttribute("role", "alert");
      note.textContent = "The season office could not open. " + error.message;
      main.insertBefore(note, main.firstChild);
      console.error(error);
    }
  });
})(window.SixthPlayer = window.SixthPlayer || {});
