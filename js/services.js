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

  // Lets the menus know when there are services - do not delete this line.
  M.SERVICES = SERVICES;

  function serviceBlock(service) {
    var html =
      '<article class="service-block">' +
      '<div class="service-head">' + M.icon(service.icon, 20) +
      '<h2 class="item-title">' + M.esc(service.title) + "</h2></div>" +
      '<p class="service-text">' + M.esc(service.text) + "</p>" +
      '<ul class="chips">';
    for (var c = 0; c < service.chips.length; c++) {
      html += '<li class="chip">' + M.esc(service.chips[c]) + "</li>";
    }
    html += "</ul></article>";
    return html;
  }

  function homeServiceRow(service) {
    return (
      '<li class="row reveal">' +
      '<span class="row-icon">' + M.icon(service.icon, 20) + "</span>" +
      "<div>" +
      '<h3 class="row-title">' + M.esc(service.title) + "</h3>" +
      '<p class="row-text">' + M.esc(service.short) + "</p>" +
      "</div></li>"
    );
  }

  // Shared with tools/generate-content.js so the static HTML and the
  // client-rendered HTML stay identical. No need to edit.
  M.serviceBlock = serviceBlock;
  M.homeServiceRow = homeServiceRow;

  // The static HTML is pre-rendered by tools/generate-content.js, so the
  // container is usually already filled. Only render when it is empty.
  function hasContent(target) {
    if (target.getAttribute("data-content-ready")) return true;
    var nodes = target.childNodes;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.nodeType !== 1) continue;
      if (node.tagName === "SCRIPT" || node.tagName === "NOSCRIPT") continue;
      return true;
    }
    return false;
  }

  /* Services page - full cards */
  M.initServices = function () {
    var list = document.querySelector("[data-services]");
    if (!list) return;
    if (hasContent(list)) return;

    var html = "";
    for (var i = 0; i < SERVICES.length; i++) {
      html += serviceBlock(SERVICES[i]);
    }
    list.innerHTML = html;
    list.setAttribute("data-content-ready", "1");
  };

  /* Home page - short rows */
  M.initHomeServices = function () {
    var list = document.querySelector("[data-home-services]");
    if (!list) return;
    if (hasContent(list)) return;

    var html = "";
    for (var i = 0; i < SERVICES.length; i++) {
      html += homeServiceRow(SERVICES[i]);
    }
    list.innerHTML = html;
    list.setAttribute("data-content-ready", "1");
  };
})();
