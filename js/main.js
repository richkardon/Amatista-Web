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
   SIMULADOR DE CÁMARA (IA AVANZADA - MEDIAPIPE)
   ========================================================================== */
import { FilesetResolver, FaceLandmarker } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
const MODEL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const INNER_LIP = [78,191,80,81,82,13,312,311,310,415,308,324,318,402,317,14,87,178,88,95];
const CHEEKS = [205, 425];
const MAX_SIDE = 1600;     
const MIN_PROC_MS = 1700;  

/* El hex marca el matiz. tint aclara solo un poco sobre el diente real para que
   el tono se acople a la luz de la foto en lugar de verse como una muestra plana. */
const STYLES = {
  '3d':     { name: "Diseño 3D", hex: "#f0e7fb", tint: 0.16, hue: 0.78, keep: 0.86, even: 0.22, smooth: 0.06, gaps: 0,    panel: "linear-gradient(135deg,#7B5A90,#482D54)", ink: "#fff",    muted: "rgba(255,255,255,.6)", blurb: "La colección de entrada al diseño digital. Resina + zirconio para un resultado accesible y personalizado." },
  'emax':   { name: "E·MAX",     hex: "#f6f2ff", tint: 0.22, hue: 0.72, keep: 0.78, even: 0.40, smooth: 0.14, gaps: 0,    panel: "linear-gradient(135deg,#5C2A52,#2B1228)", ink: "#fff",    muted: "rgba(255,255,255,.6)", blurb: "El E-MAX es la colección de disilicato de litio con tono único, el material con mayor respaldo científico en odontología estética a nivel mundial." },
  'natura': { name: "Natura",    hex: "#fffbf2", tint: 0.18, hue: 0.84, keep: 0.90, even: 0.16, smooth: 0.06, gaps: 0,    panel: "linear-gradient(135deg,#FBF3E4,#EDDCC0)", ink: "#3A2010", muted: "rgba(90,58,32,.6)",    blurb: "E-MAX estratificado en multicapa, con translucidez y mamelones reales que recrean el diente natural con un realismo excepcional." },
  'glow':   { name: "Glow",      hex: "#f8fbff", tint: 0.28, hue: 0.76, keep: 0.72, even: 0.46, smooth: 0.22, gaps: 0.06, panel: "linear-gradient(135deg,#FFF2B8,#E8B923)", ink: "#3A2800", muted: "rgba(74,48,0,.6)",     blurb: "Fabricada en porcelana feldespática 100% premium, el material que produce el brillo más intenso y la reflexión de la luz más natural posible." },
  'prisma': { name: "Prisma",    hex: "#f5f4f9", tint: 0.28, hue: 0.76, keep: 0.70, even: 0.52, smooth: 0.28, gaps: 0.10, panel: "linear-gradient(135deg,#FCFCFE,#AEAEBA)", ink: "#282828", muted: "rgba(40,40,40,.55)",    blurb: "La técnica de cortes prismáticos crea una reflexión de la luz multidimensional que hace cada carilla única e irrepetible." }
};
let current = "3d";

const clamp = (v,a,b) => v < a ? a : v > b ? b : v;
const sleep = ms => new Promise(r => setTimeout(r, ms));

let landmarker = null;
const modelReady = (async () => {
  const fileset = await FilesetResolver.forVisionTasks(WASM);
  const opts = d => ({ baseOptions:{ modelAssetPath: MODEL, delegate: d }, runningMode:"IMAGE", numFaces:1 });
  try { landmarker = await FaceLandmarker.createFromOptions(fileset, opts("GPU")); }
  catch (e) { landmarker = await FaceLandmarker.createFromOptions(fileset, opts("CPU")); }
})().catch(e => { console.error(e); showErr("No se pudo cargar el modelo."); });

function showErr(t){ const e = document.getElementById("err"); if(e){ e.textContent = t; e.hidden = !t; } }

async function startCamera() {
  showErr("");
  const video = document.getElementById("video");
  if (!navigator.mediaDevices?.getUserMedia) { showErr("Tu navegador no permite la cámara aquí. Puedes subir una foto."); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:"user", width:{ideal:1920}, height:{ideal:1080} }, audio:false });
    video.srcObject = stream;
    await new Promise(r => video.readyState >= 1 ? r() : video.onloadedmetadata = r);
    await video.play();
    document.getElementById("startBtn").style.display = "none"; 
    document.getElementById("shotBtn").disabled = false;
  } catch (e) { showErr("No se pudo acceder a la cámara. Sube una foto."); }
}

