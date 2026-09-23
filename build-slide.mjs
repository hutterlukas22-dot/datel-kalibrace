// Sestaví náhled teaseru kalibrace v hero carouselu homepage: hlavička a patička 1:1 z datel.cz + náš slide.
// Programátor přebírá jen src/hero-slide.html (jako další <li> do uk-slideshow-items) a assets/css/hero-slide.css.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const header = readFileSync('_src/header.abs.html', 'utf8');
const footer = readFileSync('_src/footer.abs.html', 'utf8');
const slide = readFileSync('src/hero-slide.html', 'utf8');
const v = Date.now().toString(36);

const html = `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Teaser kalibrace — slide hero carouselu | DATA ELEKTRONIK</title>
<meta name="robots" content="noindex, nofollow">
<link rel="preload" href="assets/fonts/Satoshi-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/Satoshi-Bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/datel-site.css?v=${v}">
<link rel="stylesheet" href="assets/css/datel-font-fix.css?v=${v}">
<link rel="stylesheet" href="assets/css/hero-slide.css?v=${v}">
<style>
/* jen pro náhled, na produkci se nepřebírá */
.kalt-note{max-width:94rem;margin:0 auto;padding:6rem 2rem 8rem;font:400 1.6rem/2.7rem 'Satoshi';color:#707070}
.kalt-note h3{font:700 2.2rem/3.1rem 'Satoshi';color:#331F5E;margin:0 0 1.5rem}
.kalt-note ul{margin:0;padding-left:2rem}
.kalt-note code{font-family:ui-monospace,Consolas,monospace;font-size:1.4rem;color:#331F5E}
</style>
</head>
<body class="frontend-page">
${header}
<main id="obsah">
<section class="slideshow">
  <div data-uk-slideshow="animation: fade; autoplay:true;autoplay-interval: 5000">
    <div class="uk-position-relative uk-visible-toggle uk-light" tabindex="-1">
      <ul class="uk-slideshow-items">
${slide}
      </ul>
      <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" data-uk-slidenav-previous uk-slideshow-item="previous"></a>
      <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" data-uk-slidenav-next uk-slideshow-item="next"></a>
    </div>
    <ul class="uk-slideshow-nav uk-dotnav uk-flex-center"></ul>
  </div>
</section>
<div class="kalt-note">
  <h3>Co se vkládá na web</h3>
  <ul>
    <li><code>src/hero-slide.html</code> — jako další <code>&lt;li&gt;</code> do <code>&lt;ul class="uk-slideshow-items"&gt;</code> v sekci <code>section.slideshow</code> na homepage.</li>
    <li><code>assets/css/hero-slide.css</code> — přidat za hlavní CSS webu; všechny třídy mají předponu <code>.kalt-</code>.</li>
    <li>Značky <code>assets/img/znacky/</code> a ikony <code>assets/icons/</code> — cesty upravit podle úložiště webu.</li>
  </ul>
</div>
</main>
${footer}
<script src="assets/js/datel-site.js"></script>
</body>
</html>
`;

// Náhled mimo datel.cz: obrázky z /www/upload/ s lokální náhradou přesměrovat (stejně jako v build.mjs).
const up = Object.fromEntries(readdirSync('assets/site/upload').map((f) => [f.replace(/\.[^.]+$/, ''), 'assets/site/upload/' + f]));
const preview = html
  .replace(/<source[^>]*https:\/\/www\.datel\.cz\/www\/upload\/[^/]+\/(\d+)\/[^>]*>/g, (m, id) => (up[id] ? '' : m))
  .replace(/https:\/\/www\.datel\.cz\/www\/upload\/[^/]+\/(\d+)\/[^"\s)]*/g, (m, id) => up[id] || m);

writeFileSync('hero-slide.html', preview);
console.log('hero-slide.html', preview.length, 'B');
