/* =========================================================================
   MicFi - testimonials.js
   EDIT TESTIMONIALS HERE.
   One entry = one testimonial. It appears on the Home page. Comment out
   an entry with // to hide it everywhere.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  var TESTIMONIALS = [
    // Add testimonials by copying the block below and editing it.
    // {
    //   quote: "They understood our business and built exactly what we needed.",
    //   name: "Client name",
    //   role: "Business name"
    // }
  ];

  M.initTestimonials = function () {
    var target = document.querySelector("[data-testimonials]");
    if (!target) return;

    var section = target.closest("[data-testimonials-section]");
    if (!TESTIMONIALS.length) {
      if (section) section.hidden = true;
      return;
    }

    var html = "";
    for (var i = 0; i < TESTIMONIALS.length; i++) {
      var item = TESTIMONIALS[i];
      html +=
        '<article class="card testimonial-card reveal">' +
        '<p class="testimonial-quote">"' + M.esc(item.quote) + '"</p>' +
        '<div class="testimonial-person">' +
        '<span class="testimonial-name">' + M.esc(item.name) + "</span>" +
        '<span class="testimonial-role">' + M.esc(item.role) + "</span>" +
        "</div></article>";
    }
    target.innerHTML = html;
  };
})();
