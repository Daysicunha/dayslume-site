/* DAYSLUME experimental hero: CSS-powered spotlight, prism glint, scroll movement.
   No GSAP dependency; uses one coalesced requestAnimationFrame per visual update. */
(() => {
  'use strict';

  const hero = document.querySelector('.hero--motion-lab');
  if (!hero) return;

  const scene = hero.querySelector('[data-flower-scene]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  if (saveData) document.documentElement.classList.add('dayslume-lite-motion');

  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const current = { x: 76, y: 49, glintX: 50, glintY: 45 };
  const target = { ...current };
  let frame = 0;
  let lastScroll = -1;

  const canMove = () => (
    !reduced.matches && !saveData && fine.matches && innerWidth > 800 &&
    !document.hidden && !document.documentElement.classList.contains('motion-paused')
  );
  const canScroll = () => !reduced.matches && !saveData && innerWidth > 800;

  function updateScroll() {
    if (!canScroll()) {
      hero.style.removeProperty('--hero-scroll-shift');
      hero.style.removeProperty('--hero-scroll-rotate');
      hero.style.removeProperty('--hero-scroll-opacity');
      lastScroll = 0;
      return;
    }
    const bounds = hero.getBoundingClientRect();
    if (bounds.top > innerHeight || bounds.bottom < 0) return;
    const progress = clamp(-bounds.top / Math.max(bounds.height, 1), 0, 1);
    if (Math.abs(progress - lastScroll) < .002) return;
    lastScroll = progress;
    hero.style.setProperty('--hero-scroll-shift', (-progress * 42).toFixed(2) + 'px');
    hero.style.setProperty('--hero-scroll-rotate', (-progress * 3.5).toFixed(2) + 'deg');
    hero.style.setProperty('--hero-scroll-opacity', (1 - progress * .22).toFixed(3));
  }

  function render() {
    frame = 0;
    updateScroll();
    if (!canMove()) return;

    let isMoving = false;
    for (const key of ['x', 'y', 'glintX', 'glintY']) {
      const delta = target[key] - current[key];
      current[key] += delta * .105;
      if (Math.abs(delta) > .08) isMoving = true;
      else current[key] = target[key];
    }
    hero.style.setProperty('--spot-x', current.x.toFixed(2) + '%');
    hero.style.setProperty('--spot-y', current.y.toFixed(2) + '%');
    hero.style.setProperty('--prism-x', current.x.toFixed(2) + '%');
    hero.style.setProperty('--prism-y', current.y.toFixed(2) + '%');
    hero.style.setProperty('--glint-x', current.glintX.toFixed(2) + '%');
    hero.style.setProperty('--glint-y', current.glintY.toFixed(2) + '%');
    hero.style.setProperty('--glint-strength', '.66');
    if (isMoving) requestRender();
  }
  function requestRender() {
    if (!frame) frame = requestAnimationFrame(render);
  }
  function onPointerMove(event) {
    if (!canMove() || event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    target.x = clamp((event.clientX - bounds.left) * 100 / bounds.width, 0, 100);
    target.y = clamp((event.clientY - bounds.top) * 100 / bounds.height, 0, 100);
    if (scene) {
      const flower = scene.getBoundingClientRect();
      target.glintX = clamp((event.clientX - flower.left) * 100 / flower.width, 8, 92);
      target.glintY = clamp((event.clientY - flower.top) * 100 / flower.height, 8, 92);
    }
    requestRender();
  }
  function onPointerLeave() {
    target.x = 76;
    target.y = 49;
    target.glintX = 50;
    target.glintY = 45;
    requestRender();
  }
  function sync() {
    if (!canMove()) {
      cancelAnimationFrame(frame);
      frame = 0;
      hero.style.removeProperty('--spot-x');
      hero.style.removeProperty('--spot-y');
      hero.style.removeProperty('--prism-x');
      hero.style.removeProperty('--prism-y');
      hero.style.removeProperty('--glint-x');
      hero.style.removeProperty('--glint-y');
      hero.style.removeProperty('--glint-strength');
    } else {
      Object.assign(current, { x: 76, y: 49, glintX: 50, glintY: 45 });
      Object.assign(target, current);
    }
    lastScroll = -1;
    requestRender();
  }

  hero.addEventListener('pointermove', onPointerMove, { passive: true });
  hero.addEventListener('pointerleave', onPointerLeave, { passive: true });
  addEventListener('scroll', requestRender, { passive: true });
  addEventListener('resize', sync, { passive: true });
  reduced.addEventListener('change', sync);
  fine.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('dayslume:motion', sync);
  sync();
})();