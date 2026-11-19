/* Screenshot evidence for draft PRs. Serves Git snapshots locally;
   never contacts production deployment or triggers a Vercel promotion. */
import puppeteer from 'puppeteer-core';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const chrome=process.env.CHROME_BIN;
if(!chrome) throw new Error('CHROME_BIN is required');
const out='visual-qa-results';
await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({
  executablePath:chrome,headless:true,
  args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']
});
const versions=[{name:'before-seams-v4',url:'http://127.0.0.1:8765/'},
                {name:'after-framing-v6',url:'http://127.0.0.1:8766/'}];
const viewports=[320,360,390,768,1024,1440,1672];
const sections=[['hero','#apresentacao'],['problemas','#problemas'],
                ['modelo','#modelo'],['produtos','#produtos'],['dayane','#projetos'],
                ['fundadora','#sobre'],['conteudos','#conteudos'],['contato','#contato']];
const captureWidths=new Set([320,390,1440,1672]);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const results=[];
try {
 for(const v of versions) {
  for(const width of viewports) {
   const page=await browser.newPage();
   await page.setViewport({width,height:width<=390?780:(width===1672?941:900),deviceScaleFactor:1});
   await page.goto(v.url,{waitUntil:'domcontentloaded',timeout:30000});
   await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2200))]));
   await wait(250);
   const row={version:v.name,width,sections:{},issues:[]};
   row.document=await page.evaluate(()=>({
     scrollWidth:document.documentElement.scrollWidth,
     viewportWidth:document.documentElement.clientWidth,
     bodyWidth:document.body.scrollWidth
   }));
   if(row.document.scrollWidth>width+2) row.issues.push('horizontal overflow '+row.document.scrollWidth+'px');
   for(const [key,selector] of sections) {
     await page.evaluate(sel=>document.querySelector(sel)?.scrollIntoView({block:'start',behavior:'instant'}),selector);
     await wait(680);
     // Capturar cores e geometrias já estabilizadas, não o blur de entrada cinematográfica.
     if(captureWidths.has(width) && (key==='hero'||key==='fundadora')) await wait(1100);
     const layout=await page.evaluate((sel)=>{
       const el=document.querySelector(sel);
       if(!el)return {missing:true};
       const r=el.getBoundingClientRect();
       const geometry=e=>{if(!e)return null;const b=e.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),width:Math.round(b.width),height:Math.round(b.height)};};
       const dayane=document.querySelector('.home-case-dayane .case-dayane-mockup');
       return {
         section:geometry(el),
         stage:geometry(el.querySelector('.solution-graphic, .manifest-art, .modelo-path-visual')),
         vitrini:geometry(el.querySelector('.vitrini-ui')),
         engreni:geometry(el.querySelector('.engreni-ui')),
         notebook:geometry(el.querySelector('.manifest-art-svg,.modelo-project-art')),
         dayane:geometry(dayane),
         imageNatural:dayane?{width:dayane.naturalWidth,height:dayane.naturalHeight}:null,
         keyboardPseudo:el.querySelector('.vitrini-ui')?getComputedStyle(el.querySelector('.vitrini-ui'),'::after').content:null
       };
     },selector);
     row.sections[key]=layout;
     if(key==='problemas'||key==='modelo') {
       const detail=await page.evaluate((kind)=>{
         const section=document.querySelector('#'+kind),select=x=>document.querySelector(x);
         const container=select('#problemas .launch-manifest-grid');
         const keyCard=select(kind==='problemas'?'#problemas .manifest-item':'#modelo .modelo-path-card');
         const styles=keyCard?getComputedStyle(keyCard):null;
         const seam=container?getComputedStyle(container,'::after'):null;
         return {
           seam:kind==='problemas'?{width:seam?.width,display:seam?.display,background:seam?.backgroundImage}:null,
           card:{background:styles?.backgroundImage,border:styles?.borderTopWidth,shadow:styles?.boxShadow,blur:styles?.backdropFilter},
           chapterTopGlow:section?getComputedStyle(section).boxShadow:null
         };
       },key);
       row.sections[key].premium=detail;
       // The former grid ::after seam was replaced with a section-level illuminated wave; do not assert the retired pseudo-element.
       if(v.name==='after-framing-v6'&&key==='problemas'&&(!detail.card.blur||detail.card.blur==='none'))
         row.issues.push('glass card backdrop-filter not active');
     }
     if(key==='modelo') {
       const framing=await page.evaluate(()=>{
         const card=document.querySelector('#modelo .modelo-path-card--products');
         const base=document.querySelector('#modelo .modelo-product-platform');
         const tile=document.querySelector('#modelo .modelo-product-tile--engreni');
         const box=e=>{if(!e)return null;const b=e.getBoundingClientRect();return {left:+b.left.toFixed(1),right:+b.right.toFixed(1),top:+b.top.toFixed(1),bottom:+b.bottom.toFixed(1)};};
         return {card:box(card),baseLayers:[...(base?.querySelectorAll('span')||[])].map(box),tile:box(tile)};
       });
       row.sections[key].framing=framing;
       if(v.name==='after-framing-v6' && framing.card) {
         if(framing.baseLayers.some(b=>b.bottom>framing.card.bottom+1.5 || b.right>framing.card.right+1))
           row.issues.push('modelo platform layer clipped by card: '+JSON.stringify(framing));
         if(framing.tile && (framing.tile.bottom>framing.card.bottom-5 || framing.tile.right>framing.card.right-5))
           row.issues.push('ENGRENI tile too close to card boundary: '+JSON.stringify(framing));
       }
     }
     if(key==='hero') {
       row.heroComposition=await page.evaluate(()=>{
         const selectors={title:'.hero-content h1',vitrini:'.hero-projects__card--vitrini',engreni:'.hero-projects__card--agenda',service:'.hero-projects__card--caderneta',line:'.cinema33-ledger'};
         const boxes={};for(const [key,selector] of Object.entries(selectors)){
           const e=document.querySelector('#apresentacao '+selector),r=e?.getBoundingClientRect();
           boxes[key]=r?{left:Math.round(r.left),top:Math.round(r.top),right:Math.round(r.right),bottom:Math.round(r.bottom),width:Math.round(r.width)}:null;
         } return boxes;
       });
       // Runtime geometry: the original coordinate snapshots were not sufficient.
       // Validate actual rendered bounds, obscured area, title font and Caderneta's readable header.
       row.heroVisibility=await page.evaluate(()=>{
         const hero=document.querySelector('#apresentacao');
         const selectors={vitrini:'.hero-projects__card--vitrini',agenda:'.hero-projects__card--agenda',caderneta:'.hero-projects__card--caderneta'};
         const box=e=>e?.getBoundingClientRect()??null;
         const cards=Object.fromEntries(Object.entries(selectors).map(([k,s])=>[k,box(hero?.querySelector(s))]));
         const a=cards.agenda;
         const intersection=(x,y)=>{
           if(!x||!y)return 0;
           const w=Math.max(0,Math.min(x.right,y.right)-Math.max(x.left,y.left));
           const h=Math.max(0,Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top));
           return w*h;
         };
         const ratio=(x)=>x?.width*x?.height?Number((1-intersection(x,a)/(x.width*x.height)).toFixed(3)):0;
         const title=hero?.querySelector('.hero-content h1');
         const cBrand=box(hero?.querySelector('.hero-projects__card--caderneta .hero-projects__brand'));
         return {
           font:title?getComputedStyle(title).fontFamily:'',
           titleVisible:Boolean(title&&title.getBoundingClientRect().width>0),
           vitriniVisibleRatio:ratio(cards.vitrini),
           cadernetaVisibleRatio:ratio(cards.caderneta),
           cadernetaBrandCovered:intersection(cBrand,a)>1,
           cardsInsideViewport:Object.values(cards).every(x=>x&&x.left>=-3&&x.right<=innerWidth+3),
           cardsPresent:Object.values(cards).every(x=>x&&x.width>0&&x.height>0),
           horizontalOverflow:document.documentElement.scrollWidth>innerWidth+2
         };
       });
       if(v.name==='after-framing-v6'){
         const h=row.heroVisibility;
         if(!h.font.includes('Manrope'))row.issues.push('hero title not using official Manrope display token: '+h.font);
         if(!h.titleVisible||!h.cardsPresent||!h.cardsInsideViewport||h.horizontalOverflow)
           row.issues.push('hero clipping or missing screen: '+JSON.stringify(h));
         if(width>600&&(h.vitriniVisibleRatio<.84||h.cadernetaVisibleRatio<.88||h.cadernetaBrandCovered))
           row.issues.push('hero simulator occlusion/brand unreadable: '+JSON.stringify(h));
       }
       if(v.name==='after-framing-v6' && width>=1440) {
         const {vitrini,engreni,service,title}=row.heroComposition;
         if(!vitrini||!engreni||!service||!title)row.issues.push('hero cards missing');
         else if(vitrini.left>width*.51 || engreni.right>width+2 || service.bottom>941 || vitrini.left<=title.left)
           row.issues.push('hero reference composition out of bounds: '+JSON.stringify(row.heroComposition));
       }
       // Cross-element check from actual browser geometry: unlike the three cards,
       // the title can still be obscured by the leftmost card if the stage is offset.
       // Agenda's third schedule row must remain above its illustrative footer
       // (previously the 1440px crop hid the final bar under the label).
       row.heroAgendaFooter=await page.evaluate(()=>{
         const hero=document.querySelector('#apresentacao');
         const last=hero?.querySelector('.hero-projects__card--agenda .hero-projects__timeline >div:last-child')?.getBoundingClientRect();
         const footer=hero?.querySelector('.hero-projects__card--agenda .hero-projects__preview-label')?.getBoundingClientRect();
         return {gap:last&&footer?Math.round(footer.top-last.bottom):null};
       });
       if(v.name==='after-framing-v6' && width>=1251 &&
         (row.heroAgendaFooter.gap===null||row.heroAgendaFooter.gap<4))
         row.issues.push('ENGRENI Agenda final schedule row meets the footer: '+JSON.stringify(row.heroAgendaFooter));
       row.heroTitleClearance=await page.evaluate(()=>{
         const h=document.querySelector('#apresentacao .hero-content h1')?.getBoundingClientRect();
         const v=document.querySelector('#apresentacao .hero-projects__card--vitrini')?.getBoundingClientRect();
         if(!h||!v)return {gap:null,verticalOverlap:null};
         return {
           gap:Math.round(v.left-h.right),
           verticalOverlap:Math.round(Math.max(0,Math.min(h.bottom,v.bottom)-Math.max(h.top,v.top)))
         };
       });
       if(v.name==='after-framing-v6' && width>=1251 &&
         (row.heroTitleClearance.gap===null ||
          (row.heroTitleClearance.verticalOverlap>0 && row.heroTitleClearance.gap<20)))
         row.issues.push('hero heading and VITRINI clearance insufficient: '+JSON.stringify(row.heroTitleClearance));
       row.heroSpatial=await page.evaluate(()=>{
         const stage=document.querySelector('#apresentacao .hero-projects');
         const rect=k=>stage?.querySelector('.hero-projects__card--'+k)?.getBoundingClientRect()||null;
         const [left,center,right]=['vitrini','agenda','caderneta'].map(rect);
         const overlap=(a,b)=>a&&b?Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left)):null;
         const gaps=[left&&center?center.left-left.right:null,center&&right?right.left-center.right:null];
         const bases=[left,center,right].map(r=>r?Math.round(r.bottom):null);
         const mesh=getComputedStyle(document.querySelector('#apresentacao'),'::before').backgroundImage;
         const atmospheres=[...document.querySelectorAll('main > section.section-atmosphere')].map(e=>({
           id:e.id,mesh:getComputedStyle(e,'::before').backgroundImage
         }));
         return {gaps,bases,overlap:[overlap(left,center),overlap(center,right)],mesh,atmospheres};
       });
       if(v.name==='after-framing-v6'){
         const a=row.heroSpatial;
         if(width>=761 && (a.gaps.some(g=>g===null||g<0) || Math.max(...a.bases)-Math.min(...a.bases)>16))
           row.issues.push('3D stage gap or baseline invalid: '+JSON.stringify(a));
         if(/1px|repeating-linear-gradient/.test(a.mesh)||a.atmospheres.some(x=>/repeating-linear-gradient|1px, transparent 1px/.test(x.mesh)))
           row.issues.push('decorative background mesh persists: '+JSON.stringify(a.atmospheres));
       }
       row.heroAnchor=await page.evaluate(()=>{
         const h=document.querySelector('.site-header')?.getBoundingClientRect();
         const el=document.querySelector('#apresentacao');
         const e=el?.getBoundingClientRect();
         return {
           heroTop:Math.round(e?.top??-1),
           headerBottom:Math.round(h?.bottom??-1),
           margin:getComputedStyle(el).scrollMarginTop,
           scrollPadding:getComputedStyle(document.documentElement).scrollPaddingTop
         };
       });
       if(v.name==='after-framing-v6' && row.heroAnchor.heroTop>row.heroAnchor.headerBottom+6)
         row.issues.push('hero anchor exposes preceding film: '+JSON.stringify(row.heroAnchor));
     }
     if(captureWidths.has(width)) {
       await page.screenshot({path:join(out,v.name+'-'+width+'-'+key+'.png')});
       // Export the full actual Hero element too: a phone viewport captures only its first card.
       if(key==='hero' && (v.name==='after-framing-v6'||v.name==='before-seams-v4')) {
         const fullHero=await page.$('#apresentacao');
         if(fullHero)await fullHero.screenshot({path:join(out,'hero-complete-'+v.name+'-'+width+'.png'),captureBeyondViewport:true});
       }
       // Screenshots de viewport no centro do card, sem artefatos da captura de elemento.
       const details={
         problemas:[['primeiro','#problemas .manifest-item:first-child'],['segundo','#problemas .manifest-item:nth-child(2)'],['terceiro','#problemas .manifest-item:nth-child(3)']],
         modelo:[['sob-medida','#modelo .modelo-path-card--bespoke'],['produtos-proprios','#modelo .modelo-path-card--products']],
         produtos:[['vitrini','#produtos .solution-vitrini'],['engreni','#produtos .solution-engreni']],
         dayane:[['projeto','#projetos .home-case-dayane']]
       }[key]||[];
       for(const [tag,sel] of details) {
         const exists=await page.evaluate(query=>{
           const e=document.querySelector(query);
           if(!e)return false;
           const r=e.getBoundingClientRect();
           window.scrollTo({top:Math.max(0,scrollY+r.top-95),behavior:'instant'});
           return true;
         },sel);
         if(exists) {
           await wait(340);
           await page.screenshot({path:join(out,v.name+'-'+width+'-'+key+'-detail-'+tag+'.png')});
         }
       }
     }
   }
   // Mobile navigation must really open and close, not just pass static tests.
   if(width<=390) {
     const btn=await page.$('.site-header .menu-toggle');
     if(btn){
       await btn.click();
       await wait(100);
       row.mobileNav=await page.evaluate(()=>{
         const b=document.querySelector('.menu-toggle'),m=document.querySelector('#menu-principal');
         const r=b?.getBoundingClientRect();
         return {expanded:b?.getAttribute('aria-expanded'),open:m?.classList.contains('open'),width:Math.round(r?.width??0),height:Math.round(r?.height??0)};
       });
       if(v.name==='after-framing-v6' && (row.mobileNav.expanded!=='true'||!row.mobileNav.open||row.mobileNav.width<44||row.mobileNav.height<44))
         row.issues.push('mobile menu open/target: '+JSON.stringify(row.mobileNav));
       await btn.click();
     } else row.issues.push('mobile menu toggle missing');
   }
   // Film: at 89% of its scroll storyboard, the final scene and CTA are displayed.
   await page.evaluate(()=>{
      const film=document.getElementById('cinema33-film');
      if(film)window.scrollTo({top:film.offsetTop+(film.offsetHeight-innerHeight)*.89,behavior:'instant'});
   });
   await wait(1350);
   row.film=await page.evaluate(()=>{
     const f=document.getElementById('cinema33-film');
     return {scene:f?.dataset.currentScene,fragments:f?getComputedStyle(f.querySelector('.c33-window')).visibility:null};
   });
   if(captureWidths.has(width))await page.screenshot({path:join(out,v.name+'-'+width+'-cinema-final.png')});
   if(v.name==='after-framing-v6' && [320,1440].includes(width)) {
     await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
     await wait(90);
     row.reducedMotion=await page.evaluate(()=>{
       const f=document.querySelector('#cinema33-film'),shape=f?.querySelector('.c33-shape'),pin=f?.querySelector('.c33-pin');
       return {filmHeight:Math.round(f?.getBoundingClientRect().height??0),shapesHidden:!shape||getComputedStyle(shape).display==='none',pinHeight:Math.round(pin?.getBoundingClientRect().height??0)};
     });
     if(!row.reducedMotion.shapesHidden)row.issues.push('reduced motion leaves film shapes active');
   }
   if(width===390||width===1440) {
     /* Restore the same normal-motion state used for baseline full-page captures.
        The explicit reduced-motion accessibility check above must not silently
        shorten the Hero film before the after screenshot. */
     if(v.name==='after-framing-v6' && width===1440) {
       await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);
       await wait(450);
     }
     /* Progressive reading pass for one-shot IntersectionObserver reveals.
        Full-page browser screenshots are not a real scroll and otherwise leave
        below-fold editorial cards at opacity:0 despite the site working normally. */
     const pageHeight=await page.evaluate(()=>document.documentElement.scrollHeight);
     const sweepStep=Math.floor((width<=390?780:900)*.60);
     for(let offset=0;offset<pageHeight;offset+=sweepStep){
       await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),offset);
       await wait(105);
     }
     await wait(950); /* settle the last batch of narrative cards */
     await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
     await wait(450);
     await page.screenshot({path:join(out,v.name+'-'+width+'-home-full.png'),fullPage:true});
   }
   results.push(row);
   await page.close();
  }
 }
} finally {await browser.close();}
await writeFile(join(out,'measurements.json'),JSON.stringify(results,null,2));
const md=['# DAYSLUME visual QA — costura e enquadramentos: v4 vs v6','','Automated browser screenshots only; requires human aesthetic approval.','','| Version | Width | Document overflow | Film scene | Window visible |','|---|---:|---|---|---|'];
for(const r of results)md.push('| '+r.version+' | '+r.width+'px | '+(r.issues.join(', ')||'none detected')+' | '+(r.film.scene||'n/a')+' | '+(r.film.fragments||'n/a')+' |');
md.push('','## Anchor and mobile navigation checks');
for(const r of results){
 md.push('- '+r.version+' '+r.width+'px: hero '+JSON.stringify(r.heroAnchor)+'; nav '+JSON.stringify(r.mobileNav??'not sampled')+'; reduced '+JSON.stringify(r.reducedMotion??'not sampled'));
}
await writeFile(join(out,'README.md'),md.join('\n')+'\n');
console.log(md.join('\n'));
if(results.some(r=>r.version==='after-framing-v6' && r.issues.length))process.exitCode=1;
