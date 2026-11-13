const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const html=read('index.html');
const products=read('solucoes.html');
const allSections=[...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(m=>m[1]);
test('Approved editorial journey has a clear logical order with no lifestyle detour',()=>{
 assert.deepEqual(allSections.slice(0,9),['cinema33-film','apresentacao','problemas','modelo','produtos','projetos','sobre','conteudos','contato']);
 assert.doesNotMatch(html,/id="ritmo"|class="section home-process-section"/);
 assert.match(html,/id="processo-home"/);
});
test('Approved hero and proof move visitors toward a real action',()=>{
 assert.match(html,/href="#contato">Conversar sobre meu projeto/);
 assert.match(html,/href="#projetos">Ver projetos realizados/);
 assert.match(html,/Quero algo assim para meu negócio/);
 assert.match(html,/href="https:\/\/wa\.me\/5531994492474/);
 assert.match(html,/Conversar no WhatsApp/);
});
test('Preserves film, three cases, two working ecosystems, and founders image',()=>{
 assert.equal((html.match(/data-c33-caption/g)||[]).length,5);
 assert.match(html,/class="cinema-cluster"/);
 assert.equal((html.match(/class="project-card flagship-case/g)||[]).length,3);
 assert.match(html,/data-cinema33-showroom/);
 assert.match(html,/src="assets\/images\/daysi-cunha-editorial\.jpg"/);
 assert.match(html,/VITRINI apresenta\./);
 assert.match(html,/ENGRENI organiza\./);
});
test('Two home articles use real linked article titles and preserve full blog',()=>{
 assert.equal((html.match(/<article class="content-secondary">/g)||[]).length,1);
 assert.equal((html.match(/<article class="content-featured">/g)||[]).length,1);
 assert.match(html,/Presença digital estratégica: como organizar seus canais/);
 assert.match(html,/Um site bonito também precisa funcionar/);
 assert.match(html,/href="blog\.html">VER TODOS OS ARTIGOS/);
 assert.ok(!html.includes('content-technology-experience.svg'));
 assert.match(read('blog.html'),/id="explorar"/);
});
test('Product maturity communicated without a fabricated shop-now claim',()=>{
 assert.match(html,/Agenda em uso-piloto/);
 assert.match(html,/Nauta em validação/);
 assert.match(html,/VITRINI Local: plataforma regional/);
 assert.match(html,/href="solucoes\.html#ritmo-produto"/);
 assert.match(products,/id="ritmo-produto"/);
});
test('Founders method is concise and there are seven numbered editorial sections',()=>{
 for(const label of ['01 · Entender','02 · Construir','03 · Evoluir'])assert.ok(html.includes(label));
 const nums=[...html.matchAll(/section-eyebrow__number">([0-9]{2})</g)].map(m=>m[1]);
 assert.deepEqual(nums,['01','02','03','04','05','06','07']);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
});
