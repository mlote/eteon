/* =========================================================================
   MicFi - blog.js
   EDIT POSTS HERE.
   Each item { ... } is one blog post. Everything about a post lives here -
   the list card, the home teaser, the post page, and the RSS feed all read
   from this one list.
     title   - post title
     slug    - short url name, e.g. "why-your-shop-needs-a-pos"
               the post page is blog/<slug>/index.html
     date    - publish date "YYYY-MM-DD"
     excerpt - one or two sentences shown in the list
     image   - optional picture, e.g. "/assets/blog/pos.png"
               leave "" to show the striped placeholder tile
     tag     - optional category label
     body    - the post text written in HTML, e.g.
               "<p>Intro...</p><h2>Heading</h2><p>More...</p><ul><li>x</li></ul>"
   TO ADD A POST:
     1. Add an entry below (copy an existing one and edit it).
     2. Copy the folder blog/why-your-shop-needs-a-pos to blog/<slug>.
        You do NOT edit anything inside it - the page fills itself from here.
     3. Optionally drop an image in assets/blog/.
     4. Run:  node tools/generate-rss.js   (updates blog/rss.xml)
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
      image: "/assets/blog/pos.png",
      tag: "POS",
      body:
        "<p>If you run a shop with a notebook, a calculator, and a lot of memory, you already know the pain. Sales get missed, stock counts do not match, and at the end of the month it is hard to say what actually made money.</p>" +
        "<p>A point of sale system puts all of that in one place. Every sale is recorded, stock is updated as you sell, and a receipt is printed or sent automatically.</p>" +
        "<h2>What a POS actually changes</h2>" +
        "<ul>" +
        "<li>Every sale is recorded, so you always know your numbers.</li>" +
        "<li>Stock updates in real time, so you know what to reorder.</li>" +
        "<li>Receipts are consistent and professional.</li>" +
        "<li>Staff can sell faster with less chance of errors.</li>" +
        "</ul>" +
        "<h2>It pays for itself</h2>" +
        "<p>Most shops lose more money to untracked sales and stock errors than a POS costs. Once you can see clearly what is selling and what is not, you make better decisions.</p>" +
        "<p>We build POS systems around how your shop actually works, not a one-size-fits-all template. If you want to see one in action, get in touch.</p>"
    }

    // Add more posts by copying the block below and editing it.
    // Keep a comma after the previous block's closing brace.
    // {
    //   title: "Post title",
    //   slug: "post-title",
    //   date: "2026-01-01",
    //   excerpt: "One or two sentences shown in the list.",
    //   image: "/assets/blog/post.png",
    //   tag: "Websites",
    //   body: "<p>First paragraph...</p><h2>A heading</h2><p>More text...</p>"
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

  function renderList(target, limit) {
    if (!target) return;
    var list = sortedPosts();
    var count = limit ? Math.min(limit, list.length) : list.length;
    var html = "";
    for (var i = 0; i < count; i++) html += postCard(list[i]);
    target.innerHTML = html;
  }

  function findPost(slug) {
    for (var i = 0; i < POSTS.length; i++) {
      if (POSTS[i].slug === slug) return POSTS[i];
    }
    return null;
  }

  function slugFromPath() {
    var path = window.location.pathname || "";
    var parts = path.split("/").filter(function (p) { return p; });
    if (parts.length < 2 || parts[0] !== "blog") return "";
    if (parts[parts.length - 1] === "index.html") parts.pop();
    return parts[parts.length - 1] || "";
  }

  function setMeta(attr, name, value) {
    if (!value) return;
    var el = document.querySelector('meta[' + attr + '="' + name + '"]');
    if (el) el.setAttribute("content", value);
  }

  M.initBlogPost = function () {
    var root = document.querySelector("[data-post]");
    if (!root) return;

    var slug = root.getAttribute("data-post-slug") || slugFromPath();
    var post = findPost(slug);

    if (!post) {
      var title = document.querySelector("[data-post-title]");
      if (title) title.textContent = "Post not found";
      var body = document.querySelector("[data-post-body]");
      if (body) body.innerHTML = '<p>Sorry, that post could not be found.</p>';
      return;
    }

    var url = "https://micfi.net/blog/" + post.slug + "/";
    var fullTitle = post.title + " - MicFi";

    document.title = fullTitle;
    setMeta("name", "description", post.excerpt);
    setMeta("property", "og:title", post.title);
    setMeta("property", "og:description", post.excerpt);
    setMeta("property", "og:url", url);
    if (post.image) setMeta("property", "og:image", "https://micfi.net" + post.image);

    var titleNode = document.querySelector("[data-post-title]");
    if (titleNode) titleNode.textContent = post.title;

    var dateNode = document.querySelector("[data-post-date]");
    if (dateNode) dateNode.textContent = formatDate(post.date);

    var tagNode = document.querySelector("[data-post-tag]");
    if (tagNode) {
      if (post.tag) {
        tagNode.textContent = post.tag;
      } else {
        tagNode.hidden = true;
      }
    }

    var hero = document.querySelector("[data-post-hero]");
    if (hero && post.image) {
      hero.innerHTML =
        '<img src="' + M.esc(post.image) + '" alt="' + M.esc(post.title) + '" loading="lazy">';
    }

    var bodyNode = document.querySelector("[data-post-body]");
    if (bodyNode) bodyNode.innerHTML = post.body || "";

    var share = document.querySelector("[data-blog-share]");
    if (share) {
      share.setAttribute("data-blog-title", post.title);
      share.setAttribute("data-blog-url", url);
    }
  };

  M.initBlogList = function () {
    M.initBlogPost();

    var listNode = document.querySelector("[data-blog-list]");
    var teaser = document.querySelector("[data-blog-teaser]");
    var more = document.querySelector("[data-blog-more]");
    var empty = !POSTS.length;

    if (listNode) {
      if (empty) {
        listNode.innerHTML = '<p class="small muted">No posts yet. Check back soon.</p>';
      } else {
        renderList(listNode);
      }
    }

    if (teaser) {
      var section = teaser.closest("section");
      if (empty) {
        if (section) section.hidden = true;
        if (more) more.hidden = true;
      } else {
        renderList(teaser, 3);
      }
    }
  };

  function flashLabel(button, text) {
    var label = button.querySelector("span");
    if (!label) return;
    var original = label.getAttribute("data-label") || label.textContent;
    label.setAttribute("data-label", original);
    label.textContent = text;
    button.classList.add("is-copied");
    window.setTimeout(function () {
      label.textContent = original;
      button.classList.remove("is-copied");
    }, 1800);
  }

  function copyLink(url, button) {
    function done(ok) {
      flashLabel(button, ok ? "Copied" : "Press Ctrl+C");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(false); });
    } else {
      var field = document.createElement("textarea");
      field.value = url;
      document.body.appendChild(field);
      field.select();
      try { document.execCommand("copy"); done(true); } catch (e) { done(false); }
      document.body.removeChild(field);
    }
  }

  function canNativeShare() {
    return typeof navigator.share === "function";
  }

  function shareButtons() {
    var html = '<span class="share-label">Share:</span>';
    html +=
      '<button class="share-btn" type="button" data-share-key="share" aria-label="Share this post">' +
      M.icon("share", 16) + "<span>Share</span></button>";
    html +=
      '<button class="share-btn" type="button" data-share-key="copy" aria-label="Copy link">' +
      M.icon("link", 16) + "<span>Copy link</span></button>";
    return html;
  }

  M.initBlogShare = function () {
    var nodes = document.querySelectorAll("[data-blog-share]");
    if (!nodes.length) return;

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (!node.getAttribute("data-share-ready")) {
        node.innerHTML = shareButtons();
        node.setAttribute("data-share-ready", "1");
      }

      var shareBtn = node.querySelector('[data-share-key="share"]');
      var copyBtn = node.querySelector('[data-share-key="copy"]');
      var info = {
        title: node.getAttribute("data-blog-title") || document.title,
        url: node.getAttribute("data-blog-url") || window.location.href
      };

      if (copyBtn) {
        copyBtn.onclick = function (btn) {
          return function () { copyLink(info.url, btn); };
        }(copyBtn);
      }

      if (shareBtn) {
        if (!canNativeShare()) {
          shareBtn.hidden = true;
        } else {
          shareBtn.onclick = function () {
            navigator.share({ title: info.title, url: info.url }).catch(function () {});
          };
        }
      }
    }
  };
})();
