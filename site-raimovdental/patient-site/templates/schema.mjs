/**
 * Schema.org graphs.
 *
 * Canon: docs/ssot/EXPERT_DENTAL_WEBSITE_SSOT.md §18.2 — Dentist / MedicalClinic,
 * Physician, MedicalWebPage, Article, BreadcrumbList, FAQPage (only with a visible FAQ).
 *
 * Two hard rules, both enforced here:
 *  - `aggregateRating` is emitted only from the clinic's own map profile, marked publishable
 *    and dated, and never as self-authored `review` nodes (§20 / studio §9.4);
 *  - `offers` are omitted, because treatment prices are ranges determined after diagnosis
 *    and publishing them as fixed offers would contradict the price disclaimer.
 */

import { brand, contacts, maps, social } from '../config/site.mjs';

export function organisationId(origin) {
  return `${origin}/#clinic`;
}

const DAY_NAMES = {
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
  Su: 'Sunday',
};
const DAY_ORDER = Object.keys(DAY_NAMES);

/** Expands a `Mo-Su` / `Mo-Fr` spec into the day list schema.org expects. */
function openDays(spec = 'Mo-Su') {
  const [from, to] = spec.split('-');
  const start = DAY_ORDER.indexOf(from);
  const end = DAY_ORDER.indexOf(to ?? from);
  if (start < 0 || end < 0) throw new Error(`Bad opening-hours spec: ${spec}`);
  return DAY_ORDER.slice(start, end + 1).map((d) => DAY_NAMES[d]);
}

/**
 * `rating` comes from the clinic's 2GIS profile via reviews.ru.json. It is passed in rather
 * than imported so a build without publishable review data simply omits the property.
 */
export function clinicNode(origin, { rating = null } = {}) {
  const spec = (contacts.hours.schemaSpec ?? 'Mo-Su 08:00-19:00').split(' ')[0];
  const node = {
    '@type': ['Dentist', 'MedicalClinic', 'LocalBusiness'],
    '@id': organisationId(origin),
    name: brand.name,
    legalName: brand.legalName,
    alternateName: brand.nameRu,
    url: `${origin}/`,
    telephone: contacts.phone,
    image: `${origin}/assets/img/clinic/reception.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacts.street,
      addressLocality: contacts.city,
      postalCode: contacts.postalCode,
      addressCountry: contacts.countryCode,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: openDays(spec),
        opens: contacts.hours.opens,
        closes: contacts.hours.closes,
      },
    ],
    availableService: [
      { '@type': 'MedicalProcedure', name: 'Ортодонтическое лечение' },
      { '@type': 'MedicalProcedure', name: 'Диагностика и лечение ВНЧС' },
      { '@type': 'MedicalProcedure', name: 'Имплантация зубов' },
      { '@type': 'MedicalProcedure', name: 'Протезирование зубов' },
      { '@type': 'MedicalProcedure', name: 'Эндодонтическое лечение' },
      { '@type': 'MedicalProcedure', name: 'Детская стоматология' },
    ],
  };
  node.sameAs = [social.instagram, social.telegram, maps.twoGis, maps.google].filter(Boolean);
  if (contacts.geo) {
    node.geo = { '@type': 'GeoCoordinates', latitude: contacts.geo.lat, longitude: contacts.geo.lng };
  }
  // Only the map profile's own aggregate, attributed and dated. Never a self-authored review.
  if (rating) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.reviewCount,
      bestRating: rating.bestRating,
      worstRating: rating.worstRating,
      url: rating.sourceUrl,
    };
  }
  return node;
}

export function physicianNode(origin, doctor) {
  const node = {
    '@type': 'Physician',
    '@id': `${origin}/doctors/${doctor.slug}/#physician`,
    name: doctor.name,
    url: `${origin}/doctors/${doctor.slug}/`,
    medicalSpecialty: 'Dentistry',
    jobTitle: doctor.role,
    description: doctor.lead,
    worksFor: { '@id': organisationId(origin) },
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacts.street,
      addressLocality: contacts.city,
      addressCountry: contacts.countryCode,
    },
  };
  if (doctor.photo) node.image = `${origin}/assets/img/${doctor.photo}.jpg`;
  if (doctor.knowsAbout?.length) node.knowsAbout = doctor.knowsAbout;
  // sameAs is how search engines reconcile the doctor with the profile patients already
  // follow, so it belongs on the physician node rather than only on the clinic.
  if (doctor.chief && social.chiefInstagram) node.sameAs = [social.chiefInstagram];
  return node;
}

export function breadcrumbNode(origin, trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: `${origin}${c.href}`,
    })),
  };
}

export function faqNode(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function webPageNode(origin, { url, title, description, medical = false, breadcrumb = true }) {
  const node = {
    '@type': medical ? 'MedicalWebPage' : 'WebPage',
    '@id': `${origin}${url}#webpage`,
    url: `${origin}${url}`,
    name: title,
    description,
    inLanguage: 'ru',
    isPartOf: { '@type': 'WebSite', '@id': `${origin}/#website`, name: brand.name, url: `${origin}/` },
    about: { '@id': organisationId(origin) },
  };
  if (breadcrumb) node.breadcrumb = { '@id': `${origin}${url}#breadcrumb` };
  return node;
}

export function articleNode(origin, article, { author, reviewer, category }) {
  return {
    '@type': ['Article', 'MedicalWebPage'],
    '@id': `${origin}/blog/${article.slug}/#article`,
    mainEntityOfPage: { '@id': `${origin}/blog/${article.slug}/#article` },
    url: `${origin}/blog/${article.slug}/`,
    headline: article.title,
    description: article.metaDescription,
    inLanguage: 'ru',
    image: `${origin}/assets/img/${article.cover}.jpg`,
    datePublished: article.published,
    dateModified: article.updated,
    articleSection: category.label,
    // `reviewedBy` is what carries medical trust — the reviewer is a named clinician.
    reviewedBy: { '@id': `${origin}/doctors/${reviewer.slug}/#physician` },
    lastReviewed: article.updated,
    author: { '@id': `${origin}/doctors/${author.slug}/#physician` },
    publisher: { '@id': organisationId(origin) },
    isPartOf: { '@type': 'Blog', '@id': `${origin}/blog/#blog`, name: `Блог ${brand.name}` },
    about: { '@type': 'MedicalCondition', name: category.label },
  };
}

export function serviceNode(origin, service) {
  return {
    '@type': 'MedicalProcedure',
    '@id': `${origin}/services/${service.slug}/#procedure`,
    name: service.title,
    description: service.metaDescription,
    url: `${origin}/services/${service.slug}/`,
    procedureType: 'https://schema.org/TherapeuticProcedure',
    howPerformed: service.stages?.map((s) => s.title).join('; '),
    preparation: service.diagnostics?.join('; '),
    provider: { '@id': organisationId(origin) },
  };
}

export function graph(origin, nodes) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) });
}
