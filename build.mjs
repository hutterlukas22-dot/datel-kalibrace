// Sestaví náhledovou stránku: hlavička a patička 1:1 z datel.cz + obsah nové podstránky.
// Programátor přebírá jen src/obsah.html, assets/css/kalibrace.css, assets/js/kalibrace.js a assets/img|icons.
import { readFileSync, writeFileSync } from 'node:fs';

const header = readFileSync('_src/header.abs.html', 'utf8');
const footer = readFileSync('_src/footer.abs.html', 'utf8');
const obsah = readFileSync('src/obsah.html', 'utf8');
const head = readFileSync('src/head.html', 'utf8');

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
<script src="assets/js/kalibrace.js"></script>
</body>
</html>
`;
writeFileSync('index.html', html);
console.log('index.html', html.length, 'B');
