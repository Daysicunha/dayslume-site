/* Progressive enhancement only. Navigation, content and direct contact work without JS. */
(() => {
  'use strict';
  const root = document.documentElement;
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#menu-principal');
  const mobile = window.matchMedia('(max-width: 1180px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const closeMenu = (returnFocus = false) => {
    menu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
    if (returnFocus) menuButton?.focus();
  };
  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (!menu?.classList.contains('open') || !mobile.matches) return;
    if (event.key === 'Escape') { closeMenu(true); return; }
    if (event.key !== 'Tab') return;
    const controls = [menuButton, ...menu.querySelectorAll('a[href], button')];
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  mobile.addEventListener('change', () => closeMenu());
  root.classList.add('home-nav-ready');
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.service-card,.solution-card,.project-card,.migrated-blog-grid article').forEach(el => {
      el.classList.add('motion-entry'); observer.observe(el);
    });
  }
})();

/* Hero depth and interactive portfolio: progressive enhancement only. */
(()=>{'use strict';const setup=()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)'),art=document.querySelector('[data-days-parallax]');let frame=0;const update=()=>{frame=0;if(!art||reduced.matches||document.hidden||document.documentElement.classList.contains('motion-paused')||innerWidth<801){art?.style.removeProperty('--days-parallax');return}const rect=art.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;const n=Math.max(-18,Math.min(18,(innerHeight/2-(rect.top+rect.height/2))*.055));art.style.setProperty('--days-parallax',n.toFixed(1)+'px')};const request=()=>{if(!frame)frame=requestAnimationFrame(update)};addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});document.addEventListener('visibilitychange',request);reduced.addEventListener('change',request);document.addEventListener('dayslume:motion',request);request();const filters=[...document.querySelectorAll('.days-filterbar .days-filter')],grid=document.querySelector('.days-filter-grid');if(!grid)return;const cards=[...grid.querySelectorAll('[data-project-kind]')];filters.forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.filter;filters.forEach(b=>{const active=b===btn;b.classList.toggle('is-selected',active);b.setAttribute('aria-pressed',String(active))});let count=0;cards.forEach(card=>{card.hidden=!(key==='all'||card.dataset.projectKind===key);if(!card.hidden)count++});const label=document.querySelector('#days-filter-count');if(label)label.textContent=count===1?'1 projeto exibido':count+' projetos exibidos'}))};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup()})();

/* Keep the fixed contact control clear of important foreground content.
   The header and hero CTAs remain available whenever it is temporarily hidden. */
(()=>{'use strict';const init=()=>{const targets=[...document.querySelectorAll('.hero-flower-stage,.hero-actions,.hero-lead,.hero-content h1,.contact-form')];const action=document.querySelector('.floating-whatsapp');if(!action||!targets.length)return;const initialTab=action.getAttribute('tabindex');let raf=0;const overlaps=(a,b)=>a.bottom>b.top+8&&a.top<b.bottom-8&&a.right>b.left+8&&a.left<b.right-8;const test=()=>{raf=0;const bounds=action.getBoundingClientRect();const hide=targets.some(element=>overlaps(element.getBoundingClientRect(),bounds))&&document.activeElement!==action;action.classList.toggle('days-overlaps-hero',hide);if(hide){action.setAttribute('aria-hidden','true');action.tabIndex=-1}else{action.removeAttribute('aria-hidden');if(initialTab===null)action.removeAttribute('tabindex');else action.setAttribute('tabindex',initialTab)}};const request=()=>{if(!raf)raf=requestAnimationFrame(test)};addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});addEventListener('orientationchange',request,{passive:true});action.addEventListener('blur',request);request()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();

/* The official flower follows the pointer independently, with a deliberately restrained offset. */
(()=>{'use strict';const init=()=>{const hero=document.querySelector('.hero'),flower=document.querySelector('[data-flower-parallax]'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),finePointer=matchMedia('(hover: hover) and (pointer: fine)');if(!hero||!flower)return;let frame=0,targetX=0,targetY=0;const reset=()=>{targetX=0;targetY=0;request()};const render=()=>{frame=0;if(reduced.matches||!finePointer.matches||innerWidth<801){flower.style.removeProperty('--flower-x');flower.style.removeProperty('--flower-y');return}flower.style.setProperty('--flower-x',targetX.toFixed(1)+'px');flower.style.setProperty('--flower-y',targetY.toFixed(1)+'px')};const request=()=>{if(!frame)frame=requestAnimationFrame(render)};hero.addEventListener('pointermove',event=>{const rect=hero.getBoundingClientRect();targetX=((event.clientX-rect.left)/rect.width-.5)*10;targetY=((event.clientY-rect.top)/rect.height-.5)*8;request()},{passive:true});hero.addEventListener('pointerleave',reset,{passive:true});reduced.addEventListener('change',reset);finePointer.addEventListener('change',reset);addEventListener('resize',reset,{passive:true});reset()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();

/* A restrained light halo follows the pointer on the flower side of the hero. */
(()=>{'use strict';const init=()=>{const hero=document.querySelector('.hero'),halo=document.querySelector('.hero-cursor-light'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),finePointer=matchMedia('(hover: hover) and (pointer: fine)');if(!hero||!halo)return;let frame=0,currentX=0,currentY=0,targetX=0,targetY=0;const active=()=>finePointer.matches&&!reduced.matches&&innerWidth>800&&!document.hidden&&!document.documentElement.classList.contains('motion-paused');const render=()=>{frame=0;if(!active()){hero.style.removeProperty('--halo-shift-x');hero.style.removeProperty('--halo-shift-y');currentX=targetX=0;currentY=targetY=0;return}currentX+=(targetX-currentX)*.13;currentY+=(targetY-currentY)*.13;hero.style.setProperty('--halo-shift-x',currentX.toFixed(1)+'px');hero.style.setProperty('--halo-shift-y',currentY.toFixed(1)+'px');if(Math.abs(targetX-currentX)>.25||Math.abs(targetY-currentY)>.25)frame=requestAnimationFrame(render)};const request=()=>{if(!frame)frame=requestAnimationFrame(render)};const reset=()=>{targetX=0;targetY=0;request()};hero.addEventListener('pointermove',event=>{if(!active())return;const rect=hero.getBoundingClientRect();const x=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));const y=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));targetX=(x-.5)*rect.width*.18;targetY=(y-.5)*rect.height*.28;request()},{passive:true});hero.addEventListener('pointerleave',reset,{passive:true});reduced.addEventListener('change',reset);finePointer.addEventListener('change',reset);document.addEventListener('visibilitychange',reset);document.addEventListener('dayslume:motion',reset);addEventListener('resize',reset,{passive:true});reset()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();
