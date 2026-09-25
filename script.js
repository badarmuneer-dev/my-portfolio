(function () {
  "use strict";

  const sections = ["about", "experience", "skills", "projects", "education", "contact"];
  const header = document.getElementById("site-header");
  const progressBar = document.getElementById("scroll-progress-bar");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const yearSpan = document.getElementById("year");
  const navLinks = document.querySelectorAll('a[data-section]');
  const revealElements = document.querySelectorAll('.reveal');

  // Update current year in footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  // Scroll progress bar
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress})`;
    }
  }

  // Header background on scroll
  function updateHeader() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 12);
    }
  }

  // Mobile menu toggle
  function toggleMenu() {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', toggleMenu);

    // Close mobile menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // Active section highlighting
  function updateActiveSection() {
    let bestId = sections[0];
    let bestRatio = 0;

    sections.forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const ratio = Math.max(0, (visibleBottom - visibleTop) / viewportHeight);

      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestId = id;
      }
    });

    navLinks.forEach(function (link) {
      const linkSection = link.getAttribute('data-section');
      if (linkSection === bestId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'true');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Reveal on scroll
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // Scroll listeners
  function onScroll() {
    updateProgress();
    updateHeader();
    updateActiveSection();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // Initial call
  onScroll();
})();
