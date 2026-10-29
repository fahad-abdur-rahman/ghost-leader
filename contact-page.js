// Contact page: shows saved contact details and saves messages to Firestore (collection "messages").
import { fillNav, fillConnect, saveNotice, applySeo } from './site-shared.js';
var $ = function (id) { return document.getElementById(id); };
var FALLBACK_MAIL = 'fahad.ar.official@gmail.com';
var mail = FALLBACK_MAIL, db = null, fs = null;

function out(msg, cls) { var o = $('cOut'); o.className = 'fmsg' + (cls ? ' ' + cls : ''); o.textContent = msg; }
function mailFallback(text) {
  var o = $('cOut'); o.className = 'fmsg err'; o.textContent = text + ' ';
  var a = document.createElement('a'); a.href = 'mailto:' + mail; a.textContent = 'Email me directly'; a.style.textDecoration = 'underline';
  o.appendChild(a); o.appendChild(document.createTextNode('.'));
}


/* ---------- success animation after a message is sent ---------- */
function celebrate() {
  var form = $('cForm'); if (!form || form.querySelector('.cs-ok')) return;
  var bn = document.documentElement.getAttribute('lang') === 'bn';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.getElementById('csStyle')) {
    var st = document.createElement('style'); st.id = 'csStyle';
    st.textContent = '.cs-ok{position:absolute;inset:0;z-index:5;display:grid;place-items:center;text-align:center;padding:24px;border-radius:inherit;background:var(--surface,#fff);animation:csIn .5s cubic-bezier(.2,.8,.2,1) both}' +
      '@keyframes csIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}' +
      '.cs-ok svg{width:104px;height:104px;display:block;margin:0 auto 14px;overflow:visible}' +
      '.cs-ok .c1{fill:none;stroke:var(--green,#287A50);stroke-width:4;stroke-linecap:round;stroke-dasharray:302;stroke-dashoffset:302;transform:rotate(-90deg);transform-origin:50% 50%;animation:csDraw .8s .1s cubic-bezier(.4,0,.2,1) forwards}' +
      '.cs-ok .c2{fill:color-mix(in srgb,var(--green,#287A50) 12%,transparent);transform:scale(0);transform-origin:50% 50%;animation:csPop .5s .55s cubic-bezier(.3,1.6,.4,1) forwards}' +
      '.cs-ok .ck{fill:none;stroke:var(--green,#287A50);stroke-width:6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:60;stroke-dashoffset:60;animation:csDraw .45s .7s ease-out forwards}' +
      '@keyframes csDraw{to{stroke-dashoffset:0}}@keyframes csPop{to{transform:scale(1)}}' +
      '.cs-ok h3{margin:0 0 6px;font-size:1.35rem;animation:csUp .5s .9s both}.cs-ok p{margin:0 0 16px;color:var(--muted,#666);animation:csUp .5s 1s both}.cs-ok .btn{animation:csUp .5s 1.1s both}' +
      '@keyframes csUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}' +
      '.cs-dot{position:absolute;left:50%;top:38%;width:9px;height:9px;border-radius:50%;opacity:0;animation:csBurst 1.1s .7s cubic-bezier(.2,.8,.3,1) forwards}' +
      '@keyframes csBurst{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.3)}}' +
      '@media(prefers-reduced-motion:reduce){.cs-ok *{animation:none!important}.cs-ok .c1,.cs-ok .ck{stroke-dashoffset:0}.cs-ok .c2{transform:none}}';
    document.head.appendChild(st);
  }
  var box = document.createElement('div'); box.className = 'cs-ok'; box.setAttribute('role', 'status');
  box.innerHTML = '<div><svg viewBox="0 0 104 104" aria-hidden="true"><circle class="c2" cx="52" cy="52" r="46"/><circle class="c1" cx="52" cy="52" r="48"/><path class="ck" d="M32 54l14 14 27-30"/></svg><h3></h3><p></p><button type="button" class="btn"></button></div>';
  box.querySelector('h3').textContent = bn ? '\u09ae\u09c7\u09b8\u09c7\u099c \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09af\u09bc\u09c7\u099b\u09c7!' : 'Message sent!';
  box.querySelector('p').textContent = bn ? '\u09a7\u09a8\u09cd\u09af\u09ac\u09be\u09a6! \u0986\u09ae\u09bf \u09b6\u09c0\u0998\u09cd\u09b0\u0987 \u0989\u09a4\u09cd\u09a4\u09b0 \u09a6\u09bf\u099a\u09cd\u099b\u09bf\u0964' : 'Thank you! I will reply as soon as I can.';
  var again = box.querySelector('button'); again.textContent = bn ? '\u0986\u09b0\u09c7\u0995\u099f\u09bf \u09aa\u09be\u09a0\u09be\u09a8' : 'Send another';
  if (!reduce) {
    var cols = ['#287A50', '#3FAE7C', '#7FDDB0', '#2FB8A8', '#e0b84a'];
    for (var i = 0; i < 18; i++) {
      var d = document.createElement('i'), a = (Math.PI * 2 * i) / 18, r = 90 + Math.random() * 70;
      d.className = 'cs-dot'; d.style.background = cols[i % cols.length];
      d.style.setProperty('--x', Math.cos(a) * r + 'px'); d.style.setProperty('--y', Math.sin(a) * r + 'px'); d.style.animationDelay = (0.7 + Math.random() * 0.15) + 's';
      box.appendChild(d);
    }
  }
  if (getComputedStyle(form).position === 'static') form.style.position = 'relative';
  form.appendChild(box);
  function close() { if (box.parentNode) box.parentNode.removeChild(box); var n = $('cName'); if (n) n.focus(); }
  again.addEventListener('click', close);
  again.focus({ preventScroll: true });
}

