const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=f=>fs.readFileSync(path.resolve(__dirname,'..',f),'utf8');
const html=read('index.html'),css=read('assets/css/brand-palette.css');
const styles=[...html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g)].map(m=>m[1]);
test('approved palette remains the last stylesheet; home map is scoped and consolidated',()=>{
  assert.equal(styles.at(-1),'assets/css/brand-palette.css');
  assert.ok(css.includes('Mapa cromático final da Home'));
  assert.match(css,/--ds-neon-pink: #FF3D9A;/);
});
test('modelo section is ivory and two cards have dark/light contrast',()=>{
  const m=css.slice(css.indexOf('/* DAYSLUME 3.3 — Mapa cromático final da Home'));
  assert.match(m,/section#modelo\.section \{[^}]*var\(--warm-ivory\)/s);
  assert.match(m,/\.modelo-path-card--bespoke:first-child \{[^}]*var\(--ink-deep\)/s);
  assert.match(m,/\.modelo-path-card--products:last-child \{[^}]*var\(--warm-ivory\)/s);
  assert.match(m,/\.modelo-path-card--products :is\(\.service-number,\.path-kicker,h3,\.modelo-description,\.path-cta\) \{\s*color:var\(--ink-deep\)/s);
});
test('projects and contents are light, contact title bright and form dark-on-light',()=>{
  const m=css.slice(css.indexOf('/* DAYSLUME 3.3 — Mapa cromático final da Home'));
  assert.match(m,/section#projetos\.section \{[^}]*var\(--warm-ivory\)/s);
  assert.match(m,/section#conteudos\.contents-cinematic \{[^}]*var\(--warm-ivory\)/s);
  assert.match(m,/section#contato\.section \{[^}]*#17131C/s);
  assert.match(m,/section#contato\.section form\.contact-form \{[^}]*color:var\(--ink-deep\)/s);
});
test('recurring orbit, luminous seam, compact mobile card and reduced motion stay',()=>{
  const m=css.slice(css.indexOf('/* DAYSLUME 3.3 — Mapa cromático final da Home'));
  assert.match(m,/section#projetos\.section::before \{[^}]*aspect-ratio:1/s);
  assert.match(m,/\.c33-section-line \{[^}]*--home-seam/s);
  assert.match(m,/@media \(max-width:600px\)/);
  assert.match(m,/height:164px;/);
  assert.match(m,/@media \(prefers-reduced-motion:reduce\)/);
});
