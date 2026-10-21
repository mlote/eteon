/* =========================================================================
   MicFi - tools/generate-og.js
   Draws the link preview card (1200x630) for every page and every post.

   Why this exists: when someone shares micfi.net on WhatsApp, Facebook or
   LinkedIn, those apps show a picture next to the link. If there is no good
   picture they show a blank box and the link gets ignored. The picture has
   to exist as a real file on the server, so it is drawn here at build time.

   How it works:
     1. read the card copy from js/config.js (MicFi.PAGE_META) and js/blog.js
     2. lay the card out as a small HTML page using the site's own font,
        brand colours and logo
     3. let Chrome draw it and save the result as a PNG
     4. check the card for text that overflowed or got cut off

   Run it after changing a page title or adding a post:
       node tools/generate-og.js
   The PNG files are written to assets/og/ and are committed to the repo.
   ========================================================================= */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");
var os = require("os");
var child = require("child_process");

var ROOT = path.resolve(__dirname, "..");
var OUT_DIR = path.join(ROOT, "assets", "og");
var WIDTH = 1200;
var HEIGHT = 630;

/* Brand values, taken from css/base.css so the cards match the site. */
var COLORS = {
  bg: "#000000",
  text: "#FFFFFF",
  muted: "#9A9AA4",
  accent: "#1A73C8",
  offer: "#E0197B"
};

var CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];

