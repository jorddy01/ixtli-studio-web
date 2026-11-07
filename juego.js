/* ixtli studio · videojuego escondido: "Luca corre"
   Se abre escribiendo  i x t l i  en el teclado (no hace falta ningún campo de texto).
   En celular: toca 5 veces seguidas la línea de derechos de autor del pie de página.
   Controles: Espacio / ↑ / W / toque = saltar (otra vez en el aire = doble salto, mantén para saltar más alto)
              ↓ / S / deslizar ↓ = agacharse (y caer rápido en el aire)    P = pausa    Esc = cerrar */
(function () {
  'use strict';
  var en = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var cs = document.currentScript, BASE = (cs && cs.src) ? cs.src.replace(/juego\.js.*$/, '') : '';
  var SITE = location.href.split('?')[0].split('#')[0].replace(/en\/?$/, '');
  var WA = 'https://wa.me/525629573030?text=' + encodeURIComponent(en ? 'Hi ixtli studio, I just played Luca\'s game and I want a quote for my website' : 'Hola ixtli studio, jugué el juego de Luca y quiero cotizar mi página');
  var T = en ? {
    title: 'Luca runs', sub: 'Dodge bugs, 404s, pop-ups and spam. Grab flowers, build combos!', start: 'Start',
    keys: ['Space / tap', 'jump (again in the air = double jump)'], keys2: ['↓ / swipe down', 'duck under spam'],
    again: 'Play again', cta: 'I want my website →', close: 'Close', pause: 'Pause', resume: 'Tap or press P to resume', share: 'Share', copied: 'Copied! Paste it anywhere 🐾',
    pts: 'Points', best: 'Best', combo: 'Combo', newbest: 'NEW RECORD!',
    over: { bug: 'Ouch! A bug got you 🐞', err: 'Error 404: Luca not found 🙀', pop: 'A pop-up stopped you 😵', spam: 'Spam straight to the face 📧' },
    lv: ['Launch morning', 'Delivery afternoon', 'Deploy night', 'Rainbow mode!'], lvl: 'Level',
    hit: { bug: 'CRUNCH!', err: '404!', pop: 'POP!', spam: 'SPAM!' },
    pw: { turbo: 'TURBO!', shield: 'Wi-Fi shield!', magnet: 'Flower magnet!' },
    mile: { 100: 'First page published!', 300: 'SEO on!', 600: 'Happy client!', 1000: 'You are a pro!', 1500: 'Legend!' }, shieldHit: 'Shield saved you!',
    unlock: '🎁 Secret prize unlocked!', prizeT: 'Secret prize', prize: '10% off your project. Show your code on WhatsApp.', claim: 'Claim my prize 🎁', code: 'Your code', near: function (n) { return 'So close! Only ' + n + ' points from something special 🎁'; },
    wonMsg: function (c, p) { return 'Hi ixtli studio! I unlocked Luca\'s secret prize 🎁 My code: ' + c + ' (' + p + ' points). I want my 10% discount.'; }
  } : {
    title: 'Luca corre', sub: 'Esquiva bugs, 404, pop-ups y spam. ¡Junta flores y arma combos!', start: 'Empezar',
    keys: ['Espacio / toque', 'saltar (otra vez en el aire = doble salto)'], keys2: ['↓ / deslizar ↓', 'agacharte bajo el spam'],
    again: 'Jugar otra vez', cta: 'Quiero mi página →', close: 'Cerrar', pause: 'Pausa', resume: 'Toca o presiona P para seguir', share: 'Compartir', copied: '¡Copiado! Pégalo donde quieras 🐾',
    pts: 'Puntos', best: 'Récord', combo: 'Combo', newbest: '¡NUEVO RÉCORD!',
    over: { bug: '¡Auch! Te atrapó un bug 🐞', err: 'Error 404: Luca no encontrada 🙀', pop: '¡Un pop-up te detuvo! 😵', spam: '¡Spam directo a la cara! 📧' },
    lv: ['Mañana de lanzamiento', 'Tarde de entregas', 'Noche de deploy', '¡Modo arcoíris!'], lvl: 'Nivel',
    hit: { bug: '¡CRUNCH!', err: '¡404!', pop: '¡POP!', spam: '¡SPAM!' },
    pw: { turbo: '¡TURBO!', shield: '¡Escudo Wi-Fi!', magnet: '¡Imán de flores!' },
    mile: { 100: '¡Primera página publicada!', 300: '¡SEO activado!', 600: '¡Cliente feliz!', 1000: '¡Eres un crack!', 1500: '¡Leyenda!' }, shieldHit: '¡El escudo te salvó!',
    unlock: '🎁 ¡Premio secreto desbloqueado!', prizeT: 'Premio secreto', prize: '10% de descuento en tu proyecto. Muestra tu código por WhatsApp.', claim: 'Reclamar mi premio 🎁', code: 'Tu código', near: function (n) { return '¡Casi! Te faltan ' + n + ' puntos para algo especial 🎁'; },
    wonMsg: function (c, p) { return '¡Hola ixtli studio! Desbloqueé el premio secreto de Luca 🎁 Mi código: ' + c + ' (' + p + ' puntos). Quiero mi 10% de descuento.'; }
  };

  var open = false, root, cv, ctx, W, H, DPR, GY, raf = 0, last = 0, st = 'ready', lastFocus, G, L, held = false, downHeld = false, paused = false;
  var sheet = new Image(), sheetOk = false; sheet.onload = function () { sheetOk = true; }; sheet.src = BASE + 'img/gato-sheet.webp';
  var best = 0; try { best = +localStorage.getItem('ixtliJuegoBest') || 0; } catch (e) {}
  var prizeCode = ''; try { prizeCode = localStorage.getItem('ixtliJuegoPremio') || ''; } catch (e) {}
  var PRIZE_AT = 1000;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ================= AUDIO ================= */
  var A = (function () {
    var ac = null, master, mus, on = true, timer = 0, step = 0, nextT = 0, playing = false;
    try { on = localStorage.getItem('ixtliJuegoSnd') !== '0'; } catch (e) {}
    function init() {
      if (ac) { if (ac.state === 'suspended') ac.resume(); return ac; }
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      ac = new AC(); master = ac.createGain(); master.gain.value = on ? 1 : 0; master.connect(ac.destination);
      mus = ac.createGain(); mus.gain.value = .55; mus.connect(master); return ac;
    }
    function tone(f, d, type, vol, to, when, dest) {
      if (!ac || !on) return; var t = when || ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'square'; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol || .05, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + d);
      o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + d + .03);
    }
    function noise(d, vol) {
      if (!ac || !on) return; var n = Math.floor(ac.sampleRate * d), b = ac.createBuffer(1, n, ac.sampleRate), x = b.getChannelData(0);
      for (var i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n);
      var s = ac.createBufferSource(), g = ac.createGain(), f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1800; g.gain.value = vol;
      s.buffer = b; s.connect(f); f.connect(g); g.connect(master); s.start();
    }
    var LEAD = [523, 659, 784, 659, 880, 784, 659, 523, 587, 740, 880, 740, 988, 880, 740, 587], BASS = [131, 131, 196, 196, 175, 175, 196, 196];
    function sched() {
      if (!ac || !playing) return;
      while (nextT < ac.currentTime + .14) {
        var s = step % 16, bpm = 128 + Math.min(40, (G ? G.lvl : 0) * 10), sd = 60 / bpm / 2;
        tone(LEAD[s], sd * .9, 'square', .018, null, nextT, mus);
        if (s % 2 === 0) tone(BASS[(s / 2) % 8], sd * 1.7, 'triangle', .05, null, nextT, mus);
        nextT += sd; step++;
      }
    }
    function at(i, s) { return ac ? ac.currentTime + i * s : 0; }
    return {
      init: init,
      get on() { return on; },
      toggle: function () { on = !on; try { localStorage.setItem('ixtliJuegoSnd', on ? '1' : '0'); } catch (e) {} init(); if (master) master.gain.value = on ? 1 : 0; return on; },
      music: function (go) { init(); if (!ac) return; if (go && !playing) { playing = true; nextT = ac.currentTime + .05; step = 0; timer = setInterval(sched, 40); } if (!go && playing) { playing = false; clearInterval(timer); } },
      jump: function () { init(); tone(380, .13, 'square', .05, 780); },
      dbl: function () { tone(560, .14, 'square', .05, 1200); },
      land: function () { noise(.05, .03); },
      flower: function (c) { tone(660 * Math.pow(1.0595, Math.min(14, c)), .1, 'triangle', .07); },
      star: function () { [784, 988, 1319, 1568].forEach(function (f, i) { tone(f, .14, 'triangle', .07, null, at(i, .06)); }); },
      power: function () { [440, 554, 659, 880].forEach(function (f, i) { tone(f, .12, 'square', .045, null, at(i, .055)); }); },
      smash: function () { noise(.14, .08); tone(320, .1, 'square', .05, 110); },
      hit: function () { noise(.4, .13); tone(190, .45, 'sawtooth', .07, 55); },
      level: function () { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, .16, 'square', .05, null, at(i, .07)); }); },
      shield: function () { tone(900, .2, 'sine', .08, 300); }
    };
  })();

  /* ================= ESTILOS Y DOM ================= */
  var css = document.createElement('style');
  css.textContent =
    '#jg{position:fixed;inset:0;z-index:100001;display:none;align-items:center;justify-content:center;background:rgba(14,12,34,.86);backdrop-filter:blur(6px);padding:10px;-webkit-tap-highlight-color:transparent}' +
    '#jg.on{display:flex;animation:jgin .25s ease-out}@keyframes jgin{from{opacity:0}to{opacity:1}}' +
    '.jg-box{position:relative;width:min(980px,100%);outline:none;border-radius:26px;overflow:hidden;background:#3D3AF2;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 4px #FFB02E;user-select:none;-webkit-user-select:none;touch-action:none}' +
    '#jg canvas{display:block;width:100%;height:auto;touch-action:none}' +
    '.jg-top{position:absolute;right:10px;top:10px;display:flex;gap:8px;z-index:4}' +
    '.jg-ib{width:38px;height:38px;border-radius:50%;border:0;background:rgba(255,255,255,.2);color:#fff;font:700 1.1rem/1 system-ui;cursor:pointer;display:grid;place-items:center}' +
    '.jg-ib:hover{background:rgba(255,255,255,.34)}.jg-ib:focus-visible{outline:3px solid #FFB02E}' +
    '.jg-msg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;text-align:center;padding:16px;color:#fff;font-family:"Poppins",system-ui,sans-serif;background:rgba(20,18,43,.5);z-index:3}' +
    '.jg-msg[hidden]{display:none}' +
    '.jg-msg{overflow-y:auto;justify-content:safe center}' +
    '@media (max-width:560px){.jg-msg{gap:5px;padding:8px 10px 14px}#jg-sc{font-size:.72rem!important}.jg-msg h2{font-size:1.2rem}.jg-prize{padding:6px 10px;border-radius:14px}.jg-prize b{font-size:.92rem}.jg-prize code{font-size:.9rem;padding:2px 9px;margin-top:2px}.jg-btns{gap:6px;margin-top:2px}.jg-btn{padding:9px 14px;font-size:.78rem}.jg-new{font-size:.7rem;padding:3px 10px}.jg-msg p{font-size:.78rem}}' +
    '.jg-msg h2{font-size:clamp(1.4rem,5.2vw,2.4rem);font-weight:800;letter-spacing:-.02em;line-height:1.1}' +
    '.jg-msg h2 em{font-style:normal;color:#FFB02E}' +
    '.jg-msg p{font:700 clamp(.82rem,2.5vw,1.02rem) "Nunito",system-ui,sans-serif;opacity:.95;max-width:32em}' +
    '.jg-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:4px}' +
    '.jg-btn{font:800 clamp(.85rem,2.7vw,1.02rem) "Poppins",system-ui,sans-serif;border:0;border-radius:99px;padding:12px 22px;cursor:pointer;text-decoration:none;display:inline-block;transition:transform .15s}' +
    '.jg-btn:hover{transform:translateY(-2px)}.jg-btn:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
    '.jg-btn[hidden],.jg-prize[hidden]{display:none!important}' +
    '.jg-a{background:#FFB02E;color:#14122B}.jg-b{background:#24D6A5;color:#14122B}.jg-c{background:rgba(255,255,255,.2);color:#fff}' +
    '.jg-keys{display:grid;gap:6px;margin-top:2px;font:700 clamp(.72rem,2.2vw,.88rem) "Nunito",system-ui,sans-serif}' +
    '.jg-keys span{background:rgba(255,255,255,.14);border-radius:10px;padding:6px 12px}.jg-keys b{color:#FFB02E}' +
    '.jg-new{display:inline-block;background:#FF6B57;color:#fff;font:800 .85rem "Poppins",system-ui;border-radius:99px;padding:5px 14px;animation:jgpop .6s ease infinite alternate}@keyframes jgpop{to{transform:scale(1.12) rotate(-3deg)}}' +
    '.jg-gold{background:linear-gradient(135deg,#FFD66B,#FFB02E);color:#14122B;box-shadow:0 0 0 3px rgba(255,255,255,.35),0 8px 24px rgba(255,176,46,.5);animation:jgglow 1.6s ease-in-out infinite alternate}@keyframes jgglow{to{box-shadow:0 0 0 6px rgba(255,255,255,.2),0 8px 34px rgba(255,176,46,.85)}}' +
    '.jg-prize{background:rgba(255,255,255,.14);border:2px dashed #FFB02E;border-radius:18px;padding:10px 16px;max-width:30em;font:700 clamp(.78rem,2.3vw,.95rem) "Nunito",system-ui,sans-serif}' +
    '.jg-prize b{display:block;font:800 clamp(.95rem,3vw,1.15rem) "Poppins",system-ui;color:#FFB02E;margin-bottom:2px}' +
    '.jg-prize code{display:inline-block;margin-top:4px;background:#14122B;color:#FFD66B;border-radius:10px;padding:4px 12px;font:800 1.05rem ui-monospace,Menlo,monospace;letter-spacing:.08em}' +
    '.jg-toast{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);background:#FFF8F0;color:#14122B;font:800 .85rem "Poppins",system-ui;padding:9px 16px;border-radius:99px;z-index:6;pointer-events:none;opacity:0;transition:opacity .25s}.jg-toast.on{opacity:1}';
  document.head.appendChild(css);

  function build() {
    root = document.createElement('div'); root.id = 'jg'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', T.title);
    root.innerHTML =
      '<div class="jg-box" tabindex="-1"><canvas></canvas>' +
      '<div class="jg-top"><button class="jg-ib" type="button" data-snd aria-label="Sonido">🔊</button><button class="jg-ib" type="button" data-pause aria-label="' + T.pause + '">⏸</button><button class="jg-ib jg-x" type="button" aria-label="' + T.close + '">×</button></div>' +
      '<div class="jg-msg" id="jg-start"><h2>' + T.title.replace(/(\S+)$/, '<em>$1</em>') + '</h2><p>' + T.sub + '</p>' +
      '<div class="jg-keys"><span><b>' + T.keys[0] + '</b> · ' + T.keys[1] + '</span><span><b>' + T.keys2[0] + '</b> · ' + T.keys2[1] + '</span></div>' +
      '<div class="jg-btns"><button class="jg-btn jg-a" type="button" data-go>' + T.start + '</button></div></div>' +
      '<div class="jg-msg" id="jg-pause" hidden><h2>⏸ ' + T.pause + '</h2><p>' + T.resume + '</p></div>' +
      '<div class="jg-msg" id="jg-over" hidden><div id="jg-nb" hidden><span class="jg-new">' + T.newbest + '</span></div><h2 id="jg-ot"></h2><p id="jg-sc"></p><div class="jg-prize" id="jg-prize" hidden><b>🎁 ' + T.prizeT + '</b><span>' + T.prize + '</span><br><span>' + T.code + ': </span><code id="jg-code"></code></div><p id="jg-near" hidden></p>' +
      '<div class="jg-btns"><button class="jg-btn jg-a" type="button" data-go>' + T.again + '</button><a class="jg-btn jg-gold" id="jg-claim" href="#" target="_blank" rel="noopener" hidden>' + T.claim + '</a><a class="jg-btn jg-b" id="jg-cta" href="' + WA + '" target="_blank" rel="noopener">' + T.cta + '</a><button class="jg-btn jg-c" type="button" data-share>' + T.share + '</button></div></div>' +
      '<div class="jg-toast" id="jg-toast"></div></div>';
    document.body.appendChild(root);
    cv = root.querySelector('canvas'); ctx = cv.getContext('2d');
    root.querySelector('.jg-x').addEventListener('click', close);
    root.querySelector('[data-pause]').addEventListener('click', function (e) { e.stopPropagation(); togglePause(); });
    var sb = root.querySelector('[data-snd]'); sb.textContent = A.on ? '🔊' : '🔇';
    sb.addEventListener('click', function (e) { e.stopPropagation(); var o = A.toggle(); sb.textContent = o ? '🔊' : '🔇'; if (o && st === 'run' && !paused) A.music(true); });
    root.addEventListener('mousedown', function (e) { if (e.target === root) close(); });
    root.querySelectorAll('[data-go]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); begin(); }); });
    root.querySelector('#jg-claim').addEventListener('click', function (e) { e.stopPropagation(); try { if (window.__ixtliEgg) window.__ixtliEgg('juego-premio'); } catch (x) {} });
    root.querySelector('[data-share]').addEventListener('click', function (e) { e.stopPropagation(); share(); });
    root.querySelector('#jg-pause').addEventListener('pointerdown', function (e) { e.preventDefault(); togglePause(); });
    root.querySelector('#jg-start').addEventListener('pointerdown', function (e) { if (e.target.closest('button,a')) return; e.preventDefault(); A.init(); begin(); });
    root.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    // toque / ratón sobre el lienzo: saltar; deslizar hacia abajo: agacharse
    var sy = 0, sid = -1;
    cv.addEventListener('pointerdown', function (e) {
      e.preventDefault(); A.init();
      if (st === 'ready') { begin(); return; }
      if (st !== 'run' || paused) return;
      sy = e.clientY; sid = e.pointerId; pressJump(); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    });
    cv.addEventListener('pointermove', function (e) { if (e.pointerId === sid && e.clientY - sy > 34) { sid = -1; startDuck(.55); } });
    function up() { sid = -1; releaseJump(); }
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  }
  function size() {
    W = window.innerWidth < 700 ? 480 : 900; H = 390; GY = H - 62; DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function toast(m) { var t = root.querySelector('#jg-toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('on'); }, 2200); }

  /* ================= ESTADO ================= */
  var PAL = [
    { top: [61, 58, 242], bot: [106, 61, 240], gr: [255, 248, 240], gl: [231, 226, 242], pw: [255, 176, 46], st: 0, sun: [255, 176, 46] },
    { top: [122, 63, 238], bot: [255, 107, 87], gr: [255, 236, 226], gl: [240, 205, 196], pw: [255, 150, 60], st: .15, sun: [255, 120, 70] },
    { top: [18, 16, 44], bot: [50, 44, 110], gr: [44, 40, 96], gl: [86, 80, 160], pw: [255, 200, 90], st: 1, sun: [255, 248, 225] },
    { top: [36, 214, 165], bot: [138, 92, 255], gr: [255, 248, 240], gl: [200, 190, 240], pw: [255, 107, 87], st: .3, sun: [255, 224, 120] }
  ];
  function clonePal(p) { return { top: p.top.slice(), bot: p.bot.slice(), gr: p.gr.slice(), gl: p.gl.slice(), pw: p.pw.slice(), st: p.st, sun: p.sun.slice() }; }
  function lerpArr(a, b, k) { for (var i = 0; i < a.length; i++) a[i] += (b[i] - a[i]) * k; }
  function rgb(a) { return 'rgb(' + (a[0] | 0) + ',' + (a[1] | 0) + ',' + (a[2] | 0) + ')'; }
  var STARS = []; for (var si = 0; si < 22; si++) STARS.push({ x: Math.random(), y: Math.random() * .55, r: rnd(.8, 2), p: Math.random() * 6 });

  function newGame() {
    G = { t: 0, dist: 0, bonus: 0, score: 0, speed: 360, flowers: 0, combo: 0, maxCombo: 0, mult: 1, lvl: 0, obs: [], flo: [], pw: [], parts: [], txt: [],
      nextSeg: 560, shake: 0, flash: 0, turbo: 0, shield: 0, magnet: 0, inv: 0, pwNext: 14, slow: 0, dying: 0, bgx: 0, banner: '', bannerT: 0, mileSeen: {}, cause: 'bug', death: null, zoom: 0, newBest: false, r300: false, r1000: false, pal: clonePal(PAL[0]), cutDone: false };
    L = { x: W < 700 ? 64 : 100, y: GY, vy: 0, w: 83, h: 96, jumps: 0, air: false, duck: false, duckT: 0, f: 0, ft: 0, coyote: 0, buf: 0, sx: 1, sy: 1 };
    held = false; downHeld = false;
  }

  /* ================= CONTROL ================= */
  function doJump(n) {
    L.vy = n === 1 ? -770 : -560; L.jumps = n; L.air = true; L.coyote = 0; L.buf = 0; held = true; G.cutDone = false; L.sx = .82; L.sy = 1.25;
    puff(L.x + L.w / 2, L.y, n === 1 ? 5 : 9, n === 2 ? '#FFB02E' : '#FFF8F0'); if (n === 1) A.jump(); else A.dbl();
  }
  function pressJump() {
    if (st !== 'run' || paused) return;
    if (G.dying > 0) { if (G.death && G.death.t > .7) G.dying = Math.min(G.dying, .02); return; }
    if (!L.air || L.coyote > 0) doJump(1);
    else if (L.jumps < 2) doJump(2);
    else L.buf = .12;
  }
  function releaseJump() { held = false; }
  function startDuck(sec) { if (L.air) { L.vy = Math.max(L.vy, 1050); } L.duckT = Math.max(L.duckT, sec); }
  function puff(x, y, n, col) { for (var i = 0; i < n; i++) G.parts.push({ x: x + rnd(-10, 10), y: y - 2, vx: rnd(-90, 50), vy: rnd(-60, -10), l: rnd(.25, .5), m: .5, s: rnd(2.5, 5), c: col || '#FFF8F0', g: 120 }); }
  function burst(x, y, n, cols, sp) { for (var i = 0; i < n; i++) { var a = rnd(0, 6.28), v = rnd(60, sp || 260); G.parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, l: rnd(.4, .9), m: .9, s: rnd(3, 6), c: pick(cols), g: 520 }); } }
  function floatText(x, y, s, c) { G.txt.push({ x: x, y: y, t: 1, s: s, c: c || '#FFF8F0' }); }

  /* ================= GENERACIÓN ================= */
  function mkObs(k, x) {
    var o = k === 'bug' ? { k: k, w: 40, h: 32, y: GY - 32 } : k === 'err' ? { k: k, w: 68, h: 46, y: GY - 46 } : k === 'pop' ? { k: k, w: 52, h: 60, y: GY - 60 } :
      k === 'spam' ? { k: k, w: 56, h: 36, y: GY - 94, fly: 1, vx: 95, ph: Math.random() * 6 } : { k: 'drone', w: 60, h: 40, y: GY - 172, fly: 1, vx: 60, ph: Math.random() * 6 };
    o.x = x; return o;
  }
  function arc(x, n, h, w) { for (var i = 0; i < n; i++) { var u = n === 1 ? .5 : i / (n - 1); G.flo.push({ x: x + (u - .5) * w, y: GY - 62 - Math.sin(u * Math.PI) * h, r: 11, a: rnd(0, 6), star: false }); } }
  function line(x, n, y, gap) { for (var i = 0; i < n; i++) G.flo.push({ x: x + i * (gap || 44), y: y, r: 11, a: rnd(0, 6), star: false }); }
  function spawnSeg() {
    var s = G.speed, jd = s * .74, x = W + 50, span = 0, r = Math.random(), lv = G.lvl, ground = ['bug', 'bug', 'err', 'pop', 'err'];
    if (r < .3) { var o = mkObs(pick(ground), x); G.obs.push(o); span = o.w; arc(x + o.w / 2, 5, 100, 170); }
    else if (r < .5) { var a = mkObs(pick(ground), x), b = mkObs(pick(ground), x + a.w + 16); G.obs.push(a, b); span = a.w + 16 + b.w; arc(x + span / 2, 6, 118, 210); }
    else if (r < .68 || (lv === 0 && r < .8)) { var e = mkObs('spam', x); G.obs.push(e); span = e.w; line(x - 10, 5, GY - 36, 40); }
    else if (r < .8 && lv >= 1) { var t3 = [mkObs('bug', x), mkObs('bug', x + 72), mkObs('bug', x + 144)]; t3.forEach(function (q) { G.obs.push(q); }); span = 184; arc(x + span / 2, 7, 135, 230); }
    else if (r < .9 && lv >= 1) { var d = mkObs('drone', x); G.obs.push(d); span = d.w; line(x - 40, 7, GY - 38, 42); }
    else if (lv >= 2) { var g1 = mkObs(pick(ground), x), s1 = mkObs('spam', x + g1.w + jd * .9); G.obs.push(g1, s1); span = g1.w + jd * .9 + s1.w; arc(x + g1.w / 2, 5, 100, 170); }
    else { line(x, 6, GY - 40, 42); span = 260; if (Math.random() < .5) G.flo.push({ x: x + 130, y: GY - 150, r: 13, a: 0, star: true }); }
    if (Math.random() < .12) G.flo.push({ x: x + span / 2, y: GY - 175, r: 14, a: 0, star: true });
    G.nextSeg = span + jd * Math.max(.95, (1.35 - lv * .06) + Math.random() * .7);
  }
  function spawnPower() {
    var r = Math.random(), k = r < .4 ? 'shield' : r < .75 ? 'magnet' : 'turbo';
    G.pw.push({ k: k, x: W + 60, y: GY - 70, a: 0 });
  }

  /* ================= BUCLE ================= */
  function lbox() { return L.duck ? { x: L.x + 18, y: L.y - 46, w: L.w - 38, h: 42 } : { x: L.x + 18, y: L.y - 84, w: L.w - 38, h: 76 }; }
  function hit(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }
  function levelOf(sc) { return sc < 500 ? 0 : sc < 1200 ? 1 : sc < 2200 ? 2 : 3 + Math.floor((sc - 2200) / 1500); }

  function update(dt) {
    var rawdt = dt; if (G.slow > 0) { G.slow -= rawdt; dt *= .3; }
    if (G.dying > 0) { G.dying -= rawdt; deathStep(rawdt); if (G.zoom > 0) G.zoom = Math.max(0, G.zoom - rawdt * .22); if (G.dying <= 0) { finish(); return; } }
    var dead = G.dying > 0;
    G.t += dt;
    var base = Math.min(770, 360 + G.t * 8.5), turbo = G.turbo > 0 ? 1.38 : 1;
    G.speed = dead ? G.speed * (1 - 2.5 * rawdt) : base * turbo;
    var sp = G.speed; G.dist += sp * dt; G.bgx += sp * dt;
    ['turbo', 'magnet', 'inv'].forEach(function (k) { if (G[k] > 0) G[k] -= dt; });
    if (G.shield > 0) G.shield -= dt;
    if (G.flash > 0) G.flash -= dt * 2.6; if (G.shake > 0) G.shake -= dt * 3; if (G.bannerT > 0) G.bannerT -= dt;
    var tp = PAL[G.lvl % 4], kk = Math.min(1, dt * 1.4);
    lerpArr(G.pal.top, tp.top, kk); lerpArr(G.pal.bot, tp.bot, kk); lerpArr(G.pal.gr, tp.gr, kk); lerpArr(G.pal.gl, tp.gl, kk); lerpArr(G.pal.pw, tp.pw, kk); lerpArr(G.pal.sun, tp.sun, kk); G.pal.st += (tp.st - G.pal.st) * kk;
    // Luca
    if (!dead) {
      L.duck = (downHeld || L.duckT > 0) && !L.air; if (L.duckT > 0) L.duckT -= dt;
      if (L.air && downHeld) L.vy = Math.max(L.vy, 1050);
      var grav = 2300; if (L.vy < 0 && !held && !G.cutDone) { L.vy *= .45; G.cutDone = true; } if (L.vy < 0 && held) grav = 1500;
      L.vy += grav * dt; L.y += L.vy * dt;
      if (L.y >= GY) { if (L.air) { L.air = false; L.jumps = 0; L.sx = 1.2; L.sy = .78; puff(L.x + L.w / 2, GY, 6); A.land(); if (L.buf > 0) { L.buf = 0; doJump(1); } } L.y = GY; L.vy = 0; L.coyote = .09; }
      else { if (!L.air) { L.air = true; if (L.jumps === 0) L.jumps = 1; } if (L.coyote > 0) L.coyote -= dt; }
      if (L.buf > 0) L.buf -= dt;
      L.sx += (1 - L.sx) * Math.min(1, dt * 14); L.sy += (1 - L.sy) * Math.min(1, dt * 14);
      L.ft += dt * (sp / 38); L.f = L.air ? 3 : Math.floor(L.ft) % 10;
      if (!L.air && Math.random() < dt * 14) puff(L.x + 20, GY, 1);
      if (prizeCode && Math.random() < dt * 9) G.parts.push({ x: L.x + L.w * .6 + rnd(-14, 14), y: L.y - L.h * .8 + rnd(-10, 10), vx: rnd(-40, 20), vy: rnd(-70, -20), l: rnd(.4, .8), m: .8, s: rnd(1.8, 3.4), c: pick(['#FFD66B', '#FFF8F0', '#FFB02E']), g: 60 });
    }
    // generación
    G.nextSeg -= sp * dt; if (G.nextSeg <= 0 && !dead) spawnSeg();
    G.pwNext -= dt; if (G.pwNext <= 0 && G.score > 30 && !dead) { spawnPower(); G.pwNext = rnd(16, 26); }
    var box = lbox(), cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    // obstáculos
    for (var i = G.obs.length - 1; i >= 0; i--) {
      var o = G.obs[i]; o.x -= (sp + (o.vx || 0)) * dt; if (o.fly) { o.ph += dt * 4; }
      if (o.x + o.w < -30) { G.obs.splice(i, 1); continue; }
      if (dead) continue;
      var oy = o.fly ? o.y + Math.sin(o.ph) * 5 : o.y;
      if (hit(box, { x: o.x + 5, y: oy + 5, w: o.w - 10, h: o.h - 9 })) {
        if (G.turbo > 0) { smash(o, i); }
        else if (G.shield > 0) { G.shield = 0; G.inv = .8; G.flash = .5; A.shield(); floatText(L.x + 40, L.y - 110, T.shieldHit, '#24D6A5'); smash(o, i, true); }
        else if (G.inv <= 0) { crash(o.k); }
      }
    }
    // flores
    for (var k = G.flo.length - 1; k >= 0; k--) {
      var f = G.flo[k]; f.a += dt * 3;
      if (G.magnet > 0 && !f.star && !dead) { var dx = cx - f.x, dy = cy - f.y, d = Math.hypot(dx, dy); if (d < 280 && d > 1) { f.x += dx / d * 520 * dt; f.y += dy / d * 520 * dt; } }
      f.x -= sp * dt;
      if (f.x < L.x - 60) { G.flo.splice(k, 1); if (!f.star && G.combo > 0) { G.combo = 0; G.mult = 1; } continue; }
      if (!dead && Math.abs(f.x - cx) < 32 && Math.abs(f.y - cy) < 56) {
        G.flo.splice(k, 1);
        if (f.star) { G.bonus += 50; G.combo += 3; A.star(); floatText(f.x, f.y - 14, '+50 ⭐', '#FFB02E'); burst(f.x, f.y, 14, ['#FFB02E', '#FFF8F0', '#FF6B57'], 300); }
        else { G.flowers++; G.combo++; G.mult = Math.min(5, 1 + Math.floor(G.combo / 6)); var pts = 10 * G.mult; G.bonus += pts; A.flower(G.combo); floatText(f.x, f.y - 12, '+' + pts, G.mult > 1 ? '#FFB02E' : '#FFF8F0'); burst(f.x, f.y, 6, ['#FFB02E', '#FF6B57'], 200); }
        if (G.combo > G.maxCombo) G.maxCombo = G.combo;
      }
    }
    // poderes
    for (var p = G.pw.length - 1; p >= 0; p--) {
      var w = G.pw[p]; w.x -= sp * dt; w.a += dt * 4;
      if (w.x < -50) { G.pw.splice(p, 1); continue; }
      if (!dead && Math.abs(w.x - cx) < 34 && Math.abs(w.y - cy) < 56) {
        G.pw.splice(p, 1); A.power(); burst(w.x, w.y, 16, ['#24D6A5', '#FFB02E', '#fff'], 320); G.flash = .35;
        if (w.k === 'turbo') G.turbo = 4.2; else if (w.k === 'shield') G.shield = 14; else G.magnet = 9;
        G.banner = T.pw[w.k]; G.bannerT = 1.4;
      }
    }
    // partículas / textos
    for (var q = G.parts.length - 1; q >= 0; q--) { var pa = G.parts[q]; pa.l -= dt; pa.x += pa.vx * dt - sp * dt * .35; pa.y += pa.vy * dt; pa.vy += pa.g * dt; if (pa.l <= 0) G.parts.splice(q, 1); }
    if (G.parts.length > 320) G.parts.splice(0, G.parts.length - 320);
    for (var u = G.txt.length - 1; u >= 0; u--) { var tx = G.txt[u]; tx.t -= dt * 1.1; tx.y -= 38 * dt; if (tx.t <= 0) G.txt.splice(u, 1); }
    // puntaje y niveles
    if (!dead) {
      var ns = Math.floor(G.dist / 18) + G.bonus;
      if (ns !== G.score) {
        for (var m in T.mile) { if (!G.mileSeen[m] && ns >= +m) { G.mileSeen[m] = 1; if (+m !== PRIZE_AT) { G.banner = T.mile[m]; G.bannerT = 1.9; } } }
        G.score = ns;
        var lv = levelOf(ns);
        if (lv > G.lvl) { G.lvl = lv; G.banner = T.lvl + ' ' + (lv + 1) + ' · ' + T.lv[lv % 4]; G.bannerT = 2.4; A.level(); G.flash = .6; burst(W / 2, 80, 30, ['#FFB02E', '#FF6B57', '#24D6A5', '#fff', '#8a5cff'], 420); }
        if (!G.r300 && ns >= 300) { G.r300 = true; try { if (window.__ixtliEgg) window.__ixtliEgg('juego-300'); } catch (e) {} }
        if (!G.r1000 && ns >= PRIZE_AT) { G.r1000 = true; try { if (window.__ixtliEgg) window.__ixtliEgg('juego-1000'); } catch (e) {} unlockPrize(); }
      }
    }
  }
  function makeCode() { var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', c = 'LUCA-'; for (var i = 0; i < 4; i++) c += a.charAt(Math.floor(Math.random() * a.length)); return c; }
  function unlockPrize() {
    if (!prizeCode) { prizeCode = makeCode(); try { localStorage.setItem('ixtliJuegoPremio', prizeCode); } catch (e) {} }
    G.banner = T.unlock; G.bannerT = 3.2; G.flash = .7; A.level(); A.star();
    burst(W / 2, 90, 46, ['#FFD66B', '#FFB02E', '#FFF8F0', '#FF6B57', '#24D6A5'], 480);
  }
  function smash(o, i, noScore) {
    G.obs.splice(i, 1); A.smash(); G.shake = .25; burst(o.x + o.w / 2, o.y + o.h / 2, 14, ['#FF6B57', '#FFB02E', '#FFF8F0', '#14122B'], 360);
    if (!noScore) { G.bonus += 25; floatText(o.x + o.w / 2, o.y - 6, '+25', '#FFB02E'); }
  }
  function crash(kind) {
    G.cause = kind === 'drone' ? 'spam' : kind; A.hit(); A.music(false); G.dying = 1.55; G.slow = .3; G.shake = .7; G.flash = .7; G.zoom = .09;
    burst(L.x + L.w / 2, L.y - 50, 26, ['#FFB02E', '#FF6B57', '#FFF8F0'], 420);
    G.death = { t: 0, phase: 'fly', x: L.x + L.w / 2, y: L.y, vx: -105, vy: -640, rot: 0, vr: -13, bounces: 0, word: (T.hit[G.cause] || T.hit.bug), ix: L.x + L.w / 2 + 28, iy: L.y - 60, ang: 0, koT: 0, sT: 0, target: 0 };
    for (var i = 0; i < 5; i++) G.parts.push({ x: G.death.ix, y: G.death.iy, vx: rnd(-80, 80), vy: rnd(-160, -40), l: .9, m: .9, s: 5, c: '#FFD66B', g: 300 });
  }
  function deathStep(dt) {
    var D = G.death; if (!D) return; D.t += dt; D.ang += dt * 7;
    if (D.phase === 'fly') {
      D.x = Math.max(66, D.x + D.vx * dt); D.y += D.vy * dt; D.vy += 1950 * dt; D.rot += D.vr * dt;
      if (D.y >= GY && D.vy > 0) {
        D.y = GY;
        if (D.bounces === 0) { D.bounces = 1; D.vy = -D.vy * .32; D.vx *= .35; D.vr *= .4; puff(D.x, GY, 8); A.land(); G.shake = Math.max(G.shake, .35); }
        else { D.phase = 'ko'; D.vy = 0; D.vx = 0; D.koT = 0; D.target = Math.round((D.rot / Math.PI - 1) / 2) * 2 * Math.PI + Math.PI; puff(D.x, GY, 10); A.land(); }
      }
    } else if (D.phase === 'ko') {
      D.koT += dt; D.rot += (D.target - D.rot) * Math.min(1, dt * 12);
      if (D.koT > .62) { D.phase = 'stand'; D.sT = 0; puff(D.x, GY, 12, '#FFB02E'); burst(D.x, GY - 60, 10, ['#FFB02E', '#FFF8F0'], 200); A.shield(); }
    } else D.sT += dt;
  }
  function finish() {
    st = 'over'; G.bannerT = 0; G.zoom = 0; G.banner = ''; G.txt = []; var nb = G.score > best; G.newBest = nb;
    if (nb) { best = G.score; try { localStorage.setItem('ixtliJuegoBest', String(best)); } catch (e) {} }
    root.querySelector('#jg-ot').textContent = T.over[G.cause] || T.over.bug;
    root.querySelector('#jg-sc').innerHTML = '<b style="font-size:1.5em;color:#FFB02E">' + G.score + '</b> ' + T.pts + '  ·  ' + T.best + ': ' + best + '  ·  🌼 ' + G.flowers + '  ·  ' + T.combo + ' x' + G.maxCombo;
    root.querySelector('#jg-nb').hidden = !nb;
    var pz = root.querySelector('#jg-prize'), cl = root.querySelector('#jg-claim'), nr = root.querySelector('#jg-near'), won = !!prizeCode;
    pz.hidden = !won; cl.hidden = !won; nr.hidden = true;
    if (won) { root.querySelector('#jg-code').textContent = prizeCode; cl.href = 'https://wa.me/525629573030?text=' + encodeURIComponent(T.wonMsg(prizeCode, Math.max(best, G.score))); }
    else if (G.score >= 600) { nr.textContent = T.near(PRIZE_AT - G.score); nr.hidden = false; }
    setTimeout(function () { if (!open || st !== 'over') return; root.querySelector('#jg-over').hidden = false; var b = root.querySelector('#jg-over [data-go]'); if (b) b.focus(); if (nb) { burst(W / 2, 120, 40, ['#FFB02E', '#FF6B57', '#24D6A5', '#fff'], 460); A.level(); } }, 250);
  }
  function share() {
    var txt = (en ? 'I scored ' + G.score + ' in "Luca runs" 🐾 Can you beat me? ' : 'Hice ' + G.score + ' puntos en "Luca corre" 🐾 ¿Me superas? ') + SITE;
    if (navigator.share) { navigator.share({ title: 'ixtli studio', text: txt, url: SITE }).catch(function () {}); }
    else if (navigator.clipboard) { navigator.clipboard.writeText(txt).then(function () { toast(T.copied); }, function () { toast(txt); }); }
    else toast(txt);
  }

  /* ================= DIBUJO ================= */
  function rr(x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
  function flower(x, y, r, a, c1, c2) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    for (var i = 0; i < 8; i++) { ctx.fillStyle = i < 4 ? c1 : c2; ctx.save(); ctx.rotate(i * Math.PI / 4); ctx.beginPath(); ctx.ellipse(0, -r * .72, r * .36, r * .64, 0, 0, 6.3); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = '#FFF8F0'; ctx.beginPath(); ctx.arc(0, 0, r * .3, 0, 6.3); ctx.fill(); ctx.restore();
  }
  function star(x, y, r, a) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = '#FFB02E'; ctx.strokeStyle = '#FFF8F0'; ctx.lineWidth = 2; ctx.beginPath();
    for (var i = 0; i < 10; i++) { var rad = i % 2 ? r * .48 : r, an = i * Math.PI / 5 - Math.PI / 2; ctx.lineTo(Math.cos(an) * rad, Math.sin(an) * rad); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  function drawObs(o) {
    var y = o.fly ? o.y + Math.sin(o.ph) * 5 : o.y;
    if (o.k === 'bug') {
      ctx.strokeStyle = '#14122B'; ctx.lineWidth = 3; var wig = Math.sin(G.t * 18 + o.x) * 2;
      for (var i = 0; i < 3; i++) { var lx = o.x + 9 + i * 11; ctx.beginPath(); ctx.moveTo(lx, y + o.h - 8); ctx.lineTo(lx - 5 + wig, y + o.h + 3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(lx + 4, y + o.h - 8); ctx.lineTo(lx + 9 - wig, y + o.h + 3); ctx.stroke(); }
      ctx.fillStyle = '#FF6B57'; ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, y + o.h / 2 + 2, o.w / 2, o.h / 2 - 1, 0, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#14122B'; ctx.beginPath(); ctx.arc(o.x + o.w / 2 - 2, y + o.h / 2 + 8, 2.6, 0, 6.3); ctx.arc(o.x + o.w / 2 + 9, y + o.h / 2 + 8, 2.6, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(o.x + o.w / 2 + 4, y + 10, 4.8, 0, 6.3); ctx.arc(o.x + o.w / 2 - 8, y + 11, 4.2, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#14122B'; ctx.beginPath(); ctx.arc(o.x + o.w / 2 + 3.5, y + 11, 2.1, 0, 6.3); ctx.arc(o.x + o.w / 2 - 9, y + 12, 1.9, 0, 6.3); ctx.fill();
    } else if (o.k === 'err') {
      ctx.fillStyle = '#14122B'; rr(o.x, y, o.w, o.h, 8); ctx.fill(); ctx.strokeStyle = '#FF6B57'; ctx.lineWidth = 3; rr(o.x + 3, y + 3, o.w - 6, o.h - 6, 6); ctx.stroke();
      ctx.fillStyle = '#FFF8F0'; ctx.font = '800 22px Poppins,system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('404', o.x + o.w / 2, y + o.h / 2 + 1);
    } else if (o.k === 'pop') {
      ctx.fillStyle = '#FFF8F0'; rr(o.x, y, o.w, o.h, 7); ctx.fill(); ctx.fillStyle = '#8a5cff'; rr(o.x, y, o.w, 16, 7); ctx.fill(); ctx.fillRect(o.x, y + 9, o.w, 7);
      ctx.fillStyle = '#FFF8F0'; ctx.font = '800 11px system-ui'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText('×', o.x + o.w - 6, y + 8);
      ctx.fillStyle = '#14122B'; ctx.fillRect(o.x + 8, y + 25, o.w - 16, 5); ctx.fillRect(o.x + 8, y + 35, o.w - 26, 5); ctx.fillStyle = '#FF6B57'; rr(o.x + 8, y + 45, o.w - 16, 9, 4); ctx.fill();
    } else if (o.k === 'spam') {
      ctx.fillStyle = '#FFF8F0'; rr(o.x, y, o.w, o.h, 6); ctx.fill(); ctx.strokeStyle = '#FF6B57'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(o.x + 4, y + 5); ctx.lineTo(o.x + o.w / 2, y + o.h / 2 + 2); ctx.lineTo(o.x + o.w - 4, y + 5); ctx.stroke();
      ctx.fillStyle = '#FF6B57'; ctx.beginPath(); ctx.arc(o.x + o.w - 6, y + 4, 8, 0, 6.3); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '800 11px Poppins,system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('!', o.x + o.w - 6, y + 5);
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o.x + o.w + 4, y + 10); ctx.lineTo(o.x + o.w + 24, y + 10); ctx.moveTo(o.x + o.w + 4, y + 22); ctx.lineTo(o.x + o.w + 18, y + 22); ctx.stroke();
    } else {
      ctx.fillStyle = '#14122B'; rr(o.x + 8, y + 10, o.w - 16, o.h - 18, 12); ctx.fill(); ctx.fillStyle = '#8a5cff'; ctx.beginPath(); ctx.arc(o.x + o.w / 2, y + 22, 8, 0, 6.3); ctx.fill();
      var sw = Math.sin(G.t * 30) * 5; ctx.fillStyle = '#FFB02E'; rr(o.x - 4, y + 6 + sw, 22, 5, 3); ctx.fill(); rr(o.x + o.w - 18, y + 6 - sw, 22, 5, 3); ctx.fill();
    }
  }
  function drawPower(w) {
    var y = w.y + Math.sin(w.a) * 6, col = w.k === 'turbo' ? '#FFB02E' : w.k === 'shield' ? '#24D6A5' : '#8a5cff';
    ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.arc(w.x, y, 26, 0, 6.3); ctx.fill();
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(w.x, y, 19, 0, 6.3); ctx.fill(); ctx.strokeStyle = '#FFF8F0'; ctx.lineWidth = 3; ctx.stroke();
    ctx.font = '19px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText(w.k === 'turbo' ? '⚡' : w.k === 'shield' ? '📶' : '🧲', w.x, y + 1);
  }
  function crownAt(x, y) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.12); ctx.fillStyle = '#FFD66B'; ctx.strokeStyle = '#B8741A'; ctx.lineWidth = 1.6; ctx.beginPath();
    ctx.moveTo(-11, 0); ctx.lineTo(-12, -13); ctx.lineTo(-6, -7); ctx.lineTo(0, -16); ctx.lineTo(6, -7); ctx.lineTo(12, -13); ctx.lineTo(11, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#FF6B57'; ctx.beginPath(); ctx.arc(0, -4, 2.2, 0, 6.3); ctx.fill(); ctx.restore();
  }
  function starShape(x, y, r) {
    ctx.beginPath(); for (var i = 0; i < 10; i++) { var rad = i % 2 ? r * .45 : r, an = i * Math.PI / 5 - Math.PI / 2; ctx.lineTo(x + Math.cos(an) * rad, y + Math.sin(an) * rad); } ctx.closePath(); ctx.fill();
  }
  function drawDeath() {
    var D = G.death, pivY = D.y - 29, hx, hy;
    if (D.phase === 'stand') {
      var k = Math.min(1, D.sT * 7), sx = .7 + .3 * k + Math.sin(D.sT * 10) * .02 * (1 - k), sy = 1.3 - .3 * k, tilt = Math.sin(D.sT * 8) * .07;
      ctx.save(); ctx.translate(D.x, GY); ctx.rotate(tilt); ctx.scale(sx, sy);
      if (sheetOk) ctx.drawImage(sheet, 11 * 208, 0, 208, 240, -L.w * .30, -L.h * 1.04, L.w, L.h * 1.04);
      if (prizeCode) crownAt(-1, -L.h * 1.04 + 9);
      ctx.restore(); hx = D.x; hy = GY - L.h * 1.0;
      if (D.sT < .5) { ctx.fillStyle = 'rgba(255,214,107,' + (1 - D.sT * 2) + ')'; for (var j = 0; j < 3; j++) { var a = D.ang + j * 2.09; starShape(hx + Math.cos(a) * 22, hy - 12 + Math.sin(a) * 7, 6); } }
    } else {
      var fr = D.phase === 'fly' ? 3 : 9;
      ctx.save(); ctx.translate(D.x, pivY); ctx.rotate(D.rot);
      if (sheetOk) ctx.drawImage(sheet, fr * 208, 0, 208, 240, -L.w / 2, -L.h * .7, L.w, L.h); else { ctx.fillStyle = '#FFB02E'; rr(-30, -30, 60, 60, 12); ctx.fill(); }
      if (prizeCode) crownAt(21, -L.h * .7 + L.h * .58 - 12);
      ctx.restore();
      var c = Math.cos(D.rot), sn = Math.sin(D.rot), ox = 21, oy = -L.h * .7 + L.h * .58; hx = D.x + ox * c - oy * sn; hy = pivY + ox * sn + oy * c;
      if (D.phase === 'ko') { ctx.fillStyle = '#FFD66B'; for (var q = 0; q < 3; q++) { var an = D.ang + q * 2.09; starShape(hx + Math.cos(an) * 24, hy - 20 + Math.sin(an) * 8, 6.5); } }
    }
    // sombra
    ctx.fillStyle = 'rgba(20,18,43,.22)'; var sc = 1 - Math.min(.5, (GY - D.y) / 260); ctx.beginPath(); ctx.ellipse(D.x + 4, GY + 3, 34 * sc, 5 * sc, 0, 0, 6.3); ctx.fill();
    // anillo de impacto + globo de cómic
    var rt = D.t; if (rt < .4) { ctx.strokeStyle = 'rgba(255,255,255,' + (1 - rt / .4) + ')'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(D.ix, D.iy, 12 + rt * 190, 0, 6.3); ctx.stroke(); }
    if (rt < 1.05) {
      var sK = Math.min(1, rt * 9) * (rt < .8 ? 1 : Math.max(0, (1.05 - rt) / .25)), bx = D.ix + 10, by = D.iy - 46 - rt * 14;
      ctx.save(); ctx.translate(bx, by); ctx.rotate(-.14 + Math.sin(rt * 30) * .03); ctx.scale(sK * (1 + Math.max(0, .25 - rt) * 1.6), sK * (1 + Math.max(0, .25 - rt) * 1.6));
      ctx.fillStyle = '#FFD66B'; ctx.strokeStyle = '#14122B'; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.beginPath();
      for (var i = 0; i < 16; i++) { var rd = i % 2 ? 30 : 52, a2 = i * Math.PI / 8; ctx.lineTo(Math.cos(a2) * rd * 1.35, Math.sin(a2) * rd * .85); } ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#14122B'; ctx.font = '800 20px Poppins,system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(D.word, 0, 2); ctx.restore();
    }
  }
  function drawLuca() {
    if (G.death) { drawDeath(); return; }
    if (!sheetOk) { ctx.fillStyle = '#FFB02E'; rr(L.x, L.y - L.h, L.w, L.h, 14); ctx.fill(); return; }
    var sx = L.sx * (L.duck ? 1.12 : 1), sy = L.sy * (L.duck ? .62 : 1), fx = L.x + L.w / 2, tilt = L.air ? Math.max(-.28, Math.min(.28, L.vy / 3200)) : 0;
    function one(alpha, dx) {
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(fx + dx, L.y); ctx.rotate(tilt); ctx.scale(sx, sy);
      ctx.drawImage(sheet, L.f * 208, 0, 208, 240, -L.w / 2, -L.h, L.w, L.h);
      if (prizeCode) crownAt(L.w * .1, -L.h * .66);
      ctx.restore();
    }
    if (G.turbo > 0) { one(.18, -46); one(.3, -26); ctx.save(); ctx.shadowColor = '#FFB02E'; ctx.shadowBlur = 24; one(1, 0); ctx.restore(); }
    else if (G.inv > 0 && Math.floor(G.t * 20) % 2) { one(.35, 0); }
    else one(1, 0);
    if (G.shield > 0 && (G.shield > 2 || Math.floor(G.t * 8) % 2)) { ctx.strokeStyle = 'rgba(36,214,165,.9)'; ctx.fillStyle = 'rgba(36,214,165,.18)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fx, L.y - 46, 56, 0, 6.3); ctx.fill(); ctx.stroke(); }
    if (G.magnet > 0) { ctx.strokeStyle = 'rgba(138,92,255,' + (.25 + Math.sin(G.t * 8) * .12) + ')'; ctx.lineWidth = 3; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.arc(fx, L.y - 46, 110 + Math.sin(G.t * 6) * 8, 0, 6.3); ctx.stroke(); ctx.setLineDash([]); }
    var sc = 1 - Math.min(.55, (GY - L.y) / 300); ctx.fillStyle = 'rgba(20,18,43,.22)'; ctx.beginPath(); ctx.ellipse(fx + 4, GY + 3, 32 * sc, 5 * sc, 0, 0, 6.3); ctx.fill();
  }
  function bg() {
    var p = G.pal, g = ctx.createLinearGradient(0, 0, 0, H);
    if (G.lvl % 4 === 3) { var hh = (G.t * 40) % 360; g.addColorStop(0, 'hsl(' + hh + ',80%,58%)'); g.addColorStop(1, 'hsl(' + ((hh + 70) % 360) + ',80%,52%)'); }
    else { g.addColorStop(0, rgb(p.top)); g.addColorStop(1, rgb(p.bot)); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (p.st > .05) STARS.forEach(function (s) { ctx.fillStyle = 'rgba(255,248,225,' + (p.st * (.4 + .6 * Math.abs(Math.sin(G.t * 2 + s.p))) * .9) + ')'; ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, 6.3); ctx.fill(); });
    ctx.fillStyle = rgb(p.sun); ctx.beginPath(); ctx.arc(W - 64, 78 + (G.lvl % 4 === 1 ? 38 : 0), G.lvl % 4 === 2 ? 26 : 30, 0, 6.3); ctx.fill();
    if (G.lvl % 4 === 2) { ctx.fillStyle = 'rgba(180,170,210,.4)'; ctx.beginPath(); ctx.arc(W - 72, 72, 6, 0, 6.3); ctx.arc(W - 56, 88, 4, 0, 6.3); ctx.fill(); }
    for (var i = 0; i < 6; i++) { var bx = ((i * 230 - G.bgx * .1) % (W + 260) + (W + 260)) % (W + 260) - 130, hh2 = 80 + (i % 3) * 22; ctx.fillStyle = 'rgba(255,255,255,.07)'; rr(bx, GY - 40 - hh2, 110, hh2, 10); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.14)'; rr(bx, GY - 40 - hh2, 110, 14, 8); ctx.fill(); }
    ctx.fillStyle = 'rgba(20,18,43,.16)'; ctx.beginPath(); ctx.moveTo(0, GY);
    for (var x = 0; x <= W; x += 20) ctx.lineTo(x, GY - 26 - Math.sin((x + G.bgx * .22) / 90) * 14 - Math.sin((x + G.bgx * .22) / 37) * 5); ctx.lineTo(W, GY); ctx.fill();
    for (var c = 0; c < 4; c++) { var cx = ((c * 300 - G.bgx * .3) % (W + 300) + (W + 300)) % (W + 300) - 150, cy = 62 + (c % 2) * 52; ctx.fillStyle = 'rgba(255,248,240,' + (.2 - p.st * .12) + ')'; ctx.beginPath(); ctx.ellipse(cx, cy, 52, 15, 0, 0, 6.3); ctx.ellipse(cx + 30, cy - 10, 30, 14, 0, 0, 6.3); ctx.fill(); }
    ctx.fillStyle = rgb(p.gr); ctx.fillRect(0, GY, W, H - GY); ctx.fillStyle = rgb(p.gl); ctx.fillRect(0, GY, W, 4);
    ctx.fillStyle = rgb(p.pw);
    for (var k = 0; k < 12; k++) { var px = ((k * 120 - G.bgx) % (W + 120) + (W + 120)) % (W + 120) - 40, py = GY + 22 + (k % 2) * 18; ctx.beginPath(); ctx.ellipse(px, py + 3, 6, 5, 0, 0, 6.3); ctx.ellipse(px - 6, py - 4, 2.6, 3.4, 0, 0, 6.3); ctx.ellipse(px - 2, py - 7, 2.6, 3.4, 0, 0, 6.3); ctx.ellipse(px + 2, py - 7, 2.6, 3.4, 0, 0, 6.3); ctx.ellipse(px + 6, py - 4, 2.6, 3.4, 0, 0, 6.3); ctx.fill(); }
  }
  function draw() {
    if (!G) return;
    var sh = (!reduce && G.shake > 0) ? G.shake * 14 : 0;
    ctx.save(); if (sh) ctx.translate(rnd(-sh, sh), rnd(-sh, sh));
    if (!reduce && G.zoom > 0 && G.death) { ctx.translate(G.death.ix, G.death.iy); ctx.scale(1 + G.zoom, 1 + G.zoom); ctx.translate(-G.death.ix, -G.death.iy); }
    bg();
    if (G.turbo > 0) { ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; for (var i = 0; i < 14; i++) { var lx = ((i * 97 - G.t * 1400) % (W + 200) + (W + 200)) % (W + 200) - 100, ly = 20 + (i * 53) % (GY - 30); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 60, ly); ctx.stroke(); } }
    G.flo.forEach(function (f) { if (f.star) star(f.x, f.y + Math.sin(f.a) * 4, f.r, Math.sin(f.a) * .3); else flower(f.x, f.y + Math.sin(f.a) * 4, f.r, f.a * .4, '#FFB02E', '#FF6B57'); });
    G.pw.forEach(drawPower); G.obs.forEach(drawObs); drawLuca();
    G.parts.forEach(function (pa) { ctx.globalAlpha = Math.max(0, Math.min(1, pa.l / pa.m * 1.4)); ctx.fillStyle = pa.c; ctx.beginPath(); ctx.arc(pa.x, pa.y, pa.s, 0, 6.3); ctx.fill(); }); ctx.globalAlpha = 1;
    G.txt.forEach(function (t) { ctx.globalAlpha = Math.max(0, t.t); ctx.fillStyle = t.c; ctx.font = '800 17px Poppins,system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t.s, t.x, t.y); }); ctx.globalAlpha = 1;
    ctx.restore();
    if (G.flash > 0) { ctx.fillStyle = 'rgba(255,255,255,' + Math.min(.55, G.flash * .6) + ')'; ctx.fillRect(0, 0, W, H); }
    // HUD
    ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'; ctx.fillStyle = '#FFF8F0'; ctx.font = '800 ' + (W < 700 ? 18 : 22) + 'px Poppins,system-ui,sans-serif'; ctx.fillText(T.pts + ' ' + G.score, 16, 32);
    ctx.font = '700 13px Nunito,system-ui,sans-serif'; ctx.fillStyle = 'rgba(255,248,240,.8)'; ctx.fillText(T.best + ' ' + Math.max(best, G.score) + '  ·  🌼 ' + G.flowers, 16, 52);
    if (G.mult > 1) { ctx.fillStyle = '#FFB02E'; ctx.font = '800 ' + (W < 700 ? 18 : 22) + 'px Poppins,system-ui,sans-serif'; ctx.fillText('x' + G.mult + ' 🔥', 16 + (W < 700 ? 128 : 160), 32); }
    var px = W / 2 - 60, items = [['⚡', G.turbo, 4.2, '#FFB02E'], ['📶', G.shield, 14, '#24D6A5'], ['🧲', G.magnet, 9, '#8a5cff']];
    items.forEach(function (it) { if (it[1] > 0) { ctx.font = '16px system-ui'; ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.fillText(it[0], px, 26); ctx.fillStyle = 'rgba(255,255,255,.25)'; rr(px + 22, 15, 50, 8, 4); ctx.fill(); ctx.fillStyle = it[3]; rr(px + 22, 15, 50 * Math.min(1, it[1] / it[2]), 8, 4); ctx.fill(); px += 86; } });
    if (G.bannerT > 0 && G.banner) { ctx.globalAlpha = Math.min(1, G.bannerT * 1.2); ctx.textAlign = 'center'; ctx.font = '800 ' + (W < 700 ? 19 : 26) + 'px Poppins,system-ui,sans-serif'; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(20,18,43,.6)'; ctx.strokeText(G.banner, W / 2, 96); ctx.fillStyle = '#FFF8F0'; ctx.fillText(G.banner, W / 2, 96); ctx.globalAlpha = 1; }
  }
  function loop(ts) {
    if (!open) return;
    if (!last) last = ts; var dt = Math.min(.05, (ts - last) / 1000); last = ts;
    if (st === 'run' && !paused) update(dt);
    else if (st === 'over') { G.parts.forEach(function (pa) { pa.l -= dt; pa.x += pa.vx * dt; pa.y += pa.vy * dt; pa.vy += pa.g * dt; }); G.parts = G.parts.filter(function (p) { return p.l > 0; }); G.flash = Math.max(0, G.flash - dt * 2); G.shake = 0; deathStep(dt); }
    draw();
    raf = requestAnimationFrame(loop);
  }

  /* ================= FLUJO ================= */
  function begin() {
    A.init(); newGame(); st = 'run'; paused = false; last = 0;
    ['#jg-start', '#jg-over', '#jg-pause'].forEach(function (s) { root.querySelector(s).hidden = true; });
    root.querySelector('[data-pause]').textContent = '⏸'; root.querySelector('.jg-box').focus(); A.music(true);
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function togglePause() {
    if (st !== 'run') return; paused = !paused; root.querySelector('#jg-pause').hidden = !paused; root.querySelector('[data-pause]').textContent = paused ? '▶' : '⏸';
    A.music(!paused); if (!paused) last = 0;
  }
  function onKey(e) {
    if (!open) return;
    if (e.key === 'Escape') { close(); return; }
    var jumpKey = e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W';
    if (e.key === 'p' || e.key === 'P') { e.preventDefault(); togglePause(); return; }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); if (st === 'run' && !paused) { downHeld = true; if (L.air) L.vy = Math.max(L.vy, 1050); } return; }
    if (jumpKey) {
      var t = e.target && e.target.tagName; if ((t === 'A' || t === 'BUTTON') && st !== 'run' && e.code === 'Space') return;
      e.preventDefault(); if (e.repeat) return;
      if (st === 'ready') begin(); else if (st === 'run') { if (paused) togglePause(); else pressJump(); }
    }
  }
  function onKeyUp(e) {
    if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') releaseJump();
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') downHeld = false;
  }
  function onVis() { if (document.hidden && open && st === 'run' && !paused) togglePause(); }
  function onResize() { if (!open) return; size(); if (G && L) { L.y = Math.min(L.y, GY); } if (st === 'run' && !paused) togglePause(); }
  function openGame() {
    if (open) return; open = true; if (!root) build();
    lastFocus = document.activeElement; size(); newGame(); st = 'ready'; paused = false;
    root.classList.add('on'); root.querySelector('#jg-start').hidden = false; root.querySelector('#jg-over').hidden = true; root.querySelector('#jg-pause').hidden = true;
    document.documentElement.style.overflow = 'hidden'; root.querySelector('.jg-box').focus();
    document.addEventListener('keydown', onKey, true); document.addEventListener('keyup', onKeyUp, true);
    document.addEventListener('visibilitychange', onVis); window.addEventListener('resize', onResize);
    last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
    try { if (window.__ixtliEgg) window.__ixtliEgg('juego'); } catch (e) {}
  }
  function close() {
    if (!open) return; open = false; st = 'ready'; paused = false; cancelAnimationFrame(raf); A.music(false);
    root.classList.remove('on'); document.documentElement.style.overflow = '';
    document.removeEventListener('keydown', onKey, true); document.removeEventListener('keyup', onKeyUp, true);
    document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', onResize);
    try { if (lastFocus && lastFocus.focus) lastFocus.focus(); } catch (e) {}
  }
  window.ixtliJuego = openGame;

  /* ================= CÓMO SE DESCUBRE ================= */
  var buf = '';
  document.addEventListener('keydown', function (e) {
    if (open || e.ctrlKey || e.metaKey || e.altKey || !e.key || e.key.length !== 1) return;
    var t = e.target && e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || (e.target && e.target.isContentEditable)) { buf = ''; return; }
    buf = (buf + e.key.toLowerCase()).slice(-5);
    if (buf === 'ixtli') { buf = ''; openGame(); }
  });
  var taps = [];
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('.site-foot') : null; if (!el) return;
    if (e.target.closest('a,button,input,textarea,select,label,.xm-foot')) return;
    var now = Date.now(); taps = taps.filter(function (x) { return now - x < 3000; }); taps.push(now);
    if (taps.length >= 5) { taps = []; openGame(); }
  }, true);
})();
