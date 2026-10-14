/* DAYSLUME / Sobre — alternância de caminhos, sem dependências externas. */
(() => {
  'use strict';
  const root=document.querySelector('[data-about-decision]');
  if(!root)return;
  const tabs=[...root.querySelectorAll('[data-about-tab]')];
  const panels=[...root.querySelectorAll('[data-about-panel]')];
  const status=root.querySelector('[data-about-status]');
  const select=(tab,focus=false)=>{
    const value=tab.dataset.aboutTab;
    tabs.forEach(button=>{
      const active=button===tab;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-selected',String(active));
      button.tabIndex=active?0:-1;
    });
    panels.forEach(panel=>panel.hidden=panel.dataset.aboutPanel!==value);
    if(status) status.textContent=value==='custom'?'Projeto sob medida selecionado.':'Produto próprio selecionado.';
    if(focus)tab.focus();
  };
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>select(tab));
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowRight'||event.key==='ArrowDown')next=tabs[(index+1)%tabs.length];
      if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=tabs[(index-1+tabs.length)%tabs.length];
      if(event.key==='Home')next=tabs[0];
      if(event.key==='End')next=tabs[tabs.length-1];
      if(next){event.preventDefault();select(next,true);}
    });
  });
})();