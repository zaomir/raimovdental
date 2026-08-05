/**
 * Build machine-readable home-care matrix from PRICE_CATALOG.
 * Outputs JSON (ops SSOT) + JS global for admin/doctor demo UIs.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const catalog = JSON.parse(
  readFileSync(join(root, 'docs/raimov/operations/expert-dental/pricing/PRICE_CATALOG.json'), 'utf8'),
);
const memoIndex = JSON.parse(
  readFileSync(
    join(root, 'docs/raimov/operations/expert-dental/home-care/memos/by-procedure/INDEX.json'),
    'utf8',
  ),
);

function slugify(name, idx) {
  const map = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'i',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
    х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  let s = name.toLowerCase();
  s = [...s].map((ch) => map[ch] ?? ch).join('');
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 72);
  return `${String(idx).padStart(3, '0')}-${s || 'procedure'}`;
}

function rowFor(dirId, name) {
  const n = name.toLowerCase();
  const base = {
    admin_script: '',
    doctor_say: '',
    next_visit: '',
    next_visit_when: '',
    care_basket: [],
    sale_note: 'Клиника или магазин — класс средства, не бренд.',
    memo_priority: 50,
  };

  if (dirId === 'diagnostics') {
    return {
      ...base,
      admin_script:
        'После консультации — памятка со следующим шагом. Средства ухода сегодня обычно не нужны, если доктор отдельно не сказал.',
      doctor_say: 'Следующий шаг — диагностика / запись к профильному врачу. Памятку выдадут на ресепшене.',
      next_visit: 'Диагностика / профгигиена / профильная консультация по плану',
      next_visit_when: 'до ухода с ресепшена',
      care_basket: [],
      memo_priority: 30,
    };
  }

  if (dirId === 'hygiene') {
    const heavy = n.includes('тяжёл') || n.includes('тяжел');
    const mid = n.includes('средн');
    return {
      ...base,
      admin_script: heavy
        ? 'После глубокой чистки важна памятка и часто второй этап. Могу добавить мягкую щётку к оплате — начать сегодня вечером.'
        : 'После чистки — памятка. Обычно рекомендуем новую мягкую щётку уже сегодня вечером. Добавить к чеку?',
      doctor_say: heavy
        ? 'Сегодня вечером — новая мягкая щётка. Часто нужен повторный этап гигиены — запишите на ресепшене.'
        : 'Сегодня вечером чистите новой мягкой щёткой. При чувствительности — низкоабразивная паста.',
      next_visit: heavy ? 'Повторная гигиена / этап 2' : mid ? 'Профгигиена' : 'Профгигиена',
      next_visit_when: heavy ? 'через 7–14 дней' : mid ? 'через 3–4 месяца' : 'через ~6 месяцев',
      care_basket: [
        { code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: true, where: 'clinic' },
        { code: 'low_abrasive_paste', label: 'Низкоабразивная паста', default_checked: false, where: 'clinic_or_store' },
        { code: 'irrigator', label: 'Ирригатор', default_checked: false, where: 'clinic_or_store' },
      ],
      memo_priority: 50,
    };
  }

  if (dirId === 'pediatric') {
    if (n.includes('удаление')) {
      return {
        ...base,
        admin_script: 'Памятка родителям обязательна. В день удаления средства в лунку не предлагаем.',
        doctor_say: 'Родителям на ресепшене выдадут памятку. Контроль при кровотечении/отёке.',
        next_visit: 'Контроль лунки / оценка места постоянного зуба',
        next_visit_when: 'через 3–7 дней при показаниях',
        care_basket: [],
        memo_priority: 100,
      };
    }
    if (n.includes('гигиен')) {
      return {
        ...base,
        admin_script: 'Памятка родителям. Могу показать детскую щётку и пасту по возрасту.',
        doctor_say: 'Сегодня вечером — мягкая детская щётка. Следующая гигиена по графику.',
        next_visit: 'Детская профгигиена',
        next_visit_when: 'через 3–6 месяцев',
        care_basket: [
          { code: 'kids_brush', label: 'Детская щётка', default_checked: true, where: 'clinic_or_store' },
          { code: 'kids_paste', label: 'Детская паста', default_checked: false, where: 'clinic_or_store' },
        ],
        memo_priority: 40,
      };
    }
    return {
      ...base,
      admin_script: 'Памятка родителям после детского приёма. Уход — по возрасту, если доктор рекомендовал.',
      doctor_say: 'Памятку родителям выдадут на ресепшене. Контроль по графику.',
      next_visit: n.includes('герметизац') ? 'Контроль / гигиена' : n.includes('коронк') ? 'Контроль коронки' : 'Контроль пломбы / гигиена',
      next_visit_when: 'по графику врача',
      care_basket: [
        { code: 'kids_brush', label: 'Детская щётка', default_checked: false, where: 'clinic_or_store' },
      ],
      memo_priority: 40,
    };
  }

  if (dirId === 'therapy') {
    const build = n.includes('билдап');
    return {
      ...base,
      admin_script: build
        ? 'Памятка после билдапа. Часто дальше нужна коронка — запишу к ортопеду. Мягкая щётка к чеку?'
        : 'Памятка после пломбы. Могу добавить мягкую щётку. При жалобе на прикус — короткий контроль.',
      doctor_say: build
        ? n.includes('2/3') || n.includes('3/3')
          ? 'Зуб лучше защитить коронкой — запишите к ортопеду. Мягкая щётка, не грызть твёрдое.'
          : 'Оценим, нужна ли коронка. Сегодня — мягкая щётка, без перегрузки.'
        : 'Сегодня вечером аккуратная чистка мягкой щёткой. Если прикус мешает — напишите.',
      next_visit: build ? 'Консультация ортопеда / коронка' : n.includes('травм') ? 'Контроль пульпы / шины' : 'Контроль при жалобе на прикус',
      next_visit_when: build ? 'в срок врача' : '7–14 дней при жалобах',
      care_basket: [
        { code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: true, where: 'clinic' },
        { code: 'interdental_brushes', label: 'Ёршики / нить', default_checked: n.includes('контакт'), where: 'clinic_or_store' },
      ],
      memo_priority: 60,
    };
  }

  if (dirId === 'endodontics') {
    const first = n.includes('первое посещение');
    const second = n.includes('второе посещение') || (n.includes('обтурац') && n.includes('перелеч'));
    return {
      ...base,
      admin_script: first
        ? 'Памятка после 1-го этапа эндо. Обязательно запишу на второе посещение.'
        : 'Памятка после эндо. Обычно дальше коронка — предложу запись к ортопеду.',
      doctor_say: first
        ? 'Нужен второй визит для завершения каналов. Памятку и запись — на ресепшене.'
        : 'После эндо зуб часто нужно закрыть коронкой — не откладывайте.',
      next_visit: first ? 'Эндо: второе посещение (обтурация)' : 'Коронка / ортопедия + рентген-контроль',
      next_visit_when: first ? 'по графику врача (скоро)' : 'в срок врача',
      care_basket: first
        ? [{ code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: false, where: 'clinic' }]
        : [{ code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: true, where: 'clinic' }],
      memo_priority: 90,
    };
  }

  if (dirId === 'surgery') {
    if (n.includes('шов')) {
      return {
        ...base,
        admin_script: 'Памятка по швам. Запишу снятие швов на срок врача.',
        doctor_say: 'Снятие швов — в срок, который назвал. Памятку выдадут на ресепшене.',
        next_visit: 'Снятие швов',
        next_visit_when: 'по сроку врача',
        care_basket: [],
        memo_priority: 80,
      };
    }
    if (n.includes('гингиво')) {
      return {
        ...base,
        admin_script: 'Памятка после гингивоэктомии. Мягкая щётка — если доктор разрешил.',
        doctor_say: 'Мягкий уход в зоне. Гель — только по назначению. Контроль заживления.',
        next_visit: 'Контроль заживления',
        next_visit_when: 'по графику',
        care_basket: [{ code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: true, where: 'clinic' }],
        memo_priority: 80,
      };
    }
    return {
      ...base,
      admin_script:
        'Памятка после удаления обязательна. В день 0 средства в лунку не предлагаем. Запишу контроль и обсудим замещение зуба.',
      doctor_say: 'Первые сутки — по памятке. Контроль 3–7 дней. Замещение зуба обсудим отдельно.',
      next_visit: 'Контроль лунки / снятие швов; план имплант/мост/бабочка',
      next_visit_when: 'через 3–7 дней',
      care_basket: [],
      memo_priority: 100,
    };
  }

  if (dirId === 'prosthodontics') {
    if (n.includes('слепк') || n.includes('снятие коронки')) {
      return {
        ...base,
        admin_script: 'Памятка с следующим этапом. Продажа ухода сегодня обычно не нужна.',
        doctor_say: 'Следующий этап конструкции — по записи. Берегите временную защиту.',
        next_visit: n.includes('слепк') ? 'Примерка / фиксация' : 'Новая коронка / временная',
        next_visit_when: 'по графику лаборатории',
        care_basket: [],
        memo_priority: 70,
      };
    }
    if (n.includes('протез') || n.includes('бабочк')) {
      return {
        ...base,
        admin_script: 'Памятка по протезу. Могу показать щётку для протеза. Запишу коррекции.',
        doctor_say: 'Коррекции 1–3 визита — не подпиливайте сами. Для бабочки обсудим постоянный вариант.',
        next_visit: 'Коррекция протеза; план имплант/мост',
        next_visit_when: '1–3 визита по записи',
        care_basket: [
          { code: 'denture_brush', label: 'Щётка для протеза', default_checked: true, where: 'clinic_or_store' },
          { code: 'denture_tabs', label: 'Таблетки для очистки', default_checked: false, where: 'clinic_or_store' },
        ],
        memo_priority: 70,
      };
    }
    return {
      ...base,
      admin_script: 'Памятка после коронки. Покажу ирригатор/ёршики — межзубной уход сохраняет результат.',
      doctor_say: 'У края коронки важны ёршики или ирригатор. Если прикус мешает — короткий контроль.',
      next_visit: 'Контроль прикуса; профгигиена',
      next_visit_when: '7–14 дней при жалобе; гигиена 3–6 мес',
      care_basket: [
        { code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: true, where: 'clinic' },
        { code: 'irrigator', label: 'Ирригатор', default_checked: false, where: 'clinic_or_store' },
        { code: 'interdental_brushes', label: 'Ёршики / суперфлосс', default_checked: true, where: 'clinic_or_store' },
      ],
      memo_priority: 70,
    };
  }

  if (dirId === 'implantation') {
    if (n.includes('имплантация')) {
      return {
        ...base,
        admin_script: 'Памятка после имплантации. Запишу контроль и следующий этап (ФДМ). Уход в лунку — только по врачу.',
        doctor_say: 'Период приживления критичен. Следующий этап — формирователь, затем коронка.',
        next_visit: 'Контроль → ФДМ → слепки → коронка',
        next_visit_when: 'по графику остеоинтеграции',
        care_basket: [{ code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: true, where: 'clinic' }],
        memo_priority: 80,
      };
    }
    if (n.includes('фдм') || n.includes('формирователь') || n.includes('мультиюнит') || n.includes('бэйз') || n.includes('бейс')) {
      return {
        ...base,
        admin_script: 'Памятка. Следующий шаг — слепки/коронка. Мягкая щётка вокруг компонента.',
        doctor_say: 'Дальше ортопедия. Аккуратный уход вокруг компонента.',
        next_visit: 'Слепки / коронка на импланте',
        next_visit_when: 'по графику',
        care_basket: [
          { code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: true, where: 'clinic' },
          { code: 'interdental_brushes', label: 'Ёршики', default_checked: false, where: 'clinic_or_store' },
        ],
        memo_priority: 80,
      };
    }
    return {
      ...base,
      admin_script: 'Памятка по коронке на импланте. Гигиена импланта каждые 3–6 мес. Показать ирригатор?',
      doctor_say: 'Ежедневный межзубной уход у импланта обязателен. Контроль окклюзии при жалобе.',
      next_visit: 'Профгигиена с акцентом на имплант',
      next_visit_when: 'каждые 3–6 месяцев',
      care_basket: [
        { code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: true, where: 'clinic' },
        { code: 'irrigator', label: 'Ирригатор', default_checked: false, where: 'clinic_or_store' },
        { code: 'interdental_brushes', label: 'Ёршики / суперфлосс', default_checked: true, where: 'clinic_or_store' },
      ],
      memo_priority: 70,
    };
  }

  if (dirId === 'orthodontics') {
    if (n.includes('брекет') && n.includes('установ')) {
      return {
        ...base,
        admin_script: 'Памятка после установки брекетов. В корзину: орто-ёршики, воск, мягкая щётка. Гигиена каждые 1–3 мес.',
        doctor_say: 'Гигиена вокруг замков ежедневно. На ресепшене покажут ёршики и воск. Активации по графику.',
        next_visit: 'Активация; профгигиена',
        next_visit_when: 'по графику орто; гигиена 1–3 мес',
        care_basket: [
          { code: 'ortho_brushes', label: 'Орто-ёршики / V-щётка', default_checked: true, where: 'clinic' },
          { code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: true, where: 'clinic' },
          { code: 'ortho_wax', label: 'Ортодонтический воск', default_checked: true, where: 'clinic' },
          { code: 'irrigator', label: 'Ирригатор', default_checked: false, where: 'clinic_or_store' },
        ],
        memo_priority: 70,
      };
    }
    if (n.includes('снятие брекет')) {
      return {
        ...base,
        admin_script: 'Памятка. Сразу запишу на ретейнер — без ретенции зубы смещаются.',
        doctor_say: 'Нужна ретенция сразу: каппа и/или несъёмный ретейнер.',
        next_visit: 'Ретейнер (каппа / несъёмный)',
        next_visit_when: 'желательно сегодня / ближайший слот',
        care_basket: [{ code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: true, where: 'clinic' }],
        memo_priority: 70,
      };
    }
    if (n.includes('элайнер')) {
      return {
        ...base,
        admin_script: 'Памятка по элайнерам. Могу добавить щётку для капп и таблетки.',
        doctor_say: 'Носите по часам, которые назвал. Чек-апы и следующие пары — по графику.',
        next_visit: 'Чек-ап / следующие пары; ретейнеры в конце',
        next_visit_when: 'по графику',
        care_basket: [
          { code: 'aligner_brush', label: 'Щётка для капп', default_checked: true, where: 'clinic_or_store' },
          { code: 'aligner_tabs', label: 'Таблетки для капп', default_checked: false, where: 'clinic_or_store' },
        ],
        memo_priority: 70,
      };
    }
    if (n.includes('ретен') || n.includes('ретейнер') || n.includes('каппа ретен')) {
      return {
        ...base,
        admin_script: 'Памятка по ретенции. Для несъёмного — суперфлосс/ёршики.',
        doctor_say: 'Ретенция сохраняет результат. При отклеивании — сразу визит.',
        next_visit: 'Контроль ретенции; профгигиена',
        next_visit_when: 'по срокам врача',
        care_basket: [
          { code: 'interdental_brushes', label: 'Ёршики / суперфлосс', default_checked: true, where: 'clinic_or_store' },
          { code: 'irrigator', label: 'Ирригатор', default_checked: false, where: 'clinic_or_store' },
        ],
        memo_priority: 70,
      };
    }
    if (n.includes('сканирован')) {
      return {
        ...base,
        admin_script: 'Памятка: следующий этап плана. Продажа ухода сегодня обычно не нужна.',
        doctor_say: 'План обсудим после подготовки данных. Запись следующего этапа — на ресепшене.',
        next_visit: 'План элайнеров / орто / ортопедии',
        next_visit_when: 'по готовности плана',
        care_basket: [],
        memo_priority: 30,
      };
    }
    return {
      ...base,
      admin_script: 'Памятка по аппарату. Гигиена пластины/расширителя. Запишу контроль активации.',
      doctor_say: 'Активации только как показал. При поломке — в клинику, не подгибайте сами.',
      next_visit: 'Контроль / активация аппарата',
      next_visit_when: 'по графику',
      care_basket: [{ code: 'soft_brush', label: 'Мягкая зубная щётка', default_checked: true, where: 'clinic_or_store' }],
      memo_priority: 70,
    };
  }

  return {
    ...base,
    admin_script: 'Выдайте памятку по процедуре. Уход — только по рекомендации врача.',
    doctor_say: 'Памятку и следующий шаг зафиксируйте на ресепшене.',
    next_visit: 'По плану врача',
    next_visit_when: 'по графику',
    care_basket: [],
    memo_priority: 50,
  };
}

const memoByProcedure = Object.fromEntries(memoIndex.items.map((item) => [item.procedure, item]));
const procedures = [];
let idx = 1;
for (const dir of catalog.directions) {
  for (const item of dir.items) {
    const memo = memoByProcedure[item.name];
    const memo_id = memo?.memo_id || `memo-${slugify(item.name, idx)}`;
    const fields = rowFor(dir.id, item.name);
    procedures.push({
      id: `proc-${String(idx).padStart(3, '0')}`,
      direction_id: dir.id,
      direction_name: dir.name,
      procedure: item.name,
      price: item.price,
      memo_id,
      memo_file: memo?.file || null,
      ...fields,
    });
    idx += 1;
  }
}

const skuCatalog = [
  { code: 'soft_brush', label: 'Мягкая зубная щётка' },
  { code: 'low_abrasive_paste', label: 'Низкоабразивная паста' },
  { code: 'irrigator', label: 'Ирригатор' },
  { code: 'interdental_brushes', label: 'Ёршики / суперфлосс' },
  { code: 'ortho_brushes', label: 'Орто-ёршики / V-щётка' },
  { code: 'ortho_wax', label: 'Ортодонтический воск' },
  { code: 'kids_brush', label: 'Детская щётка' },
  { code: 'kids_paste', label: 'Детская паста' },
  { code: 'denture_brush', label: 'Щётка для протеза' },
  { code: 'denture_tabs', label: 'Таблетки для очистки протеза' },
  { code: 'aligner_brush', label: 'Щётка для капп' },
  { code: 'aligner_tabs', label: 'Таблетки для капп' },
];

const scripts = {
  admin_memo_handout:
    'После процедуры у нас есть короткая памятка — что делать сегодня вечером. Внизу список «что купить / взять», как памятка к рецепту врача. Если удобно взять средства здесь — покажу; если нет — ориентиры уже в памятке.',
  doctor_no_brand:
    'Рекомендую класс ухода по показанию, без давления и без перечисления брендов. Печать памятки — администратор.',
  admin_one_offer: 'Один мягкий оффер. После отказа — без дожима. Статус care_declined.',
};

const payload = {
  status: 'DRAFT — medical review required',
  version: '0.1',
  generated: new Date().toISOString().slice(0, 10),
  source_price: 'docs/raimov/operations/expert-dental/pricing/PRICE_CATALOG.json',
  materials: ['ED-MAT-054', 'ED-MAT-055', 'ED-MAT-057', 'ED-MAT-058', 'ED-MAT-059'],
  count: procedures.length,
  scripts,
  sku_catalog: skuCatalog,
  doctor_care_classes: [
    { code: 'none', label: 'Уход не требуется сегодня' },
    { code: 'soft_brush', label: 'Мягкая щётка' },
    { code: 'low_abrasive_paste', label: 'Низкоабразивная паста' },
    { code: 'irrigator', label: 'Ирригатор' },
    { code: 'interdental_brushes', label: 'Ёршики / межзубной уход' },
    { code: 'ortho_brushes', label: 'Орто-уход' },
  ],
  procedures,
};

const jsonPath = join(root, 'docs/raimov/operations/expert-dental/home-care/HOME_CARE_MATRIX.json');
writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);

const jsBody = `/* generated by scripts/raimov/generate-home-care-matrix.mjs — do not edit by hand */
(function (root) {
  'use strict';
  const matrix = ${JSON.stringify(payload)};
  function byProcedure(name) {
    return matrix.procedures.find((row) => row.procedure === name) || null;
  }
  function byId(id) {
    return matrix.procedures.find((row) => row.id === id) || null;
  }
  function search(query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return matrix.procedures.slice();
    return matrix.procedures.filter((row) =>
      (row.procedure + ' ' + row.direction_name).toLowerCase().includes(q),
    );
  }
  function mergeDoctorCare(row, doctorCodes) {
    if (!row) return null;
    const codes = Array.isArray(doctorCodes) ? doctorCodes.filter(Boolean) : [];
    const basket = row.care_basket.map((item) => ({ ...item }));
    for (const code of codes) {
      if (code === 'none') continue;
      const existing = basket.find((item) => item.code === code);
      if (existing) existing.default_checked = true;
      else {
        const sku = matrix.sku_catalog.find((item) => item.code === code);
        basket.push({
          code,
          label: sku?.label || code,
          default_checked: true,
          where: 'clinic_or_store',
        });
      }
    }
    return { ...row, care_basket: basket, doctor_care: codes };
  }
  root.ExpertDentalHomeCare = {
    matrix,
    byProcedure,
    byId,
    search,
    mergeDoctorCare,
  };
})(typeof window !== 'undefined' ? window : globalThis);
`;

const adminJs = join(root, 'site-raimovdental/public/assets/img/admin/home-care-matrix.js');
const workspaceJs = join(root, 'site-raimovdental/public/assets/img/workspace/home-care-matrix.js');
writeFileSync(adminJs, jsBody);
writeFileSync(workspaceJs, jsBody);

console.log(`home-care matrix: ${procedures.length} procedures → ${jsonPath}`);
