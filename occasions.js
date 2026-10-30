/* Occasion themes: a greeting banner and a light animation on special days.
   Birthday, Eid, Jummah (Friday), New Year ... the owner decides in Admin > Occasions which day gets what.
   Dates are read in Bangladesh time. This file is also read by admin.html (only for the ready-made list). */
(function () {
  'use strict';

  /* ---------- ready-made list (used until the admin saves his own) ---------- */
  var DEF = [
    { name: 'My birthday', on: '0', rule: 'yearly', month: '', day: '', days: '1', weekday: '5', from: '', to: '', effect: 'birthday', emoji: '🎂',
      title: 'It is my birthday today!', titleBn: 'আজ আমার জন্মদিন!',
      text: 'Thank you for visiting, and for every bit of support and prayer.', textBn: 'ওয়েবসাইটে আসার জন্য আর সব সমর্থন ও দোয়ার জন্য ধন্যবাদ।', arabic: '' },
    { name: 'Eid ul-Fitr (check the moon, then fix the dates)', on: '', rule: 'range', month: '', day: '', days: '1', weekday: '5', from: '2027-03-10', to: '2027-03-12', effect: 'islamic', emoji: '🌙',
      title: 'Eid Mubarak!', titleBn: 'ঈদ মোবারক!',
      text: 'Wishing you and your family a joyful Eid. May this day bring peace, happiness and blessings.', textBn: 'আপনাকে ও আপনার পরিবারকে ঈদের আনন্দময় শুভেচ্ছা। এই দিন বয়ে আনুক শান্তি, সুখ আর বরকত।', arabic: 'عِيدٌ مُبَارَكٌ' },
    { name: 'Eid ul-Adha (check the moon, then fix the dates)', on: '', rule: 'range', month: '', day: '', days: '1', weekday: '5', from: '2027-05-17', to: '2027-05-19', effect: 'islamic', emoji: '🕌',
      title: 'Eid Mubarak!', titleBn: 'ঈদ মোবারক!',
      text: 'May Allah accept your sacrifice and fill your home with joy and peace.', textBn: 'আল্লাহ আপনার কুরবানি কবুল করুন আর আপনার ঘর আনন্দ ও শান্তিতে ভরে উঠুক।', arabic: 'عِيدٌ مُبَارَكٌ' },
    { name: 'New Year', on: '', rule: 'yearly', month: '1', day: '1', days: '1', weekday: '5', from: '', to: '', effect: 'newyear', emoji: '🎉',
      title: 'Happy New Year {year}!', titleBn: 'শুভ নতুন বছর {year}!',
      text: 'Wishing you a year full of good health, success and new opportunities.', textBn: 'নতুন বছর আপনার জন্য সুস্বাস্থ্য, সাফল্য আর নতুন সুযোগে ভরে উঠুক।', arabic: '' },
    { name: 'Friday (Jummah)', on: '', rule: 'weekly', month: '', day: '', days: '1', weekday: '5', from: '', to: '', effect: 'jummah', emoji: '🕌',
      title: 'Jummah Mubarak', titleBn: 'জুমার মোবারক',
      text: 'Wishing you a blessed Friday.', textBn: 'আপনার জুমার দিন বরকতময় হোক।', arabic: 'جُمُعَةٌ مُبَارَكَةٌ' }
  ];
  window.FA_OCC_DEF = DEF;
  if (/admin\.html$/.test(location.pathname)) return;

  var root = document.documentElement;
  var reduce = false; try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var small = innerWidth < 640;

  /* ---------- today, in Bangladesh time ---------- */
  function today() {
    var p = {};
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    } catch (e) { var n = new Date(); p = { year: n.getFullYear(), month: n.getMonth() + 1, day: n.getDate(), weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][n.getDay()] }; }
    var wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday];
    var y = +p.year, m = +p.month, d = +p.day, pad = function (v) { return (v < 10 ? '0' : '') + v; };
    return { y: y, m: m, d: d, wd: wd, iso: y + '-' + pad(m) + '-' + pad(d) };
  }
  function matches(o, t) {
    if (!o || o.on === '0') return false;
    if (o.rule === 'weekly') return String(o.weekday) !== '' && +o.weekday === t.wd;
    if (o.rule === 'range') { if (!o.from) return false; return t.iso >= o.from && t.iso <= (o.to || o.from); }
    var m = +o.month, d = +o.day, len = Math.max(1, +o.days || 1);
    if (!(m >= 1 && m <= 12 && d >= 1 && d <= 31)) return false;
    var now = Date.UTC(t.y, t.m - 1, t.d);
    for (var yr = t.y; yr >= t.y - 1; yr--) { var diff = (now - Date.UTC(yr, m - 1, d)) / 864e5; if (diff >= 0 && diff < len) return true; }
    return false;
  }

  /* ---------- which list, which occasion ---------- */
  function readList() {
    try { var a = JSON.parse(localStorage.getItem('fa-occ') || 'null'); if (Array.isArray(a) && a.length) return a; } catch (e) {}
    return DEF;
  }
  var forcedIdx = (function () { try { var v = new URLSearchParams(location.search).get('occ'); return v !== null && v !== '' && !isNaN(+v) ? +v : -1; } catch (e) { return -1; } })();
  var forcedList = null;
  function current() {
    var list = forcedIdx >= 0 ? (forcedList || (forcedList = readList())) : readList(), t = today();
    if (forcedIdx >= 0) return list[forcedIdx] ? { o: list[forcedIdx], t: t, id: 'f' + forcedIdx } : null;
    for (var i = 0; i < list.length; i++) if (matches(list[i], t)) return { o: list[i], t: t, id: i + '|' + t.iso };
    return null;
  }

  /* ---------- text ---------- */
  var BN = '০১২৩৪৫৬৭৮৯';
  function bn() { return root.getAttribute('lang') === 'bn'; }
  function pick(o, k) { var b = String(o[k + 'Bn'] || '').trim(), e = String(o[k] || '').trim(); return bn() ? (b || e) : (e || b); }
  function fill(s, t) {
    var yr = t.m >= 7 ? t.y + 1 : t.y, ys = String(yr);
    if (bn()) ys = ys.replace(/\d/g, function (d) { return BN[+d]; });
    return String(s).replace(/\{year\}/g, ys);
  }

  /* ---------- styles ---------- */
  var cssDone = false;
  function css() {
    if (cssDone) return; cssDone = true;
    var s = document.createElement('style'); s.id = 'faOccCss';
    s.textContent = [
      '.focc{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 84px);z-index:75;width:min(92vw,500px);transform:translate(-50%,-14px);opacity:0;display:flex;gap:14px;align-items:center;padding:14px 44px 14px 14px;border-radius:20px;background:var(--surface,#fff);color:var(--text,#1C1E1F);border:1px solid color-mix(in srgb,var(--oc,#287A50) 45%,var(--border,#E6E3DC));box-shadow:0 18px 50px rgba(0,0,0,.22);transition:opacity .5s,transform .6s cubic-bezier(.2,.8,.2,1)}',
      '.focc.in{opacity:1;transform:translate(-50%,0)}',
      '.focc .oe{flex:none;width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:1.7rem;background:color-mix(in srgb,var(--oc,#287A50) 16%,transparent);box-shadow:0 0 0 1px color-mix(in srgb,var(--oc,#287A50) 35%,transparent)}',
      '.focc b{display:block;font-family:"Plus Jakarta Sans",system-ui,sans-serif;font-size:1.05rem;line-height:1.25;margin-bottom:2px}',
      '.focc span.ot{display:block;font-size:.88rem;line-height:1.45;color:var(--muted,#5A615D)}',
      '.focc i.oa{display:block;margin-top:4px;font-style:normal;font-family:"Amiri","Noto Naskh Arabic","Scheherazade New",serif;font-size:1.25rem;line-height:1.5;color:var(--oc,#287A50)}',
      '.focc button{position:absolute;right:8px;top:8px;width:32px;height:32px;border:0;border-radius:9px;background:transparent;color:var(--muted,#5A615D);font-size:1.25rem;line-height:1;cursor:pointer}',
      '.focc button:hover{background:color-mix(in srgb,var(--text,#000) 8%,transparent)}',
      '#faFx{position:fixed;inset:0;width:100%;height:100%;z-index:900;pointer-events:none}',
      '.fx-bal,.fx-star,.fx-lan{position:fixed;pointer-events:none;will-change:transform,opacity}',
      '.fx-bal{bottom:-70px;z-index:900;animation:faBal var(--t,12s) linear var(--d,0s) 2 both}',
      '@keyframes faBal{0%{transform:translate3d(0,0,0) rotate(-4deg);opacity:0}8%{opacity:1}50%{transform:translate3d(var(--sx,20px),-55vh,0) rotate(5deg)}100%{transform:translate3d(calc(var(--sx,20px)*-1),-120vh,0) rotate(-4deg);opacity:1}}',
      '.fx-star{z-index:54;bottom:-20px;color:var(--sc,#C9A227);opacity:0;animation:faStar var(--t,14s) linear var(--d,0s) infinite}',
      '@keyframes faStar{0%{transform:translate3d(0,0,0) scale(.6);opacity:0}15%{opacity:.85}85%{opacity:.6}100%{transform:translate3d(var(--sx,10px),-105vh,0) scale(1.1);opacity:0}}',
      '.fx-lan{top:0;z-index:55;transform-origin:50% 0;animation:faSwing var(--t,5s) ease-in-out var(--d,0s) infinite alternate}',
      '@keyframes faSwing{from{transform:rotate(-5deg)}to{transform:rotate(5deg)}}',
      '.fx-lan svg{display:block;overflow:visible;filter:drop-shadow(0 0 14px rgba(224,184,74,.55))}',
      '@media(max-width:640px){.focc{top:calc(env(safe-area-inset-top,0px) + 78px)}}',
      '@media(prefers-reduced-motion:reduce){.focc{transition:none}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ---------- running state ---------- */
  var run = null; /* { id, timers:[], raf, nodes:[], canvas, parts, sparks } */
  function stop() {
    if (!run) return;
    run.timers.forEach(function (t) { clearTimeout(t); clearInterval(t); });
    if (run.raf) cancelAnimationFrame(run.raf);
    run.nodes.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    if (run.resize) removeEventListener('resize', run.resize);
    run = null;
  }
  function later(fn, ms) { var t = setTimeout(fn, ms); run.timers.push(t); return t; }
  function add(el) { document.body.appendChild(el); run.nodes.push(el); return el; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* canvas: confetti and fireworks share one loop */
  function ensureCanvas() {
    if (run.canvas) return;
    var cv = document.createElement('canvas'); cv.id = 'faFx'; add(cv);
    var cx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 1.5), W = 0, H = 0;
    function size() { W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); run.resize = size; addEventListener('resize', size);
    run.canvas = cv; run.parts = []; run.sparks = [];
    var last = performance.now();
    (function frame(now) {
      if (!run || run.canvas !== cv) return;
      run.raf = requestAnimationFrame(frame);
      var dt = Math.min(2.2, (now - last) / 16.7); last = now;
      if (document.hidden) return;
      cx.clearRect(0, 0, W, H);
      var P = run.parts, i, p;
      for (i = P.length - 1; i >= 0; i--) {
        p = P[i]; p.vy += .11 * dt; p.vx *= .995; p.x += p.vx * dt + Math.sin(p.w += .06 * dt) * .6; p.y += p.vy * dt; p.rot += p.vr * dt;
        if (p.y > H + 24) { P.splice(i, 1); continue; }
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
        if (p.round) { cx.beginPath(); cx.arc(0, 0, p.s * .5, 0, 6.3); cx.fill(); } else cx.fillRect(-p.s / 2, -p.s * .3, p.s, p.s * .6);
        cx.restore();
      }
      var S = run.sparks;
      for (i = S.length - 1; i >= 0; i--) {
        p = S[i]; p.vy += .035 * dt; p.vx *= .985; p.vy *= .985; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
        if (p.life <= 0) { S.splice(i, 1); continue; }
        var a = Math.min(1, p.life / 28);
        cx.globalAlpha = a; cx.strokeStyle = p.c; cx.lineWidth = 2; cx.lineCap = 'round';
        cx.beginPath(); cx.moveTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2); cx.lineTo(p.x, p.y); cx.stroke();
      }
      cx.globalAlpha = 1;
    })(last);
  }
  var COLS = ['#287A50', '#3FAE7C', '#7FDDB0', '#E0B84A', '#F2994A', '#E85D9A', '#56A8F5', '#FFFFFF'];
  function confetti(n, fromTop) {
    ensureCanvas();
    for (var i = 0; i < n; i++) run.parts.push({ x: rnd(0, innerWidth), y: fromTop ? rnd(-40, -4) : rnd(-innerHeight * .2, innerHeight * .4), vx: rnd(-1.4, 1.4), vy: rnd(1.2, 3.4), s: rnd(6, 11), c: COLS[(Math.random() * COLS.length) | 0], rot: rnd(0, 6.3), vr: rnd(-.2, .2), w: rnd(0, 6), round: Math.random() < .3 });
  }
  function burst() {
    ensureCanvas();
    var x = rnd(innerWidth * .12, innerWidth * .88), y = rnd(innerHeight * .12, innerHeight * .5), n = small ? 34 : 56;
    var cols = [['#FFD36B', '#FF9F43'], ['#7FDDB0', '#3FAE7C'], ['#FF7AA2', '#FF4D6D'], ['#9AD0FF', '#5AA9FF'], ['#FFFFFF', '#FFE9A8']][(Math.random() * 5) | 0];
    for (var i = 0; i < n; i++) { var a = (Math.PI * 2 * i) / n + rnd(-.05, .05), sp = rnd(1.4, 4.4); run.sparks.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rnd(46, 82), c: cols[i % 2] }); }
  }

  /* DOM effects */
  function balloons() {
    var n = small ? 7 : 11;
    for (var i = 0; i < n; i++) {
      var b = document.createElement('div'); b.className = 'fx-bal'; b.textContent = '🎈';
      b.style.cssText = 'left:' + rnd(3, 94).toFixed(1) + 'vw;font-size:' + rnd(28, 50).toFixed(0) + 'px;--t:' + rnd(9, 15).toFixed(1) + 's;--d:' + rnd(0, 7).toFixed(1) + 's;--sx:' + rnd(-30, 30).toFixed(0) + 'px;filter:hue-rotate(' + ((Math.random() * 340) | 0) + 'deg)';
      add(b);
    }
  }
  function stars(n, color) {
    for (var i = 0; i < n; i++) {
      var s = document.createElement('div'); s.className = 'fx-star'; s.textContent = '✦';
      s.style.cssText = 'left:' + rnd(2, 97).toFixed(1) + 'vw;font-size:' + rnd(10, 22).toFixed(0) + 'px;--t:' + rnd(11, 20).toFixed(1) + 's;--d:' + rnd(0, 10).toFixed(1) + 's;--sx:' + rnd(-24, 24).toFixed(0) + 'px;--sc:' + (color || (Math.random() < .5 ? '#C9A227' : '#3FAE7C'));
      add(s);
    }
  }
  function lantern(x, string, size, delay) {
    var d = document.createElement('div'); d.className = 'fx-lan'; d.style.cssText = 'left:' + x + 'vw;--t:' + rnd(4, 6.5).toFixed(1) + 's;--d:-' + delay + 's';
    d.innerHTML = '<svg width="' + size + '" height="' + (string + size * 1.5) + '" viewBox="0 0 40 ' + ((string + size * 1.5) * 40 / size).toFixed(1) + '" aria-hidden="true">' +
      '<defs><radialGradient id="lg' + x + '" cx="50%" cy="55%" r="60%"><stop offset="0" stop-color="#FFE9A8"/><stop offset="1" stop-color="#E0A92E"/></radialGradient></defs>' +
      '<line x1="20" y1="0" x2="20" y2="' + (string * 40 / size).toFixed(1) + '" stroke="#C9A227" stroke-width="1.4"/>' +
      '<g transform="translate(0,' + (string * 40 / size).toFixed(1) + ')"><path d="M14 0h12l2 5H12z" fill="#8A6A12"/><path d="M12 5h16c4 6 4 20 0 28H12c-4-8-4-22 0-28z" fill="url(#lg' + x + ')" stroke="#B8891C" stroke-width="1"/>' +
      '<path d="M20 6v26M14 8c-2 8-2 16 0 24M26 8c2 8 2 16 0 24" stroke="#B8891C" stroke-width=".8" fill="none" opacity=".7"/><path d="M13 33h14l-2 5H15z" fill="#8A6A12"/></g></svg>';
    add(d);
  }
  function lanterns() {
    var xs = small ? [4, 88] : [3, 11, 86, 94];
    xs.forEach(function (x, i) { lantern(x, 40 + (i % 2) * 34, small ? 30 : 38, i * 1.3); });
  }

  /* ---------- the greeting card ---------- */
  var COLOR = { birthday: '#E85D9A', newyear: '#E0A92E', islamic: '#C9A227', jummah: '#287A50', celebrate: '#287A50', banner: '#287A50' };
  var banner = null;
  function paintBanner(cur) {
    if (!banner || !cur) return;
    var o = cur.o;
    banner.querySelector('.oe').textContent = o.emoji || '✨';
    banner.querySelector('b').textContent = fill(pick(o, 'title'), cur.t);
    banner.querySelector('.ot').textContent = fill(pick(o, 'text'), cur.t);
    var ar = banner.querySelector('.oa'); ar.textContent = o.arabic || ''; ar.hidden = !o.arabic;
  }
  function showBanner(cur) {
    css();
    banner = document.createElement('div'); banner.className = 'focc'; banner.setAttribute('role', 'status');
    banner.style.setProperty('--oc', COLOR[cur.o.effect] || '#287A50');
    banner.innerHTML = '<div class="oe" aria-hidden="true"></div><div><b></b><span class="ot"></span><i class="oa" lang="ar" dir="rtl" data-no-i18n></i></div><button type="button" aria-label="Close">×</button>';
    banner.setAttribute('data-no-i18n', '');
    paintBanner(cur);
    banner.querySelector('button').addEventListener('click', function () { closeBanner(); });
    add(banner);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (banner) banner.classList.add('in'); }); });
    later(function () { closeBanner(); }, 15000);
  }
  function closeBanner() {
    if (!banner) return; var b = banner; banner = null; b.classList.remove('in');
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 700);
  }

  /* ---------- start ---------- */
  function seen(cur) { try { return localStorage.getItem('fa-occ-seen') === cur.id; } catch (e) { return false; } }
  function mark(cur) { try { localStorage.setItem('fa-occ-seen', cur.id); } catch (e) {} }
  function start(cur) {
    css(); run = { id: cur.id, timers: [], raf: 0, nodes: [], canvas: null };
    var fx = cur.o.effect, showMsg = fx !== 'none' && (forcedIdx >= 0 || !seen(cur));
    if (showMsg) { showBanner(cur); mark(cur); }
    if (reduce) return;
    if (fx === 'birthday') {
      confetti(small ? 70 : 130, true); balloons();
      var k = 0; run.timers.push(setInterval(function () { if (++k > 12) return; confetti(small ? 8 : 16, true); }, 1500));
      later(function () { if (run && run.canvas && !run.parts.length) { run.canvas.remove(); } }, 26000);
    } else if (fx === 'celebrate') {
      confetti(small ? 70 : 130, true);
      var c = 0; run.timers.push(setInterval(function () { if (++c > 8) return; confetti(small ? 8 : 16, true); }, 1600));
    } else if (fx === 'newyear') {
      burst(); later(burst, 450); later(burst, 1000);
      var f = 0; run.timers.push(setInterval(function () { if (++f > 16) return; burst(); if (f % 3 === 0) confetti(small ? 12 : 24, true); }, 1100));
    } else if (fx === 'islamic') {
      lanterns(); stars(small ? 9 : 16);
    } else if (fx === 'jummah') {
      stars(small ? 6 : 10);
    }
  }
  function evaluate() {
    var cur = current();
    if (!cur) { stop(); closeBanner(); return; }
    if (run && run.id === cur.id) { paintBanner(cur); return; }
    stop(); closeBanner(); begin(cur);
  }
  var pending = '';
  function begin(cur) {
    if (pending === cur.id) return; pending = cur.id;
    /* wait until the loading screen has gone */
    var tries = 0;
    (function wait() {
      var busy = root.classList.contains('intro-on') || root.classList.contains('plo-on');
      if (busy && tries++ < 60) { setTimeout(wait, 200); return; }
      setTimeout(function () { pending = ''; var now = current(); if (now && now.id === cur.id && !run) start(now); }, 350);
    })();
  }
  window.faOcc = evaluate;

  /* language switch: repaint the card */
  new MutationObserver(function () { var cur = current(); if (cur && run && run.id === cur.id) paintBanner(cur); })
    .observe(root, { attributes: true, attributeFilter: ['lang'] });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) evaluate(); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', evaluate); else evaluate();
})();
