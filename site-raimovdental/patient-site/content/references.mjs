/**
 * External authoritative sources allowed in article copy.
 *
 * Every URL here returned HTTP 200 on 2026-08-06. The builder fails if an article cites
 * an id that is not in this registry, so a link can never silently rot into a 404 or
 * point at a source nobody vetted.
 */
export const references = {
  'who-oral-health': {
    org: 'Всемирная организация здравоохранения',
    title: 'Oral health — информационный бюллетень',
    url: 'https://www.who.int/news-room/fact-sheets/detail/oral-health',
    lang: 'en',
  },
  'who-oral-topic': {
    org: 'Всемирная организация здравоохранения',
    title: 'Oral health — тематический раздел',
    url: 'https://www.who.int/health-topics/oral-health',
    lang: 'en',
  },
  'ada-veneers': {
    org: 'American Dental Association',
    title: 'Veneers — справочник MouthHealthy',
    url: 'https://www.mouthhealthy.org/all-topics-a-z/veneers',
    lang: 'en',
  },
  'ada-root-canals': {
    org: 'American Dental Association',
    title: 'Root Canals — справочник MouthHealthy',
    url: 'https://www.mouthhealthy.org/all-topics-a-z/root-canals',
    lang: 'en',
  },
  'ada-cavities': {
    org: 'American Dental Association',
    title: 'Cavities — справочник MouthHealthy',
    url: 'https://www.mouthhealthy.org/all-topics-a-z/cavities',
    lang: 'en',
  },
  'ada-sealants-topic': {
    org: 'American Dental Association',
    title: 'Dental Sealants — обзор клинических данных',
    url: 'https://www.ada.org/resources/ada-library/oral-health-topics/dental-sealants',
    lang: 'en',
  },
  'ada-sealants': {
    org: 'American Dental Association',
    title: 'Sealants — справочник MouthHealthy',
    url: 'https://www.mouthhealthy.org/all-topics-a-z/sealants',
    lang: 'en',
  },
  'ada-baby-teeth': {
    org: 'American Dental Association',
    title: 'Baby Teeth — справочник MouthHealthy',
    url: 'https://www.mouthhealthy.org/all-topics-a-z/baby-teeth',
    lang: 'en',
  },
  'ada-braces': {
    org: 'American Dental Association',
    title: 'Braces — справочник MouthHealthy',
    url: 'https://www.mouthhealthy.org/all-topics-a-z/braces',
    lang: 'en',
  },
  'ada-implants': {
    org: 'American Dental Association',
    title: 'Implants — справочник MouthHealthy',
    url: 'https://www.mouthhealthy.org/all-topics-a-z/implants',
    lang: 'en',
  },
  'ada-gum-disease': {
    org: 'American Dental Association',
    title: 'Gum Disease — справочник MouthHealthy',
    url: 'https://www.mouthhealthy.org/all-topics-a-z/gum-disease',
    lang: 'en',
  },
  'aapd-parent-faq': {
    org: 'American Academy of Pediatric Dentistry',
    title: 'Часто задаваемые вопросы для родителей',
    url: 'https://www.aapd.org/resources/parent/faq/',
    lang: 'en',
  },
  'cochrane-sealants': {
    org: 'Cochrane',
    title: 'Sealants for preventing tooth decay in permanent teeth — систематический обзор',
    url: 'https://www.cochrane.org/CD001830/ORAL_sealants-preventing-tooth-decay-permanent-teeth',
    lang: 'en',
  },
  'nidcr-tooth-decay': {
    org: 'National Institute of Dental and Craniofacial Research (NIH)',
    title: 'Tooth Decay',
    url: 'https://www.nidcr.nih.gov/health-info/tooth-decay',
    lang: 'en',
  },
  'nidcr-gum-disease': {
    org: 'National Institute of Dental and Craniofacial Research (NIH)',
    title: 'Gum Disease',
    url: 'https://www.nidcr.nih.gov/health-info/gum-disease',
    lang: 'en',
  },
  'nhs-teeth-gums': {
    org: 'NHS',
    title: 'Как ухаживать за зубами и дёснами',
    url: 'https://www.nhs.uk/live-well/healthy-teeth-and-gums/',
    lang: 'en',
  },
  'efp-patients': {
    org: 'European Federation of Periodontology',
    title: 'Материалы для пациентов о здоровье дёсен',
    url: 'https://www.efp.org/for-patients/',
    lang: 'en',
  },
};
