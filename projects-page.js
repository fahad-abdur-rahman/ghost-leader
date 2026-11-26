// Projects page: lists every project saved in the admin panel (Projects tab), with category filters.
import { fillNav, fillConnect, saveNotice, safeImg, localize, onLangChange } from './site-shared.js';
var $ = function (id) { return document.getElementById(id); };
function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
var RAW = null;
function safeUrl(u) { u = String(u || '').trim(); return /^https?:\/\//i.test(u) ? u : '#'; }

function setupFilters() {
  var box = $('pjFilters'), g = $('projGrid'), empty = $('empty'), live = $('live');
  var projs = [].slice.call(g.querySelectorAll('.proj')), labels = {}, cats = [];
  projs.forEach(function (p) { var k = p.dataset.cat; if (!(k in labels)) { labels[k] = p.dataset.label || k; cats.push(k); } });
  var pref = ['organization', 'website', 'event', 'other'];
  cats.sort(function (a, b) { var x = pref.indexOf(a), y = pref.indexOf(b); return (x < 0 ? 99 : x) - (y < 0 ? 99 : y); });
  box.textContent = '';
  function mk(key, label, on) { var b = el('button', 'filter', label); b.type = 'button'; b.dataset.filter = key; b.setAttribute('aria-pressed', on ? 'true' : 'false'); box.appendChild(b); }
  if (cats.length > 1) { mk('all', document.documentElement.lang === 'bn' ? 'সব' : 'All', true); cats.forEach(function (k) { mk(k, labels[k], false); }); }
  empty.style.display = projs.length ? 'none' : 'block';
  box.onclick = function (e) {
    var b = e.target.closest('.filter'); if (!b) return;
    var f = b.dataset.filter, shown = 0;
    [].slice.call(box.querySelectorAll('.filter')).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    projs.forEach(function (p) { var ok = f === 'all' || p.dataset.cat === f; p.hidden = !ok; p.classList.remove('pop'); if (ok) { shown++; void p.offsetWidth; p.classList.add('pop'); } });
    empty.style.display = shown ? 'none' : 'block';
    live.textContent = shown + (shown === 1 ? ' project shown' : ' projects shown');
  };
}

function draw() {
  var d = localize(RAW || {}), list = Array.isArray(d.projects) ? d.projects : null, g = $('projGrid');
  if (!list) return;   /* nothing saved yet: keep the loading card out of the way */
  g.textContent = ''; g.setAttribute('aria-busy', 'false');
  list.forEach(function (p) {
    if (!p || !String(p.title || '').trim()) return;
    var cat = String(p.category || 'Other').trim() || 'Other';
    var a = el('a', 'card proj'); a.href = safeUrl(p.url);
    if (a.getAttribute('href').indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    a.dataset.cat = cat.toLowerCase(); a.dataset.label = cat;
    var shot = el('div', 'shot'); shot.setAttribute('aria-hidden', 'true');
    shot.appendChild(el('b', null, String(p.tag || p.title || '').slice(0, 8).toUpperCase()));
    var im = safeImg(p.shot); if (im) { var i = el('img'); i.src = im; i.alt = ''; i.loading = 'lazy'; i.decoding = 'async'; shot.appendChild(i); }
    var body = el('div', 'body'), box = el('div');
    box.appendChild(el('h3', null, p.title || ''));
    box.appendChild(el('p', null, cat + (p.sub ? ' · ' + p.sub : '')));
    var arr = el('span', 'arr', '→'); arr.setAttribute('aria-hidden', 'true');
    body.appendChild(box); body.appendChild(arr); a.appendChild(shot); a.appendChild(body); g.appendChild(a);
  });
  setupFilters();
}

(async function () {
  var d = null;
  try {
    var cfg = await import('./firebase-config.js'); var c = cfg.firebaseConfig;
    if (!c || !c.apiKey || /YOUR/i.test(c.apiKey)) throw 0;
    var app = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    var fs = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    var db = fs.getFirestore(app.initializeApp(c));
    var snap = await fs.getDoc(fs.doc(db, 'site', 'content'));
    if (snap.exists()) d = snap.data();
  } catch (e) { d = null; }
  if (d && Array.isArray(d.orgs)) fillNav(d.orgs);
  if (d) { fillConnect(d); saveNotice(d); }
  RAW = d;
  if (d && Array.isArray(d.projects)) draw();
  else { var g = $('projGrid'); g.setAttribute('aria-busy', 'false'); g.textContent = ''; $('empty').style.display = 'block'; }
  onLangChange(function () { draw(); });
})();
