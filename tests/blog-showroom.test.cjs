const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const page=fs.readFileSync(path.join(root,'blog.html'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/blog-showroom.css'),'utf8');
const js=fs.readFileSync(path.join(root,'assets/js/blog-showroom.js'),'utf8');

test('editorial hero offers a real feature and fits the digital reading architecture',()=>{
 assert.match(page,/class="blog-hero blog-hero--flagship"/);
 assert.match(page,/<h1 id="blog-title">Ideias para usar o digital com <em>intenção\.<\/em><\/h1>/);
 assert.match(page,/class="blog-hero-art blog-editorial-cover"/);
 assert.match(page,/href="blog\/presenca-digital-estrategica.html"/);
 assert.match(page,/class="dayslume-home-flower-art blog-cover-flower"/);
 assert.equal((page.match(/<h1\b/g)||[]).length,1);
 const styles=[...page.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(x=>x[1]);
 assert.equal(styles.at(-1),'assets/css/brand-palette.css');
 assert.match(page,/href="assets\/css\/blog-showroom.css"/);
});

test('all six real articles and existing search/filter system remain in place',()=>{
 assert.equal((page.match(/<article class="blog-story/g)||[]).length,6);
 for(const category of ['estrategia','design','tecnologia','bastidores']){
  assert.match(page,new RegExp('data-blog-route="'+category+'"'));
  assert.match(page,new RegExp('data-filter="'+category+'"'));
 }
 assert.match(page,/id="blog-query"/);
 assert.match(page,/id="blog-count"/);
 assert.match(page,/id="blog-empty"/);
 assert.match(page,/id="blog-reset"/);
 assert.match(page,/class="blog-directory blog-directory--flagship"/);
 const hrefs=[...page.matchAll(/href="(blog\/[^"]+\.html)"/g)].map(m=>m[1]);
 for(const href of hrefs)assert.ok(fs.existsSync(path.join(root,href)),href);
});

test('reading routes trigger existing filters and preserve motion/accessibility safeguards',()=>{
 assert.match(js,/\.dispatchEvent\(new Event\('input'/);
 assert.match(js,/filter\.click\(\)/);
 assert.match(js,/prefers-reduced-motion: reduce/);
 assert.match(js,/focus\(\{preventScroll:true\}\)/);
 assert.match(css,/@media\(max-width:800px\)/);
 assert.match(css,/@media\(max-width:610px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/\.blog-story\[hidden\]\{display:none!important\}/);
 assert.match(page,/src="assets\/js\/blog-showroom.js"/);
});