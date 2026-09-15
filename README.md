# Kalibrace a justáž měřidel — nová podstránka datel.cz

Náhled nové podstránky `/kalibrace-a-justaz-meridel` podle wireframu v19.
Hlavička, patička, písmo, tlačítka a formulářová sekce jsou **1:1 z produkčního webu**
(převzaté HTML a CSS), nový obsah je napsaný tak, aby se dal přímo vložit do šablony.

## Co programátor přebírá

| Soubor | Kam |
|---|---|
| `src/obsah.html` | obsah mezi hlavičku a patičku šablony stránky |
| `src/head.html` | title, description, canonical, `noindex` a strukturovaná data (JSON-LD) do `<head>` |
| `assets/css/kalibrace.css` | přidat za hlavní CSS webu — všechny třídy mají předponu `.kal-`, nic z webu nepřepisují |
| `assets/css/datel-font-fix.css` | **globálně na celý web** — 14 prvků (claim v hlavičce a patičce, nadpisy menu v patičce, vyhledávání) web dnes sází písmem Inter; soubor je převádí na firemní Satoshi. Obsahuje i úpravu loga: v hlavičce a patičce je kompletní originální SVG s claimem (`assets/img/logo/`) místo PNG s claimem v HTML textu |
| `assets/js/kalibrace.js` | přidat za hlavní JS webu (UIkit je už na webu) |
| `assets/img/*`, `assets/icons/*` | obrázky a ikony — cesty v HTML/CSS upravit podle úložiště webu |

**Nepřebírá se:** `assets/css/datel-site.css`, `assets/js/datel-site.js`, `assets/site/*`,
`assets/fonts/*` a hlavička/patička v `index.html` — to jsou jen kopie z produkce pro náhled.

## Na čem stránka stojí

- Hero rozšiřuje existující `section.pageTop` (drobečková navigace, fotka vpravo).
- Formulář rozšiřuje existující `section.formPack` (fialová sekce s pravítky).
- FAQ je nativní UIkit `uk-accordion`, výchozí stav zavřený; `schema.org/FAQPage` je v `head.html`.
- Mřížky jsou UIkit (`uk-grid`, `uk-child-width-*`), zlomy shodné s webem (640 / 960 / 1200 px).
- Brand: štítek s linkou, nadpisy H2 fialová + modrá, rohy `0 2rem 0 2rem`, pattern na fialové 50 %.

## Tlačítka a formulář (#poptavka)

Na stránce je jediný formulář. Všechna CTA vedou na kotvu `#poptavka` a přes `data-*` atributy
předvyplní pole a pošlou událost `kalibrace_cta` do `dataLayer`:

| Atribut | Pole | Hodnoty |
|---|---|---|
| `data-typ` | Typ požadavku (`typ`) | `standardni`, `mimo-akreditaci`, `dotaz-meridlo`, `dlouhodoby-plan`, `zahranici` |
| `data-misto` | Kde kalibrovat (`misto`) | `laborator`, `provoz` |
| `data-poznamka` | zaměří pole Poznámka | — |

Formulář zatím nikam neodesílá (`action="#"`) — napojit na stávající zpracování formulářů webu (Nette).
Výrok o shodě = ANO zobrazí povinné pole s povolenou odchylkou. Ikony „i“ se otevírají klepnutím (na mobilu není hover).

## Doplnit před spuštěním

Zástupný obsah je na stránce vidět (přerušovaný modrý rámeček `.kal-ph`, žluté `.kal-fill`):

- značka ČIA v hero (až bude přidělená)
- PDF osvědčení o akreditaci a PDF návod k přepravě (odkazy `data-kal-todo`)
- graf as-found / as-left v sekci Justáž
- fotky: kalibrace u zákazníka, celá laboratoř, Isotech milliK + FLUKE 5627A, sonda HC2-S, lázeň FLUKE 7109A, komora Vötschtechnik
- loga zákazníků (2 řady po 8), dvě citace zákazníků
- jméno, telefon a fotka vedoucího laboratoře
- odstranit `noindex` z `head.html`, až bude akreditační značka přidělená

## Náhled lokálně

```bash
node build.mjs   # sestaví index.html z hlavičky, obsahu a patičky
node dev.js      # http://localhost:5190
```
