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

  M.contactLinks = function () {
    var digits = M.PHONE_NUMBER.replace(/[^0-9xX]/g, "");
    var waUrl = "https://wa.me/" + digits;
    return {
      waUrl: waUrl,
      emptyWaUrl: waUrl,
      telUrl: "tel:" + M.PHONE_NUMBER,
      mailUrl: "mailto:" + M.CONTACT_EMAIL
    };
  };

  M.initContactLinks = function () {
    var links = M.contactLinks();

    var waLinks = document.querySelectorAll("[data-wa-link]");
    for (var i = 0; i < waLinks.length; i++) {
      var isFab = waLinks[i].classList.contains("fab-wa");
      waLinks[i].setAttribute("href", isFab ? links.emptyWaUrl : links.waUrl);
    }

    var telLinks = document.querySelectorAll("[data-tel-link]");
    for (var j = 0; j < telLinks.length; j++)
      telLinks[j].setAttribute("href", links.telUrl);

    var mailLinks = document.querySelectorAll("[data-email-link]");
    for (var k = 0; k < mailLinks.length; k++)
      mailLinks[k].setAttribute("href", links.mailUrl);

    var phoneTexts = document.querySelectorAll("[data-phone-text]");
    for (var m = 0; m < phoneTexts.length; m++) phoneTexts[m].textContent = M.PHONE_NUMBER;

    var emailTexts = document.querySelectorAll("[data-email-text]");
    for (var n = 0; n < emailTexts.length; n++) emailTexts[n].textContent = M.CONTACT_EMAIL;

    var addresses = document.querySelectorAll("[data-address]");
    for (var p = 0; p < addresses.length; p++) addresses[p].textContent = M.ADDRESS;
  };

  M.inquiryUrl = function (channel, fields) {
    if (channel === "email") {
      var emailText =
        "Name: " + fields.name + "\n\n" +
        "Need: " + fields.need + "\n\n" +
        (fields.message ? fields.message : "(No message)");

      return (
        "mailto:" + M.CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(fields.need) +
        "&body=" + encodeURIComponent(emailText)
      );
    }

    var waText = fields.need + (fields.message ? "\n\n" + fields.message : "");

    return (
      "https://wa.me/" +
      M.PHONE_NUMBER.replace(/[^0-9xX]/g, "") +
      "?text=" + encodeURIComponent(waText)
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
    var emailOnly = form.querySelector("[data-email-only]");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailOnly) {
      emailOnly.hidden = true;
    }

    var waBtn = form.querySelector('[data-channel="whatsapp"]');
    var mailBtn = form.querySelector('[data-channel="email"]');

    if (waBtn) {
      waBtn.addEventListener("click", function () {
        if (emailOnly) {
          emailOnly.hidden = true;
        }
        if (nameInput) {
          nameInput.value = "";
          nameInput.removeAttribute("aria-invalid");
        }
        if (emailInput) {
          emailInput.value = "";
          emailInput.removeAttribute("aria-invalid");
        }
        if (nameError) {
          nameError.textContent = "";
          nameError.hidden = true;
        }
        if (emailError) {
          emailError.textContent = "";
          emailError.hidden = true;
        }
      });
    }

    if (mailBtn) {
      mailBtn.addEventListener("click", function () {
        if (emailOnly) {
          emailOnly.hidden = false;
        }
      });
    }

    function setError(input, errorNode, message) {
      if (!input || !errorNode) return;
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

    if (nameInput) {
      nameInput.addEventListener("input", function () {
        setError(nameInput, nameError, "");
      });
    }

    if (emailInput) {
      emailInput.addEventListener("input", function () {
        setError(emailInput, emailError, "");
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var channel =
        (event.submitter && event.submitter.getAttribute("data-channel")) ||
        "whatsapp";
      var isEmail = channel === "email";
      var emailFieldsVisible = isEmail && emailOnly && !emailOnly.hidden;

      var nameOk = !emailFieldsVisible || (nameInput && nameInput.value.trim().length > 0);
      var emailOk = !emailFieldsVisible || (emailInput && emailPattern.test(emailInput.value.trim()));

      setError(
        nameInput,
        nameError,
        emailFieldsVisible && !nameOk ? "Please enter your name." : ""
      );
      setError(
        emailInput,
        emailError,
        emailFieldsVisible && !emailOk ? "Please enter a valid email address." : ""
      );

      if (emailFieldsVisible && !nameOk && nameInput) {
        nameInput.focus();
        return;
      }
      if (emailFieldsVisible && !emailOk && emailInput) {
        emailInput.focus();
        return;
      }

      var fields = {
        name: nameInput ? nameInput.value.trim() : "",
        email: emailInput ? emailInput.value.trim() : "",
        need: form.querySelector("#need").value,
        message: form.querySelector("#message").value.trim()
      };

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
