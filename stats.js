/* ixtli studio · contador de visitas propio y privado
   Sin cookies, sin guardar IP. Cuenta visitas y clics de contacto; los datos son tuyos (Cloudflare D1).
   No cuenta: navegadores con "No rastrear", desarrollo local, ni tu propio navegador si abres el sitio una vez con ?notrack=1
   (para volver a contarte: ?notrack=0). */
(function () {
  try {
    if (location.hostname !== 'jorddy01.github.io') return;
    if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
    if (/[?&]notrack=1/.test(location.search)) { try { localStorage.setItem('ixtliNoTrack', '1'); } catch (e) {} }
    if (/[?&]notrack=0/.test(location.search)) { try { localStorage.removeItem('ixtliNoTrack'); } catch (e) {} }
    var off = false; try { off = localStorage.getItem('ixtliNoTrack') === '1'; } catch (e) {}
    if (off) return;

    var URL_ = 'https://ixtli-stats.jorddydylanriveralopez.workers.dev/h';
    var path = location.pathname.replace(/^\/ixtli-studio-web/, '') || '/';
    var lang = (document.documentElement.lang || 'es').slice(0, 2);

    function send(o) {
      var b = JSON.stringify(o);
      try { if (navigator.sendBeacon && navigator.sendBeacon(URL_, new Blob([b], { type: 'text/plain' }))) return; } catch (e) {}
      try { fetch(URL_, { method: 'POST', body: b, keepalive: true, mode: 'no-cors' }); } catch (e) {}
    }

    send({ t: 'pv', p: path, l: lang, r: document.referrer, w: window.innerWidth });

    var last = {};
    function ev(n) {
      var now = Date.now();
      if (last[n] && now - last[n] < 1500) return; // evita contar dos veces el mismo clic
      last[n] = now;
      send({ t: 'ev', n: n, p: path, l: lang, w: window.innerWidth });
    }

    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest('a,button') : null;
      if (!t) return;
      var h = (t.getAttribute('href') || '').toLowerCase();
      if (t.matches('#langBtn,#langMBtn,.lang-pan a,.lang-ml a')) return ev('idioma');
      if (h.indexOf('wa.me') > -1 || h.indexOf('whatsapp.com') > -1) return ev('wa');
      if (h.indexOf('mailto:') === 0) return ev('mail');
      if (h.indexOf('tel:') === 0) return ev('tel');
      if (h.indexOf('instagram.com') > -1) return ev('ig');
      if (h.indexOf('linkedin.com') > -1) return ev('li');
      if (t.matches('.sv-go')) return ev('cotiza');
    }, true);

    var f = document.getElementById('qform');
    if (f) f.addEventListener('submit', function () { ev('Formulario enviado'); }, true);
  } catch (e) {}
})();
