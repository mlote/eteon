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
  { label: "Home", href: "index.html" },
  { label: "Services", href: "services.html" },
  { label: "Projects", href: "projects.html", requires: "PROJECTS" },
  { label: "About", href: "about.html" },
  { label: "Contact", href: "contact.html" }
];

/* ---- Social links ----
   Comment out a line with // to hide that icon from every footer.
   Replace "#" with your real profile link. */
MicFi.SOCIAL_LINKS = {
  x: "https://x.com/1micfi",
  facebook: "#",
  youtube: "#"
};

/* ---- Shared helper (used by other files, no need to edit) ---- */
MicFi.esc = function (value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};
