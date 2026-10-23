/* Loading screen for the inner pages (about, contact, organizations).
   Same look as the home-page intro, but shorter. The bar follows what is really loading
   (page, fonts, saved admin content from Firebase). Stays at least ~1.4 s, never longer than ~6 s. */
(function () {
  if (document.getElementById('plo')) return;
  var root = document.documentElement;
  var css = '#plo{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;background:#070A09;color:#EEF3F0;overflow:hidden;transition:opacity .55s ease,visibility .55s}' +
    '#plo.out{opacity:0;visibility:hidden;pointer-events:none}' +
    '#plo .g{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}' +
    '#plo .g1{width:380px;height:380px;left:-110px;top:-60px;background:#287A50;opacity:.38}' +
    '#plo .g2{width:340px;height:340px;right:-100px;bottom:-40px;background:#3FAE7C;opacity:.26}' +
    '#plo .in{position:relative;text-align:center;padding:20px;width:min(520px,92vw)}' +
    '#plo .mk{position:relative;width:78px;height:78px;margin:0 auto 24px;border-radius:24px;display:grid;place-items:center;background:linear-gradient(135deg,#287A50,#3FAE7C);color:#fff;font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-weight:800;font-size:2.1rem;animation:ploP 2s ease-in-out infinite}' +
    '#plo .mk::after{content:"";position:absolute;inset:-18px;border-radius:38px;border:1px solid rgba(127,221,176,.25);animation:ploR 2s ease-out infinite}' +
    '#plo .nm{font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-weight:800;font-size:clamp(1.5rem,7vw,2.2rem);letter-spacing:-.03em;line-height:1.1;opacity:0;animation:ploU .7s .15s cubic-bezier(.2,.8,.2,1) both}' +
    '#plo .tg{margin-top:12px;font-size:.95rem;font-weight:500;color:#B4BBB6;opacity:0;animation:ploU .7s .4s cubic-bezier(.2,.8,.2,1) both}' +
    '#plo .ft{position:absolute;left:0;right:0;bottom:0;padding:0 0 calc(26px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:12px}' +
    '#plo .pc{font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:.78rem;font-weight:700;letter-spacing:.2em;color:#9AA7A1;font-variant-numeric:tabular-nums}' +
    '#plo .tr{width:min(260px,64vw);height:2px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden}' +
    '#plo .br{height:100%;width:0;background:linear-gradient(90deg,#287A50,#7FDDB0);border-radius:inherit;box-shadow:0 0 14px rgba(127,221,176,.8)}' +
    '#plo .gs{position:absolute;inset:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'84\' height=\'84\' viewBox=\'0 0 84 84\' fill=\'none\' stroke=\'%237FDDB0\' stroke-width=\'1.1\'%3E%3Crect x=\'17\' y=\'17\' width=\'50\' height=\'50\'/%3E%3Cpath d=\'M42 6.6L77.4 42L42 77.4L6.6 42Z\'/%3E%3Ccircle cx=\'42\' cy=\'42\' r=\'6\'/%3E%3C/svg%3E");background-size:84px 84px;opacity:.09;-webkit-mask-image:radial-gradient(circle at 50% 46%,#000 0,transparent 62%);mask-image:radial-gradient(circle at 50% 46%,#000 0,transparent 62%)}' +
    '.plo-on,.plo-on body{overflow:hidden}' +
    '@keyframes ploP{50%{transform:scale(1.07)}}' +
    '@keyframes ploR{0%{opacity:.8;transform:scale(.94)}100%{opacity:0;transform:scale(1.2)}}' +
    '@keyframes ploU{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
    '@media(prefers-reduced-motion:reduce){#plo .mk,#plo .mk::after{animation:none}#plo .nm,#plo .tg{animation:none;opacity:1}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var el = document.createElement('div');
  el.id = 'plo'; el.setAttribute('role', 'status'); el.setAttribute('aria-label', 'Loading page');
  el.innerHTML = '<span class="g g1"></span><span class="g g2"></span><span class="gs"></span>' +
    '<div class="in"><div class="mk" aria-hidden="true">F</div>' +
    '<div class="nm" aria-hidden="true">Fahad Abdur Rahman</div>' +
    '<div class="tg" aria-hidden="true">Ideas into Impact.</div></div>' +
    '<div class="ft" aria-hidden="true"><div class="pc" id="ploPct">0%</div><div class="tr"><div class="br" id="ploBar"></div></div></div>';
  document.body.insertBefore(el, document.body.firstChild);
  root.classList.add('plo-on');

  var bar = document.getElementById('ploBar'), pct = document.getElementById('ploPct');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MIN = reduce ? 300 : 1400, MAX = 6000, t0 = performance.now();
  var done = { dom: false, fonts: false, load: false, content: false };
  var W = { dom: 15, fonts: 25, load: 35, content: 25 };
  function mark(k) { done[k] = true; }
  function target() { var s = 0; for (var k in done) if (done[k]) s += W[k]; return s; }

  if (document.readyState !== 'loading') mark('dom');
  else document.addEventListener('DOMContentLoaded', function () { mark('dom'); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { mark('fonts'); }, function () { mark('fonts'); });
  else mark('fonts');
  function afterLoad() {
    mark('load');
    Promise.resolve(window.faContent).then(function () { mark('content'); }, function () { mark('content'); });
  }
  if (document.readyState === 'complete') afterLoad(); else window.addEventListener('load', afterLoad);

  var shown = 0, finished = false;
  function finish() {
    if (finished) return; finished = true;
    bar.style.width = '100%'; pct.textContent = '100%';
    setTimeout(function () {
      el.classList.add('out'); root.classList.remove('plo-on');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 700);
    }, 200);
  }
  function tick(now) {
    var spent = now - t0;
    var goal = Math.min(target(), Math.min(100, spent / MIN * 100));
    if (spent >= MAX) goal = 100;
    shown += (goal - shown) * 0.14;
    if (goal - shown < 0.5) shown = goal;
    bar.style.width = shown + '%'; pct.textContent = Math.round(shown) + '%';
    if (shown >= 100) { finish(); return; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  /* safety: never leave the screen stuck */
  setTimeout(finish, MAX + 1500);
})();
