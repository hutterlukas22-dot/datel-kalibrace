// Sestaví náhledovou stránku: hlavička a patička 1:1 z datel.cz + obsah nové podstránky.
// Programátor přebírá jen src/obsah.html, assets/css/kalibrace.css, assets/js/kalibrace.js a assets/img|icons.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const header = readFileSync('_src/header.abs.html', 'utf8');
const footer = readFileSync('_src/footer.abs.html', 'utf8');
const obsah = readFileSync('src/obsah.html', 'utf8');
// verze souborů — po každém sestavení nová, aby prohlížeč (i GitHub Pages) nedržel staré CSS/JS v mezipaměti
const v = Date.now().toString(36);
const head = readFileSync('src/head.html', 'utf8')
  .replace(/(assets\/css\/(?:kalibrace|datel-font-fix|datel-site)\.css)(?:\?v=[\w]+)?/g, `$1?v=${v}`);

const html = `<!DOCTYPE html>
<html lang="cs">
<head>
${head}
</head>
<body class="frontend-page">
${header}
<main id="obsah">
${obsah}
</main>
${footer}
<script src="assets/js/datel-site.js"></script>
<script src="assets/js/kalibrace.js?v=${v}"></script>
</body>
</html>
`;
// Náhled mimo datel.cz: web je za ochranou WEDOS a obrázky z něj se na cizí stránce nenačtou.
// Obrázky z /www/upload/, které mají lokální náhradu v assets/site/upload/<id>.<přípona>, se v náhledu přesměrují
// (a jejich <source> webp se vynechá). Obsah pro programátora (src/obsah.html) zůstává s produkčními adresami.
const up = Object.fromEntries(readdirSync('assets/site/upload').map((f) => [f.replace(/\.[^.]+$/, ''), 'assets/site/upload/' + f]));
const preview = html
  .replace(/<source[^>]*https:\/\/www\.datel\.cz\/www\/upload\/[^/]+\/(\d+)\/[^>]*>/g, (m, id) => (up[id] ? '' : m))
  .replace(/https:\/\/www\.datel\.cz\/www\/upload\/[^/]+\/(\d+)\/[^"\s)]*/g, (m, id) => up[id] || m)
  .replace(/<link rel="icon" type="image\/png"[^>]*>/, '<link rel="icon" type="image/svg+xml" href="assets/img/logo/datel-symbol.svg">');
const missing = [...new Set([...preview.matchAll(/https:\/\/www\.datel\.cz\/www\/upload\/[^/]+\/(\d+)\//g)].map((m) => m[1]))];
if (missing.length) console.log('bez lokální náhrady (' + missing.length + '):', missing.join(' '));

writeFileSync('index.html', preview);
console.log('index.html', html.length, 'B');
