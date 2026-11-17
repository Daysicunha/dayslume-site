/* DAYSLUME / Ato V: brilho ambiente apenas enquanto os cases estão visíveis.
   A entrada escalonada de cards é administrada pelo hero-prism-scroll.js.
   O conteúdo permanece totalmente legível quando JS ou animações não estão disponíveis. */
(() => {
  'use strict';
  const section = document.querySelector('body.home-page #projetos.cases-reference-compact');
  if (!section) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let observer = null;
  function stop() {
    observer?.disconnect();
    observer = null;
    section.classList.remove('cases-motion-ready', 'cases-is-visible');
  }
  function sync() {
    stop();
    if (reduced.matches || saveData || document.hidden || typeof IntersectionObserver !== 'function') return;
    section.classList.add('cases-motion-ready');
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) section.classList.toggle('cases-is-visible', entry.isIntersecting);
    }, { threshold: 0.06, rootMargin: '0px 0px -3% 0px' });
    observer.observe(section);
  }
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
