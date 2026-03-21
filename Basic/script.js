const typingPhrases = [
  "Running controlled reconnaissance...",
  "Testing web endpoints for vulnerabilities...",
  "Hardening your attack surface...",
  "Generating actionable security report..."
];

const typingTarget = document.getElementById("typing-text");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.getElementById("nav-links");
const revealElements = document.querySelectorAll(".reveal");
const progressBars = document.querySelectorAll(".progress span");
const form = document.getElementById("contact-form");
const statusText = document.getElementById("form-status");
const yearTarget = document.getElementById("year");
const allCards = document.querySelectorAll(".card, .project-card");

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

// Add click animation to cards
allCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.animation = 'none';
    setTimeout(() => {
      this.style.animation = '';
    }, 10);
  });
});

// Typing effect for hero line
function typeLoop() {
  const currentPhrase = typingPhrases[phraseIndex];

  if (!deleting) {
    charIndex += 1;
    typingTarget.textContent = currentPhrase.slice(0, charIndex);

    if (charIndex === currentPhrase.length) {
      deleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
  } else {
    charIndex -= 1;
    typingTarget.textContent = currentPhrase.slice(0, charIndex);

    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    }
  }

  const speed = deleting ? 32 : 64;
  setTimeout(typeLoop, speed);
}

// Mobile navigation toggle
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close mobile nav on link click
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Add parallax effect on scroll
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const bgGrid = document.querySelector('.bg-grid');
  if (bgGrid) {
    bgGrid.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Reveal-on-scroll animation with staggered card animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");

        // Animate cards within the revealed section
        const cardsInSection = entry.target.querySelectorAll(".card, .project-card");
        cardsInSection.forEach((card, index) => {
          card.style.animationDelay = `${index * 0.1}s`;
          card.style.animation = 'fadeInUp 0.7s ease-out both';
        });

        // Animate skill bars once their section appears
        if (entry.target.querySelector(".progress")) {
          progressBars.forEach((bar) => {
            bar.style.width = `${bar.dataset.width}%`;
          });
        }
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((el) => observer.observe(el));

// Lightweight contact form handling (frontend only)
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    statusText.textContent = "Please complete all fields before sending.";
    statusText.className = "form-status error";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    statusText.textContent = "Please provide a valid email address.";
    statusText.className = "form-status error";
    return;
  }

  statusText.textContent = "Message sent. I will get back to you within 24 hours.";
  statusText.className = "form-status success";
  form.reset();
});

yearTarget.textContent = String(new Date().getFullYear());
typeLoop();
