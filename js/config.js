/* =========================================================================
   MicFi - config.js
   EDIT YOUR INFO HERE.
   Change a value below once and it updates the whole site.
   ========================================================================= */

window.MicFi = window.MicFi || {};

/* ---- Contact details ---- */
MicFi.PHONE_NUMBER = "+256762451545"; // full number with country code, e.g. "+256771234567"
MicFi.CONTACT_EMAIL = "info@micfi.net"; // where contact form inquiries are sent
MicFi.WHATSAPP_TEXT = "Hi MicFi, I'd like to discuss a project."; // pre-filled WhatsApp message

/* ---- Location / address ---- */
MicFi.ADDRESS = "Kansanga, Kampala, Uganda";

/* ---- Menu links ----
   Comment out a line with // to hide that page from every menu.
   Add a line to add a new page.
   A line with "requires" also hides itself while that list in the
   other JS files is empty (Projects hides itself while there are
   no projects in js/projects.js). */
MicFi.PAGES = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/" },
  { label: "Projects", href: "/projects/", requires: "PROJECTS" },
  { label: "Blog", href: "/blog/", requires: "BLOG" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" }
];

/* ---- Social links ----
   Comment out a line with // to hide that icon from every footer.
   Replace "#" with your real profile link. */
MicFi.SOCIAL_LINKS = {
  x: "https://x.com/1micfi",
  facebook: "https://www.facebook.com/micfiug",
  youtube: "https://www.youtube.com/@1micfi"
};

/* ---- Analytics ----
   Paste your Google Analytics 4 measurement ID here, like "G-ABC1234XYZ".
   Leave it empty and no analytics script loads at all. */
MicFi.GA4_ID = "";

/* ---- Projects page text ----
   The line under the page title and the call to action under the project
   grid. Edit here and the page, its meta tags and the snippet people see
   in Google all change together. */
MicFi.PROJECTS_PAGE = {
  sub: "Point-of-sale and management systems we're building for shops and teams.",
  cta: "Want one of these for your business? Tell us what you need.",
  ctaButton: "Start a conversation"
};

/* ---- Page title and description ----
   The title and description of every page. The generator writes these into
   the <title>, the meta description and the og: / twitter: tags, so what
   people see in Google, WhatsApp and Facebook always matches the page.

   file       - the page this belongs to
   title      - the browser tab and the og:title
   description - the sentence search engines show under the link
   ogTitle    - the shorter headline used on the link preview card
   ogEyebrow  - the small label above the headline on the card
   ogDescription - the shorter version used for link previews
   ogImage    - the picture used for link previews (1200x630 works best)

   The picture is drawn by tools/generate-og.js from the ogTitle and
   ogEyebrow below, so the card always says the same thing as the page.

   The two blog posts are not listed here. Their titles and descriptions
   come from the post itself, in js/blog.js. */
MicFi.PAGE_META = {
  "/": {
    file: "index.html",
    title: "MicFi - Digital solutions built for your business.",
    description: "MicFi builds fast, modern websites, apps, and management systems that help businesses get found and get customers.",
    ogTitle: "Digital solutions built for your business",
    ogEyebrow: "MicFi",
    ogDescription: "Fast, modern websites, apps, and management systems that help businesses get found and get customers.",
    ogImage: "/assets/og/home.png"
  },
  "/about/": {
    file: "about/index.html",
    title: "About - MicFi",
    description: "MicFi is a digital agency based in Kansanga, Kampala, Uganda, building websites, applications, and management systems for businesses.",
    ogTitle: "A digital agency in Kampala",
    ogEyebrow: "About",
    ogDescription: "Digital solutions built for your business. Based in Kansanga, Kampala, Uganda.",
    ogImage: "/assets/og/about.png"
  },
  "/blog/": {
    file: "blog/index.html",
    title: "Blog - MicFi",
    description: "Practical notes on software, point of sale, management systems, and running a business from MicFi in Kampala, Uganda.",
    ogTitle: "Practical notes for running a business",
    ogEyebrow: "Blog",
    ogDescription: "Practical notes on software, point of sale, and running a business.",
    ogImage: "/assets/og/blog.png"
  },
  "/contact/": {
    file: "contact/index.html",
    title: "Contact - MicFi",
    description: "Tell us what you need and we'll reply. Reach MicFi by form, WhatsApp, phone, or email.",
    ogTitle: "Tell us what you need",
    ogEyebrow: "Contact",
    ogDescription: "Tell us what you need and we'll reply.",
    ogImage: "/assets/og/contact.png"
  },
  "/projects/": {
    file: "projects/index.html",
    title: "Projects - MicFi",
    description: "The systems MicFi is building: MicFi POS for shops, MicFi HR for staff records and payroll, and MicFi Business for multi-branch retail.",
    ogTitle: "Systems we're building for shops and teams",
    ogEyebrow: "Projects",
    ogDescription: "MicFi POS for shops, MicFi HR for staff and payroll, and MicFi Business for multi-branch retail.",
    ogImage: "/assets/og/projects.png"
  },
  "/services/": {
    file: "services/index.html",
    title: "Services - MicFi",
    description: "Website development, web and desktop applications, management systems, and custom digital solutions built for your business.",
    ogTitle: "Websites, apps and management systems",
    ogEyebrow: "Services",
    ogDescription: "Website development, web and desktop applications, management systems, and custom digital solutions.",
    ogImage: "/assets/og/services.png"
  }
};

/* ---- Shared helper (used by other files, no need to edit) ---- */
MicFi.esc = function (value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};
