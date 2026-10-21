"use strict";
/*
 * Keeps the <script> tags in every page consistent:
 *   1. every external script is deferred, so the page never blocks on them
 *   2. js/analytics.js sits right after js/config.js, with the same
 *      indentation as the rest of the block
 *
 * Running it twice changes nothing the second time.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "tools") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function indentOf(line) {
  const m = line.match(/^(\s*)<script/);
  return m ? m[1] : "  ";
}

let changed = 0;
let files = 0;

for (const file of walk(ROOT, [])) {
  const rel = path.relative(ROOT, file);
  const source = fs.readFileSync(file, "utf8");
  let out = source;

  // 1. defer on every external script
  out = out.replace(/<script src="([^"]+)"([^>]*)>/g, function (match, src, rest) {
    if (/\bdefer\b/.test(rest)) return match;
    return '<script src="' + src + '" defer' + rest + ">";
  });

  // 2. analytics.js, always directly after js/config.js
  out = out.replace(/[ \t]*<script src="[^"]*js\/analytics\.js"[^>]*><\/script>\r?\n?/g, "");

  const configMatch = out.match(/^([ \t]*)<script src="([^"]*js\/config\.js)"[^>*]*><\/script>$/m);
  if (configMatch) {
    const indent = configMatch[1];
    const prefix = configMatch[2].replace(/js\/config\.js$/, "js/");
    const tag = indent + '<script src="' + prefix + 'analytics.js" defer></script>';
    const line = configMatch[0];
    out = out.replace(line, line + "\n" + tag);
  } else {
    console.log("SKIP (no config.js script): " + rel);
    continue;
  }

  files++;
  if (out !== source) {
    fs.writeFileSync(file, out, "utf8");
    changed++;
    console.log("Updated " + rel);
  } else {
    console.log("Unchanged " + rel);
  }
}

console.log("Done. " + files + " page(s) processed, " + changed + " updated.");
