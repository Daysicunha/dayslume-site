/* Interação da flor oficial DAYSLUME.
   Ajustes de intensidade ficam centralizados em FLOWER_MOTION. */
(() => {
  'use strict';

  const FLOWER_MOTION = Object.freeze({
    idleDelay: 180,
    stiffness: 0.045,
    damping: 0.82,
    settleThreshold: 0.018,
    proximityRadius: 0.72,
    breatheScale: 0.016,
    glowBase: 0.48,
    glowBoost: 0.18,
    glowScale: 0.045,
    backgroundX: 7,
    backgroundY: 4,
    petals: [
      { x: 4, y: 4, rotate: 1.1 },
      { x: 6, y: 5, rotate: 1.4 },
      { x: 8, y: 6, rotate: 1.8 },
      { x: 10, y: 7, rotate: 2.2 },
      { x: 12, y: 8, rotate: 2.6 },
      { x: 7, y: 5, rotate: 1.6 }
    ]
  });

  const init = () => {
    const hero = document.querySelector('.hero--interactive-flower');
    const background = hero?.querySelector('[data-hero-background]');
    const scene = hero?.querySelector('[data-flower-scene]');
    const petals = [...(scene?.querySelectorAll('[data-flower-petal]') ?? [])];
    if (!hero || !scene || petals.length !== FLOWER_MOTION.petals.length) return;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const petalState = FLOWER_MOTION.petals.map(() => ({
      x: 0, y: 0, rotate: 0,
      vx: 0, vy: 0, vRotate: 0,
      targetX: 0, targetY: 0, targetRotate: 0
    }));

    let frame = 0;
    let idleTimer = 0;
    let lastTime = 0;
    let scale = 1;
    let scaleVelocity = 0;
    let scaleTarget = 1;
    let glow = FLOWER_MOTION.glowBase;
    let glowVelocity = 0;
    let glowTarget = FLOWER_MOTION.glowBase;
    let glowScale = 1;
    let glowScaleVelocity = 0;
    let glowScaleTarget = 1;

    const isActive = () => (
      finePointer.matches &&
      !reducedMotion.matches &&
      innerWidth > 800 &&
      !document.hidden &&
      !document.documentElement.classList.contains('motion-paused')
    );

    const clearTargets = (clearBreath = false) => {
      petalState.forEach(state => {
        state.targetX = 0;
        state.targetY = 0;
        state.targetRotate = 0;
      });
      if (clearBreath) {
        scaleTarget = 1;
        glowTarget = FLOWER_MOTION.glowBase;
        glowScaleTarget = 1;
      }
    };

    const removeInlineMotion = () => {
      petals.forEach(petal => petal.style.removeProperty('transform'));
      hero.style.removeProperty('--hero-bg-x');
      hero.style.removeProperty('--hero-bg-y');
      scene.style.removeProperty('--flower-scene-scale');
      scene.style.removeProperty('--flower-glow-opacity');
      scene.style.removeProperty('--flower-glow-scale');
    };

    const spring = (value, velocity, target, delta) => {
      velocity += (target - value) * FLOWER_MOTION.stiffness * delta;
      velocity *= Math.pow(FLOWER_MOTION.damping, delta);
      value += velocity * delta;
      return [value, velocity];
    };

    const requestRender = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const render = time => {
      frame = 0;
      if (!isActive()) {
        clearTargets(true);
        removeInlineMotion();
        lastTime = 0;
        return;
      }

      const delta = lastTime ? Math.min(1.8, Math.max(.6, (time - lastTime) / 16.667)) : 1;
      lastTime = time;
      let moving = false;

      petalState.forEach((state, index) => {
        [state.x, state.vx] = spring(state.x, state.vx, state.targetX, delta);
        [state.y, state.vy] = spring(state.y, state.vy, state.targetY, delta);
        [state.rotate, state.vRotate] = spring(state.rotate, state.vRotate, state.targetRotate, delta);

        petals[index].style.transform = `translate3d(${state.x.toFixed(3)}px, ${state.y.toFixed(3)}px, 0) rotate(${state.rotate.toFixed(3)}deg)`;
        moving ||= (
          Math.abs(state.targetX - state.x) > FLOWER_MOTION.settleThreshold ||
          Math.abs(state.targetY - state.y) > FLOWER_MOTION.settleThreshold ||
          Math.abs(state.targetRotate - state.rotate) > FLOWER_MOTION.settleThreshold ||
          Math.abs(state.vx) > FLOWER_MOTION.settleThreshold ||
          Math.abs(state.vy) > FLOWER_MOTION.settleThreshold ||
          Math.abs(state.vRotate) > FLOWER_MOTION.settleThreshold
        );
      });

      [scale, scaleVelocity] = spring(scale, scaleVelocity, scaleTarget, delta);
      [glow, glowVelocity] = spring(glow, glowVelocity, glowTarget, delta);
      [glowScale, glowScaleVelocity] = spring(glowScale, glowScaleVelocity, glowScaleTarget, delta);
      scene.style.setProperty('--flower-scene-scale', scale.toFixed(4));
      scene.style.setProperty('--flower-glow-opacity', glow.toFixed(4));
      scene.style.setProperty('--flower-glow-scale', glowScale.toFixed(4));

      moving ||= (
        Math.abs(scaleTarget - scale) > .0002 ||
        Math.abs(glowTarget - glow) > .001 ||
        Math.abs(glowScaleTarget - glowScale) > .0005 ||
        Math.abs(scaleVelocity) > .0002 ||
        Math.abs(glowVelocity) > .001 ||
        Math.abs(glowScaleVelocity) > .0005
      );

      if (moving) frame = requestAnimationFrame(render);
      else lastTime = 0;
    };

    const updateFromPointer = event => {
      if (!isActive()) return;

      const heroBounds = hero.getBoundingClientRect();
      const sceneBounds = scene.getBoundingClientRect();
      const normalizedX = Math.max(-1, Math.min(1, ((event.clientX - heroBounds.left) / heroBounds.width - .5) * 2));
      const normalizedY = Math.max(-1, Math.min(1, ((event.clientY - heroBounds.top) / heroBounds.height - .5) * 2));

      if (background) {
        hero.style.setProperty('--hero-bg-x', `${(-normalizedX * FLOWER_MOTION.backgroundX).toFixed(2)}px`);
        hero.style.setProperty('--hero-bg-y', `${(-normalizedY * FLOWER_MOTION.backgroundY).toFixed(2)}px`);
      }

      FLOWER_MOTION.petals.forEach((motion, index) => {
        const state = petalState[index];
        state.targetX = normalizedX * motion.x;
        state.targetY = normalizedY * motion.y;
        state.targetRotate = (normalizedX * .7 + normalizedY * .3) * motion.rotate;
      });

      const centerX = sceneBounds.left + sceneBounds.width / 2;
      const centerY = sceneBounds.top + sceneBounds.height / 2;
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
      const radius = Math.min(sceneBounds.width, sceneBounds.height) * FLOWER_MOTION.proximityRadius;
      const proximity = Math.max(0, 1 - distance / radius);
      scaleTarget = 1 + proximity * FLOWER_MOTION.breatheScale;
      glowTarget = FLOWER_MOTION.glowBase + proximity * FLOWER_MOTION.glowBoost;
      glowScaleTarget = 1 + proximity * FLOWER_MOTION.glowScale;

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        clearTargets(false);
        requestRender();
      }, FLOWER_MOTION.idleDelay);
      requestRender();
    };

    const reset = () => {
      clearTimeout(idleTimer);
      clearTargets(true);
      hero.style.setProperty('--hero-bg-x', '0px');
      hero.style.setProperty('--hero-bg-y', '0px');
      requestRender();
    };

    hero.addEventListener('pointermove', updateFromPointer, { passive: true });
    hero.addEventListener('pointerleave', reset, { passive: true });
    reducedMotion.addEventListener('change', reset);
    finePointer.addEventListener('change', reset);
    document.addEventListener('visibilitychange', reset);
    document.addEventListener('dayslume:motion', reset);
    addEventListener('resize', reset, { passive: true });
    reset();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
