/* ==========================================================================
   VARIABLES GLOBALES Y ESTADO DE LA APLICACIÓN
   ========================================================================== */
const PGS = ['home', 'col', 'antes', 'nos', 'blog', 'corporate', 'membresias'];
let cur = 'home';

// URL TAXONOMY — slugs para las URLs limpias
const PAGE_SLUGS = { home: 'inicio', col: 'colecciones', antes: 'antes-y-despues', nos: 'metodo-amatista', blog: 'bitacora', corporate: 'corporate', membresias: 'membresias' };
const SLUG_PAGES = Object.fromEntries(Object.entries(PAGE_SLUGS).map(([k, v]) => [v, k]));
const ANCHOR_SLUGS = { 'quiz-anchor': 'colecciones', 'proc-anchor': 'proceso', 'sim-anchor': 'simulador', 'col-quiz': 'diagnostico' };
const ANCHOR_PAGE_OF = { 'quiz-anchor': 'home', 'proc-anchor': 'home', 'sim-anchor': 'home', 'col-quiz': 'col' };

/* ==========================================================================
   ENRUTADOR (SPA Navigation)
   ========================================================================== */
function setHash(pageId, anchorId) {
  const slug = PAGE_SLUGS[pageId] || pageId;
  const sub = anchorId ? (ANCHOR_SLUGS[anchorId] ? '/' + ANCHOR_SLUGS[anchorId] : '') : '';
  history.pushState(null, '', '#' + slug + sub);
}

function parseHashAndRender(initial) {
  const raw = location.hash.replace(/^#/, '');
  if (!raw) { if (!initial) { go('home', true); } return; }
  const [pSlug, aSlug] = raw.split('/');
  const pageId = SLUG_PAGES[pSlug] || 'home';
  const anchorId = aSlug ? Object.keys(ANCHOR_SLUGS).find(k => ANCHOR_SLUGS[k] === aSlug && ANCHOR_PAGE_OF[k] === pageId) : null;
  if (anchorId) { goAnchor(pageId, anchorId, true); }
  else { go(pageId, true); }
}

function go(id, skipHash) {
  PGS.forEach(p => document.getElementById('pg-' + p).classList.remove('active'));
  document.getElementById('pg-' + id).classList.add('active');
  cur = id; window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelectorAll('[data-p]').forEach(a => a.classList.toggle('cur', a.dataset.p === id));
  const cd = document.getElementById('colDrop'); if (cd) cd.classList.remove('open');
  if (!skipHash) setHash(id);
  setTimeout(rev, 120);
  setTimeout(initCounters, 150);
}

function goAnchor(pageId, anchorId, skipHash) {
  const alreadyThere = cur === pageId;
  if (!alreadyThere) {
    PGS.forEach(p => document.getElementById('pg-' + p).classList.remove('active'));
    document.getElementById('pg-' + pageId).classList.add('active');
    cur = pageId;
    document.querySelectorAll('[data-p]').forEach(a => a.classList.toggle('cur', a.dataset.p === pageId));
    const cd = document.getElementById('colDrop'); if (cd) cd.classList.remove('open');
    setTimeout(rev, 120);
    setTimeout(initCounters, 150);
  }
  if (!skipHash) setHash(pageId, anchorId);
  setTimeout(() => {
    const el = document.getElementById(anchorId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, alreadyThere ? 0 : 60);
}

window.addEventListener('popstate', () => parseHashAndRender(false));

/* ==========================================================================
   ANIMACIONES AL HACER SCROLL
   ========================================================================== */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 20);
  rev();
});

function rev() {
  document.querySelectorAll('#pg-' + cur + ' .rev').forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight - 50) el.classList.add('on');
  });
}
setTimeout(rev, 300);

/* ==========================================================================
   NAVEGACIÓN MÓVIL Y EFECTOS VISUALES
   ========================================================================== */
function toggleMnav() {
  document.getElementById('mnav').classList.toggle('open');
}

function toggleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('colDrop').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  const d = document.getElementById('colDrop');
  if (d && !d.contains(e.target)) d.classList.remove('open');
});

// Píldora de navegación
(function () {
  const wrap = document.getElementById('navLinks');
  const ind = document.getElementById('navPillInd');
  if (!wrap || !ind) return;
  const links = wrap.querySelectorAll('.pill-link');
  function moveTo(el) {
    ind.style.left = el.parentElement.offsetLeft + 'px';
    ind.style.width = el.parentElement.offsetWidth + 'px';
  }
  links.forEach(l => l.addEventListener('mouseenter', () => moveTo(l)));
  wrap.addEventListener('mouseleave', () => { ind.style.width = '0px'; });
})();

