// Blog page: lists the posts saved from the admin panel (Blog tab), or shows one post (blog.html?p=slug).
import { fillNav, fillConnect } from './site-shared.js';
var $ = function (id) { return document.getElementById(id); };
function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
var ALL = [];                    /* posts loaded from the admin panel */
function isBn() { return document.documentElement.getAttribute('lang') === 'bn'; }
/* pick the Bangla or English text of a field; fall back to the other language when empty */
function pick(p, k) {
  var en = String(p[k] || '').trim(), bn = String(p[k + 'Bn'] || '').trim();
  return isBn() ? (bn || en) : (en || bn);
}
var slugWanted = (new URLSearchParams(location.search).get('p') || '').toLowerCase().replace(/[^a-z0-9-]/g, '');

function fmtDate(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  if (!m) return '';
  var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  try { return d.toLocaleDateString(document.documentElement.lang === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); }
  catch (e) { return String(s); }
}
function minutes(t) { var w = String(t || '').trim().split(/\s+/).filter(Boolean).length; return Math.max(1, Math.round(w / 200)); }
function meta(p) {
  var m = el('div', 'bl-meta');
  var tg = pick(p, 'tag'); if (tg) m.appendChild(el('span', 'bl-tag', tg));
  var d = fmtDate(p.date); if (d) m.appendChild(el('span', null, d));
  m.appendChild(el('span', null, minutes(pick(p, 'body') || pick(p, 'summary')) + ' min read'));
  return m;
}
function setMeta(sel, attr, v) { var e = document.querySelector(sel); if (e) e.setAttribute(attr, v); }

function renderList(posts) {
  var wrap = $('blWrap'); wrap.textContent = '';
  if (!posts.length) { var e = el('div', 'card bl-empty', 'No posts yet. Please check back soon.'); wrap.appendChild(e); return; }
  var g = el('div', 'bl-grid');
  posts.forEach(function (p) {
    var a = el('a', 'card bl-card'); a.href = 'blog.html?p=' + encodeURIComponent(p.slug);
    a.appendChild(meta(p));
    a.appendChild(el('h3', null, pick(p, 'title')));
    var sum = pick(p, 'summary') || pick(p, 'body').replace(/\s+/g, ' ').slice(0, 160);
    if (sum) a.appendChild(el('p', null, sum));
    a.appendChild(el('span', 'bl-more', 'Read more →'));
    g.appendChild(a);
  });
  wrap.appendChild(g);
}

function renderPost(p) {
  var ttl = pick(p, 'title');
  document.title = ttl + ' | Fahad Abdur Rahman';
  var desc = (pick(p, 'summary') || pick(p, 'body').replace(/\s+/g, ' ')).slice(0, 160);
  setMeta('meta[name=description]', 'content', desc);
  setMeta('meta[property="og:title"]', 'content', ttl);
  setMeta('meta[name="twitter:title"]', 'content', ttl);
  setMeta('meta[property="og:description"]', 'content', desc);
  setMeta('meta[name="twitter:description"]', 'content', desc);
  $('crumbPost').textContent = ' / ' + ttl;
  var head = $('blHead'); head.textContent = '';
  var wrap = $('blWrap'); wrap.textContent = '';
  var art = el('article', 'bl-art');
  art.appendChild(meta(p));
  art.appendChild(el('h1', null, ttl));
  var body = el('div', 'bl-body');
  pick(p, 'body').replace(/\r/g, '').split(/\n{2,}/).forEach(function (blk) {
    blk = blk.trim(); if (!blk) return;
    if (/^##\s+/.test(blk)) { body.appendChild(el('h2', null, blk.replace(/^##\s+/, ''))); return; }
    var para = el('p');
    blk.split('\n').forEach(function (ln, i) { if (i) para.appendChild(document.createElement('br')); para.appendChild(document.createTextNode(ln)); });
    body.appendChild(para);
  });
  art.appendChild(body);
  var back = el('a', 'bl-back', '← All posts'); back.href = 'blog.html'; art.appendChild(back);
  wrap.appendChild(art);
  }

function notFound() {
  var head = $('blHead'); head.textContent = '';
  head.appendChild(el('h1', null, 'Post not found'));
  var wrap = $('blWrap'); wrap.textContent = '';
  var c = el('div', 'card bl-empty'); c.appendChild(document.createTextNode('This post is not available. '));
  var a = el('a', null, 'Back to all posts'); a.href = 'blog.html'; a.style.textDecoration = 'underline'; c.appendChild(a);
  wrap.appendChild(c);
  setMeta('meta[name=robots]', 'content', 'noindex');
}

window.faContent = (async function () {
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
  if (d) fillConnect(d);
  ALL = (d && Array.isArray(d.posts) ? d.posts : []).filter(function (p) { return p && p.slug && (String(p.title || '').trim() || String(p.titleBn || '').trim()); });
  ALL.sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
  draw(true);
  /* re-draw when the visitor switches বাংলা / EN */
  var last = isBn();
  new MutationObserver(function () { if (isBn() !== last) { last = isBn(); draw(false); } })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();

function draw(first) {
  if (slugWanted) {
    var me = ALL.filter(function (p) { return p.slug === slugWanted; })[0];
    if (me) { renderPost(me); if (first) window.scrollTo(0, 0); } else notFound();
  } else renderList(ALL);
}
