/* DAYSLUME / Conteúdos — atalhos editoriais ativam os filtros reais. */
(() => {
 'use strict';
 const directory=document.getElementById('explorar');
 if(!directory)return;
 const buttons=[...document.querySelectorAll('[data-blog-route]')];
 const field=document.getElementById('blog-query');
 const count=document.getElementById('blog-count');
 const available=new Set([...document.querySelectorAll('.blog-filter')].map(item=>item.dataset.filter));
 buttons.forEach(button=>{
   button.addEventListener('click',()=>{
     const category=button.dataset.blogRoute;
     if(!available.has(category))return;
     const filter=[...document.querySelectorAll('.blog-filter')].find(item=>item.dataset.filter===category);
     if(!filter)return;
     if(field){field.value='';field.dispatchEvent(new Event('input',{bubbles:true}));}
     filter.click();
     const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
     directory.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
     /* Focus the updated count after scrolling without a second navigation jump. */
     if(count){count.setAttribute('tabindex','-1');count.focus({preventScroll:true});}
   });
 });
})();