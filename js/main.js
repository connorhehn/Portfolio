/* ==========================================================================
   Theme Toggle
   ========================================================================== */

const THEME_KEY = 'ch-theme';
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

// Init — inline script already set the attribute; just sync the button label
applyTheme(html.getAttribute('data-theme') || 'dark');

document.getElementById('theme-toggle').addEventListener('click', () => {
  applyTheme((html.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark');
});

/* ==========================================================================
   Text Scramble — resolves left-to-right on page load
   ========================================================================== */

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
const SCRAMBLE_TEXTS = [
  'Software Engineer.',
  'Backend Developer.',
  'Cloud Architect.',
];
const DURATION_MS    = 1200;
const TICK_MS        = 38;

function scramble(el, text, duration, onComplete) {
  const totalFrames = Math.round(duration / TICK_MS);
  let frame = 0;

  const tick = setInterval(() => {
    el.textContent = text
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        const resolveFrame = Math.floor((i / text.length) * totalFrames * 0.8);
        if (frame >= resolveFrame) return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join('');

    frame++;

    if (frame > totalFrames) {
      clearInterval(tick);
      el.textContent = text;
      if (onComplete) onComplete();
    }
  }, TICK_MS);
}

function loopScramble(el, index) {
  const text = SCRAMBLE_TEXTS[index];
  scramble(el, text, DURATION_MS, () => {
    setTimeout(() => loopScramble(el, (index + 1) % SCRAMBLE_TEXTS.length), 2500);
  });
}

const scrambleEl = document.getElementById('scramble-text');
if (scrambleEl) {
  setTimeout(() => loopScramble(scrambleEl, 0), 600);
}

/* ==========================================================================
   Hamburger menu
   ========================================================================== */

const nav      = document.getElementById('nav');
const hamburger = document.getElementById('nav-hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  document.querySelectorAll('#nav-mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    });
  });
}

/* ==========================================================================
   Nav — scroll state + active link tracking
   ========================================================================== */

const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);

  const scrollY = window.scrollY;
  sections.forEach(section => {
    const top    = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.nav === section.id);
      });
    }
  });
}, { passive: true });

// Run once on load
nav.classList.toggle('scrolled', window.scrollY > 40);

/* ==========================================================================
   Reveal animations via IntersectionObserver
   ========================================================================== */

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ==========================================================================
   Smooth scroll for anchor links
   ========================================================================== */

const NAV_H = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - NAV_H, behavior: 'smooth' });
  });
});
