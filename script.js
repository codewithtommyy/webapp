const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dots = Array.from(document.querySelectorAll(".dot"));
const NEWSLETTER_ENDPOINT =
  "https://pvudfmeljunobwhvyzkf.supabase.co/functions/v1/newsletter-subscribe";

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

document.querySelector(".newsletter-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const input = form.querySelector("input[type='email']");
  const button = form.querySelector("button");
  const status = document.querySelector(".newsletter-status");
  const email = input.value.trim();

  status.textContent = "";
  status.className = "newsletter-status";

  if (!email) {
    status.textContent = "Please enter your email address.";
    status.classList.add("is-error");
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
        source: "homepage-newsletter",
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

    status.textContent = payload.message || "Thanks for subscribing.";
    status.classList.add("is-success");
    input.value = "";
  } catch (error) {
    status.textContent = error.message || "Unable to subscribe right now.";
    status.classList.add("is-error");
  } finally {
    button.disabled = false;
    button.textContent = originalLabel;
  }
});
