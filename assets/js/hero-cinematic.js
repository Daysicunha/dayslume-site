/* DAYSLUME — compositor de profundidade da Hero 3D.
 * Um listener e um rAF compartilhado; nenhum loop JavaScript contínuo.
 * A animação decorativa só começa quando a Hero entra na viewport. */
(() => {
  'use strict';
  const hero = document.querySelector('#apresentacao.hero--floating-panels');
  const cluster = hero?.querySelector('.cinema-cluster');
  if (!hero || !cluster) return;

  const panels = [
    { node: cluster.querySelector('.cinema-float--vitrini'), x: 6, y: 4 },
    { node: cluster.querySelector('.cinema-float--engreni'), x: -11, y: -8 },
    { node: cluster.querySelector('.cinema-float--service'), x: 4, y: 6 },
    { node: cluster.querySelector('.cinema-depth--violet'), x: -9, y: -5 },
    { node: cluster.querySelector('.cinema-depth--peach'), x: 8, y: 7 }
  ].filter(item => item.node);
  const atmosphere = hero.querySelector('.cinema33-atmosphere');
  const precise = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let frame = 0;
  let visible = false;
  let pointerX = 0;
  let pointerY = 0;

  const motionEnabled = () => !reduced.matches && !saveData &&
    !document.hidden && !document.documentElement.classList.contains('motion-paused');

  const parallaxEnabled = () => visible && precise.matches && motionEnabled();

  function applyFrame() {
    frame = 0;
    if (!parallaxEnabled()) return;
    const rect = hero.getBoundingClientRect();
    const w = Math.max(rect.width, 1);
    const h = Math.max(rect.height, 1);
    const normalizedX = Math.max(-1, Math.min(1, 2 * (pointerX - rect.left) / w - 1));
    const normalizedY = Math.max(-1, Math.min(1, 2 * (pointerY - rect.top) / h - 1));

    panels.forEach(({ node, x, y }) => {
      node.style.setProperty('--cinema-panel-x', (normalizedX * x).toFixed(1) + 'px');
      node.style.setProperty('--cinema-panel-y', (normalizedY * y).toFixed(1) + 'px');
    });
    if (atmosphere) {
      atmosphere.style.setProperty('--cinema33-pointer-x', ((normalizedX + 1) * 50).toFixed(1) + '%');
      atmosphere.style.setProperty('--cinema33-pointer-y', ((normalizedY + 1) * 50).toFixed(1) + '%');
    }
  }

  function reset() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    panels.forEach(({ node }) => {
      node.style.removeProperty('--cinema-panel-x');
      node.style.removeProperty('--cinema-panel-y');
    });
    atmosphere?.style.removeProperty('--cinema33-pointer-x');
    atmosphere?.style.removeProperty('--cinema33-pointer-y');
  }

  function sync() {
    const animate = visible && motionEnabled();
    hero.classList.toggle('is-3d-visible', animate);
    if (!parallaxEnabled()) reset();
  }

  hero.addEventListener('pointermove', event => {
    if (!parallaxEnabled() || event.pointerType === 'touch') return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) frame = requestAnimationFrame(applyFrame);
  }, { passive: true });
  hero.addEventListener('pointerleave', reset, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      sync();
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    observer.observe(hero);
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
  } else {
    // Sem IntersectionObserver: interfaces sempre visíveis, sem animação extra.
    visible = false;
  }

  reduced.addEventListener('change', sync);
  precise.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('dayslume:motion', sync);
  window.addEventListener('pagehide', reset, { once: true });
})();
