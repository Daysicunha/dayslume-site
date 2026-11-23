const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const studio = read('assets/css/studio-page-20261123.css');
const palette = read('assets/css/brand-palette.css');
const html = read('studio-criativo.html');
const geometry = studio.split('Studio card layout: a composed premium')[1] || '';
const color = palette.split('STUDIO 3.4 · physical-glass refinement')[1] || '';

test('studio: resolve low contrast originally caused by global em selector',()=>{
  assert.ok(studio.includes('body.studio-page #conteudo :is(.studio-intro,.studio-services,.studio-process,.studio-faq) em {color:#6B536D;}'));
  assert.ok(!studio.includes('body.studio-page #conteudo em {font-style:normal;color:#6B536D;}'));
  for (const term of [
    '.studio-hero h1 em',
    '.studio-bridge h2 em',
    '.studio-service-card:nth-child(3) h3 em',
    '-webkit-text-fill-color:#FFE1D4',
    '-webkit-text-fill-color:#F6D6CC',
    '.studio-service-card:nth-child(3) p'
  ]) assert.ok(color.includes(term), term);
});

test('studio: premium physical glass edge, neon accent and readable text',()=>{
  for(const term of [
    'border-width:1px 1px 4px',
    '.studio-service-card:nth-child(even)',
    'translateY(20px)',
    'overflow:hidden',
    'text-wrap:balance',
    '@media (max-width:760px)',
    'transform:none'
  ]) assert.ok(geometry.includes(term),term);
  for(const term of [
    '.studio-service-card::before',
    '.studio-service-card .studio-card-icon',
    '#202532','#FFE1D4','#F1E6EA',
    'var(--ds-neon-pink-rgb)',
    'inset 1px 1px 0'
  ]) assert.ok(color.includes(term),term);
  assert.equal((html.match(/class="studio-service-card"/g)||[]).length,4);
  assert.ok(html.includes('studio-scene-card--front'));
  assert.ok(html.includes('studio-scene-card--side'));
});

test('studio: preserve 3d hero geometry and responsive reduced-motion behavior',()=>{
  assert.ok(geometry.includes('.studio-hero__scene'));
  assert.ok(geometry.includes('width:calc(100% - 30px)'));
  assert.ok(geometry.includes('@media (prefers-reduced-motion:reduce)'));
  assert.ok(color.includes('@media (hover:none)'));
  assert.equal((studio.match(/\{/g)||[]).length,(studio.match(/\}/g)||[]).length);
  assert.equal((palette.match(/\{/g)||[]).length,(palette.match(/\}/g)||[]).length);
});
