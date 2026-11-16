// 7-Day Leadership Challenge: tick one small action a day, then make a badge. Progress is kept only in this phone's storage.
import { localize } from './site-shared.js';
var $ = function (id) { return document.getElementById(id); };
var LANG = 'en'; try { LANG = localStorage.getItem('fa-lang') === 'bn' ? 'bn' : 'en'; } catch (e) {}
var KEY = 'fa-challenge', RAW = null;
var DEF = window.FA_CHALLENGE || [];
function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && Array.isArray(s.d)) { while (s.d.length < 7) s.d.push(0); return s; } } catch (e) {} return { d: [0, 0, 0, 0, 0, 0, 0], n: '' }; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
var S = load();
var TXT = {
  en: { copied: 'Link copied', invite: 'Join me in the 7-Day Leadership Challenge:', share: 'I finished the 7-Day Leadership Challenge by Fahad Abdur Rahman! Try it:', confirm: 'Start over? Your ticks and badge will be cleared from this phone.', done: 'Done', mark: 'Mark day as done', unmark: 'Undo', badge1: '7-DAY LEADERSHIP', badge2: 'CHALLENGE', badge3: 'COMPLETED', fail: 'Could not do that here' },
  bn: { copied: 'লিংক কপি হয়েছে', invite: '৭ দিনের নেতৃত্ব চ্যালেঞ্জে আমার সাথে যোগ দিন:', share: 'আমি ফাহাদ আবদুর রহমানের ৭ দিনের নেতৃত্ব চ্যালেঞ্জ শেষ করেছি! আপনিও চেষ্টা করুন:', confirm: 'আবার শুরু করবেন? আপনার টিক আর ব্যাজ এই ফোন থেকে মুছে যাবে।', done: 'শেষ', mark: 'দিনটা শেষ করেছি', unmark: 'বাতিল', badge1: '৭ দিনের নেতৃত্ব', badge2: 'চ্যালেঞ্জ', badge3: 'সম্পন্ন', fail: 'এখানে এটা করা গেল না' }
};
function tx() { return TXT[LANG]; }
function toast(m) { var t = $('toast'); t.textContent = m; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('on'); }, 2200); }
function pageUrl() { return location.href.split('#')[0].split('?')[0]; }
function days() {
  var list = (RAW && Array.isArray(RAW.challenge) && RAW.challenge.length) ? RAW.challenge : DEF;
  list = localize({ c: list }).c.filter(function (x) { return x && String(x.title || '').trim(); }).slice(0, 14);
  return list.length ? list : localize({ c: DEF }).c;
}
function count() { return S.d.filter(Boolean).length; }
function render() {
  document.documentElement.lang = LANG; $('lang').textContent = LANG === 'bn' ? 'EN' : 'বাংলা';
  [].forEach.call(document.querySelectorAll('[data-en]'), function (n) { n.textContent = n.getAttribute('data-' + LANG) || n.getAttribute('data-en'); });
  [].forEach.call(document.querySelectorAll('[data-ph-en]'), function (n) { n.placeholder = n.getAttribute('data-ph-' + LANG); });
  var ul = $('days'); ul.textContent = ''; var L = days();
  L.forEach(function (d, i) {
    if (i >= S.d.length) S.d.push(0);
    var li = document.createElement('li'); li.className = 'day' + (S.d[i] ? ' done' : '');
    var n = document.createElement('div'); n.className = 'dn'; n.textContent = String(i + 1);
    var mid = document.createElement('div'); var h = document.createElement('h3'); h.textContent = d.title; var p = document.createElement('p'); p.textContent = d.text || ''; mid.appendChild(h); mid.appendChild(p);
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tick'; b.setAttribute('aria-pressed', S.d[i] ? 'true' : 'false'); b.setAttribute('aria-label', (S.d[i] ? tx().unmark : tx().mark) + ' — ' + (i + 1));
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.500 4.500L19 7.500"/></svg>';
    b.addEventListener('click', function () {
      S.d[i] = S.d[i] ? 0 : 1; save();
      try { if (S.d[i]) window.faTrack && window.faTrack('challenge_day_done', { day: i + 1 }); } catch (e) {}
      var before = $('win').classList.contains('on'); render();
      if (!before && allDone()) { try { window.faTrack && window.faTrack('challenge_complete'); } catch (e) {} setTimeout(function () { $('win').scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 450); }
    });
    li.appendChild(n); li.appendChild(mid); li.appendChild(b); ul.appendChild(li);
  });
  var total = L.length, c = S.d.slice(0, total).filter(Boolean).length;
  $('cnt').textContent = String(c); document.querySelector('.ring .num').lastChild; 
  $('fg').style.strokeDashoffset = String(326.7 * (1 - c / total));
  $('win').classList.toggle('on', c === total && total > 0);
  $('nm').value = S.n || '';
}
function allDone() { var t = days().length; return t > 0 && S.d.slice(0, t).filter(Boolean).length === t; }
function makeBadge() {
  var c = $('badge'), W = 1080; c.width = W; c.height = W; var x = c.getContext('2d'), f = '"Plus Jakarta Sans","Noto Sans Bengali","Segoe UI",system-ui,-apple-system,Arial,sans-serif';
  var g = x.createLinearGradient(0, 0, W, W); g.addColorStop(0, '#06100b'); g.addColorStop(.55, '#0c2418'); g.addColorStop(1, '#071410'); x.fillStyle = g; x.fillRect(0, 0, W, W);
  function glow(cx, cy, r, col, a) { var rg = x.createRadialGradient(cx, cy, 0, cx, cy, r); rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)'); x.globalAlpha = a; x.fillStyle = rg; x.fillRect(0, 0, W, W); x.globalAlpha = 1; }
  glow(200, 150, 560, '#287A50', .55); glow(900, 950, 520, '#3FAE7C', .4);
  x.strokeStyle = 'rgba(255,255,255,.04)'; for (var i = 0; i <= W; i += 54) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, W); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(W, i); x.stroke(); }
  /* ring of seven dots */
  var cx0 = W / 2, cy0 = 470, R = 250; x.lineWidth = 14; x.strokeStyle = 'rgba(127,221,176,.22)'; x.beginPath(); x.arc(cx0, cy0, R, 0, Math.PI * 2); x.stroke();
  var rg = x.createLinearGradient(cx0 - R, cy0 - R, cx0 + R, cy0 + R); rg.addColorStop(0, '#7FDDB0'); rg.addColorStop(1, '#287A50'); x.strokeStyle = rg; x.lineCap = 'round'; x.beginPath(); x.arc(cx0, cy0, R, 0, Math.PI * 2); x.stroke();
  for (var k = 0; k < 7; k++) { var a = -Math.PI / 2 + k * (Math.PI * 2 / 7), px = cx0 + Math.cos(a) * R, py = cy0 + Math.sin(a) * R; x.fillStyle = '#06100b'; x.beginPath(); x.arc(px, py, 26, 0, 7); x.fill(); x.fillStyle = '#7FDDB0'; x.beginPath(); x.arc(px, py, 18, 0, 7); x.fill(); x.fillStyle = '#06100b'; x.font = '800 22px ' + f; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('\u2713', px, py + 1); }
  var mg = x.createLinearGradient(cx0 - 90, cy0 - 90, cx0 + 90, cy0 + 90); mg.addColorStop(0, '#287A50'); mg.addColorStop(1, '#3FAE7C'); x.fillStyle = mg;
  x.beginPath(); if (x.roundRect) x.roundRect(cx0 - 90, cy0 - 90, 180, 180, 52); else x.rect(cx0 - 90, cy0 - 90, 180, 180); x.fill();
  x.fillStyle = '#fff'; x.font = '800 78px ' + f; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('FA', cx0, cy0 + 4);
  x.textBaseline = 'alphabetic'; x.fillStyle = '#eaf3ee'; x.font = '800 54px ' + f; if ('letterSpacing' in x) x.letterSpacing = '6px'; x.fillText(tx().badge1, cx0, 840);
  x.fillStyle = '#7FDDB0'; x.fillText(tx().badge2, cx0, 902);
  x.font = '700 30px ' + f; if ('letterSpacing' in x) x.letterSpacing = '10px'; x.fillStyle = '#9db0a5'; x.fillText(tx().badge3, cx0, 954); if ('letterSpacing' in x) x.letterSpacing = '0px';
  var nm = (S.n || '').trim(); if (nm) { x.fillStyle = '#ffffff'; x.font = '800 44px ' + f; x.fillText(nm.slice(0, 32), cx0, 1018); }
  x.fillStyle = 'rgba(157,176,165,.8)'; x.font = '500 24px ' + f; x.textAlign = 'left'; x.fillText(new Date().toLocaleDateString(LANG === 'bn' ? 'bn-BD' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), 56, 1040);
  x.textAlign = 'right'; x.fillText('Fahad Abdur Rahman', W - 56, 1040);
  c.hidden = false; $('bAct').hidden = false;
}
function shareText() { return tx().share + ' ' + pageUrl(); }
$('lang').addEventListener('click', function () { LANG = LANG === 'bn' ? 'en' : 'bn'; try { localStorage.setItem('fa-lang', LANG); } catch (e) {} render(); if (!$('badge').hidden) makeBadge(); });
$('nm').addEventListener('input', function () { S.n = $('nm').value.slice(0, 40); save(); });
$('mk').addEventListener('click', function () { S.n = $('nm').value.slice(0, 40); save(); makeBadge(); $('badge').scrollIntoView({ behavior: 'smooth', block: 'center' }); try { window.faTrack && window.faTrack('challenge_badge'); } catch (e) {} });
$('bDl').addEventListener('click', function () { var a = document.createElement('a'); a.href = $('badge').toDataURL('image/png'); a.download = 'leadership-challenge-badge.png'; document.body.appendChild(a); a.click(); a.remove(); });
$('bSh').addEventListener('click', function () {
  var c = $('badge');
  function textOnly() { if (navigator.share) navigator.share({ text: shareText() }).catch(function () {}); else window.open('https://wa.me/?text=' + encodeURIComponent(shareText()), '_blank', 'noopener'); }
  if (navigator.canShare && c.toBlob) { c.toBlob(function (b) { try { var f = new File([b], 'badge.png', { type: 'image/png' }); if (navigator.canShare({ files: [f] })) navigator.share({ files: [f], text: shareText() }).catch(function () {}); else textOnly(); } catch (e) { textOnly(); } }); } else textOnly();
});
$('inv').addEventListener('click', function () {
  var t = tx().invite + ' ' + pageUrl();
  if (navigator.share) { navigator.share({ title: '7-Day Leadership Challenge', text: tx().invite, url: pageUrl() }).catch(function () {}); return; }
  if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { toast(tx().copied); }, function () { toast(tx().fail); }); else toast(tx().fail);
});
$('reset').addEventListener('click', function () { if (!confirm(tx().confirm)) return; S = { d: [0, 0, 0, 0, 0, 0, 0], n: '' }; save(); $('badge').hidden = true; $('bAct').hidden = true; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
$('yr').textContent = new Date().getFullYear();
render();
(async function () {
  try {
    var cfg = await import('./firebase-config.js'); var fc = cfg.firebaseConfig;
    if (!fc || !fc.apiKey || /YOUR/i.test(fc.apiKey)) return;
    var app = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    var fs = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    var db = fs.getFirestore(app.initializeApp(fc));
    var snap = await fs.getDoc(fs.doc(db, 'site', 'content'));
    if (snap.exists()) { RAW = snap.data(); render(); }
  } catch (e) {}
})();
