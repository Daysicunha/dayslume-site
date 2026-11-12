/* DAYSLUME 3.3 / Lote C — section-boundary treatment on internal pages.
   No content hiding, no scroll trapping, and no timers or continuous render loops.
   This module does not run on the cinematic Home. */
(() => {
  'use strict';
  const body=document.body;
  if (!body?.hasAttribute('data-c33-editorial') || body.classList.contains('home-page')) return;
  const main=document.querySelector('main');
  if (!main) return;
  const sections=[...main.children].filter(el=>el.tagName==='SECTION');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const lines=[];

  sections.slice(1).forEach(section => {
    if (section.querySelector(':scope > .c33-editorial-line')) return;
    const line=document.createElement('span');
    line.className='c33-editorial-line';
    line.setAttribute('aria-hidden','true');
    section.classList.add('c33-editorial-boundary');
    // Append rather than prepend: preserve existing :first-child selectors.
    section.append(line);
    lines.push(line);
  });

  function renderStatic() {
    lines.forEach(line=>line.classList.toggle('is-lit',reduced.matches));
  }
  if (!('IntersectionObserver' in window) || reduced.matches) {
    renderStatic();
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-lit');
      observer.unobserve(entry.target);
    });
  },{rootMargin:'0px 0px -10% 0px',threshold:0});
  lines.forEach(line=>observer.observe(line));
  reduced.addEventListener('change',()=>{
    if (reduced.matches) {
      observer.disconnect();
      renderStatic();
    } else {
      lines.forEach(line=>{
        if (!line.classList.contains('is-lit')) observer.observe(line);
      });
    }
  });
})();
