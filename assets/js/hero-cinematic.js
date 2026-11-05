/* DAYSLUME 3.2 — microparalaxe progressiva, sem interceptar scroll ou interação. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero--cinematic');
  const cluster = hero && hero.querySelector('.cinema-cluster');
  if (!hero || !cluster) return;
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  const move = event => {
    if (!pointer.matches || reduced.matches || document.documentElement.classList.contains('motion-paused')) return;
    const b = hero.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - b.left - b.width / 2) / (b.width / 2)));
    const y = Math.max(-1, Math.min(1, (event.clientY - b.top - b.height / 2) / (b.height / 2)));
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      cluster.style.setProperty('--cinema-shift-x', (x * 9).toFixed(1) + 'px');
      cluster.style.setProperty('--cinema-shift-y', (y * 6).toFixed(1) + 'px');
      raf = 0;
    });
  };
  const reset = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    cluster.style.removeProperty('--cinema-shift-x');
    cluster.style.removeProperty('--cinema-shift-y');
  };
  hero.addEventListener('pointermove', move, { passive: true });
  hero.addEventListener('pointerleave', reset);
  reduced.addEventListener('change', reset);
  pointer.addEventListener('change', reset);
})();
