/* DAYSLUME — Ato III: gentle product-illustration motion.
 * Reuses existing card-scroll choreography; only toggles the illustration's
 * in-viewport state. Content and links remain visible without JavaScript.
 */
(() => {
  'use strict';
  const section = document.querySelector('body.home-page #modelo');
  if (!section) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let observer = null;

  const stop = () => {
    observer?.disconnect();
    observer = null;
    section.classList.remove('modelo-motion-ready', 'is-modelo-visible');
  };

  const sync = () => {
    stop();
    // Static illustrations remain readable for reduced motion, save data,
    // unsupported browsers or a hidden document. No hidden-by-default CSS.
    if (reduced.matches || saveData || document.hidden ||
        typeof IntersectionObserver !== 'function') return;

    section.classList.add('modelo-motion-ready');
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        section.classList.toggle('is-modelo-visible', entry.isIntersecting);
      }
    }, {threshold: 0.09, rootMargin: '0px 0px -4% 0px'});
    observer.observe(section);
  };

  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
