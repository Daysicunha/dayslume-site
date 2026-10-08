/* Progressive enhancement only. Navigation, content and direct contact work without JS. */
(() => {
  'use strict';
  const root = document.documentElement;
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#menu-principal');
  const mobile = window.matchMedia('(max-width: 1180px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const closeMenu = (returnFocus = false) => {
    menu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
    if (returnFocus) menuButton?.focus();
  };
  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (!menu?.classList.contains('open') || !mobile.matches) return;
    if (event.key === 'Escape') { closeMenu(true); return; }
    if (event.key !== 'Tab') return;
    const controls = [menuButton, ...menu.querySelectorAll('a[href], button')];
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  mobile.addEventListener('change', () => closeMenu());
  root.classList.add('home-nav-ready');
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    const reveal = (selector, step = 70, start = 0) => {
      document.querySelectorAll(selector).forEach((el, index) => {
        el.classList.add('launch-reveal');
        el.style.setProperty('--reveal-delay', `${start + index * step}ms`);
        observer.observe(el);
      });
    };
    reveal('.manifest-eyebrow, .manifest-title, .manifest-intro', 85);
    reveal('.manifest-item', 70, 255);
    reveal('.intro-section .section-heading > div', 90);
    reveal('.launch-pillars .service-card', 85);
    // Hero motion module owns section 03's editorial choreography.
    reveal('.home-process-section .section-heading > div', 90);
    // Os cinco passos são acionados por progresso real de scroll na hero experimental.
    reveal('.home-process-list:not([data-process-scroll]) li', 70);
    // Sections 04/06/07/08 now use one-shot, section-specific reveals
    // from the hero motion module; prevent double animations.
    const process = document.querySelector('.home-process-list');
    if (process) observer.observe(process);
  }
})();
