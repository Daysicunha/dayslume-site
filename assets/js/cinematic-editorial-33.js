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

  // Keep a single observer with a permanent preference-change listener.
  // Starting in reduced-motion mode must not disable later transitions.
  const seen=new WeakSet();
  const supportsObserver=typeof IntersectionObserver === 'function';
  const observer=supportsObserver ? new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      seen.add(entry.target);
      entry.target.classList.add('is-lit');
      observer.unobserve(entry.target);
    });
  },{rootMargin:'0px 0px -10% 0px',threshold:0}) : null;

  function syncMotion() {
    if (!observer) {
      // Legacy-browser fallback: a visible static seam, not an invisible one.
      lines.forEach(line=>line.classList.add('c33-editorial-static','is-lit'));
      return;
    }
    if (reduced.matches) {
      observer.disconnect();
      lines.forEach(line=>line.classList.add('is-lit'));
      return;
    }
    lines.forEach(line=>{
      if (seen.has(line)) return;
      line.classList.remove('is-lit');
      observer.observe(line);
    });
  }
  reduced.addEventListener('change',syncMotion);
  syncMotion();
})();
