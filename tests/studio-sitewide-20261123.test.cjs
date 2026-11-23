const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const files=[
  "index.html",
  "studio-criativo.html",
  "servicos.html",
  "solucoes.html",
  "projetos.html",
  "sobre.html",
  "contato.html",
  "processo.html",
  "blog.html",
  "landing-pages.html",
  "sites-completos.html",
  "central-de-ajuda.html",
  "vitrini.html",
  "vitrini-link.html",
  "projetos/tornearia-barbosa.html",
  "blog/da-ideia-a-interface.html",
  "blog/depender-apenas-do-instagram-riscos.html",
  "blog/ia-negocios-com-criterio.html",
  "blog/presenca-digital-estrategica.html",
  "blog/site-bonito-precisa-funcionar.html",
  "blog/tecnologia-com-intencao.html"
];
const link=(html,href)=>html.includes('href="'+href+'"');
test('studio 2026: todas as 21 páginas possuem navegação e rodapé com Studio',()=>{
  assert.equal(files.length,21);
  for(const file of files){
    const html=read(file);
    const prefix=file.includes('/')?'../':'';
    const expected=prefix+'studio-criativo.html';
    const st=html.indexOf('<nav id="menu-principal"');
    const end=html.indexOf('</nav>',st);
    assert.ok(st>=0&&end>st,file+' menu not found');
    const menu=html.slice(st,end);
    assert.ok(link(menu,expected),file+' missing Studio in header');
    const footer=html.indexOf('<footer');
    const startNav=html.indexOf('<nav class="footer-',footer);
    const endNav=html.indexOf('</nav>',startNav);
    assert.ok(footer>0&&startNav>footer&&endNav>startNav,file+' footer nav missing');
    assert.ok(link(html.slice(startNav,endNav),expected),file+' missing Studio in footer');
    const styles=[...html.matchAll(/href="((?:\.\.\/)?assets\/css\/[^"]+\.css)"/g)].map(x=>x[1]);
    assert.ok(styles.length>0,file+' no CSS');
    assert.equal(styles.at(-1),prefix+'assets/css/brand-palette.css',file+' palette should be last');
    assert.ok(styles.includes(prefix+'assets/css/studio-sitewide-20261123.css'),file+' studio stylesheet missing');
  }
});
test('studio 2026: URL relativa funciona em artigos e projeto detalhado',()=>{
  for(const file of files.filter(p=>p.includes('/'))) {
    const html=read(file);
    assert.ok(link(html,'../studio-criativo.html'),file);
    assert.ok(link(html,'../assets/css/studio-sitewide-20261123.css'),file);
  }
});
test('studio 2026: página possui conteúdo original, SEO, serviços e ações acessíveis',()=>{
  const html=read('studio-criativo.html');
  const expected=['id="studio-title"','id="servicos-criativos"','id="studio-services-title"','id="como-trabalhamos"','id="studio-faq-title"','Identidade Visual','Branding','Artes Digitais','Pacotes de Imagens','Design de Painéis','Assessoria Criativa','contato.html','https://wa.me/','aria-current="page"'];
  for(const name of expected)assert.ok(html.includes(name),'Missing '+name);
  assert.equal((html.match(/class="studio-service-card"/g)||[]).length,4);
  assert.equal((html.match(/<details>/g)||[]).length,4);
  assert.equal((html.match(/<main\b/g)||[]).length,1);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/rel="canonical" href="https:\/\/dayslume\.daysicunha\.com\.br\/studio-criativo\.html"/);
  const match=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match);
  const graph=JSON.parse(match[1])['@graph'];
  assert.ok(graph.some(g=>g['@type']==='Service'));
});
test('studio 2026: home e serviços direcionam para a página completa',()=>{
  const home=read('index.html'),services=read('servicos.html'),about=read('sobre.html');
  assert.ok(home.includes('href="studio-criativo.html"'));
  assert.ok(services.includes('Conhecer o Studio Criativo por completo'));
  assert.ok(about.includes('Conhecer identidade visual, artes e interfaces'));
  const map=read('sitemap.xml');
  assert.ok(map.includes('https://dayslume.daysicunha.com.br/studio-criativo.html'));
  assert.equal((map.match(/<url>/g)||[]).length,21);
});
test('studio 2026: folhas de estilo isoladas e balanceadas',()=>{
  for(const sheet of ['assets/css/studio-sitewide-20261123.css','assets/css/studio-page-20261123.css']){
    const css=read(sheet);
    assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length,sheet);
    assert.ok(css.includes('studio-page') || css.includes('body[data-c33-editorial]'),sheet+' expected scoped rules');
  }
  const studio=read('assets/css/studio-page-20261123.css');
  assert.ok(studio.includes('body.studio-page'));
  assert.ok(studio.includes('@media(max-width:760px)'));
});

test('Studio Criativo publica escopos finitos e não promete gestão de campanhas',()=>{
  const studio=read('studio-criativo.html');
  const services=read('servicos.html');
  for(const term of ['Pacotes de Imagens','Painéis','Apps','Assessoria Criativa','Sem gestão diária']){
    assert.ok(studio.includes(term),term);
  }
  assert.ok(studio.includes('Não assumimos publicação diária'));
  assert.ok(services.includes('sem assumir a operação diária'));
  assert.ok(!services.includes('DIREÇÃO DE ARTE E CAMPANHAS'));
  assert.ok(!services.includes('MARKETING DE CONTEÚDO E SOCIAL MEDIA'));
});