// Cursor Spotlight en Home
(function () {
  const hero = document.getElementById('heroSpot');
  const spot = document.getElementById('heroSpotBg');
  if (hero && spot) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      spot.style.background = `radial-gradient(circle 460px at ${x}% ${y}%, rgba(139,106,154,.32), transparent 70%)`;
    });
  }
})();

// Cursor Spotlight en Quiz
(function () {
  const q = document.getElementById('quiz-anchor');
  const spot = document.getElementById('qstripSpotBg');
  if (q && spot) {
    q.addEventListener('mousemove', (e) => {
      const r = q.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      spot.style.background = `radial-gradient(circle 460px at ${x}% ${y}%, rgba(139,106,154,.32), transparent 70%)`;
    });
  }
})();

/* ==========================================================================
   COMPONENTES INTERACTIVOS
   ========================================================================== */
// Acordeón de Proceso
function toggleStep(el) {
  const wasOpen = el.classList.contains('open');
  el.parentElement.querySelectorAll('.ts').forEach(s => s.classList.remove('open'));
  if (!wasOpen) el.classList.add('open');
}

// Filtro de Colecciones
function scol(id, el) {
  document.querySelectorAll('.cni').forEach(i => i.classList.remove('on')); el.classList.add('on');
  const t = document.getElementById(id);
  if (t) { window.scrollTo({ top: t.getBoundingClientRect().top + pageYOffset - 130, behavior: 'smooth' }); }
}

// Filtro de Blog
function bfilt(cat, el) {
  document.querySelectorAll('.bfilt').forEach(b => b.classList.remove('on')); el.classList.add('on');
  document.querySelectorAll('.bc2').forEach(c => { c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none'; });
}

// Contadores Animados
function animateCounter(el, fast) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const isDecimal = String(target).includes('.');
  const dur = fast ? 450 : 1300;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
  }
  requestAnimationFrame(step);
}

const countedEls = new Set();
function initCounters() {
  document.querySelectorAll('#pg-' + cur + ' [data-count]').forEach(el => {
    if (el._hoverBound) return;
    el._hoverBound = true;
    el.style.cursor = 'default';
    el.addEventListener('mouseenter', () => animateCounter(el, true));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countedEls.has(el)) {
          countedEls.add(el);
          animateCounter(el, false);
          io.disconnect();
        }
      });
    }, { threshold: .4 });
    io.observe(el);
  });
}

/* ==========================================================================
   QUIZ DE COLECCIONES
   ========================================================================== */
let qans = {}, qcur = 0;
const CM = {
  natural: { n: 'Natura', d: 'Mi prioridad es la naturalidad. Natura en E-MAX estratificado multicapa recrea el diente natural con translucidez y mamelones reales.', bg: 'linear-gradient(160deg,#FBF3E4,#EDDCC0)', c: '#3A2010' },
  impacto: { n: 'Glow', d: 'Busco impacto y presencia. Glow en porcelana 100% premium me da el brillo más intenso y una sonrisa que conquista a primera vista.', bg: 'linear-gradient(160deg,#FFF2B8,#E8B923)', c: '#3A2800' },
  clasico: { n: 'E·MAX', d: 'Valoro la elegancia clásica. E-MAX en disilicato de litio es el estándar internacional con alta durabilidad y uniformidad atemporal.', bg: 'linear-gradient(160deg,#5C2A52,#2B1228)', c: '#fff' },
  accesible: { n: 'Diseño 3D', d: 'Quiero la mejor relación valor/resultado. Diseño 3D combina resina y zirconio para una transformación digital al mejor precio.', bg: 'linear-gradient(160deg,#7B5A90,#482D54)', c: '#fff' },
  artistico: { n: 'Prisma', d: 'Soy único y quiero una sonrisa que lo refleje. Prisma con cortes prismáticos crea una reflexión de la luz irrepetible.', bg: 'linear-gradient(160deg,#FCFCFE,#AEAEBA)', c: '#282828' }
};

function qsel(el, n, ans) {
  el.closest('.qopts').querySelectorAll('.qopt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel'); qans[n] = ans;
  setTimeout(() => qnext(n), 380);
}

