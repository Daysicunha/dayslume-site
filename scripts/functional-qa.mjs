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
const pages=['servicos.html','presenca.html','solucoes.html','projetos.html','sobre.html','contato.html','blog.html'];
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

   // Film -> Hero: captures the last frame, transition and direct anchor.
   await page.evaluate(() => {
     const film=document.querySelector('#cinema33-film');
     const pin=film.querySelector('.c33-pin');
     window.scrollTo({top:film.offsetTop+(film.offsetHeight-pin.offsetHeight)*.99,behavior:'instant'});
   });
   await sleep(140);
   const ending=await page.evaluate(()=>{
     const film=document.querySelector('#cinema33-film');
     const pin=film.querySelector('.c33-pin');
     const css=getComputedStyle(pin);
     return {scene:film.dataset.currentScene, seam:Number(css.getPropertyValue('--c33-seam-opacity')),
       glow:Number(css.getPropertyValue('--c33-exit-progress'))};
   });
   await page.screenshot({path:join(out,'film-final-'+width+'.png')});
   await page.evaluate(() => {
     const film=document.querySelector('#cinema33-film');
     window.scrollTo({top:film.offsetTop+film.offsetHeight-innerHeight*.55,behavior:'instant'});
   });
   await sleep(140);
   const passage=await page.evaluate(()=>{
     const hero=document.querySelector('#apresentacao');
     const css=getComputedStyle(hero);
     return {ready:document.body.classList.contains('c33-handoff-ready'),
       copy:Number(css.getPropertyValue('--c33-handoff-copy')),
       panels:Number(css.getPropertyValue('--c33-handoff-panels'))};
   });
   await page.screenshot({path:join(out,'film-hero-passage-'+width+'.png')});
   await page.evaluate(()=>document.querySelector('#apresentacao').scrollIntoView({block:'start',behavior:'instant'}));
   await sleep(140);
   const anchored=await page.evaluate(()=>{
     const hero=document.querySelector('#apresentacao');
     return {copy:Number(getComputedStyle(hero.querySelector('.hero-content')).opacity),
       panels:Number(getComputedStyle(hero.querySelector('.hero-visual-composition')).opacity)};
   });
   row.handoff={ending,passage,anchored};
   if(ending.scene!=='contato'||ending.seam<.1||ending.glow<.1)
     row.issues.push('film last scene or luminous seam not activated');
   if(!passage.ready||passage.copy<=.15||passage.panels<=.15)
     row.issues.push('hero panels/copy do not appear during handoff');
   if(anchored.copy<.95||anchored.panels<.95)
     row.issues.push('hero remains transparent on direct anchor navigation');

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

   // Final visual QA: the secondary Contents card must use the editorial-light surface.
   await page.evaluate(()=>document.querySelector('#conteudos .content-secondary')?.scrollIntoView({block:'center',behavior:'instant'}));
   await sleep(650);
   row.readability=await page.evaluate(()=>{
     const card=document.querySelector('#conteudos .content-secondary');
     const title=card?.querySelector('h3');
     const description=card?.querySelector('.content-secondary__copy > p');
     if(!card||!title||!description)return {missing:true};
     const rgb=e=>(getComputedStyle(e).color.match(/\d+/g)||[]).slice(0,3).map(Number);
     const lum=a=>a.map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4)
       .reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
     const ratio=a=>{const x=lum(a),y=lum([243,239,232]);return +((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(2);};
     return {headingRatio:ratio(rgb(title)),paragraphRatio:ratio(rgb(description)),
       background:getComputedStyle(card).backgroundImage};
   });
   if(row.readability.missing||row.readability.headingRatio<4.5||row.readability.paragraphRatio<4.5||
      !row.readability.background.includes('255'))
     row.issues.push('Contents secondary card illegible: '+JSON.stringify(row.readability));
   await page.screenshot({path:join(out,'contents-legible-'+width+'.png')});

   // Existing WhatsApp collision manager must protect product showroom controls too.
   await page.evaluate(()=>{
     const el=document.querySelector('#produtos .cinema33-showroom__choices button:last-child');
     if(el)scrollTo({top:scrollY+el.getBoundingClientRect().top-(innerHeight-135),behavior:'instant'});
   });
   await sleep(260);
   row.productFloating=await page.evaluate(()=>{
     const el=document.querySelector('#produtos .cinema33-showroom__choices button:last-child');
     const action=document.querySelector('.floating-whatsapp');
     if(!el||!action)return {missing:true};
     const a=el.getBoundingClientRect(),b=action.getBoundingClientRect();
     const overlap=a.bottom>b.top+6&&a.top<b.bottom-6&&a.right>b.left+6&&a.left<b.right-6;
     const style=getComputedStyle(action);
     return {overlap,hidden:style.visibility==='hidden'||Number(style.opacity)<.05};
   });
   if(row.productFloating.overlap&&!row.productFloating.hidden)
     row.issues.push('Floating WhatsApp covers ENGRENI showroom selector');
   await page.screenshot({path:join(out,'products-controls-'+width+'.png')});

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
   // Radar public: answer, back, result, explicit opt-in and invalidation; never follow WhatsApp.
   await page.goto(after+'servicos.html?origem=instagram#diagnostico-digital',{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForSelector('.diagnostic-option');
   row.radar=await page.evaluate(()=>{
     const stage=document.querySelector('[data-diagnostic-stage]');
     const options=()=>[...stage.querySelectorAll('.diagnostic-option')];
     options()[2].click();
     stage.querySelector('.diagnostic-back').click();
     const returned=options().length===4;
     for(let i=0;i<8;i++)options()[i===0?2:3].click();
     const result=stage.textContent.includes('1 de 8')&&stage.textContent.includes('7 não avaliadas');
     const form=stage.querySelector('.radar-contact'),check=form.querySelector('input[type=checkbox]'),go=form.querySelector('a.diagnostic-primary');
     form.elements.business.value='QA fictício';
     const initiallyHidden=go.hidden;
     form.requestSubmit();
     const blocked=go.hidden;
     check.click();form.requestSubmit();
     const prepared=!go.hidden&&go.href.startsWith('https://wa.me/5531994492474?text=');
     const attribution=prepared&&new URL(go.href).searchParams.get('text').includes('Origem da divulgação (declarada): Instagram DAYSLUME');
     form.elements.business.value='QA atualizado';
     form.elements.business.dispatchEvent(new Event('input',{bubbles:true}));
     const invalidated=go.hidden&&!go.hasAttribute('href');
     const noOverflow=document.documentElement.scrollWidth<=innerWidth+2;
     return {returned,result,initiallyHidden,blocked,prepared,attribution,invalidated,noOverflow};
   });
   if(Object.values(row.radar).some(v=>!v))row.issues.push('Radar public flow failed '+JSON.stringify(row.radar));
   await page.screenshot({path:join(out,'radar-result-'+width+'.png')});
   row.errors=[...new Set(row.errors)];
   allErrors.push(...row.errors);
   cases.push(row);
   console.log('FUNCTIONAL '+width+'px '+(row.issues.length?'ISSUES '+JSON.stringify(row.issues):'OK'));
   await page.close();
 }
}finally{await browser.close();}
await writeFile(join(out,'results.json'),JSON.stringify(cases,null,2));
let summary=['# DAYSLUME — Homologação funcional automatizada',
'','Ambiente: snapshots locais; nenhum dado de teste foi enviado ao WhatsApp.',
'','| Largura | Fundadora título | Formulário | Páginas internas | Alertas |',
'|---|---:|---|---:|---|'];
for(const c of cases)summary.push('| '+c.width+' px | '+c.founder.titleOpacity+' | '+(c.form.prepared.visible?'preparado':'falhou')+' | '+c.internal.length+' | '+(c.issues.join('; ')||'—')+' |');
summary.push('','## Erros no navegador',...((allErrors.length?allErrors:['Nenhum erro JavaScript ou HTTP local registrado.']).map(s=>'- '+s)));
await writeFile(join(out,'SUMMARY.md'),summary.join('\n')+'\n');
console.log(summary.join('\n'));
if(cases.some(c=>c.issues.length||c.errors.length))process.exitCode=1;