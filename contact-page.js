// Contact page: shows saved contact details and saves messages to Firestore (collection "messages").
import { fillNav, fillConnect, saveNotice } from './site-shared.js';
var $ = function (id) { return document.getElementById(id); };
var FALLBACK_MAIL = 'fahad.ar.official@gmail.com';
var mail = FALLBACK_MAIL, db = null, fs = null;

function out(msg, cls) { var o = $('cOut'); o.className = 'fmsg' + (cls ? ' ' + cls : ''); o.textContent = msg; }
function mailFallback(text) {
  var o = $('cOut'); o.className = 'fmsg err'; o.textContent = text + ' ';
  var a = document.createElement('a'); a.href = 'mailto:' + mail; a.textContent = 'Email me directly'; a.style.textDecoration = 'underline';
  o.appendChild(a); o.appendChild(document.createTextNode('.'));
}

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
  } catch (e) {
    mailFallback('Sorry, your message could not be sent.');
  }
  btn.disabled = false;
});
