/* Small polish for every public page:
   1) "Copy" button next to the email address (+ a friendly "Copied" message)
   2) images fade from blurry to sharp while they load
   3) the line of the Education / Achievements timeline draws itself, dot by dot */
(function () {
  if (window.__faUx) return; window.__faUx = 1;
  var root = document.documentElement;
  var reduce = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var lite = root.classList.contains('lite');
  function bn() { return root.getAttribute('lang') === 'bn'; }
  var E = 'cubic-bezier(.2,.8,.2,1)';

  var css = [
    '.fa-copy{display:inline-flex;align-items:center;gap:6px;margin-left:10px;padding:4px 11px;border-radius:99px;border:1px solid var(--border,rgba(128,128,128,.35));background:transparent;color:var(--green-text,#226B45);font:700 .76rem inherit;cursor:pointer;vertical-align:middle;transition:background .2s,border-color .2s,transform .2s}',
    '.fa-copy:hover,.fa-copy:focus-visible{background:color-mix(in srgb,var(--green,#287A50) 12%,transparent);border-color:var(--green,#287A50);transform:translateY(-1px);outline:none}',
    '.fa-copy svg{width:13px;height:13px}',
    '.fa-toast{position:fixed;left:50%;bottom:calc(26px + env(safe-area-inset-bottom));z-index:2147482600;display:flex;align-items:center;gap:10px;padding:11px 20px 11px 14px;border-radius:99px;background:#0e1a14;color:#eaf6ef;border:1px solid rgba(127,221,176,.45);box-shadow:0 14px 40px rgba(0,0,0,.35);font:600 .9rem system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Bengali",sans-serif;opacity:0;transform:translate(-50%,16px) scale(.96);transition:opacity .3s,transform .4s ' + E + ';pointer-events:none}',
    '.fa-toast.on{opacity:1;transform:translate(-50%,0) scale(1)}',
    '.fa-toast i{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#3FAE7C;color:#fff;font-style:normal;font-size:.8rem;font-weight:800}',
    '.sk{position:relative;overflow:hidden;min-height:132px;padding:22px;border-radius:var(--radius,22px);border:1px solid var(--border,rgba(128,128,128,.25));background:color-mix(in srgb,var(--text,#1c1e1f) 5%,var(--surface,transparent))}',
    '.sk::after{content:\"\";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--text,#1c1e1f) 10%,transparent),transparent);animation:skm 1.5s ease-in-out infinite}',
    '.sk i{display:block;height:12px;border-radius:8px;margin:10px 0;background:color-mix(in srgb,var(--text,#1c1e1f) 11%,transparent)}',
    '.sk i:nth-child(1){width:38%;height:10px}.sk i:nth-child(2){width:78%;height:16px}.sk i:nth-child(3){width:62%}',
    '.sk.sk-pill{min-height:0;height:38px;width:116px;padding:0;display:inline-block;border-radius:99px;margin:0 8px 8px 0}',
    '@keyframes skm{to{transform:translateX(100%)}}',
    '@media(prefers-reduced-motion:reduce){.sk::after{animation:none}}',
    'img.fa-bu{filter:blur(14px);transform:scale(1.04);opacity:.55;transition:filter .8s ' + E + ',transform .8s ' + E + ',opacity .5s}',
    'img.fa-bu.fa-in{filter:none;transform:none;opacity:1}',
    '.timeline.tl-js::before{transform:scaleY(0);transform-origin:top;transition:transform 1.9s cubic-bezier(.4,0,.2,1)}',
    '.timeline.tl-js.tl-in::before{transform:scaleY(1)}',
    '.timeline.tl-js .item::after{transform:scale(0);transition:transform .55s cubic-bezier(.3,1.6,.4,1),box-shadow .6s;transition-delay:calc(var(--k,0) * .3s + .4s)}',
    '.timeline.tl-js.tl-in .item::after{transform:scale(1);box-shadow:0 0 0 6px color-mix(in srgb,var(--green,#287A50) 16%,transparent)}',
    '@media(prefers-reduced-motion:reduce){img.fa-bu{filter:none;transform:none;opacity:1;transition:none}.timeline.tl-js::before,.timeline.tl-js .item::after{transform:none;transition:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- 1. copy email ---------- */
  var toast, toastT;
  function say(msg) {
    if (!toast) { toast = document.createElement('div'); toast.className = 'fa-toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
    toast.textContent = '';
    var i = document.createElement('i'); i.textContent = '\u2713'; toast.appendChild(i); toast.appendChild(document.createTextNode(msg));
    toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove('on'); }, 2200);
  }
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (ok, no) {
      try {
        var ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-999px;top:0';
        document.body.appendChild(ta); ta.select(); var r = document.execCommand('copy'); document.body.removeChild(ta); r ? ok() : no();
      } catch (e) { no(e); }
    });
  }
  var copyBtns = [];
  function label(b) { b.lastChild.textContent = bn() ? '\u0995\u09aa\u09bf' : 'Copy'; b.setAttribute('aria-label', bn() ? '\u0987\u09ae\u09c7\u0987\u09b2 \u0995\u09aa\u09bf \u0995\u09b0\u09c1\u09a8' : 'Copy email address'); }
  function addCopy(link) {
    if (!link || link.getAttribute('data-copy')) return;
    link.setAttribute('data-copy', '1');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'fa-copy';
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg><span></span>';
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var mail = (link.getAttribute('href') || '').replace(/^mailto:/i, '').split('?')[0] || link.textContent.trim();
      copyText(mail).then(function () { say(bn() ? '\u0995\u09aa\u09bf \u09b9\u09af\u09bc\u09c7\u099b\u09c7 \u2713'.replace(' \u2713', '') : 'Copied'); },
                          function () { say(bn() ? '\u0995\u09aa\u09bf \u0995\u09b0\u09be \u09af\u09be\u09af\u09bc\u09a8\u09bf' : 'Could not copy'); });
    });
    link.insertAdjacentElement('afterend', b); copyBtns.push(b); label(b);
  }
  ['mailLink', 'cMail'].forEach(function (id) { addCopy(document.getElementById(id)); });
  new MutationObserver(function () { copyBtns.forEach(label); }).observe(root, { attributes: true, attributeFilter: ['lang'] });

  /* ---------- 2. blur-up images ---------- */
  function prepImg(img) {
    if (img.__fa) return; img.__fa = 1;
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    if (img.complete && img.naturalWidth > 0) return;
    if (img.closest('.logo,.dr-brand,.fx-rip')) return;
    var r = img.getBoundingClientRect();
    if (!img.hasAttribute('loading') && img.getAttribute('fetchpriority') !== 'high' && r.top > innerHeight * 1.2) img.setAttribute('loading', 'lazy');
    img.classList.add('fa-bu');
    function done() { img.classList.add('fa-in'); setTimeout(function () { img.classList.remove('fa-bu', 'fa-in'); }, 1000); }
    img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true });
  }
  [].forEach.call(document.images, prepImg);
  new MutationObserver(function (ms) {
    ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) {
      if (n.nodeType !== 1) return;
      if (n.tagName === 'IMG') prepImg(n); else if (n.querySelectorAll) [].forEach.call(n.querySelectorAll('img'), prepImg);
    }); });
  }).observe(document.body, { childList: true, subtree: true });

  /* ---------- 3. timeline line draws itself ---------- */
  if (!reduce && !lite && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); e.target.classList.add('tl-in'); } });
    }, { threshold: 0.2 });
    function number(t) { [].forEach.call(t.children, function (c, i) { c.style.setProperty('--k', Math.min(i, 10)); }); }
    [].forEach.call(document.querySelectorAll('.timeline'), function (t) {
      t.classList.add('tl-js'); number(t); io.observe(t);
      new MutationObserver(function () { number(t); }).observe(t, { childList: true });
    });
  }
})();
