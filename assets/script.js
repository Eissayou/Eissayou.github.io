/**
 * Main JavaScript for Eissayou.github.io
 * Handles mobile navigation and interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('nav-links');
  
  if (hamburger && navLinks) {
    const setMenuState = (isExpanded) => {
      navLinks.classList.toggle('open', isExpanded);
      hamburger.setAttribute('aria-expanded', isExpanded);
      hamburger.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
    };

    hamburger.addEventListener('click', () => {
      setMenuState(!navLinks.classList.contains('open'));
    });

    // Close menu when clicking a link (better mobile UX)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    // Close menu on Escape and return focus to the toggle button
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        setMenuState(false);
        hamburger.focus();
      }
    });

    // Close menu if the viewport is resized to desktop width,
    // so the mobile .open state doesn't linger.
    const desktopQuery = window.matchMedia('(min-width: 769px)');
    desktopQuery.addEventListener('change', (e) => {
      if (e.matches && navLinks.classList.contains('open')) {
        setMenuState(false);
      }
    });
  }
});
