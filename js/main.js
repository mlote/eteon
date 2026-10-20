/* =========================================================================
   MicFi - main.js
   Starts everything. No need to edit.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  function init() {
    M.initTheme();
    M.initMenu();
    M.initYear();
    M.initIcons();
    M.initContactLinks();
    M.initSocial();
    M.initNav();
    M.initHomeServices();
    M.initServices();
    M.initProjects();
    M.initBlogList();
    M.initBlogShare();
    M.initForm();
    M.initScrollReveal(); // keep last - it looks for everything above
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
