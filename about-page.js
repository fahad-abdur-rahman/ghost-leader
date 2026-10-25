// About page: keeps the built-in text, and swaps in what was saved from the admin panel.
import { orgHref, safeImg, logoInto, fillNav, fillConnect, localize, onLangChange, saveNotice, applySeo } from './site-shared.js';
var $ = function (id) { return document.getElementById(id); };
function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
var PLACEHOLDERS = ['institution name', 'previous institution', 'achievement title', 'another milestone'];
function real(it) { var t = String((it && it.title) || '').trim().toLowerCase(); return t && PLACEHOLDERS.indexOf(t) < 0; }

window.faContent = (async function () {
  var d = null;
  try {
    var cfg = await import('./firebase-config.js'); var c = cfg.firebaseConfig;
    if (!c || !c.apiKey || /YOUR/i.test(c.apiKey)) return;
    var app = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    var fs = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    var db = fs.getFirestore(app.initializeApp(c));
    var snap = await fs.getDoc(fs.doc(db, 'site', 'content'));
    if (!snap.exists()) return;
    d = snap.data();
  } catch (e) { return; }

  var raw = d;
  saveNotice(raw);
  applySeo(raw);
  function draw() {
  var d = localize(raw);
  if (Array.isArray(d.orgs)) fillNav(d.orgs);
  fillConnect(d);
  var p = d.profile || {};
  if (typeof p.about1 === 'string' && p.about1.trim()) $('abP1').textContent = p.about1;
  if (typeof p.location === 'string' && p.location.trim()) $('abLead').textContent = 'Youth leader, organization builder and founder & chairman from ' + p.location.trim() + '.';
  if (typeof p.about2 === 'string' && p.about2.trim()) $('abP2').textContent = p.about2;
  var ph = safeImg(p.photo);
  if (ph) { var box = $('abPhoto'); box.textContent = ''; var im = el('img'); im.src = ph; im.alt = 'Portrait of Fahad Abdur Rahman'; box.appendChild(im); box.removeAttribute('aria-hidden'); }
  if (Array.isArray(p.stats)) {
    var wrap = $('abNums'); wrap.textContent = '';
    p.stats.forEach(function (s) {
      var n = Number(s.n); if (!s || isNaN(n)) return;
      var card = el('div', 'card'); card.appendChild(el('b', null, n + (s.suf || ''))); card.appendChild(el('span', null, s.label || ''));
      wrap.appendChild(card);
    });
  }
  if (Array.isArray(d.orgs) && d.orgs.length) {
    var ow = $('abOrgs'); ow.textContent = '';
    d.orgs.forEach(function (o) {
      if (!o || !o.name) return;
      var a = el('a', 'card'); a.href = orgHref(o);
      var lg = el('span', 'lg'); lg.setAttribute('aria-hidden', 'true'); logoInto(lg, o);
      var t = el('div'); t.appendChild(el('h3', null, o.name)); t.appendChild(el('p', null, o.tagline || ''));
      a.appendChild(lg); a.appendChild(t); ow.appendChild(a);
    });
  }
  if (Array.isArray(d.skills)) {
    var ul = $('abSkills'); ul.textContent = '';
    d.skills.forEach(function (k) { var n = String(k && k.name || '').trim(); if (n) ul.appendChild(el('li', 'chip', n)); });
  }
  function timeline(listId, secId, list, key) {
    var items = Array.isArray(list) ? list.filter(real) : [];
    var g = $(listId); g.textContent = '';
    items.forEach(function (it) {
      var c = el('div', 'card item');
      c.appendChild(el('small', null, String(it[key] || '').toUpperCase()));
      c.appendChild(el('h3', null, it.title)); c.appendChild(el('p', null, it.desc || ''));
      g.appendChild(c);
    });
    $(secId).hidden = !items.length;
    [].slice.call($(secId).querySelectorAll('.reveal')).forEach(function (r) { r.classList.add('show'); });
  }
  timeline('abEdu', 'abEduSec', d.education, 'period');
  timeline('abAch', 'abAchSec', d.achievements, 'year');
  }
  draw();
  onLangChange(draw);
})();
