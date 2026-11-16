// Digital card: buttons, "Save contact" (.vcf), QR code and share. Data comes from the admin panel (saved content).
import { localize, normWa, saveNotice } from './site-shared.js';
var $ = function (id) { return document.getElementById(id); };
var LANG = 'en'; try { LANG = localStorage.getItem('fa-lang') === 'bn' ? 'bn' : 'en'; } catch (e) {}
var RAW = null;
var T = {
  en: { save: 'Save my contact', saveS: 'Adds me to your phone', wa: 'Message on WhatsApp', waS: 'Chat with me', call: 'Call me', mail: 'Send an email', web: 'Visit my website', webS: 'Projects, blog and services', copied: 'Link copied', saved: 'Contact file downloaded', fail: 'Could not do that here', role: 'Founder & Chairman · Youth Leader', tag: 'Ideas into Impact.' },
  bn: { save: 'আমার কন্টাক্ট সেভ করুন', saveS: 'আপনার ফোনে যোগ হবে', wa: 'WhatsApp-এ মেসেজ করুন', waS: 'আমার সাথে চ্যাট করুন', call: 'ফোন করুন', mail: 'ইমেইল পাঠান', web: 'আমার ওয়েবসাইট দেখুন', webS: 'প্রজেক্ট, ব্লগ ও সার্ভিস', copied: 'লিংক কপি হয়েছে', saved: 'কন্টাক্ট ফাইল নামানো হয়েছে', fail: 'এখানে এটা করা গেল না', role: 'প্রতিষ্ঠাতা ও চেয়ারম্যান · যুব নেতা', tag: 'ভাবনা থেকে প্রভাব।' }
};
var ICON = {
  add: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M19 8v6M16 11h6"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
};
function tx() { return T[LANG]; }
function toast(m) { var t = $('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('on'); }, 2200); }
function pageUrl() { return location.href.split('#')[0].split('?')[0]; }
function siteUrl() { return pageUrl().replace(/card\.html$/, ''); }
function waNum() {
  var n = ''; try { n = normWa(((RAW && RAW.social) || {}).whatsapp); } catch (e) {}
  if (!n) { try { var c = JSON.parse(localStorage.getItem('fa-wa') || 'null'); n = (c && c.n) || ''; } catch (e) {} }
  return n;
}
function btn(cls, href, icon, title, sub, ext) {
  var a = document.createElement('a'); a.className = 'btn ' + cls; a.href = href; if (ext) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  a.innerHTML = '<span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[icon] + '</svg></span><span><span class="tt"></span><small></small></span>';
  a.querySelector('.tt').textContent = title; a.querySelector('small').textContent = sub || ''; if (!sub) a.querySelector('small').remove();
  return a;
}
function fold(line) { var o = '', i = 0; while (line.length - i > 74) { o += line.substr(i, i ? 73 : 74) + '\r\n '; i += i ? 73 : 74; } return o + line.substr(i); }
function esc(s) { return String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;'); }
function photoB64() {
  try {
    var im = $('avImg'); if (!im || !im.naturalWidth) return '';
    var c = document.createElement('canvas'); c.width = 240; c.height = 300; var x = c.getContext('2d');
    var r = Math.max(240 / im.naturalWidth, 300 / im.naturalHeight), w = im.naturalWidth * r, h = im.naturalHeight * r; x.drawImage(im, (240 - w) / 2, 0, w, h);
    return c.toDataURL('image/jpeg', 0.82).split(',')[1] || '';
  } catch (e) { return ''; }
}
function vcard() {
  var L = localize(RAW || {}), email = (L.profile && L.profile.email) || '', n = waNum(), role = (L.site && L.site.heroPill) || tx().role;
  var lines = ['BEGIN:VCARD', 'VERSION:3.0', 'FN:Fahad Abdur Rahman', 'N:Rahman;Fahad Abdur;;;', 'TITLE:' + esc(role)];
  if (n) lines.push('TEL;TYPE=CELL:+' + n);
  if (/^[^\s@]+@[^\s@]+$/.test(email)) lines.push('EMAIL;TYPE=INTERNET:' + email);
  lines.push('URL:' + siteUrl()); lines.push('NOTE:' + esc(tx().tag));
  var ph = photoB64(); if (ph) lines.push('PHOTO;ENCODING=b;TYPE=JPEG:' + ph);
  lines.push('END:VCARD');
  return lines.map(fold).join('\r\n') + '\r\n';
}
function saveContact() {
  try {
    var blob = new Blob([vcard()], { type: 'text/vcard;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'Fahad-Abdur-Rahman.vcf'; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 2500); toast(tx().saved);
    try { window.faTrack && window.faTrack('card_save_contact'); } catch (e) {}
  } catch (e) { toast(tx().fail); }
}
function paint() {
  var L = localize(RAW || {}), S = L.site || {}, P = L.profile || {}, soc = L.social || {};
  document.documentElement.lang = LANG; $('lang').textContent = LANG === 'bn' ? 'EN' : 'বাংলা';
  [].forEach.call(document.querySelectorAll('[data-en]'), function (n) { n.textContent = n.getAttribute('data-' + LANG) || n.getAttribute('data-en'); });
  $('role').textContent = S.heroPill || tx().role; $('tag').textContent = S.heroSub || tx().tag;
  var acts = $('acts'); acts.textContent = '';
  var save = btn('main', '#', 'add', tx().save, tx().saveS); save.addEventListener('click', function (e) { e.preventDefault(); saveContact(); }); acts.appendChild(save);
  var n = waNum(), msg = ''; try { var c = JSON.parse(localStorage.getItem('fa-wa') || 'null'); msg = c ? (LANG === 'bn' && c.mb ? c.mb : c.m) || '' : ''; } catch (e) {}
  if (n) {
    var w = btn('wa', 'https://wa.me/' + n + (msg ? '?text=' + encodeURIComponent(msg) : ''), 'chat', tx().wa, tx().waS, true); w.addEventListener('click', function () { try { window.faTrack && window.faTrack('card_whatsapp'); } catch (e) {} }); acts.appendChild(w);
    acts.appendChild(btn('', 'tel:+' + n, 'phone', tx().call, '+' + n));
  }
  if (/^[^\s@]+@[^\s@]+$/.test(P.email || '')) acts.appendChild(btn('', 'mailto:' + P.email, 'mail', tx().mail, P.email));
  acts.appendChild(btn('', 'index.html', 'globe', tx().web, tx().webS));
  var ob = $('orgs'); ob.textContent = '';
  var orgs = (L.orgs || []).filter(function (o) { return o && o.name; });
  orgs.forEach(function (o) {
    var slug = o.slug || String(o.name).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    var a = document.createElement('a'); a.href = 'organization.html?o=' + encodeURIComponent(slug); a.textContent = o.name; ob.appendChild(a);
  });
  $('orgsBox').hidden = !orgs.length;
  var sb = $('soc'); sb.textContent = ''; var any = false;
  [['linkedin', 'LinkedIn'], ['facebook', 'Facebook'], ['github', 'GitHub'], ['youtube', 'YouTube'], ['x', 'X']].forEach(function (k) {
    var u = String(soc[k[0]] || '').trim(); if (!/^https:\/\/\S+$/i.test(u)) return; any = true;
    var a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'me noopener noreferrer'; a.textContent = k[1]; sb.appendChild(a);
  });
  $('socBox').hidden = !any;
  var c = $('qr'); try { FA_QR.draw(c, pageUrl(), { scale: 8, margin: 2, dark: '#06100b', light: '#ffffff' }); } catch (e) {}
}
$('lang').addEventListener('click', function () { LANG = LANG === 'bn' ? 'en' : 'bn'; try { localStorage.setItem('fa-lang', LANG); } catch (e) {} paint(); });
$('qrDl').addEventListener('click', function () {
  var big = document.createElement('canvas'); try { FA_QR.draw(big, pageUrl(), { scale: 14, margin: 4, dark: '#06100b', light: '#ffffff' }); } catch (e) { return; }
  var a = document.createElement('a'); a.href = big.toDataURL('image/png'); a.download = 'fahad-card-qr.png'; document.body.appendChild(a); a.click(); a.remove();
});
$('share').addEventListener('click', function () {
  var data = { title: 'Fahad Abdur Rahman', text: tx().role, url: pageUrl() };
  if (navigator.share) { navigator.share(data).catch(function () {}); return; }
  if (navigator.clipboard) navigator.clipboard.writeText(pageUrl()).then(function () { toast(tx().copied); }, function () { toast(tx().fail); }); else toast(tx().fail);
});
$('yr').textContent = new Date().getFullYear();
$('avImg').addEventListener('error', function () { $('avBox').textContent = 'FA'; });
/* gentle 3D tilt for mouse users */
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var c = $('card');
  document.addEventListener('pointermove', function (e) {
    var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    if (Math.abs(px) > 1 || Math.abs(py) > 1) { c.style.transform = ''; return; }
    c.style.transform = 'perspective(1100px) rotateY(' + (px * 7).toFixed(2) + 'deg) rotateX(' + (-py * 6).toFixed(2) + 'deg)';
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { c.style.transform = ''; });
})();
paint();
(async function () {
  try {
    var cfg = await import('./firebase-config.js'); var fc = cfg.firebaseConfig;
    if (!fc || !fc.apiKey || /YOUR/i.test(fc.apiKey)) return;
    var app = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    var fs = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    var db = fs.getFirestore(app.initializeApp(fc));
    var snap = await fs.getDoc(fs.doc(db, 'site', 'content'));
    if (snap.exists()) { RAW = snap.data(); try { saveNotice(RAW); } catch (e) {} paint(); }
  } catch (e) {}
})();
