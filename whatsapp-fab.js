/* Floating WhatsApp button + a small welcome popup.
   Both appear only AFTER the intro / loading screen has finished.
   The number and messages come from the admin panel (Profile & Links, Site texts). No number saved = nothing shows. */
(function () {
  if (window.__faWa) return; window.__faWa = 1;
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || root.classList.contains('lite');
  function bn() { return root.getAttribute('lang') === 'bn'; }
  function load() { try { return JSON.parse(localStorage.getItem('fa-wa') || 'null'); } catch (e) { return null; } }
  function seen() { try { return sessionStorage.getItem('fa-wa-pop') === '1'; } catch (e) { return false; } }
  function markSeen() { try { sessionStorage.setItem('fa-wa-pop', '1'); } catch (e) {} }

  var css = [
    '.fa-wa{position:fixed;right:16px;bottom:calc(80px + env(safe-area-inset-bottom));z-index:2147482100;display:flex;align-items:center;flex-direction:row-reverse;gap:10px;text-decoration:none;animation:waIn .6s cubic-bezier(.2,1.4,.4,1) both}',
    '.fa-wa .b{position:relative;display:grid;place-items:center;width:56px;height:56px;border-radius:50%;background:linear-gradient(145deg,#2fd366,#1ba653);box-shadow:0 10px 26px rgba(27,166,83,.45),0 2px 0 rgba(255,255,255,.35) inset;transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s}',
    '.fa-wa .b svg{width:30px;height:30px;fill:#fff}',
    '.fa-wa .b::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid #2fd366;opacity:0;animation:waPulse 2.8s ease-out 2s infinite}',
    '.fa-wa .t{max-width:0;overflow:hidden;white-space:nowrap;padding:0;border-radius:99px;background:#0f1a14;color:#eaf6ef;font:600 .84rem system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Bengali",sans-serif;opacity:0;transition:max-width .35s cubic-bezier(.2,.8,.2,1),padding .35s,opacity .25s;box-shadow:0 8px 22px rgba(0,0,0,.25)}',
    '.fa-wa:hover .t,.fa-wa:focus-visible .t{max-width:260px;padding:9px 16px;opacity:1}',
    '.fa-wa:hover .b,.fa-wa:focus-visible .b{transform:scale(1.08) rotate(-6deg);box-shadow:0 14px 32px rgba(27,166,83,.55),0 2px 0 rgba(255,255,255,.35) inset}',
    '.fa-wa:active .b{transform:scale(.95)}',
    '.fa-wa:focus-visible{outline:none}.fa-wa:focus-visible .b{outline:3px solid #fff;outline-offset:2px}',
    /* popup */
    '.fa-wa-pop{position:fixed;right:16px;bottom:calc(150px + env(safe-area-inset-bottom));z-index:2147482150;width:min(320px,calc(100vw - 32px));border-radius:20px;overflow:hidden;background:var(--surface,#fff);color:var(--text,#1c1e1f);border:1px solid var(--border,rgba(128,128,128,.25));box-shadow:0 24px 70px rgba(0,0,0,.35);font:.92rem/1.5 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Bengali",sans-serif;transform-origin:100% 100%;animation:wpIn .55s cubic-bezier(.2,1.2,.4,1) both}',
    '.fa-wa-pop::after{content:"";position:absolute;right:26px;bottom:-7px;width:14px;height:14px;transform:rotate(45deg);background:var(--surface,#fff);border-right:1px solid var(--border,rgba(128,128,128,.25));border-bottom:1px solid var(--border,rgba(128,128,128,.25))}',
    '.fa-wa-pop .ph{display:flex;align-items:center;gap:11px;padding:13px 14px;color:#fff;background:linear-gradient(135deg,#128c4a,#1ba653)}',
    '.fa-wa-pop .av{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.2);font-weight:800;font-size:.8rem;letter-spacing:.02em;flex:none}',
    '.fa-wa-pop .nm{font-weight:700;line-height:1.2}.fa-wa-pop .sb{font-size:.76rem;opacity:.85}',
    '.fa-wa-pop .x{margin-left:auto;width:30px;height:30px;border:0;border-radius:50%;background:rgba(255,255,255,.16);color:#fff;font-size:1.1rem;line-height:1;cursor:pointer;transition:background .2s}',
    '.fa-wa-pop .x:hover,.fa-wa-pop .x:focus-visible{background:rgba(255,255,255,.3);outline:none}',
    '.fa-wa-pop .bd{padding:16px 14px 6px;background:color-mix(in srgb,var(--text,#1c1e1f) 4%,var(--surface,#fff))}',
    '.fa-wa-pop .msg{position:relative;display:inline-block;max-width:92%;padding:10px 13px;border-radius:4px 16px 16px 16px;background:var(--surface,#fff);border:1px solid var(--border,rgba(128,128,128,.25));box-shadow:0 2px 8px rgba(0,0,0,.06)}',
    '.fa-wa-pop .go{display:flex;align-items:center;justify-content:center;gap:8px;margin:12px 14px 14px;padding:11px 16px;border-radius:99px;background:linear-gradient(145deg,#2fd366,#1ba653);color:#fff;font-weight:700;text-decoration:none;box-shadow:0 8px 20px rgba(27,166,83,.35);transition:transform .2s,box-shadow .2s}',
    '.fa-wa-pop .go:hover,.fa-wa-pop .go:focus-visible{transform:translateY(-2px);box-shadow:0 12px 26px rgba(27,166,83,.45);outline:none}',
    '.fa-wa-pop .go svg{width:18px;height:18px;fill:#fff}',
    '.fa-wa-pop.out{animation:wpOut .3s ease both}',
    '@keyframes waIn{from{opacity:0;transform:translateY(24px) scale(.6)}to{opacity:1;transform:none}}',
    '@keyframes wpIn{from{opacity:0;transform:translateY(18px) scale(.85)}to{opacity:1;transform:none}}',
    '@keyframes wpOut{to{opacity:0;transform:translateY(12px) scale(.92)}}',
    '@keyframes waPulse{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.7)}}',
    '@media(max-width:520px){.fa-wa{right:12px;bottom:calc(76px + env(safe-area-inset-bottom))}.fa-wa .t{display:none}.fa-wa-pop{right:12px;bottom:calc(144px + env(safe-area-inset-bottom))}}',
    '@media(prefers-reduced-motion:reduce){.fa-wa,.fa-wa .b::after,.fa-wa-pop{animation:none}.fa-wa .b::after{display:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var ICON = '<svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.3.6 4.4 1.7 6.3L3.3 28.6l7-1.8c1.8 1 3.8 1.5 5.7 1.5 7 0 12.6-5.6 12.6-12.6S23 3 16 3zm0 22.9c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.1 1.100 1.100-4-.3-.4a10.200 10.200 0 0 1-1.600-5.500C5.600 9.900 10.300 5.300 16 5.300s10.400 4.600 10.400 10.300S21.700 25.900 16 25.900zm5.700-7.600c-.3-.2-1.800-.9-2.100-1-.3-.1-.5-.2-.7.2-.2.300-.8 1-1 1.200-.2.200-.4.200-.7.100-.3-.2-1.300-.5-2.500-1.500-.9-.8-1.500-1.800-1.700-2.100-.2-.3 0-.5.100-.6l.5-.5c.1-.2.200-.3.300-.5.100-.2 0-.4 0-.5-.1-.2-.7-1.700-1-2.300-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1.100 1.100-1.100 2.600s1.100 3 1.300 3.200c.2.200 2.200 3.400 5.300 4.700 2 .8 2.700.9 3.700.7.6-.1 1.800-.7 2.100-1.500.3-.7.300-1.300.2-1.500-.1-.2-.3-.3-.6-.4z"/></svg>';
  var el = null, pop = null, ready = false;

  function href(c, withText) {
    var msg = (bn() && c.mb) ? c.mb : (c.m || '');
    return 'https://wa.me/' + c.n + ((withText && msg) ? '?text=' + encodeURIComponent(msg) : '');
  }
  function labels() {
    return bn()
      ? { chat: '\u09b9\u09cb\u09af\u09bc\u09be\u099f\u09b8\u0985\u09cd\u09af\u09be\u09aa\u09c7 \u09ae\u09c7\u09b8\u09c7\u099c \u0995\u09b0\u09c1\u09a8', sub: 'WhatsApp-\u098f \u09ae\u09c7\u09b8\u09c7\u099c \u0995\u09b0\u09c1\u09a8', start: '\u099a\u09cd\u09af\u09be\u099f \u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09c1\u09a8', close: '\u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09c1\u09a8',
          greet: '\u0986\u09b8\u09b8\u09be\u09b2\u09be\u09ae\u09c1 \u0986\u09b2\u09be\u0987\u0995\u09c1\u09ae! \u0995\u09cb\u09a8\u09cb \u09aa\u09cd\u09b0\u09b6\u09cd\u09a8 \u0986\u099b\u09c7 \u09ac\u09be \u0993\u09af\u09bc\u09c7\u09ac\u09b8\u09be\u0987\u099f \u09a6\u09b0\u0995\u09be\u09b0? WhatsApp-\u098f \u0986\u09ae\u09be\u0995\u09c7 \u09ae\u09c7\u09b8\u09c7\u099c \u0995\u09b0\u09c1\u09a8\u0964' }
      : { chat: 'Chat on WhatsApp', sub: 'Message on WhatsApp', start: 'Start chat', close: 'Close',
          greet: 'Assalamu Alaikum! Have a question or need a website? Message me on WhatsApp.' };
  }
  function render() {
    if (!ready) return;
    var c = load(), n = c && c.n, L = labels();
    if (!n) { if (el && el.parentNode) el.parentNode.removeChild(el); if (pop && pop.parentNode) pop.parentNode.removeChild(pop); el = pop = null; return; }
    if (!el) {
      el = document.createElement('a'); el.className = 'fa-wa'; el.target = '_blank'; el.rel = 'noopener noreferrer';
      el.innerHTML = '<span class="b" aria-hidden="true">' + ICON + '</span><span class="t"></span>';
      el.addEventListener('click', function () { markSeen(); closePop(); try { window.faTrack && window.faTrack('whatsapp_click'); } catch (e) {} });
      document.body.appendChild(el);
    }
    el.href = href(c, true); el.setAttribute('aria-label', L.chat); el.querySelector('.t').textContent = L.chat;
    if (pop) paintPop(c, L);
  }
  function paintPop(c, L) {
    var g = (bn() && c.gb) ? c.gb : (c.g || L.greet);
    pop.querySelector('.msg').textContent = g;
    pop.querySelector('.sb').textContent = L.sub;
    pop.querySelector('.x').setAttribute('aria-label', L.close);
    pop.querySelector('.go span').textContent = L.start;
    pop.querySelector('.go').href = href(c, true);
  }
  function closePop() {
    if (!pop) return; var p = pop; pop = null; markSeen();
    p.classList.add('out'); setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 320);
  }
  function showPop() {
    var c = load(); if (!c || !c.n || seen() || pop || !el) return;
    pop = document.createElement('div'); pop.className = 'fa-wa-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'WhatsApp');
    pop.innerHTML = '<div class="ph"><span class="av" aria-hidden="true">FA</span><div><div class="nm">Fahad Abdur Rahman</div><div class="sb"></div></div><button class="x" type="button">\u00d7</button></div>' +
      '<div class="bd"><div class="msg"></div></div><a class="go" target="_blank" rel="noopener noreferrer">' + ICON + '<span></span></a>';
    pop.querySelector('.x').addEventListener('click', closePop);
    pop.querySelector('.go').addEventListener('click', function () { markSeen(); setTimeout(closePop, 200); try { window.faTrack && window.faTrack('whatsapp_popup_click'); } catch (e) {} });
    document.body.appendChild(pop); paintPop(c, labels());
    try { window.faTrack && window.faTrack('whatsapp_popup_shown'); } catch (e) {}
    setTimeout(function () { if (pop && !seen()) { /* stays until closed; just remember it was shown */ markSeen(); } }, 500);
  }
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closePop(); });

  /* wait until the intro (home page) or the loading screen (other pages) is gone */
  function busy() { return root.classList.contains('intro-on') || root.classList.contains('plo-on'); }
  function start() {
    ready = true; render();
    if (!seen() && !reduce) setTimeout(showPop, 2400); else if (!seen()) setTimeout(showPop, 1200);
  }
  function whenReady(fn) {
    if (!busy()) { setTimeout(fn, 250); return; }
    var done = false;
    var mo = new MutationObserver(function () { if (!done && !busy()) { done = true; mo.disconnect(); setTimeout(fn, 450); } });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    setTimeout(function () { if (!done) { done = true; mo.disconnect(); fn(); } }, 14000); /* never wait forever */
  }
  whenReady(start);
  window.addEventListener('fa-wa', render);
  new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ['lang'] });
})();
