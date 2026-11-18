const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const read=p=>readFileSync(join(__dirname,'..',p),'utf8');
const css=read('assets/css/contents-cinematic-33.css');
const light=css.split('/* DAYSLUME / ATO 06 — Conteúdos Editorial Light • 18/11/2026.')[1];
const scope='body.home-page[data-c33-editorial] main > section#conteudos.contents-cinematic ';
test('light editorial selectors apply to both articles with consistent specificity',()=>{
  assert.ok(light,'approved light section must remain');
  assert.doesNotMatch(light,/,\s+\.content-(?:featured|secondary|read|compare)/);
  assert.ok(light.includes(scope+'.content-featured, '+scope+'.content-secondary'));
  assert.ok(light.includes(scope+'.content-featured__media, '+scope+'.content-secondary__media'));
  assert.match(light,/color:#2E2030/);
  assert.match(light,/color:#4B3B47/);
  assert.match(light,/linear-gradient\(124deg,rgba\(255,255,255,\.69\)/);
});
test('single existing WhatsApp overlap handler covers showroom choices',()=>{
  const js=read('assets/js/dayslume-motion.js');
  assert.match(js,/#produtos \.cinema33-showroom__choices button/);
  assert.match(js,/action\.classList\.toggle\('is-context-hidden', hidden\)/);
  assert.equal((js.match(/addEventListener\('scroll'/g)||[]).length,1);
});
test('browser QA checks contrast and prevents covered product choices',()=>{
  const qa=read('scripts/functional-qa.mjs');
  assert.match(qa,/contents-legible-/);
  assert.match(qa,/products-controls-/);
  assert.match(qa,/Floating WhatsApp covers ENGRENI showroom selector/);
});
