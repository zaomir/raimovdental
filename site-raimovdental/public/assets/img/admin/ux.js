(()=>{'use strict';
const screen=document.getElementById('screen');
if(screen){
  const preferred=['#saveTransfer','#warmTransfer','#saveOutcome','#priceNext','#searchNext','#urgentFinish','#callbackFinish','.actions .primary','.actions .danger-btn','.actions button[type="submit"]'];
  function refresh(){
    screen.querySelectorAll('.ux-primary,.is-selected').forEach(el=>el.classList.remove('ux-primary','is-selected'));
    let target=null;
    for(const selector of preferred){target=screen.querySelector(selector);if(target&&!target.disabled)break;target=null}
    if(target)target.classList.add('ux-primary');
    screen.querySelectorAll('.option,.patient-result').forEach(button=>{
      button.addEventListener('focus',()=>button.classList.add('is-selected'),{once:true});
    });
  }
  const observer=new MutationObserver(refresh);
  observer.observe(screen,{childList:true,subtree:true});
  refresh();
}

const versionNode=document.querySelector('.render-version');
if(versionNode){
  fetch('/route-manifest.json',{cache:'no-store'})
    .then(response=>{if(!response.ok)throw new Error('manifest unavailable');return response.json()})
    .then(manifest=>{
      const date=new Date(manifest.generated_at);
      if(Number.isNaN(date.getTime()))throw new Error('invalid generated_at');
      const pad=value=>String(value).padStart(2,'0');
      const version=`v${date.getUTCFullYear()}.${pad(date.getUTCMonth()+1)}.${pad(date.getUTCDate())}-${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}`;
      versionNode.textContent=`Версия: ${version}`;
    })
    .catch(()=>{versionNode.textContent='Версия: локальная сборка'});
}
// Release validation: button-first doctor handoff with latest-procedure prefill.
})();
