/* DAYSLUME — filtro de conteúdos e recursos discretos de leitura. Sem dependências. */
(()=>{'use strict';
const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim();
const directory=document.querySelector('.blog-index #blog-list');
if(directory){
 const cards=[...directory.querySelectorAll('.blog-story')],buttons=[...document.querySelectorAll('.blog-filter')],query=document.getElementById('blog-query'),count=document.getElementById('blog-count'),empty=document.getElementById('blog-empty'),reset=document.getElementById('blog-reset');
 let active='all';
 const update=()=>{const needle=fold(query?.value),visible=cards.reduce((n,card)=>{const on=(active==='all'||card.dataset.category===active)&&fold(card.dataset.search).includes(needle);card.hidden=!on;return n+Number(on)},0);if(count)count.textContent=visible===1?'1 artigo encontrado':visible+' artigos encontrados';if(empty)empty.hidden=visible!==0};
 buttons.forEach(button=>button.addEventListener('click',()=>{active=button.dataset.filter;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));update()}));
 query?.addEventListener('input',update);
 reset?.addEventListener('click',()=>{active='all';if(query)query.value='';buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='all')));update();query?.focus()});
 update();
}
const article=document.querySelector('.blog-article .article-body');
if(!article)return;
const progress=document.querySelector('.blog-read-progress span');
const updateProgress=()=>{if(!progress)return;const bounds=article.getBoundingClientRect();const available=Math.max(article.offsetHeight-innerHeight*.45,1);progress.style.width=(Math.max(0,Math.min(1,(-bounds.top+innerHeight*.25)/available))*100).toFixed(1)+'%'};
document.addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress,{passive:true});updateProgress();
const headings=[...article.querySelectorAll('h2')];
const side=document.querySelector('.blog-article .article-side');
if(side&&headings.length){const toc=document.createElement('nav');toc.className='blog-toc';toc.setAttribute('aria-label','Neste artigo');const heading=document.createElement('h3');heading.textContent='Neste artigo';const ol=document.createElement('ol');const used=new Set();headings.forEach((h,i)=>{let id=h.id||'secao-'+(i+1);while(used.has(id))id+='-2';used.add(id);h.id=id;const li=document.createElement('li'),a=document.createElement('a');a.href='#'+id;a.textContent=h.textContent;li.append(a);ol.append(li)});toc.append(heading,ol);side.append(toc)}
const meta=article.querySelector('.blog-read-meta');if(meta){const read=meta.querySelector('[data-reading-time]');if(read){const wordCount=article.textContent.trim().split(/\s+/).length;read.textContent=Math.max(1,Math.ceil(wordCount/210))+' min de leitura'}}
const share=article.querySelector('[data-share-link]'),feedback=article.querySelector('[data-share-feedback]');
share?.addEventListener('click',async()=>{const url=location.href;try{if(navigator.share){await navigator.share({title:document.title,url});if(feedback)feedback.textContent='Artigo compartilhado.';return}if(!navigator.clipboard)throw new Error('clipboard unavailable');await navigator.clipboard.writeText(url);if(feedback)feedback.textContent='Link copiado!';share.textContent='Link copiado ✓'}catch(err){if(err?.name==='AbortError')return;if(feedback)feedback.textContent='Não foi possível copiar automaticamente. Copie o endereço na barra do navegador.'}});
})();