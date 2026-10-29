/* Officina Fotografica - logica del sito (lightbox, form, animazioni).
 *   Richiede js/layout.js caricato prima. Ripulito dalle funzioni dell'editor. */
(function () {
  // Gestione dinamica dello Showreel video (YouTube / Vimeo) se presente nella pagina
  var reel = document.getElementById('showreel');
  function embedUrl(u) {
    var m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    if (m) return 'https://youtube.com' + m[1];
      m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? 'https://vimeo.com' + m[1] : null;
  }

  /* ---------- TOAST NOTIFICATION ---------- */
  var tt;
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(tt);
    tt = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }

  /* ---------- LIGHTBOX (Galleria fotografica) ---------- */
  var lb = document.getElementById('lightbox'), lbi = document.getElementById('lightbox-img');
  if (lb && lbi) {
    document.querySelectorAll('.shot').forEach(function (s) {
      s.addEventListener('click', function () {
        var imgInside = s.querySelector('img');
        if (imgInside) {
          lbi.src = imgInside.src;
          lb.classList.remove('hidden');
          lb.classList.add('flex');
        }
      });
    });
    lb.addEventListener('click', function () {
      lb.classList.add('hidden');
      lb.classList.remove('flex');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') lb.click();
    });
  }

  /* ---------- BARRA DI NAVIGAZIONE & INTERAZIONI ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    function onScroll() { nav.classList.toggle('nav-scrolled', window.scrollY > 40); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Menu per dispositivi mobile (Burger Menu)
  var mm = document.getElementById('mobile-menu');
  var burger = document.getElementById('burger');
  if (burger && mm) {
    burger.addEventListener('click', function () { mm.classList.toggle('hidden'); });
    mm.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mm.classList.add('hidden'); });
    });
  }

  /* ---------- ANIMAZIONI DI COMPARSA AL SCROLL (Reveal) ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting) {
          x.target.classList.add('in');
          io.unobserve(x.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  /* ---------- FUNZIONAMENTO MODULI DI CONTATTO (Web3Forms) ---------- */
  var WEB3_KEY = '018afc76-2989-4672-a209-6e10e62db8be';
  function sendForm(form, subject, okMsg) {
    var btn = form.querySelector('button'), label = btn ? btn.textContent : 'Invia';
    var fd = new FormData(form);
    fd.append('access_key', WEB3_KEY);
    fd.append('subject', subject);
    if (btn) { btn.disabled = true; btn.textContent = 'Invio...'; }

    fetch('https://web3forms.com', { method: 'POST', headers: { 'Accept': 'application/json' }, body: fd })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d.success) {
        toast(okMsg);
        form.reset();
      } else {
        throw new Error(d.message || 'errore');
      }
    })
    .catch(function (err) {
      console.error('Invio modulo fallito:', err);
      toast('Invio non riuscito: ' + err.message);
    })
    .then(function () {
      if (btn) { btn.disabled = false; btn.textContent = label; }
    });
  }

  // Aggancio dei listener ai form se presenti nella pagina corrente
  var cf = document.getElementById('contact-form');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault();
    sendForm(cf, 'Nuovo messaggio dal sito Officina Fotografica', 'Messaggio inviato con successo');
  });

  var nl = document.getElementById('newsletter');
  if (nl) nl.addEventListener('submit', function (e) {
    e.preventDefault();
    sendForm(nl, 'Nuova iscrizione newsletter - Officina Fotografica', 'Iscrizione completata');
  });

  // Aggiornamento automatico dell'anno corrente nel footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
