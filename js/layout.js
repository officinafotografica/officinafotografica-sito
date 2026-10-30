/* Layout condiviso: menu, footer, lightbox, toast e barra di modifica.
   Per cambiare una voce di menu o il footer modificare solo questo file. */
(function () {
  var NAV = `<nav id="nav" class="fixed top-0 inset-x-0 z-40 px-6 py-5 transition-all duration-500">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <a href="index.html" class="flex items-center gap-3">
      <img data-img="logo" src="assets/img/logo.png" alt="Officina Fotografica" class="h-11 md:h-14 object-contain">
    </a>
    <div class="hidden lg:flex items-center gap-8 text-[.85rem] tracking-[.22em] uppercase">
      <a href="chi-siamo.html" data-nav="chi-siamo" class="nav-link">Chi Siamo</a>
      <a href="fotografia.html" data-nav="fotografia" class="nav-link">Fotografia</a>
      <a href="video.html" data-nav="video" class="nav-link">Video</a>
      <a href="index.html#corsi" class="nav-link">Corsi</a>
      <a href="index.html#portfolio" class="nav-link">Portfolio</a>
      <a href="blog.html" data-nav="blog" class="nav-link">Blog</a>
      <a href="index.html#contatti" class="btn-line px-5 py-2.5">Contatti</a>
      <span class="flex items-center gap-4 pl-2 border-l border-gold-500/25 text-sm normal-case tracking-normal">
        <a data-social="facebook" href="https://www.facebook.com/p/Officina-Fotografica-61578192890400/" target="_blank" rel="noopener" aria-label="Facebook" class="nav-link"><i class="fa-brands fa-facebook-f"></i></a>
        <a data-social="instagram" href="https://www.instagram.com/officinafotograficapro" target="_blank" rel="noopener" aria-label="Instagram" class="nav-link"><i class="fa-brands fa-instagram"></i></a>
        <a data-social="tiktok" href="https://www.tiktok.com/" target="_blank" rel="noopener" aria-label="TikTok" class="nav-link"><i class="fa-brands fa-tiktok"></i></a>
        <a data-social="whatsapp" href="https://wa.me/393314667946" target="_blank" rel="noopener" aria-label="WhatsApp" class="nav-link"><i class="fa-brands fa-whatsapp"></i></a>
        <a data-social="google" href="https://g.page/r/CYPS9e1s4CcmEAE" target="_blank" rel="noopener" aria-label="Google" class="nav-link"><i class="fa-brands fa-google"></i></a>
      </span>
    </div>
    <button id="burger" class="lg:hidden text-gold-300 text-xl" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
  </div>
  <div id="mobile-menu" class="hidden lg:hidden mt-4 bg-ink-900/95 backdrop-blur border border-gold-500/20 p-6 space-y-4 text-xs tracking-[.25em] uppercase text-center">
    <a href="chi-siamo.html" class="block text-gray-300">Chi Siamo</a>
    <a href="fotografia.html" class="block text-gray-300">Fotografia</a>
    <a href="video.html" class="block text-gray-300">Video</a>
    <a href="index.html#corsi" class="block text-gray-300">Corsi</a>
    <a href="index.html#portfolio" class="block text-gray-300">Portfolio</a>
    <a href="blog.html" class="block text-gray-300">Blog</a>
    <a href="index.html#contatti" class="block text-gold-400">Contatti</a>
    <div class="flex justify-center gap-4 pt-3 normal-case tracking-normal">
      <a data-social="facebook" href="https://www.facebook.com/p/Officina-Fotografica-61578192890400/" target="_blank" rel="noopener" aria-label="Facebook" class="social"><i class="fa-brands fa-facebook-f"></i></a>
      <a data-social="instagram" href="https://www.instagram.com/officinafotograficapro" target="_blank" rel="noopener" aria-label="Instagram" class="social"><i class="fa-brands fa-instagram"></i></a>
      <a data-social="tiktok" href="https://www.tiktok.com/" target="_blank" rel="noopener" aria-label="TikTok" class="social"><i class="fa-brands fa-tiktok"></i></a>
      <a data-social="whatsapp" href="https://wa.me/393314667946" target="_blank" rel="noopener" aria-label="WhatsApp" class="social"><i class="fa-brands fa-whatsapp"></i></a>
      <a data-social="google" href="https://g.page/r/CYPS9e1s4CcmEAE" target="_blank" rel="noopener" aria-label="Google" class="social"><i class="fa-brands fa-google"></i></a>
    </div>
  </div>
</nav>`;

  var FOOTER = `<footer class="py-10 px-6 text-center border-t border-gold-500/10 bg-ink-950">
  <img src="assets/img/logo.png" alt="Officina Fotografica" class="h-14 mx-auto mb-6 opacity-90">
  <nav class="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-6 text-[.68rem] uppercase tracking-[.25em]">
    <a href="chi-siamo.html" class="nav-link">Chi siamo</a><a href="fotografia.html" class="nav-link">Fotografia</a><a href="video.html" class="nav-link">Video</a><a href="blog.html" class="nav-link">Blog</a><a href="index.html#corsi" class="nav-link">Corsi</a><a href="index.html#contatti" class="nav-link">Contatti</a>
  </nav>
  <div class="flex justify-center gap-3 mb-6">
    <a data-social="facebook" href="https://www.facebook.com/p/Officina-Fotografica-61578192890400/" target="_blank" rel="noopener" aria-label="Facebook" class="social"><i class="fa-brands fa-facebook-f"></i></a>
    <a data-social="instagram" href="https://www.instagram.com/officinafotograficapro" target="_blank" rel="noopener" aria-label="Instagram" class="social"><i class="fa-brands fa-instagram"></i></a>
    <a data-social="tiktok" href="https://www.tiktok.com/" target="_blank" rel="noopener" aria-label="TikTok" class="social"><i class="fa-brands fa-tiktok"></i></a>
    <a data-social="whatsapp" href="https://wa.me/393314667946" target="_blank" rel="noopener" aria-label="WhatsApp" class="social"><i class="fa-brands fa-whatsapp"></i></a>
    <a data-social="google" href="https://g.page/r/CYPS9e1s4CcmEAE" target="_blank" rel="noopener" aria-label="Google" class="social"><i class="fa-brands fa-google"></i></a>
  </div>
  <p class="text-xs text-gray-500">© <span id="year"></span> Officina Fotografica · Castellammare di Stabia</p>
</footer>`;

  var EXTRAS = `<!-- LIGHTBOX -->
<div id="lightbox" class="fixed inset-0 z-[60] bg-black/95 hidden items-center justify-center p-6 cursor-zoom-out">
  <img id="lightbox-img" src="" alt="" class="max-h-full max-w-full object-contain shadow-2xl">
</div>

<!-- TOAST -->
<div id="toast" class="toast px-5 py-3 bg-ink-700 border border-gold-500/40 text-gold-200 text-xs tracking-wider"></div>

<!-- EDITOR DOCK -->
<div id="dock" class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 bg-ink-800/95 backdrop-blur border border-gold-500/30 shadow-2xl rounded-full text-xs">
  <button id="btn-edit" class="px-5 py-2.5 rounded-full bg-gold-500 text-ink-900 font-semibold flex items-center gap-2">
    <i class="fa-solid fa-pen"></i><span id="btn-edit-text">Modifica sito</span>
  </button>
  <div id="dock-tools" class="hidden items-center gap-1">
    <button id="btn-save" class="px-4 py-2.5 rounded-full text-gold-200 hover:bg-white/5 flex items-center gap-2"><i class="fa-solid fa-check"></i> Salva</button>
    <button id="btn-export" class="px-4 py-2.5 rounded-full text-gray-300 hover:bg-white/5 flex items-center gap-2" title="Scarica backup"><i class="fa-solid fa-download"></i></button>
    <label class="px-4 py-2.5 rounded-full text-gray-300 hover:bg-white/5 cursor-pointer" title="Importa backup"><i class="fa-solid fa-upload"></i><input id="file-import" type="file" accept=".json" class="hidden"></label>
    <button id="btn-reset" class="px-4 py-2.5 rounded-full text-red-400 hover:bg-red-500/10" title="Ripristina testi originali"><i class="fa-solid fa-rotate-left"></i></button>
  </div>
</div>
<input id="img-picker" type="file" accept="image/*" class="hidden">`;

  function put(id, html) { var el = document.getElementById(id); if (el) el.outerHTML = html; }
  put('site-nav', NAV);
  put('site-footer', FOOTER);
  put('site-extras', EXTRAS);

  /* Barra "Modifica sito": visibile solo in locale (file / localhost) oppure dopo aver aperto
     una pagina con ?admin=1 (si ricorda nel browser). Con ?admin=0 si nasconde di nuovo.
     I visitatori normali non la vedono. */
  var admin = false;
  try {
    var q = new URLSearchParams(location.search).get('admin');
    if (q === '1') localStorage.setItem('of_admin', '1');
    if (q === '0') localStorage.removeItem('of_admin');
    admin = localStorage.getItem('of_admin') === '1';
  } catch (e) {}
  if (/^(localhost|127\.0\.0\.1|)$/.test(location.hostname)) admin = true;   // "" = file:// aperto dal computer
  if (!admin) {
    var d = document.getElementById('dock'); if (d) d.style.display = 'none';
  }

  // voce di menu attiva in base alla pagina corrente
  var page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(function (l) {
    l.classList.toggle('active', l.dataset.nav === page);
  });

  // chat (pulsante in basso a destra)
  var c = document.createElement('script'); c.src = 'js/chat.js'; document.body.appendChild(c);
})();
