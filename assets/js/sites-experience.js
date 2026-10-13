/* DAYSLUME — apresentação interativa de sites institucionais.
   UI ilustrativa, sem chamadas externas, rastreamento ou dados pessoais. */
(() => {
  'use strict';
  const root=document.querySelector('[data-sites-experience]');
  if(!root)return;
  const viewButtons=[...root.querySelectorAll('[data-site-view]')];
  const scenes=[...root.querySelectorAll('[data-site-scene]')];
  const deviceButtons=[...root.querySelectorAll('[data-site-device]')];
  const frame=root.querySelector('[data-site-frame]');
  const deviceGroup=root.querySelector('.sites-device-tools');
  const tabs=[...root.querySelectorAll('[data-site-tab]')];
  const panels=[...root.querySelectorAll('[data-site-panel]')];
  const status=root.querySelector('[data-sites-status]');
  if(viewButtons.length!==2 || scenes.length!==2 || !frame || !deviceGroup ||
     deviceButtons.length!==2 || tabs.length!==4 || panels.length!==4 || !status)return;
  let view='depois',device='desktop',tab='inicio';
  const update=()=>{
    for(const button of viewButtons){
      const active=button.dataset.siteView===view;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    }
    for(const scene of scenes)scene.hidden=scene.dataset.siteScene!==view;
    deviceGroup.hidden=view!=='depois';
    for(const button of deviceButtons){
      const active=button.dataset.siteDevice===device;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    }
    frame.dataset.device=device;
    for(const button of tabs){
      const active=button.dataset.siteTab===tab;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    }
    for(const panel of panels)panel.hidden=panel.dataset.sitePanel!==tab;
    const tabNames={inicio:'Início',servicos:'Serviços',sobre:'Sobre',contato:'Contato'};
    status.textContent=view==='antes' ?
      'Visualização: informações dispersas, exemplo ilustrativo.' :
      'Visualização: site profissional em '+(device==='mobile'?'celular':'computador')+
      ', seção '+tabNames[tab]+'.';
  };
  viewButtons.forEach(button=>button.addEventListener('click',()=>{
    view=button.dataset.siteView;
    update();
  }));
  deviceButtons.forEach(button=>button.addEventListener('click',()=>{
    device=button.dataset.siteDevice;
    view='depois';
    update();
  }));
  tabs.forEach(button=>button.addEventListener('click',()=>{
    tab=button.dataset.siteTab;
    view='depois';
    update();
  }));
  update();
})();