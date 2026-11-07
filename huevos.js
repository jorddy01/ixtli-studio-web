/* ixtli studio · huevos de pascua
   1) Toca el logo 5 veces seguidas  → la flor florece
   2) Toca a Luca 3 veces seguidas   → maúlla y deja huellitas
   3) Código Konami (↑↑↓↓←→←→ B A) o, en celular, desliza ↑↑↓↓←→←→ → lluvia de huellitas
   4) Abre la consola del navegador  → mensaje escondido
   5) Escribe  jorddy  (o, en celular, mantén presionado el © del pie) → la firma de quien creó el sitio
   Cada hallazgo se cuenta (sin datos personales) en el tablero de estadísticas. */
(function () {
  'use strict';
  var en = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COL = ['#FFB02E', '#FF6B57', '#24D6A5', '#3D3AF2', '#8a5cff'];
  var T = {
    flor: en ? 'Made with love in Mexico 🌸' : 'Hecho con cariño en México 🌸',
    luca: en ? 'Meow! Luca says hi 🐾' : '¡Miau! Luca te saluda 🐾',
    konami: en ? 'Konami code! Luca approves 🐾' : '¡Código Konami! Luca lo aprueba 🐾'
  };

  /* ---------- estilos ---------- */
  var st = document.createElement('style');
  st.textContent =
    '.hv-toast{position:fixed;left:50%;bottom:28px;z-index:100000;transform:translate(-50%,24px);opacity:0;background:#FFF8F0;color:#14122B;font:800 .98rem "Poppins",system-ui,sans-serif;padding:13px 22px;border-radius:99px;box-shadow:0 14px 34px rgba(20,18,43,.35);border:2px solid #FFB02E;pointer-events:none;transition:transform .35s cubic-bezier(.2,.9,.3,1.3),opacity .3s;max-width:calc(100vw - 32px);text-align:center}' +
    '.hv-toast.on{transform:translate(-50%,0);opacity:1}' +
    '.hv-p{position:fixed;z-index:99999;pointer-events:none;will-change:transform,opacity}' +
    '.hv-sig{position:fixed;inset:0;z-index:100002;display:flex;align-items:center;justify-content:center;background:rgba(34,31,140,.62);backdrop-filter:blur(5px);padding:16px;opacity:0;transition:opacity .35s;cursor:pointer}' +
    '.hv-sig.on{opacity:1}' +
    '.hv-card{position:relative;background:#FFF8F0;color:#14122B;border-radius:30px;border:3px solid #FFB02E;box-shadow:0 30px 80px rgba(0,0,0,.5);padding:26px 30px 22px;text-align:center;max-width:min(92vw,520px);transform:scale(.88) translateY(14px);transition:transform .5s cubic-bezier(.2,.9,.3,1.25);font-family:"Poppins",system-ui,sans-serif}' +
    '.hv-sig.on .hv-card{transform:none}' +
    '.hv-card svg{display:block;width:min(78vw,400px);height:auto;margin:0 auto}' +
    '.hv-k{font:700 .78rem "Nunito",system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6b6890;margin-top:2px}' +
    '.hv-n{font-weight:800;font-size:clamp(1.05rem,4.4vw,1.4rem);letter-spacing:-.01em;margin-top:2px}' +
    '.hv-s{font:700 .82rem "Nunito",system-ui,sans-serif;color:#6b6890;margin-top:8px}' +
    '.hv-x{position:absolute;right:12px;top:10px;width:34px;height:34px;border:0;border-radius:50%;background:rgba(20,18,43,.08);color:#14122B;font:700 1.2rem/1 system-ui;cursor:pointer}' +
    '.hv-bar{position:fixed;left:0;top:0;height:6px;width:100%;z-index:100000;pointer-events:none;background:linear-gradient(90deg,#FFB02E,#FF6B57,#8a5cff,#3D3AF2,#24D6A5,#FFB02E);transform-origin:left;transform:scaleX(0)}';
  document.head.appendChild(st);

  /* ---------- utilidades ---------- */
  function egg(n) { try { if (window.__ixtliEgg) window.__ixtliEgg(n); } catch (e) {} }

  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div'); toastEl.className = 'hv-toast';
      toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    void toastEl.offsetWidth; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 3000);
  }

  var PAW = '<svg viewBox="-60 -60 120 120" width="100%" height="100%"><g fill="currentColor"><ellipse cx="0" cy="12" rx="30" ry="24"/><ellipse cx="-34" cy="-14" rx="12" ry="17"/><ellipse cx="-12" cy="-30" rx="12" ry="17"/><ellipse cx="12" cy="-30" rx="12" ry="17"/><ellipse cx="34" cy="-14" rx="12" ry="17"/></g></svg>';
  function paw(x, y, size, color, rot) {
    var d = document.createElement('div'); d.className = 'hv-p';
    d.style.cssText = 'left:' + (x - size / 2) + 'px;top:' + (y - size / 2) + 'px;width:' + size + 'px;height:' + size + 'px;color:' + color + ';transform:rotate(' + (rot || 0) + 'deg)';
    d.innerHTML = PAW; document.body.appendChild(d); return d;
  }

  /* ---------- 1) la flor del logo ---------- */
  var logoClicks = [];
  function florece() {
    var lg = document.getElementById('lg'); if (!lg) return;
    var r = lg.getBoundingClientRect(), cx = r.left + r.width * 0.62, cy = r.top + r.height * 0.1;
    toast(T.flor); egg('flor');
    if (quieto) return;
    for (var i = 0; i < 22; i++) {
      var p = document.createElement('div'); p.className = 'hv-p';
      var w = 10 + Math.random() * 8, h = 20 + Math.random() * 12;
      p.style.cssText = 'left:' + (cx - w / 2) + 'px;top:' + (cy - h / 2) + 'px;width:' + w + 'px;height:' + h + 'px;border-radius:50%;background:' + COL[i % COL.length];
      document.body.appendChild(p);
      var a = (Math.PI * 2 * i) / 22 + Math.random() * 0.4, dist = 90 + Math.random() * 190;
      var an = p.animate([
        { transform: 'translate(0,0) rotate(' + (a * 57) + 'deg) scale(.4)', opacity: 1 },
        { transform: 'translate(' + Math.cos(a) * dist + 'px,' + (Math.sin(a) * dist + 40) + 'px) rotate(' + (a * 57 + 220) + 'deg) scale(1)', opacity: 0 }
      ], { duration: 1100 + Math.random() * 800, easing: 'cubic-bezier(.15,.8,.3,1)', fill: 'forwards' });
      an.onfinish = (function (el) { return function () { el.remove(); }; })(p);
    }
    try { lg.animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-6deg) scale(1.14)' }, { transform: 'rotate(4deg) scale(1.06)' }, { transform: 'none' }], { duration: 800, easing: 'ease-out' }); } catch (e) {}
  }

  /* ---------- 2) Luca: miau + huellitas ---------- */
  var lucaClicks = [];
  function maullar() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      var ctx = maullar.ctx || (maullar.ctx = new AC()); if (ctx.state === 'suspended') ctx.resume();
      var t = ctx.currentTime, dur = .8;
      var o = ctx.createOscillator(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(430, t);
      o.frequency.exponentialRampToValueAtTime(860, t + .2);
      o.frequency.exponentialRampToValueAtTime(660, t + .5);
      o.frequency.exponentialRampToValueAtTime(380, t + dur);
      var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 7; lg.gain.value = 14; lfo.connect(lg); lg.connect(o.frequency);
      var f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.Q.value = 5;
      f1.frequency.setValueAtTime(700, t); f1.frequency.linearRampToValueAtTime(1150, t + .25); f1.frequency.linearRampToValueAtTime(600, t + dur);
      var f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.Q.value = 7;
      f2.frequency.setValueAtTime(1800, t); f2.frequency.linearRampToValueAtTime(2700, t + .25); f2.frequency.linearRampToValueAtTime(1400, t + dur);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1.2, t + .07); g.gain.setValueAtTime(1.2, t + .42); g.gain.exponentialRampToValueAtTime(.001, t + dur);
      o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g); g.connect(ctx.destination);
      o.start(t); lfo.start(t); o.stop(t + dur + .05); lfo.stop(t + dur + .05);
    } catch (e) {}
  }
  function lucaRect(x, y) {
    var sel = ['.peek', '.nm-cat', '.f-cat', '.pet'];
    for (var i = 0; i < sel.length; i++) {
      var els = document.querySelectorAll(sel[i]);
      for (var j = 0; j < els.length; j++) {
        var el = els[j], cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.3) continue;
        var r = el.getBoundingClientRect();
        if (r.width < 20 || r.height < 20) continue;
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return r;
      }
    }
    return null;
  }
  function huellitas(r) {
    toast(T.luca); egg('luca'); maullar();
    if (quieto) return;
    var sx = r.left + r.width / 2, sy = Math.min(window.innerHeight - 40, Math.max(40, r.top + r.height * 0.7));
    var dir = sx > window.innerWidth / 2 ? -1 : 1, step = 62, n = Math.min(16, Math.ceil((dir < 0 ? sx : window.innerWidth - sx) / step) + 1);
    for (var i = 0; i < n; i++) {
      (function (i) {
        setTimeout(function () {
          var x = sx + dir * (i + 1) * step, y = sy + (i % 2 ? 20 : -20) + Math.sin(i * 0.6) * 14;
          var d = paw(x, y, 38, '#FFB02E', dir > 0 ? 90 : -90);
          d.animate([{ opacity: 0, transform: d.style.transform + ' scale(.4)' }, { opacity: .95, transform: d.style.transform + ' scale(1)', offset: .15 }, { opacity: .95, offset: .75 }, { opacity: 0 }],
            { duration: 2300, fill: 'forwards' }).onfinish = function () { d.remove(); };
        }, i * 110);
      })(i);
    }
  }

  /* ---------- 3) Konami: lluvia de huellitas ---------- */
  function lluvia() {
    toast(T.konami); egg('konami');
    if (quieto) return;
    var bar = document.createElement('div'); bar.className = 'hv-bar'; document.body.appendChild(bar);
    bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 3200, easing: 'ease-in-out', fill: 'forwards' }).onfinish = function () {
      bar.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }).onfinish = function () { bar.remove(); };
    };
    var W = window.innerWidth, H = window.innerHeight;
    for (var i = 0; i < 42; i++) {
      (function (i) {
        setTimeout(function () {
          var s = 20 + Math.random() * 30, x = Math.random() * W, rot = Math.random() * 360;
          var d = paw(x, -40, s, COL[i % COL.length], rot);
          d.animate([{ transform: 'translateY(0) rotate(' + rot + 'deg)', opacity: 1 }, { transform: 'translateY(' + (H + 90) + 'px) rotate(' + (rot + 240) + 'deg)', opacity: .9 }],
            { duration: 2200 + Math.random() * 2000, easing: 'cubic-bezier(.4,0,.8,.6)', fill: 'forwards' }).onfinish = function () { d.remove(); };
        }, Math.random() * 1700);
      })(i);
    }
  }
  var SEQ = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], pos = 0;
  document.addEventListener('keydown', function (e) {
    var t = e.target && e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || (e.target && e.target.isContentEditable)) { pos = 0; return; }
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === SEQ[pos]) { pos++; if (pos === SEQ.length) { pos = 0; lluvia(); } }
    else pos = (k === SEQ[0]) ? 1 : 0;
  });
  // celular: desliza ↑ ↑ ↓ ↓ ← → ← →
  var TSEQ = ['u', 'u', 'd', 'd', 'l', 'r', 'l', 'r'], swipes = [], tx = 0, ty = 0, tt = 0;
  document.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; tt = Date.now(); } }, { passive: true });
  document.addEventListener('touchend', function (e) {
    var c = e.changedTouches && e.changedTouches[0]; if (!c) return;
    var dx = c.clientX - tx, dy = c.clientY - ty;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 60) return;
    var now = Date.now(); if (swipes.length && now - swipes[swipes.length - 1].t > 6000) swipes = [];
    swipes.push({ d: Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u'), t: now });
    if (swipes.length > TSEQ.length) swipes.shift();
    if (swipes.length === TSEQ.length && swipes.every(function (s, i) { return s.d === TSEQ[i]; })) { swipes = []; lluvia(); }
  }, { passive: true });

  /* ---------- clics: logo y Luca ---------- */
  document.addEventListener('click', function (e) {
    var now = Date.now();
    if (e.target && e.target.closest && e.target.closest('#lg,.logo')) {
      // ya estás arriba: no saltes ni repitas la animación del logo con cada clic
      if ((window.scrollY || 0) < 80) e.preventDefault();
      logoClicks = logoClicks.filter(function (t) { return now - t < 3000; }); logoClicks.push(now);
      if (logoClicks.length >= 5) { logoClicks = []; florece(); }
      return;
    }
    if (e.target && e.target.closest && e.target.closest('a,button,input,textarea,select,label')) return;
    var r = lucaRect(e.clientX, e.clientY);
    if (!r) return;
    lucaClicks = lucaClicks.filter(function (t) { return now - t < 4000; }); lucaClicks.push(now);
    if (lucaClicks.length >= 3) { lucaClicks = []; huellitas(r); }
  }, true);

  /* ---------- 5) la firma de quien creó el sitio ---------- */
  var firmaAbierta = false;
  function firma() {
    if (firmaAbierta) return; firmaAbierta = true; egg('firma');
    try { if (!document.getElementById('hv-font')) { var lk = document.createElement('link'); lk.id = 'hv-font'; lk.rel = 'stylesheet'; lk.href = 'https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&family=Caveat:wght@700&display=swap'; document.head.appendChild(lk); } } catch (e) {}
    var ov = document.createElement('div'); ov.className = 'hv-sig'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', en ? 'Signature' : 'Firma');
    var petals = ''; for (var i = 0; i < 8; i++) petals += '<ellipse cy="-9" rx="4.6" ry="8" fill="' + (i < 4 ? '#FFB02E' : '#FF6B57') + '" transform="rotate(' + (i * 45) + ')"/>';
    ov.innerHTML = '<div class="hv-card"><button class="hv-x" type="button" aria-label="' + (en ? 'Close' : 'Cerrar') + '">×</button>' +
      '<svg viewBox="0 0 440 150" role="img" aria-label="Jorddy"><defs><clipPath id="hv-cp"><rect id="hv-cr" x="0" y="0" width="0" height="150"/></clipPath></defs>' +
      '<text x="18" y="96" font-family="\'Mrs Saint Delafield\',Caveat,cursive" font-size="112" fill="#14122B" clip-path="url(#hv-cp)">Jorddy</text>' +
      '<path id="hv-u" d="M22 122 C120 104 236 134 392 100" stroke="#FF6B57" stroke-width="4.5" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>' +
      '<g id="hv-f" transform="translate(402 62) scale(0)">' + petals + '<circle r="4.2" fill="#FFF8F0"/></g></svg>' +
      '<div class="hv-k">' + (en ? 'Design & development' : 'Diseño y desarrollo') + '</div><div class="hv-n">Jorddy Dylan Rivera López</div>' +
      '<div class="hv-s">ixtli studio · 2026 · ' + (en ? 'Made with love in Mexico 🌸' : 'Hecho con cariño en México 🌸') + '</div></div>';
    document.body.appendChild(ov);
    function cerrar() { if (!firmaAbierta) return; firmaAbierta = false; document.removeEventListener('keydown', esc, true); ov.classList.remove('on'); setTimeout(function () { ov.remove(); }, 400); }
    function esc(e) { if (e.key === 'Escape') cerrar(); }
    var nacio = Date.now(); // al soltar el dedo tras mantener presionado llega un clic: se ignora el primer segundo
    ov.addEventListener('click', function () { if (Date.now() - nacio > 1000) cerrar(); }); ov.querySelector('.hv-x').addEventListener('click', function (e) { e.stopPropagation(); if (Date.now() - nacio > 1000) cerrar(); });
    document.addEventListener('keydown', esc, true);
    requestAnimationFrame(function () { ov.classList.add('on'); });
    setTimeout(cerrar, 11000);
    var go = function () {
      var rect = ov.querySelector('#hv-cr'), u = ov.querySelector('#hv-u'), fl = ov.querySelector('#hv-f');
      if (!rect || !rect.animate) { if (rect) rect.setAttribute('width', '440'); if (u) u.setAttribute('stroke-dashoffset', '0'); if (fl) fl.setAttribute('transform', 'translate(402 62) scale(1.1)'); return; }
      rect.animate([{ width: '0px' }, { width: '440px' }], { duration: quieto ? 1 : 1900, delay: 350, easing: 'cubic-bezier(.45,.05,.35,1)', fill: 'forwards' });
      u.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: quieto ? 1 : 800, delay: quieto ? 0 : 2150, easing: 'ease-out', fill: 'forwards' });
      var fa = fl.animate([{ transform: 'translate(402px,62px) scale(0) rotate(-90deg)' }, { transform: 'translate(402px,62px) scale(1.35) rotate(15deg)', offset: .7 }, { transform: 'translate(402px,62px) scale(1.1) rotate(0deg)' }], { duration: quieto ? 1 : 700, delay: quieto ? 0 : 2800, easing: 'cubic-bezier(.2,.9,.3,1.3)', fill: 'forwards' });
      if (!quieto) setTimeout(function () {
        var r = fl.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        for (var i = 0; i < 18; i++) {
          var p = document.createElement('div'); p.className = 'hv-p'; p.style.zIndex = 100003;
          var w = 9 + Math.random() * 7, h = 18 + Math.random() * 10;
          p.style.cssText = 'left:' + (cx - w / 2) + 'px;top:' + (cy - h / 2) + 'px;width:' + w + 'px;height:' + h + 'px;border-radius:50%;z-index:100003;background:' + COL[i % COL.length];
          document.body.appendChild(p); var a = (Math.PI * 2 * i) / 18 + Math.random() * .4, dist = 70 + Math.random() * 150;
          var an = p.animate([{ transform: 'translate(0,0) rotate(' + (a * 57) + 'deg) scale(.4)', opacity: 1 }, { transform: 'translate(' + Math.cos(a) * dist + 'px,' + (Math.sin(a) * dist + 30) + 'px) rotate(' + (a * 57 + 200) + 'deg) scale(1)', opacity: 0 }], { duration: 1000 + Math.random() * 700, easing: 'cubic-bezier(.15,.8,.3,1)', fill: 'forwards' });
          an.onfinish = (function (el) { return function () { el.remove(); }; })(p);
        }
      }, 2850);
    };
    var started = false, start = function () { if (!started) { started = true; go(); } };
    try { if (document.fonts && document.fonts.load) { Promise.race([document.fonts.load('112px "Mrs Saint Delafield"'), new Promise(function (r) { setTimeout(r, 1500); })]).then(start, start); } else start(); } catch (e) { start(); }
  }
  window.ixtliFirma = firma;
  var fbuf = '';
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || !e.key || e.key.length !== 1) return;
    var t = e.target && e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || (e.target && e.target.isContentEditable)) { fbuf = ''; return; }
    fbuf = (fbuf + e.key.toLowerCase()).slice(-6);
    if (fbuf === 'jorddy') { fbuf = ''; firma(); }
  });
  // celular: mantén presionado el "© 2026 ixtli studio" del pie de página
  (function () {
    var timer = 0, sx = 0, sy = 0;
    function stop() { clearTimeout(timer); timer = 0; }
    document.addEventListener('pointerdown', function (e) {
      var el = e.target && e.target.closest ? e.target.closest('.sf-bar') : null; if (!el || e.target.closest('a,button')) return;
      stop(); sx = e.clientX; sy = e.clientY; timer = setTimeout(function () { timer = 0; firma(); }, 1200);
    }, true);
    document.addEventListener('pointermove', function (e) { if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 12) stop(); }, true);
    ['pointerup', 'pointercancel'].forEach(function (n) { document.addEventListener(n, stop, true); });
  })();

  /* ---------- 4) mensaje escondido en la consola ---------- */
  try {
    console.log('%cixtli%c studio', 'font:800 34px/1.2 system-ui,sans-serif;color:#3D3AF2', 'font:800 34px/1.2 system-ui,sans-serif;color:#FFB02E');
    console.log('%c /\\_/\\\n( o.o )  ' + (en ? 'Psst… Luca saw you open the console.' : 'Psst… Luca vio que abriste la consola.') + '\n > ^ <', 'font:600 15px/1.4 ui-monospace,Menlo,monospace;color:#FF6B57');
    console.log('%c' + (en ? 'Do you like looking under the hood? 👀 We like curious people.\nLet\'s build something together: WhatsApp +52 56 2957 3030' : '¿Te gusta ver cómo está hecho? 👀 Nos caen bien los curiosos.\nHagamos algo juntos: WhatsApp 56 2957 3030'), 'font:600 14px/1.5 system-ui,sans-serif;color:#6b6890');
    console.log('%c' + (en ? 'Tip: touch the logo 5 times, or Luca 3 times. And try typing the name of the studio on your keyboard… 🎮' : 'Pista: toca el logo 5 veces, o a Luca 3 veces. Y prueba escribir en tu teclado el nombre del estudio… 🎮'), 'font:700 12px system-ui,sans-serif;color:#24D6A5');
    console.log('%c' + (en ? 'Hidden signature: type the name of whoever made this site ✍️' : 'Firma escondida: escribe el nombre de quien creó este sitio ✍️'), 'font:700 12px system-ui,sans-serif;color:#FFB02E');
    console.log('%c' + (en ? 'Designed and developed by Jorddy Dylan Rivera López' : 'Diseñado y desarrollado por Jorddy Dylan Rivera López'), 'font:800 13px system-ui,sans-serif;color:#3D3AF2');
  } catch (e) {}
})();
