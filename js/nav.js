/*
 * Screen routing for the season office.
 * The title screen and the six office screens share one page. This file
 * is the only place that shows or hides them, so two screens cannot be
 * live at once.
 */
(function (SP) {
  "use strict";

  SP.ui = {
    officeOpen: false,
    titleMode: "new",
    conferenceId: 1,
    rosterSort: { key: "order", dir: 1 },
    selectedPlayerId: null
  };

  /**
   * Purpose: the bundle of career and world data every screen render receives.
   */
  SP.context = function () {
    return { career: SP.career, world: SP.world };
  };

  /**
   * Purpose: find a control by an attribute value without building a
   * selector from that value.
   */
  function focusByAttr(root, attr, value) {
    const nodes = root.querySelectorAll("[" + attr + "]");
    for (let index = 0; index < nodes.length; index += 1) {
      if (nodes[index].getAttribute(attr) === value) {
        nodes[index].focus();
        return true;
      }
    }
    return false;
  }

  /**
   * Purpose: mark the season menu item that matches the open screen.
   */
  function setActiveNav(id) {
    const buttons = document.querySelectorAll(".sidenav [data-screen]");
    buttons.forEach(function (button) {
      if (button.getAttribute("data-screen") === id) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }

  /**
   * Purpose: fill the locker-room header from the saved career.
   */
  function paintChrome(career) {
    document.getElementById("top-coach").textContent = "Coach " + career.coachName;
    document.getElementById("top-phase").textContent = career.seasonLabel + " \u00b7 " + career.phaseLabel;
  }

  /**
   * Purpose: say so when this browser refuses to store the season file.
   */
  function setSaveNote(saved) {
    const note = document.getElementById("save-note");
    if (saved) {
      note.hidden = true;
      note.textContent = "";
      return;
    }
    note.hidden = false;
    note.textContent = "This browser did not keep the season file. The office will last until you close the tab.";
  }

  /**
   * Purpose: move keyboard focus to the new screen's heading, or to a
   * player's scouting note when the coach opened that player on purpose.
   */
  function focusScreen(root, options) {
    if (options.focusDetail) {
      const detail = root.querySelector("#player-detail");
      if (detail) {
        detail.focus();
        return;
      }
    }
    const heading = root.querySelector("h1");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  }

  /**
   * Purpose: open one office screen, remember it, and try to save.
   * Unknown ids are ignored so a bad key press cannot blank the page.
   */
  SP.openScreen = function (id, options) {
    const screen = SP.screens[id];
    if (!screen || !SP.career) {
      return;
    }
    const settings = options || {};
    SP.ui.officeOpen = true;
    SP.career.lastScreen = id;
    const saved = SP.writeCareer(SP.career);

    document.getElementById("title-view").hidden = true;
    document.getElementById("app-view").hidden = false;
    document.body.setAttribute("data-office", id);
    document.title = screen.label + " \u00b7 The Sixth Player: Road to State";
    paintChrome(SP.career);
    setActiveNav(id);
    setSaveNote(saved);

    const root = document.getElementById("screen-root");
    screen.render(root, SP.context());
    focusScreen(root, settings);
  };

  /**
   * Purpose: return to the title screen without erasing the saved career.
   */
  SP.openTitle = function () {
    SP.ui.officeOpen = false;
    document.getElementById("app-view").hidden = true;
    document.getElementById("title-view").hidden = false;
    document.body.setAttribute("data-office", "title");
    document.title = "The Sixth Player: Road to State";
    if (typeof SP.refreshTitle === "function") {
      SP.refreshTitle();
    }
  };

  /**
   * Purpose: re-draw the roster after a sort or a scouting-note choice
   * without treating it as a brand-new screen visit.
   */
  function redrawRoster(focus) {
    const root = document.getElementById("screen-root");
    SP.screens.roster.render(root, SP.context());
    if (focus.detail) {
      const detail = root.querySelector("#player-detail");
      if (detail) {
        detail.focus();
      }
      return;
    }
    if (focus.sortKey) {
      focusByAttr(root, "data-sort", focus.sortKey);
    }
  }

  /**
   * Purpose: re-draw the conference map after a tab change and keep focus
   * on the selected tab.
   */
  function redrawConference(conferenceId) {
    SP.ui.conferenceId = conferenceId;
    const root = document.getElementById("screen-root");
    SP.screens.conference.render(root, SP.context());
    focusByAttr(root, "data-conference", String(conferenceId));
  }

  /**
   * Purpose: handle clicks inside the open screen: navigation, sorting,
   * conference tabs, and scouting notes.
   */
  function onScreenClick(event) {
    const root = document.getElementById("screen-root");
    const goto = event.target.closest("[data-goto]");
    if (goto && root.contains(goto)) {
      const playerId = goto.getAttribute("data-player");
      const conferenceId = goto.getAttribute("data-conference");
      if (playerId) {
        SP.ui.selectedPlayerId = playerId;
      }
      if (conferenceId) {
        SP.ui.conferenceId = Number(conferenceId);
      }
      SP.openScreen(goto.getAttribute("data-goto"), { focusDetail: !!playerId });
      return;
    }

    const sortButton = event.target.closest("[data-sort]");
    if (sortButton && root.contains(sortButton)) {
      const key = sortButton.getAttribute("data-sort");
      if (SP.ui.rosterSort.key === key) {
        SP.ui.rosterSort.dir = SP.ui.rosterSort.dir === 1 ? -1 : 1;
      } else {
        const ascending = key === "name" || key === "order" || key === "position" || key === "role";
        SP.ui.rosterSort = { key: key, dir: ascending ? 1 : -1 };
      }
      redrawRoster({ sortKey: key });
      return;
    }

    const tab = event.target.closest('[role="tab"]');
    if (tab && root.contains(tab)) {
      redrawConference(Number(tab.getAttribute("data-conference")));
      return;
    }

    const playerButton = event.target.closest("[data-player]");
    if (playerButton && root.contains(playerButton)) {
      SP.ui.selectedPlayerId = playerButton.getAttribute("data-player");
      redrawRoster({ detail: true });
    }
  }

  /**
   * Purpose: move the conference tabs with the keyboard, following the
   * left, right, home, and end keys.
   */
  function onScreenKeydown(event) {
    const tab = event.target.closest && event.target.closest('[role="tab"]');
    if (!tab) {
      return;
    }
    const tabs = Array.prototype.slice.call(document.querySelectorAll("#screen-root [role='tab']"));
    const index = tabs.indexOf(tab);
    let next = -1;
    if (event.key === "ArrowRight") {
      next = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      next = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = tabs.length - 1;
    }
    if (next === -1) {
      return;
    }
    event.preventDefault();
    redrawConference(Number(tabs[next].getAttribute("data-conference")));
  }

  /**
   * Purpose: wire the season menu, the screen-root actions, and the
   * number keys 1 through 6. Number keys do nothing on the title screen
   * and nothing while a name is being typed.
   */
  SP.bindShell = function () {
    const nav = document.querySelector(".sidenav");
    nav.addEventListener("click", function (event) {
      const button = event.target.closest("[data-screen]");
      if (!button || !nav.contains(button)) {
        return;
      }
      SP.openScreen(button.getAttribute("data-screen"));
    });

    const root = document.getElementById("screen-root");
    root.addEventListener("click", onScreenClick);
    root.addEventListener("keydown", onScreenKeydown);

    document.addEventListener("keydown", function (event) {
      if (!SP.ui.officeOpen) {
        return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      const tag = event.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) {
        return;
      }
      const keys = {
        "1": "dashboard",
        "2": "roster",
        "3": "conference",
        "4": "schedule",
        "5": "program",
        "6": "guide"
      };
      const id = keys[event.key];
      if (!id) {
        return;
      }
      event.preventDefault();
      SP.openScreen(id);
    });
  };
})(window.SixthPlayer = window.SixthPlayer || {});
