/* DAYSLUME Mobile Experience 1.0.
   The project cards remain readable and swipeable without JavaScript.
   JS only enhances next/previous controls on touch-size viewports. */
(() => {
  'use strict';
  const track = document.querySelector('[data-craft-track]');
  const controls = document.querySelector('[data-craft-controls]');
  if (!track || !controls) return;
  const cards=[...track.querySelectorAll('[data-craft-card]')];
  const previous=controls.querySelector('[data-craft-prev]');
  const next=controls.querySelector('[data-craft-next]');
  const label=controls.querySelector('[data-craft-count]');
  if (!cards.length || !previous || !next || !label) return;

  const small=matchMedia('(max-width:800px)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0;
  let current=0;
  const nearest = () => {
    const x=track.getBoundingClientRect().left;
    let best=0;
    let distance=Infinity;
    cards.forEach((card,index)=>{
      const d=Math.abs(card.getBoundingClientRect().left-x);
      if(d<distance){distance=d;best=index;}
    });
    return best;
  };
  function render(){
    raf=0;
    current=nearest();
    label.textContent=String(current+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
    previous.disabled=current===0;
    next.disabled=current===cards.length-1;
  }
  function schedule(){if(!raf) raf=requestAnimationFrame(render);}
  function sync(){
    controls.classList.toggle('is-enhanced',small.matches);
    schedule();
  }
  function go(direction){
    const target=Math.max(0,Math.min(cards.length-1,nearest()+direction));
    const left=cards[target].getBoundingClientRect().left-
      cards[0].getBoundingClientRect().left;
    // Relative to the first card; one concise native scroll, no dependency.
    track.scrollTo({left,behavior:reduced.matches?'instant':'smooth'});
    current=target;
    previous.disabled=target===0;
    next.disabled=target===cards.length-1;
    label.textContent=String(target+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
  }
  previous.addEventListener('click',()=>go(-1));
  next.addEventListener('click',()=>go(1));
  track.addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  small.addEventListener('change',sync);
  sync();
})();
