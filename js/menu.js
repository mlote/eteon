/* =========================================================================
   MicFi - menu.js
   Mobile menu panel. No need to edit.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  M.initMenu = function () {
    var button = document.querySelector(".menu-toggle");
    var panel = document.getElementById("site-menu");
    if (!button || !panel) return;

    function isOpen() {
      return button.getAttribute("aria-expanded") === "true";
    }

    function setMenu(open) {
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("menu-open", open);
    }

    button.addEventListener("click", function () {
      setMenu(!isOpen());
    });

    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        setMenu(false);
        button.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!isOpen()) return;
      if (event.target.closest(".site-header") || event.target.closest("#site-menu")) return;
      setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768 && isOpen()) setMenu(false);
    });
  };
})();
