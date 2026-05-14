const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dots = Array.from(document.querySelectorAll(".dot"));
const NEWSLETTER_ENDPOINT =
  "https://pvudfmeljunobwhvyzkf.supabase.co/functions/v1/newsletter-subscribe";
const subscribeModal = document.querySelector(".subscribe-modal");
const subscribeModalInput = subscribeModal?.querySelector("input[type='email']");

let activeIndex = 0;

function setSlide(index) {
  activeIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeIndex);
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeIndex);
  });
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setSlide(Number(dot.dataset.slide));
  });
});

setInterval(() => {
  setSlide(activeIndex + 1);
}, 5000);

function setFormStatus(statusNode, message, type = "") {
  if (!statusNode) return;
  statusNode.textContent = message;
  statusNode.className = statusNode.className.split(" ")[0];
  if (type) {
    statusNode.classList.add(type);
  }
}

function openSubscribeModal() {
  if (!subscribeModal) return;
  subscribeModal.hidden = false;
  document.body.classList.add("is-modal-open");
  window.setTimeout(() => subscribeModalInput?.focus(), 20);
}

function closeSubscribeModal() {
  if (!subscribeModal) return;
  subscribeModal.hidden = true;
  document.body.classList.remove("is-modal-open");
}

document.querySelector("[data-open-subscribe]")?.addEventListener("click", (event) => {
  event.preventDefault();
  openSubscribeModal();
});

document.querySelectorAll("[data-close-subscribe]").forEach((node) => {
  node.addEventListener("click", closeSubscribeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !subscribeModal?.hidden) {
    closeSubscribeModal();
  }
});

document.querySelectorAll("[data-subscribe-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const currentForm = event.currentTarget;
    const input = currentForm.querySelector("input[type='email']");
    const button = currentForm.querySelector("button");
    const status =
      currentForm.querySelector(".newsletter-status") ||
      currentForm.querySelector(".subscribe-form-status");
    const email = input.value.trim();
    const source = currentForm.dataset.source || "homepage-newsletter";

    setFormStatus(status, "");

    if (!email) {
      setFormStatus(status, "Please enter your email address.", "is-error");
      return;
    }

    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Submitting...";

    try {
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source,
          meta: {
            page: window.location.href,
            userAgent: navigator.userAgent,
          },
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Unable to subscribe right now.");
      }

      setFormStatus(status, payload.message || "Thanks for subscribing.", "is-success");
      input.value = "";

      if (currentForm.closest(".subscribe-modal")) {
        window.setTimeout(closeSubscribeModal, 1200);
      }
    } catch (error) {
      setFormStatus(
        status,
        error.message || "Unable to subscribe right now.",
        "is-error"
      );
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
});
