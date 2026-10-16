/* DAYSLUME | Motion editorial experimental (escopo: Home / preview).
   Sem dependências; não altera o controlador existente da hero ou dos cards. */
(() => {
  'use strict';
  const root = document.documentElement;
  const bridge = document.querySelector('[data-dm-bridge]');
  if (!bridge) return;
  const brand = bridge.querySelector('.dm-motion-bridge__brand');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection?.saveData);
  let observer;
  let frame = 0;
  let enabled = false;
  const clamp = (v, a, b) => Math.min(b, Math.max(a,v));

  function paint() {
    frame = 0;
    if (!enabled || !brand || document.hidden) return;
    const rect = bridge.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const progress = clamp((innerHeight - rect.top) / (innerHeight + rect.height),0,1);
    brand.style.setProperty('--dm-turn', (progress * 48 - 16).toFixed(2)+'deg');
  }
  function schedule() {
    if (enabled && !frame) frame = requestAnimationFrame(paint);
  }
  function teardown() {
    enabled = false;
    observer?.disconnect();
    observer = null;
    if(frame) cancelAnimationFrame(frame);
    frame=0;
    brand?.style.removeProperty('--dm-turn');
    bridge.classList.add('is-in-view');
    root.classList.remove('dm-motion-ready');
  }
  function setup() {
    if (reduce.matches || saveData) {teardown();return;}
    enabled = true;
    bridge.classList.remove('is-in-view');
    root.classList.add('dm-motion-ready');
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        if(entries.some(entry => entry.isIntersecting)) {
          bridge.classList.add('is-in-view');
          observer.disconnect();
          observer=null;
        }
      }, {rootMargin:'0px 0px -7% 0px',threshold:0.10});
      observer.observe(bridge);
    } else bridge.classList.add('is-in-view');
    schedule();
  }
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  document.addEventListener('visibilitychange',schedule);
  reduce.addEventListener('change',()=>{teardown();setup()});
  setup();
})();
