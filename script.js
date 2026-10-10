
/* MOBILE NAVIGATION */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    /* CLOSE MENU AFTER CLICKING A LINK */

    document.querySelectorAll("#navLinks a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
            menuToggle.textContent = "☰";
        });
    });
}

/* AUTOMATIC COPYRIGHT YEAR */

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

/* ENQUIRY FORM — GOOGLE SHEETS */

// IMPORTANT: Replace this with your deployed Apps Script /exec URL.
const scriptURL = "https://script.google.com/macros/s/AKfycbxzzU9LqZI8kibR2DaOPMbK7bkZ_HnVGOEXDB67H76JHPX4G3ujNAoZoShdA5e9O_8i/exec";

const enquiryForm = document.getElementById("enquiryForm");
const formMessage = document.getElementById("formMessage");

if (enquiryForm && formMessage) {
    enquiryForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton = enquiryForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        const originalText = submitButton
            ? (submitButton.tagName === "INPUT"
                ? submitButton.value
                : submitButton.textContent)
            : "";

        if (submitButton) {
            submitButton.disabled = true;

            if (submitButton.tagName === "INPUT") {
                submitButton.value = "Sending...";
            } else {
                submitButton.textContent = "Sending...";
            }
        }

        formMessage.textContent = "Sending your enquiry...";
        formMessage.style.color = "#8a632e";

        try {
            const formData = new FormData(enquiryForm);
            const body = new URLSearchParams();

            for (const [key, value] of formData.entries()) {
                body.append(key, value);
            }

            await fetch(scriptURL, {
                method: "POST",
                mode: "no-cors",
                body: body
            });

            // no-cors cannot confirm that the row was saved.
            formMessage.textContent =
                "Your enquiry was sent.";

            formMessage.style.color = "green";
            enquiryForm.reset();

        } catch (error) {
            console.error("Enquiry submission error:", error);

            formMessage.textContent =
                "Unable to send your enquiry. Please try again.";

            formMessage.style.color = "red";

        } finally {
            if (submitButton) {
                submitButton.disabled = false;

                if (submitButton.tagName === "INPUT") {
                    submitButton.value = originalText || "Submit Enquiry";
                } else {
                    submitButton.textContent =
                        originalText || "Submit Enquiry";
                }
            }
        }
    });
}

/* FIRST-VISIT ENQUIRY POPUP */

const enquiryPopup = document.getElementById("enquiryPopup");
const closePopupButton = document.getElementById("closeEnquiryPopup");
const popupForm = document.getElementById("popupEnquiryForm");
const popupMessage = document.getElementById("popupFormMessage");

// Use the same deployed Apps Script URL as your existing form.
const popupScriptURL = "https://script.google.com/macros/s/AKfycbxzzU9LqZI8kibR2DaOPMbK7bkZ_HnVGOEXDB67H76JHPX4G3ujNAoZoShdA5e9O_8i/exec";

if (enquiryPopup && closePopupButton) {
    // Show once per browser, after a short delay.
    if (localStorage.getItem("roseroPopupSeen") !== "yes") {
        setTimeout(function () {
            enquiryPopup.classList.add("show");
        }, 900);
    }

    function closeEnquiryPopup() {
        enquiryPopup.classList.remove("show");
        localStorage.setItem("roseroPopupSeen", "yes");
    }

    closePopupButton.addEventListener("click", closeEnquiryPopup);

    // Close if the visitor clicks the dark background.
    enquiryPopup.addEventListener("click", function (event) {
        if (event.target === enquiryPopup) {
            closeEnquiryPopup();
        }
    });

    // Close with Escape.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && enquiryPopup.classList.contains("show")) {
            closeEnquiryPopup();
        }
    });
}

if (popupForm && popupMessage) {
    popupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton = popupForm.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        submitButton.textContent = "Submitting...";

        popupMessage.textContent = "Sending your enquiry...";
        popupMessage.style.color = "#8a632e";

        try {
            const body = new URLSearchParams(new FormData(popupForm));

            await fetch(popupScriptURL, {
                method: "POST",
                mode: "no-cors",
                body: body
            });

            popupMessage.textContent =
                "Thank you!";
            popupMessage.style.color = "green";

            popupForm.reset();
            localStorage.setItem("roseroPopupSeen", "yes");

            // Keep the message visible briefly before closing.
            setTimeout(function () {
                enquiryPopup.classList.remove("show");
            }, 1800);

        } catch (error) {
            console.error("Popup submission error:", error);
            popupMessage.textContent =
                "Unable to send. Please check your connection and try again.";
            popupMessage.style.color = "red";

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Submit Enquiry";
        }
    });
}

