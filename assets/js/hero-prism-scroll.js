/* DAYSLUME experimental motion.
 * Hero: text left → independent six-petal flower moves left and grows on scroll.
 * #modelo: two editorial cards roll into place as visitors scroll.
 * Scroll progression follows document position, and reverses on scroll up.
 * Progressive: no pinned layout without JS; reduced-motion/mobile/data-saver static.
 */
(() => {
  'use strict';
  const hero = document.querySelector('[data-scroll-hero]');
  const section = document.querySelector('[data-kiru-cards]');
  if (!hero) return;
  const stage = hero.querySelector('[data-hero-scroll-stage]');
  const copy = hero.querySelector('.hero-content');
  const flower = hero.querySelector('.hero-visual-composition');
  const scene = hero.querySelector('[data-flower-scene]');
  const cards = [...(section?.querySelectorAll('[data-kiru-card]') || [])];
  if (!stage || !copy || !flower) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precise = matchMedia('(hover: hover) and (pointer: fine)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const clamp = (value, min=0, max=1) => Math.max(min, Math.min(max,value));
  const easing = value => { const p=clamp(value);return p*p*(3-2*p); };
  const range = (p,start,end)=>easing((p-start)/(end-start));
  let enabled = false;
  let frame = 0;
  const current={x:75,y:47,gx:50,gy:50};
  const target={...current};

  function allowMotion() { return !reduced.matches && !saveData && innerWidth>800; }
  function allowPointer() {
    return enabled && precise.matches && !document.hidden &&
      !document.documentElement.classList.contains('motion-paused');
  }

  function scrollHero() {
    if (!enabled) return;
    const bounds=hero.getBoundingClientRect();
    const distance=Math.max(1,bounds.height-innerHeight);
    const p=clamp(-bounds.top/distance);
    const invasion=range(p,.08,.82);
    const fade=range(p,.13,.58);
    const move=-Math.min(innerWidth*.35,510)*invasion;
    const lift=-12*invasion;
    const growth=1+invasion*.42;
    const copyX=-50*fade;

    copy.style.opacity=(1-fade).toFixed(3);
    copy.style.transform='translate3d('+copyX.toFixed(2)+'px,0,0)';
    const canInteract=fade<.76;
    if (!canInteract && !copy.contains(document.activeElement)) copy.inert=true;
    else copy.inert=false;
    flower.style.transform='translate3d('+move.toFixed(2)+'px,'+
      lift.toFixed(2)+'px,0) scale('+growth.toFixed(4)+')';
    hero.style.setProperty('--hero-meter-progress',p.toFixed(4));
    hero.style.setProperty('--hero-rays-shift',(-innerWidth*.12*invasion).toFixed(2)+'px');
    hero.style.setProperty('--hero-light-focus',(78-34*invasion).toFixed(2)+'%');
    const hint=hero.querySelector('.hero-scroll-hint');
    if (hint) hint.style.opacity=(1-range(p,.02,.15)).toFixed(3);
  }

  function scrollCards() {
    if (!enabled || cards.length===0) return;
    cards.forEach((card,i)=>{
      const box=card.getBoundingClientRect();
      if (box.top>innerHeight+180 || box.bottom < -180) return;
      const progress=easing((innerHeight*.98-box.top)/(innerHeight*.46));
      const adjusted=clamp(progress-i*.10);
      const t=easing(adjusted);
      const sign=i%2===0 ? -1 : 1;
      const rollX=sign*95*(1-t);
      const rollY=85*(1-t);
      const angle=-sign*7*(1-t);
      const opacity=.1+.9*t;
      card.style.setProperty('--kiru-x',rollX.toFixed(2)+'px');
      card.style.setProperty('--kiru-y',rollY.toFixed(2)+'px');
      card.style.setProperty('--kiru-angle',angle.toFixed(3)+'deg');
      card.style.setProperty('--kiru-size',(.94+.06*t).toFixed(4));
      card.style.setProperty('--kiru-opacity',opacity.toFixed(3));
      card.classList.toggle('is-kiru-settled',t>.995);
    });
  }

  function renderPointer(){
    if (!allowPointer()) return false;
    let moving=false;
    for(const key of ['x','y','gx','gy']){
      const delta=target[key]-current[key];
      current[key]+=delta*.12;
      if(Math.abs(delta)<.07)current[key]=target[key];else moving=true;
    }
    hero.style.setProperty('--spot-x',current.x.toFixed(2)+'%');
    hero.style.setProperty('--spot-y',current.y.toFixed(2)+'%');
    hero.style.setProperty('--glint-x',current.gx.toFixed(2)+'%');
    hero.style.setProperty('--glint-y',current.gy.toFixed(2)+'%');
    return moving;
  }
  function tick(){
    frame=0;
    scrollHero();
    scrollCards();
    if(renderPointer())schedule();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(tick);}

  function onPointerMove(e){
    if(!allowPointer() || e.pointerType==='touch')return;
    const r=stage.getBoundingClientRect();
    target.x=clamp((e.clientX-r.left)/r.width)*100;
    target.y=clamp((e.clientY-r.top)/r.height)*100;
    if(scene){
      const f=scene.getBoundingClientRect();
      if(f.width>0 && f.height>0){
        target.gx=clamp((e.clientX-f.left)/f.width)*100;
        target.gy=clamp((e.clientY-f.top)/f.height)*100;
      }
    }
    schedule();
  }
  function onPointerLeave(){
    Object.assign(target,{x:75,y:47,gx:50,gy:50});
    schedule();
  }
  function clearMotion(){
    copy.style.removeProperty('transform');
    copy.style.removeProperty('opacity');
    copy.inert=false;
    flower.style.removeProperty('transform');
    hero.style.removeProperty('--hero-meter-progress');
    hero.style.removeProperty('--hero-rays-shift');
    hero.style.removeProperty('--hero-light-focus');
    hero.querySelector('.hero-scroll-hint')?.style.removeProperty('opacity');
    for(const key of ['--spot-x','--spot-y','--glint-x','--glint-y'])hero.style.removeProperty(key);
    cards.forEach(card=>{
      for(const key of ['--kiru-x','--kiru-y','--kiru-angle','--kiru-size','--kiru-opacity'])card.style.removeProperty(key);
      card.classList.remove('is-kiru-settled');
    });
  }
  function sync(){
    const next=allowMotion();
    if(!next){cancelAnimationFrame(frame);frame=0;enabled=false;clearMotion();}
    else enabled=true;
    hero.classList.toggle('hero-scroll-ready',enabled);
    section?.classList.toggle('kiru-cards-ready',enabled);
    if(!allowPointer())onPointerLeave();
    schedule();
  }
  stage.addEventListener('pointermove',onPointerMove,{passive:true});
  stage.addEventListener('pointerleave',onPointerLeave,{passive:true});
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',sync,{passive:true});
  reduced.addEventListener('change',sync);
  precise.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  document.addEventListener('dayslume:motion',schedule);
  sync();
})();
