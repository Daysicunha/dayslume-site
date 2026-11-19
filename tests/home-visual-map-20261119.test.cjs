const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=f=>fs.readFileSync(path.resolve(__dirname,'..',f),'utf8');
const html=read('index.html'),css=read('assets/css/home-visual-map-20261119.css');
test('color map is loaded after legacy palette, only on the home',()=>{
  assert.ok(html.indexOf('assets/css/home-visual-map-20261119.css')>html.indexOf('assets/css/brand-palette.css'));
  assert.doesNotMatch(css,/\bbody:(?!home-page)/);
  for(const id of ['problemas','modelo','produtos','projetos','sobre','conteudos','contato'])assert.ok(css.includes('section#'+id),id);
});
test('modelo section is warm ivory and the two cards are contrasting',()=>{
  assert.match(css,/section#modelo\.section \{[^}]*var\(--warm-ivory\)/s);
  assert.match(css,/\.modelo-path-card--bespoke:first-child \{[^}]*var\(--ink-deep\)/s);
  assert.match(css,/\.modelo-path-card--products:last-child \{[^}]*var\(--warm-ivory\)/s);
  assert.match(css,/\.modelo-path-card--products :is\(\.service-number,\.path-kicker,h3,\.modelo-description,\.path-cta\) \{\s*color:var\(--ink-deep\)/s);
});
test('projects and contents are light, founder and contact remain dark',()=>{
  assert.match(css,/section#projetos\.section \{[^}]*var\(--warm-ivory\)/s);
  assert.match(css,/section#conteudos\.contents-cinematic \{[^}]*var\(--warm-ivory\)/s);
  assert.match(css,/section#contato\.section \{[^}]*#17131C/s);
  assert.match(css,/section#contato\.section form\.contact-form \{[^}]*color:var\(--ink-deep\)/s);
});
test('orbit signature, light seam, mobile card density and reduced motion remain',()=>{
  assert.match(css,/section#projetos\.section::before \{[^}]*aspect-ratio:1/s);
  assert.match(css,/\.c33-section-line \{[^}]*--home-seam/s);
  assert.match(css,/@media \(max-width:600px\)/);
  assert.match(css,/height:164px;/);
  assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
});
