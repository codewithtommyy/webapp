const slides = Array.from(document.querySelectorAll(".hero-slide"));
const dots = Array.from(document.querySelectorAll(".dot"));

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

document.querySelector(".newsletter-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");

  button.textContent = "Subscribed";
  button.disabled = true;
});
