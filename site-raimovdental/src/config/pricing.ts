/**
 * RAIMOV DENTAL — pricing SSOT (TASK-756).
 * Do not hardcode prices in HTML. All values TBD until clinic confirmation.
 * See CONTENT_REQUIRED_FROM_CLINIC.md.
 */

export type PriceBand = {
  id: string;
  labelRu: string;
  labelEn: string;
  /** null = not published */
  fromAmount: number | null;
  currency: 'KGS' | 'USD' | 'EUR' | null;
  noteRu: string;
  noteEn: string;
  status: 'tbd' | 'published';
};

export const pricingBands: PriceBand[] = [
  {
    id: 'first_visit',
    labelRu: 'Первый визит / комплексная диагностика',
    labelEn: 'First visit / comprehensive diagnostics',
    fromAmount: null,
    currency: null,
    noteRu: 'Стоимость первого визита подтверждается клиникой. Не публикуем сумму без согласования.',
    noteEn: 'First visit price confirmed by the clinic. Not published without approval.',
    status: 'tbd',
  },
  {
    id: 'comprehensive_diagnostics',
    labelRu: 'Комплексная диагностика',
    labelEn: 'Comprehensive diagnostics',
    fromAmount: null,
    currency: null,
    noteRu: 'Стоимость подтверждается после первичного запроса. Не публикуем прайс без клиники.',
    noteEn: 'Price confirmed after the first request. Not published without clinic approval.',
    status: 'tbd',
  },
  {
    id: 'veneers_smile_design',
    labelRu: 'Виниры / Smile Design',
    labelEn: 'Veneers / Smile Design',
    fromAmount: null,
    currency: null,
    noteRu: 'Зависит от объёма, материалов и подготовки.',
    noteEn: 'Depends on scope, materials, and preparation.',
    status: 'tbd',
  },
  {
    id: 'implants',
    labelRu: 'Имплантация',
    labelEn: 'Dental implants',
    fromAmount: null,
    currency: null,
    noteRu: 'Зависит от числа имплантатов, костной подготовки и ортопедии.',
    noteEn: 'Depends on implant count, bone preparation, and prosthetics.',
    status: 'tbd',
  },
  {
    id: 'full_mouth',
    labelRu: 'Полное восстановление',
    labelEn: 'Full-mouth reconstruction',
    fromAmount: null,
    currency: null,
    noteRu: 'Этапный бюджет по плану RAIM SMILE SYSTEM.',
    noteEn: 'Staged budget per RAIM SMILE SYSTEM plan.',
    status: 'tbd',
  },
  {
    id: 'adult_orthodontics',
    labelRu: 'Ортодонтия для взрослых',
    labelEn: 'Adult orthodontics',
    fromAmount: null,
    currency: null,
    noteRu: 'Зависит от метода и длительности.',
    noteEn: 'Depends on method and duration.',
    status: 'tbd',
  },
];

export const paymentNotes = {
  stagedPayment: true,
  methodsTbd: true,
  noteRu: 'Этапная оплата возможна по утверждённому плану. Способы оплаты уточняются при записи.',
  noteEn: 'Staged payment is possible per approved plan. Payment methods confirmed when you book.',
} as const;

export default { pricingBands, paymentNotes };
