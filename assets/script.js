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
// Live honeypot stat (home featured card + projects card)
// Reads the honeypot's public daily files (one per Pacific-time day,
// rewritten every 30 minutes by the Logic App). Row 1: today so far +
// when the data was last updated. Row 2: yesterday's full total,
// labeled with its date. If anything fails, the static text stays.
// ---------------------------------------------------------------
(function () {
  const boxes = document.querySelectorAll('.js-honeypot-live');
  if (!boxes.length || !window.fetch) return;

  const BLOB = 'https://honeypotpublicdata.blob.core.windows.net/public-data/attacks_';
  const fmtDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' });
  const fmtLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
  const num = new Intl.NumberFormat('en-US');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Pacific date (YYYY-MM-DD), shifted by whole days, same as the threat map.
  const pacificDate = (offsetDays) => {
    const [y, m, d] = fmtDay.format(new Date()).split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d + offsetDays)).toISOString().slice(0, 10);
  };
  const dayLabel = (iso) => fmtLabel.format(new Date(`${iso}T12:00:00Z`)); // "Fri, Nov 6"

  const load = async (iso) => {
    const res = await fetch(`${BLOB}${iso}.json`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    const rows = await res.json();
    if (!Array.isArray(rows) || !rows.length) throw new Error('empty');
    // When Azure last saved the file (the Logic App rewrites it every 30 min).
    rows.savedAt = Date.parse(res.headers.get('Last-Modified')) || 0;
    return rows;
  };

  const summarize = (rows) => ({
    attempts: rows.reduce((sum, r) => sum + (Number(r.attack_count) || 0), 0),
    ips: new Set(rows.map((r) => r.ip)).size,
    countries: new Set(rows.map((r) => r.country).filter(Boolean)).size,
    savedAt: rows.savedAt,
  });

  const ago = (ms) => {
    const mins = Math.floor((Date.now() - ms) / 60000);
    if (!(mins >= 0)) return '';
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    return hrs < 24 ? `${hrs} hr ago` : '';
  };

  const strong = (n) => `<strong data-count="${n}">${num.format(n)}</strong>`;

  // Count up from 0 once the browser paints. The real totals are already in
  // the DOM, so hidden tabs and crawlers never see a partial number.
  const countUp = (els) => {
    if (reduceMotion || document.visibilityState !== 'visible' || !els.length) return;
    const DURATION = 1200;
    let start;
    const tick = (now) => {
      if (start === undefined) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      const k = 1 - Math.pow(1 - t, 3);
      els.forEach((el) => { el.textContent = num.format(Math.round(el.dataset.count * k)); });
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', () => {
      els.forEach((el) => { el.textContent = num.format(Number(el.dataset.count)); });
    }, { once: true });
  };

  const todayIso = pacificDate(0);
  const yIso = pacificDate(-1);

  Promise.allSettled([load(todayIso), load(yIso)]).then(([t, y]) => {
    const today = t.status === 'fulfilled' ? summarize(t.value) : null;
    const yday = y.status === 'fulfilled' ? summarize(y.value) : null;
    if (!today && !yday) return; // keep the static fallback text

    const yText = yday
      ? `Yesterday (${dayLabel(yIso)}): ${strong(yday.attempts)} from ${num.format(yday.ips)} IPs in ${num.format(yday.countries)} countries`
      : '';
    let mainHtml;
    let subHtml = '';
    if (today) {
      const when = ago(today.savedAt);
      mainHtml = `${strong(today.attempts)} RDP login attempts today` +
        (when ? ` · updated <span class="live-stat__ago">${when}</span>` : '');
      subHtml = yText;
    } else {
      mainHtml = yText; // just after midnight PT, before today's first file lands
    }

    const counters = [];
    boxes.forEach((box) => {
      box.querySelector('.live-stat__main').innerHTML = mainHtml;
      const sub = box.querySelector('.live-stat__sub');
      if (sub) {
        sub.innerHTML = subHtml ? `<span>${subHtml}</span>` : '';
        sub.hidden = !subHtml;
      }
      counters.push(...box.querySelectorAll('strong[data-count]'));
    });
    countUp(counters);

    // Keep "updated N min ago" honest while the page stays open.
    if (today) {
      setInterval(() => {
        const when = ago(today.savedAt);
        document.querySelectorAll('.live-stat__ago').forEach((el) => { el.textContent = when; });
      }, 60000);
    }
  });
})();
