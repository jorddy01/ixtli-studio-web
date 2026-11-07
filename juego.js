/* ixtli studio · videojuego escondido: "Luca corre"
   Se abre escribiendo  i x t l i  en el teclado (no hace falta ningún campo de texto).
   En celular: toca 5 veces seguidas la línea de derechos de autor del pie de página.
   Salta con Espacio, ↑, W, clic o toque. Esc cierra. */
(function () {
  'use strict';
  var en = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var cs = document.currentScript, BASE = (cs && cs.src) ? cs.src.replace(/juego\.js.*$/, '') : '';
  var WA = 'https://wa.me/525629573030?text=' + encodeURIComponent(en ? 'Hi ixtli studio, I just beat Luca\'s game and I want a quote for my website' : 'Hola ixtli studio, jugué el juego de Luca y quiero cotizar mi página');
  var T = en ? {
    title: 'Luca runs', sub: 'Jump over bugs, 404s and pop-ups. Grab flowers!', start: 'Start', hint: 'Space, ↑ or tap to jump',
    over: 'Ouch! A bug got you 🐞', pts: 'Points', best: 'Best', again: 'Play again', cta: 'I want my website →', close: 'Close', hud: 'Points'
  } : {
    title: 'Luca corre', sub: 'Salta los bugs, los 404 y los pop-ups. ¡Junta flores!', start: 'Empezar', hint: 'Espacio, ↑ o toque para saltar',
    over: '¡Auch! Te atrapó un bug 🐞', pts: 'Puntos', best: 'Récord', again: 'Jugar otra vez', cta: 'Quiero mi página →', close: 'Cerrar', hud: 'Puntos'
  };
  var MILE = en ? { 100: 'First page published!', 300: 'SEO on!', 600: 'Happy client!', 1000: 'You are a pro!' } : { 100: '¡Primera página publicada!', 300: '¡SEO activado!', 600: '¡Cliente feliz!', 1000: '¡Eres un crack!' };

  var open = false, root, cv, ctx, W, H, DPR, GY, raf = 0, last = 0, st = 'ready', lastFocus;
  var sheet = new Image(), sheetOk = false;
  sheet.onload = function () { sheetOk = true; }; sheet.src = BASE + 'img/gato-sheet.webp';
  var best = 0; try { best = +localStorage.getItem('ixtliJuegoBest') || 0; } catch (e) {}

  /* ---------- estilos ---------- */
  var css = document.createElement('style');
  css.textContent =
    '#jg{position:fixed;inset:0;z-index:100001;display:none;align-items:center;justify-content:center;background:rgba(14,12,34,.82);backdrop-filter:blur(6px);padding:12px;-webkit-tap-highlight-color:transparent}' +
    '#jg.on{display:flex;animation:jgin .25s ease-out}@keyframes jgin{from{opacity:0}to{opacity:1}}' +
    '.jg-box{position:relative;width:min(960px,100%);outline:none;border-radius:26px;overflow:hidden;background:#3D3AF2;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 4px #FFB02E;user-select:none;-webkit-user-select:none;touch-action:manipulation}' +
    '#jg canvas{display:block;width:100%;height:auto;background:#3D3AF2}' +
    '.jg-hud{position:absolute;left:16px;top:12px;font:800 .95rem "Poppins",system-ui,sans-serif;color:#fff;text-shadow:0 2px 0 rgba(20,18,43,.35);pointer-events:none}' +
    '.jg-hud b{color:#FFB02E}' +
    '.jg-x{position:absolute;right:10px;top:10px;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.18);color:#fff;font:700 1.4rem/1 system-ui;cursor:pointer;z-index:3}' +
    '.jg-x:hover{background:rgba(255,255,255,.32)}.jg-x:focus-visible{outline:3px solid #FFB02E}' +
    '.jg-msg{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:18px;color:#fff;font-family:"Poppins",system-ui,sans-serif;background:rgba(20,18,43,.42);z-index:2}' +
    '.jg-msg[hidden]{display:none}' +
    '.jg-msg h2{font-size:clamp(1.5rem,5.5vw,2.5rem);font-weight:800;letter-spacing:-.02em;line-height:1.1}' +
    '.jg-msg h2 em{font-style:normal;color:#FFB02E}' +
    '.jg-msg p{font:700 clamp(.85rem,2.6vw,1.05rem) "Nunito",system-ui,sans-serif;opacity:.95;max-width:30em}' +
    '.jg-btns{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}' +
    '.jg-btn{font:800 clamp(.9rem,2.8vw,1.05rem) "Poppins",system-ui,sans-serif;border:0;border-radius:99px;padding:13px 24px;cursor:pointer;text-decoration:none;display:inline-block;transition:transform .15s}' +
    '.jg-btn:hover{transform:translateY(-2px)}.jg-btn:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
    '.jg-a{background:#FFB02E;color:#14122B}.jg-b{background:#24D6A5;color:#14122B}' +
    '.jg-hint{font:700 .8rem "Nunito",system-ui,sans-serif;opacity:.8;margin-top:2px}';
  document.head.appendChild(css);

  /* ---------- armado ---------- */
  function build() {
    root = document.createElement('div'); root.id = 'jg'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', T.title);
    root.innerHTML =
      '<div class="jg-box" tabindex="-1"><canvas></canvas>' +
      '<div class="jg-hud" aria-live="off"></div>' +
      '<button class="jg-x" type="button" aria-label="' + T.close + '">×</button>' +
      '<div class="jg-msg" id="jg-start"><h2>' + T.title.replace(/(\S+)$/, '<em>$1</em>') + '</h2><p>' + T.sub + '</p><div class="jg-btns"><button class="jg-btn jg-a" type="button" data-go>' + T.start + '</button></div><div class="jg-hint">' + T.hint + '</div></div>' +
      '<div class="jg-msg" id="jg-over" hidden><h2>' + T.over + '</h2><p id="jg-sc"></p><div class="jg-btns"><button class="jg-btn jg-a" type="button" data-go>' + T.again + '</button><a class="jg-btn jg-b" href="' + WA + '" target="_blank" rel="noopener">' + T.cta + '</a></div></div>' +
      '</div>';
    document.body.appendChild(root);
    cv = root.querySelector('canvas'); ctx = cv.getContext('2d');
    root.querySelector('.jg-x').addEventListener('click', close);
    root.addEventListener('mousedown', function (e) { if (e.target === root) close(); });
    root.querySelectorAll('[data-go]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); begin(); }); });
    cv.addEventListener('pointerdown', function (e) { e.preventDefault(); if (st === 'run') jump(); else if (st === 'ready') begin(); });
  }
  function size() {
    W = window.innerWidth < 700 ? 480 : 900; H = 390; GY = H - 62;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  /* ---------- estado del juego ---------- */
  var L, obs, flo, bgx, t, dist, score, flowers, speed, nextObs, mileMsg, mileT, parts, holding;
  function reset() {
    L = { x: 84, y: GY, vy: 0, w: 83, h: 96, air: false, f: 0, ft: 0 };
    obs = []; flo = []; parts = []; bgx = 0; t = 0; dist = 0; score = 0; flowers = 0; speed = 340; nextObs = 520; mileMsg = ''; mileT = 0; holding = false;
  }
  function jump() {
    if (!L.air) { L.vy = -800; L.air = true; holding = true; beep(520, .08); }
  }
  function beep(f, d) {
    try { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; var c = beep.c || (beep.c = new AC()); if (c.state === 'suspended') c.resume();
      var o = c.createOscillator(), g = c.createGain(); o.type = 'square'; o.frequency.value = f; g.gain.value = .04; g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + d);
      o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + d); } catch (e) {}
  }
  function begin() {
    reset(); st = 'run'; last = 0;
    root.querySelector('#jg-start').hidden = true; root.querySelector('#jg-over').hidden = true;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function spawn() {
    var jumpDist = speed * 0.74, r = Math.random(), type = r < .4 ? 'bug' : r < .72 ? 'err' : 'pop', cluster = Math.random() < .28 ? 2 : 1, x = W + 40;
    for (var i = 0; i < cluster; i++) {
      var o = type === 'bug' ? { k: 'bug', w: 40, h: 32 } : type === 'err' ? { k: 'err', w: 68, h: 46 } : { k: 'pop', w: 52, h: 60 };
      o.x = x; o.y = GY - o.h; obs.push(o); x += o.w + 14;
    }
    var span = x - (W + 40);
    if (Math.random() < .65) { // arco de flores sobre el obstáculo
      for (var j = 0; j < 3; j++) flo.push({ x: W + 40 + span / 2 + (j - 1) * 46, y: GY - 120 - (j === 1 ? 26 : 0), r: 11, a: Math.random() * 6 });
    }
    if (Math.random() < .3) flo.push({ x: W + 40 + span + jumpDist * .6, y: GY - 34, r: 11, a: Math.random() * 6 });
    nextObs = span + jumpDist * (1.15 + Math.random() * .95);
  }
  function hit(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }

  function update(dt) {
    t += dt; speed = Math.min(780, 340 + t * 15); dist += speed * dt; bgx += speed * dt;
    // Luca
    var g = (holding && L.vy < 0) ? 1500 : 2300;
    L.vy += g * dt; L.y += L.vy * dt;
    if (L.y >= GY) { L.y = GY; L.vy = 0; L.air = false; }
    L.ft += dt * (speed / 38); L.f = L.air ? 3 : Math.floor(L.ft) % 10;
    // obstáculos / flores
    nextObs -= speed * dt; if (nextObs <= 0) spawn();
    var box = { x: L.x + 16, y: L.y - L.h + 16, w: L.w - 30, h: L.h - 20 };
    for (var i = obs.length - 1; i >= 0; i--) {
      var o = obs[i]; o.x -= speed * dt; if (o.x + o.w < -20) { obs.splice(i, 1); continue; }
      if (hit(box, { x: o.x + 5, y: o.y + 5, w: o.w - 10, h: o.h - 8 })) return gameOver();
    }
    for (var k = flo.length - 1; k >= 0; k--) {
      var f = flo[k]; f.x -= speed * dt; f.a += dt * 3;
      if (f.x < -30) { flo.splice(k, 1); continue; }
      var dx = f.x - (box.x + box.w / 2), dy = f.y - (box.y + box.h / 2);
      if (Math.abs(dx) < 34 && Math.abs(dy) < 52) { flowers++; flo.splice(k, 1); beep(880, .09); for (var p = 0; p < 7; p++) parts.push({ x: f.x, y: f.y, vx: (Math.random() - .5) * 240, vy: -Math.random() * 220, l: .5 }); }
    }
    for (var q = parts.length - 1; q >= 0; q--) { var pa = parts[q]; pa.l -= dt; pa.x += pa.vx * dt; pa.y += pa.vy * dt; pa.vy += 700 * dt; if (pa.l <= 0) parts.splice(q, 1); }
    var ns = Math.floor(dist / 14) + flowers * 10;
    if (ns !== score) { for (var m in MILE) { if (score < +m && ns >= +m) { mileMsg = MILE[m]; mileT = 2; } } score = ns; }
    if (mileT > 0) mileT -= dt;
    root.querySelector('.jg-hud').innerHTML = T.hud + ' <b>' + score + '</b> · ' + T.best + ' <b>' + Math.max(best, score) + '</b> · 🌼 ' + flowers;
  }
  function gameOver() {
    st = 'over'; beep(150, .35);
    if (score > best) { best = score; try { localStorage.setItem('ixtliJuegoBest', String(best)); } catch (e) {} }
    setTimeout(function () {
      if (!open || st !== 'over') return;
      root.querySelector('#jg-sc').textContent = T.pts + ': ' + score + '  ·  ' + T.best + ': ' + best + '  ·  🌼 ' + flowers;
      root.querySelector('#jg-over').hidden = false;
      var b = root.querySelector('#jg-over [data-go]'); if (b) b.focus();
    }, 550);
  }

  /* ---------- dibujo ---------- */
  function flower(x, y, r, a, col1, col2) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    for (var i = 0; i < 8; i++) { ctx.fillStyle = i < 4 ? col1 : col2; ctx.save(); ctx.rotate(i * Math.PI / 4); ctx.beginPath(); ctx.ellipse(0, -r * .72, r * .36, r * .64, 0, 0, 6.3); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = '#FFF8F0'; ctx.beginPath(); ctx.arc(0, 0, r * .3, 0, 6.3); ctx.fill(); ctx.restore();
  }
  function rr(x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
  function drawObs(o) {
    if (o.k === 'bug') {
      ctx.fillStyle = '#14122B'; ctx.lineWidth = 3; ctx.strokeStyle = '#14122B';
      for (var i = 0; i < 3; i++) { var lx = o.x + 9 + i * 11; ctx.beginPath(); ctx.moveTo(lx, o.y + o.h - 8); ctx.lineTo(lx - 5, o.y + o.h + 3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(lx + 4, o.y + o.h - 8); ctx.lineTo(lx + 9, o.y + o.h + 3); ctx.stroke(); }
      ctx.fillStyle = '#FF6B57'; ctx.beginPath(); ctx.ellipse(o.x + o.w / 2, o.y + o.h / 2 + 2, o.w / 2, o.h / 2 - 1, 0, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#14122B'; ctx.beginPath(); ctx.arc(o.x + o.w / 2 - 2, o.y + o.h / 2 + 8, 2.6, 0, 6.3); ctx.arc(o.x + o.w / 2 + 9, o.y + o.h / 2 + 8, 2.6, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(o.x + o.w / 2 + 4, o.y + 10, 4.5, 0, 6.3); ctx.arc(o.x + o.w / 2 - 8, o.y + 11, 4, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#14122B'; ctx.beginPath(); ctx.arc(o.x + o.w / 2 + 5, o.y + 11, 2, 0, 6.3); ctx.arc(o.x + o.w / 2 - 7, o.y + 12, 1.8, 0, 6.3); ctx.fill();
    } else if (o.k === 'err') {
      ctx.fillStyle = '#14122B'; rr(o.x, o.y, o.w, o.h, 8); ctx.fill();
      ctx.strokeStyle = '#FF6B57'; ctx.lineWidth = 3; rr(o.x + 3, o.y + 3, o.w - 6, o.h - 6, 6); ctx.stroke();
      ctx.fillStyle = '#FFF8F0'; ctx.font = '800 22px Poppins,system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('404', o.x + o.w / 2, o.y + o.h / 2 + 1);
    } else {
      ctx.fillStyle = '#FFF8F0'; rr(o.x, o.y, o.w, o.h, 7); ctx.fill();
      ctx.fillStyle = '#8a5cff'; rr(o.x, o.y, o.w, 16, 7); ctx.fill(); ctx.fillRect(o.x, o.y + 9, o.w, 7);
      ctx.fillStyle = '#FFF8F0'; ctx.font = '800 11px system-ui'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText('×', o.x + o.w - 6, o.y + 8);
      ctx.fillStyle = '#14122B'; ctx.fillRect(o.x + 8, o.y + 25, o.w - 16, 5); ctx.fillRect(o.x + 8, o.y + 35, o.w - 26, 5);
      ctx.fillStyle = '#FF6B57'; rr(o.x + 8, o.y + 45, o.w - 16, 9, 4); ctx.fill();
    }
  }
  function draw() {
    var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3D3AF2'); g.addColorStop(1, '#6a3df0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // sol y ventanitas lejanas (parallax)
    ctx.fillStyle = 'rgba(255,176,46,.95)'; ctx.beginPath(); ctx.arc(W - 64, 78, 30, 0, 6.3); ctx.fill();
    for (var i = 0; i < 6; i++) { var bx = ((i * 230 - bgx * .12) % (W + 260) + (W + 260)) % (W + 260) - 130; ctx.fillStyle = 'rgba(255,255,255,.08)'; rr(bx, GY - 120 - (i % 3) * 22, 110, 80 + (i % 3) * 22, 10); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.16)'; rr(bx, GY - 120 - (i % 3) * 22, 110, 14, 8); ctx.fill(); }
    for (var c = 0; c < 4; c++) { var cx = ((c * 300 - bgx * .3) % (W + 300) + (W + 300)) % (W + 300) - 150, cy = 60 + (c % 2) * 52; ctx.fillStyle = 'rgba(255,248,240,.22)'; ctx.beginPath(); ctx.ellipse(cx, cy, 52, 15, 0, 0, 6.3); ctx.ellipse(cx + 30, cy - 10, 30, 14, 0, 0, 6.3); ctx.fill(); }
    // suelo con huellitas
    ctx.fillStyle = '#FFF8F0'; ctx.fillRect(0, GY, W, H - GY);
    ctx.fillStyle = '#e7e2f2'; ctx.fillRect(0, GY, W, 4);
    ctx.fillStyle = '#FFB02E';
    for (var p = 0; p < 12; p++) { var px = ((p * 120 - bgx) % (W + 120) + (W + 120)) % (W + 120) - 40, py = GY + 22 + (p % 2) * 18; ctx.beginPath(); ctx.ellipse(px, py + 3, 6, 5, 0, 0, 6.3); ctx.ellipse(px - 6, py - 4, 2.6, 3.4, 0, 0, 6.3); ctx.ellipse(px - 2, py - 7, 2.6, 3.4, 0, 0, 6.3); ctx.ellipse(px + 2, py - 7, 2.6, 3.4, 0, 0, 6.3); ctx.ellipse(px + 6, py - 4, 2.6, 3.4, 0, 0, 6.3); ctx.fill(); }
    // flores, obstáculos
    flo.forEach(function (f) { flower(f.x, f.y + Math.sin(f.a) * 4, f.r, f.a * .4, '#FFB02E', '#FF6B57'); });
    obs.forEach(drawObs);
    // Luca (hoja de sprites: 14 cuadros de 208x240; los 10 primeros son la caminata)
    if (sheetOk && L) {
      ctx.save(); ctx.translate(L.x, L.y - L.h); if (L.air) { ctx.translate(L.w / 2, L.h / 2); ctx.rotate(Math.max(-.25, Math.min(.25, L.vy / 3600))); ctx.translate(-L.w / 2, -L.h / 2); }
      ctx.drawImage(sheet, L.f * 208, 0, 208, 240, 0, 0, L.w, L.h); ctx.restore();
    } else if (L) { ctx.fillStyle = '#FFB02E'; rr(L.x, L.y - L.h, L.w, L.h, 14); ctx.fill(); }
    // sombra
    if (L) { ctx.fillStyle = 'rgba(20,18,43,.18)'; var sc = 1 - Math.min(.5, (GY - L.y) / 300); ctx.beginPath(); ctx.ellipse(L.x + L.w / 2 + 4, GY + 3, 30 * sc, 5 * sc, 0, 0, 6.3); ctx.fill(); }
    parts.forEach(function (pa) { ctx.fillStyle = 'rgba(255,176,46,' + Math.max(0, pa.l * 2) + ')'; ctx.beginPath(); ctx.arc(pa.x, pa.y, 3.2, 0, 6.3); ctx.fill(); });
    if (mileT > 0) { ctx.globalAlpha = Math.min(1, mileT); ctx.fillStyle = '#FFF8F0'; ctx.font = '800 ' + (W < 700 ? 20 : 26) + 'px Poppins,system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(mileMsg, W / 2, 70); ctx.globalAlpha = 1; }
  }
  function loop(ts) {
    if (!open) return;
    if (!last) last = ts; var dt = Math.min(.05, (ts - last) / 1000); last = ts;
    if (st === 'run') update(dt);
    draw();
    if (st === 'run' || st === 'over') raf = requestAnimationFrame(loop);
  }

  /* ---------- abrir / cerrar ---------- */
  function onKey(e) {
    if (!open) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      var t = e.target && e.target.tagName; if (t === 'A' || (t === 'BUTTON' && st !== 'run')) { if (e.code === 'Space' || e.key === 'Enter') return; }
      e.preventDefault(); if (st === 'run') jump(); else if (st === 'ready') begin();
    }
  }
  function onKeyUp(e) { if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') holding = false; }
  function onVis() { if (document.hidden && open && st === 'run') { st = 'ready'; root.querySelector('#jg-start').hidden = false; } }
  function onResize() { if (open) { size(); draw(); } }
  function openGame() {
    if (open) return; open = true;
    if (!root) build();
    lastFocus = document.activeElement; size(); reset(); st = 'ready';
    root.classList.add('on'); root.querySelector('#jg-start').hidden = false; root.querySelector('#jg-over').hidden = true;
    document.documentElement.style.overflow = 'hidden';
    root.querySelector('.jg-hud').textContent = T.hud + ' 0 · ' + T.best + ' ' + best;
    draw(); root.querySelector('.jg-box').focus();
    document.addEventListener('keydown', onKey, true); document.addEventListener('keyup', onKeyUp, true);
    document.addEventListener('visibilitychange', onVis); window.addEventListener('resize', onResize);
    try { if (window.__ixtliEgg) window.__ixtliEgg('juego'); } catch (e) {}
  }
  function close() {
    if (!open) return; open = false; st = 'ready'; cancelAnimationFrame(raf);
    root.classList.remove('on'); document.documentElement.style.overflow = '';
    document.removeEventListener('keydown', onKey, true); document.removeEventListener('keyup', onKeyUp, true);
    document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', onResize);
    try { if (lastFocus && lastFocus.focus) lastFocus.focus(); } catch (e) {}
  }
  window.ixtliJuego = openGame;

  /* ---------- cómo se descubre ---------- */
  var buf = '';
  document.addEventListener('keydown', function (e) {
    if (open || e.ctrlKey || e.metaKey || e.altKey || !e.key || e.key.length !== 1) return;
    var t = e.target && e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || (e.target && e.target.isContentEditable)) { buf = ''; return; }
    buf = (buf + e.key.toLowerCase()).slice(-5);
    if (buf === 'ixtli') { buf = ''; openGame(); }
  });
  // celular: 5 toques seguidos en la línea de derechos del pie de página
  var taps = [];
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('.site-foot') : null; if (!el) return;
    if (e.target.closest('a,button,input,textarea,select,label,.xm-foot')) return;
    var now = Date.now(); taps = taps.filter(function (x) { return now - x < 3000; }); taps.push(now);
    if (taps.length >= 5) { taps = []; openGame(); }
  }, true);
})();
