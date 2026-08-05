(()=>{'use strict';
const PRIORITY_KEY='expert-dental-call-priority-v1';
const SERVICE_KEY='expert-dental-call-service-v1';
const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const scripts={
  generic:{id:'S01',title:'Первое обращение',say:'Здравствуйте! Спасибо, что обратились в Expert Dental Studio. Подскажите, пожалуйста, что вас беспокоит или какое лечение рассматриваете?',next:'Уточнить ситуацию, направление и срочность; затем предложить конкретный следующий шаг.',record:'Тип звонка, источник, услуга, краткая ситуация и итог.',avoid:'Не спрашивать сухо «Что вам нужно?» и не завершать звонок отправкой прайса.'},
  urgent:{id:'S16',title:'Срочный звонок',say:'Поняла. Я сейчас уточню несколько важных деталей и сразу передам врачу краткое описание ситуации. Расскажите, пожалуйста, что произошло и когда это началось.',next:'Проверить красные флаги. При их наличии — немедленная передача доступному врачу срочной группы или дежурному.',record:'Что произошло, начало симптомов, динамика, боль 0–10, температура, отёк, кровотечение, дыхание и глотание, телефон.',avoid:'Не ставить диагноз, не менять назначения и не обещать, что пациент может безопасно ждать.'},
  urgentEscalation:{id:'S16 · красные флаги',title:'Немедленная эскалация',say:'Спасибо, что сразу сообщили. Я зафиксировала признаки и прямо сейчас передаю обращение врачу как срочное. Пожалуйста, оставайтесь на связи.',next:'Тёплый перевод доступному врачу; если это невозможно — дежурный врач и контролируемый обратный звонок не позднее 15 минут.',record:'Красный флаг, контакт, кому передано, время принятия врачом и резервный маршрут.',avoid:'При затруднении дыхания или глотания, сильном кровотечении, которое не останавливается, либо тяжёлом нарастающем отёке нельзя ограничиваться обещанием обратного звонка: администратор направляет пациента за экстренной медицинской помощью по локальному регламенту клиники.'},
  medicalRoutine:{id:'Обычный медицинский звонок',title:'Без выраженных красных флагов',say:'Я всё зафиксировала и передам информацию врачу. Мы свяжемся с вами по указанному номеру в согласованный срок.',next:'Назначить владельца обращения и конкретный срок связи; проверить выполнение до конца смены.',record:'Симптомы, отсутствие красных флагов, срок и ответственный врач.',avoid:'Не говорить «ничего страшного» и не давать медицинскую оценку от имени администратора.'},
  implant:{id:'S02',title:'Имплантация и стоимость',say:'Стоимость зависит не только от импланта, но и от состояния кости, необходимости удаления, временного зуба и типа коронки. Чтобы не назвать неверную сумму, уточню: зуб уже удалён или ещё находится на месте?',next:'После ответа объяснить консультацию и предложить два конкретных времени.',record:'Зуб удалён или нет, снимок, сроки и главный барьер.',avoid:'Не называть окончательную цену импланта без контекста и диагностики.'},
  veneers:{id:'S03',title:'Виниры и эстетика',say:'Цена зависит от количества зубов, состояния эмали, прикуса, материала и необходимости подготовки. Что именно вы хотите изменить: цвет, форму, сколы, промежутки или старые реставрации?',next:'Связать запрос с диагностикой и предложить консультацию по эстетике.',record:'Эстетическая проблема, желаемый результат, объём, срок и барьер.',avoid:'Не сводить ответ к цене «за один зуб» и не обещать виниры без подготовки.'},
  orthodontics:{id:'S04',title:'Брекеты и элайнеры',say:'Стоимость зависит от сложности прикуса, длительности лечения и выбранной системы. Скажите, лечение нужно взрослому или ребёнку и было ли ортодонтическое лечение раньше?',next:'Объяснить, что система выбирается после диагностики; предложить два окна.',record:'Возраст, прошлое лечение, жалобы на сустав, наличие снимков.',avoid:'Не продавать конкретную систему до осмотра ортодонта.'},
  price:{id:'S05',title:'Просит только прайс',say:'Конечно, я могу назвать ориентиры. Чтобы выделить именно нужную информацию и не перегружать вас всем прайсом, подскажите, какая ситуация или услуга вас интересует?',next:'Дать релевантный ориентир и перевести разговор к диагностике или записи.',record:'Услуга, причина запроса цены, барьер и итог.',avoid:'Не отправлять длинный прайс и не заканчивать на этом разговор.'},
  booking:{id:'Обычный звонок · запись',title:'Запись или перенос',say:'К какому врачу или по какой услуге вы хотите записаться? Я посмотрю ближайшие варианты и предложу два времени.',next:'Предложить два конкретных окна и подтвердить дату, время, врача и способ напоминания.',record:'Услуга, врач, выбранное окно, источник и подтверждение.',avoid:'Не задавать открытый вопрос «Когда вам удобно?» без вариантов.'},
  doctorTransfer:{id:'Передача врачу',title:'Тёплая передача',say:'Чтобы врач сразу получил полную картину, я задам несколько коротких вопросов. Повторять весь рассказ врачу не потребуется.',next:'Срочный звонок: доступный врач срочной группы → дежурный → контролируемый звонок. Обычный: лечащий врач → профильный свободный врач → согласованный обратный звонок.',record:'Процедура, врач, симптомы, приоритет, кому передано, время принятия и следующий шаг.',avoid:'Обращение не считается переданным, пока врач не принял его или не создана задача с владельцем и сроком.'},
  homeCare:{id:'HC-01',title:'Закрытие визита · уход и памятка',say:'После процедуры у нас есть короткая памятка — что делать сегодня вечером. Внизу список «что купить / взять», как памятка к рецепту врача. Вот мягкая щётка от клиники — начать уход сегодня; паста/ёршики/ирригатор на витрине — по желанию.',next:'Выбрать процедуру → скрипт → выдать gift при триггере (гигиена/орто) → предложить корзину один раз → распечатать памятку → записать следующий визит.',record:'procedure, memo_id, memo_printed, gift_issued?, care_taken|declined, next_visit, doctor_care.',avoid:'Не давить после отказа; не продавать бренды вместо пользы; не пропускать печать памятки; препараты — только по схеме врача; gift ≠ продажа в чеке.'}
};
let scheduled=false;
function priority(){return sessionStorage.getItem(PRIORITY_KEY)||''}
function service(){return sessionStorage.getItem(SERVICE_KEY)||''}
function scheduleRender(){
  if(scheduled)return;
  scheduled=true;
  window.requestAnimationFrame(()=>{scheduled=false;renderAll()});
}
function setPriority(value){sessionStorage.setItem(PRIORITY_KEY,value);scheduleRender()}
function setService(value){if(value)sessionStorage.setItem(SERVICE_KEY,value)}
function scriptFor(title){
  const p=priority();
  if(/Срочная эскалация/.test(title))return scripts.urgentEscalation;
  if(/Передача врачу/.test(title)&&p==='urgent')return scripts.urgentEscalation;
  if(/Карточка передачи врачу|Способ связи с врачом|Перевод на внутренний номер|Обратный звонок врача/.test(title))return scripts.doctorTransfer;
  if(/Кровь|Острая боль|Пломба|коронка|Поломка брекетов/.test(title))return p==='urgent'?scripts.urgent:scripts.medicalRoutine;
  if(/Запрос стоимости/.test(title)){
    const selected=$('priceService')?.value||service();
    if(/Импланта/.test(selected))return scripts.implant;
    if(/Винир|эстет/.test(selected))return scripts.veneers;
    if(/Ортодонт/.test(selected))return scripts.orthodontics;
    return scripts.price;
  }
  if(/Выбор направления|Подбор времени/.test(title)){
    const selected=service();
    if(/Импланта/.test(selected))return scripts.implant;
    if(/Винир|эстет/.test(selected))return scripts.veneers;
    if(/Ортодонт/.test(selected))return scripts.orthodontics;
  }
  if(/Запись или перенос/.test(title))return scripts.booking;
  if(/уход и памятка|матрица ухода|Закрытие визита/i.test(title)){
    const selected=window.ExpertDentalHomeCare?.byId?.(document.getElementById('hcProcedure')?.value)?.admin_script;
    if(selected)return{...scripts.homeCare,say:selected};
    return scripts.homeCare;
  }
  if(/Новый пациент|Причина обращения|Начало разговора|Идентификация|Подтверждение личности/.test(title))return p==='urgent'?scripts.urgent:scripts.generic;
  if(/Передача врачу/.test(title))return p==='urgent'?scripts.urgentEscalation:scripts.medicalRoutine;
  return p==='urgent'?scripts.urgent:scripts.generic;
}
function ensurePriorityBar(){
  const head=document.querySelector('.call-head');
  if(!head||$('callPriorityBar'))return;
  const bar=document.createElement('div');
  bar.id='callPriorityBar';
  bar.className='call-priority-bar call-priority-missing';
  bar.innerHTML=`<div class="call-priority-copy"><strong>Сначала определите тип звонка</strong><span>Тип можно изменить, если в разговоре появились красные флаги.</span></div><div class="call-priority-actions"><button type="button" class="call-priority-button" data-call-priority="routine">Обычный звонок</button><button type="button" class="call-priority-button" data-call-priority="urgent">Срочный звонок</button></div>`;
  head.appendChild(bar);
  bar.querySelectorAll('[data-call-priority]').forEach(button=>button.onclick=()=>setPriority(button.dataset.callPriority));
}
function renderPriorityBar(){
  const bar=$('callPriorityBar');if(!bar)return;const p=priority();
  bar.classList.toggle('call-priority-missing',!p);
  const strong=bar.querySelector('.call-priority-copy strong');
  const note=bar.querySelector('.call-priority-copy span');
  const strongText=p==='urgent'?'Срочный звонок · медицинская маршрутизация':p==='routine'?'Обычный звонок · запись, консультация или организационный вопрос':'Сначала определите тип звонка';
  const noteText=p==='urgent'?'Проверить красные флаги и передать врачу без медицинских обещаний.':p==='routine'?'Выяснить потребность, объяснить следующий шаг и завершить конкретной договорённостью.':'Тип можно изменить, если в разговоре появились красные флаги.';
  if(strong&&strong.textContent!==strongText)strong.textContent=strongText;
  if(note&&note.textContent!==noteText)note.textContent=noteText;
  bar.querySelectorAll('[data-call-priority]').forEach(button=>button.classList.toggle('is-selected',button.dataset.callPriority===p));
}
function renderGuide(){
  const screen=$('screen');
  const title=$('screenTitle')?.textContent||'';
  if(!screen)return;
  const item=scriptFor(title);
  const p=priority();
  const signature=[title,p,service(),item.id,item.title].join('|');
  const existing=screen.querySelector('.call-script-guide');
  if(existing?.dataset.signature===signature)return;
  const guide=document.createElement('section');
  guide.className=`call-script-guide ${p==='urgent'?'is-urgent':'is-routine'}`;
  guide.dataset.signature=signature;
  guide.setAttribute('aria-label',`Скрипт администратора ${item.id}`);
  guide.innerHTML=`<div class="call-script-guide-head"><div><div class="eyebrow">Контекстный скрипт администратора</div><h3>${esc(item.title)}</h3></div><span class="call-script-id">${esc(item.id)}</span></div><p class="call-script-say">${esc(item.say)}</p><div class="call-script-facts"><div class="call-script-fact"><strong>Следующий шаг</strong><span>${esc(item.next)}</span></div><div class="call-script-fact"><strong>Что фиксировать</strong><span>${esc(item.record)}</span></div><div class="call-script-fact"><strong>Не говорить</strong><span>${esc(item.avoid)}</span></div></div>`;
  if(existing)existing.replaceWith(guide);else screen.prepend(guide);
}
function bindOnce(selector,eventName,handler){
  document.querySelectorAll(selector).forEach(node=>{
    const key=`guidance${eventName}`;
    if(node.dataset[key])return;
    node.dataset[key]='1';
    node.addEventListener(eventName,handler,true);
  });
}
function bindContext(){
  bindOnce('[data-service]','click',event=>{setService(event.currentTarget.dataset.service);scheduleRender()});
  const price=$('priceService');
  if(price&&!price.dataset.guidanceChange){price.dataset.guidanceChange='1';price.addEventListener('change',()=>{setService(price.value);scheduleRender()})}
  const booking=$('bookingService');
  if(booking&&!booking.dataset.guidanceChange){booking.dataset.guidanceChange='1';booking.addEventListener('change',()=>{setService(booking.value);scheduleRender()})}
  bindOnce('[data-flag]','click',()=>setPriority('urgent'));
  bindOnce('[data-safe]','click',()=>{if(!priority())setPriority('routine')});
}
function renderAll(){ensurePriorityBar();renderPriorityBar();bindContext();renderGuide()}
const observer=new MutationObserver(scheduleRender);
window.addEventListener('DOMContentLoaded',()=>{
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  $('newCallTop')?.addEventListener('click',()=>{
    sessionStorage.removeItem(PRIORITY_KEY);
    sessionStorage.removeItem(SERVICE_KEY);
    scheduleRender();
  });
  scheduleRender();
});
})();