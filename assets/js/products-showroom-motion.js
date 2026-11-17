/* DAYSLUME · Ato IV product showroom: ambient illustration motion only.
 * Existing cinematic-experience-33.js owns filter state and accessibility.
 * Existing hero-prism-scroll.js owns one-shot entry of ecosystem cards.
 * This module does not hide content, move the cards or run animation loops.
 */
(() => {
  'use strict';
  const section = document.querySelector('body.home-page #produtos.products-compact');
  if (!section) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let observer = null;

  const reset = () => {
    if (observer) observer.disconnect();
    observer = null;
    section.classList.remove('products-motion-ready', 'products-is-visible');
  };

  function sync() {
    reset();
    if (reduced.matches || saveData || document.hidden ||
        typeof IntersectionObserver !== 'function') return;
    section.classList.add('products-motion-ready');
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        section.classList.toggle('products-is-visible', entry.isIntersecting);
      }
    }, {threshold: 0.06, rootMargin: '0px 0px -4% 0px'});
    observer.observe(section);
  }

  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
