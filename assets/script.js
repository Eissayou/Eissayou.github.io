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

  // ---------------------------------------------------------------
  // Profile photo album lightbox (home page)
  // Images are only fetched on first open, so the initial page
  // load stays as light as before.
  // ---------------------------------------------------------------
  const photoBtn = document.getElementById('profile-photo-btn');
  const lightbox = document.getElementById('photo-lightbox');

  if (photoBtn && lightbox) {
    const ALBUM = [
      {
        src: 'assets/album/jason-eissayou-willis-tower-skydeck.jpg',
        alt: 'Jason Eissayou on the glass Skydeck ledge of Willis Tower, Chicago',
        caption: 'Skydeck ledge, Willis Tower, Chicago'
      },
      {
        src: 'assets/album/jason-eissayou-tennis-trophies.jpg',
        alt: 'Jason Eissayou with the 2024 Jimmy Kvarme Tribute Tournament 4.0 singles and doubles champion plaques',
        caption: 'Kvarme Tournament 2024, singles & doubles champion'
      },
      {
        src: 'assets/album/jason-eissayou-uc-davis-ta-award.jpg',
        alt: 'Jason Eissayou receiving the 2025 Teaching Assistant Excellence Award at UC Davis',
        caption: 'Receiving the TA Excellence Award at UC Davis'
      },
      {
        src: 'assets/album/jason-eissayou-hackdavis-visual-tales.jpg',
        alt: 'Jason Eissayou presenting Visual Tales at the HackDavis 2023 hackathon at UC Davis',
        caption: 'Building Visual Tales at HackDavis 2023'
      },
      {
        src: 'assets/album/jason-eissayou-tennis.jpg',
        alt: 'Jason Eissayou playing tennis at a Laguna Creek Sports Club tournament',
        caption: 'Tournament at Laguna Creek Sports Club'
      },
      {
        src: 'assets/album/jason-eissayou-grand-teton.jpg',
        alt: 'Jason Eissayou at Grand Teton National Park',
        caption: 'Grand Teton National Park'
      },
      {
        src: 'assets/album/jason-eissayou-santa-monica-pier.jpg',
        alt: 'Jason Eissayou at the Santa Monica Pier',
        caption: 'Santa Monica Pier'
      },
      {
        src: 'assets/album/jason-eissayou-california-beach.jpg',
        alt: 'Jason Eissayou at a Northern California beach',
        caption: 'NorCal coast'
      }
    ];

    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const dotsWrap = document.getElementById('lightbox-dots');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let index = 0;
    let lastFocused = null;
    const preloaded = new Set();

    const preload = (i) => {
      const item = ALBUM[(i + ALBUM.length) % ALBUM.length];
      if (preloaded.has(item.src)) return;
      preloaded.add(item.src);
      new Image().src = item.src;
    };

    // Build dots once
    ALBUM.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'lightbox-dot';
      dot.setAttribute('aria-label', 'Photo ' + (i + 1) + ' of ' + ALBUM.length);
      dot.addEventListener('click', () => show(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    const show = (i) => {
      index = (i + ALBUM.length) % ALBUM.length;
      const item = ALBUM[index];
      img.src = item.src;
      img.alt = item.alt;
      caption.textContent = item.caption;
      dots.forEach((d, di) => d.setAttribute('aria-current', di === index ? 'true' : 'false'));
      preload(index + 1);
      preload(index - 1);
    };

    const open = () => {
      lastFocused = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      show(index);
      closeBtn.focus();
    };

    const close = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    };

    photoBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => show(index - 1));
    nextBtn.addEventListener('click', () => show(index + 1));

    // Click on the dark backdrop closes
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });

    // Keyboard: arrows navigate, Escape closes, Tab stays trapped
    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
      else if (e.key === 'Tab') {
        const focusables = lightbox.querySelectorAll('button');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Touch: swipe left/right
    let touchStartX = null;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) > 45) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }
});

// ---------------------------------------------------------------
// Live honeypot stat (home featured card)
// Reads the honeypot's public daily file for yesterday (Pacific time,
// the same day boundary the threat map uses). If anything fails, the
// static fallback text in the HTML stays put.
// ---------------------------------------------------------------
(function () {
  const textEl = document.getElementById('honeypot-live-text');
  if (!textEl || !window.fetch) return;

  const BLOB = 'https://honeypotpublicdata.blob.core.windows.net/public-data/attacks_';
  const fmtDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' });
  const pacificDate = (offsetDays) => {
    const [y, m, d] = fmtDay.format(new Date()).split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + offsetDays)).toISOString().slice(0, 10);
  };
  const num = new Intl.NumberFormat('en-US');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const tryDay = async (offset) => {
    const res = await fetch(`${BLOB}${pacificDate(offset)}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    const rows = await res.json();
    if (!Array.isArray(rows) || !rows.length) throw new Error('empty');
    return rows;
  };

  const render = (rows, offset) => {
    const attempts = rows.reduce((sum, r) => sum + (Number(r.attack_count) || 0), 0);
    const ips = new Set(rows.map((r) => r.ip)).size;
    const countries = new Set(rows.map((r) => r.country).filter(Boolean)).size;
    const when = offset === -1 ? 'yesterday' : 'in one day';
    textEl.innerHTML =
      `<strong id="honeypot-live-count">${num.format(attempts)}</strong> ` +
      `RDP login attempts ${when} from ${num.format(ips)} IPs in ${num.format(countries)} countries`;
    if (reduceMotion || document.visibilityState !== 'visible') return;
    // The final number is already in the DOM; the count-up only starts once
    // the browser actually paints (rAF), so a hidden tab or a renderer that
    // never fires rAF still shows the real total rather than 0.
    const countEl = document.getElementById('honeypot-live-count');
    const DURATION = 1200;
    let start;
    const tick = (now) => {
      if (start === undefined) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      countEl.textContent = num.format(Math.round(attempts * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // If the tab is hidden mid-animation, rAF pauses; snap to the real total.
    document.addEventListener('visibilitychange', () => {
      countEl.textContent = num.format(attempts);
    }, { once: true });
  };

  tryDay(-1)
    .then((rows) => render(rows, -1))
    .catch(() => tryDay(-2).then((rows) => render(rows, -2)))
    .catch(() => { /* keep the static fallback text */ });
})();
