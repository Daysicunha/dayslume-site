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
const versions=[{name:'before-main-pr28',url:'http://127.0.0.1:8765/'},
                {name:'after-fix-pr29',url:'http://127.0.0.1:8766/'}];
const viewports=[320,360,390,768,1024,1440];
const sections=[['hero','#apresentacao'],['problemas','#problemas'],
                ['modelo','#modelo'],['produtos','#produtos'],['dayane','#projetos']];
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
     if(captureWidths.has(width)) {
       await page.screenshot({path:join(out,v.name+'-'+width+'-'+key+'.png')});
       const detailed={problemas:'#problemas .manifest-item:first-child',
         modelo:'#modelo .modelo-path-card--bespoke',
         produtos:'#produtos .solutions-grid',
         dayane:'#projetos .home-case-dayane'}[key];
       if(detailed) {
         const element=await page.$(detailed);
         if(element) await element.screenshot({path:join(out,v.name+'-'+width+'-'+key+'-detail.png')});
       }
     }
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
   results.push(row);
   await page.close();
  }
 }
} finally {await browser.close();}
await writeFile(join(out,'measurements.json'),JSON.stringify(results,null,2));
const md=['# DAYSLUME visual QA — baseline PR #28 vs correction PR #29','','Automated browser screenshots only; requires human aesthetic approval.','','| Version | Width | Document overflow | Film scene | Window visible |','|---|---:|---|---|---|'];
for(const r of results)md.push('| '+r.version+' | '+r.width+'px | '+(r.issues.join(', ')||'none detected')+' | '+(r.film.scene||'n/a')+' | '+(r.film.fragments||'n/a')+' |');
await writeFile(join(out,'README.md'),md.join('\n')+'\n');
console.log(md.join('\n'));
