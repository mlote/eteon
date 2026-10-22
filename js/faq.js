/* =========================================================================
   MicFi - faq.js
   FAQ accordion behavior.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  M.initFaq = function () {
    var items = document.querySelectorAll("[data-faq-item]");
    if (!items.length) return;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var toggle = item.querySelector("[data-faq-toggle]");
      var answer = item.querySelector("[data-faq-answer]");
      if (!toggle || !answer) continue;

      toggle.addEventListener("click", function (el, a) {
        return function () {
          var isOpen = el.parentNode.classList.contains("is-open");
          if (isOpen) {
            el.parentNode.classList.remove("is-open");
            el.setAttribute("aria-expanded", "false");
          } else {
            el.parentNode.classList.add("is-open");
            el.setAttribute("aria-expanded", "true");
          }
        };
      }(toggle, answer));
    }
  };
})();
