# Expert Dental — Tilda drafts

Черновики Zero Block для `expertdental.kg` (не runtime `site-raimovdental`).

| File | Purpose |
|------|---------|
| `homepage-zero-block.html` | Канон главной (HTML+CSS+JS) для вставки в Tilda |
| `price-table-zero-block.html` | Таблица прайса для `/price` (направление · услуга · цена) |

## Прайс `/price` (2026-08-04)

1. SSOT каталога: `docs/raimov/operations/expert-dental/pricing/PRICE_CATALOG.json`
2. Markdown-таблица: `docs/raimov/operations/expert-dental/pricing/PRICE_TABLE.md`
3. Вставка в Tilda: открыть страницу `Цены` (`/price`) → Zero Block → вставить содержимое `price-table-zero-block.html` (body + style; без внешней шапки/меню Tilda)
4. Удалить старые карточки T847 с дублирующим прайсом, чтобы осталась одна таблица
5. После публикации: smoke `https://expertdental.kg/price`

Канон URL каталога услуг и цен в долгосрочной архитектуре — `/services/` (`EXPERT_DENTAL_WEBSITE_SSOT.md`). Пока жив legacy-алиас `/price` — публикуем сюда.

## Fixes in homepage-zero-block (2026-07-30)

- CTA «Все услуги и цены» → `/services` (не `/prices`)
- Кнопки: прозрачный фон по умолчанию; Tilda `.t-btnflex` перебивается через `!important`
- WhatsApp (блок контактов): outline `#25D366` → заливка на hover
- FAQ: `hidden` на ответах; padding снизу под mobile panel; layout featured-карточки услуг
