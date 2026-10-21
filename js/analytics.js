/* =========================================================================
   MicFi - analytics.js
   Google Analytics 4, plus the conversion events that actually matter for
   a business site: a WhatsApp message, a phone call, an email click, and
   an inquiry that was sent.

   The measurement ID lives in js/config.js (MicFi.GA4_ID). While that is
   empty this file does nothing at all and makes no request.

   No need to edit this file.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function closestLink(node) {
    while (node && node !== document.body) {
      if (node.tagName && node.tagName.toLowerCase() === "a") return node;
      node = node.parentNode;
    }
    return null;
  }

  function trackConversions() {
    document.addEventListener(
      "click",
      function (event) {
        var link = closestLink(event.target);
        if (!link) return;

        if (link.hasAttribute("data-wa-link")) {
          gtag("event", "whatsapp_click", { event_category: "contact" });
        } else if (link.hasAttribute("data-tel-link")) {
          gtag("event", "phone_click", { event_category: "contact" });
        } else if (link.hasAttribute("data-email-link")) {
          gtag("event", "email_click", { event_category: "contact" });
        }
      },
      true
    );

    document.addEventListener(
      "submit",
      function (event) {
        var form = event.target;
        if (!form || !form.hasAttribute || !form.hasAttribute("data-contact-form")) return;

        var channel = "whatsapp";
        if (event.submitter && event.submitter.getAttribute) {
          channel = event.submitter.getAttribute("data-channel") || channel;
        }
        gtag("event", "form_submit", {
          event_category: "contact",
          event_label: channel
        });
      },
      true
    );
  }

  function init() {
    var id = M && M.GA4_ID ? String(M.GA4_ID).trim() : "";
    if (!id) return;

    window.gtag = window.gtag || gtag;
    gtag("js", new Date());
    gtag("config", id);

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(script);

    trackConversions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
