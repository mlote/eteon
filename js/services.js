/* =========================================================================
   MicFi - services.js
   EDIT SERVICES HERE.
   One entry = one service. It appears on the Home page (title + short)
   and on the Services page (title + full text + chips).
   Comment out an entry with // to hide that service everywhere.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  var SERVICES = [
    {
      icon: "world",
      title: "Website Development",
      short: "Professional websites that look sharp on phones, tablets, and computers.",
      text: "We design and build websites for businesses and brands. Clean layout, fast loading, and a look that fits your identity, on phones, tablets, and computers.",
      chips: ["Business sites", "E-commerce", "Blogs", "Personal and portfolio"]
    },
    {
      icon: "browser",
      title: "Web and Desktop Applications",
      short: "Custom software for the browser or your computer.",
      text: "Need software your team can open in a browser or install on a computer? We build applications around how you actually work, not the other way around.",
      chips: ["Web apps", "Desktop software", "Booking systems", "Online portals"]
    },
    {
      icon: "clipboard",
      title: "Management Systems",
      short: "POS, school, HR, and other systems that run your operations.",
      text: "We build management systems that bring your daily work into one place. From point of sale to school and HR management, we create systems that keep your records organized and your team on track.",
      chips: ["POS", "School management", "HR management", "Inventory"]
    },
    {
      icon: "puzzle",
      title: "Custom Digital Solutions",
      short: "Built around your exact problem.",
      text: "Have a need that off-the-shelf tools don't cover? Tell us the problem and we'll design and build a solution that fits.",
      chips: ["Automation", "Integrations", "Custom tools"]
    }
  ];

  /* Services page - full cards */
  M.initServices = function () {
    var list = document.querySelector("[data-services]");
    if (!list) return;

    var html = "";
    for (var i = 0; i < SERVICES.length; i++) {
      var service = SERVICES[i];
      html +=
        '<article class="service-block">' +
        '<div class="service-head">' + M.icon(service.icon, 20) +
        '<h2 class="item-title">' + M.esc(service.title) + "</h2></div>" +
        '<p class="service-text">' + M.esc(service.text) + "</p>" +
        '<ul class="chips">';
      for (var c = 0; c < service.chips.length; c++) {
        html += '<li class="chip">' + M.esc(service.chips[c]) + "</li>";
      }
      html += "</ul></article>";
    }
    list.innerHTML = html;
  };

  /* Home page - short rows */
  M.initHomeServices = function () {
    var list = document.querySelector("[data-home-services]");
    if (!list) return;

    var html = "";
    for (var i = 0; i < SERVICES.length; i++) {
      var service = SERVICES[i];
      html +=
        '<li class="row reveal">' +
        '<span class="row-icon">' + M.icon(service.icon, 20) + "</span>" +
        "<div>" +
        '<h3 class="row-title">' + M.esc(service.title) + "</h3>" +
        '<p class="row-text">' + M.esc(service.short) + "</p>" +
        "</div></li>";
    }
    list.innerHTML = html;
  };
})();
