(()=>{'use strict';
  const video=document.querySelector('[data-hero-video]');
  if(!video)return;
  const reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData=!!(navigator.connection&&navigator.connection.saveData);
  const narrow=window.matchMedia&&matchMedia('(max-width: 760px)').matches;
  if(reduced||saveData||narrow)return;
  const source=video.querySelector('source[data-src]');
  if(!source)return;
  const load=()=>{
    if(source.src)return;
    source.src=source.dataset.src;
    video.load();
    const p=video.play();
    if(p&&typeof p.catch==='function')p.catch(()=>{});
  };
  const reveal=()=>video.classList.add('is-ready');
  video.addEventListener('canplay',reveal,{once:true});
  if('requestIdleCallback'in window){
    requestIdleCallback(load,{timeout:1600});
  }else{
    window.addEventListener('load',()=>setTimeout(load,180),{once:true});
  }
})();