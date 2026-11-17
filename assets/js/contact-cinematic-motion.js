/* DAYSLUME Ato VIII — finishing light for contact/diagnostic.
 * Existing hero-prism-scroll.js handles editorial entrance.
 * These subtle CSS effects pause when offscreen, in background tabs, with
 * reduced motion or Save-Data. The form is activated exclusively by
 * dayslume-contact.js after its submit handler is installed.
 */
(() => {
  'use strict';
  const section = document.querySelector('body.home-page #contato.contact-cinematic-final');
  if (!section) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let observer = null;

  function stop() {
    observer?.disconnect();
    observer = null;
    section.classList.remove('contact-motion-ready', 'contact-is-visible');
  }

  function sync() {
    stop();
    if (reduced.matches || saveData || document.hidden ||
        typeof IntersectionObserver !== 'function') return;

    section.classList.add('contact-motion-ready');
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        section.classList.toggle('contact-is-visible', entry.isIntersecting);
        if (entry.isIntersecting) section.classList.add('contact-has-entered');
      }
    }, { threshold: 0.06, rootMargin: '0px 0px -3% 0px' });
    observer.observe(section);
  }

  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
