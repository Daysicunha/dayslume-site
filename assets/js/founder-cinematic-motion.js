/* DAYSLUME — Ato VI / Founder cinematic details.
 * Existing hero-prism-scroll.js handles one-shot portrait and headline reveals.
 * This module only enables ambient glow when in view and a single staged
 * entrance for the process rows; no loop or content hiding with JS.
 */
(() => {
  'use strict';
  const section = document.querySelector('body.home-page #sobre.about-cinematic-reference');
  if (!section) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let observer = null;

  const stop = () => {
    observer?.disconnect();
    observer = null;
    section.classList.remove('founder-motion-ready', 'founder-is-visible');
  };

  const sync = () => {
    stop();
    // No ambient animation in hidden tabs, low-data modes, reduced-motion
    // preferences or browsers without IntersectionObserver.
    if (reduced.matches || saveData || document.hidden ||
        typeof IntersectionObserver !== 'function') return;

    section.classList.add('founder-motion-ready');
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        section.classList.toggle('founder-is-visible', entry.isIntersecting);
        if (entry.isIntersecting) section.classList.add('founder-has-entered');
      }
    }, { threshold: 0.07, rootMargin: '0px 0px -4% 0px' });
    observer.observe(section);
  };

  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
