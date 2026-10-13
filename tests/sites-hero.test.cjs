const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'sites-completos.html'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/sites-hero.css'),'utf8');
const js=fs.readFileSync(path.join(root,'assets/js/sites-hero-motion.js'),'utf8');

test('hero has new commercial copy, matching CTAs, preview and one H1',()=>{
  const hero=html.slice(html.indexOf('<section class="hero sites-hero-flagship"'),html.indexOf('</section>',html.indexOf('<section class="hero sites-hero-flagship"'))+10);
  assert.match(hero,/Seu negócio merece um site que/);
  assert.match(hero,/apresenta, conecta e inspira confiança/);
  assert.match(hero,/href="#comparar-site"/);
  assert.match(hero,/href="projetos\/tornearia-barbosa.html"/);
  assert.match(hero,/data-sites-hero-motion/);
  assert.match(hero,/data-sites-hero-preview/);
  assert.match(hero,/EXEMPLO VISUAL DE SITE/);
  assert.match(hero,/role="img"/);
  assert.match(hero,/aria-hidden="true"/);
  assert.doesNotMatch(hero,/<video\b/i);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/id="comparar-site"/);
  assert.match(html,/<script src="assets\/js\/sites-hero-motion\.js" defer>/);
});
test('flagship theme reuses official six-petal artwork and isolates reduced-motion fallback',()=>{
  assert.match(css,/background-image:var\(--dayslume-home-petals\)/);
  assert.match(css,/background-size:var\(--dayslume-home-petal-sizes\)/);
  assert.match(css,/\.sites-hero-preview\s*\{/);
  assert.match(css,/rotateY\(var\(--sites-preview-tilt-y\)\)/);
  assert.match(css,/@media \(max-width:940px\)/);
  assert.match(css,/@media \(max-width:560px\)/);
  assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
  assert.match(css,/\.sites-hero-copy h1/);
  assert.match(css,/\.sites-hero-preview-window/);
  assert.match(js,/requestAnimationFrame\(update\)/);
  assert.match(js,/pointermove/);
  assert.match(js,/addEventListener\('scroll',schedule,\{passive:true\}\)/);
  assert.match(js,/desktop\.matches \|\| reduced\.matches/);
  assert.doesNotMatch(js,/\b(fetch|XMLHttpRequest|localStorage|sessionStorage)\s*\(/);
});
test('pointer and scroll motion flatten perspective, with safe reduced-motion fallback',()=>{
  const properties={};
  const pending=[];
  let currentBounds={top:0,bottom:760,height:760};
  const listeners={};
  const visualListeners={};
  const mqlDesktop={matches:true,addEventListener(name,fn){listeners['desktop:'+name]=fn}};
  const mqlReduced={matches:false,addEventListener(name,fn){listeners['reduced:'+name]=fn}};
  const visual={
    addEventListener(name,fn){visualListeners[name]=fn},
    getBoundingClientRect(){return {left:0,top:0,width:450,height:350}},
    querySelector(selector){return selector==='[data-sites-hero-preview]'?preview:null}
  };
  const preview={style:{
    setProperty(name,value){properties[name]=value},
    removeProperty(name){delete properties[name]}
  }};
  const hero={
    querySelector(selector){return selector==='[data-sites-hero-motion]'?visual:null},
    getBoundingClientRect(){return currentBounds}
  };
  const document={
    hidden:false,
    querySelector(selector){return selector==='.sites-hero-flagship'?hero:null},
    addEventListener(name,fn){listeners['document:'+name]=fn}
  };
  const windowEvents={};
  vm.runInNewContext(js,{
    document,
    matchMedia:q=>q.includes('prefers-reduced-motion')?mqlReduced:mqlDesktop,
    innerHeight:760,
    requestAnimationFrame:fn=>{pending.push(fn);return pending.length},
    addEventListener:(name,fn)=>{windowEvents[name]=fn}
  });
  const flush=()=>{const current=pending.splice(0);current.forEach(fn=>fn())};
  flush();
  assert.equal(properties['--sites-preview-tilt-y'],'-8.00deg');
  assert.equal(properties['--sites-preview-tilt-x'],'4.00deg');
  visualListeners.pointermove({clientX:450,clientY:0});
  flush();
  assert.notEqual(properties['--sites-preview-tilt-y'],'-8.00deg');
  currentBounds={top:-456,bottom:304,height:760};
  windowEvents.scroll();flush();
  assert.equal(properties['--sites-preview-tilt-y'],'0.00deg');
  assert.equal(properties['--sites-preview-rise'],'0.00px');
  mqlReduced.matches=true;listeners['reduced:change']();flush();
  assert.equal(properties['--sites-preview-tilt-y'],undefined);
});
