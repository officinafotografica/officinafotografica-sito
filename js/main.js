/* Officina Fotografica - logica del sito (editor contenuti, lightbox, form, animazioni).
   Richiede js/layout.js caricato prima. */
(function () {
  var STORE = 'officina_fotografica_v2';
  var PAGE = document.body.dataset.page || 'home';

  /* ---------- ELEMENTI MODIFICABILI ---------- */
  var socials = Array.prototype.slice.call(document.querySelectorAll('[data-social]'));
  socials.forEach(function (a) { a.dataset.original = a.getAttribute('href'); });

  var reel = document.getElementById('showreel');   // presente solo in video.html
  if (reel) reel._default = reel.innerHTML;
  function embedUrl(u) {
    var m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    if (m) return 'https://www.youtube.com/embed/' + m[1];
    m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? 'https://player.vimeo.com/video/' + m[1] : null;
  }
  function renderReel(u) {
    if (!reel) return;
    var e = u ? embedUrl(u) : null;
    reel.innerHTML = e ? '<iframe src="' + e + '" class="absolute inset-0 w-full h-full" allowfullscreen loading="lazy" title="Showreel"></iframe>' : reel._default;
    reel.dataset.url = e ? u : '';
  }

  // Le chiavi dei testi sono per pagina (es. "home-t3"), cosi' ogni pagina ha le proprie modifiche
  var editables = Array.prototype.slice.call(document.querySelectorAll('[data-edit]'));
  editables.forEach(function (el, i) {
    el.setAttribute('data-key', PAGE + '-t' + i);
    el.dataset.original = el.innerHTML;
  });
  var images = Array.prototype.slice.call(document.querySelectorAll('[data-img]'));
  images.forEach(function (el) {
    var im = el.tagName === 'IMG' ? el : el.querySelector('img');
    el._img = im; el.dataset.original = im.getAttribute('src');
  });

  /* ---------- STORAGE ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function persist(data) {
    try { localStorage.setItem(STORE, JSON.stringify(data)); return true; }
    catch (e) { toast('Spazio pieno: usa URL per le foto o scarica il backup'); return false; }
  }
  // Parte dai dati gia' salvati (altre pagine) e aggiorna solo quelli della pagina corrente
  function collect() {
    var data = load();
    data.texts = data.texts || {}; data.images = data.images || {}; data.links = data.links || {};
    editables.forEach(function (el) {
      var k = el.dataset.key;
      if (el.innerHTML !== el.dataset.original) data.texts[k] = el.innerHTML; else delete data.texts[k];
    });
    images.forEach(function (el) {
      var k = el.getAttribute('data-img'), src = el._img.getAttribute('src');
      if (src !== el.dataset.original) data.images[k] = src; else delete data.images[k];
    });
    socials.forEach(function (a) {
      var k = a.dataset.social, h = a.getAttribute('href');
      if (h !== a.dataset.original) data.links[k] = h; else delete data.links[k];
    });
    if (reel) { if (reel.dataset.url) data.links.showreel = reel.dataset.url; else delete data.links.showreel; }
    return data;
  }
  function apply(data) {
    if (!data) return;
    var t = data.texts || {}, im = data.images || {}, l = data.links || {};
    editables.forEach(function (el) { if (t[el.dataset.key] != null) el.innerHTML = t[el.dataset.key]; });
    images.forEach(function (el) { var k = el.getAttribute('data-img'); if (im[k]) el._img.setAttribute('src', im[k]); });
    socials.forEach(function (a) { if (l[a.dataset.social]) a.setAttribute('href', l[a.dataset.social]); });
    if (l.showreel) renderReel(l.showreel);
  }
  apply(load());

  /* ---------- TOAST ---------- */
  var tt;
  function toast(msg) {
    var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }

  /* ---------- EDITOR ---------- */
  var editing = false;
  var btn = document.getElementById('btn-edit'), btnText = document.getElementById('btn-edit-text'), tools = document.getElementById('dock-tools');

  function setEditing(on) {
    editing = on;
    document.body.classList.toggle('editing', on);
    editables.forEach(function (el) { el.setAttribute('contenteditable', on ? 'true' : 'false'); el.spellcheck = on; });
    tools.classList.toggle('hidden', !on); tools.classList.toggle('flex', on);
    btnText.textContent = on ? 'Esci' : 'Modifica sito';
    btn.className = on
      ? 'px-5 py-2.5 rounded-full border border-gold-500/50 text-gold-200 font-semibold flex items-center gap-2'
      : 'px-5 py-2.5 rounded-full bg-gold-500 text-ink-900 font-semibold flex items-center gap-2';
    btn.firstElementChild.className = on ? 'fa-solid fa-xmark' : 'fa-solid fa-pen';
    if (on) toast('Clicca su testi, foto, icone social o showreel per modificarli');
  }
  btn.addEventListener('click', function () {
    if (editing) { persist(collect()); toast('Modifiche salvate'); }
    setEditing(!editing);
  });
  document.getElementById('btn-save').addEventListener('click', function () { if (persist(collect())) toast('Modifiche salvate'); });

  // Testo semplice quando si incolla; Invio non rompe i titoli
  editables.forEach(function (el) {
    el.addEventListener('paste', function (e) {
      if (!editing) return; e.preventDefault();
      var txt = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, txt);
    });
    el.addEventListener('keydown', function (e) { if (editing && e.key === 'Enter') { e.preventDefault(); el.blur(); } });
    el.addEventListener('blur', function () { if (editing) persist(collect()); });
    el.addEventListener('click', function (e) { if (editing) e.stopPropagation(); });
  });

  // Cambio foto: file locale (ridimensionata) o URL
  var picker = document.getElementById('img-picker'), target = null;
  images.forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (!editing) return;
      e.preventDefault(); e.stopPropagation();
      target = el;
      var url = prompt('Incolla l\'URL della nuova foto.\nLascia vuoto e premi OK per scegliere un file dal computer.', '');
      if (url === null) return;
      if (url.trim()) { el._img.setAttribute('src', url.trim()); persist(collect()); toast('Foto aggiornata'); }
      else picker.click();
    }, true);
  });
  picker.addEventListener('change', function () {
    var f = picker.files[0]; if (!f || !target) return;
    var r = new FileReader();
    r.onload = function () {
      var im = new Image();
      im.onload = function () {
        var max = 1200, s = Math.min(1, max / Math.max(im.width, im.height));
        var c = document.createElement('canvas'); c.width = im.width * s; c.height = im.height * s;
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        target._img.setAttribute('src', c.toDataURL('image/jpeg', 0.82));
        persist(collect()); toast('Foto aggiornata');
      };
      im.src = r.result;
    };
    r.readAsDataURL(f); picker.value = '';
  });

  // Link social e showreel
  socials.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!editing) return;
      e.preventDefault(); e.stopPropagation();
      var k = a.dataset.social;
      var u = prompt('Indirizzo del profilo ' + k + ' (es. https://www.' + k + '.com/nomeprofilo):', a.getAttribute('href'));
      if (u === null || !u.trim()) return;
      u = u.trim(); if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
      socials.forEach(function (b) { if (b.dataset.social === k) b.setAttribute('href', u); });
      persist(collect()); toast('Link aggiornato');
    }, true);
  });
  if (reel) reel.addEventListener('click', function () {
    if (!editing) return;
    var u = prompt('Incolla il link del video (YouTube o Vimeo). Lascia vuoto per rimuoverlo.', reel.dataset.url || '');
    if (u === null) return;
    u = u.trim();
    if (u && !embedUrl(u)) { toast('Link non riconosciuto: usa YouTube o Vimeo'); return; }
    renderReel(u); persist(collect()); toast(u ? 'Video aggiornato' : 'Video rimosso');
  });

  // Backup / ripristino (valgono per tutte le pagine)
  document.getElementById('btn-export').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify(collect(), null, 2)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'officina-fotografica-backup.json'; a.click(); URL.revokeObjectURL(a.href);
  });
  document.getElementById('file-import').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = JSON.parse(r.result);
        if (persist(d)) { apply(d); toast('Backup importato'); }
      } catch (err) { toast('File non valido'); }
    };
    r.readAsText(f); e.target.value = '';
  });
  document.getElementById('btn-reset').addEventListener('click', function () {
    if (!confirm('Ripristinare tutti i testi e le foto originali (di tutte le pagine)?')) return;
    try { localStorage.removeItem(STORE); } catch (e) {}
    editables.forEach(function (el) { el.innerHTML = el.dataset.original; });
    images.forEach(function (el) { el._img.setAttribute('src', el.dataset.original); });
    socials.forEach(function (a) { a.setAttribute('href', a.dataset.original); });
    renderReel('');
    toast('Contenuti ripristinati');
  });

  /* ---------- LIGHTBOX (galleria della home) ---------- */
  var lb = document.getElementById('lightbox'), lbi = document.getElementById('lightbox-img');
  document.querySelectorAll('.shot').forEach(function (s) {
    s.addEventListener('click', function () {
      if (editing) return;
      lbi.src = s.querySelector('img').src;
      lb.classList.remove('hidden'); lb.classList.add('flex');
    });
  });
  lb.addEventListener('click', function () { lb.classList.add('hidden'); lb.classList.remove('flex'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.click(); });

  /* ---------- NAV / ANIMAZIONI ---------- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('nav-scrolled', window.scrollY > 40); }
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  var mm = document.getElementById('mobile-menu');
  document.getElementById('burger').addEventListener('click', function () { mm.classList.toggle('hidden'); });
  mm.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { mm.classList.add('hidden'); }); });

  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- FORM (solo home) ----------
     Invio email tramite FormSubmit (gratuito). Cambiare qui l'indirizzo di destinazione. */
  var MAIL_TO = 'officinafotografica@tim.it';
  function sendForm(form, subject, okMsg) {
    var btn = form.querySelector('button'), label = btn.textContent;
    var fd = new FormData(form);
    fd.append('_subject', subject);
    fd.append('_template', 'table');
    fd.append('_captcha', 'false');
    btn.disabled = true; btn.textContent = 'Invio...';
    fetch('https://formsubmit.co/ajax/' + MAIL_TO, { method: 'POST', headers: { 'Accept': 'application/json' }, body: fd })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.success === 'true' || d.success === true) { toast(okMsg); form.reset(); }
        else throw new Error(d.message || 'errore');
      })
      .catch(function () { toast('Invio non riuscito: riprova o scrivici su WhatsApp'); })
      .then(function () { btn.disabled = false; btn.textContent = label; });
  }
  var cf = document.getElementById('contact-form');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault(); sendForm(cf, 'Nuovo messaggio dal sito Officina Fotografica', 'Messaggio inviato con successo');
  });
  var nl = document.getElementById('newsletter');
  if (nl) nl.addEventListener('submit', function (e) {
    e.preventDefault(); sendForm(nl, 'Nuova iscrizione newsletter - Officina Fotografica', 'Iscrizione completata');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
