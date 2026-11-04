/* Nicer menu on every page: a pill that glides under the link you point at (and rests under the current page),
   a smaller bar when you scroll, a softer dropdown, and a mobile drawer with icons and links that slide in. */
(function () {
  if (window.__faMenu) return; window.__faMenu = 1;
  var root = document.documentElement;
  var links = document.getElementById('links');
  var E = 'cubic-bezier(.2,.8,.2,1)';
  var G = 'var(--green,#287A50)', G2 = 'var(--green-2,#3FAE7C)';

  var css = [
    /* ---- bar ---- */
    '.navbox{max-width:1280px}',
    '.links a,.links .dd>button{padding:8px 8px!important}',
    '@media(max-width:1280px){.menu{display:grid!important}.tools{margin-left:auto}.links{display:none!important}}',
    'header nav{transition:height .35s ' + E + ',box-shadow .35s,border-color .35s,background .35s}',
    'html.fa-scrolled header nav{height:52px}',
    'header nav::before{content:"";position:absolute;left:18px;right:18px;top:-1px;height:1px;background:linear-gradient(90deg,transparent,color-mix(in srgb,' + G2 + ' 70%,transparent),transparent);opacity:.55;pointer-events:none}',
    /* ---- gliding pill ---- */
    '.links.has-ind{position:relative}',
    '.links .nav-ind{position:absolute;top:50%;left:0;height:34px;width:0;margin-top:-17px;border-radius:11px;pointer-events:none;opacity:0;background:linear-gradient(135deg,color-mix(in srgb,' + G + ' 17%,transparent),color-mix(in srgb,' + G2 + ' 9%,transparent));border:1px solid color-mix(in srgb,' + G2 + ' 30%,transparent);box-shadow:0 6px 18px color-mix(in srgb,' + G + ' 16%,transparent);transition:left .38s ' + E + ',width .38s ' + E + ',opacity .25s}',
    '.links.has-ind>a,.links.has-ind>.dd>button{position:relative;z-index:1;font-weight:600;background:transparent!important}',
    '.links.has-ind>a:hover,.links.has-ind>.dd>button:hover,.links.has-ind>.dd.open>button{color:var(--green-text,#226B45)}',
    '.links.has-ind>a.active,.links.has-ind>a[aria-current="page"],.links.has-ind>.dd.cur>button{color:var(--green-text,#226B45)}',
    /* ---- dropdown ---- */
    '.ddm{transform:translateY(-8px) scale(.97);transform-origin:top left;transition:opacity .22s,transform .3s ' + E + ',visibility .22s}',
    '.dd.open .ddm{transform:none}',
    '.ddm-in{position:relative;padding:10px;border-radius:18px;background:color-mix(in srgb,var(--surface,#fff) 90%,transparent);-webkit-backdrop-filter:blur(16px) saturate(1.3);backdrop-filter:blur(16px) saturate(1.3);border:1px solid color-mix(in srgb,' + G2 + ' 22%,var(--border,#ddd));box-shadow:0 24px 60px rgba(0,0,0,.22)}',
    '.ddm-in::before{content:"";position:absolute;top:-6px;left:26px;width:12px;height:12px;transform:rotate(45deg);background:inherit;border-left:1px solid color-mix(in srgb,' + G2 + ' 22%,var(--border,#ddd));border-top:1px solid color-mix(in srgb,' + G2 + ' 22%,var(--border,#ddd));border-radius:3px 0 0 0}',
    '.links .ddm a{transition:background .2s,color .2s,transform .25s ' + E + '}',
    '.links .ddm a:hover{transform:translateX(4px)}',
    '.links .ddm a .lg{display:grid;place-items:center;width:30px;height:30px;border-radius:9px;font-size:.7rem;font-weight:800;color:#fff;background:linear-gradient(135deg,' + G + ',' + G2 + ');flex:none}',
    /* ---- tool buttons ---- */
    '.ibtn{transition:transform .25s ' + E + ',border-color .25s,box-shadow .25s}',
    '.ibtn:hover{border-color:color-mix(in srgb,' + G2 + ' 55%,var(--border,#ddd));box-shadow:0 8px 20px color-mix(in srgb,' + G + ' 22%,transparent)}',
    '.ibtn svg{transition:transform .5s ' + E + '}.ibtn:hover svg{transform:rotate(20deg)}',
    '.ibtn.menu:hover svg{transform:none}',
    /* ---- drawer ---- */
    '.drawer{background:linear-gradient(180deg,color-mix(in srgb,' + G + ' 7%,var(--surface,#fff)),var(--surface,#fff) 220px);border-right:1px solid color-mix(in srgb,' + G2 + ' 22%,var(--border,#ddd))}',
    '.drawer .dr-top{padding-bottom:6px}',
    '.drawer a.dl{position:relative;font-weight:600;padding:12px 14px;border-radius:14px;gap:13px;transition:color .2s,background .2s,transform .25s ' + E + '}',
    '.drawer a.dl:hover{transform:translateX(4px)}',
    '.drawer a.dl svg.di{width:20px;height:20px;flex:none;opacity:.8;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}',
    '.drawer a.dl.cur,.drawer a.dl[aria-current="page"],.drawer a.dl.active{color:var(--green-text,#226B45);background:color-mix(in srgb,' + G + ' 13%,transparent)}',
    '.drawer a.dl.cur::before,.drawer a.dl[aria-current="page"]::before,.drawer a.dl.active::before{content:"";position:absolute;left:0;top:22%;bottom:22%;width:3px;border-radius:3px;background:linear-gradient(180deg,' + G2 + ',' + G + ')}',
    '.drawer.open .dr-list>*,.drawer.open .dr-sub,.drawer.open .dr-motto,.drawer.open .dr-h{animation:drIn .5s ' + E + ' both;animation-delay:calc(var(--i,0) * 38ms + 120ms)}',
    '@keyframes drIn{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:none}}',
    '.drawer a.dl.gl-link>span[aria-hidden]{display:none}',
    'html:has(.drawer.open) .fa-wa-pop,html:has(.drawer.open) .fa-wa{opacity:0;pointer-events:none;transition:opacity .2s}',
    '@media(prefers-reduced-motion:reduce){.drawer.open .dr-list>*,.drawer.open .dr-sub,.drawer.open .dr-motto,.drawer.open .dr-h{animation:none}.links .nav-ind{transition:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- mark the current page ---------- */
  if (links && !links.querySelector(':scope > a[aria-current="page"]')) {
    var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (file !== 'index.html') [].forEach.call(links.querySelectorAll(':scope > a[href]'), function (a) {
      var h = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
      if (h && h === file) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---------- gliding pill ---------- */
  if (links) {
    var ind = document.createElement('span'); ind.className = 'nav-ind'; ind.setAttribute('aria-hidden', 'true');
    links.insertBefore(ind, links.firstChild); links.classList.add('has-ind');
    var hovering = false;
    function current() { return links.querySelector(':scope > a.active, :scope > a[aria-current="page"], :scope > .dd.cur > button'); }
    function move(el, snap) {
      if (!el || !el.offsetWidth) { ind.style.opacity = 0; return; }
      if (snap) ind.style.transition = 'none';
      ind.style.width = el.offsetWidth + 'px'; ind.style.left = el.offsetLeft + 'px'; ind.style.opacity = 1;
      if (snap) { void ind.offsetWidth; ind.style.transition = ''; }
    }
    function pick(e) {
      var t = e.target.closest && e.target.closest('a,.dd > button'); if (!t || !links.contains(t)) return null;
      var p = t.parentElement;
      return (p === links || (p && p.classList.contains('dd') && p.parentElement === links)) ? t : null;
    }
    links.addEventListener('pointerover', function (e) { var t = pick(e); if (t) { hovering = true; move(t); } });
    links.addEventListener('focusin', function (e) { var t = pick(e); if (t) move(t); });
    links.addEventListener('pointerleave', function () { hovering = false; move(current()); });
    links.addEventListener('focusout', function () { if (!hovering) move(current()); });
    new MutationObserver(function () { if (!hovering) move(current()); }).observe(links, { attributes: true, attributeFilter: ['class', 'aria-current'], subtree: true });
    addEventListener('resize', function () { if (!hovering) move(current(), true); }, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { move(current(), true); });
    setTimeout(function () { move(current(), true); }, 60); setTimeout(function () { if (!hovering) move(current(), true); }, 900);
  }

  /* ---------- drawer icons + slide-in order ---------- */
  var drawer = document.getElementById('drawer');
  if (drawer) {
    var P = {
      home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
      pen: '<path d="M4 20l4-1 11-11a2.1 2.1 0 0 0-3-3L5 16l-1 4z"/>',
      brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
      ghost: '<path d="M5 21V10a7 7 0 0 1 14 0v11l-3-2-2 2-2-2-2 2-2-2z"/><circle cx="10" cy="11" r="1"/><circle cx="14" cy="11" r="1"/>',
      cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
      bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
      folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
      award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.500-8"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
      org: '<path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6M9 11h.01M15 11h.01"/>',
      chat: '<path d="M21 12a8 8 0 0 1-11.500 7.200L4 20l1-4.500A8 8 0 1 1 21 12z"/>',
      link: '<path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1"/><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/>'
    };
    function icon(a) {
      var h = (a.getAttribute('href') || '').toLowerCase();
      if (a.classList.contains('gl-link')) return 'ghost';
      if (/^mailto:/.test(h)) return 'mail';
      if (/wa\.me|whatsapp/.test(h)) return 'chat';
      if (/^https?:/.test(h)) return 'link';
      if (/about/.test(h)) return 'user';
      if (/blog/.test(h)) return 'pen';
      if (/web-services|#services/.test(h)) return 'bolt';
      if (/education/.test(h)) return 'cap';
      if (/skills/.test(h)) return 'bolt';
      if (/projects/.test(h)) return 'folder';
      if (/achievements/.test(h)) return 'award';
      if (/contact/.test(h)) return 'mail';
      if (/organi[sz]ation|talentverse|nexera|visionary/.test(h)) return 'org';
      if (/home|^#?$|index/.test(h)) return 'home';
      return 'link';
    }
    function decorate() {
      var n = 0;
      [].forEach.call(drawer.querySelectorAll('.dr-sub,.dr-motto,.dr-h,.dr-list > *'), function (el) { el.style.setProperty('--i', n++); });
      [].forEach.call(drawer.querySelectorAll('a.dl'), function (a) {
        if (a.querySelector('svg.di') || a.querySelector('.lg')) return;
        var ns = 'http://www.w3.org/2000/svg', sv = document.createElementNS(ns, 'svg');
        sv.setAttribute('class', 'di'); sv.setAttribute('viewBox', '0 0 24 24'); sv.setAttribute('aria-hidden', 'true'); sv.innerHTML = P[icon(a)] || P.link;
        a.insertBefore(sv, a.firstChild);
        var path = location.pathname.split('/').pop() || 'index.html', href = (a.getAttribute('href') || '').split('#')[0];
        if (href && href === path) a.classList.add('cur');
      });
    }
    decorate();
    new MutationObserver(function (ms) { var go = false; ms.forEach(function (m) { if (m.addedNodes.length) go = true; }); if (go) { clearTimeout(decorate.t); decorate.t = setTimeout(decorate, 60); } }).observe(drawer, { childList: true, subtree: true });
  }
})();
