/* =========================================================================
   MicFi - contact.js
   Fills the WhatsApp / call / email links from config.js, the year in the
   footer, and handles the contact form. No need to edit here - edit the
   values in config.js.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  M.initYear = function () {
    var year = String(new Date().getFullYear());
    var nodes = document.querySelectorAll("[data-year]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = year;
  };

  M.initContactLinks = function () {
    var waUrl =
      "https://wa.me/" +
      M.PHONE_NUMBER.replace(/[^0-9xX]/g, "") +
      "?text=" +
      encodeURIComponent(M.WHATSAPP_TEXT);

    var emptyWaUrl =
      "https://wa.me/" + M.PHONE_NUMBER.replace(/[^0-9xX]/g, "");

    var waLinks = document.querySelectorAll("[data-wa-link]");
    for (var i = 0; i < waLinks.length; i++) {
      var isFab = waLinks[i].classList.contains("fab-wa");
      waLinks[i].setAttribute("href", isFab ? emptyWaUrl : waUrl);
    }

    var telLinks = document.querySelectorAll("[data-tel-link]");
    for (var j = 0; j < telLinks.length; j++)
      telLinks[j].setAttribute("href", "tel:" + M.PHONE_NUMBER);

    var mailLinks = document.querySelectorAll("[data-email-link]");
    for (var k = 0; k < mailLinks.length; k++)
      mailLinks[k].setAttribute("href", "mailto:" + M.CONTACT_EMAIL);

    var phoneTexts = document.querySelectorAll("[data-phone-text]");
    for (var m = 0; m < phoneTexts.length; m++) phoneTexts[m].textContent = M.PHONE_NUMBER;

    var emailTexts = document.querySelectorAll("[data-email-text]");
    for (var n = 0; n < emailTexts.length; n++) emailTexts[n].textContent = M.CONTACT_EMAIL;

    var addresses = document.querySelectorAll("[data-address]");
    for (var p = 0; p < addresses.length; p++) addresses[p].textContent = M.ADDRESS;
  };

  M.inquiryUrl = function (channel, fields) {
    var text =
      "MicFi inquiry: " + fields.need + "\n\n" +
      "Name: " + fields.name + "\n" +
      "Email: " + fields.email + "\n\n" +
      (fields.message ? fields.message : "(No message)");

    if (channel === "email") {
      return (
        "mailto:" + M.CONTACT_EMAIL +
        "?subject=" + encodeURIComponent("MicFi inquiry: " + fields.need) +
        "&body=" + encodeURIComponent(text)
      );
    }

    return (
      "https://wa.me/" +
      M.PHONE_NUMBER.replace(/[^0-9xX]/g, "") +
      "?text=" + encodeURIComponent(text)
    );
  };

  M.initForm = function () {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var nameInput = form.querySelector("#name");
    var emailInput = form.querySelector("#email");
    var nameError = form.querySelector("#name-error");
    var emailError = form.querySelector("#email-error");
    var note = form.querySelector("[data-form-note]");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, errorNode, message) {
      if (message) {
        input.setAttribute("aria-invalid", "true");
        errorNode.textContent = message;
        errorNode.hidden = false;
      } else {
        input.removeAttribute("aria-invalid");
        errorNode.textContent = "";
        errorNode.hidden = true;
      }
    }

    nameInput.addEventListener("input", function () {
      setError(nameInput, nameError, "");
    });

    emailInput.addEventListener("input", function () {
      setError(emailInput, emailError, "");
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var nameOk = nameInput.value.trim().length > 0;
      var emailOk = emailPattern.test(emailInput.value.trim());

      setError(
        nameInput,
        nameError,
        nameOk ? "" : "Please enter your name."
      );
      setError(
        emailInput,
        emailError,
        emailOk ? "" : "Please enter a valid email address."
      );

      if (!nameOk) {
        nameInput.focus();
        return;
      }
      if (!emailOk) {
        emailInput.focus();
        return;
      }

      var fields = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        need: form.querySelector("#need").value,
        message: form.querySelector("#message").value.trim()
      };

      var channel =
        (event.submitter && event.submitter.getAttribute("data-channel")) ||
        "whatsapp";
      var url = M.inquiryUrl(channel, fields);

      if (note) {
        note.textContent =
          channel === "email"
            ? "Opening your email app to send the inquiry."
            : "Opening WhatsApp to send the inquiry.";
        note.hidden = false;
      }

      if (channel === "email") {
        window.location.href = url;
      } else {
        window.open(url, "_blank", "noopener");
      }
    });
  };
})();
