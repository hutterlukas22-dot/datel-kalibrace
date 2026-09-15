// 1) Kontaktní sloupec formuláře 1:1 podle webu (section.formPack .text + .picture), osoba Ing. Tomáš Pokorný.
// 2) Osa rozsahu akreditace: místo SVG (na mobilu se jen zmenšovala) responzivní HTML komponenta
//    s pozicemi v procentech — čitelná na každé šířce.
import { readFileSync, writeFileSync } from 'node:fs';

let o = readFileSync('src/obsah.html', 'utf8');
const must = (s) => { if (!o.includes(s)) throw new Error('nenalezeno: ' + s.slice(0, 60)); };

// ---------- 1) kontaktní sloupec ----------
{
  const a = o.indexOf('<div class="uk-width-2-5@l">\n        <div class="kal-contact">');
  const b = o.indexOf('</section>', a);
  if (a < 0) throw new Error('kontaktní sloupec');
  const col = `<div class="uk-width-2-5@l fx">
        <div class="text">
          <h3>Ing. Tomáš Pokorný</h3>
          <p class="subtitle">Manažer obchodu, jednatel</p>
          <div class="contact">
            <p>
              <a href="tel:+420775225941" class="tel_tomas_pokorny">
                <picture><img loading="lazy" src="assets/site/svg/contactPhone.svg" alt="phone icon" data-uk-svg></picture>
                <span>+420 775 225 941</span>
              </a>
            </p>
            <p>
              <a href="mailto:tomas.pokorny@datel.cz" class="mail_tomas_pokorny">
                <picture><img loading="lazy" src="assets/site/svg/contactEmail.svg" alt="email icon" data-uk-svg></picture>
                <span>tomas.pokorny@datel.cz</span>
              </a>
            </p>
          </div>
          <p class="txt">Kalibraci rádi probereme i osobně u vás v provozu. Nejlépe tak navrhneme kalibrační body a plán přesně podle vašich měřidel.</p>
          <picture><img loading="lazy" src="assets/site/tIcon.png" alt="contact icon"></picture>
          <p class="end">Rádi se s vámi sejdeme i online na platformě MS Teams</p>
        </div>
        <picture class="picture">
          <img loading="lazy" src="assets/img/tomas-pokorny.png" alt="Ing. Tomáš Pokorný" title="Ing. Tomáš Pokorný">
        </picture>
      </div>
    </div>
  </div>
`;
  o = o.slice(0, a) + col + o.slice(b);
}

