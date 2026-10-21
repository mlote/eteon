/* =========================================================================
   MicFi - tools/generate-sitemap.js
   Rebuilds sitemap.xml from the site's single sources:
     - static pages come from MicFi.PAGES in js/config.js
     - blog posts come from the post list in js/blog.js

   Run it after adding a page or a post:
       node tools/generate-sitemap.js
   No need to edit this file.
   ========================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.resolve(__dirname, "..");
var SITE = "https://micfi.net";

function loadSite() {
  var sandbox = {};
  sandbox.window = sandbox;
  sandbox.MicFi = {};
  vm.createContext(sandbox);

  ["js/config.js", "js/blog.js", "js/projects.js"].forEach(function (file) {
    var code = fs.readFileSync(path.join(ROOT, file), "utf8");
    vm.runInContext(code, sandbox, { filename: file });
  });

  return sandbox.MicFi;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc, lastmod) {
  return (
    "  <url>\n" +
    "    <loc>" + esc(loc) + "</loc>\n" +
    (lastmod ? "    <lastmod>" + esc(lastmod) + "</lastmod>\n" : "") +
    "  </url>"
  );
}

function build(M) {
  var entries = [];
  var build = today();

  (M.PAGES || []).forEach(function (page) {
    var loc = SITE + (page.href === "/" ? "/" : page.href);
    entries.push(urlEntry(loc, build));
  });

  var posts = (M.BLOG || []).slice().sort(function (a, b) {
    return String(b.date).localeCompare(String(a.date));
  });

  posts.forEach(function (post) {
    entries.push(urlEntry(SITE + "/blog/" + post.slug + "/", post.date));
  });

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join("\n") +
    "\n</urlset>\n"
  );
}

var M = loadSite();
var xml = build(M);
var out = path.join(ROOT, "sitemap.xml");
fs.writeFileSync(out, xml, "utf8");
console.log("Wrote " + out + " with " + (M.PAGES || []).length + " page(s) and " + (M.BLOG || []).length + " post(s).");
