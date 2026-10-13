const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'contato.html'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/contact-flagship.css'),'utf8');
const js=fs.readFileSync(path.join(root,'assets/js/dayslume-contact.js'),'utf8');

test('Hero is a single responsive project briefing, with one accessible form',()=>{
  const heroStart=html.indexOf('<section class="hero contact-hero-flagship"');
  const nextStart=html.indexOf('<section class="section contact-process"');
  assert.ok(heroStart>0 && nextStart>heroStart);
  const hero=html.slice(heroStart,nextStart);
  assert.match(hero,/Conte o problema/);
  assert.match(hero,/A tecnologia vem depois/);
  assert.match(hero,/contact-hero-grid/);
  assert.match(hero,/href="#solicitar"/);
  assert.match(hero,/id="solicitar"/);
  assert.match(hero,/id="contact-briefing-title"/);
  assert.match(hero,/id="contact-form" hidden data-whatsapp="5531994492474"/);
  assert.equal((html.match(/id="contact-form"/g)||[]).length,1);
  assert.equal((html.match(/<form\b/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  for(const id of ['nome','empresa','necessidade','email','form-status','contact-privacy','whatsapp-submit']){
    assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1,id);
  }
  assert.match(hero,/id="whatsapp-submit" hidden target="_blank" rel="noopener noreferrer"/);
  assert.match(hero,/contact-briefing-direct/);
  assert.match(hero,/<noscript>/);
  assert.match(css,/\.contact-hero-form\[hidden\]/);
  assert.match(css,/\.whatsapp-submit\[hidden\]/);
});
test('Form asks name and problem, while email and company are optional',()=>{
  for(const id of ['nome','necessidade']){
    const control=html.match(new RegExp('<(?:input|textarea)\\b[^>]*id="'+id+'"[^>]*>'))?.[0];
    assert.ok(control,id+' must exist');
    assert.match(control,/\brequired\b/,id);
  }
  for(const id of ['email','empresa']){
    const control=html.match(new RegExp('<input\\b[^>]*id="'+id+'"[^>]*>'))?.[0];
    assert.ok(control,id+' must exist');
    assert.doesNotMatch(control,/\brequired\b/,id);
  }
  const email=html.match(/<input\b[^>]*id="email"[^>]*>/)?.[0];
  assert.match(email,/type="email"/);
  assert.match(html,/Você revisa e confirma o envio no WhatsApp/);
  assert.match(js,/if \(value\('email'\)\) lines\.push/);
  assert.doesNotMatch(js,/\b(fetch|XMLHttpRequest|localStorage|sessionStorage)\s*\(/);
});
test('Below the hero the steps are Understand, Propose, Develop; shared visual remains intact',()=>{
  assert.equal((html.match(/class="contact-process-card"/g)||[]).length,3);
  assert.match(html,/ENTENDER/);
  assert.match(html,/PROPOR/);
  assert.match(html,/DESENVOLVER/);
  assert.match(html,/Uma boa solução começa por um diagnóstico honesto/);
  assert.match(css,/background-image:var\(--dayslume-home-petals\)/);
  assert.match(css,/@media\(max-width:560px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /:focus-visible/);
  const sheets=[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(sheets.at(-1),'assets/css/brand-palette.css');
  assert.equal(sheets.at(-2),'assets/css/contact-flagship.css');
});

test('Desktop contact hero is top-aligned and compact without shrinking touch targets',()=>{
  const hero=css.match(/\.header~main>\.hero\.contact-hero-flagship\s*\{([^}]*)\}/)?.[1];
  const grid=css.match(/\.header~main>\.hero\.contact-hero-flagship \.contact-hero-grid\s*\{([^}]*)\}/)?.[1];
  const card=css.match(/body:not\(\.home-page\) \.contact-briefing\s*\{([^}]*)\}/)?.[1];
  assert.ok(hero && grid && card);
  assert.match(hero,/padding:clamp\(116px,9vw,146px\)/);
  assert.match(grid,/align-items:start/);
  assert.match(css,/\.contact-hero-copy \{min-width:0;align-self:start/);
  assert.match(card,/padding:clamp\(22px,2\.1vw,29px\)/);
  assert.match(css,/\.contact-hero-form \{[\s\S]*?display:grid;gap:10px/);
  assert.match(css,/min-height:46px;padding:12px 13px/);
  assert.match(css,/width:100%;min-height:51px/);
  assert.match(css,/@media\(max-width:900px\)/);
  assert.match(css,/@media\(max-width:560px\)/);
  assert.match(css,/\.contact-form-row \{grid-template-columns:1fr/);
});