// ---------- 2) osa rozsahu ----------
{
  const a = o.indexOf('<!-- Osa: x = 8');
  const b = o.indexOf('</ul>', o.indexOf('<ul class="kal-scalekey">')) + 5;
  if (a < 0 || b < 5) throw new Error('osa');
  // teplota: zobrazeno −70 až +210 °C → % = (v + 70) / 280 * 100 ; vlhkost 0–100 % RH → % = v
  const t = (v) => +(((v + 70) / 280) * 100).toFixed(3);
  const seg = (l, r, cls, label = '') => `<i class="${cls}" style="left:${l}%;width:${+(r - l).toFixed(3)}%">${label}</i>`;
  const band = (l, r, label, best) => `<b class="${best ? 'is-best' : ''}" style="left:${l}%;width:${+(r - l).toFixed(3)}%"><span>${label}</span></b>`;
  const tick = (p, label, major) => `<span class="${major ? 'is-major' : ''}" style="left:${p}%">${label}</span>`;

  const axis = `<!-- Rozsah akreditace v kostce — responzivní osa (pozice v %: teplota zobrazena −70 až +210 °C, vlhkost 0 až 100 % RH).
           Hodnoty z CMC (příloha osvědčení o akreditaci). -->
      <div class="kal-axes">
        <div class="kal-axis">
          <div class="kal-axis__summary">
            <p class="kal-axis__label">Teplota</p>
            <p class="kal-axis__range">−40 až +180 <small>°C</small></p>
            <p class="kal-axis__best">nejistota od <strong>0,06 °C</strong></p>
          </div>
          <div class="kal-axis__chart" role="img" aria-label="Teplota: akreditováno −40 až +180 °C. Kapalinová lázeň FLUKE 7109A −25 až 140 °C, nejistota 0,06 °C. Klimatická komora Vötschtechnik −40 až 0 °C 0,50 °C, 0 až 60 °C 0,13 °C, 60 až 180 °C 0,34 °C. Mimo tento rozsah nekalibrujeme.">
            <div class="kal-axis__track">${seg(0, t(-40), 'no')}${seg(t(-40), t(180), 'ok')}${seg(t(180), 100, 'no')}</div>
            <div class="kal-axis__ticks">${tick(t(-40), '−40', 1)}${tick(t(-25), '−25')}${tick(t(0), '0')}${tick(t(60), '60')}${tick(t(140), '140')}${tick(t(180), '+180', 1)}</div>
            <p class="kal-axis__cap">Kapalinová lázeň FLUKE 7109A</p>
            <div class="kal-axis__lane">${band(t(-25), t(140), '0,06 °C', 1)}</div>
            <p class="kal-axis__cap">Klimatická komora Vötschtechnik</p>
            <div class="kal-axis__lane">${band(t(-40), t(0), '0,50 °C')}${band(t(0), t(60), '0,13 °C')}${band(t(60), t(180), '0,34 °C')}</div>
          </div>
        </div>
        <div class="kal-axis">
          <div class="kal-axis__summary">
            <p class="kal-axis__label">Relativní vlhkost</p>
            <p class="kal-axis__range">10 až 95 <small>% RH</small></p>
            <p class="kal-axis__best">nejistota od <strong>1,1 % RH</strong></p>
          </div>
          <div class="kal-axis__chart" role="img" aria-label="Relativní vlhkost: akreditováno 10 až 95 % RH při teplotách 10 až 40 °C v generátoru Rotronic HygroGen 2 — 10 až 30 % RH nejistota 1,1, 30 až 80 % RH 1,2, 80 až 95 % RH 1,8 % RH. 5 až 10 % RH kalibrujeme mimo rozsah akreditace, pod 5 a nad 95 % RH nekalibrujeme.">
            <div class="kal-axis__track">${seg(0, 5, 'no')}${seg(5, 10, 'out')}${seg(10, 95, 'ok')}${seg(95, 100, 'no')}</div>
            <div class="kal-axis__ticks">${tick(5, '5')}${tick(10, '10', 1)}${tick(30, '30')}${tick(80, '80')}${tick(95, '95', 1)}</div>
            <p class="kal-axis__cap">Generátor vlhkosti Rotronic HygroGen 2 · při teplotách (10 až 40) °C</p>
            <div class="kal-axis__lane">${band(10, 30, '1,1 % RH', 1)}${band(30, 80, '1,2 % RH')}${band(80, 95, '1,8 % RH')}</div>
          </div>
        </div>
      </div>
      <ul class="kal-scalekey">
        <li><i class="s"></i>v rozsahu akreditace</li>
        <li><i class="h"></i>kalibrujeme mimo rozsah akreditace</li>
        <li><i class="n"></i>nekalibrujeme</li>
        <li><i class="b"></i>nejistota U (k = 2) — nejnižší udávaná</li>
      </ul>`;
  o = o.slice(0, a) + axis + o.slice(b);
}
writeFileSync('src/obsah.html', o);

