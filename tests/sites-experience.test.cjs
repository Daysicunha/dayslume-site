const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const base=path.resolve(__dirname,'..');
const page=fs.readFileSync(path.join(base,'sites-completos.html'),'utf8');
const js=fs.readFileSync(path.join(base,'assets/js/sites-experience.js'),'utf8');
const css=fs.readFileSync(path.join(base,'assets/css/sites-experience.css'),'utf8');
function control(field,value){
  const attrs={}, classes=new Set(),listeners={};
  const node={
    dataset:{[field]:value},
    hidden:false,textContent:'',
    attributes:attrs,
    classList:{toggle:(cls,on)=>on?classes.add(cls):classes.delete(cls),contains:cls=>classes.has(cls)},
    setAttribute:(name,value)=>{attrs[name]=value},
    addEventListener:(name,fn)=>{listeners[name]=fn},
    click(){assert.equal(typeof listeners.click,'function');listeners.click();}
  };
  return node;
}
function setup(){
  const views=['antes','depois'].map(v=>control('siteView',v));
  const scenes=['antes','depois'].map(v=>control('siteScene',v));
  const devices=['desktop','mobile'].map(v=>control('siteDevice',v));
  const tabs=['inicio','servicos','sobre','contato'].map(v=>control('siteTab',v));
  const panels=['inicio','servicos','sobre','contato'].map(v=>control('sitePanel',v));
  const frame={dataset:{device:'desktop'}};
  const tools={hidden:false};
  const status={textContent:''};
  const lookup={
    '[data-site-view]':views,
    '[data-site-scene]':scenes,
    '[data-site-device]':devices,
    '[data-site-tab]':tabs,
    '[data-site-panel]':panels
  };
  const selectors={
    '[data-site-frame]':frame,
    '.sites-device-tools':tools,
    '[data-sites-status]':status
  };
  const root={
    querySelectorAll:key=>lookup[key]||[],
    querySelector:key=>selectors[key]||null
  };
  vm.runInNewContext(js,{document:{querySelector:key=>key==='[data-sites-experience]'?root:null}});
  return {views,scenes,devices,tabs,panels,frame,tools,status};
}
test('new interactive section is below existing approved hero with case and contacts',()=>{
  const hero=page.indexOf('<section class="hero sites-hero-flagship"');
  const lab=page.indexOf('<section class="section sites-showcase"');
  const details=page.indexOf('<div class="container detail">');
  assert.ok(hero>=0 && hero<lab && lab<details);
  assert.equal((page.match(/<h1\b/gi)||[]).length,1);
  for(const token of ['data-sites-experience','data-site-view="antes"','data-site-view="depois"',
    'data-site-device="desktop"','data-site-device="mobile"',
    'data-site-tab="inicio"','data-site-tab="servicos"','data-site-tab="sobre"',
    'data-site-tab="contato"','projetos/tornearia-barbosa.html','contato.html',
    'tornearia-barbosa-case.webp','Simulação conceitual']){
    assert.ok(page.includes(token),token);
  }
  assert.match(page,/<script src="assets\/js\/sites-experience\.js" defer>/);
  const styles=[...page.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(styles.at(-1),'assets/css/sites-hero.css');
  assert.equal(styles.at(-2),'assets/css/brand-palette.css');
  assert.equal(styles.at(-3),'assets/css/sites-experience.css');
});
test('before/after comparison works, hides device selector when it does not apply',()=>{
  const s=setup();
  assert.equal(s.scenes[0].hidden,true);
  assert.equal(s.scenes[1].hidden,false);
  assert.equal(s.views[1].attributes['aria-pressed'],'true');
  s.views[0].click();
  assert.equal(s.scenes[0].hidden,false);
  assert.equal(s.scenes[1].hidden,true);
  assert.equal(s.tools.hidden,true);
  assert.match(s.status.textContent,/informações dispersas/);
  s.views[1].click();
  assert.equal(s.scenes[0].hidden,true);
  assert.equal(s.tools.hidden,false);
  assert.equal(s.views[0].attributes['aria-pressed'],'false');
});
test('device and mini-site navigation update state, aria controls and displayed panel',()=>{
  const s=setup();
  s.devices[1].click();
  assert.equal(s.frame.dataset.device,'mobile');
  assert.equal(s.devices[1].attributes['aria-pressed'],'true');
  s.tabs[2].click();
  assert.equal(s.panels[2].hidden,false);
  assert.ok(s.panels.filter((p,i)=>i!==2).every(p=>p.hidden));
  assert.equal(s.tabs[2].attributes['aria-pressed'],'true');
  assert.match(s.status.textContent,/celular, seção Sobre/);
  s.views[0].click();
  s.views[1].click();
  assert.equal(s.frame.dataset.device,'mobile');
  assert.equal(s.panels[2].hidden,false);
});
test('demo is accessible and responsive, with no tracking or fabricated conversion metrics',()=>{
  assert.match(page,/role="status" aria-live="polite"/);
  assert.match(page,/aria-pressed="true"/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/max-width:800px/);
  assert.match(css,/max-width:560px/);
  assert.match(css,/focus-visible/);
  assert.match(css,/sites-demo-panel\[hidden\]/);
  assert.doesNotMatch(js,/\b(fetch|XMLHttpRequest|localStorage|sessionStorage)\s*\(/);
  assert.doesNotMatch(page,/\b(?:[1-9]\d*%|mais vendas garantidas)\b/i);
});
