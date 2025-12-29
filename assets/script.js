/**
 * Main JavaScript for Eissayou.github.io
 * Handles mobile navigation and interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger-menu');
  const navLinks = document.getElementById('nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      
      // Accessibility: Update aria-expanded if we were using it (we should)
      const isExpanded = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking a link (better mobile UX)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
});
