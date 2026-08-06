/**
 * Schema.org graphs.
 *
 * Canon: docs/ssot/EXPERT_DENTAL_WEBSITE_SSOT.md §18.2 — Dentist / MedicalClinic,
 * Physician, MedicalWebPage, Article, BreadcrumbList, FAQPage (only with a visible FAQ).
 *
 * Two hard rules, both enforced here:
 *  - no `aggregateRating` and no `review` until verified reviews exist (§20 / studio §9.4);
 *  - `offers` are omitted, because treatment prices are ranges determined after diagnosis
 *    and publishing them as fixed offers would contradict the price disclaimer.
 */

import { brand, contacts, social } from '../config/site.mjs';

export function organisationId(origin) {
  return `${origin}/#clinic`;
}

export function clinicNode(origin) {
  const node = {
    '@type': ['Dentist', 'MedicalClinic'],
    '@id': organisationId(origin),
    name: brand.name,
    alternateName: brand.nameRu,
    url: `${origin}/`,
    telephone: contacts.phone,
    image: `${origin}/assets/img/clinic/reception.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacts.street,
      addressLocality: contacts.city,
      addressCountry: contacts.countryCode,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
  if (social.instagram) node.sameAs = [social.instagram];
  if (contacts.geo) {
    node.geo = { '@type': 'GeoCoordinates', latitude: contacts.geo.lat, longitude: contacts.geo.lng };
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
    '@type': 'MedicalWebPage',
    '@id': `${origin}/blog/${article.slug}/#article`,
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