function qnext(n) {
  document.getElementById('qq' + n).classList.remove('on');
  document.querySelectorAll('.qps').forEach((s, i) => { s.classList.remove('cur', 'done'); if (i < n + 1) s.classList.add('done'); if (i === n + 1) s.classList.add('cur'); });
  const nx = document.getElementById('qq' + (n + 1));
  if (nx) { nx.classList.add('on'); qcur = n + 1; }
  else { document.getElementById('qlead').classList.add('on'); document.getElementById('qprog').style.display = 'none'; }
}

function qresult() {
  document.getElementById('qlead').classList.remove('on');
  document.getElementById('qres').classList.add('on');
  const k = qans[0] || 'impacto'; const c = CM[k] || CM.impacto;
  const card = document.getElementById('rcard');
  card.style.background = c.bg; card.style.color = c.c;
  document.getElementById('rname').textContent = c.n;
  document.getElementById('rdesc').textContent = c.d;
}

function qreset() {
  qans = {}; qcur = 0;
  document.querySelectorAll('.qq').forEach(q => q.classList.remove('on'));
  document.getElementById('qq0').classList.add('on');
  document.querySelectorAll('.qopt').forEach(o => o.classList.remove('sel'));
  document.getElementById('qlead').classList.remove('on');
  document.getElementById('qres').classList.remove('on');
  document.getElementById('qprog').style.display = 'flex';
  document.querySelectorAll('.qps').forEach((s, i) => { s.className = 'qps' + (i === 0 ? ' cur' : ''); });
}

/* ==========================================================================
   SIMULADOR DE CÁMARA
   ========================================================================== */
let stream = null, curCol = '3d', photoDone = false;
const CD = {
  '3d': { n: 'Diseño 3D', d: 'La colección de entrada al diseño digital. Resina + zirconio para un resultado accesible.', hbg: 'linear-gradient(135deg,#7B5A90,#482D54)', hc: '#fff', ov: 'rgba(180,160,210,0.28)' },
  'emax': { n: 'E·MAX', d: 'El gold standard mundial. Disilicato de litio con uniformidad y alta durabilidad.', hbg: 'linear-gradient(135deg,#5C2A52,#2B1228)', hc: '#fff', ov: 'rgba(140,120,180,0.22)' },
  'natura': { n: 'Natura', d: 'La sonrisa más natural. E-MAX estratificado con translucidez y mamelones reales.', hbg: 'linear-gradient(135deg,#EDDCC0,#D8C4A0)', hc: '#3A2010', ov: 'rgba(240,220,190,0.32)' },
  'glow': { n: 'Glow', d: 'Porcelana 100% premium. El brillo más intenso y una sonrisa que conquista.', hbg: 'linear-gradient(135deg,#FFF2B8,#E8B923)', hc: '#3A2800', ov: 'rgba(245,220,120,0.32)' },
  'prisma': { n: 'Prisma', d: 'El nivel más exclusivo. Cortes prismáticos que crean reflexión de luz irrepetible.', hbg: 'linear-gradient(135deg,#FCFCFE,#AEAEBA)', hc: '#282828', ov: 'rgba(220,220,220,0.38)' }
};

async function startCam() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
    const v = document.getElementById('cv'); v.srcObject = stream; await v.play();
    document.getElementById('cov').classList.add('hide');
    document.getElementById('sg').classList.add('show');
    document.getElementById('cosel').style.display = 'flex';
    document.getElementById('cctrl').style.display = 'flex';
    document.getElementById('crpanel').classList.add('show');
    document.getElementById('ps1').classList.remove('on');
    document.getElementById('ps2').classList.add('on');
    selCol('3d', document.querySelector('.cos'));
  } catch (e) { alert('No se pudo acceder a la cámara. Por favor permite el acceso en tu navegador.'); }
}

function selCol(id, el) {
  document.querySelectorAll('.cos').forEach(i => i.classList.remove('on')); el.classList.add('on');
  curCol = id; const d = CD[id];
  document.getElementById('crph').style.background = d.hbg;
  document.getElementById('crpn').style.color = d.hc;
  document.getElementById('crpn').textContent = d.n;
  document.getElementById('crpd').textContent = d.d;
  if (!photoDone) drawOv();
}

