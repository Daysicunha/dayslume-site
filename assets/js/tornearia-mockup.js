/* DAYSLUME / Tornearia Barbosa portfolio mockup. Preserve the original image until the approved asset is present. */
(()=>{
  "use strict";
  const init=()=>{
    const element=document.querySelector('.work-section img[data-approved-mockup]');
    if(!element)return;
    const desired=element.getAttribute('data-approved-mockup');
    if(!desired||!/^assets\/images\/[a-z0-9-]+\.(?:png|webp|jpe?g)$/i.test(desired))return;
    const preview=new Image();
    preview.decoding='async';
    preview.onload=()=>{
      if(!preview.naturalWidth||!preview.naturalHeight)return;
      const originalAlt=element.alt;
      element.addEventListener('error',()=>{
        element.src='assets/images/tornearia-barbosa-case.webp';
        element.alt=originalAlt;
        element.closest('.project-image')?.classList.remove('has-approved-mockup');
      },{once:true});
      element.width=preview.naturalWidth;
      element.height=preview.naturalHeight;
      element.src=desired;
      element.alt='Mockup editorial do site Tornearia Barbosa em notebook e celular, com a identidade industrial verde e preta';
      element.closest('.project-image')?.classList.add('has-approved-mockup');
    };
    preview.onerror=()=>{}; // The original case remains displayed if upload is pending.
    preview.src=desired;
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
