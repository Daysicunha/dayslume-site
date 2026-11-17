const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = p => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');
const palette = read('assets/css/brand-palette.css');
const institutional = read('assets/css/institucional.css');
const parity = read('assets/css/internal-home-parity.css');
const token = name => {
  const m = palette.match(new RegExp('--' + name + ':\\s*(#[0-9A-Fa-f]{6})\\s*;'));
  assert.ok(m, 'Missing hex token: ' + name);
  return m[1];
};
function luminance(hex) {
  const linear = hex.slice(1).match(/[a-f0-9]{2}/gi).map(h=>parseInt(h,16)/255)
    .map(x=>x <= .04045 ? x/12.92 : ((x+.055)/1.055)**2.4);
  return linear.reduce((sum,component,i)=>sum+component*[.2126,.7152,.0722][i],0);
}
const ratio=(a,b)=>{
  const x=luminance(a),y=luminance(b);
  return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
};
const semanticCss = [
  'assets/css/products-experience.css',
  'assets/css/projects-experience.css',
  'assets/css/about-experience.css',
  'assets/css/blog-showroom.css',
  'assets/css/internal-home-parity.css'
];
const corePages = [
  'index.html','servicos.html','solucoes.html','projetos.html',
  'blog.html','sobre.html','contato.html','central-de-ajuda.html',
  'processo.html','vitrini.html','vitrini-link.html',
  'sites-completos.html','landing-pages.html',
  'projetos/tornearia-barbosa.html',
  'blog/da-ideia-a-interface.html',
  'blog/depender-apenas-do-instagram-riscos.html',
  'blog/ia-negocios-com-criterio.html',
  'blog/presenca-digital-estrategica.html',
  'blog/site-bonito-precisa-funcionar.html',
  'blog/tecnologia-com-intencao.html'
];

test('PR16 audit: all 20 pages keep the single official palette as last CSS', () => {
  for(const filename of corePages) {
    const html = read(filename);
    const styles = [...html.matchAll(/href="([^"]+[.]css)"/g)].map(m=>m[1]);
    assert.ok(styles.length > 0,filename);
    assert.ok(styles.at(-1).endsWith('brand-palette.css'),filename);
  }
});

test('PR16 audit: headings are Manrope; body is DM Sans; legacy Montserrat is not loaded', () => {
  assert.match(institutional, /family=Manrope:wght@300;400;500;600;700/);
  assert.match(institutional, /family=DM\+Sans:wght@400;500;600;700/);
  assert.doesNotMatch(institutional, /Montserrat/);
  assert.doesNotMatch(parity, /@import[^;]*fonts\.googleapis/);
  assert.match(palette, /--ds-font-display:\s*"Manrope", sans-serif/);
  assert.match(palette, /--ds-font-body:\s*"DM Sans", "Manrope", sans-serif/);
  assert.match(palette, /body:not\(\.home-page\) :is\(h1, h2, h3\)/);
});

test('PR16 audit: six semantic palette colors are single source of truth', () => {
  const pairs = {
    'ink-deep':'#202532','plum-mineral':'#6B536D',
    'mist-blue':'#A9C5D8','warm-ivory':'#F3EFE8',
    'slate-mineral':'#66758F','peach':'#D8B6A5'
  };
  for(const [name,hex] of Object.entries(pairs)) {
    assert.equal(token(name).toLowerCase(),hex.toLowerCase());
  }
  for(const filename of semanticCss) {
    const css=read(filename);
    for(const hex of Object.values(pairs)) {
      assert.ok(!new RegExp(hex+'\\b','i').test(css),filename+' still hardcodes '+hex);
    }
  }
});

test('PR16 audit: standard type scale and minimum control target are defined', () => {
  for(const name of [
    'ds-type-display','ds-type-section','ds-type-card','ds-type-body',
    'ds-type-label','ds-type-control','ds-leading-heading',
    'ds-leading-body','ds-tracking-heading','ds-control-min-height'
  ]) {
    assert.ok(palette.includes('--'+name+':'),name);
  }
  assert.match(palette, /--ds-control-min-height:\s*44px/);
  for(const selector of [
    '.products-switch button','.products-tabs button',
    '.products-device-switch button','.projects-hero-selector button',
    '.about-decision-tabs button'
  ]) {
    assert.ok(palette.includes(selector),selector);
  }
  assert.match(palette, /:focus-visible\s*\{\s*outline:\s*3px solid var\(--ds-focus-on-dark\)/);
});

test('PR16 audit: standard muted copy on ivory meets WCAG AA text contrast', () => {
  const fg=token('ds-text-muted-on-light');
  const ivory=token('warm-ivory'),ink=token('ink-deep');
  assert.ok(ratio(fg,ivory) >= 4.5,'Muted body text must be at least 4.5:1 on ivory');
  assert.ok(ratio(ink,ivory) >= 4.5,'Ink on ivory must pass AA');
  assert.ok(ratio(token('plum-mineral'),ivory) >= 4.5,'Plum on ivory must pass AA');
  assert.ok(ratio(token('mist-blue'),ink) >= 4.5,'Mist on deep ink must pass AA');
  assert.match(palette, /--ds-text-muted-on-dark:/);
});
