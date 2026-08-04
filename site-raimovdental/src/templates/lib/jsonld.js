import { CANONICAL_HOST, BRAND } from './utils.js';

const CLINIC_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'ул. Киевская, 88',
  addressLocality: 'Бишкек',
  addressCountry: 'KG',
};

/** @param {object} opts */
export function organizationJsonLd(opts = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Dentist', 'LocalBusiness', 'Organization'],
    name: BRAND.clinic,
    url: `${CANONICAL_HOST}${opts.path || '/ru/'}`,
    description: opts.description || '',
    telephone: '+996555255455',
    address: CLINIC_ADDRESS,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 42.87439,
      longitude: 74.60751,
    },
    founder: {
      '@type': 'Person',
      name: opts.locale === 'en' ? BRAND.doctorEn : BRAND.doctorPublicRu,
    },
  };
}

/** @param {object} opts */
export function profilePageJsonLd(opts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: opts.locale === 'en' ? BRAND.doctorEn : BRAND.doctorFullRu,
      jobTitle: opts.locale === 'en' ? 'Dentist, orthodontist and gnathologist' : 'Стоматолог, ортодонт и гнатолог',
      worksFor: {
        '@type': 'Dentist',
        name: BRAND.clinic,
        url: `${CANONICAL_HOST}/${opts.locale === 'en' ? 'en' : 'ru'}/`,
      },
    },
  };
}

/** @param {object} opts */
export function articleJsonLd(opts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description || '',
    author: {
      '@type': 'Person',
      name: opts.locale === 'en' ? BRAND.doctorEn : BRAND.doctorPublicRu,
    },
    publisher: {
      '@type': 'Organization',
      name: BRAND.clinic,
    },
  };
}

/** @param {{ name: string, item: string }[]} items */
export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item.startsWith('http') ? item.item : `${CANONICAL_HOST}${item.item}`,
    })),
  };
}

/** @param {object[]} blocks */
export function jsonLdScripts(blocks) {
  return (blocks || [])
    .filter(Boolean)
    .map((block) => `<script type="application/ld+json">${JSON.stringify(block)}</script>`)
    .join('\n  ');
}
