const { test }=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'servicos.html'),'utf8');
const script=fs.readFileSync(path.join(root,'assets/js/solutions-diagnostic.js'),'utf8');
const style=fs.readFileSync(path.join(root,'assets/css/solutions-diagnostic.css'),'utf8');

class Node {
  constructor(tag) {
    this.tagName=tag.toLowerCase();
    this.children=[];
    this.className='';
    this.textContent='';
    this.attributes={};
    this.listeners={};
    this.style={setProperty:(name,value)=>{this.attributes[name]=value}};
    this.focused=false;
  }
  appendChild(child){this.children.push(child);return child}
  replaceChildren(...items){this.children=items}
  setAttribute(name,value){this.attributes[name]=value}
  addEventListener(name,handler){this.listeners[name]=handler}
  focus(){this.focused=true}
  click(){assert.equal(typeof this.listeners.click,'function');this.listeners.click()}
}
const findAll=(node,predicate)=>[
  ...(predicate(node)?[node]:[]),
  ...node.children.flatMap(child=>findAll(child,predicate))
];
function setup(){
  const stage=new Node('div');
  const widget={querySelector:selector=>selector==='[data-diagnostic-stage]'?stage:null};
  const document={
    querySelector:selector=>selector==='[data-days-diagnostic]'?widget:null,
    createElement:tag=>new Node(tag)
  };
  vm.runInNewContext(script,{document,encodeURIComponent});
  return {
    stage,
    headings:()=>findAll(stage,node=>node.tagName==='h3'),
    options:()=>findAll(stage,node=>node.tagName==='button'&&node.className==='diagnostic-option'),
    buttons:()=>findAll(stage,node=>node.tagName==='button'),
    links:()=>findAll(stage,node=>node.tagName==='a'),
    pick:index=>findAll(stage,node=>node.tagName==='button'&&node.className==='diagnostic-option')[index].click()
  };
}
test('quiz integrates into Solutions hero and preserves the approved color palette last',()=>{
 assert.match(html,/<section class="hero hero--solutions-quiz"/);
 assert.match(html,/id="diagnostico-digital"/);
 assert.match(html,/data-days-diagnostic/);
 assert.match(html,/href="#diagnostico-digital"/);
 assert.match(html,/<script src="assets\/js\/solutions-diagnostic\.js" defer>/);
 const sheets=[...html.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m=>m[1]);
 assert.equal(sheets.at(-1),'assets/css/brand-palette.css');
 assert.equal(sheets.at(-2),'assets/css/solutions-diagnostic.css');
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.match(style,/max-width:800px/);
 assert.match(style,/max-width:560px/);
 assert.match(style,/prefers-reduced-motion:reduce/);
 assert.match(style,/focus-visible/);
});
test('quiz has three questions, allows returning, restarting and gives relevant links',()=>{
 const f=setup();
 assert.match(f.headings()[0].textContent,/maior desafio/);
 assert.equal(f.options().length,4);
 f.pick(2);
 assert.match(f.headings()[0].textContent,/atualmente/);
 const back=f.buttons().find(b=>b.className==='diagnostic-back');
 assert.ok(back);back.click();
 assert.match(f.headings()[0].textContent,/maior desafio/);
 f.pick(2);f.pick(2);f.pick(2);
 assert.equal(f.options().length,0);
 const result=findAll(f.stage,node=>node.className==='diagnostic-result-name')[0];
 assert.match(result.textContent,/ENGRENI/);
 assert.equal(f.links()[0].href,'solucoes.html#engreni');
 const whatsapp=new URL(f.links()[1].href);
 assert.equal(whatsapp.origin,'https://wa.me');
 assert.equal(whatsapp.pathname,'/5531994492474');
 assert.deepEqual([...whatsapp.searchParams.keys()],['text']);
 assert.match(whatsapp.searchParams.get('text'),/tarefas manuais/);
 assert.match(whatsapp.searchParams.get('text'),/ENGRENI/);
 assert.equal(f.links()[1].rel,'noopener noreferrer');
 f.buttons().find(b=>b.className==='diagnostic-reset').click();
 assert.equal(f.options().length,4);
});
test('all four solution categories map to valid internal destinations',()=>{
 const choices=[
  ['presença','sites-completos.html'],
  ['Landing page','landing-pages.html'],
  ['ENGRENI','solucoes.html#engreni'],
  ['VITRINI','vitrini.html']
 ];
 for(let i=0;i<choices.length;i++){
  const q=setup();
  q.pick(i);q.pick(i);q.pick(i);
  const title=findAll(q.stage,n=>n.className==='diagnostic-result-name')[0];
  assert.match(title.textContent,new RegExp(choices[i][0],'i'));
  const href=q.links()[0].href;
  assert.equal(href,choices[i][1]);
  const [filename,fragment]=href.split('#');
  const content=fs.readFileSync(path.join(root,filename),'utf8');
  if(fragment)assert.ok(content.includes('id="'+fragment+'"'));
 }
 assert.doesNotMatch(script,/\b(fetch|XMLHttpRequest|localStorage|sessionStorage)\s*\(/);
 assert.match(html,/Sem cadastro/);
});
