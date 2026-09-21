/* Kalibrace a justáž měřidel — chování stránky (bez závislostí, UIkit z webu řeší scroll a FAQ).
   1) Tlačítka a[href="#poptavka"][data-typ|data-misto|data-poznamka] předvyplní formulář a pošlou událost do dataLayer.
   2) Tlačítka .kal-info rozbalí vysvětlení (klepnutí, ne :hover — na mobilu hover není).
   3) Výrok o shodě = ANO → zobrazí povinné pole s povolenou odchylkou. */
(function () {
  'use strict';

  var form = document.getElementById('kal-poptavka-form');
  if (!form) return;

  function setValue(name, value) {
    if (!value) return;
    var field = form.elements[name];
    if (!field) return;
    if (field.length && field[0] && field[0].type === 'radio') {
      Array.prototype.forEach.call(field, function (r) { r.checked = r.value === value; });
      Array.prototype.forEach.call(field, function (r) { r.dispatchEvent(new Event('change', { bubbles: true })); });
    } else {
      field.value = value;
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  // 1) předvyplnění podle tlačítka
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href="#poptavka"]') : null;
    if (!a) return;
    setValue('typ', a.getAttribute('data-typ'));
    setValue('misto', a.getAttribute('data-misto'));
    setValue('shoda', a.getAttribute('data-shoda'));
    if (a.hasAttribute('data-poznamka')) {
      var note = form.elements.poznamka;
      if (note) setTimeout(function () { note.focus({ preventScroll: true }); }, 700);
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'kalibrace_cta',
      cta_text: (a.textContent || '').trim(),
      cta_typ: a.getAttribute('data-typ') || '',
      cta_misto: a.getAttribute('data-misto') || ''
    });
  });

  // 2) info „i“
  Array.prototype.forEach.call(document.querySelectorAll('.kal-info'), function (btn) {
    btn.addEventListener('click', function () {
      var box = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (box) box.hidden = open;
    });
  });

  // 3) podmíněné pole výroku o shodě
  var cond = document.getElementById('kal-odchylka');
  function syncShoda() {
    var yes = form.elements.shoda && form.elements.shoda.value === 'ano';
    if (!cond) return;
    cond.hidden = !yes;
    var input = cond.querySelector('textarea, input');
    if (input) input.required = !!yes;
  }
  form.addEventListener('change', function (e) { if (e.target.name === 'shoda') syncShoda(); });
  syncShoda();
})();
