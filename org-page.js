// Fills an organization page with the content saved from the admin panel.
// The page already contains readable default text (so search engines see it);
// this only replaces it when the admin has saved something for this organization.
import { slugify, orgSlug, orgHref, safeImg, logoInto, fillNav, fillConnect, localize, onLangChange } from './site-shared.js';

var $ = function (id) { return document.getElementById(id); };
var BASE = 'https://fahad-abdur-rahman.github.io/ghost-leader/';
var slug = document.body.dataset.slug || slugify(new URLSearchParams(location.search).get('o') || '');
var isTemplate = !document.body.dataset.slug;

function el(tag, cls, text) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function setText(id, v) { var e = $(id); if (e && typeof v === 'string' && v.trim()) e.textContent = v; }
function setMeta(sel, attr, v) { var e = document.querySelector(sel); if (e) e.setAttribute(attr, v); }
function notFound() {
  var m = document.querySelector('main');
  m.textContent = '';
  var d = el('div', 'wrap nf');
  d.appendChild(el('h1', null, 'Organization not found'));
  var p = el('p', null, 'This page is not available. ');
  var a = el('a', null, 'Back to home'); a.href = 'index.html'; a.style.textDecoration = 'underline';
  p.appendChild(a); d.appendChild(p); m.appendChild(d);
  document.title = 'Organization not found | Fahad Abdur Rahman';
  setMeta('meta[name=robots]', 'content', 'noindex');
}

function render(o, all) {
  var name = o.name;
  var title = name + ' — Founded by Fahad Abdur Rahman';
  var tag = o.tagline || '';
  var lead = (o.lead && o.lead.trim()) || (name + ' is a youth organization founded and chaired by Fahad Abdur Rahman.');
  document.title = title;
  var desc = (name + (tag ? ' — "' + tag + '". ' : '. ') + 'A youth organization founded and chaired by Fahad Abdur Rahman.');
  setMeta('meta[name=description]', 'content', desc);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[name="twitter:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', desc);
  setMeta('meta[name="twitter:description"]', 'content', desc);
  if (isTemplate) {
    var canon = document.querySelector('link[rel=canonical]');
    if (!canon) { canon = document.createElement('link'); canon.rel = 'canonical'; document.head.appendChild(canon); }
    canon.href = BASE + 'organization.html?o=' + encodeURIComponent(slug);
  }
  setText('org-h1', name); setText('crumbName', name); setText('aboutName', name);
  setText('orgTag', tag);
  var leadEl = $('orgLead'); if (leadEl && ((o.lead && o.lead.trim()) || isTemplate)) leadEl.textContent = lead;

  // about paragraphs
  var p1 = $('aboutP1'), p2 = $('aboutP2');
  var a1 = (o.about1 || '').trim(), a2 = (o.about2 || '').trim();
  if (a1 || a2 || isTemplate) {
    if (p1) { p1.textContent = a1 || (name + ' is a youth organization founded by Fahad Abdur Rahman, who serves as its founder and chairman.'); }
    if (p2) { p2.textContent = a2; p2.hidden = !a2; }
  }

  // focus cards
  var feats = Array.isArray(o.features) ? o.features.filter(function (f) { return f && (f.title || '').trim(); }) : null;
  var fs = $('featSection'), fw = $('featWrap');
  if (feats && (feats.length || isTemplate) && fw) {
    fw.textContent = '';
    feats.forEach(function (f, i) {
      var c = el('div', 'card reveal show'); c.style.setProperty('--d', (i * 0.07) + 's');
      c.appendChild(el('h3', null, f.title)); c.appendChild(el('p', null, f.desc || ''));
      fw.appendChild(c);
    });
    fw.style.setProperty('--n', Math.max(1, Math.min(feats.length, 3)));
    if (fs) fs.hidden = !feats.length;
  }

  // logo
  var lg = $('orgLogo'); if (lg) logoInto(lg, o);

  // external link
  var vb = $('visitBtn');
  if (vb) {
    var u = String(o.url || '').trim();
    if (/^https?:\/\//i.test(u)) { vb.href = u; vb.hidden = false; } else vb.hidden = true;
  }
}

function renderOthers(all) {
  var w = $('othersWrap'); if (!w) return;
  w.textContent = '';
  all.forEach(function (x) {
    if (!x || !x.name || orgSlug(x) === slug) return;
    var a = el('a', 'card'); a.href = orgHref(x);
    a.appendChild(el('h3', null, x.name)); a.appendChild(el('p', null, x.tagline || ''));
    w.appendChild(a);
  });
  var sec = w.closest('section'); if (sec) sec.hidden = !w.children.length;
}

window.faContent = (async function () {
  var mainEl = document.querySelector('main');
  if (isTemplate && mainEl) mainEl.style.visibility = 'hidden';
  var d = null;
  try {
    var cfg = await import('./firebase-config.js');
    var c = cfg.firebaseConfig;
    if (!c || !c.apiKey || /YOUR/i.test(c.apiKey)) throw 0;
    var app = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    var fs = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    var db = fs.getFirestore(app.initializeApp(c));
    var snap = await fs.getDoc(fs.doc(db, 'site', 'content'));
    if (snap.exists()) d = snap.data();
  } catch (e) { /* keep the built-in content */ }

  if (isTemplate && mainEl) mainEl.style.visibility = '';
  var raw = d;
  var orgs0 = raw && Array.isArray(raw.orgs) ? raw.orgs : null;
  if (!orgs0) { if (isTemplate) notFound(); return; }
  var found = orgs0.filter(function (o) { return o && o.name && orgSlug(o) === slug; })[0];
  if (!found) { if (isTemplate) notFound(); return; }
  function draw() {
    var d = localize(raw);
    var orgs = d.orgs;
    var me = orgs.filter(function (o) { return o && o.name && orgSlug(o) === slug; })[0];
    fillNav(orgs, slug);
    fillConnect(d);
    render(me, orgs);
    renderOthers(orgs);
    if (d.profile && typeof d.profile.location === 'string' && d.profile.location.trim()) {
      var lc = document.querySelector('.lead-card p'); if (lc) lc.textContent = 'Youth leader and organization builder from ' + d.profile.location.trim() + '.';
    }
  }
  draw();
  onLangChange(draw);
})();
