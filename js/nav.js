/* =========================================================================
   MicFi - nav.js
   Builds the menus (header + mobile panel + footer) and the footer social
   icons from the lists in config.js. No need to edit here - edit config.js.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  function currentPath() {
    var path = window.location.pathname || "/";
    if (path.length > 1 && path.charAt(path.length - 1) !== "/") {
      if (/\/[^/]+\.[^/]+$/.test(path)) {
        path = path.replace(/[^/]+$/, "");
      } else {
        path = path + "/";
      }
    }
    return path;
  }

  function menuHtml() {
    var here = currentPath();
    var html = "";
    for (var i = 0; i < M.PAGES.length; i++) {
      var page = M.PAGES[i];
      if (page.requires && (!M[page.requires] || M[page.requires].length === 0)) continue;
      var current = page.href === here ? ' aria-current="page"' : "";
      html += '<a href="' + M.esc(page.href) + '"' + current + ">" + M.esc(page.label) + "</a>";
    }
    return html;
  }

  M.initNav = function () {
    var nodes = document.querySelectorAll("[data-nav]");
    var html = menuHtml();
    for (var i = 0; i < nodes.length; i++) nodes[i].innerHTML = html;
  };

  var SOCIAL_KEYS = ["x", "facebook", "youtube"];

  var SOCIAL = {
    x: { label: "MicFi on X", icon: "x" },
    facebook: { label: "MicFi on Facebook", icon: "facebook" },
    youtube: { label: "MicFi on YouTube", icon: "youtube" }
  };

  M.initSocial = function () {
    var rows = document.querySelectorAll("[data-social-row]");
    if (!rows.length) return;

    var html = "";
    for (var i = 0; i < SOCIAL_KEYS.length; i++) {
      var key = SOCIAL_KEYS[i];
      var url = M.SOCIAL_LINKS[key];
      if (!url) continue;
      var item = SOCIAL[key];
      html +=
        '<a href="' + M.esc(url) + '" aria-label="' + M.esc(item.label) + '">' +
        M.icon(item.icon, 18) + "</a>";
    }

    for (var n = 0; n < rows.length; n++) rows[n].innerHTML = html;
  };
})();