function drawOv() {
  const v = document.getElementById('cv'), c = document.getElementById('cc');
  if (!v.videoWidth) { requestAnimationFrame(drawOv); return; }
  c.style.display = 'block'; c.width = v.videoWidth; c.height = v.videoHeight;
  const ctx = c.getContext('2d'), d = CD[curCol];
  const cx = c.width / 2, sy = c.height * .65, rx = c.width * .18, ry = c.height * .09;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, sy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = d.ov; ctx.fill();
  const g = ctx.createRadialGradient(cx, sy, rx * .3, cx, sy, rx * 1.2);
  g.addColorStop(0, d.ov.replace(/[\d.]+\)$/, '0.1)')); g.addColorStop(1, 'transparent');
  ctx.beginPath(); ctx.ellipse(cx, sy, rx * 1.3, ry * 1.3, 0, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
  ctx.restore();
  ctx.font = `bold ${c.width * .024}px 'Cormorant Garamond',serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.textAlign = 'center';
  ctx.fillText(CD[curCol].n, cx, sy + ry + c.height * .05);
  if (!photoDone) requestAnimationFrame(drawOv);
}

function capPhoto() {
  const v = document.getElementById('cv'), c = document.getElementById('cc');
  const ctx = c.getContext('2d');
  ctx.drawImage(v, 0, 0, c.width, c.height);
  photoDone = true;
  if (stream) stream.getTracks().forEach(t => t.stop());
  document.getElementById('sg').classList.remove('show');
  document.getElementById('ps2').classList.remove('on');
  document.getElementById('ps3').classList.add('on');
  document.getElementById('cctrl').innerHTML = `
    <a href="${c.toDataURL('image/png')}" download="mi-sonrisa-amatista.png" class="btn-p"><svg class="ic"><use href="#i-camera"/></svg>Quiero descargar mi foto</a>
    <button class="btn-g" onclick="waResult()">Quiero compartir con mi asesor →</button>
    <button style="color:var(--muted);font-size:13px;cursor:pointer;" onclick="resetCam()">Quiero reiniciar</button>`;
}

function resetCam() {
  photoDone = false;
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  const v = document.getElementById('cv'), c = document.getElementById('cc');
  v.srcObject = null; c.style.display = 'none';
  c.getContext('2d').clearRect(0, 0, 9999, 9999);
  document.getElementById('cov').classList.remove('hide');
  document.getElementById('sg').classList.remove('show');
  document.getElementById('cosel').style.display = 'none';
  document.getElementById('cctrl').style.display = 'none';
  document.getElementById('crpanel').classList.remove('show');
  ['ps1', 'ps2', 'ps3'].forEach((id, i) => document.getElementById(id).classList.toggle('on', i === 0));
  document.getElementById('cctrl').innerHTML = '<button class="btn-p" onclick="capPhoto()"><svg class="ic"><use href="#i-camera"/></svg>Quiero capturar mi foto</button><button class="btn-g" onclick="resetCam()">Quiero reiniciar</button>';
}

/* ==========================================================================
   WHATSAPP Y MODALES LEGALES
   ========================================================================== */
function wa() {
  const m = encodeURIComponent('Hola Amatista, me interesa conocer más sobre sus tratamientos de diseño de sonrisa.');
  window.open('https://wa.me/13322310346?text=' + m, '_blank');
}

function waResult() {
  const m = encodeURIComponent(`Hola Amatista, usé el probador de sonrisa y me interesó la colección ${CD[curCol].n}. Quisiera agendar una evaluación gratuita.`);
  window.open('https://wa.me/13322310346?text=' + m, '_blank');
}

function openModal(id) { document.getElementById('modal-' + id).classList.add('open'); }
function closeModal(id) { document.getElementById('modal-' + id).classList.remove('open'); }
document.querySelectorAll('.modal-bg').forEach(m => {
  m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('open'); });
});

/* ==========================================================================
   INYECCIÓN DINÁMICA (FOOTER Y LEAD FORM)
   ========================================================================== */
const FOOTER_HTML = `
<footer>
  <div class="ftop">
    <div class="fbrand">
      <div class="flogo">
  <img src="assets/logo-amatista.png" alt="Amatista Dental Group" class="main-logo">
</div>
      <p>Diseño de sonrisa premium en una sola sesión de 5 horas. +45,000 sonrisas transformadas en México, Estados Unidos, Colombia y República Dominicana.</p>
      <a class="fwa" onclick="wa()"><svg class="ic"><use href="#i-whatsapp"/></svg>Quiero escribir por WhatsApp</a>
    </div>
    <div class="fcol"><h4>Navegar</h4>
      <a onclick="go('home')">Inicio</a><a onclick="goAnchor('home','quiz-anchor')">Colecciones</a><a onclick="goAnchor('home','proc-anchor')">Proceso</a><a onclick="goAnchor('home','sim-anchor')">Simular mi Sonrisa</a>
    </div>
    <div class="fcol"><h4>Explorar</h4>
      <a onclick="goAnchor('col','col-top')">Ver las 5 colecciones</a><a onclick="go('antes')">Antes y Después</a><a onclick="go('nos')">El Método Amatista</a><a onclick="go('blog')">Bitácora</a><a onclick="go('corporate')">Corporate</a><a onclick="go('membresias')">Membresías</a>
    </div>
    <div class="fcol"><h4>Legal</h4>
      <a onclick="openModal('legal')">Aviso legal</a><a onclick="openModal('privacidad')">Política de privacidad</a><a onclick="openModal('cookies')">Política de cookies</a>
    </div>
  </div>
  <div class="fbot">
    <p>© 2026 Amatista Dental Group · Todos los derechos reservados. Colecciones sujetas a valoración previa.</p>
    <div class="flegal"><a onclick="openModal('legal')">Aviso legal</a><a onclick="openModal('privacidad')">Privacidad</a><a onclick="openModal('cookies')">Cookies</a></div>
  </div>
</footer>`;

const COUNTRY_CODES = [["México","+52"],["Estados Unidos","+1"],["Colombia","+57"],["República Dominicana","+1"],["Argentina","+54"],["España","+34"] /* Se acortó la lista en beneficio de la legibilidad, puedes rellenarla si lo deseas */];

function countryOptionsHTML() {
  const top = COUNTRY_CODES.slice(0, 4);
  const rest = COUNTRY_CODES.slice(4);
  const opt = (n, d, sel) => `<option value="${d}"${sel ? ' selected' : ''}>${n} (${d})</option>`;
  let html = '<optgroup label="Mercados Amatista">' + top.map((c, i) => opt(c[0], c[1], i === 0)).join('') + '</optgroup>';
  html += '<optgroup label="Otros países">' + rest.map(c => opt(c[0], c[1], false)).join('') + '</optgroup>';
  return html;
}

let lfCounter = 0;
function leadFormHTML(pageId) {
  lfCounter++;
  const uid = 'lf' + lfCounter;
  return `
  <div class="lf-wrap">
    <div class="ey"><span class="d"></span>Valoración gratuita</div>
    <h2 class="h2" style="font-size:32px;">Quiero agendar<br><em>mi valoración</em></h2>
    <p class="desc" style="margin:0 auto;">Dejo mis datos y un especialista Amatista me contacta en breve, sin compromiso.</p>
    <form onsubmit="submitLead(event,'${uid}')">
      <div class="lf-grid">
        <input class="lf-inp" type="text" placeholder="Mi nombre" required id="${uid}-name">
        <div class="lf-phone-wrap">
          <select class="lf-cc" id="${uid}-cc" aria-label="Código de país">${countryOptionsHTML()}</select>
          <input class="lf-inp" type="tel" placeholder="Mi WhatsApp" required id="${uid}-phone" inputmode="numeric">
        </div>
        <input class="lf-inp full" type="email" placeholder="Mi correo electrónico" required id="${uid}-email">
      </div>
      <button class="btn-p lf-btn" type="submit" id="${uid}-btn"><svg class="ic"><use href="#i-sparkle"/></svg><span>Quiero mi valoración gratis</span></button>
      <div class="lf-status" id="${uid}-status"><svg class="ic"><use href="#i-check"/></svg><span>Enviado. En breve uno de nuestros especialistas te contactará.</span></div>
      <div class="lf-note"><svg class="ic" style="width:13px;height:13px;"><use href="#i-shield"/></svg>Tus datos están protegidos. Sin compromiso.</div>
    </form>
  </div>`;
}

function submitLead(e, uid) {
  e.preventDefault();
  const btn = document.getElementById(uid + '-btn');
  const status = document.getElementById(uid + '-status');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Enviando...';
  status.classList.remove('show');
  setTimeout(() => {
    btn.style.display = 'none';
    status.classList.add('show');
    e.target.reset();
  }, 2000);
}

document.querySelectorAll('.leadform-slot').forEach(slot => {
  slot.outerHTML = `<section class="leadform">${leadFormHTML(slot.dataset.page)}</section>`;
});
document.querySelectorAll('.footer-slot').forEach(slot => {
  slot.outerHTML = FOOTER_HTML;
});

/* ==========================================================================
   IDIOMAS Y MONEDAS (i18n & Currency)
   ========================================================================== */
const TRANSLATIONS = {
  es: {
    'txt-nav-inicio': 'Inicio', 'txt-nav-col': 'Colecciones', 'txt-nav-proc': 'Proceso', 'txt-nav-corp': 'Corporate',
    'txt-nav-mem': 'Membresías', 'txt-nav-cta': 'Quiero mi valoración gratis', 'txt-dd-col1': 'Ver las 5 colecciones',
    'txt-dd-col2': '¿Cuál es la tuya? (mi diagnóstico)', 'txt-dd-col3': 'Antes y Después'
  },
  en: {
    'txt-nav-inicio': 'Home', 'txt-nav-col': 'Collections', 'txt-nav-proc': 'Process', 'txt-nav-corp': 'Corporate',
    'txt-nav-mem': 'Memberships', 'txt-nav-cta': 'Get my free assessment', 'txt-dd-col1': 'See all 5 collections',
    'txt-dd-col2': 'Which one is mine? (my quiz)', 'txt-dd-col3': 'Before & After'
  },
  pt: {
    'txt-nav-inicio': 'Início', 'txt-nav-col': 'Coleções', 'txt-nav-proc': 'Processo', 'txt-nav-corp': 'Corporativo',
    'txt-nav-mem': 'Assinaturas', 'txt-nav-cta': 'Quero minha avaliação gratuita', 'txt-dd-col1': 'Ver as 5 coleções',
    'txt-dd-col2': 'Qual é a minha? (meu quiz)', 'txt-dd-col3': 'Antes e Depois'
  }
};

let _lang = 'es';
function setLang(l) {
  _lang = l;
  const t = TRANSLATIONS[l];
  Object.keys(t).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = t[id];
  });
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase() === l);
  });
  document.documentElement.lang = l;
}

const FX = { MXN: 18.5, USD: 1, BRL: 5.0 };
let _curr = 'MXN', _sym = '$';

function setCurr(code, sym, label) {
  _curr = code; _sym = sym;
  const btn = document.getElementById('currBtn');
  if (btn) {
    document.getElementById('currSymbol').textContent = sym;
    document.getElementById('currCode').textContent = label;
  }
  updatePrices();
  document.querySelectorAll('.curr-menu div').forEach(d => {
    d.style.fontWeight = d.textContent.includes(code) ? '700' : '500';
  });
  closeCurrMenu();
}

function updatePrices() {
  document.querySelectorAll('[data-price-usd]').forEach(el => {
    const usd = parseFloat(el.dataset.priceUsd);
    const converted = Math.round(usd * FX[_curr]);
    el.textContent = _sym + converted.toLocaleString();
  });
}

function toggleCurrMenu() { document.getElementById('currMenu').classList.toggle('open'); }
function closeCurrMenu() {
  const m = document.getElementById('currMenu');
  if (m) m.classList.remove('open');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.curr-sel')) closeCurrMenu();
});

// Enviar formulario corporativo
function submitCorp(e) {
  e.preventDefault();
  alert('¡Gracias! Recibirás tu propuesta en menos de 24 horas. También puedes escribirnos por WhatsApp.');
  e.target.reset();
}

// Detectar región y aplicar moneda base
(function detectRegion() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('America/Sao_Paulo') || tz.includes('America/Manaus') || tz.startsWith('America/Belem')) {
      setCurr('BRL', 'R$', 'BRL');
    } else if (tz.startsWith('America/New_York') || tz.startsWith('America/Los_Angeles') || tz.startsWith('America/Chicago') || tz.startsWith('America/Denver')) {
      setCurr('USD', '$', 'USD');
    } else {
      setCurr('MXN', '$', 'MXN');
    }
  } catch (e) { }
})();

/* ==========================================================================
   INICIALIZACIÓN DE LA PÁGINA
   ========================================================================== */
if (location.hash) {
  parseHashAndRender(true);
} else {
  history.replaceState(null, '', '#inicio');
}