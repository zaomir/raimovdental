(()=>{'use strict';
const $=id=>document.getElementById(id);
const KEY='expert-dental-contact-journal-v2';
const HANDOFF='expert-dental-handoff-v2';
const PRIORITY_KEY='expert-dental-call-priority-v1';
const doctors=[
 {name:'Атабек Саидович',ext:'101',available:true,role:'Профильный врач'},
 {name:'Доктор Нурбеков',ext:'104',available:true,role:'Врач срочной группы'},
 {name:'Доктор Абдыкадырова',ext:'107',available:false,role:'Профильный врач'},
 {name:'Дежурный врач',ext:'109',available:true,role:'Дежурный врач'}
];
const latest={
 'Мария Ивановна':{procedure:'Удаление зуба мудрости',date:'Вчера',time:'16:30',doctor:'Доктор Нурбеков'},
 'Айбек Нурланович':{procedure:'Консультация имплантолога',date:'28 июля 2026',time:'',doctor:'Атабек Саидович'},
 'Елена Сергеевна':{procedure:'Коррекция брекет-системы',date:'20 июля 2026',time:'',doctor:'Доктор Абдыкадырова'}
};
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let data={};
function toast(t){const e=$('toast');if(!e)return;e.textContent=t;e.classList.remove('hidden');setTimeout(()=>e.classList.add('hidden'),1700)}
function currentPatient(){const h=document.querySelector('#patientContext h3')?.textContent||'Новый пациент';const p=document.querySelector('#patientContext p')?.textContent||'+996 ';return{name:h,phone:p}}
function selectedPriority(){return sessionStorage.getItem(PRIORITY_KEY)||'routine'}
function routeLevel(){
 const breathing=/Затруднено/.test(data.breathing||'');
 const uncontrolledBleeding=data.bleeding==='Не уменьшается';
 const severeSwelling=data.swelling==='Выраженный';
 if(breathing||uncontrolledBleeding||severeSwelling)return'emergency';
 const urgentSignal=selectedPriority()==='urgent'||data.bleeding==='Продолжается'||data.swelling==='Есть, увеличивается'||data.temp==='Повышена'||/^7–10/.test(data.pain||'');
 return urgentSignal?'urgent':'routine';
}
function buttonGroup(id,label,values,selected=''){return `<div class="form-group wide choice-group" data-group="${id}"><label class="field-label">${label}</label><div class="options compact-options">${values.map(v=>`<button type="button" class="option choice-button ${v===selected?'is-selected':''}" data-choice="${id}" data-value="${esc(v)}"><strong>${esc(v)}</strong></button>`).join('')}</div><input type="hidden" id="${id}" value="${esc(selected)}"></div>`}
function bindChoices(){document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{const id=b.dataset.choice;document.querySelectorAll(`[data-choice="${id}"]`).forEach(x=>x.classList.remove('is-selected'));b.classList.add('is-selected');$(id).value=b.dataset.value;document.dispatchEvent(new CustomEvent('handoff-choice',{detail:{id,value:b.dataset.value}}))})}
function showCard(){const p=currentPatient(),last=latest[p.name];data={patient:p.name,phone:p.phone};$('screenTitle').textContent='Карточка передачи врачу';$('screen').innerHTML=`<div class="script"><div class="script-label">Что говорит администратор</div><p class="script-text">Чтобы врач сразу получил полную картину, я задам несколько коротких вопросов. Повторять весь рассказ врачу не потребуется.</p></div>
${last?`<div class="alert info"><strong>Последняя процедура пациента</strong><br>${esc(last.procedure)} · ${esc(last.date)}${last.time?' · '+esc(last.time):''} · ${esc(last.doctor)}</div><div class="actions"><button id="useLatest" class="primary">Да, вопрос после этой процедуры</button><button id="otherProcedure" class="secondary">Нет, другая процедура</button></div>`:`<div class="alert info">Пациент не найден в демо-истории. Выберите процедуру вручную.</div><div class="actions"><button id="otherProcedure" class="primary">Выбрать процедуру</button></div>`}`;
if(last)$('useLatest').onclick=()=>showQuestionnaire({...data,...last,fromLatest:true});$('otherProcedure').onclick=()=>showQuestionnaire(data)}
function showQuestionnaire(seed){data={...seed};const procedures=['Удаление','Имплантация','Лечение каналов','Пломба','Коронка','Брекеты','Детское лечение','Другое'];const events=['Боль','Отёк','Кровотечение','Выпала пломба','Слетела коронка','Повреждение брекетов','Дискомфорт','Другое'];$('screenTitle').textContent='Карточка передачи врачу';$('screen').innerHTML=`
<div class="alert ${data.fromLatest?'success':'info'}"><strong>${esc(data.patient)}</strong> · ${esc(data.phone)}${data.fromLatest?'<br>Последняя процедура подставлена автоматически.':''}</div>
${buttonGroup('dtProcedure','После какой процедуры возник вопрос *',procedures,data.procedure||'')}
<div id="customProcedureWrap" class="form-group wide hidden"><label class="field-label">Другая процедура</label><input id="dtProcedureOther" class="input" placeholder="Короткое название процедуры"></div>
${buttonGroup('dtDatePreset','Когда была процедура *',['Сегодня','Вчера','На этой неделе','Ранее','Неизвестно'],data.date||'')}
<div id="exactDateWrap" class="form-group wide ${data.date&&['Сегодня','Вчера'].includes(data.date)?'hidden':''}"><label class="field-label">Точная дата, если известна</label><input id="dtExactDate" class="input" type="date"></div>
${buttonGroup('dtDoctor','Лечащий врач *',doctors.filter(d=>d.name!=='Дежурный врач').map(d=>d.name),data.doctor||'')}
${buttonGroup('dtWhat','Что именно произошло *',events)}
<div id="customWhatWrap" class="form-group wide hidden"><label class="field-label">Короткое уточнение</label><input id="dtWhatOther" class="input" placeholder="Что произошло"></div>
${buttonGroup('dtStarted','Когда начались симптомы *',['Сразу после процедуры','В тот же день','На следующий день','Сегодня','Несколько дней назад','Неизвестно'])}
${buttonGroup('dtWorse','Симптомы усиливаются? *',['Да','Нет','Трудно сказать','Неизвестно'])}
${buttonGroup('dtPain','Боль 0–10 *',['0 — нет боли','1–3 — слабая','4–6 — средняя','7–10 — сильная','Не может оценить'])}
${buttonGroup('dtTemp','Температура *',['Нормальная со слов пациента','Повышена','Не измерял(а)','Неизвестно','Указать значение'])}
<div id="tempValueWrap" class="form-group wide hidden"><label class="field-label">Значение температуры</label><input id="dtTempValue" class="input" type="number" min="34" max="43" step="0.1" placeholder="37.8"></div>
${buttonGroup('dtSwelling','Отёк *',['Нет','Небольшой','Есть, не растёт','Есть, увеличивается','Выраженный','Неизвестно'])}
${buttonGroup('dtBleeding','Кровотечение *',['Нет','Следы','Незначительное','Продолжается','Не уменьшается','Неизвестно'])}
${buttonGroup('dtBreathing','Дыхание и глотание *',['Не затруднены','Затруднено дыхание','Затруднено глотание','Затруднены оба','Неизвестно'])}
${buttonGroup('dtPhoto','Фото',['Не требуется','Попросили прислать','Получено с согласия','Пациент не может отправить'])}
${buttonGroup('dtContact','Удобный способ связи *',['Текущий звонок','Обратный звонок','WhatsApp','Другой номер'])}
<div id="otherPhoneWrap" class="form-group wide hidden"><label class="field-label">Другой номер</label><input id="dtOtherPhone" class="input" value="+996 "></div>
<div class="actions"><button id="dtContinue" class="primary">Продолжить передачу</button></div>`;
bindChoices();
if(data.fromLatest){$('dtProcedure').value=data.procedure;$('dtDatePreset').value=data.date;$('dtDoctor').value=data.doctor}
document.addEventListener('handoff-choice',choiceVisibility,{once:false});$('dtContinue').onclick=saveCard}
function choiceVisibility(e){const {id,value}=e.detail;if(id==='dtProcedure')$('customProcedureWrap').classList.toggle('hidden',value!=='Другое');if(id==='dtWhat')$('customWhatWrap').classList.toggle('hidden',value!=='Другое');if(id==='dtTemp')$('tempValueWrap').classList.toggle('hidden',value!=='Указать значение');if(id==='dtContact')$('otherPhoneWrap').classList.toggle('hidden',value!=='Другой номер');if(id==='dtDatePreset')$('exactDateWrap').classList.toggle('hidden',['Сегодня','Вчера','Неизвестно'].includes(value))}
function value(id){return $(id)?.value?.trim()||''}
function saveCard(){const required=['dtProcedure','dtDatePreset','dtDoctor','dtWhat','dtStarted','dtWorse','dtPain','dtTemp','dtSwelling','dtBleeding','dtBreathing','dtContact'];if(required.some(id=>!value(id)))return toast('Ответьте на все обязательные вопросы');if(value('dtProcedure')==='Другое'&&!value('dtProcedureOther'))return toast('Укажите процедуру');if(value('dtWhat')==='Другое'&&!value('dtWhatOther'))return toast('Уточните, что произошло');if(value('dtTemp')==='Указать значение'&&!value('dtTempValue'))return toast('Укажите температуру');data={...data,procedure:value('dtProcedure')==='Другое'?value('dtProcedureOther'):value('dtProcedure'),date:value('dtExactDate')||value('dtDatePreset'),doctor:value('dtDoctor'),what:value('dtWhat')==='Другое'?value('dtWhatOther'):value('dtWhat'),started:value('dtStarted'),worse:value('dtWorse'),pain:value('dtPain'),temp:value('dtTemp')==='Указать значение'?value('dtTempValue')+' °C':value('dtTemp'),swelling:value('dtSwelling'),bleeding:value('dtBleeding'),breathing:value('dtBreathing'),photo:value('dtPhoto')||'Не требуется',contact:value('dtContact'),phone:value('dtContact')==='Другой номер'?value('dtOtherPhone'):data.phone};showChoice()}
function routeButton(id,title,description,doctor,className='option'){return `<button class="${className}" id="${id}"><strong>${esc(title)}</strong><span>${esc(description)}</span></button>`}
function showChoice(){
 const level=routeLevel();
 const treating=doctors.find(x=>x.name===data.doctor);
 const free=doctors.find(x=>x.available&&x.name!=='Дежурный врач'&&x.name!==data.doctor);
 const duty=doctors.find(x=>x.name==='Дежурный врач'&&x.available);
 $('screenTitle').textContent=level==='emergency'?'Экстренная медицинская маршрутизация':level==='urgent'?'Срочная передача врачу':'Обычная передача врачу';
 if(level==='emergency'){
  $('screen').innerHTML=`<div class="script"><div class="script-label">Что говорит администратор</div><p class="script-text">По описанным признакам обращение нельзя оставлять в обычной очереди. Я фиксирую экстренный маршрут. Пожалуйста, действуйте по инструкции экстренной помощи и не оставайтесь без связи.</p></div><div class="alert danger"><strong>Экстренный маршрут.</strong> Затруднение дыхания или глотания, сильное неостанавливающееся кровотечение либо тяжёлый отёк требуют немедленной медицинской помощи по локальному регламенту клиники.</div><div class="actions"><button id="dtEmergency" class="danger-btn">Зафиксировать экстренный маршрут</button>${duty?'<button id="dtNotifyDuty" class="secondary">Параллельно уведомить дежурного</button>':''}</div>`;
  $('dtEmergency').onclick=()=>save('Экстренная медицинская маршрутизация','Администратор смены','Сейчас','Пациент направлен за немедленной экстренной медицинской помощью по локальному регламенту');
  if($('dtNotifyDuty'))$('dtNotifyDuty').onclick=()=>{toast('Дежурный врач уведомлён');$('dtNotifyDuty').disabled=true};
  return;
 }
 const urgent=level==='urgent';
 const intro=urgent?'Спасибо, я всё зафиксировала как срочное обращение. Сейчас проверю, кто из врачей может принять звонок немедленно.':'Спасибо, я всё зафиксировала. Сейчас проверю, могу ли сразу соединить вас с лечащим или другим доступным врачом.';
 const buttons=[];
 if(treating?.available)buttons.push(routeButton('dtTreating',urgent?'Перевести звонок лечащему врачу сейчас':'Перевести звонок лечащему врачу',`${treating.name} · внутренний ${treating.ext}`,treating));
 if(free)buttons.push(routeButton('dtFree',urgent?'Перевести свободному врачу срочной группы':'Перевести другому доступному врачу',`${free.name} · ${free.role} · внутренний ${free.ext}`,free));
 if(urgent&&duty)buttons.push(routeButton('dtDuty','Перевести дежурному врачу',`${duty.name} · внутренний ${duty.ext}`,duty));
 buttons.push(routeButton('dtCallback','Создать контролируемый обратный звонок',urgent?'Резервный маршрут: не позднее 15 минут':'Согласовать срок и сохранить задачу врачу',treating||free));
 $('screen').innerHTML=`<div class="script"><div class="script-label">Что говорит администратор</div><p class="script-text">${esc(intro)}</p></div><div class="alert ${urgent?'danger':'info'}"><strong>${urgent?'Срочный':'Обычный'} маршрут.</strong> Обращение считается переданным только после принятия врачом или создания задачи с владельцем и сроком.</div><div class="options">${buttons.join('')}</div>`;
 if($('dtTreating'))$('dtTreating').onclick=()=>showLive(treating,urgent?'Срочный · лечащий врач':'Обычный · лечащий врач');
 if($('dtFree'))$('dtFree').onclick=()=>showLive(free,urgent?'Срочный · свободный врач':'Обычный · другой доступный врач');
 if($('dtDuty'))$('dtDuty').onclick=()=>showLive(duty,'Срочный · дежурный врач');
 $('dtCallback').onclick=()=>showCallback(treating||free||duty,urgent);
}
function showLive(d,route){$('screenTitle').textContent='Перевод на внутренний номер';$('screen').innerHTML=`<div class="script"><div class="script-label">Что говорит администратор</div><p class="script-text">Сейчас я соединю вас с ${esc(d.name)}. Пожалуйста, оставайтесь на линии. Если соединение прервётся, мы перезвоним вам по номеру ${esc(data.phone)}.</p></div><div class="alert success"><strong>1.</strong> Поставить пациента на удержание.<br><strong>2.</strong> Набрать внутренний номер ${d.ext}. Опросник уже передан на экран врача.<br><strong>3.</strong> Получить подтверждение врача «Принимаю».<br><strong>4.</strong> Соединить линии.</div><div class="actions"><button id="dtLiveDone" class="primary">Врач принял обращение — перевод выполнен</button></div>`;$('dtLiveDone').onclick=()=>save('Переведён на внутренний номер врача',d.name,'Сейчас',`${route}. Врач принял обращение и консультирует пациента по текущему звонку`)}
function showCallback(target,urgent){const windows=urgent?['В течение 15 минут','В течение 30 минут']:['В течение 30 минут','В течение часа','Сегодня до конца смены'];$('screenTitle').textContent=urgent?'Срочный обратный звонок врача':'Обратный звонок врача';$('screen').innerHTML=`<div class="script"><div class="script-label">Что говорит администратор</div><p class="script-text">Врач сейчас не может принять звонок. Я передам ему полную информацию, зафиксирую конкретный срок и проконтролирую связь по номеру ${esc(data.phone)}.</p></div>${buttonGroup('dtWindow','Срок связи *',windows)}<div class="actions"><button id="dtCallbackDone" class="primary">Создать задачу врачу</button></div>`;bindChoices();$('dtCallbackDone').onclick=()=>{const w=value('dtWindow');if(!w)return toast('Выберите срок');save('Назначен обратный звонок',target?.name||'Дежурный врач',w,`${urgent?'Срочное обращение. ':''}Врач связывается с пациентом — ${w.toLowerCase()}`)}}
function save(outcome,owner,due,next){let items=[];try{items=JSON.parse(localStorage.getItem(KEY)||'[]')}catch{}const level=routeLevel();const priority=level==='emergency'?'Красный':level==='urgent'?'Жёлтый':'Обычный';items.unshift({id:`handoff-${Date.now()}`,at:new Date().toLocaleString('ru-RU'),patient:data.patient,phone:data.phone,service:data.procedure,outcome,reason:data.what||'',owner,due,next,priority,details:{...data,callPriority:selectedPriority(),routeLevel:level}});localStorage.setItem(KEY,JSON.stringify(items.slice(0,200)));if(outcome==='Назначен обратный звонок'){let q=[];try{q=JSON.parse(localStorage.getItem(HANDOFF)||'[]')}catch{}q.unshift({patient:data.patient,result:next,time:new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}),due,owner,priority});localStorage.setItem(HANDOFF,JSON.stringify(q.slice(0,20)))}$('screenTitle').textContent='Обращение передано';$('screen').innerHTML=`<div class="script"><div class="script-label">Что говорит администратор</div><p class="script-text">Подтверждаю: ${esc(next)}. Я зафиксировала обращение, ответственного и срок.</p></div><div class="alert success"><strong>${esc(outcome)}.</strong> Ответственный: ${esc(owner)}. Срок: ${esc(due)}.</div><div class="actions"><button id="dtNew" class="primary">Новый звонок</button></div>`;$('dtNew').onclick=()=>$('newCallTop').click();toast('Сохранено в журнал')}
document.addEventListener('click',e=>{const b=e.target.closest('#urgentFinish,#callbackFinish');if(!b)return;e.preventDefault();e.stopImmediatePropagation();showCard()},true);
})();