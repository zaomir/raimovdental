(()=>{'use strict';
const screen=document.getElementById('screen');
if(!screen)return;

const stepOrder=['dtProcedure','dtDatePreset','dtDoctor','dtWhat','dtStarted','dtWorse','dtPain','dtTemp','dtSwelling','dtBleeding','dtBreathing','dtPhoto','dtContact'];
const labels={
  dtProcedure:'После какой процедуры возник вопрос?',
  dtDatePreset:'Когда была процедура?',
  dtDoctor:'Кто лечащий врач?',
  dtWhat:'Что именно произошло?',
  dtStarted:'Когда начались симптомы?',
  dtWorse:'Симптомы усиливаются?',
  dtPain:'Насколько сильная боль?',
  dtTemp:'Какая температура?',
  dtSwelling:'Есть ли отёк?',
  dtBleeding:'Есть ли кровотечение?',
  dtBreathing:'Есть ли затруднение дыхания или глотания?',
  dtPhoto:'Получено ли фото?',
  dtContact:'Как удобнее связаться?'
};
const extras={
  dtProcedure:'customProcedureWrap',
  dtDatePreset:'exactDateWrap',
  dtWhat:'customWhatWrap',
  dtTemp:'tempValueWrap',
  dtContact:'otherPhoneWrap'
};
const manualValues={
  dtProcedure:new Set(['Другое']),
  dtWhat:new Set(['Другое']),
  dtTemp:new Set(['Указать значение']),
  dtContact:new Set(['Другой номер'])
};

const get=id=>document.getElementById(id);
const value=id=>String(get(id)?.value||'').trim();

function answerFor(id){
  const base=value(id);
  if(id==='dtProcedure'&&base==='Другое')return value('dtProcedureOther');
  if(id==='dtDatePreset')return value('dtExactDate')||base;
  if(id==='dtWhat'&&base==='Другое')return value('dtWhatOther');
  if(id==='dtTemp'&&base==='Указать значение')return value('dtTempValue')?`${value('dtTempValue')} °C`:'';
  if(id==='dtContact'&&base==='Другой номер')return value('dtOtherPhone')?`Другой номер: ${value('dtOtherPhone')}`:'';
  return base;
}

function isValid(id){return Boolean(answerFor(id));}
function needsManualConfirmation(id){return manualValues[id]?.has(value(id))||false;}

function refreshStep(group,id){
  const answer=answerFor(id);
  const summary=group.querySelector('.handoff-step-summary');
  const next=group.querySelector('.handoff-next');
  if(summary)summary.textContent=answer||'Ответ не выбран';
  if(next){
    next.disabled=!isValid(id);
    next.classList.toggle('hidden',!needsManualConfirmation(id));
  }
  group.classList.toggle('has-answer',Boolean(answer));
  if(!answer)group.classList.remove('is-complete');
}

function markComplete(group,id){
  refreshStep(group,id);
  if(isValid(id))group.classList.add('is-complete');
}

function advanceFrom(group,id,index){
  if(!isValid(id))return;
  markComplete(group,id);
  window.setTimeout(()=>{
    if(index<stepOrder.length-1)activate(index+1);
    else showReview();
  },180);
}

function buildStep(group,index){
  const id=group.dataset.group;
  group.classList.add('handoff-step');
  group.dataset.stepIndex=String(index);

  const body=document.createElement('div');
  body.className='handoff-step-body';
  [...group.childNodes].forEach(node=>body.appendChild(node));
  body.querySelector(':scope > .field-label')?.classList.add('handoff-original-label');

  const extraId=extras[id];
  const extra=extraId?get(extraId):null;
  if(extra)body.appendChild(extra);

  const header=document.createElement('button');
  header.type='button';
  header.className='handoff-step-header';
  header.setAttribute('aria-expanded','false');
  header.innerHTML=`<span class="handoff-step-number">${index+1}</span><span class="handoff-step-copy"><strong>${labels[id]||id}</strong><small>Обязательный вопрос</small></span><span class="handoff-step-summary"></span><span class="handoff-step-chevron" aria-hidden="true">⌄</span>`;

  const nav=document.createElement('div');
  nav.className='handoff-step-nav actions';
  const back=document.createElement('button');
  back.type='button';
  back.className='secondary handoff-back';
  back.textContent='Назад';
  back.disabled=index===0;
  const next=document.createElement('button');
  next.type='button';
  next.className='primary handoff-next hidden';
  next.textContent=index===stepOrder.length-1?'Завершить опрос':'Продолжить';
  nav.append(back,next);
  body.appendChild(nav);

  group.append(header,body);

  header.addEventListener('click',()=>{
    if(group.classList.contains('is-complete')||group.classList.contains('is-active'))activate(index);
  });
  back.addEventListener('click',()=>activate(Math.max(0,index-1)));
  next.addEventListener('click',()=>advanceFrom(group,id,index));
  body.querySelectorAll('input').forEach(input=>input.addEventListener('input',()=>refreshStep(group,id)));
  refreshStep(group,id);
}

function updateProgress(index,review=false){
  const progress=screen.querySelector('.handoff-progress');
  if(!progress)return;
  const current=review?stepOrder.length:index+1;
  progress.querySelector('.handoff-progress-text').textContent=review?'Все обязательные вопросы заполнены':`Вопрос ${current} из ${stepOrder.length}`;
  progress.querySelector('.handoff-progress-fill').style.width=`${Math.round((current/stepOrder.length)*100)}%`;
}

function activate(index){
  const steps=[...screen.querySelectorAll('.handoff-step')];
  if(!steps[index])return;
  screen.querySelector('.handoff-review-step')?.classList.add('hidden');
  steps.forEach((step,i)=>{
    const active=i===index;
    step.classList.toggle('is-active',active);
    step.querySelector('.handoff-step-header')?.setAttribute('aria-expanded',String(active));
  });
  updateProgress(index,false);
  steps[index].scrollIntoView({behavior:'smooth',block:'start'});
}

function showReview(){
  const steps=[...screen.querySelectorAll('.handoff-step')];
  steps.forEach(step=>{
    step.classList.remove('is-active');
    step.classList.add('is-complete');
    step.querySelector('.handoff-step-header')?.setAttribute('aria-expanded','false');
  });
  const review=screen.querySelector('.handoff-review-step');
  if(review){
    review.classList.remove('hidden');
    review.scrollIntoView({behavior:'smooth',block:'center'});
  }
  updateProgress(stepOrder.length-1,true);
}

function initialise(){
  if(screen.dataset.handoffAccordionReady==='true')return;
  const continueButton=get('dtContinue');
  const groups=stepOrder.map(id=>screen.querySelector(`.choice-group[data-group="${id}"]`));
  if(!continueButton||groups.some(group=>!group))return;
  screen.dataset.handoffAccordionReady='true';

  const progress=document.createElement('div');
  progress.className='handoff-progress';
  progress.innerHTML='<div class="handoff-progress-top"><strong class="handoff-progress-text"></strong><span>Выберите ответ — следующий вопрос откроется автоматически</span></div><div class="handoff-progress-track"><span class="handoff-progress-fill"></span></div>';
  groups[0].before(progress);

  groups.forEach((group,index)=>buildStep(group,index));

  const originalActions=continueButton.closest('.actions');
  const review=document.createElement('section');
  review.className='handoff-review-step hidden';
  review.innerHTML='<div class="alert success"><strong>Карточка заполнена</strong><br>Все обязательные ответы собраны. Нажмите на любую плашку выше, чтобы проверить или изменить ответ.</div>';
  const nav=document.createElement('div');
  nav.className='actions';
  const back=document.createElement('button');
  back.type='button';
  back.className='secondary';
  back.textContent='Назад';
  back.addEventListener('click',()=>activate(stepOrder.length-1));
  nav.append(back,continueButton);
  review.appendChild(nav);
  groups[groups.length-1].after(review);
  if(originalActions&&originalActions!==nav)originalActions.remove();

  groups.forEach((group,index)=>{
    const id=stepOrder[index];
    if(isValid(id))markComplete(group,id);
  });
  const firstUnanswered=stepOrder.findIndex(id=>!isValid(id));
  if(firstUnanswered===-1)showReview();
  else activate(firstUnanswered);
}

document.addEventListener('handoff-choice',event=>{
  const id=event.detail?.id;
  if(!stepOrder.includes(id))return;
  queueMicrotask(()=>{
    const group=screen.querySelector(`.handoff-step[data-group="${id}"]`);
    if(!group)return;
    refreshStep(group,id);
    const index=Number(group.dataset.stepIndex);
    if(!needsManualConfirmation(id))advanceFrom(group,id,index);
  });
});

const observer=new MutationObserver(()=>{
  if(!screen.querySelector('#dtContinue'))delete screen.dataset.handoffAccordionReady;
  initialise();
});
observer.observe(screen,{childList:true,subtree:true});
initialise();
})();