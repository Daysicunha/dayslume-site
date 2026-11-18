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
const viewports=[320,360,390,768,1024,1440];
const sections=[['hero','#apresentacao'],['problemas','#problemas'],
                ['modelo','#modelo'],['produtos','#produtos'],['dayane','#projetos'],
                ['fundadora','#sobre'],['conteudos','#conteudos'],['contato','#contato']];
const captureWidths=new Set([320,390,1440]);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const results=[];
try {
 for(const v of versions) {
  for(const width of viewports) {
   const page=await browser.newPage();
   await page.setViewport({width,height:width<=390?780:900,deviceScaleFactor:1});
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
     await wait(320);
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
       if(v.name==='after-framing-v6'&&key==='problemas'&&width>1180&&detail.seam.width!=='1px')
         row.issues.push('seam not a 1px luminous rule: '+JSON.stringify(detail.seam));
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
         if(framing.baseLayers.some(b=>b.bottom>framing.card.bottom-5 || b.right>framing.card.right+1))
           row.issues.push('modelo platform layer clipped by card: '+JSON.stringify(framing));
         if(framing.tile && (framing.tile.bottom>framing.card.bottom-5 || framing.tile.right>framing.card.right-5))
           row.issues.push('ENGRENI tile too close to card boundary: '+JSON.stringify(framing));
       }
     }
     if(key==='hero') {
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
   await wait(420);
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
