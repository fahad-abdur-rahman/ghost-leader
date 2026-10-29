// Web Services page: shows plans, services, steps and FAQ.
// Built-in content comes from web-defaults.js; whatever you save in Admin > Web Services replaces it.
import { fillNav, fillConnect, localize, onLangChange, saveNotice, applySeo } from './site-shared.js';
var $ = function (id) { return document.getElementById(id); };
function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
var DEF = window.FA_WEB || { site: {}, plans: [], services: [], steps: [], faq: [] };
var RAW = null;

function lines(s) { return String(s || '').split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean); }
function pickList(saved, fallback) { return Array.isArray(saved) && saved.length ? saved : fallback; }
function build(d) {
  var site = {}; Object.keys(DEF.site).forEach(function (k) { site[k] = DEF.site[k]; });
  var s = (d && d.site) || {};
  Object.keys(s).forEach(function (k) { if (/^ws/.test(k) && typeof s[k] === 'string' && s[k].trim()) site[k] = s[k]; });
  return { site: site, plans: pickList(d && d.webPlans, DEF.plans), services: pickList(d && d.webServices, DEF.services), steps: pickList(d && d.webSteps, DEF.steps), faq: pickList(d && d.webFaq, DEF.faq) };
}
function wa(text) {
  try {
    var c = JSON.parse(localStorage.getItem('fa-wa') || 'null');
    if (c && c.n) return 'https://wa.me/' + c.n + '?text=' + encodeURIComponent(text);
  } catch (e) {}
  return '';
}
function put(id, v) { var n = $(id); if (n && v != null && String(v).trim()) n.textContent = v; }

function render() {
  var D = localize(build(RAW)), S = D.site;
  [['wsPill', 'wsPill'], ['wsLead', 'wsLead'], ['wsPlansTitle', 'wsPlansTitle'], ['wsPlansLead', 'wsPlansLead'], ['wsServicesTitle', 'wsServicesTitle'], ['wsStepsTitle', 'wsStepsTitle'],
   ['wsHostTitle', 'wsHostTitle'], ['wsHostText', 'wsHostText'], ['wsFaqTitle', 'wsFaqTitle'], ['wsCtaTitle', 'wsCtaTitle'], ['wsCtaText', 'wsCtaText'], ['wsBtnPlans', 'wsBtnPlans']]
    .forEach(function (m) { put(m[0], S[m[1]]); });
  var h1 = $('ws-h1'); if (h1 && S.wsTitle) h1.textContent = S.wsTitle;
  document.title = (S.wsTitle ? 'Web Services | ' : 'Web Services | ') + 'Fahad Abdur Rahman';

  /* plans */
  var pw = $('wsPlans'); pw.textContent = '';
  D.plans.filter(function (p) { return p && String(p.name || '').trim(); }).forEach(function (p) {
    var a = el('article', 'plan card' + (p.badge ? ' pop' : ''));
    if (p.badge) a.appendChild(el('span', 'bd', p.badge));
    a.appendChild(el('h3', null, p.name));
    if (p.desc) a.appendChild(el('p', 'pd', p.desc));
    var pr = el('div', 'pr' + (p.price ? '' : ' none'));
    if (p.price) { pr.appendChild(el('b', null, p.price)); if (p.period) pr.appendChild(document.createTextNode(' ')); if (p.period) pr.appendChild(el('small', null, p.period)); }
    else pr.textContent = S.wsPriceNone;
    a.appendChild(pr);
    var ul = el('ul'); lines(p.features).forEach(function (f) { ul.appendChild(el('li', null, f)); }); a.appendChild(ul);
    var b = el('a', 'btn' + (p.badge ? ' primary' : ''), p.btn || S.wsBtnContact);
    b.href = 'contact.html?plan=' + encodeURIComponent(p.name);
    a.appendChild(b); pw.appendChild(a);
  });

  /* services */
  var sw = $('wsServices'); sw.textContent = '';
  D.services.filter(function (s) { return s && String(s.title || '').trim(); }).forEach(function (s) {
    var c = el('div', 'svc card'); var ic = el('span', 'ic', s.icon || '\u2728'); ic.setAttribute('aria-hidden', 'true');
    c.appendChild(ic); c.appendChild(el('h3', null, s.title)); if (s.desc) c.appendChild(el('p', null, s.desc)); sw.appendChild(c);
  });

  /* steps */
  var st = $('wsSteps'); st.textContent = '';
  D.steps.filter(function (s) { return s && String(s.title || '').trim(); }).forEach(function (s, i) {
    var li = el('li', 'st'); li.appendChild(el('span', 'n', String(i + 1))); li.appendChild(el('h3', null, s.title)); if (s.desc) li.appendChild(el('p', null, s.desc)); st.appendChild(li);
  });

  /* faq */
  var fw = $('wsFaq'); fw.textContent = '';
  D.faq.filter(function (f) { return f && String(f.q || '').trim(); }).forEach(function (f) {
    var d = el('details', 'faq card'); d.appendChild(el('summary', null, f.q)); d.appendChild(el('p', null, f.a || '')); fw.appendChild(d);
  });

  /* buttons: WhatsApp when a number is saved, otherwise the contact page */
  var link = wa(S.wsCtaText ? (document.documentElement.lang === 'bn' ? '\u0986\u09ae\u09bf \u0986\u09aa\u09a8\u09be\u09b0 \u0993\u09af\u09bc\u09c7\u09ac\u09b8\u09be\u0987\u099f \u09b8\u09be\u09b0\u09cd\u09ad\u09bf\u09b8 \u09b8\u09ae\u09cd\u09aa\u09b0\u09cd\u0995\u09c7 \u099c\u09be\u09a8\u09a4\u09c7 \u099a\u09be\u0987\u0964' : 'Hello Fahad, I would like to know more about your website service.') : '');
  [['wsHeroCta', true], ['wsCtaWa', false]].forEach(function (x) {
    var a = $(x[0]); if (!a) return;
    if (link) { a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = S.wsBtnWhats; }
    else { a.href = 'contact.html'; a.removeAttribute('target'); a.textContent = S.wsBtnContact; }
  });
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
  RAW = d;
  if (d && Array.isArray(d.orgs)) fillNav(d.orgs);
  if (d) { fillConnect(d); saveNotice(d); applySeo(d); }
  render();
  onLangChange(render);
  window.addEventListener('fa-wa', render);
})();
