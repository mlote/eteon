/* =========================================================================
   MicFi - blog.js
   EDIT POSTS HERE.
   Each item { ... } is one blog post shown on the Blog page.
     title   - post title
     slug    - folder name of the post, e.g. "why-your-shop-needs-a-pos"
     date    - publish date "YYYY-MM-DD"
     excerpt - one or two sentences shown in the list
     image   - optional picture, e.g. "/assets/blog/pos.png"
               leave "" to show the striped placeholder tile
     tag     - optional category label
   To write a post: add an entry here, then create the folder
   blog/<slug>/index.html by copying an existing post.
   The Blog link in every menu switches itself on as soon as this list
   is not empty.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  var POSTS = [
    {
      title: "Why your shop needs a point of sale system",
      slug: "why-your-shop-needs-a-pos",
      date: "2026-10-20",
      excerpt: "If you still track sales by hand, you are losing time and money. Here is what a POS changes for a growing shop.",
      image: "",
      tag: "POS"
    }

    // Add more posts by copying the block below and editing it.
    // Keep a comma after the previous block's closing brace.
    // {
    //   title: "Post title",
    //   slug: "post-title",
    //   date: "2026-01-01",
    //   excerpt: "One or two sentences shown in the list.",
    //   image: "/assets/blog/post.png",
    //   tag: "Websites"
    // }
  ];

  // Lets the menus know when there are posts - do not delete this line.
  M.BLOG = POSTS;

  function formatDate(value) {
    var parts = String(value).split("-");
    if (parts.length !== 3) return value;
    var months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var month = parseInt(parts[1], 10) - 1;
    var day = parseInt(parts[2], 10);
    if (isNaN(month) || isNaN(day) || month < 0 || month > 11) return value;
    return months[month] + " " + day + ", " + parts[0];
  }

  function monthYear(value) {
    var parts = String(value).split("-");
    if (parts.length !== 3) return value;
    var months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var month = parseInt(parts[1], 10) - 1;
    if (isNaN(month) || month < 0 || month > 11) return value;
    return months[month] + " " + parts[0];
  }

  M.blogDate = formatDate;
  M.blogMonthYear = monthYear;

  function sortedPosts() {
    var copy = POSTS.slice();
    copy.sort(function (a, b) {
      return String(b.date).localeCompare(String(a.date));
    });
    return copy;
  }

  function postCard(post) {
    var thumb = post.image
      ? '<img class="post-thumb-img" src="' + M.esc(post.image) + '" alt="" loading="lazy">'
      : '<span class="thumb-mark">M</span>';

    var tags = post.tag ? '<div class="project-tags"><span class="tag">' + M.esc(post.tag) + "</span></div>" : "";

    return (
      '<a class="project-card post-card reveal" href="/blog/' + M.esc(post.slug) + '/">' +
      '<div class="project-thumb" aria-hidden="true">' + thumb + "</div>" +
      '<div class="project-body">' +
      tags +
      '<p class="post-date small muted">' + M.esc(formatDate(post.date)) + "</p>" +
      '<h3 class="item-title">' + M.esc(post.title) + "</h3>" +
      '<p class="small muted">' + M.esc(post.excerpt) + "</p>" +
      "</div></a>"
    );
  }

  M.initBlogList = function () {
    var target = document.querySelector("[data-blog-list]");
    if (!target) return;

    if (!POSTS.length) {
      target.innerHTML = '<p class="small muted">No posts yet. Check back soon.</p>';
      return;
    }

    var html = "";
    var list = sortedPosts();
    for (var i = 0; i < list.length; i++) html += postCard(list[i]);
    target.innerHTML = html;
  };

  M.initBlogShare = function () {
    var nodes = document.querySelectorAll("[data-blog-share]");
    if (!nodes.length) return;

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var title = node.getAttribute("data-blog-title") || document.title;
      var url = node.getAttribute("data-blog-url") || window.location.href;
      var text = title + " - via @1micfi";
      var shareUrl =
        "https://x.com/intent/post?text=" +
        encodeURIComponent(text) +
        "&url=" +
        encodeURIComponent(url);
      node.setAttribute("href", shareUrl);
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  };
})();
