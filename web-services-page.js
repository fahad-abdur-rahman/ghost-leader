// Web Services page: shows plans, services, steps and FAQ.
// Built-in content comes from web-defaults.js; whatever you save in Admin > Web Services replaces it.
import { fillNav, fillConnect, localize, onLangChange, saveNotice, applySeo } from './site-shared.js';
var $ = function (id) { return document.getElementById(id); };
function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
var DEF = window.FA_WEB || { site: {}, plans: [], services: [], steps: [], faq: [] };
var RAW = null, DB = null, FS = null, EMAIL = '';
function bn() { return document.documentElement.getAttribute('lang') === 'bn'; }

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
  var RAWPLAN = build(RAW).plans.map(function (p) { return p && p.name; });
  function idxOf(p) { return D.plans.indexOf(p); }
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
    b.href = '#order'; b.setAttribute('data-plan', String(RAWPLAN[idxOf(p)] || p.name));
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

  fillPlans(D, build(RAW));
  paintForm();
  /* admin controls: custom order heading/text, show/hide sections */
  if (S.wsOrderTitle) { var ot = $('od-h'); if (ot) ot.textContent = S.wsOrderTitle; }
  if (S.wsOrderText) { var ox = $('oText'); if (ox) ox.textContent = S.wsOrderText; }
  var orderOff = String(S.wsOrderOn || '') === '0';
  var osec = $('order'); if (osec) osec.hidden = orderOff;
  [].forEach.call(document.querySelectorAll('a[data-plan]'), function (a) {
    if (orderOff) { a.href = 'contact.html?plan=' + encodeURIComponent(a.getAttribute('data-plan')); a.setAttribute('data-off', '1'); }
    else { a.href = '#order'; a.removeAttribute('data-off'); }
  });
  [['wsHidePlans', '#plans'], ['wsHideServices', '[aria-labelledby="sv-h"]'], ['wsHideSteps', '[aria-labelledby="hw-h"]'], ['wsHideHost', '[aria-labelledby="ho-h"]'], ['wsHideFaq', '[aria-labelledby="fq-h"]']].forEach(function (x) {
    var sec = document.querySelector(x[1]); if (sec) sec.hidden = String(S[x[0]] || '') === '1';
  });

  /* buttons: WhatsApp when a number is saved, otherwise the contact page */
  var link = wa(S.wsCtaText ? (document.documentElement.lang === 'bn' ? '\u0986\u09ae\u09bf \u0986\u09aa\u09a8\u09be\u09b0 \u0993\u09af\u09bc\u09c7\u09ac\u09b8\u09be\u0987\u099f \u09b8\u09be\u09b0\u09cd\u09ad\u09bf\u09b8 \u09b8\u09ae\u09cd\u09aa\u09b0\u09cd\u0995\u09c7 \u099c\u09be\u09a8\u09a4\u09c7 \u099a\u09be\u0987\u0964' : 'Hello Fahad, I would like to know more about your website service.') : '');
  [['wsHeroCta', true], ['wsCtaWa', false]].forEach(function (x) {
    var a = $(x[0]); if (!a) return;
    if (link) { a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = S.wsBtnWhats; }
    else { a.href = 'contact.html'; a.removeAttribute('target'); a.textContent = S.wsBtnContact; }
  });
}


