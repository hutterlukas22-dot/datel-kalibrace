// Sestaví náhledovou stránku: hlavička a patička 1:1 z datel.cz + obsah nové podstránky.
// Programátor přebírá jen src/obsah.html, assets/css/kalibrace.css, assets/js/kalibrace.js a assets/img|icons.
import { readFileSync, writeFileSync } from 'node:fs';

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
writeFileSync('index.html', html);
console.log('index.html', html.length, 'B');
