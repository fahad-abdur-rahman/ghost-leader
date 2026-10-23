// Blog page: lists the posts saved from the admin panel (Blog tab), or shows one post (blog.html?p=slug).
import { fillNav, fillConnect } from './site-shared.js';
var $ = function (id) { return document.getElementById(id); };
function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
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
  if (p.tag) m.appendChild(el('span', 'bl-tag', p.tag));
  var d = fmtDate(p.date); if (d) m.appendChild(el('span', null, d));
  m.appendChild(el('span', null, minutes(p.body || p.summary) + ' min read'));
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
    a.appendChild(el('h3', null, p.title));
    var sum = (p.summary || '').trim() || String(p.body || '').trim().replace(/\s+/g, ' ').slice(0, 160);
    if (sum) a.appendChild(el('p', null, sum));
    a.appendChild(el('span', 'bl-more', 'Read more →'));
    g.appendChild(a);
  });
  wrap.appendChild(g);
}

function renderPost(p) {
  document.title = p.title + ' | Fahad Abdur Rahman';
  var desc = ((p.summary || '').trim() || String(p.body || '').trim().replace(/\s+/g, ' ')).slice(0, 160);
  setMeta('meta[name=description]', 'content', desc);
  setMeta('meta[property="og:title"]', 'content', p.title);
  setMeta('meta[name="twitter:title"]', 'content', p.title);
  setMeta('meta[property="og:description"]', 'content', desc);
  setMeta('meta[name="twitter:description"]', 'content', desc);
  $('crumbPost').textContent = ' / ' + p.title;
  var head = $('blHead'); head.textContent = '';
  var wrap = $('blWrap'); wrap.textContent = '';
  var art = el('article', 'bl-art');
  art.appendChild(meta(p));
  art.appendChild(el('h1', null, p.title));
  var body = el('div', 'bl-body');
  String(p.body || '').replace(/\r/g, '').split(/\n{2,}/).forEach(function (blk) {
    blk = blk.trim(); if (!blk) return;
    if (/^##\s+/.test(blk)) { body.appendChild(el('h2', null, blk.replace(/^##\s+/, ''))); return; }
    var para = el('p');
    blk.split('\n').forEach(function (ln, i) { if (i) para.appendChild(document.createElement('br')); para.appendChild(document.createTextNode(ln)); });
    body.appendChild(para);
  });
  art.appendChild(body);
  var back = el('a', 'bl-back', '← All posts'); back.href = 'blog.html'; art.appendChild(back);
  wrap.appendChild(art);
  window.scrollTo(0, 0);
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
  var posts = (d && Array.isArray(d.posts) ? d.posts : []).filter(function (p) { return p && p.title && p.slug; });
  posts.sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
  if (slugWanted) {
    var me = posts.filter(function (p) { return p.slug === slugWanted; })[0];
    if (me) renderPost(me); else notFound();
  } else renderList(posts);
})();
