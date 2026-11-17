/* DAYSLUME 3.3 — single rAF for original 3D cluster and atmospheric lighting.
   Preserves the approved 3.2 composition, with no duplicate pointer listeners. */
(() => {
  'use strict';
  const hero=document.querySelector('.hero--cinematic');
  const cluster=hero?.querySelector('.cinema-cluster');
  if (!hero || !cluster) return;
  const atmosphere=hero.querySelector('.cinema33-atmosphere');
  const pointer=matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0, pointerX=0, pointerY=0;

  const allowed=()=>pointer.matches && !reduced.matches && !document.hidden &&
    !document.documentElement.classList.contains('motion-paused');
  function paint() {
    raf=0;
    if (!allowed()) return;
    const b=hero.getBoundingClientRect();
    const w=Math.max(1,b.width), h=Math.max(1,b.height);
    const px=Math.max(0,Math.min(1,(pointerX-b.left)/w));
    const py=Math.max(0,Math.min(1,(pointerY-b.top)/h));
    const x=px*2-1, y=py*2-1;
    cluster.style.setProperty('--cinema-shift-x',(x*9).toFixed(1)+'px');
    cluster.style.setProperty('--cinema-shift-y',(y*6).toFixed(1)+'px');
    if (atmosphere) {
      atmosphere.style.setProperty('--cinema33-pointer-x',(px*100).toFixed(1)+'%');
      atmosphere.style.setProperty('--cinema33-pointer-y',(py*100).toFixed(1)+'%');
    }
  }
  function move(event) {
    if (!allowed()) return;
    pointerX=event.clientX;
    pointerY=event.clientY;
    if (!raf) raf=requestAnimationFrame(paint);
  }
  function reset() {
    if (raf) cancelAnimationFrame(raf);
    raf=0;
    cluster.style.removeProperty('--cinema-shift-x');
    cluster.style.removeProperty('--cinema-shift-y');
    atmosphere?.style.removeProperty('--cinema33-pointer-x');
    atmosphere?.style.removeProperty('--cinema33-pointer-y');
  }
  hero.addEventListener('pointermove',move,{passive:true});
  hero.addEventListener('pointerleave',reset,{passive:true});
  reduced.addEventListener('change',reset);
  pointer.addEventListener('change',reset);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});
  document.addEventListener('dayslume:motion',()=>{if(!allowed())reset();});
  window.addEventListener('pagehide',reset,{once:true});
})();
