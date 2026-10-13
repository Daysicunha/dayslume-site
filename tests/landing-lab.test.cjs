const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const base=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(base,'landing-pages.html'),'utf8');
const css=fs.readFileSync(path.join(base,'assets/css/landing-lab.css'),'utf8');
const js=fs.readFileSync(path.join(base,'assets/js/landing-lab.js'),'utf8');

function setup(){
  const selectors=[
    'brand','eyebrow','title','description','cta','reassurance','action',
    'context-title','context','flow','flow-detail','live'
  ];
  const nodes=Object.fromEntries(selectors.map(key=>[key,{textContent:''}]));
  const buttons=['contatos','ofertas','agenda'].map(goal=>{
    const classes=new Set(),attrs={},listeners={};
    return {
      dataset:{lpGoal:goal},
      classList:{toggle:(name,on)=>on?classes.add(name):classes.delete(name),contains:name=>classes.has(name)},
      setAttribute:(name,value)=>{attrs[name]=value},
      getAttribute:name=>attrs[name],
      addEventListener:(name,handler)=>{listeners[name]=handler},
      click(){assert.equal(typeof listeners.click,'function');listeners.click()}
    };
  });
  const root={
    dataset:{},
    querySelectorAll:query=>query==='[data-lp-goal]'?buttons:[],
    querySelector:query=>{
      const key=/^\[data-lp-(.+)\]$/.exec(query)?.[1];
      return nodes[key]||null;
    }
  };
  vm.runInNewContext(js,{document:{querySelector:q=>q==='[data-lp-lab]'?root:null}});
  return {nodes,buttons,root};
}
test('landing hero has a single commercial H1, CTA to laboratory and local assets',()=>{
  const hero=html.indexOf('<section class="hero lp-hero"');
  const lab=html.indexOf('id="laboratorio-conversao"');
  const anatomy=html.indexOf('id="estrutura-landing"');
  const process=html.indexOf('03 / PROCESSO DAYSLUME');
  assert.ok(hero>0&&hero<lab&&lab<anatomy&&anatomy<process);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/transformar interesse em ação/);
  assert.match(html,/href="#laboratorio-conversao"/);
  assert.match(html,/class="lp-hero-visual"/);
  assert.match(html,/data-lp-lab/);
  assert.match(html,/href="contato.html">Conversar sobre minha campanha/);
  assert.match(html,/<script src="assets\/js\/landing-lab\.js" defer>/);
  const sheets=[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(sheets.at(-1),'assets/css/brand-palette.css');
  assert.equal(sheets.at(-2),'assets/css/landing-lab.css');
});
test('laboratory has three interactive goals and updates copy, funnel and pressed states',()=>{
  const f=setup();
  assert.equal(f.buttons.length,3);
  assert.equal(f.root.dataset.lpCurrent,'contatos');
  assert.match(f.nodes.title.textContent,/projeto merece/);
  assert.match(f.nodes.live.textContent,/captar contatos/);
  for(let i=0;i<3;i++){
    const goal=['contatos','ofertas','agenda'][i];
    f.buttons[i].click();
    assert.equal(f.root.dataset.lpCurrent,goal);
    assert.equal(f.buttons.filter(b=>b.getAttribute('aria-pressed')==='true').length,1);
    assert.equal(f.buttons.filter(b=>b.classList.contains('is-active')).length,1);
    assert.equal(f.buttons[i].getAttribute('aria-pressed'),'true');
    for(const key of ['title','description','cta','action','flow','flow-detail','context','live']){
      assert.ok(f.nodes[key].textContent.length>5,key+' should be populated');
    }
  }
  f.buttons[1].click();
  assert.match(f.nodes.cta.textContent,/Conhecer a oferta/);
  assert.match(f.nodes.flow.textContent,/Oferta/);
  f.buttons[2].click();
  assert.match(f.nodes.title.textContent,/horário/);
  assert.match(f.nodes.cta.textContent,/Solicitar agendamento/);
});
test('conversion anatomy avoids fictitious results and demo does not submit data',()=>{
  assert.equal((html.match(/class="lp-anatomy-card"/g)||[]).length,4);
  assert.match(html,/Provas verdadeiras/);
  assert.match(html,/Simulação|Exemplo demonstrativo|demonstração ilustrativa/i);
  assert.match(html,/role="status" aria-live="polite"/);
  assert.match(html,/aria-pressed="true"/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(css,/max-width:560px/);
  assert.match(css,/focus-visible/);
  assert.match(css,/background-image:var\(--dayslume-home-petals\)/);
  assert.doesNotMatch(js,/\b(fetch|XMLHttpRequest|localStorage|sessionStorage)\s*\(/);
  assert.doesNotMatch(html,/<form\b/i);
});
