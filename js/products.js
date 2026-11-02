/* =========================================================================
   MicFi - products.js
   EDIT PRODUCTS HERE.
   Each item { ... } is one product card (Home teaser + Products page).
     name        - product title
     type        - short tag label, e.g. "Website"
     description - one or two sentences
     image       - optional picture, e.g. "/assets/products/shopsite.jpg"
                   leave "" to show the striped placeholder tile
     link        - optional link to the live product; leave "" if none
   To add a product, copy the example block below and edit it.
   The Products link in every menu and the Home page section switch
   themselves on as soon as the list is not empty.
   While the list is empty, the Products page link and Home section
   stay hidden - the site just runs without products.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  var PRODUCTS = [
    {
      name: "MicFi POS",
      type: "POS",
      description: "A point-of-sale system for shops and small retail: sales, stock, and receipts in one place.",
      image: "/assets/products/pos.png",
      link: ""
    },
    {
      name: "MicFi HR Management System",
      type: "Management System",
      description: "An HR management system for staff records, attendance, payroll, and leave in a single place.",
      image: "/assets/products/hrm.png",
      link: ""
    },
    {
      name: "Hotspot WiFi Billing System",
      type: "Billing System",
      description: "Track hotspot sales, accept Mobile Money, manage voucher distribution, send SMS alerts, and more.",
      image: "/assets/products/wifi.png",
      link: ""
    }

    // Add more products by copying the block below and editing it.
    // Keep a comma after the previous block's closing brace.
    // {
    //   name: "Product name",
    //   type: "Website",
    //   description: "One or two sentences about what you built.",
    //   image: "",
    //   link: ""
    // }
  ];

  // Lets the menus know when there are products - do not delete this line.
  M.PRODUCTS = PRODUCTS;

  function productCard(product) {
    var tags = "";
    tags += '<span class="tag">' + M.esc(product.type) + "</span>";

    var thumb = product.image
      ? '<img class="media-thumb-img" src="' + M.esc(product.image) + '" alt="" loading="lazy" decoding="async">'
      : '<span class="thumb-mark">M</span>';

    var inner =
      '<div class="media-thumb" aria-hidden="true">' + thumb + "</div>" +
      '<div class="media-body">' +
      '<div class="media-tags">' + tags + "</div>" +
      '<h3 class="item-title">' + M.esc(product.name) + "</h3>" +
      '<p class="small muted">' + M.esc(product.description) + "</p>" +
      "</div>";

    if (product.link) {
      var external = /^https?:\/\//i.test(product.link);
      var attrs = external
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return (
        '<a class="media-card" href="' + M.esc(product.link) + '"' + attrs + ">" + inner + "</a>"
      );
    }
    return '<article class="media-card">' + inner + "</article>";
  }

  // Shared with tools/generate-content.js so the static HTML and the
  // client-rendered HTML stay identical. No need to edit.
  M.productCard = productCard;

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

  function renderProducts(target, limit) {
    if (!target) return;

    if (!hasContent(target)) {
      var html = "";
      var count = limit ? Math.min(limit, PRODUCTS.length) : PRODUCTS.length;
      for (var i = 0; i < count; i++) html += productCard(PRODUCTS[i]);
      target.innerHTML = html;
      target.setAttribute("data-content-ready", "1");
    }

    if (target.hasAttribute("data-products-teaser")) {
      var cards = target.querySelectorAll(".media-card");
      for (var c = 0; c < cards.length; c++) cards[c].classList.add("reveal");
    }
  }

  M.productsSubText = function (count) {
    var n = typeof count === "number" ? count : PRODUCTS.length;
    if (!n) return "Our first products are on the way.";
    return (M.PRODUCTS_PAGE && M.PRODUCTS_PAGE.sub) || "A selection of our products.";
  };

  M.initProducts = function () {
    var teaser = document.querySelector("[data-products-teaser]");
    var grid = document.querySelector("[data-products-grid]");
    var empty = !PRODUCTS.length;

    var teaserSection = teaser && teaser.closest("section");
    if (teaserSection) teaserSection.hidden = empty;

    var gridSection = grid && grid.closest("section");
    if (gridSection) gridSection.hidden = empty;

    var sub = document.querySelector("[data-products-sub]");
    if (sub) {
      sub.textContent = M.productsSubText();
    }

    if (empty) return;

    renderProducts(teaser, 3);
    renderProducts(grid, 0);

    var more = document.querySelector("[data-products-more]");
    if (more) more.hidden = PRODUCTS.length <= 5;
  };
})();
