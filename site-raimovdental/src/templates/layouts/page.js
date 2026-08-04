import { escapeHtml, CANONICAL_HOST } from '../lib/utils.js';
import { jsonLdScripts } from '../lib/jsonld.js';
import { renderUtilityBar, renderHeader, renderFooter } from '../../components/shell-chrome.js';

/** @param {object} opts */
export function renderPageLayout(opts) {
  const lang = opts.locale === 'en' ? 'en' : 'ru';
  const canonical = `${CANONICAL_HOST}${opts.path}`;
  const alt = opts.hreflang ? `${CANONICAL_HOST}${opts.hreflang}` : null;
  const indexable = opts.indexable === true;
  const robots = indexable ? 'index,follow' : 'noindex,nofollow,noarchive';
  const ctx = {
    locale: opts.locale,
    i18n: opts.i18n,
    path: opts.path,
    hreflang: opts.hreflang,
    altPathRu: opts.locale === 'en' ? opts.hreflang : opts.path,
    contacts: opts.contacts,
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="${robots}">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://lwyumrgygbuowndwcsvc.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'">
  <title>${escapeHtml(opts.title)}</title>
  <meta name="description" content="${escapeHtml(opts.description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  ${alt ? `<link rel="alternate" hreflang="${lang}" href="${escapeHtml(canonical)}">` : ''}
  ${alt ? `<link rel="alternate" hreflang="${lang === 'ru' ? 'en' : 'ru'}" href="${escapeHtml(alt)}">` : ''}
  ${alt ? `<link rel="alternate" hreflang="x-default" href="${escapeHtml(CANONICAL_HOST + '/ru/')}">` : ''}
  <meta property="og:title" content="${escapeHtml(opts.title)}">
  <meta property="og:description" content="${escapeHtml(opts.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:locale" content="${lang === 'ru' ? 'ru_KG' : 'en_US'}">
  <meta property="og:site_name" content="RAIMOV DENTAL">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/site.css">
  <link rel="stylesheet" href="/assets/form.css">
  <script src="/assets/site-config.js" defer></script>
  <script src="/assets/analytics.js" defer></script>
  <script src="/assets/telegram.js" defer></script>
  <script src="/assets/lead-form.js" defer></script>
  <script src="/assets/shell.js" defer></script>
  ${jsonLdScripts(opts.jsonLd)}
</head>
<body data-brand="RAIMOV DENTAL">
  <a class="skip-link" href="#main">${escapeHtml(opts.i18n.skip)}</a>
  ${renderUtilityBar(ctx)}
  ${renderHeader(ctx)}
  <main id="main">${opts.main}</main>
  ${renderFooter(ctx)}
</body>
</html>`;
}

/** @param {object} ctx @param {object} meta @param {string} body */
export function wrapPage(ctx, meta, body) {
  const jsonLd = meta.jsonLd || [meta.organizationLd].filter(Boolean);
  return renderPageLayout({
    locale: ctx.locale,
    title: meta.title,
    description: meta.description,
    path: ctx.path,
    hreflang: ctx.hreflang,
    i18n: ctx.i18n,
    jsonLd,
    contacts: ctx.contacts,
    indexable: meta.indexable === true || ctx.indexable === true,
    main: body,
  });
}
