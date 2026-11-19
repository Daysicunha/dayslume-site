const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const css=fs.readFileSync(path.join(__dirname,'../assets/css/hero-project-simulators-20261118.css'),'utf8');
const palette=fs.readFileSync(path.join(__dirname,'../assets/css/brand-palette.css'),'utf8');
function rule(marker) {const start=css.indexOf(marker),open=css.indexOf('{',start);assert.ok(start>=0,'missing '+marker);return css.slice(open+1,css.indexOf('}',open));}
test('three screens remain ordered and the agenda stays in front',()=>{
  for(const [name,z] of [['vitrini',2],['caderneta',3],['agenda',4]]) assert.match(rule('.hero-projects__card--'+name+' {'),new RegExp('z-index:'+z));
  const main=rule('.hero-projects__card--agenda {');
  assert.match(main,/left:36%;top:21%;width:49%;height:67%/);
  assert.match(main,/rotateY\(-2\.7deg\)/);
});
test('right screen remains inset and side cards are quieter',()=>{
  assert.match(rule('.hero-projects__card--caderneta {'),/right:3\.8%;top:7%;width:30%;height:55%/);
  assert.match(rule('.hero-projects__card--vitrini {'),/left:9%;top:30%;width:40%;height:56%/);
  assert.match(css,/border:1px solid rgba\(var\(--ds-neon-pink-rgb\),\.32\)/);
  assert.match(css,/\.hero-projects__token--pin \{left:17%;bottom:9%;width:44px;height:44px;/);
});
test('tablet and mobile keep independent readable layouts and reduced-motion fallback',()=>{
  assert.match(css,/@media \(max-width:760px\)/);
  assert.match(css,/@media \(max-width:600px\)/);
  assert.match(css,/grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)/);
  assert.match(css,/\.hero-projects__card--agenda \{grid-column:1\/-1;grid-row:1;/);
  assert.match(css,/@media \(max-width:365px\)/);
  assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
});
test('legacy model clipping on mobile is corrected independently of hero layout',()=>{
  assert.match(palette,/\.modelo-product-platform \{\s*bottom:calc\(18% \+ 8px\)/);
  assert.match(palette,/\.modelo-product-tile--engreni \{\s*top:calc\(35% - 14px\)/);
});
