const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const page=fs.readFileSync(path.join(root,'projetos.html'),'utf8');
const js=fs.readFileSync(path.join(root,'assets/js/projects-experience.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/projects-experience.css'),'utf8');

test('projects hero uses real case previews and contextual CTAs',()=>{
 assert.match(page,/class="hero projects-hero"/);
 assert.match(page,/data-projects-hero/);
 assert.match(page,/aria-labelledby="projects-hero-title"/);
 assert.match(page,/data-project-preview="tornearia"/);
 assert.match(page,/data-project-preview="rocket"/);
 assert.match(page,/data-project-panel="tornearia"/);
 assert.match(page,/data-project-panel="rocket"/);
 for(const name of ['tornearia-barbosa-case.webp','new-rocket-play-home.webp']){
  assert.ok(fs.existsSync(path.join(root,'assets/images',name)),name);
 }
 assert.match(page,/href="projetos\/tornearia-barbosa.html"/);
 assert.match(page,/href="https:\/\/new-rocket-play.vercel.app\//);
 assert.match(page,/id="portfolio"/);
});

test('existing filters and authentic case statuses are preserved',()=>{
 for(const kind of ['web','experience']){
  assert.match(page,new RegExp('data-project-kind="'+kind+'"'));
 }
 assert.match(page,/class="days-filterbar"/);
 assert.match(page,/class="[^"]*days-filter-grid[^"]*projects-case-grid/);
 assert.match(page,/CLIENTE REAL/);
 assert.match(page,/Dayane Cunha Nails/);
 assert.match(page,/Loh Gourmet/);
 assert.match(page,/4 projetos exibidos/);
 assert.match(page,/Sem estatísticas inventadas/);
 assert.match(page,/href="solucoes.html#engreni-agenda"/);
});

test('hero tab navigation is keyboard accessible and mobile-safe',()=>{
 assert.match(js,/aria-selected/);
 assert.match(js,/ArrowRight/);
 assert.match(js,/ArrowLeft/);
 assert.match(js,/Home/);
 assert.match(js,/End/);
 assert.match(js,/\.hidden=/);
 assert.match(css,/@media\(max-width:780px\)/);
 assert.match(css,/@media\(max-width:540px\)/);
 assert.match(css, /prefers-reduced-motion:reduce/);
 assert.match(page,/src="assets\/js\/projects-experience.js"/);
 assert.match(page,/href="assets\/css\/projects-experience.css"/);
 const styles=[...page.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(x=>x[1]);
 assert.equal(styles.at(-1),'assets/css/brand-palette.css');
});