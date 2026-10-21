/* =========================================================================
   MicFi - theme.js
   Light / dark switch. No need to edit.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  M.initTheme = function () {
    var root = document.documentElement;
    var button = document.querySelector(".theme-toggle");
    if (!button) return;

    function current() {
      var attr = root.getAttribute("data-theme");
      if (attr === "light" || attr === "dark") return attr;
      return "dark";
    }

    function sync() {
      var next = current() === "dark" ? "Switch to light theme" : "Switch to dark theme";
      button.setAttribute("aria-label", next);
      button.setAttribute("title", next);
      syncThemeColor(current());
      syncLogos(current());
    }

    function syncLogos(theme) {
      var src = theme === "dark" ? "/assets/logo-dark.png" : "/assets/logo-light.png";
      var foot = document.querySelector(".footer-logo");
      if (foot && foot.getAttribute("src") !== src) {
        foot.setAttribute("src", src);
      }
    }

    function syncThemeColor(theme) {
      var color = theme === "dark" ? "#000000" : "#FFFFFF";
      var metas = document.querySelectorAll('meta[name="theme-color"]');
      for (var i = 0; i < metas.length; i++) {
        metas[i].setAttribute("content", color);
      }
    }

    button.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("micfi-theme", next);
      } catch (err) {}
      sync();
    });

    sync();
  };
})();
