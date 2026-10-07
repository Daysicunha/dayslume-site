const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function filesIn(dir, extension) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '.git' ? [] : filesIn(target, extension);
    return entry.name.endsWith(extension) ? [target] : [];
  });
}

const pages = filesIn(root, '.html');
const sources = new Map(pages.map((page) => [page, fs.readFileSync(page, 'utf8')]));

test('all HTML pages have valid metadata, landmarks and local references', () => {
  const errors = [];
  const requiredMetadata = ['description', 'theme-color', 'robots', 'og:title', 'og:description', 'og:type', 'og:locale', 'og:url'];

  for (const [page, source] of sources) {
    const label = path.relative(root, page);
    const h1Count = (source.match(/<h1\b/gi) || []).length;
    if (h1Count !== 1) errors.push(`${label}: expected one h1, found ${h1Count}`);

    for (const key of requiredMetadata) {
      const escaped = key.replace(':', '\\:');
      const pattern = new RegExp(`<meta\\s+(?:name|property)=["']${escaped}["']`, 'gi');
      const count = (source.match(pattern) || []).length;
      if (count !== 1) errors.push(`${label}: metadata ${key} count is ${count}`);
    }

    const canonicals = [...source.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/gi)];
    if (canonicals.length !== 1) errors.push(`${label}: canonical count is ${canonicals.length}`);
    const ogUrl = source.match(/<meta\b[^>]*property=["']og:url["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1];
    if (canonicals.length === 1 && ogUrl && canonicals[0][1] !== ogUrl) {
      errors.push(`${label}: canonical and og:url differ`);
    }

    const ids = [...source.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    for (const id of new Set(duplicateIds)) errors.push(`${label}: duplicate id ${id}`);

    for (const match of source.matchAll(/<img\b[^>]*>/gi)) {
      if (!/\salt=["'][^"']*["']/i.test(match[0])) errors.push(`${label}: image without alt`);
    }

    for (const match of source.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)) {
      if (!/\srel=["'][^"']*noopener/i.test(match[0])) errors.push(`${label}: external tab without noopener`);
    }

    for (const match of source.matchAll(/\s(?:href|src)=["']([^"']+)["']/gi)) {
      const reference = match[1];
      if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue;
      const [pathname, fragment] = reference.split('#');
      const target = pathname ? path.resolve(path.dirname(page), decodeURIComponent(pathname)) : page;
      if (!fs.existsSync(target)) {
        errors.push(`${label}: missing ${reference}`);
        continue;
      }
      if (fragment && sources.has(target)) {
        const targetSource = sources.get(target);
        const anchor = decodeURIComponent(fragment).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!new RegExp(`\\sid=["']${anchor}["']`, 'i').test(targetSource)) errors.push(`${label}: missing anchor ${reference}`);
      }
    }
  }

  assert.deepEqual(errors, []);
});

test('sitemap contains only existing pages and matches their canonical URLs', () => {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const errors = [];

  if (new Set(locations).size !== locations.length) errors.push('sitemap: duplicate URLs');

  const sitemapUrls = new Set(locations);
  for (const [page, source] of sources) {
    const canonical = source.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];
    if (canonical && !sitemapUrls.has(canonical)) {
      errors.push(`${path.relative(root, page)}: canonical missing from sitemap`);
    }
  }

  for (const location of locations) {
    const url = new URL(location);
    const relative = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
    const target = path.join(root, relative);
    if (!fs.existsSync(target) || !sources.has(target)) {
      errors.push(`sitemap: missing page ${location}`);
      continue;
    }
    const canonical = sources.get(target).match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];
    if (canonical !== location) errors.push(`${relative}: canonical does not match sitemap`);
  }

  assert.deepEqual(errors, []);
});

test('every page loads the official palette last and uses the deep-ink browser theme', () => {
  const errors = [];

  for (const [page, source] of sources) {
    const label = path.relative(root, page);
    const stylesheets = [...source.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)]
      .map((match) => match[1]);
    const paletteLinks = stylesheets.filter((href) => /(?:^|\/)brand-palette\.css$/i.test(href));

    if (paletteLinks.length !== 1) errors.push(`${label}: official palette link count is ${paletteLinks.length}`);
    if (!/(?:^|\/)brand-palette\.css$/i.test(stylesheets.at(-1) || '')) {
      errors.push(`${label}: official palette is not the final stylesheet`);
    }
    if (!/<meta\s+name=["']theme-color["']\s+content=["']#202532["']/i.test(source)) {
      errors.push(`${label}: theme-color is not #202532`);
    }
  }

  assert.deepEqual(errors, []);
});

test('official brand tokens and primary text pairs keep accessible contrast', () => {
  const palette = fs.readFileSync(path.join(root, 'assets', 'css', 'brand-palette.css'), 'utf8');
  const expected = {
    'ink-deep': '#202532',
    'plum-mineral': '#6B536D',
    'mist-blue': '#A9C5D8',
    'warm-ivory': '#F3EFE8',
    'slate-mineral': '#66758F',
    peach: '#D8B6A5',
  };
  const tokens = Object.fromEntries(
    [...palette.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((match) => [match[1], match[2]])
  );
  assert.deepEqual(Object.fromEntries(Object.keys(expected).map((key) => [key, tokens[key]])), expected);

  const luminance = (hex) => {
    const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255)
      .map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrast = (left, right) => {
    const values = [luminance(left), luminance(right)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  };

  for (const [foreground, background] of [
    ['ink-deep', 'warm-ivory'],
    ['plum-mineral', 'warm-ivory'],
    ['mist-blue', 'ink-deep'],
    ['peach', 'ink-deep'],
  ]) {
    assert.ok(contrast(expected[foreground], expected[background]) >= 4.5, `${foreground} on ${background}`);
  }
});

test('home hero uses the six official independent petals with motion safeguards', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const heroCss = fs.readFileSync(path.join(root, 'assets', 'css', 'hero-flower-interactive.css'), 'utf8');
  const heroJs = fs.readFileSync(path.join(root, 'assets', 'js', 'hero-flower.js'), 'utf8');
  const petals = [...home.matchAll(/<img\b[^>]*data-flower-petal[^>]*src=["']([^"']+)["'][^>]*>/gi)];

  assert.equal(petals.length, 6);
  assert.deepEqual(
    petals.map((match) => path.basename(match[1])).sort(),
    ['petal-01.png', 'petal-02.png', 'petal-03.png', 'petal-04.png', 'petal-05.png', 'petal-06.png']
  );
  assert.doesNotMatch(home, /class=["']hero-background-image["']/i);
  assert.match(heroJs, /requestAnimationFrame/);
  assert.match(heroJs, /translate3d\(/);
  assert.match(heroJs, /prefers-reduced-motion:\s*reduce/);
  assert.match(heroCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(heroCss, /@media\s*\(max-width:\s*800px\)/);
});

test('home static content is not exposed as a fake control or viewport-height section', () => {
  const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const rhythm = fs.readFileSync(path.join(root, 'assets', 'css', 'home-section-rhythm.css'), 'utf8');

  assert.doesNotMatch(home, /<button\b[^>]*class=["'][^"']*manifest-item/i);
  assert.doesNotMatch(home, /<li\b[^>]*tabindex=/i);
  assert.doesNotMatch(rhythm, /min-(?:block-size|height)\s*:[^;]*(?:svh|vh)/i);
});
