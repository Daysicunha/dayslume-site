/* DAYSLUME Hero 3.1: editorial typography that splits, re-forms and
   reveals the commercial hero during scroll. All movements are scroll-driven
   (reversible), progressive and disabled on mobile, reduced motion / Save-Data.
   Retains the independent six-petal flower module and the prism spotlight. */
(() => {
  'use strict';
  const hero = document.querySelector('[data-kiru-story]');
  if (!hero) return;

  const stage = hero.querySelector('[data-kiru-stage]');
  const words = [...hero.querySelectorAll('[data-kiru-word]')];
  const keywords = [...hero.querySelectorAll('[data-kiru-keyword]')];
  const opening = hero.querySelector('.hero-kiru-opening');
  const reveal = hero.querySelector('[data-kiru-reveal]');
  const flower = hero.querySelector('.hero-visual-composition');
  const scene = hero.querySelector('[data-flower-scene]');
  const progressLine = hero.querySelector('[data-kiru-progress]');
  if (!stage || !opening || !reveal || !flower || words.length !== 6 || keywords.length !== 3) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  if (saveData) document.documentElement.classList.add('dayslume-lite-motion');

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smooth = v => { const x = clamp(v); return x * x * (3 - 2 * x); };
  const phase = (p, start, end) => smooth((p - start) / (end - start));
  const vectors = [
    [-.40, -.21, -14], [.38, -.23, 13],
    [-.34, -.07, -9],  [.34, .09, 11],
    [-.26, .26, -14],  [.30, .23, 14]
  ];

  let enabled = false;
  let frame = 0;
  let pointerActive = false;
  const cursor = { x: 74, y: 48, glintX: 50, glintY: 50 };
  const target = { ...cursor };

  const allowMode = () => innerWidth > 800 && !reduced.matches && !saveData;
  const allowCursor = () => enabled && fine.matches && !document.hidden &&
    !document.documentElement.classList.contains('motion-paused');

  function resetStatic() {
    words.forEach(word => { word.style.removeProperty('transform'); word.style.removeProperty('opacity'); });
    keywords.forEach(word => { word.style.removeProperty('transform'); word.style.removeProperty('opacity'); });
    [opening, reveal, flower].forEach(el => {
      el.style.removeProperty('opacity'); el.style.removeProperty('transform');
    });
    opening.style.removeProperty('pointer-events');
    reveal.style.removeProperty('pointer-events');
    reveal.inert = false;
    hero.style.removeProperty('--kiru-scroll-hint');
    hero.style.removeProperty('--kiru-intro-opacity');
    hero.style.removeProperty('--kiru-intro-y');
    hero.style.removeProperty('--kiru-copy-shift');
    hero.style.removeProperty('--glint-strength');
    if (progressLine) progressLine.style.removeProperty('width');
  }

  function renderScroll() {
    if (!enabled) return;
    const rect = hero.getBoundingClientRect();
    const distance = Math.max(1, rect.height - innerHeight);
    const p = clamp(-rect.top / distance);
    const split = phase(p, .055, .35);
    const exit = phase(p, .29, .43);
    const wordsIn = phase(p, .32, .52);
    const wordsOut = phase(p, .53, .70);
    const disclosure = phase(p, .64, .86);
    const flowerIn = phase(p, .44, .80);

    words.forEach((word, i) => {
      const [dx,dy,rotate] = vectors[i];
      const x = dx * innerWidth * split;
      const y = dy * innerHeight * split;
      word.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' +
        y.toFixed(1) + 'px,0) rotate(' + (rotate * split).toFixed(2) + 'deg)';
      word.style.opacity = (1 - exit).toFixed(3);
    });

    hero.style.setProperty('--kiru-intro-opacity', (1 - phase(p,.10,.34)).toFixed(3));
    hero.style.setProperty('--kiru-intro-y', (-18 * split).toFixed(1) + 'px');
    hero.style.setProperty('--kiru-scroll-hint', (1 - phase(p,.02,.15)).toFixed(3));

    keywords.forEach((word, i) => {
      const stagger = phase(p, .32 + .035*i, .50 + .035*i);
      const escape = phase(p, .54 + .018*i, .70 + .018*i);
      const visible = Math.min(stagger, 1 - escape);
      const x = (i-1) * 90 * escape;
      const y = (1 - stagger)*46 + escape*(i%2===0?-55:60);
      const rotation = (i-1)*6*escape;
      word.style.opacity = clamp(visible).toFixed(3);
      word.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' +
        y.toFixed(1) + 'px,0) rotate(' + rotation.toFixed(2) +
        'deg) scale(' + (.91 + stagger*.09 + escape*.075).toFixed(3) + ')';
    });

    reveal.style.opacity = disclosure.toFixed(3);
    reveal.style.transform = 'translate3d(0,calc(-50% + ' +
      ((1-disclosure)*40).toFixed(1) + 'px),0)';
    reveal.style.pointerEvents = disclosure > .85 ? 'auto' : 'none';
    reveal.inert = disclosure < .85;

    flower.style.opacity = (flowerIn * (.48 + .52*disclosure)).toFixed(3);
    const flowerX = 70 * (1 - flowerIn);
    flower.style.transform = 'translate3d(' + flowerX.toFixed(1) +
      'px,-50%,0) scale(' + (.80 + .20*flowerIn).toFixed(3) + ')';
    hero.style.setProperty('--glint-strength', (.1 + .5*flowerIn).toFixed(3));
    if (progressLine) progressLine.style.width = (p*100).toFixed(2) + '%';
    opening.style.pointerEvents = 'none';
  }

  function renderPointer() {
    if (!allowCursor()) return false;
    let movement = false;
    for (const prop of ['x','y','glintX','glintY']) {
      const delta = target[prop] - cursor[prop];
      cursor[prop] += delta*.12;
      if (Math.abs(delta) < .06) cursor[prop] = target[prop];
      else movement = true;
    }
    hero.style.setProperty('--spot-x',cursor.x.toFixed(2)+'%');
    hero.style.setProperty('--spot-y',cursor.y.toFixed(2)+'%');
    hero.style.setProperty('--prism-x',cursor.x.toFixed(2)+'%');
    hero.style.setProperty('--prism-y',cursor.y.toFixed(2)+'%');
    hero.style.setProperty('--glint-x',cursor.glintX.toFixed(2)+'%');
    hero.style.setProperty('--glint-y',cursor.glintY.toFixed(2)+'%');
    return movement;
  }

  function tick() {
    frame = 0;
    renderScroll();
    if (renderPointer()) schedule();
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function onPointerMove(e) {
    if (!allowCursor() || e.pointerType === 'touch') return;
    const bounds = stage.getBoundingClientRect();
    target.x = clamp((e.clientX-bounds.left)/bounds.width)*100;
    target.y = clamp((e.clientY-bounds.top)/bounds.height)*100;
    if (scene) {
      const flowerRect=scene.getBoundingClientRect();
      target.glintX = clamp((e.clientX-flowerRect.left)/flowerRect.width)*100;
      target.glintY = clamp((e.clientY-flowerRect.top)/flowerRect.height)*100;
    }
    pointerActive = true;
    schedule();
  }
  function onPointerLeave() {
    if (!pointerActive) return;
    pointerActive = false;
    Object.assign(target,{x:74,y:48,glintX:50,glintY:50});
    schedule();
  }

  function syncMode() {
    const wasEnabled = enabled;
    enabled = allowMode();
    hero.classList.toggle('hero--kiru-ready',enabled);
    if (!enabled) {
      cancelAnimationFrame(frame);
      frame = 0;
      resetStatic();
    } else if (!wasEnabled) {
      Object.assign(cursor,{x:74,y:48,glintX:50,glintY:50});
      Object.assign(target,cursor);
      reveal.inert = true;
    }
    if (!allowCursor()) onPointerLeave();
    schedule();
  }

  stage.addEventListener('pointermove',onPointerMove,{passive:true});
  stage.addEventListener('pointerleave',onPointerLeave,{passive:true});
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',syncMode,{passive:true});
  reduced.addEventListener('change',syncMode);
  fine.addEventListener('change',syncMode);
  document.addEventListener('dayslume:motion',schedule);
  document.addEventListener('visibilitychange',syncMode);
  syncMode();
})();
