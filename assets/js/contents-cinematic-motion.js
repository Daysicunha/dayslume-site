/* DAYSLUME — Ato VII / Conteúdos: contextual illustrations.
 * The existing hero-prism-scroll.js already handles article entrance stagger.
 * This module only gates ambient CSS animation while the section is visible.
 * No requestAnimationFrame, setInterval or hidden-content dependency.
 */
(() => {
  'use strict';
  const section = document.querySelector('body.home-page #conteudos.contents-cinematic');
  if (!section) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let observer = null;

  function stop() {
    observer?.disconnect();
    observer = null;
    section.classList.remove('contents-motion-ready', 'contents-is-visible');
  }

  function sync() {
    stop();
    if (reduced.matches || saveData || document.hidden ||
        typeof IntersectionObserver !== 'function') return;
    section.classList.add('contents-motion-ready');
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        section.classList.toggle('contents-is-visible', entry.isIntersecting);
      }
    }, {threshold: 0.07, rootMargin: '0px 0px -4% 0px'});
    observer.observe(section);
  }

  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
