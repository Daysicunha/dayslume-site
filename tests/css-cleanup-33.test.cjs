const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const cssDir=path.join(root,'assets','css');
const dead=['benefits-reference.css','contents-reference.css','section-services.css','services-band.css','services-editorial.css','solutions-reference.css','vitrini-link-home-reference.css','hero-flower-interactive.css'];

const findHtml=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(item=>{
 const p=path.join(dir,item.name);
 if(item.isDirectory())return item.name==='.git'?[]:findHtml(p);
 return item.name.endsWith('.html')?[p]:[];
});

test('CSS cleanup removes only abandoned files while keeping all referenced stylesheets',()=>{
 const pages=findHtml(root);
 assert.equal(pages.length,20);
 const loaded=new Set();
 for(const p of pages){
  const source=fs.readFileSync(p,'utf8');
  const hrefs=[...source.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)].map(m=>m[1]);
  const local=hrefs.filter(x=>!/^https?:/i.test(x)).map(x=>path.resolve(path.dirname(p),x));
  assert.equal(new Set(local).size,local.length,'Duplicate link in '+p);
  for(const target of local){
   assert.ok(fs.existsSync(target),'Missing CSS '+target+' on '+p);
   loaded.add(target);
  }
 }
 for(const deadFile of dead)assert.equal(fs.existsSync(path.join(cssDir,deadFile)),false,deadFile);
 assert.equal(loaded.size,35);
});

test('CSS cleanup resolves every local @import and preserves the shared visual system',()=>{
 const css=fs.readdirSync(cssDir).filter(file=>file.endsWith('.css'));
 assert.equal(css.length,35);
 for(const file of css){
  const s=fs.readFileSync(path.join(cssDir,file),'utf8');
  for(const m of s.matchAll(/@import\s+(?:url\()?["']?(\.\/?[^"'\s\)]+\.css)["']?/g)){
   assert.ok(fs.existsSync(path.resolve(cssDir,m[1])),file+' imports '+m[1]);
  }
 }
 assert.match(fs.readFileSync(path.join(cssDir,'dayslume-components.css'),'utf8'),/@import url\(["']\.\/visual-system\.css["']\)/);
});

test('CSS cleanup does not disturb the approved cinematic hero or official palette',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.doesNotMatch(html,/href="assets\/css\/hero-flower-interactive\.css"/);
 assert.doesNotMatch(html,/hero--interactive-flower|class="flower-petal"/);
 for(const marker of ['id="cinema33-film"','data-cinema33-home','class="cinema-cluster"','class="cinema-browser"','class="cinema-phone"','class="cinema-service"'])assert.ok(html.includes(marker));
 const styles=[...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)].map(m=>m[1]);
 assert.equal(styles.length,20);
 assert.equal(styles.at(-1),'assets/css/brand-palette.css');
});
