(function () {
  'use strict';

  // 1. Theme Switcher (Defaults to Light Mode)
  const htmlEl = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleLabel = document.getElementById('theme-toggle-label');
  const metaThemeColor = document.getElementById('meta-theme-color');

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (toggleLabel) {
      toggleLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
    if (toggleBtn) {
      toggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#121417' : '#FAF8F5');
    }
  }

  // Initialize from current attribute (set in <head>, default = 'light')
  const initialTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  applyTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem('theme', next);
      } catch (_) {}
    });
  }

  // 2. Current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Copy email button
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy');
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
        const original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => {
          btn.textContent = original;
        }, 2000);
      } catch (_) {
        window.location.href = `mailto:${value}`;
      }
    });
  });

  // 4. Active nav link on scroll
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.site-nav .nav-link');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }
})();
