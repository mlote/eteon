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
      if (!toggle) continue;

      toggle.addEventListener("click", function (el) {
        return function () {
          var parent = el.parentNode;
          var isOpen = parent.classList.contains("is-open");

          for (var j = 0; j < items.length; j++) {
            items[j].classList.remove("is-open");
            var t = items[j].querySelector("[data-faq-toggle]");
            if (t) t.setAttribute("aria-expanded", "false");
          }

          if (!isOpen) {
            parent.classList.add("is-open");
            el.setAttribute("aria-expanded", "true");
          }
        };
      }(toggle));
    }
  };
})();
