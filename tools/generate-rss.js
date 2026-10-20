/* =========================================================================
   MicFi - tools/generate-rss.js
   Rebuilds blog/rss.xml from the post list in js/blog.js.
   Run it after adding or editing a post:
       node tools/generate-rss.js
   No need to edit this file.
   ========================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.resolve(__dirname, "..");
var SITE = "https://micfi.net";

function loadPosts() {
  var sandbox = {};
  sandbox.window = sandbox;
  sandbox.MicFi = {};
  vm.createContext(sandbox);

  ["js/config.js", "js/blog.js"].forEach(function (file) {
    var code = fs.readFileSync(path.join(ROOT, file), "utf8");
    vm.runInContext(code, sandbox, { filename: file });
  });

  return sandbox.MicFi.BLOG || [];
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(value) {
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function rfcDate(value) {
  var parts = String(value).split("-");
  if (parts.length !== 3) return new Date().toUTCString();
  var d = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

function build(posts) {
  var sorted = posts.slice().sort(function (a, b) {
    return String(b.date).localeCompare(String(a.date));
  });

  var items = sorted.map(function (post) {
    var url = SITE + "/blog/" + post.slug + "/";
    return (
      "    <item>\n" +
      "      <title>" + esc(post.title) + "</title>\n" +
      "      <link>" + esc(url) + "</link>\n" +
      "      <description>" + esc(post.excerpt || stripHtml(post.body)) + "</description>\n" +
      "      <pubDate>" + rfcDate(post.date) + "</pubDate>\n" +
      "      <guid>" + esc(url) + "</guid>\n" +
      "    </item>"
    );
  }).join("\n");

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0">\n' +
    "  <channel>\n" +
    "    <title>MicFi Blog</title>\n" +
    "    <link>" + SITE + "/blog/</link>\n" +
    "    <description>Practical notes on software, business, and getting things done.</description>\n" +
    "    <language>en</language>\n" +
    (items ? items + "\n" : "") +
    "  </channel>\n" +
    "</rss>\n"
  );
}

var posts = loadPosts();
var xml = build(posts);
var out = path.join(ROOT, "blog", "rss.xml");
fs.writeFileSync(out, xml, "utf8");
console.log("Wrote " + out + " with " + posts.length + " post(s).");
