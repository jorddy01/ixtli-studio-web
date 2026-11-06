/* ixtli studio · tema navideño del sitio
   Se enciende solo del 1 de noviembre al 6 de enero. Para probarlo fuera de fecha: agrega ?navidad=1 a la dirección.
   Para apagarlo: ?navidad=0, o quita la línea <script src="navidad.js"> del HTML. */
(function () {
  var hoy = new Date(), mes = hoy.getMonth() + 1, dia = hoy.getDate();
  var activo = (mes === 11 || mes === 12 || (mes === 1 && dia <= 6));
  if (/[?&]navidad=1/.test(location.search)) activo = true;
  if (/[?&]navidad=0/.test(location.search)) activo = false;
  if (!activo) return;

  var en = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var cs = document.currentScript, base = (cs && cs.src) ? cs.src.replace(/navidad\.js.*$/, '') : '';
  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('xm');

  /* ---------- estilos ---------- */
  var css = '' +
    '.xm-bar{position:relative;z-index:95;background:#B3261E;color:#FFF8F0;text-align:center;font:700 .92rem "Poppins",sans-serif;padding:9px 48px 9px 16px;letter-spacing:.01em}' +
    '.xm-bar b{color:#FFD23F}' +
    '.xm-bar a{color:#FFD23F;text-decoration:underline;text-underline-offset:3px;margin-left:6px;white-space:nowrap}' +
    '.xm-bar button{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:0;color:#FFF8F0;font-size:1.2rem;cursor:pointer;opacity:.75;line-height:1;padding:4px}' +
    '@media (max-width:520px){.xm-bar{font-size:.8rem;padding:9px 40px 9px 12px}}' +
    '.xm-hat{position:absolute;pointer-events:none;z-index:5;transform:rotate(-14deg);filter:drop-shadow(0 2px 2px rgba(0,0,0,.3))}' +
    '.xm-nieve{position:fixed;inset:0;width:100%;height:100%;z-index:48;pointer-events:none}' +
    '.xm-foot{position:relative;z-index:2;text-align:center;font:700 .9rem "Poppins",sans-serif;color:#FFF8F0;padding:10px 16px 18px;opacity:.9}' +
    '';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- aviso rojo arriba ---------- */
  var off = false; try { off = !!sessionStorage.getItem('xmOff'); } catch (e) {}
  var nav = document.getElementById('navbar');
  if (!off && nav && nav.parentNode) {
    var bar = document.createElement('div'); bar.className = 'xm-bar'; bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', en ? 'Holiday season' : 'Temporada navideña');
    bar.innerHTML = en
      ? '🎄 <b>Happy holidays at ixtli studio:</b> does your business have its website yet? <a href="#cotiza">Get a quote</a><button type="button" aria-label="Close notice">×</button>'
      : '🎄 <b>Felices fiestas en ixtli studio:</b> ¿tu negocio ya tiene su página? <a href="#cotiza">Cotiza hoy</a><button type="button" aria-label="Cerrar aviso">×</button>';
    nav.parentNode.insertBefore(bar, nav);
    bar.querySelector('button').addEventListener('click', function () { bar.remove(); try { sessionStorage.setItem('xmOff', '1'); } catch (e) {} });
  }

  /* ---------- Luca con gorro (sustituye las imágenes de Luca) ---------- */
  [['.peek img', 'laptop'], ['.nm-cat', 'celebra'], ['.f-cat', 'senala']].forEach(function (p) {
    var i = document.querySelector(p[0]); if (i) i.src = base + 'img/luca-x-' + p[1] + '.png';
  });

  /* ---------- gorro de Santa sobre el logo ---------- */
  var lg = document.getElementById('lg'), logoA = lg && lg.parentNode;
  if (lg && logoA) {
    var hat = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    hat.setAttribute('viewBox', '0 0 120 90'); hat.setAttribute('class', 'xm-hat'); hat.setAttribute('aria-hidden', 'true');
    hat.innerHTML = '<path d="M8 74C10 36 36 10 76 8c16 0 24 10 28 22 8 10 10 28 10 44Z" fill="#E53935"/><path d="M30 24C44 14 60 10 76 8" stroke="#FF8A80" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/><rect x="2" y="68" width="118" height="20" rx="10" fill="#fff"/><circle cx="104" cy="30" r="11" fill="#fff"/>';
    logoA.style.position = 'relative'; logoA.appendChild(hat);
    var colocar = function () {
      var w = lg.getBoundingClientRect().width || 90, hw = Math.max(26, w * 0.3);
      hat.style.width = hw + 'px'; hat.style.height = (hw * 0.75) + 'px';
      // sobre el punto de la primera "i" (x≈12/155, y≈44/134 del dibujo)
      hat.style.left = (lg.offsetLeft + w * (12 / 155) - hw * 0.45) + 'px';
      hat.style.top = (lg.offsetTop + lg.getBoundingClientRect().height * (26 / 134) - hw * 0.62) + 'px';
    };
    colocar(); window.addEventListener('resize', colocar); window.addEventListener('load', colocar);
  }

  /* ---------- nieve ---------- */
  var cv = document.createElement('canvas'); cv.className = 'xm-nieve'; cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  var x = cv.getContext('2d'), w = 0, h = 0, F = [];
  function ajusta() { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; }
  ajusta(); window.addEventListener('resize', ajusta);
  var n = window.innerWidth < 600 ? 45 : 80;
  for (var j = 0; j < n; j++) F.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, r: 1.4 + Math.random() * 3, v: .35 + Math.random() * 1, a: Math.random() * 6.28 });
  function pinta() {
    x.clearRect(0, 0, w, h); x.fillStyle = 'rgba(255,255,255,.88)';
    F.forEach(function (f) {
      if (!quieto) { f.y += f.v; f.a += .02; f.x += Math.sin(f.a) * .5; if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; } }
      x.beginPath(); x.arc(f.x, f.y, f.r, 0, 6.283); x.fill();
    });
    if (!quieto) requestAnimationFrame(pinta);
  }
  pinta();

  /* ---------- mensaje en el pie ---------- */
  var foot = document.querySelector('.site-foot');
  if (foot) {
    var p = document.createElement('p'); p.className = 'xm-foot';
    p.textContent = en ? '🎄 Happy holidays from ixtli studio and Luca 🎁' : '🎄 Felices fiestas de parte de ixtli studio y Luca 🎁';
    foot.appendChild(p);
  }
})();
