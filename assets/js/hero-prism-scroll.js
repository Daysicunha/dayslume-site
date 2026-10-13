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
  const process = document.querySelector('[data-process-scroll]');
  const processCards = [...(process?.querySelectorAll(':scope > li') || [])];
  const cards = [...(section?.querySelectorAll('[data-kiru-card]') || [])];
  const cardGrid = section?.querySelector('.services-grid.commercial-paths');
  if (!stage || !copy || !flower) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precise = matchMedia('(hover: hover) and (pointer: fine)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const clamp = (value, min=0, max=1) => Math.max(min, Math.min(max,value));
  const easing = value => { const p=clamp(value);return p*p*(3-2*p); };
  const range = (p,start,end)=>easing((p-start)/(end-start));
  // One shared scroll choreography; all cues use normalized viewport progress.
  // The headline remains readable until the flower and color panel have moved.
  const MOTION_CUES = Object.freeze({
    hero: Object.freeze({
      flowerStart:.08, flowerEnd:.80, panelStart:.07, panelEnd:.78,
      textStart:.18, textEnd:.76, hintStart:.03, hintEnd:.18
    }),
    cards: Object.freeze({ start:.93, distance:.58, stagger:.11, duration:.88 }),
    process: Object.freeze({ start:.91, distance:.69, stagger:.11, duration:.53 })
  });
  const scrollRange = (top, cues)=>clamp((innerHeight*cues.start-top)/
    Math.max(1,innerHeight*cues.distance));
  let enabled = false;
  let editorialObserver = null;
  const editorialItems = [];
  const editorialGroups = [
    // 03: product ecosystems arrive as two separate interface panels.
    {selector:'#produtos', items:[
      ['.section-heading > div','heading'],
      ['.solution-card','ecosystem']
    ]},
    // 04: real case studies enter sequentially; proof comes afterward.
    {selector:'#projetos', items:[
      ['.projects-heading > div','heading'],
      ['.flagship-case','case'],
      ['.execution-proof','proof']
    ]},
    // 06: a restrained editorial magazine, with article covers unfolding.
    {selector:'#conteudos', items:[
      ['.content-masthead','heading'],
      ['.content-featured','feature'],
      ['.content-secondary','article'],
      ['.content-insights__label, .content-insights__list li, .content-archive','note']
    ]},
    // 07: portrait first, founder narrative alongside it.
    {selector:'#sobre', items:[
      ['.about-visual-card','portrait'],
      ['.about-copy > .eyebrow, .about-copy > h2','heading'],
      ['.about-copy > .about-intro, .about-copy > .founder-statement, .about-copy > .founder-trust-list, .about-copy > .about-signature, .about-copy > .about-cta','copy']
    ]},
    // 08: the contact message only, with all actions remaining usable.
    {selector:'#contato', items:[
      ['.contact-grid > div:first-child','contact']
    ]}
  ];
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
    const cues=MOTION_CUES.hero;
    const invasion=range(p,cues.flowerStart,cues.flowerEnd);
    const fade=range(p,cues.textStart,cues.textEnd);
    const panel=range(p,cues.panelStart,cues.panelEnd);
    const move=-Math.min(innerWidth*.35,510)*invasion;
    const lift=-12*invasion;
    const growth=1+invasion*.46;
    const copyX=-50*fade;

    copy.style.opacity=(1-fade).toFixed(3);
    copy.style.transform='translate3d('+copyX.toFixed(2)+'px,0,0)';
    const canInteract=fade<.76;
    if (!canInteract && !copy.contains(document.activeElement)) copy.inert=true;
    else copy.inert=false;
    flower.style.transform='translate3d('+move.toFixed(2)+'px,'+
      lift.toFixed(2)+'px,0) scale('+growth.toFixed(4)+')';
    hero.style.setProperty('--hero-meter-progress',p.toFixed(4));
    hero.style.setProperty('--hero-split-x',(52*(1-panel)).toFixed(2)+'%');
    hero.style.setProperty('--hero-rays-shift',(-innerWidth*.12*invasion).toFixed(2)+'px');
    hero.style.setProperty('--hero-light-focus',(78-34*invasion).toFixed(2)+'%');
    const hint=hero.querySelector('.hero-scroll-hint');
    if (hint) hint.style.opacity=(1-range(p,cues.hintStart,cues.hintEnd)).toFixed(3);
  }

  function scrollCards() {
    if (!enabled || !section || !cardGrid || cards.length!==2) return;
    // The grid does not receive transforms: its layout geometry is a stable
    // scroll anchor even as the cards translate and rotate independently.
    const gridRect=cardGrid.getBoundingClientRect();
    const sectionRect=section.getBoundingClientRect();
    if (sectionRect.top>innerHeight*1.3 || sectionRect.bottom<0) return;
    const cues=MOTION_CUES.cards;
    const entry=scrollRange(gridRect.top,cues);
    const show=easing(entry);
    cards.forEach((card,i)=>{
      const t=easing(clamp((entry-i*cues.stagger)/cues.duration));
      const sign=i===0?-1:1;
      const travel=Math.min(innerWidth*.33,390);
      const rollX=sign*travel*(1-t);
      const rollY=(i===0?170:212)*(1-t);
      const angle=sign*(i===0?13:17)*(1-t);
      const opacity=.14+.86*t;
      card.style.setProperty('--kiru-x',rollX.toFixed(2)+'px');
      card.style.setProperty('--kiru-y',rollY.toFixed(2)+'px');
      card.style.setProperty('--kiru-angle',angle.toFixed(3)+'deg');
      card.style.setProperty('--kiru-size',(.78+.22*t).toFixed(4));
      card.style.setProperty('--kiru-opacity',opacity.toFixed(3));
      card.classList.toggle('is-kiru-settled',t>.995);
    });

  }

  function scrollProcess(){
    if(!enabled || !process || processCards.length!==5) return;
    const rect=process.getBoundingClientRect();
    if(rect.top>innerHeight+150 || rect.bottom<-150) return;
    // A passagem do bloco pelo viewport aciona os cinco passos separadamente.
    const cues=MOTION_CUES.process;
    const progress=scrollRange(rect.top,cues);
    process.style.setProperty('--process-fill',easing(progress).toFixed(4));
    processCards.forEach((card,i)=>{
      const t=easing(clamp((progress-i*cues.stagger)/cues.duration));
      card.style.setProperty('--process-opacity',t.toFixed(3));
      card.style.setProperty('--process-y',(24*(1-t)).toFixed(2)+'px');
      card.style.setProperty('--process-scale',(.97+.03*t).toFixed(4));
      card.classList.toggle('is-process-visible',t>.98);
    });
  }

  function clearEditorial() {
    if(editorialObserver) {
      editorialObserver.disconnect();
      editorialObserver=null;
    }
    editorialItems.splice(0).forEach(node=>{
      node.classList.remove('motion-story-item','is-in-view');
      node.removeAttribute('data-motion-type');
      node.style.removeProperty('--motion-delay');
    });
  }

  function setupEditorial() {
    clearEditorial();
    if(!enabled || !('IntersectionObserver' in window)) return;

    editorialObserver=new IntersectionObserver(entries=>{
      // One-shot reveals; no scroll listener or constantly running animations
      // in the other sections. Once visible, each item stays visible.
      for(const entry of entries){
        if(!entry.isIntersecting) continue;
        entry.target.classList.add('is-in-view');
        editorialObserver.unobserve(entry.target);
      }
    },{rootMargin:'0px 0px -10% 0px',threshold:.12});

    for(const group of editorialGroups){
      const root=document.querySelector(group.selector);
      if(!root) continue;
      let position=0;
      for(const [selector,variant] of group.items){
        root.querySelectorAll(selector).forEach(node=>{
          // Inputs and active controls are not animated or moved.
          if(node.matches('input,textarea,button,form'))return;
          node.classList.add('motion-story-item');
          node.dataset.motionType=variant;
          node.style.setProperty('--motion-delay',Math.min(position*80,320)+'ms');
          editorialItems.push(node);
          editorialObserver.observe(node);
          position++;
        });
      }
    }
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
    scrollProcess();
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
    hero.style.removeProperty('--hero-split-x');
    hero.querySelector('.hero-scroll-hint')?.style.removeProperty('opacity');
    for(const key of ['--spot-x','--spot-y','--glint-x','--glint-y'])hero.style.removeProperty(key);
    cards.forEach(card=>{
      for(const key of ['--kiru-x','--kiru-y','--kiru-angle','--kiru-size','--kiru-opacity'])card.style.removeProperty(key);
      card.classList.remove('is-kiru-settled');
    });
    process?.style.removeProperty('--process-fill');
    processCards.forEach(card=>{
      for(const key of ['--process-opacity','--process-y','--process-scale'])card.style.removeProperty(key);
      card.classList.remove('is-process-visible');
    });
  }
  function sync(){
    const next=allowMotion();
    const changed=next!==enabled;
    if(!next){cancelAnimationFrame(frame);frame=0;enabled=false;clearMotion();}
    else enabled=true;
    hero.classList.toggle('hero-scroll-ready',enabled);
    section?.classList.toggle('kiru-cards-ready',enabled);
    process?.classList.toggle('process-scroll-ready',enabled);
    if(changed)setupEditorial();
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
