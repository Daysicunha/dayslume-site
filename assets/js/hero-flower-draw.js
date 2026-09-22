/* A flor oficial é um SVG estático: o contorno é desenhado uma vez,
   e o arquivo original colorido fica visível no quadro final.
   Em falha de rede, JS desligado ou movimento reduzido, a flor segue visível. */
(() => {
  'use strict';
  const stage = document.querySelector('[data-days-flower-draw]');
  const image = stage?.querySelector('.hero-flower');
  if (!stage || !image || !window.Element?.prototype?.animate) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  const root = document.documentElement;
  const animations = [];
  let completed = false;
  let overlay = null;
  const clear = () => {
    if (completed) return;
    completed = true;
    animations.forEach(a => a.cancel());
    stage.classList.remove('is-drawing');
    stage.classList.add('is-finished');
    overlay?.remove();
  };
  const sync = () => {
    if (reduced.matches) { clear(); return; }
    const stopped = root.classList.contains('motion-paused') || document.hidden;
    animations.forEach(a => {
      if (stopped && a.playState === 'running') a.pause();
      else if (!stopped && a.playState === 'paused') a.play();
    });
  };
  document.addEventListener('dayslume:motion', sync);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  async function draw() {
    try {
      const response = await fetch(image.getAttribute('src'), { cache: 'force-cache' });
      if (!response.ok || reduced.matches) return;
      const source = new DOMParser().parseFromString(await response.text(), 'image/svg+xml');
      const svg = source.documentElement;
      if (svg.localName !== 'svg' || svg.querySelector('parsererror') || reduced.matches) return;
      const paths = [...svg.querySelectorAll('path')];
      if (!paths.length) return;
      svg.classList.add('hero-draw-overlay');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.querySelectorAll('defs').forEach(node => node.remove());
      paths.forEach((path, index) => {
        path.setAttribute('fill', 'none');
        path.removeAttribute('fill-rule');
        path.setAttribute('stroke', [1, 3].includes(index) ? '#efc8b2' : '#afcff0');
        path.setAttribute('stroke-width', index < 4 ? '4' : '3');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('vector-effect', 'non-scaling-stroke');
      });
      stage.appendChild(svg);
      overlay = svg;
      stage.classList.add('is-drawing');
      const tasks = paths.map((path, index) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = String(length + 2);
        path.style.strokeDashoffset = String(length + 2);
        const animation = path.animate(
          [{ strokeDashoffset: length + 2, opacity: .3 }, { strokeDashoffset: 0, opacity: 1 }],
          { duration: 1450, delay: index * 185, easing: 'cubic-bezier(.3,.08,.28,1)', fill: 'forwards' }
        );
        animations.push(animation);
        return animation.finished;
      });
      sync();
      await Promise.all(tasks);
      if (!completed) {
        completed = true;
        stage.classList.remove('is-drawing');
        stage.classList.add('is-finished');
        const finish = () => { overlay?.remove(); overlay = null; };
        svg.addEventListener('transitionend', finish, { once: true });
        setTimeout(finish, 950);
      }
    } catch {
      clear();
    }
  }
  draw();
})();