/* ---------- order form ---------- */
function fillPlans(D, B) {
  var sel = $('oPlan'); if (!sel) return;
  var keep = sel.value;
  while (sel.options.length > 1) sel.remove(1);
  D.plans.forEach(function (p, i) {
    if (!p || !String(p.name || '').trim()) return;
    var o = document.createElement('option'); o.value = String((B.plans[i] && B.plans[i].name) || p.name); o.textContent = p.name; sel.appendChild(o);
  });
  var want = keep || new URLSearchParams(location.search).get('plan') || '';
  for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === want) { sel.selectedIndex = i; break; }
}
function paintForm() {
  var f = $('wsOrder'); if (!f) return;
  var L = bn() ? 'bn' : 'en';
  [].forEach.call(document.querySelectorAll('#order [data-en]'), function (n) { n.textContent = n.getAttribute('data-' + L) || n.getAttribute('data-en'); });
  [].forEach.call(f.querySelectorAll('[data-ph-en]'), function (n) { n.placeholder = n.getAttribute('data-ph-' + L); });
}
function ost(msg, kind) { var n = $('oStatus'); n.textContent = msg; n.className = 'ost' + (kind ? ' ' + kind : ''); }
function mailFallback(why) {
  var body = encodeURIComponent($('oMsg').value);
  var a = EMAIL ? '<a href="mailto:' + EMAIL + '?subject=' + encodeURIComponent('Website order') + '&body=' + body + '">' + EMAIL + '</a>' : '';
  var n = $('oStatus'); n.className = 'ost err'; n.textContent = why + ' ';
  if (EMAIL) { var l = document.createElement('a'); l.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Website order') + '&body=' + body; l.textContent = EMAIL; n.appendChild(l); }
}
function thanks(form) {
  var box = el('div', 'ord-ok'); box.setAttribute('role', 'status');
  box.innerHTML = '<div><svg viewBox="0 0 104 104" aria-hidden="true"><circle class="c1" cx="52" cy="52" r="48"/><path class="ck" d="M32 54l14 14 27-30"/></svg><h3></h3><p></p></div>';
  box.querySelector('h3').textContent = bn() ? '\u0986\u09aa\u09a8\u09be\u09b0 \u0985\u09b0\u09cd\u09a1\u09be\u09b0 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09af\u09bc\u09c7\u099b\u09c7!' : 'Your order was sent!';
  box.querySelector('p').textContent = bn() ? '\u09a7\u09a8\u09cd\u09af\u09ac\u09be\u09a6! \u0986\u09ae\u09bf \u09b6\u09c0\u0998\u09cd\u09b0\u0987 WhatsApp \u09ac\u09be \u0987\u09ae\u09c7\u0987\u09b2\u09c7 \u0986\u09aa\u09a8\u09be\u0995\u09c7 \u099c\u09be\u09a8\u09be\u09ac\u0964' : 'Thank you! I will contact you on WhatsApp or email very soon.';
  var again = el('button', 'btn', bn() ? '\u0986\u09b0\u09c7\u0995\u099f\u09bf \u0985\u09b0\u09cd\u09a1\u09be\u09b0' : 'Send another'); again.type = 'button';
  again.addEventListener('click', function () { box.remove(); $('oName').focus(); });
  box.firstChild.appendChild(again); form.appendChild(box);
}
(function () {
  var form = $('wsOrder'); if (!form) return;
  /* plan buttons: choose the plan and jump to the form */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('a[data-plan]'); if (!b || b.getAttribute('data-off')) return;
    e.preventDefault();
    var sel = $('oPlan'); for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === b.getAttribute('data-plan')) { sel.selectedIndex = i; break; }
    $('order').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { try { $('oName').focus({ preventScroll: true }); } catch (x) {} }, 600);
  });
  form.addEventListener('submit', async function (ev) {
    ev.preventDefault();
    var T = bn() ? {
      name: '\u0986\u09aa\u09a8\u09be\u09b0 \u09a8\u09be\u09ae \u09b2\u09bf\u0996\u09c1\u09a8\u0964', phone: '\u09b8\u09a0\u09bf\u0995 WhatsApp \u09ac\u09be \u09ab\u09cb\u09a8 \u09a8\u09ae\u09cd\u09ac\u09b0 \u09a6\u09bf\u09a8\u0964', mail: '\u09b8\u09a0\u09bf\u0995 \u0987\u09ae\u09c7\u0987\u09b2 \u09a6\u09bf\u09a8\u0964',
      msg: '\u0986\u0987\u09a1\u09bf\u09af\u09bc\u09be\u099f\u09be \u0986\u09b0\u0993 \u0995\u09bf\u099b\u09c1 \u0995\u09a5\u09be\u09af\u09bc \u09b2\u09bf\u0996\u09c1\u09a8 (\u0995\u09ae\u09aa\u0995\u09cd\u09b7\u09c7 \u09e7\u09e6 \u0985\u0995\u09cd\u09b7\u09b0)\u0964', wait: '\u0986\u09b0\u09c7\u0995\u099f\u09bf \u0985\u09b0\u09cd\u09a1\u09be\u09b0 \u09aa\u09be\u09a0\u09be\u09a8\u09cb\u09b0 \u0986\u0997\u09c7 \u098f\u0995 \u09ae\u09bf\u09a8\u09bf\u099f \u0985\u09aa\u09c7\u0995\u09cd\u09b7\u09be \u0995\u09b0\u09c1\u09a8\u0964',
      sending: '\u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u099a\u09cd\u099b\u09c7\u2026', na: '\u09ab\u09b0\u09cd\u09ae\u099f\u09bf \u098f\u0996\u09a8 \u0995\u09be\u099c \u0995\u09b0\u099b\u09c7 \u09a8\u09be\u0964', fail: '\u09a6\u09c1\u0983\u0996\u09bf\u09a4, \u0985\u09b0\u09cd\u09a1\u09be\u09b0 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09af\u09be\u09af\u09bc\u09a8\u09bf\u0964 \u0987\u09ae\u09c7\u0987\u09b2\u09c7 \u09aa\u09be\u09a0\u09be\u09a8:'
    } : { name: 'Please enter your name.', phone: 'Please enter a valid WhatsApp or phone number.', mail: 'Please enter a valid email address.', msg: 'Please tell me a little more about your idea (at least 10 characters).', wait: 'Please wait a minute before sending another order.', sending: 'Sending\u2026', na: 'The form is not available right now.', fail: 'Sorry, your order could not be sent. Please email me:' };
    var name = $('oName').value.trim(), phone = $('oPhone').value.trim(), email = $('oEmail').value.trim(), msg = $('oMsg').value.trim();
    if ($('oWeb').value) { ost('', ''); thanks(form); return; } // bots
    if (name.length < 2) { ost(T.name, 'err'); $('oName').focus(); return; }
    if (phone.replace(/[^\d]/g, '').length < 8) { ost(T.phone, 'err'); $('oPhone').focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { ost(T.mail, 'err'); $('oEmail').focus(); return; }
    if (msg.length < 10) { ost(T.msg, 'err'); $('oMsg').focus(); return; }
    var last = 0; try { last = Number(localStorage.getItem('fa-last-order')) || 0; } catch (e) {}
    if (Date.now() - last < 60000) { ost(T.wait, 'err'); return; }
    if (!DB || !FS) { mailFallback(T.na); return; }
    var head = '[WEBSITE ORDER]\nPlan: ' + $('oPlan').value + '\nWebsite type: ' + $('oType').value + '\nBudget: ' + ($('oBudget').value.trim() || 'not given') +
      '\nNeeded: ' + $('oWhen').value + '\nDomain: ' + $('oDomain').value + ($('oSite').value.trim() ? '\nCurrent website: ' + $('oSite').value.trim().slice(0, 200) : '') + '\nPhone/WhatsApp: ' + phone + '\nDetails:\n';
    var text = (head + msg).slice(0, 2000);
    var btn = $('oSend'); btn.disabled = true; ost(T.sending, '');
    try {
      await FS.addDoc(FS.collection(DB, 'messages'), { name: name.slice(0, 80), email: email.slice(0, 120), message: text, createdAt: Date.now(), page: 'web-order' });
      try { localStorage.setItem('fa-last-order', String(Date.now())); } catch (e) {}
      form.reset(); fillPlans(localize(build(RAW)), build(RAW)); ost('', '');
      thanks(form);
      try { window.faTrack && window.faTrack('web_order_submit', { plan: String($('oPlan').value).slice(0, 40) }); } catch (e) {}
    } catch (e) { try { console.warn('Order not sent:', e); } catch (x) {} mailFallback(T.fail + ' [' + String((e && (e.code || e.message)) || 'error').slice(0, 60) + ']'); }
    btn.disabled = false;
  });
})();

window.faContent = (async function () {
  var d = null;
  try {
    var cfg = await import('./firebase-config.js'); var c = cfg.firebaseConfig;
    if (!c || !c.apiKey || /YOUR/i.test(c.apiKey)) throw 0;
    var app = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    var fs = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    var db = fs.getFirestore(app.initializeApp(c)); DB = db; FS = fs;
    var snap = await fs.getDoc(fs.doc(db, 'site', 'content'));
    if (snap.exists()) d = snap.data();
  } catch (e) { d = null; }
  RAW = d; EMAIL = (d && d.profile && d.profile.email) || '';
  if (d && Array.isArray(d.orgs)) fillNav(d.orgs);
  if (d) { fillConnect(d); saveNotice(d); applySeo(d); }
  render();
  onLangChange(render);
  window.addEventListener('fa-wa', render);
})();