// ---------- CSS ----------
{
  const f = 'assets/css/kalibrace.css';
  let css = readFileSync(f, 'utf8');
  css = css.replace(/\/\* ---------- kontakt ve formuláři[\s\S]*?\/\* ---------- \/kontakt ---------- \*\/\n/, '')
           .replace(/\/\* ---------- osa rozsahu[\s\S]*?\/\* ---------- \/osa ---------- \*\/\n/, '');
  css += `
/* ---------- osa rozsahu akreditace (responzivní) ---------- */
.kal-axes{display:grid;gap:4.5rem}
.kal-axis{display:grid;grid-template-columns:24rem minmax(0,1fr);gap:4rem;align-items:start}
.kal-axis__summary p{margin:0!important}
.kal-axis__label{font:700 1.4rem/2.1rem 'Satoshi'!important;letter-spacing:.5px;text-transform:uppercase;color:#008FCD!important}
.kal-axis__range{font:700 3.6rem/4.4rem 'Satoshi'!important;color:#331F5E!important;font-variant-numeric:tabular-nums;white-space:nowrap}
.kal-axis__range small{font-size:2rem;color:#008FCD}
.kal-axis__best{font:400 1.5rem/2.4rem 'Satoshi'!important;color:#707070!important;margin-top:.4rem!important}
.kal-axis__best strong{color:#331F5E}
.kal-axis__chart{position:relative;padding-top:.8rem}
.kal-axis__track{position:relative;height:1.8rem}
.kal-axis__track i{position:absolute;top:0;bottom:0}
.kal-axis__track .ok{background:#008FCD;border-radius:0 .9rem 0 .9rem}
.kal-axis__track .no{background:#F2F5F8}
.kal-axis__track .out{background:repeating-linear-gradient(45deg,#B4E2F6 0 2px,#FDFDFD 2px 6px)}
.kal-axis__ticks{position:relative;height:3rem;margin-bottom:1.2rem}
.kal-axis__ticks span{position:absolute;top:0;transform:translateX(-50%);padding-top:.9rem;font:500 1.3rem/1.6rem 'Satoshi';color:#707070;font-variant-numeric:tabular-nums;white-space:nowrap}
.kal-axis__ticks span:before{content:"";position:absolute;left:50%;top:0;width:1px;height:.6rem;background:#9D9D9D}
.kal-axis__ticks span.is-major{font-weight:700;color:#331F5E}
.kal-axis__ticks span.is-major:before{height:.8rem;width:2px;margin-left:-.5px;background:#331F5E}
.kal-axis__cap{font:500 1.3rem/1.8rem 'Satoshi'!important;color:#707070!important;margin:0 0 .6rem!important}
.kal-axis__lane{position:relative;height:3.2rem;margin-bottom:1.6rem}
.kal-axis__lane:last-child{margin-bottom:0}
.kal-axis__lane b{position:absolute;top:0;bottom:0;display:flex;align-items:center;justify-content:center;box-sizing:border-box;border:1px solid #46B9EB;background:#FDFDFD;border-radius:0 .8rem 0 .8rem;font:700 1.4rem/1 'Satoshi';color:#008FCD;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden}
.kal-axis__lane b+b{border-left-width:0;border-radius:0}
.kal-axis__lane b:last-child:not(:first-child){border-radius:0 .8rem 0 0}
.kal-axis__lane b.is-best{background:#DAF1FB;border-color:#008FCD;color:#331F5E}
.kal-scalekey .b{background:#DAF1FB;border:1px solid #008FCD}
@media (max-width:959px){
  .kal-axis{grid-template-columns:1fr;gap:2rem}
  .kal-axis__summary{display:flex;flex-wrap:wrap;align-items:baseline;gap:.4rem 1.6rem}
  .kal-axis__label{flex:1 0 100%}
}
@media (max-width:639px){
  .kal-axes{gap:3.5rem}
  .kal-axis__range{font-size:3rem;line-height:3.6rem}
  .kal-axis__ticks span{font-size:1.2rem}
  .kal-axis__lane{height:3.6rem}
  .kal-axis__lane b{font-size:1.15rem;letter-spacing:-.2px;padding:0 .2rem}
}
/* ---------- /osa ---------- */
`;
  writeFileSync(f, css);
}
console.log('obsah + css hotovo');
