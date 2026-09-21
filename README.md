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
| `assets/css/datel-font-fix.css` | **globálně na celý web** — 14 prvků (claim v hlavičce a patičce, nadpisy menu v patičce, vyhledávání) web dnes sází písmem Inter; soubor je převádí na firemní Satoshi. Obsahuje i úpravu loga: v hlavičce, patičce i v okně vyhledávání je kompletní originální SVG s claimem podle manuálu (`assets/img/logo/`) místo PNG s claimem v HTML textu |
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
- Značky ČIA (K 2432) a Global ACI jsou v `assets/img/znacky/`, loga výrobců v `assets/img/vyrobci/`
  (ořezaná, zmenšená). Loga výrobců jsou monochromatická, barva se ukáže při najetí myší.
- Osa „Rozsah akreditace v kostce“: teplota červeně, vlhkost modře (modifikátory `.kal-axis--t` / `.kal-axis--rh`).
- Kontakt u formuláře: původní portrét z webu, pod ním linka; na desktopu jede s formulářem (sticky).
  Sekce má `overflow:clip` místo webového `overflow:hidden`, jinak sticky nefunguje.
- Kdyby na stránku přibyla tabulka, platí jednotný styl DATEL z design systemu (Komponenty → Tabulky).

## Tlačítka a formulář (#poptavka)

Na stránce je jediný formulář. Všechna CTA vedou na kotvu `#poptavka` a přes `data-*` atributy
předvyplní pole a pošlou událost `kalibrace_cta` do `dataLayer`:

| Atribut | Pole | Hodnoty |
|---|---|---|
| `data-typ` | Typ požadavku (`typ`) | `standardni`, `mimo-akreditaci`, `dotaz-meridlo`, `dlouhodoby-plan`, `zahranici` |
| `data-misto` | Kde kalibrovat (`misto`) | `laborator`, `provoz` |
| `data-shoda` | Výrok o shodě (`shoda`) | `ano`, `ne` |
| `data-poznamka` | zaměří pole Poznámka | — |

Formulář zatím nikam neodesílá (`action="#"`) — napojit na stávající zpracování formulářů webu (Nette).
Výrok o shodě = ANO zobrazí povinné pole s povolenou odchylkou. Ikony „i“ se otevírají klepnutím (na mobilu není hover).

## Doplnit před spuštěním

Zástupný obsah je na stránce vidět (přerušovaný modrý rámeček `.kal-ph`, žluté `.kal-fill`):

- PDF osvědčení o akreditaci včetně přílohy (tlačítko v úvodu) a PDF návod k přepravě (odkazy `data-kal-todo`)
- graf as-found / as-left v sekci Justáž
- fotky: kalibrace u zákazníka, Isotech milliK + FLUKE 5627A, sonda HC2-S, lázeň FLUKE 7109A, komora Vötschtechnik
- odstranit `noindex` z `head.html` při spuštění

## Grafika z datel.cz v náhledu

Web datel.cz je za ochranou WEDOS: obrázky pouští jen prohlížeči, který už web navštívil a prošel ověřením.
Návštěvník, který otevře náhled (GitHub Pages) poprvé, by je neviděl — ověřeno 21. 9. 2026 v čistém Chromu.
Náhled proto používá lokální náhrady — **na produkci nic z toho neplatí, tam fungují původní adresy**:

- pravítka a pattern v převzatém CSS webu → brand SVG (`assets/img/ruler-l.svg`, `ruler-r.svg`, `pattern.svg`);
  `kalibrace.css` používá pravítka z `assets/img/` i na produkci (je to brand asset, stejný motiv jako PNG webu)
- obrázky z `/www/upload/` → `assets/site/upload/<id>.<přípona>`; `build.mjs` je v `index.html` přesměruje,
  `src/obsah.html` zůstává s produkčními adresami. Loga dodavatelů jsou z podkladů klienta, fotky v rozbalovacím
  menu jsou jen zástupné.
- chybí loga 9 zákazníků v sekci referencí — stačí je uložit do `assets/site/upload/` pod id z jejich adresy
  (build vypíše, která id nemají náhradu).

## Náhled lokálně

```bash
node build.mjs   # sestaví index.html z hlavičky, obsahu a patičky
node dev.js      # http://localhost:5190
```
