/* =========================================================================
   MicFi - tools/generate.js
   Runs every generator. Use this after adding or editing a blog post:
       node tools/generate.js
   It rebuilds the link preview cards, the RSS feed and the social share
   metadata. The cards come first because the metadata points at them.
   No need to edit this file.
   ========================================================================= */
"use strict";

require("./generate-og.js");
require("./generate-rss.js");
require("./generate-posts.js");
require("./generate-meta.js");
require("./generate-content.js");
require("./generate-shell.js");
require("./generate-scripts.js");
require("./generate-sitemap.js");