function findChrome() {
  for (var i = 0; i < CHROME_CANDIDATES.length; i++) {
    var p = CHROME_CANDIDATES[i];
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

function fileUrl(file) {
  return "file:///" + path.resolve(file).replace(/\\/g, "/").replace(/ /g, "%20");
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadSite() {
  var sandbox = {};
  sandbox.window = sandbox;
  sandbox.MicFi = {};
  sandbox.document = { querySelector: function () { return null; } };
  vm.createContext(sandbox);
  ["js/config.js", "js/blog.js"].forEach(function (file) {
    var code = fs.readFileSync(path.join(ROOT, file), "utf8");
    vm.runInContext(code, sandbox, { filename: file });
  });
  return sandbox.MicFi;
}

function formatDate(value) {
  var parts = String(value).split("-");
  if (parts.length !== 3) return String(value);
  var months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var month = parseInt(parts[1], 10) - 1;
  var day = parseInt(parts[2], 10);
  if (isNaN(month) || isNaN(day)) return String(value);
  return months[month] + " " + day + ", " + parts[0];
}

/* One card = the words on it. The file name is decided here, not by hand. */
function buildCards(M) {
  var cards = [];

  Object.keys(M.PAGE_META || {}).forEach(function (route) {
    var meta = M.PAGE_META[route];
    var file = String(meta.file || "");
    var slug = file === "index.html" ? "home" : file.replace(/\/?index\.html$/, "");
    cards.push({
      slug: slug,
      out: path.join(OUT_DIR, slug + ".png"),
      eyebrow: meta.ogEyebrow || "MicFi",
      title: meta.ogTitle || meta.title,
      subtitle: meta.ogDescription || meta.description,
      foot: "micfi.net"
    });
  });

  (M.BLOG || []).forEach(function (post) {
    cards.push({
      slug: "post-" + post.slug,
      out: path.join(OUT_DIR, "post-" + post.slug + ".png"),
      eyebrow: post.tag ? String(post.tag) : "Blog",
      title: post.title,
      subtitle: formatDate(post.date),
      foot: "micfi.net/blog"
    });
  });

  return cards;
}

function cardHtml(card) {
  var font = fileUrl(path.join(ROOT, "assets", "fonts", "nunito-sans-latin.woff2"));
  /* Use the same stacked logo as the footer for a cleaner lockup */
  var logo = fileUrl(path.join(ROOT, "assets", "logo-dark.png"));

  return [
    "<!DOCTYPE html>",
    '<html lang="en"><head><meta charset="utf-8">',
    "<style>",
    '@font-face{font-family:Nunito;src:url("' + font + '") format("woff2");font-weight:200 1000;font-style:normal}',
    "*{margin:0;padding:0;box-sizing:border-box}",
    "html,body{width:" + WIDTH + "px;height:" + HEIGHT + "px;overflow:hidden}",
    "body{font-family:Nunito,system-ui,sans-serif;color:" + COLORS.text + ";",
    "background:" + COLORS.bg + ";",
    "padding:64px 78px 48px;display:flex;flex-direction:column;position:relative;overflow:hidden}",
    /* Flat brand shapes instead of a soft gradient. They look the same at
       preview size and keep the PNG a fraction of the size. */
    ".blob{position:absolute;border-radius:50%;pointer-events:none}",
    ".blob.a{width:560px;height:560px;top:-210px;right:-170px;background:rgba(26,115,200,.30)}",
    ".blob.b{width:300px;height:300px;bottom:-170px;left:-120px;background:rgba(224,25,123,.20)}",
    ".brand{position:relative}",
    ".brand img{height:92px;width:auto;display:block}",
    ".rule{width:92px;height:6px;border-radius:3px;background:" + COLORS.accent + ";margin-top:32px}",
    ".eyebrow{margin-top:26px;font-size:24px;font-weight:800;letter-spacing:.22em;",
    "text-transform:none;color:" + COLORS.accent + ";position:relative}",
    "h1{margin-top:12px;font-size:72px;font-weight:800;line-height:1.08;max-width:1010px;letter-spacing:-.01em;position:relative}",
    ".sub{margin-top:18px;font-size:29px;font-weight:500;line-height:1.35;color:" + COLORS.muted + ";max-width:930px;position:relative}",
    ".foot{margin-top:auto;padding-top:28px;display:flex;justify-content:space-between;align-items:flex-end;",
    "font-size:25px;font-weight:700;color:" + COLORS.muted + ";position:relative}",
    ".foot .dom{letter-spacing:.05em}",
    ".foot .tag{color:#6E6E78;font-weight:600}",
    "</style></head><body>",
    '<div class="blob a" data-decor="1"></div><div class="blob b" data-decor="1"></div>',
    '<div class="brand"><img src="' + logo + '" alt="MicFi"></div>',
    '<div class="rule"></div>',
    '<div class="eyebrow">' + esc(card.eyebrow) + "</div>",
    '<h1 id="title">' + esc(card.title) + "</h1>",
    '<div class="sub">' + esc(card.subtitle) + "</div>",
    '<div class="foot"><span class="dom">' + esc(card.foot) + '</span><span class="tag">Kampala, Uganda</span></div>',
    "<script>",
    /* Shrink the headline until it fits on at most three lines, then report
       back if anything spilled outside the 1200x630 box. */
    "(function(){",
    "var BOTTOM=" + (HEIGHT - 48) + ";",
    "var foot=document.querySelector('.foot');",
    /* Shrink a block until it fits its line budget AND the whole card still
       fits inside the padding box. */
    "function fit(el,maxSize,minSize,maxLines){",
    "var size=maxSize;",
    "while(size>minSize){",
    "el.style.fontSize=size+'px';",
    "var lh=parseFloat(getComputedStyle(el).lineHeight);",
    "var lines=Math.round(el.scrollHeight/lh);",
    "var fits=foot.getBoundingClientRect().bottom<=BOTTOM;",
    "if(lines<=maxLines&&el.scrollWidth<=el.clientWidth+1&&fits)break;",
    "size-=2;",
    "}",
    "el.style.fontSize=size+'px';",
    "var lh=parseFloat(getComputedStyle(el).lineHeight);",
    "return {size:size,lines:Math.round(el.scrollHeight/lh)};",
    "}",
    "var titleFit=fit(document.getElementById('title'),72,34,3);",
    "var subFit=fit(document.querySelector('.sub'),29,20,2);",
    "var size=titleFit.size,lines=titleFit.lines;",
    "var issues=[];",
    "var all=document.body.querySelectorAll('*');",
    "for(var i=0;i<all.length;i++){",
    "if(all[i].getAttribute&&all[i].getAttribute('data-decor'))continue;",
    "var r=all[i].getBoundingClientRect();",
    "if(!r.width&&!r.height)continue;",
    "if(r.left<-0.5||r.top<-0.5||r.right>" + WIDTH + "+0.5||r.bottom>" + HEIGHT + "+0.5){",
    "issues.push((all[i].className||all[i].tagName)+' l'+Math.round(r.left)+' t'+Math.round(r.top)+' r'+Math.round(r.right)+' b'+Math.round(r.bottom));",
    "}",
    "}",
    "if(document.documentElement.scrollWidth>" + WIDTH + "+1||document.documentElement.scrollHeight>" + HEIGHT + "+1){",
    "issues.push('page scroll '+document.documentElement.scrollWidth+'x'+document.documentElement.scrollHeight);",
    "}",
    "var footBottom=foot.getBoundingClientRect().bottom;",
    "if(footBottom>BOTTOM+0.5)issues.push('footer past the safe area: '+Math.round(footBottom)+' > '+BOTTOM);",
    /* Two blocks of text must never sit on top of each other. */
    "var blocks=['.brand','.eyebrow','#title','.sub','.foot'];",
    "for(var a=0;a<blocks.length;a++){",
    "for(var b=a+1;b<blocks.length;b++){",
    "var ea=document.querySelector(blocks[a]),eb=document.querySelector(blocks[b]);",
    "if(!ea||!eb)continue;",
    "var ra=ea.getBoundingClientRect(),rb=eb.getBoundingClientRect();",
    "var overlapX=Math.min(ra.right,rb.right)-Math.max(ra.left,rb.left);",
    "var overlapY=Math.min(ra.bottom,rb.bottom)-Math.max(ra.top,rb.top);",
    "if(overlapX>1&&overlapY>1)issues.push(blocks[a]+' overlaps '+blocks[b]);",
    "}",
    "}",
    "var geo=[];",
    "for(var g=0;g<blocks.length;g++){",
    "var eg=document.querySelector(blocks[g]);",
    "if(!eg)continue;",
    "var rg=eg.getBoundingClientRect();",
    "geo.push({sel:blocks[g],l:Math.round(rg.left),t:Math.round(rg.top),r:Math.round(rg.right),b:Math.round(rg.bottom),h:Math.round(rg.height)});",
    "}",
    "document.title='OGREPORT:'+JSON.stringify({ok:issues.length===0,size:size,lines:lines,issues:issues,geo:geo});",
    "})();",
    "</script>",
    "</body></html>"
  ].join("\n");
}

function run(chrome, args) {
  var res = child.spawnSync(chrome, args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  return res.stdout || "";
}

function main() {
  var chrome = findChrome();
  if (!chrome) {
    /* The cards are committed to the repo, so a missing browser is not
       fatal. It only means the cards cannot be redrawn right now. */
    console.log("SKIP (no Chrome or Edge found, keeping the cards already in assets/og/)");
    console.log("     Set CHROME_PATH to redraw them.");
    return;
  }

  var M = loadSite();
  var cards = buildCards(M);
  if (!cards.length) {
    console.log("No cards to build.");
    return;
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  var tmp = fs.mkdtempSync(path.join(os.tmpdir(), "micfi-og-"));
  var failures = 0;

  cards.forEach(function (card) {
    var htmlPath = path.join(tmp, card.slug + ".html");
    fs.writeFileSync(htmlPath, cardHtml(card), "utf8");

    var base = [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--virtual-time-budget=3000"
    ];

    run(chrome, base.concat([
      "--screenshot=" + card.out,
      "--window-size=" + WIDTH + "," + HEIGHT,
      fileUrl(htmlPath)
    ]));

    if (!fs.existsSync(card.out)) {
      console.log("FAILED (no png) " + card.slug);
      failures++;
      return;
    }

    var dom = run(chrome, base.concat(["--dump-dom", fileUrl(htmlPath)]));
    var report = null;
    var m = dom.match(/<title>OGREPORT:([\s\S]*?)<\/title>/);
    if (m) {
      try {
        report = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
      } catch (e) {
        report = null;
      }
    }

    var size = fs.statSync(card.out).size;
    if (!report) {
      console.log("WARN  " + card.slug + " (could not read the layout report)");
      failures++;
      return;
    }
    if (!report.ok) {
      console.log("FAIL  " + card.slug + " -> " + report.issues.join(" | "));
      failures++;
      return;
    }
    console.log(
      "OK    " + card.slug + ".png  " +
      Math.round(size / 1024) + " KB  headline " + report.size +
      "px / " + report.lines + " line(s)"
    );
    if (process.env.OG_VERBOSE) {
      (report.geo || []).forEach(function (b) {
        console.log(
          "        " + b.sel.padEnd(9) +
          " x " + String(b.l).padStart(4) + "-" + String(b.r).padStart(4) +
          "   y " + String(b.t).padStart(3) + "-" + String(b.b).padStart(3) +
          "   h " + b.h
        );
      });
    }
  });

  try {
    fs.rmSync(tmp, { recursive: true, force: true });
  } catch (e) {}

  console.log("Done. " + cards.length + " card(s) built, " + failures + " problem(s).");
  if (failures) process.exit(1);
}

main();
