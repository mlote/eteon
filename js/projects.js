/* =========================================================================
   MicFi - projects.js
   EDIT PROJECTS HERE.
   Each item { ... } is one project card (Home teaser + Projects page).
     name        - project title
     type        - short tag label, e.g. "Website"
     description - one or two sentences
     image       - optional picture, e.g. "assets/projects/shopsite.jpg"
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
      description: "A point-of-sale system for retail shops that handles sales, stock, and receipts in one place.",
      image: "assets/projects/pos.png",
      link: ""
    },
    {
      name: "MicFi HR Management System",
      type: "Management System",
      description: "An HR management system for staff records, attendance, payroll, and leave in a single place.",
      image: "assets/projects/hr.png",
      link: ""
    },
    {
      name: "MicFi Business",
      type: "POS",
      description: "A point-of-sale system built for busy businesses, with fast checkout, sales tracking, and simple reporting.",
      image: "assets/projects/business.png",
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
      ? '<img class="project-thumb-img" src="' + M.esc(project.image) + '" alt="" loading="lazy">'
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

  function renderProjects(target, limit) {
    if (!target) return;
    var html = "";
    var count = limit ? Math.min(limit, PROJECTS.length) : PROJECTS.length;
    for (var i = 0; i < count; i++) html += projectCard(PROJECTS[i]);
    target.innerHTML = html;

    if (target.hasAttribute("data-projects-teaser")) {
      var cards = target.querySelectorAll(".project-card");
      for (var c = 0; c < cards.length; c++) cards[c].classList.add("reveal");
    }
  }

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
      sub.textContent = empty
        ? "Our first projects are on the way."
        : "A selection of our work.";
    }

    if (empty) return;

    renderProjects(teaser, 5);
    renderProjects(grid, 0);

    var more = document.querySelector("[data-projects-more]");
    if (more) more.hidden = PROJECTS.length <= 5;
  };
})();
