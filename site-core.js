/* Site core: (1) Lite mode for slow / old phones  (2) Google Analytics 4 with a consent choice.
   Loaded first on every public page (not on the admin page). */
(function () {
  var root = document.documentElement;
  var ls = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
             set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
             del: function (k) { try { localStorage.removeItem(k); } catch (e) {} } };

  /* ============ 1. LITE MODE ============ */
  /* choice "1" = on, "0" = off. With no choice, it switches on by itself for low-memory, 2-core or "data saver" devices. */
  var choice = ls.get('fa-lite');
  var weak = false;
  try {
    var c = navigator.connection || {};
    weak = !!(c.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2));
  } catch (e) {}
  var lite = choice === '1' || (choice === null && weak);
  if (!root.hasAttribute('data-nolite') && lite) root.classList.add('lite');
  window.faLite = { on: root.classList.contains('lite'), auto: choice === null && weak,
    set: function (v) { ls.set('fa-lite', v ? '1' : '0'); location.reload(); } };

  var css = [
    'html.lite *,html.lite *::before,html.lite *::after{animation-duration:.01ms!important;animation-delay:0s!important;animation-iteration-count:1!important;transition-duration:.12s!important;transition-delay:0s!important}',
    'html.lite{scroll-behavior:auto!important}',
    'html.lite body::after,html.lite .fa-spot,html.lite .geo,html.lite #faProg,html.lite .fx-cur,html.lite .fx-dot{display:none!important}',
    'html.lite *{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;text-shadow:none!important}',
    'html.lite .reveal{filter:none!important}',
    'html.lite .aurora .blob{display:none!important}',
    '.fa-lite-btn{font:600 .8rem inherit;color:inherit;background:none;border:1px solid var(--border,rgba(128,128,128,.35));border-radius:99px;padding:5px 12px;cursor:pointer;transition:border-color .2s,color .2s}',
    '.fa-lite-btn:hover,.fa-lite-btn:focus-visible{border-color:var(--green,#3FAE7C);color:var(--green-text,#3FAE7C);outline:none}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; (document.head || root).appendChild(st);

  /* ============ 2. GOOGLE ANALYTICS 4 ============ */
  var GA = 'G-76LYPNY59M';
  window.faTrack = function () {};
  var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.msDoNotTrack === '1' || navigator.globalPrivacyControl === true;
  /* the owner can leave his own visits out: open any page once with #notrack (and #track to count again) */
  if (location.hash === '#notrack') ls.set('fa-notrack', '1');
  if (location.hash === '#track') ls.del('fa-notrack');
  if (dnt || ls.get('fa-notrack') === '1') return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  var consent = ls.get('fa-consent');
  gtag('consent', 'default', { analytics_storage: consent === 'granted' ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 400 });
  gtag('js', new Date());
  gtag('config', GA, { allow_google_signals: false, allow_ad_personalization_signals: false });
  var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
  (document.head || root).appendChild(s);
  window.faTrack = function (name, params) { try { gtag('event', name, params || {}); } catch (e) {} };

  if (consent) return;
  /* small, polite banner (English / Bangla) */
  function lang() { return ls.get('fa-lang') === 'bn' ? 'bn' : 'en'; }
  var T = { en: ['We use anonymous analytics to learn which pages are useful. No ads, no personal data.', 'Accept', 'No thanks'],
            bn: ['কোন পেজ কাজের তা বুঝতে আমরা নামহীন অ্যানালিটিক্স ব্যবহার করি। কোনো বিজ্ঞাপন নেই, ব্যক্তিগত তথ্য নেওয়া হয় না।', 'ঠিক আছে', 'না, ধন্যবাদ'] };
  function build() {
    if (document.getElementById('faConsent')) return;
    var b = document.createElement('div'); b.id = 'faConsent'; b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Analytics');
    var p = document.createElement('p'), a = document.createElement('button'), n = document.createElement('button'), row = document.createElement('div');
    a.type = n.type = 'button'; a.className = 'fc-y'; n.className = 'fc-n'; row.className = 'fc-r';
    row.appendChild(a); row.appendChild(n); b.appendChild(p); b.appendChild(row);
    function paint() { var t = T[lang()]; p.textContent = t[0]; a.textContent = t[1]; n.textContent = t[2]; }
    paint();
    var cs = document.createElement('style');
    cs.textContent = '#faConsent{position:fixed;left:14px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:2147482300;max-width:360px;padding:16px 18px;border-radius:16px;background:var(--surface,#0f1512);color:var(--text,#e8efe9);border:1px solid var(--border,rgba(255,255,255,.14));box-shadow:0 18px 50px rgba(0,0,0,.28);font:.86rem/1.55 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Bengali",sans-serif;animation:fcIn .5s cubic-bezier(.2,.8,.2,1) both}' +
      '#faConsent p{margin:0 0 12px}.fc-r{display:flex;gap:8px;flex-wrap:wrap}' +
      '#faConsent button{font:700 .84rem inherit;padding:8px 16px;border-radius:99px;cursor:pointer;border:1px solid var(--border,rgba(255,255,255,.2));background:none;color:inherit}' +
      '#faConsent .fc-y{background:var(--green,#287A50);border-color:var(--green,#287A50);color:#fff}' +
      '@keyframes fcIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}' +
      '@media(max-width:520px){#faConsent{left:10px;right:10px;max-width:none}}';
    document.head.appendChild(cs);
    function done(v) { ls.set('fa-consent', v ? 'granted' : 'denied'); if (v) gtag('consent', 'update', { analytics_storage: 'granted' }); if (b.parentNode) b.parentNode.removeChild(b); }
    a.addEventListener('click', function () { done(true); });
    n.addEventListener('click', function () { done(false); });
    new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ['lang'] });
    document.body.appendChild(b);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(build, 1500); });
  else setTimeout(build, 1500);
})();
