/* DAYSLUME / Hero Master — activation of the existing cinematic 3D motion.
 * The original hero-cinematic.js owns cursor parallax (single rAF).
 * The CSS in cinematic-floating-panels already owns soft device drift.
 * This observer enables their first arrival and stops ambient movement
 * when out of view; no extra animation loop or access to other sections.
 */
(() => {
  'use strict';
  const hero = document.querySelector('body.home-page #apresentacao[data-hero-master]');
  if (!hero) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let observer = null;
  let entered = false;

  function stop() {
    observer?.disconnect();
    observer = null;
    hero.classList.remove('hero-master-visible', 'hero-master-motion-ready');
  }

  function sync() {
    stop();
    if (reduced.matches || saveData || document.hidden ||
        typeof IntersectionObserver !== 'function') return;

    hero.classList.add('hero-master-motion-ready');
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const visible = entry.isIntersecting && !document.hidden;
        hero.classList.toggle('hero-master-visible', visible);
        if (visible && !entered) {
          entered = true;
          hero.classList.add('is-3d-visible');
        }
      }
    }, {threshold: 0.08, rootMargin: '0px 0px -3% 0px'});
    observer.observe(hero);
  }

  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', stop, {once: true});
  sync();
})();
