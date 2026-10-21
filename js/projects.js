/* =========================================================================
   MicFi - projects.js
   EDIT PROJECTS HERE.
   Each item { ... } is one project card (Home teaser + Projects page).
     name        - project title
     type        - short tag label, e.g. "Website"
     description - one or two sentences
     image       - optional picture, e.g. "/assets/projects/shopsite.jpg"
                   leave "" to show the striped placeholder tile
     link        - optional link to the live project; leave "" if none
   To add a project, copy the example block below and edit it.
   The Projects link in every menu and the Home page section switch
   themselves on as soon as the list is not empty.
   While the list is empty, the Projects page link and Home section
   stay hidden - the site just runs without projects.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  var PROJECTS = [
    {
      name: "MicFi POS",
      type: "POS",
      description: "A point-of-sale system for shops and small retail: sales, stock, and receipts in one place.",
      image: "/assets/projects/pos.png",
      link: ""
    },
    {
      name: "MicFi HR Management System",
      type: "Management System",
      description: "An HR management system for staff records, attendance, payroll, and leave in a single place.",
      image: "/assets/projects/hrm.png",
      link: ""
    },
    {
      name: "MicFi Business",
      type: "Advanced POS",
      description: "An advanced point-of-sale for large businesses such as hotels, restaurants, and big retail. Everything in MicFi POS plus multiple branches, multiple tills, user roles, and deeper reporting.",
      image: "/assets/projects/business.png",
      link: ""
    }

    // Add more projects by copying the block below and editing it.
    // Keep a comma after the previous block's closing brace.
    // {
    //   name: "Project name",
    //   type: "Website",
    //   description: "One or two sentences about what you built.",
    //   image: "",
    //   link: ""
    // }
  ];

  // Lets the menus know when there are projects - do not delete this line.
  M.PROJECTS = PROJECTS;

  function projectCard(project) {
    var tags = "";
    tags += '<span class="tag">' + M.esc(project.type) + "</span>";

    var thumb = project.image
      ? '<img class="project-thumb-img" src="' + M.esc(project.image) + '" alt="" loading="lazy" decoding="async">'
      : '<span class="thumb-mark">M</span>';

    var inner =
      '<div class="project-thumb" aria-hidden="true">' + thumb + "</div>" +
      '<div class="project-body">' +
      '<div class="project-tags">' + tags + "</div>" +
      '<h3 class="item-title">' + M.esc(project.name) + "</h3>" +
      '<p class="small muted">' + M.esc(project.description) + "</p>" +
      "</div>";

    if (project.link) {
      var external = /^https?:\/\//i.test(project.link);
      var attrs = external
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return (
        '<a class="project-card" href="' + M.esc(project.link) + '"' + attrs + ">" + inner + "</a>"
      );
    }
    return '<article class="project-card">' + inner + "</article>";
  }

  // Shared with tools/generate-content.js so the static HTML and the
  // client-rendered HTML stay identical. No need to edit.
  M.projectCard = projectCard;

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

  function renderProjects(target, limit) {
    if (!target) return;

    if (!hasContent(target)) {
      var html = "";
      var count = limit ? Math.min(limit, PROJECTS.length) : PROJECTS.length;
      for (var i = 0; i < count; i++) html += projectCard(PROJECTS[i]);
      target.innerHTML = html;
      target.setAttribute("data-content-ready", "1");
    }

    if (target.hasAttribute("data-projects-teaser")) {
      var cards = target.querySelectorAll(".project-card");
      for (var c = 0; c < cards.length; c++) cards[c].classList.add("reveal");
    }
  }

  M.projectsSubText = function (count) {
    var n = typeof count === "number" ? count : PROJECTS.length;
    if (!n) return "Our first projects are on the way.";
    return (M.PROJECTS_PAGE && M.PROJECTS_PAGE.sub) || "A selection of our work.";
  };

  M.initProjects = function () {
    var teaser = document.querySelector("[data-projects-teaser]");
    var grid = document.querySelector("[data-projects-grid]");
    var empty = !PROJECTS.length;

    var teaserSection = teaser && teaser.closest("section");
    if (teaserSection) teaserSection.hidden = empty;

    var gridSection = grid && grid.closest("section");
    if (gridSection) gridSection.hidden = empty;

    var sub = document.querySelector("[data-projects-sub]");
    if (sub) {
      sub.textContent = M.projectsSubText();
    }

    if (empty) return;

    renderProjects(teaser, 3);
    renderProjects(grid, 0);

    var more = document.querySelector("[data-projects-more]");
    if (more) more.hidden = PROJECTS.length <= 5;
  };
})();