function toWorkCanvas(src, sw, sh, mirror) {
  const k = Math.min(1, MAX_SIDE / Math.max(sw, sh));
  const c = document.createElement("canvas");
  c.width = Math.round(sw*k); c.height = Math.round(sh*k);
  const x = c.getContext("2d");
  if (mirror) { x.translate(c.width, 0); x.scale(-1, 1); }   
  x.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

// Configuración de Color LAB
const LIN = new Float32Array(256);
for (let i=0;i<256;i++){ const c=i/255; LIN[i] = c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }
const f3 = t => t > 0.008856 ? Math.cbrt(t) : 7.787*t + 16/116;
const fi = t => { const t3=t*t*t; return t3 > 0.008856 ? t3 : (t - 16/116)/7.787; };
const gam = c => { c = c<=0.0031308 ? 12.92*c : 1.055*Math.pow(c,1/2.4)-0.055; return clamp(Math.round(c*255),0,255); };
function rgb2lab(r,g,b,out,i){
  const R=LIN[r],G=LIN[g],B=LIN[b];
  const x=f3((0.4124*R+0.3576*G+0.1805*B)/0.95047), y=f3(0.2126*R+0.7152*G+0.0722*B), z=f3((0.0193*R+0.1192*G+0.9505*B)/1.08883);
  out.L[i]=116*y-16; out.A[i]=500*(x-y); out.B[i]=200*(y-z);
}
function lab2rgb(L,a,b,d,k){
  const y=(L+16)/116, x=a/500+y, z=y-b/200;
  const X=fi(x)*0.95047, Y=fi(y), Z=fi(z)*1.08883;
  d[k]=gam(3.2406*X-1.5372*Y-0.4986*Z); d[k+1]=gam(-0.9689*X+1.8758*Y+0.0415*Z); d[k+2]=gam(0.0557*X-0.2040*Y+1.0570*Z);
}
for (const st of Object.values(STYLES)) {
  const n = parseInt(st.hex.slice(1), 16);
  const o = { L:[0], A:[0], B:[0] };
  rgb2lab((n >> 16) & 255, (n >> 8) & 255, n & 255, o, 0);
  st.lab = { L:o.L[0], A:o.A[0], B:o.B[0] };
}

// Utilidades Blur
function boxBlur(src, w, h, r) {   
  if (r < 1) return Float32Array.from(src);
  const tmp = new Float32Array(w*h), out = new Float32Array(w*h), n = 2*r+1;
  for (let y=0;y<h;y++){ let s=0; const o=y*w;
    for (let x=-r;x<=r;x++) s += src[o+clamp(x,0,w-1)];
    for (let x=0;x<w;x++){ tmp[o+x]=s/n; s += src[o+clamp(x+r+1,0,w-1)] - src[o+clamp(x-r,0,w-1)]; } }
  for (let x=0;x<w;x++){ let s=0;
    for (let y=-r;y<=r;y++) s += tmp[clamp(y,0,h-1)*w+x];
    for (let y=0;y<h;y++){ out[y*w+x]=s/n; s += tmp[clamp(y+r+1,0,h-1)*w+x] - tmp[clamp(y-r,0,h-1)*w+x]; } }
  return out;
}
const dilate = (m,w,h,r) => boxBlur(m,w,h,r).map(v => v > 0.001 ? 1 : 0);
const erode  = (m,w,h,r) => boxBlur(m,w,h,r).map(v => v > 0.999 ? 1 : 0);
function normConv(val, wt, w, h, r) {
  const p = new Float32Array(w*h); for (let i=0;i<p.length;i++) p[i]=val[i]*wt[i];
  const bp = boxBlur(p,w,h,r), bw = boxBlur(wt,w,h,r);
  for (let i=0;i<p.length;i++) bp[i] = bw[i] > 1e-3 ? bp[i]/bw[i] : val[i];
  return bp;
}

let cache = null;

function analyze(work) {
  const res = landmarker.detect(work);
  const lm = res?.faceLandmarks?.[0];
  if (!lm) throw new Error("Colócate de frente y con buena luz.");
  const W = work.width, H = work.height;
  const P = i => ({ x: lm[i].x*W, y: lm[i].y*H });
  const mouthW = Math.hypot(P(291).x-P(61).x, P(291).y-P(61).y);
  const open = Math.hypot(P(14).x-P(13).x, P(14).y-P(13).y);
  if (open / mouthW < 0.05) throw new Error("Sonríe ampliamente mostrando los dientes.");

  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  for (const i of INNER_LIP){ const p=P(i); x0=Math.min(x0,p.x); y0=Math.min(y0,p.y); x1=Math.max(x1,p.x); y1=Math.max(y1,p.y); }
  const pad = Math.ceil(mouthW*0.06);
  x0=Math.floor(clamp(x0-pad,0,W)); y0=Math.floor(clamp(y0-pad,0,H)); x1=Math.ceil(clamp(x1+pad,0,W)); y1=Math.ceil(clamp(y1+pad,0,H));
  const w=x1-x0, h=y1-y0, N=w*h;
  const wctx = work.getContext("2d");
  const img = wctx.getImageData(x0,y0,w,h), d = img.data;

  const mc = document.createElement("canvas"); mc.width=w; mc.height=h;
  const mx = mc.getContext("2d");
  mx.beginPath();
  INNER_LIP.forEach((i,k)=>{ const p=P(i); k ? mx.lineTo(p.x-x0,p.y-y0) : mx.moveTo(p.x-x0,p.y-y0); });
  mx.closePath(); mx.fillStyle="#fff"; mx.fill();
  const md = mx.getImageData(0,0,w,h).data;
  let hard = new Float32Array(N); for (let i=0;i<N;i++) hard[i] = md[i*4+3] > 127 ? 1 : 0;
  const shrink = Math.max(1, Math.round(mouthW/150));
  hard = erode(hard,w,h,shrink);
  const feather = Math.max(1, Math.round(mouthW/90));
  const mouthSoft = boxBlur(boxBlur(hard,w,h,feather),w,h,feather);

  const lab = { L:new Float32Array(N), A:new Float32Array(N), B:new Float32Array(N) };
  for (let i=0;i<N;i++) rgb2lab(d[i*4],d[i*4+1],d[i*4+2],lab,i);

  const Ls = []; for (let i=0;i<N;i++) if (hard[i]) Ls.push(lab.L[i]);
  Ls.sort((a,b)=>a-b);
  const pct = q => Ls[Math.floor(q*(Ls.length-1))];
  const thrL = Math.max(35, pct(0.3) + (pct(0.9) - pct(0.3))*0.35);

  let teeth = new Float32Array(N);
  for (let i=0;i<N;i++) if (hard[i] && lab.L[i] > thrL && lab.A[i] < 18 && lab.B[i] < 40) teeth[i]=1;
  const mr = Math.max(1, Math.round(mouthW/160));
  teeth = dilate(erode(teeth,w,h,mr),w,h,mr);            
  teeth = erode(dilate(teeth,w,h,mr),w,h,mr);            
  for (let i=0;i<N;i++) teeth[i] *= hard[i];
  let tCount=0, tL=0, tA=0, tB=0;
  for (let i=0;i<N;i++) if (teeth[i]) { tCount++; tL+=lab.L[i]; tA+=lab.A[i]; tB+=lab.B[i]; }
  if (tCount < 80) throw new Error("No vemos tus dientes. Sonríe más amplio.");
  tL/=tCount; tA/=tCount; tB/=tCount;

  const gr = Math.max(2, Math.round(mouthW/70));
  const closed = erode(dilate(teeth,w,h,gr),w,h,gr);
  const gaps = new Float32Array(N);
  for (let i=0;i<N;i++) if (closed[i] && !teeth[i] && hard[i] && lab.A[i] < 25) gaps[i]=1;

  const teethSoft = boxBlur(teeth,w,h,Math.max(1,Math.round(mouthW/200)));
  const gapsSoft = boxBlur(gaps,w,h,1);

  let sL=0, sn=0;
  for (const ci of CHEEKS) {
    const p=P(ci), r=Math.max(3,Math.round(mouthW/25));
    const cd = wctx.getImageData(clamp(Math.round(p.x-r),0,W-1), clamp(Math.round(p.y-r),0,H-1), 2*r, 2*r).data;
    const tmp={L:[0],A:[0],B:[0]};
    for (let k=0;k<cd.length;k+=4){ rgb2lab(cd[k],cd[k+1],cd[k+2],tmp,0); sL+=tmp.L[0]; sn++; }
  }
  const skinL = sn ? sL/sn : 65;
  const capL = clamp(Math.max(skinL + 22, tL + 6), 70, 93);

  const sr = Math.max(2, Math.round(mouthW/60));
  const smL = normConv(lab.L, teeth, w, h, sr), smA = normConv(lab.A, teeth, w, h, sr), smB = normConv(lab.B, teeth, w, h, sr);
  const fr = gr + 2;
  const fillL = normConv(lab.L, teeth, w, h, fr), fillA = normConv(lab.A, teeth, w, h, fr), fillB = normConv(lab.B, teeth, w, h, fr);

  return { work, x0, y0, w, h, N, orig: new Uint8ClampedArray(d), lab, mouthSoft, teethSoft, gapsSoft, tL, tA, tB, capL, smL, smA, smB, fillL, fillA, fillB };
}

function showCollection(styleKey) {
  const st = STYLES[styleKey];
  if (!st) return;
  const name = document.getElementById("crpn");
  const desc = document.getElementById("crpd");
  const head = document.getElementById("crph");
  const chip = document.getElementById("toneChip");
  if (name) { name.textContent = st.name; name.style.color = st.ink; }
  if (desc) desc.textContent = st.blurb;
  if (head) head.style.background = st.panel;
  const lbl = head && head.querySelector(".crp-lbl");
  if (lbl) lbl.style.color = st.muted;
  if (chip) chip.style.background = st.hex;
}

function render(styleKey) {
  const c = cache, st = STYLES[styleKey];
  const afterC = document.getElementById("afterC");
  afterC.width = c.work.width; afterC.height = c.work.height;
  const ax = afterC.getContext("2d");
  ax.drawImage(c.work, 0, 0);
  const out = new ImageData(new Uint8ClampedArray(c.orig), c.w, c.h), d = out.data;
  const tmp = new Uint8ClampedArray(3);
  for (let i=0;i<c.N;i++) {
    const m = c.mouthSoft[i];
    if (m < 0.01) continue;
    let wT = c.teethSoft[i] * m, wG = c.gapsSoft[i] * m * st.gaps;
    if (wT < 0.01 && wG < 0.01) continue;
    let L = c.lab.L[i], A = c.lab.A[i], B = c.lab.B[i];
    if (wG > 0.01 && wT < 0.5) {
      const g = wG*(1-wT);
      L += (c.fillL[i]-L)*g; A += (c.fillA[i]-A)*g; B += (c.fillB[i]-B)*g;
      wT = Math.max(wT, g);
    }
    if (st.smooth > 0) { L += (c.smL[i]-L)*st.smooth; A += (c.smA[i]-A)*st.smooth; B += (c.smB[i]-B)*st.smooth; }
    const dL = L - c.tL;
    const spec = clamp(dL / 20, 0, 1);
    const room = Math.min(11, Math.max(0, 84 - c.tL));
    const bodyL = c.tL + Math.min((st.lab.L - c.tL) * st.tint, room);
    let Ln = bodyL + dL * st.keep;
    const ceil = Math.min(86, bodyL + 7);
    if (Ln > ceil) Ln = ceil + (Ln - ceil) * 0.3;
    Ln = clamp(Ln, 28, 86);
    const hue = st.hue * (1 - spec * 0.4);
    const vary = 1 - st.even;
    let An = c.tA + (st.lab.A - c.tA) * hue + (A - c.tA) * vary;
    let Bn = c.tB + (st.lab.B - c.tB) * hue + (B - c.tB) * vary;
    const k = i*4;
    lab2rgb(Ln, An, Bn, tmp, 0);
    const cover = wT * 0.9;
    d[k] += (tmp[0]-d[k])*cover; d[k+1] += (tmp[1]-d[k+1])*cover; d[k+2] += (tmp[2]-d[k+2])*cover;
  }
  const rc = document.createElement("canvas"); rc.width=c.w; rc.height=c.h;
  rc.getContext("2d").putImageData(out,0,0);
  ax.drawImage(rc, c.x0, c.y0);
}

async function runProcess(work) {
  showErr("");
  const video = document.getElementById("video");
  document.getElementById("proc").hidden = false; document.getElementById("shotBtn").disabled = true;
  const t0 = performance.now();
  try {
    await modelReady;
    if (!landmarker) throw new Error("El modelo de IA no cargó.");
    await sleep(30); 
    cache = analyze(work);
    const bc = document.getElementById("beforeC"); bc.width = work.width; bc.height = work.height;
    bc.getContext("2d").drawImage(work, 0, 0);
    render(current);
    const rest = MIN_PROC_MS - (performance.now() - t0);
    if (rest > 0) await sleep(rest);
    document.getElementById("capView").hidden = true; document.getElementById("resView").hidden = false;
    setSlider(0.5);
    document.getElementById("resView").scrollIntoView({ behavior:"smooth", block:"start" });
  } catch (e) {
    const rest = 600 - (performance.now() - t0); if (rest > 0) await sleep(rest);
    showErr(e.message || "Ocurrió un error en el análisis.");
  } finally {
    document.getElementById("proc").hidden = true; document.getElementById("shotBtn").disabled = !video.srcObject;
  }
}

// Event Listeners Dinámicos (Se asignan al cargar para que funcionen con el nuevo HTML)
document.addEventListener("DOMContentLoaded", () => {
  const sb = document.getElementById("startBtn"); if(sb) sb.onclick = startCamera;
  
  const shot = document.getElementById("shotBtn");
  if(shot) shot.onclick = () => { 
    const video = document.getElementById("video");
    if (video.videoWidth) runProcess(toWorkCanvas(video, video.videoWidth, video.videoHeight, true)); 
  };
  
  const fileIn = document.getElementById("fileIn");
  if(fileIn) fileIn.onchange = async e => {
    const f = e.target.files?.[0]; e.target.value = ""; if (!f) return;
    try {
      const bmp = await createImageBitmap(f, { imageOrientation: "from-image" });
      runProcess(toWorkCanvas(bmp, bmp.width, bmp.height, false));
    } catch (er) { showErr("Imagen no soportada."); }
  };

  const again = document.getElementById("againBtn");
  if(again) again.onclick = () => { document.getElementById("resView").hidden = true; document.getElementById("capView").hidden = false; showErr(""); };

  const stylesDiv = document.getElementById("styles");
  if(stylesDiv) {
    for (const [key, st] of Object.entries(STYLES)) {
      const b = document.createElement("button");
      b.type="button"; b.className = "sty" + (key===current ? " active" : ""); b.textContent = st.name;
      b.style.background = st.hex;
      b.onclick = () => {
        current = key;
        document.querySelectorAll(".sty").forEach(e=>e.classList.remove("active")); b.classList.add("active");
        showCollection(current);
        if (cache) render(current);
      };
      stylesDiv.appendChild(b);
    }
    showCollection(current);
  }

  // Slider Antes/Después
  const cmp = document.getElementById("cmp"), afterEl = document.getElementById("afterC"), divider = document.getElementById("divider");
  window.setSlider = function(f) {
    f = clamp(f, 0, 1);
    if(afterEl) afterEl.style.clipPath = `inset(0 0 0 ${f*100}%)`;   
    if(divider) divider.style.left = `${f*100}%`;
  }
  let dragging = false;
  const posF = e => { const r = cmp.getBoundingClientRect(); return (e.clientX - r.left) / r.width; };
  if(cmp) {
    cmp.addEventListener("pointerdown", e => { dragging = true; cmp.setPointerCapture(e.pointerId); setSlider(posF(e)); });
    cmp.addEventListener("pointermove", e => { if (dragging) setSlider(posF(e)); });
    cmp.addEventListener("pointerup", () => dragging = false);
    cmp.addEventListener("pointercancel", () => dragging = false);
  }

  // Descarga
  const dl = document.getElementById("dlBtn");
  if(dl) dl.onclick = () => {
    if (!cache) return;
    const src = document.getElementById("afterC");
    const o = document.createElement("canvas"); o.width = src.width; o.height = src.height;
    const x = o.getContext("2d"); x.drawImage(src, 0, 0);
    const fs = Math.max(14, Math.round(o.width/60));
    x.fillStyle = "rgba(0,0,0,0.5)"; x.fillRect(0, o.height-fs*2, o.width, fs*2);
    x.fillStyle = "#fff"; x.font = `${fs}px system-ui, sans-serif`;
    x.fillText("Simulación por Amatista AI. No es un resultado garantizado.", fs*0.7, o.height-fs*0.65);
    o.toBlob(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = `amatista-sonrisa-${current}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }, "image/png");
  };
});

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