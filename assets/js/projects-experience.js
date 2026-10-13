/* DAYSLUME / Projetos — navegação pelos cases da hero; filtros gerais preservados. */
(() => {
  const root=document.querySelector('[data-projects-hero]');
  if(!root)return;
  const buttons=[...root.querySelectorAll('[data-project-preview]')];
  const panels=[...root.querySelectorAll('[data-project-panel]')];
  const live=root.querySelector('[data-projects-hero-status]');
  const activate=(selected,focus=false)=>{
    const value=selected.dataset.projectPreview;
    buttons.forEach(button=>{
      const active=button===selected;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-selected',String(active));
      button.tabIndex=active?0:-1;
    });
    panels.forEach(panel=>{panel.hidden=panel.dataset.projectPanel!==value;});
    if(live)live.textContent=(value==='tornearia'?'Tornearia Barbosa':'New Rocket Play')+' em destaque.';
    if(focus)selected.focus();
  };
  buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>activate(button));
    button.addEventListener('keydown',event=>{
      const {key}=event;let target=null;
      if(key==='ArrowRight'||key==='ArrowDown')target=buttons[(index+1)%buttons.length];
      if(key==='ArrowLeft'||key==='ArrowUp')target=buttons[(index+buttons.length-1)%buttons.length];
      if(key==='Home')target=buttons[0];
      if(key==='End')target=buttons[buttons.length-1];
      if(target){event.preventDefault();activate(target,true);}
    });
  });
})();