/* arriving from the Web Services page with ?plan=Business: write the first line of the message */
(function () {
  var plan = new URLSearchParams(location.search).get('plan');
  var box = $('cMsg');
  if (!plan || !box || box.value) return;
  var bn = document.documentElement.getAttribute('lang') === 'bn';
  box.value = bn ? '\u0986\u09ae\u09bf \u0986\u09aa\u09a8\u09be\u09b0 "' + plan.slice(0, 40) + '" \u0993\u09af\u09bc\u09c7\u09ac\u09b8\u09be\u0987\u099f \u09aa\u09cd\u09b2\u09cd\u09af\u09be\u09a8 \u09a8\u09bf\u09a4\u09c7 \u0986\u0997\u09cd\u09b0\u09b9\u09c0\u0964 ' : 'Hello Fahad, I am interested in the "' + plan.slice(0, 40) + '" website plan. ';
})();

window.faContent = (async function () {
  try {
    var cfg = await import('./firebase-config.js'); var c = cfg.firebaseConfig;
    if (c && c.apiKey && !/YOUR/i.test(c.apiKey)) {
      var app = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
      fs = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
      db = fs.getFirestore(app.initializeApp(c));
      var snap = await fs.getDoc(fs.doc(db, 'site', 'content'));
      if (snap.exists()) {
        var d = snap.data();
        if (Array.isArray(d.orgs)) fillNav(d.orgs);
        fillConnect(d);
        saveNotice(d);
        applySeo(d);
        var p = d.profile || {};
        if (p.email && /^[^\s@]+@[^\s@]+$/.test(p.email)) { mail = p.email; var m = $('cMail'); m.textContent = mail; m.href = 'mailto:' + mail; }
        if (typeof p.location === 'string' && p.location.trim()) $('cLoc').textContent = p.location.trim();
        var labels = { linkedin: 'LinkedIn', facebook: 'Facebook', github: 'GitHub', x: 'X / Twitter', youtube: 'YouTube' }, soc = d.social || {}, box = $('cSoc'), n = 0;
        Object.keys(labels).forEach(function (k) {
          if (soc[k] && /^https?:\/\//i.test(soc[k])) {
            var a = document.createElement('a'); a.href = soc[k]; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = labels[k]; box.appendChild(a); n++;
          }
        });
        $('cSocWrap').hidden = !n;
      }
    }
  } catch (e) { /* page still works */ }
})();

$('cForm').addEventListener('submit', async function (ev) {
  ev.preventDefault();
  var name = $('cName').value.trim(), email = $('cEmail').value.trim(), msg = $('cMsg').value.trim();
  if ($('cWeb').value) { out('Thank you! Your message has been sent.', 'ok'); return; } // bots
  if (name.length < 2) { out('Please enter your name.', 'err'); $('cName').focus(); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { out('Please enter a valid email address.', 'err'); $('cEmail').focus(); return; }
  if (msg.length < 10) { out('Please write a few more words (at least 10 characters).', 'err'); $('cMsg').focus(); return; }
  var last = 0; try { last = Number(localStorage.getItem('fa-last-msg')) || 0; } catch (e) {}
  if (Date.now() - last < 60000) { out('Please wait a minute before sending another message.', 'err'); return; }
  if (!db || !fs) { mailFallback('The form is not available right now.'); return; }
  var btn = $('cSend'); btn.disabled = true; out('Sending…');
  try {
    await fs.addDoc(fs.collection(db, 'messages'), { name: name, email: email, message: msg, createdAt: Date.now(), page: 'contact' });
    try { localStorage.setItem('fa-last-msg', String(Date.now())); } catch (e) {}
    $('cForm').reset();
    out('Thank you! Your message has been sent.', 'ok');
    celebrate();
    try { window.faTrack && window.faTrack('contact_submit'); } catch (e) {}
  } catch (e) {
    mailFallback('Sorry, your message could not be sent.');
  }
  btn.disabled = false;
});
