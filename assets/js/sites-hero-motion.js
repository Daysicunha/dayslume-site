/* DAYSLUME | Sites Institucionais | perspective-follow preview.
   No external libraries: only transform updates on desktop, capped by rAF.
   Scroll eases the mockup toward a frontal position and leads into the simulator.
   Mobile, coarse pointer and reduced-motion keep a static, readable preview. */
(() => {
  'use strict';
  const hero=document.querySelector('.sites-hero-flagship');
  const visual=hero?.querySelector('[data-sites-hero-motion]');
  const preview=visual?.querySelector('[data-sites-hero-preview]');
  if(!hero || !visual || !preview)return;

  const desktop=matchMedia('(min-width: 941px) and (hover: hover) and (pointer: fine)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  let pointerX=0,pointerY=0,frame=0;

  function clearMotion(){
    for(const name of ['--sites-preview-tilt-y','--sites-preview-tilt-x','--sites-preview-rise']){
      preview.style.removeProperty(name);
    }
  }
  function update(){
    frame=0;
    if(!desktop.matches || reduced.matches || document.hidden){
      clearMotion();
      return;
    }
    const bounds=hero.getBoundingClientRect();
    if(bounds.bottom<0 || bounds.top>innerHeight)return;
    // The transformation approaches the flat simulator view as the user scrolls.
    const progress=clamp(-bounds.top/Math.max(1,bounds.height*.6),0,1);
    const fade=1-progress;
    const tiltY=-8*fade+pointerX*3.6*fade;
    const tiltX=4*fade-pointerY*2.5*fade;
    preview.style.setProperty('--sites-preview-tilt-y',tiltY.toFixed(2)+'deg');
    preview.style.setProperty('--sites-preview-tilt-x',tiltX.toFixed(2)+'deg');
    preview.style.setProperty('--sites-preview-rise',(17*fade).toFixed(2)+'px');
  }
  function schedule(){
    if(!frame)frame=requestAnimationFrame(update);
  }
  function pointerMove(event){
    if(!desktop.matches || reduced.matches)return;
    const box=visual.getBoundingClientRect();
    pointerX=clamp(((event.clientX-box.left)/Math.max(1,box.width)-.5)*2,-1,1);
    pointerY=clamp(((event.clientY-box.top)/Math.max(1,box.height)-.5)*2,-1,1);
    schedule();
  }
  function pointerLeave(){
    pointerX=0;pointerY=0;schedule();
  }
  function sync(){
    pointerX=0;pointerY=0;schedule();
  }

  visual.addEventListener('pointermove',pointerMove,{passive:true});
  visual.addEventListener('pointerleave',pointerLeave,{passive:true});
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',sync,{passive:true});
  document.addEventListener('visibilitychange',sync);
  desktop.addEventListener('change',sync);
  reduced.addEventListener('change',sync);
  schedule();
})();