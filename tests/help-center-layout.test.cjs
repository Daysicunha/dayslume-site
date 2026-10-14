const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const all=['index.html','servicos.html','solucoes.html','projetos.html','blog.html','sobre.html','contato.html','central-de-ajuda.html','sites-completos.html','landing-pages.html','vitrini.html','vitrini-link.html','processo.html','projetos/tornearia-barbosa.html','blog/presenca-digital-estrategica.html','blog/depender-apenas-do-instagram-riscos.html','blog/site-bonito-precisa-funcionar.html','blog/ia-negocios-com-criterio.html','blog/da-ideia-a-interface.html','blog/tecnologia-com-intencao.html'];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('all 20 published pages have a clickable help strip with a working link',()=>{
 for(const page of all){
  const html=read(page);
  const prefix=page.includes('/')?'../':'';
  assert.equal((html.match(/class="days-help-strip"/g)||[]).length,1,page);
  assert.equal((html.match(/id="topo"/g)||[]).length,1,page);
  assert.match(html,new RegExp('href="'+prefix.replace(/[.*+?^$()|\[\]{}]/g,'\\$&')+'central-de-ajuda\\.html"'),page);
  assert.match(html,/Acesse nossa Central de Ajuda/,page);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,page);
 }
});

test('footers include atendimento and only one full-width back-to-top band',()=>{
 for(const page of all){
  const html=read(page);
  assert.equal((html.match(/class="days-footer-support"/g)||[]).length,1,page);
  assert.equal((html.match(/class="days-back-top"/g)||[]).length,1,page);
  assert.match(html,/href="#topo"/,page);
  assert.match(html,/href="https:\/\/wa\.me\/5531994492474\?text=/,page);
  assert.match(html,/ATENDIMENTO \/ DAYSLUME/,page);
  assert.match(html,/class="(?:footer|site-footer) days-support-ready"/,page);
  assert.equal((html.match(/class="floating-whatsapp"/g)||[]).length,1,page);
 }
});

test('Central de Ajuda contains accessible FAQs and clear contact paths',()=>{
 const help=read('central-de-ajuda.html');
 assert.match(help,/id="perguntas"/);
 assert.equal((help.match(/class="days-help-faq"/g)||[]).length,7);
 assert.match(help,/href="contato\.html"/);
 assert.match(help,/href="solucoes\.html"/);
 assert.match(help,/href="https:\/\/wa\.me\/5531994492474/);
 assert.match(help,/rel="canonical" href="https:\/\/dayslume\.daysicunha\.com\.br\/central-de-ajuda\.html"/);
 assert.match(read('sitemap.xml'),/central-de-ajuda\.html/);
});

test('Contato includes native FAQ section without breaking the lead form',()=>{
 const page=read('contato.html');
 assert.match(page,/class="days-help-teaser" id="ajuda"/);
 assert.equal((page.match(/<form\b/g)||[]).length,1);
 assert.equal((page.match(/class="days-help-faq"/g)||[]).length,3);
 assert.match(page,/href="central-de-ajuda\.html"/);
});

test('shared CSS preserves palette, spacing and mobile accessibility',()=>{
 const css=read('assets/css/brand-palette.css');
 assert.match(css,/CENTRAL DE AJUDA \+ ATENDIMENTO \+ VOLTAR AO TOPO/);
 assert.match(css,/\.days-help-strip\{/);
 assert.match(css,/\.days-footer-support\{/);
 assert.match(css,/\.days-back-top\{/);
 assert.match(css,/\.days-help-page \.days-help-hero\{/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/safe-area-inset-bottom/);
 for(const page of all){
  const styles=[...read(page).matchAll(/href="((?:\.\.\/)?assets\/css\/[^"]+\.css)"/g)].map(x=>x[1]);
  assert.match(styles.at(-1)||'',/brand-palette\.css$/,page);
 }
});


test('footer service details show only verified contact options',()=>{
 const css=read('assets/css/brand-palette.css');
 assert.match(css,/Atendimento com dados de contato verificáveis/);
 assert.match(css,/\.days-support-contacts\{/);
 assert.match(css,/\.days-support-contact-icon\{/);
 for(const page of all){
  const html=read(page);
  assert.equal((html.match(/class="days-support-contacts"/g)||[]).length,1,page);
  assert.equal((html.match(/class="days-support-contact"/g)||[]).length,3,page);
  assert.match(html,/\+55 \(31\) 99449-2474/,page);
  assert.match(html,/Atendimento por mensagem · retorno conforme disponibilidade\./,page);
  assert.match(html,/Solicitar uma ligação/,page);
  assert.match(html,/Clique aqui e fale conosco\./,page);
  assert.equal((html.match(/class="days-support-contact-icon"/g)||[]).length,3,page);
 }
});

test('help strip remains below the sticky navigation stacking context',()=>{
 const css=read('assets/css/brand-palette.css');
 assert.match(css,/\.days-help-strip\{\s*position:relative;[\s\S]*?z-index:1;/);
 assert.doesNotMatch(css,/\.days-help-strip\{\s*position:relative;\s*z-index:121;/);
});
