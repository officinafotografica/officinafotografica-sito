/* Chat del sito: pulsante in basso a destra con due opzioni.
   - WhatsApp (sempre attivo, nessuna terza parte caricata)
   - Chat in diretta Tawk.to (gratuita): si attiva incollando qui sotto i due codici
     che si trovano in Tawk.to > Amministrazione > Canali > Chat widget > "Direct Chat Link"
     (l'indirizzo e' del tipo https://tawk.to/chat/PROPERTY_ID/WIDGET_ID).
   Tawk.to viene caricato SOLO se il visitatore sceglie "Chat in diretta". */
(function () {
  var CONFIG = {
    tawkProperty: '',            // <-- PROPERTY_ID
    tawkWidget: '',              // <-- WIDGET_ID (spesso "default" oppure un codice tipo 1abcd23ef)
    whatsapp: '393314667946',
    whatsappMsg: 'Ciao! Vorrei informazioni da Officina Fotografica.'
  };
  var hasTawk = !!(CONFIG.tawkProperty && CONFIG.tawkWidget);
  var wa = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(CONFIG.whatsappMsg);

  var fab = document.createElement('button');
  fab.id = 'chat-fab'; fab.className = 'btn-gold'; fab.setAttribute('aria-label', 'Scrivici');
  fab.innerHTML = '<i class="fa-solid fa-comments"></i>';

  var panel = document.createElement('div');
  panel.id = 'chat-panel';
  panel.innerHTML =
    '<p class="serif text-2xl text-white mb-1">Parliamo?</p>' +
    '<p class="text-gray-400 text-xs leading-6 mb-5">Scrivici per info su corsi, servizi e stampe.</p>' +
    (hasTawk ? '<button id="chat-live" class="btn-gold w-full px-4 py-3 mb-3 text-[.68rem] font-semibold uppercase tracking-[.2em]"><i class="fa-solid fa-comments mr-2"></i>Chat in diretta</button>' +
               '<p class="text-gray-500 text-[.65rem] leading-5 mb-4">La chat in diretta usa il servizio Tawk.to: avviandola accetti che il tuo messaggio sia trattato come descritto nella <a href="privacy.html" class="underline">privacy</a>.</p>' : '') +
    '<a href="' + wa + '" target="_blank" rel="noopener" class="btn-line block text-center w-full px-4 py-3 text-[.68rem] uppercase tracking-[.2em]"><i class="fa-brands fa-whatsapp mr-2"></i>Scrivici su WhatsApp</a>';

  document.body.appendChild(panel);
  document.body.appendChild(fab);

  fab.addEventListener('click', function () { panel.classList.toggle('open'); });

  var live = document.getElementById('chat-live');
  if (live) live.addEventListener('click', function () {
    live.disabled = true; live.textContent = 'Caricamento...';
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    window.Tawk_API.onLoad = function () {
      panel.classList.remove('open'); fab.style.display = 'none';
      window.Tawk_API.maximize();
    };
    var s = document.createElement('script');
    s.async = true; s.charset = 'UTF-8'; s.setAttribute('crossorigin', '*');
    s.src = 'https://embed.tawk.to/' + CONFIG.tawkProperty + '/' + CONFIG.tawkWidget;
    document.head.appendChild(s);
  });
})();
