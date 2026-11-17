/* Homologação funcional local — jamais enviar formulário ou clicar no WhatsApp.
   Main (before) and isolated PR (after) served on localhost by GitHub Actions. */
import puppeteer from 'puppeteer-core';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const out='functional-qa-results';
await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:process.env.CHROME_BIN,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const cases=[],allErrors=[];
const after='http://127.0.0.1:8766/';
const widths=[320,390,768,1440];
const pages=['servicos.html','solucoes.html','projetos.html','sobre.html','contato.html','blog.html'];
const visible=e=>e&&e.getClientRects().length>0;
try {
 for(const width of widths){
   const page=await browser.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push('JS: '+e.message));
   page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://127.0.0.1:8766/'))errors.push('HTTP '+r.status()+' '+r.url());});
   await page.setViewport({width,height:width<=390?780:900,deviceScaleFactor:1});
   await page.goto(after,{waitUntil:'load',timeout:30000});
   await page.evaluate(()=>document.fonts.ready);
   const row={width,route:'index.html',errors,checks:[],issues:[]};

   // Founder: two moments: entry and after staggered text reveal.
   await page.evaluate(()=>document.querySelector('#sobre')?.scrollIntoView({block:'start',behavior:'instant'}));
   await sleep(1600);
   const founder=await page.evaluate(()=>{
     const section=document.querySelector('#sobre');
     const title=section?.querySelector('#about-title');
     const intro=section?.querySelector('.about-intro');
     const picture=section?.querySelector('.about-visual-inner img');
     const opacity=e=>e?Number(getComputedStyle(e).opacity):null;
     return {titleOpacity:opacity(title),introOpacity:opacity(intro),titleVisible:title?.classList.contains('is-in-view'),
       introVisible:intro?.classList.contains('is-in-view'),pictureLoaded:Boolean(picture?.complete&&picture.naturalWidth),
       stage:section?.className};
   });
   row.founder=founder;
   if(!founder.pictureLoaded) row.issues.push('founder image not loaded');
   if(width>=1024 && founder.titleOpacity!==null && founder.titleOpacity<.95)row.issues.push('founder heading remains low-opacity after 1600ms');
   await page.screenshot({path:join(out,'founder-settled-'+width+'.png')});
   if(width<=390){
     await page.evaluate(()=>document.querySelector('#sobre .about-copy')?.scrollIntoView({block:'center',behavior:'instant'}));
     await sleep(900);
     await page.screenshot({path:join(out,'founder-copy-mobile-'+width+'.png')});
     row.founder.mobileCopy=await page.evaluate(()=>({
       introOpacity:Number(getComputedStyle(document.querySelector('#sobre .about-intro')).opacity),
       titleOpacity:Number(getComputedStyle(document.querySelector('#sobre #about-title')).opacity)}));
   }

   // Contact: never follow generated WhatsApp link. Check real validation and reset.
   await page.evaluate(()=>document.querySelector('#contato')?.scrollIntoView({block:'start',behavior:'instant'}));
   await sleep(200);
   const formState=await page.evaluate(()=>{
     const form=document.querySelector('#contact-form');
     return {visible:Boolean(form&&!form.hidden),disabled:[...form.querySelectorAll('input,textarea')].filter(x=>x.disabled).length,
       action:form.getAttribute('action'),status:document.querySelector('#form-status')?.textContent?.trim()};
   });
   row.form={initial:formState};
   if(!formState.visible||formState.disabled>0)row.issues.push('contact form not enabled');
   await page.type('#nome','Teste QA DAYSLUME');
   await page.type('#email','qa@example.org');
   await page.type('#empresa','Empresa de teste');
   await page.type('#necessidade','Quero validar o fluxo do formulario em ambiente de homologacao sem enviar mensagem.');
   await page.click('#contact-form button[type="submit"]');
   await sleep(160);
   row.form.prepared=await page.evaluate(()=>{
     const link=document.querySelector('#whatsapp-submit');
     const status=document.querySelector('#form-status');
     return {visible:!link.hidden,href:link.href,success:status.classList.contains('is-success'),status:status.textContent.trim()};
   });
   if(!row.form.prepared.visible||!row.form.prepared.href.startsWith('https://wa.me/')||!row.form.prepared.success)
     row.issues.push('contact form does not prepare WhatsApp safely');
   // Updating the name must invalidate the prepared link.
   await page.type('#nome',' atualizado');
   row.form.afterEdit=await page.evaluate(()=>({hidden:document.querySelector('#whatsapp-submit').hidden,
     state:document.querySelector('#form-status').textContent.trim()}));
   if(!row.form.afterEdit.hidden)row.issues.push('contact link is not invalidated after input');
   await page.evaluate(()=>document.querySelector('#contact-form').reset());
   await sleep(75);
   row.form.afterReset=await page.evaluate(()=>({hidden:document.querySelector('#whatsapp-submit').hidden,
     empty:document.querySelector('#nome').value===''&&document.querySelector('#necessidade').value===''}));
   if(!row.form.afterReset.hidden||!row.form.afterReset.empty)row.issues.push('contact reset failed');
   await page.screenshot({path:join(out,'contact-form-'+width+'.png')});

   // Internal: identical brand header, working keyboard menu, no horizontal clipping.
   row.internal=[];
   for(const pathname of pages){
     await page.goto(after+pathname,{waitUntil:'domcontentloaded',timeout:30000});
     await sleep(140);
     const values=await page.evaluate(()=>{
       const header=document.querySelector('header.header');
       const menu=document.querySelector('.days-menu-toggle');
       return {
         title:document.title,
         header:Boolean(header),
         menu:Boolean(menu),
         brandLoaded:Boolean(header?.querySelector('img')?.complete),
         font:getComputedStyle(document.querySelector('h1')||document.body).fontFamily,
         overflow:document.documentElement.scrollWidth>innerWidth+2,
         width:document.documentElement.scrollWidth
       };
     });
     const item={page:pathname,...values};
     if(!values.header)row.issues.push(pathname+' missing header');
     if(values.overflow)row.issues.push(pathname+' horizontal overflow '+values.width);
     if(width<=390){
       const menu=await page.$('.days-menu-toggle');
       if(menu&&await menu.isVisible()){
         await menu.click();await sleep(70);
         item.expanded=await page.evaluate(()=>document.querySelector('.days-menu-toggle').getAttribute('aria-expanded'));
         item.open=await page.evaluate(()=>document.querySelector('#menu-principal')?.classList.contains('is-open'));
         await page.keyboard.press('Escape');await sleep(70);
         item.closed=await page.evaluate(()=>document.querySelector('.days-menu-toggle').getAttribute('aria-expanded'));
         item.focused=await page.evaluate(()=>document.activeElement?.classList.contains('days-menu-toggle'));
         if(item.expanded!=='true'||!item.open||item.closed!=='false'||!item.focused)
           row.issues.push(pathname+' keyboard menu Escape failed');
       } else row.issues.push(pathname+' mobile menu missing/invisible');
     }
     row.internal.push(item);
   }
   row.errors=[...new Set(row.errors)];
   allErrors.push(...row.errors);
   cases.push(row);
   console.log('FUNCTIONAL '+width+'px '+(row.issues.length?'ISSUES '+JSON.stringify(row.issues):'OK'));
   await page.close();
 }
}finally{await browser.close();}
await writeFile(join(out,'results.json'),JSON.stringify(cases,null,2));
let summary=['# DAYSLUME PR #29 — Homologação funcional automatizada',
'','Ambiente: snapshots locais; nenhum dado de teste foi enviado ao WhatsApp.',
'','| Largura | Fundadora título | Formulário | Páginas internas | Alertas |',
'|---|---:|---|---:|---|'];
for(const c of cases)summary.push('| '+c.width+' px | '+c.founder.titleOpacity+' | '+(c.form.prepared.visible?'preparado':'falhou')+' | '+c.internal.length+' | '+(c.issues.join('; ')||'—')+' |');
summary.push('','## Erros no navegador',...((allErrors.length?allErrors:['Nenhum erro JavaScript ou HTTP local registrado.']).map(s=>'- '+s)));
await writeFile(join(out,'SUMMARY.md'),summary.join('\n')+'\n');
console.log(summary.join('\n'));
if(cases.some(c=>c.issues.length||c.errors.length))process.exitCode=1;