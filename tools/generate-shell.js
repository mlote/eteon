/* =========================================================================
   MicFi - tools/generate-shell.js
   Writes the shared parts of every page into the static HTML: the header
   and footer menus, the social icons, the brand line, the address, the phone
   number, the email address, the year, and the real WhatsApp / call / email
   links.

   Why this exists: those parts were built by JavaScript, so a crawler that
   does not run JavaScript (and a social app building a link preview) saw
   empty menus, no address, no phone number, and links pointing at "#".

   The markup comes from the very same functions the site uses at runtime
   (M.menuHtml, M.socialHtml, M.contactLinks), so the static HTML and the
   live page are identical.

   Run it after changing the phone number, the address or the menu:
       node tools/generate-shell.js
   No need to edit this file.
   ========================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.resolve(__dirname, "..");

function loadSite() {
  var sandbox = {};
  sandbox.window = sandbox;
  sandbox.MicFi = {};
  sandbox.document = {
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; },
    addEventListener: function () {}
  };
  sandbox.navigator = { share: null, clipboard: null };
  sandbox.location = { pathname: "/" };
  vm.createContext(sandbox);

  // blog.js, projects.js and services.js are needed because the menu hides
  // a page while the list behind it is empty (Blog, Projects).
  ["js/config.js", "js/icons.js", "js/blog.js", "js/projects.js", "js/services.js", "js/nav.js", "js/contact.js"].forEach(function (file) {
    var code = fs.readFileSync(path.join(ROOT, file), "utf8");
    vm.runInContext(code, sandbox, { filename: file });
  });

  return sandbox.MicFi;
}

function findPages(dir, found) {
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "tools") continue;
    var full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findPages(full, found);
    } else if (entry.isFile() && /\.html$/.test(entry.name)) {
      found.push(full);
    }
  }
  return found;
}

function relFile(full) {
  return path.relative(ROOT, full).split(path.sep).join("/");
}

function urlPathFor(rel) {
  if (rel === "404.html") return "404.html";
  var dir = path.dirname(rel);
  if (dir === ".") return "/";
  return "/" + dir.split(path.sep).join("/") + "/";
}

function fillElements(html, attrPattern, content) {
  var re = new RegExp("(<(\\w+)[^>]*" + attrPattern + "[^>]*>)([\\s\\S]*?)(</\\2>)", "g");
  return html.replace(re, function (match, open, tag, inner, close) {
    return open + content + close;
  });
}

function setHref(html, attrPattern, href) {
  var re = new RegExp("<\\w+[^>]*" + attrPattern + "[^>]*>", "g");
  return html.replace(re, function (tag) {
    if (/href="/.test(tag)) return tag.replace(/href="[^"]*"/, 'href="' + href + '"');
    return tag.replace(/^<(\w+)/, '<$1 href="' + href + '"');
  });
}

function setWaHref(html, links) {
  var re = /<\w+[^>]*data-wa-link[^>]*>/g;
  return html.replace(re, function (tag) {
    var href = /fab-wa/.test(tag) ? links.emptyWaUrl : links.waUrl;
    if (/href="/.test(tag)) return tag.replace(/href="[^"]*"/, 'href="' + href + '"');
    return tag.replace(/^<(\w+)/, '<$1 href="' + href + '"');
  });
}

var M = loadSite();
var links = M.contactLinks();
var year = String(new Date().getFullYear());

var files = findPages(ROOT, []);
var written = 0;

files.forEach(function (full) {
  var rel = relFile(full);
  var urlPath = urlPathFor(rel);

  var html = fs.readFileSync(full, "utf8");
  var updated = html;

  updated = fillElements(updated, 'data-nav="[^"]*"', M.menuHtml(urlPath));
  updated = fillElements(updated, "data-social-row", M.socialHtml());
  updated = fillElements(updated, "data-brandline", M.BRAND_LINE || "");
  updated = fillElements(updated, "data-address", M.ADDRESS);
  updated = fillElements(updated, "data-phone-text", M.PHONE_NUMBER);
  updated = fillElements(updated, "data-email-text", M.CONTACT_EMAIL);
  updated = fillElements(updated, "data-year", year);

  updated = setWaHref(updated, links);
  updated = setHref(updated, "data-tel-link", links.telUrl);
  updated = setHref(updated, "data-email-link", links.mailUrl);

  if (updated !== html) {
    fs.writeFileSync(full, updated, "utf8");
    console.log("Updated " + rel);
  } else {
    console.log("Unchanged " + rel);
  }

  written++;
});

console.log("Done. " + written + " page(s) processed.");
