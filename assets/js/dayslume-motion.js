/* A shared preference for motion across the institutional pages. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const buttons = [...document.querySelectorAll('.motion-toggle')];
  const terms = [...document.querySelectorAll('.rotating-term')];
  let paused = false;
  let timer;
  let index = 0;
  try { paused = sessionStorage.getItem('dayslume-motion-paused') === 'true'; } catch {}
  const sync = () => {
    clearInterval(timer);
    const stopped = paused || reduced.matches || document.hidden;
    root.classList.toggle('motion-paused', stopped);
    buttons.forEach(button => {
      button.hidden = reduced.matches;
      button.setAttribute('aria-pressed', String(paused));
      button.querySelector('.motion-label').textContent = paused ? 'Ativar animações' : 'Pausar animações';
      button.querySelector('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
    });
    document.dispatchEvent(new Event('dayslume:motion'));
    if (!stopped && terms.length > 1) timer = setInterval(() => {
      terms[index].classList.remove('is-current');
      index = (index + 1) % terms.length;
      terms[index].classList.add('is-current');
    }, 3400);
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    paused = !paused;
    try { sessionStorage.setItem('dayslume-motion-paused', String(paused)); } catch {}
    sync();
  }));
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  root.classList.add('days-motion-ready');
  sync();
})();
