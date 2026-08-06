/**
 * Document shell.
 *
 * Host-aware: the staging host renders `noindex` plus a visible preview banner, the
 * production host renders indexable metadata. Nothing else differs between the two, so
 * moving to expertdental.kg is a config change rather than a rebuild of the site.
 */

import { analytics, brand, hosts } from '../config/site.mjs';
import { actionBar, attr, esc, footer, header } from './ui.mjs';

/** Analytics tags render only once real IDs exist; until then the head stays clean. */
function analyticsTags() {
  const out = [];
  if (analytics.ga4MeasurementId) {
    out.push(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${attr(analytics.ga4MeasurementId)}"></script>`,
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${attr(
        analytics.ga4MeasurementId
      )}');</script>`
    );
  }
  if (analytics.yandexMetrikaId) {
    out.push(
      `<script>window.__ymId=${Number(analytics.yandexMetrikaId)};(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(window.__ymId,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true});</script>`
    );
  }
  return out.join('\n  ');
}

export function document({
  host,
  url,
  title,
  description,
  body,
  schema,
  pageId = '',
  ogImage = '/assets/img/clinic/reception.jpg',
  ogImageWidth = 1600,
  ogImageHeight = 1067,
  ogImageAlt = `${brand.name} — стоматологическая клиника в Бишкеке`,
  ogType = 'website',
  extraHead = '',
  robotsOverride,
  // Content-hashed CSS/JS paths from the builder. A cache in front of the origin cannot
  // serve last week's stylesheet when the URL itself changes with the file.
  assets,
  // Prefilled WhatsApp draft for the shell buttons (header, drawer, footer, sticky bar).
  // Every page states its own, so the administrator sees what the patient was reading.
  waMessage = 'Здравствуйте. Пишу с сайта Expert Dental Studio.',
}) {
  const cfg = hosts[host];
  if (!cfg) throw new Error(`Unknown host profile: ${host}`);
  const canonical = `${cfg.origin}${url}`;
  const robots =
    robotsOverride
    ?? (cfg.indexable
      ? 'index,follow,max-image-preview:large,max-snippet:-1'
      : 'noindex,nofollow,noarchive,nosnippet');

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${attr(description)}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${attr(canonical)}">
  <meta name="theme-color" content="#1e3a32">
  <meta name="color-scheme" content="light">
  <meta property="og:type" content="${attr(ogType)}">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:site_name" content="${attr(brand.name)}">
  <meta property="og:title" content="${attr(title)}">
  <meta property="og:description" content="${attr(description)}">
  <meta property="og:url" content="${attr(canonical)}">
  <meta property="og:image" content="${attr(cfg.origin + ogImage)}">
  <meta property="og:image:width" content="${attr(String(ogImageWidth))}">
  <meta property="og:image:height" content="${attr(String(ogImageHeight))}">
  <meta property="og:image:alt" content="${attr(ogImageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${attr(title)}">
  <meta name="twitter:description" content="${attr(description)}">
  <meta name="twitter:image" content="${attr(cfg.origin + ogImage)}">
  <meta name="twitter:image:alt" content="${attr(ogImageAlt)}">
  <link rel="icon" href="/assets/img/brand/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/img/brand/logo.png">
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/cormorant-garamond-300-cyrillic.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/manrope-400-cyrillic.woff2" crossorigin>
  <link rel="stylesheet" href="${assets['css/fonts.css']}">
  <link rel="stylesheet" href="${assets['css/site.css']}">
  ${extraHead}
  <script type="application/ld+json">${schema}</script>
  ${analyticsTags()}
</head>
<body${pageId ? ` data-page="${attr(pageId)}"` : ''}>
  <a class="skip-link" href="#main">Перейти к содержанию</a>
  ${cfg.banner ? `<div class="staging-note">${esc(cfg.banner)}</div>` : ''}
  ${header(assets, waMessage)}
  <main id="main">
${body}
  </main>
  ${footer(assets, waMessage)}
  ${actionBar(pageId, waMessage)}
  <script src="${assets['js/site.js']}" defer></script>
</body>
</html>
`;
}
