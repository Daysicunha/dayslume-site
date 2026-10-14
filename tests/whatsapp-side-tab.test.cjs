const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const css=fs.readFileSync(path.join(root,'assets/css/brand-palette.css'),'utf8');
const pages=['index.html','servicos.html','solucoes.html','projetos.html','blog.html','sobre.html','contato.html','sites-completos.html','landing-pages.html','vitrini.html','vitrini-link.html','processo.html','projetos/tornearia-barbosa.html'];

test('WhatsApp rail uses DAYSLUME palette and right-edge rectangular tab',()=>{
 assert.match(css,/WhatsApp side-tab inspired by vertical support rail/);
 assert.match(css,/width:44px;[\s\S]*?height:144px;/);
 assert.match(css,/border-radius:15px 0 0 15px/);
 assert.match(css,/background:#6B536D/);
 assert.match(css,/color:#F3EFE8/);
 assert.match(css,/background:#202532/);
 assert.match(css,/writing-mode:vertical-rl/);
 assert.match(css,/content:"WhatsApp"/);
 assert.match(css,/@media\(max-width:800px\)/);
 assert.match(css,/safe-area-inset-bottom/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});

test('the same existing contact action remains accessible on all main pages',()=>{
 for(const file of pages){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  assert.equal((html.match(/class="floating-whatsapp"/g)||[]).length,1,file);
  assert.match(html,/aria-label="Falar com a DAYSLUME pelo WhatsApp"/,file);
  assert.match(html,/https:\/\/wa\.me\/5531994492474/,file);
  const cssLinks=[...html.matchAll(/href="((?:\.\.\/)?assets\/css\/[^"]+\.css)"/g)].map(match=>match[1]);
  assert.match(cssLinks.at(-1)||'',/brand-palette\.css$/,file);
 }
});
