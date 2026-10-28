/* 3D layer for the whole site (pure CSS + a little JS, no libraries):
   - slowly turning glass cubes floating behind every hero (they lean toward the mouse)
   - glowing orbit rings around the profile photo
   - cards, rules and blog cards tilt in 3D under the mouse
   - 3D "press" buttons, glossy 3D timeline dots, coin-style logo in intro / loader
   Skipped for "Reduce motion" and Lite mode (only the static looks stay). */
(function () {
  if (window.__fa3d) return; window.__fa3d = 1;
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lite = root.classList.contains('lite');
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var G = 'var(--green,var(--g,#287A50))', G2 = 'var(--green-2,var(--g2,#3FAE7C))';

  var css = [
    /* ---- scene: glass cubes ---- */
    '.scene3d{position:absolute;inset:0;pointer-events:none;z-index:-1;perspective:1100px;overflow:hidden}',
    '.scene3d .rig{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .5s ease-out}',
    '.scene3d .cw{position:absolute;width:var(--s);height:var(--s);animation:cwFloat var(--f,9s) ease-in-out infinite alternate;animation-delay:var(--d,0s)}',
    '.scene3d .cube{position:absolute;inset:0;transform-style:preserve-3d;animation:cubeSpin var(--t,24s) linear infinite}',
    '.scene3d .cube i{position:absolute;inset:0;border:1px solid color-mix(in srgb,' + G + ' 55%,transparent);background:linear-gradient(135deg,color-mix(in srgb,' + G2 + ' 24%,transparent),color-mix(in srgb,' + G + ' 4%,transparent));box-shadow:inset 0 0 24px color-mix(in srgb,' + G2 + ' 22%,transparent)}',
    '.scene3d .cube i:nth-child(1){transform:translateZ(calc(var(--s) / 2))}',
    '.scene3d .cube i:nth-child(2){transform:rotateY(180deg) translateZ(calc(var(--s) / 2))}',
    '.scene3d .cube i:nth-child(3){transform:rotateY(90deg) translateZ(calc(var(--s) / 2))}',
    '.scene3d .cube i:nth-child(4){transform:rotateY(-90deg) translateZ(calc(var(--s) / 2))}',
    '.scene3d .cube i:nth-child(5){transform:rotateX(90deg) translateZ(calc(var(--s) / 2))}',
    '.scene3d .cube i:nth-child(6){transform:rotateX(-90deg) translateZ(calc(var(--s) / 2))}',
    '@keyframes cubeSpin{from{transform:rotateX(-22deg) rotateY(0)}to{transform:rotateX(338deg) rotateY(360deg)}}',
    '@keyframes cwFloat{from{transform:translate3d(0,0,0)}to{transform:translate3d(16px,-30px,50px)}}',
    ':root[data-theme="dark"] .scene3d{opacity:1.0}',
    '@media(max-width:700px){.scene3d .cw.c3{display:none}.scene3d{opacity:.75}}',
    /* ---- orbit rings around the photo ---- */
    '.photo .orbit{position:absolute;inset:-12% -20%;transform-style:preserve-3d;pointer-events:none;translate:0 0 -34px}',
    '.photo .orbit i{position:absolute;inset:0;border-radius:50%;border:1.5px dashed color-mix(in srgb,' + G2 + ' 60%,transparent);animation:orbSpin var(--t,16s) linear infinite}',
    '.photo .orbit i::after{content:"";position:absolute;left:50%;top:-6px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,' + G2 + ' 55%,' + G + ');box-shadow:0 0 16px ' + G2 + '}',
    '.photo .orbit i.o2{inset:8% -4%;--t:22s;animation-direction:reverse;border-style:solid;border-width:1px;border-color:color-mix(in srgb,' + G + ' 40%,transparent)}',
    '@keyframes orbSpin{from{transform:rotateX(74deg) rotateZ(0)}to{transform:rotateX(74deg) rotateZ(360deg)}}',
    '.photo .orbit i.o2{animation-name:orbSpin2}@keyframes orbSpin2{from{transform:rotateX(62deg) rotateY(18deg) rotateZ(0)}to{transform:rotateX(62deg) rotateY(18deg) rotateZ(-360deg)}}',
    /* ---- 3D press buttons ---- */
    'html .btn.primary{box-shadow:0 1px 0 rgba(255,255,255,.28) inset,0 5px 0 var(--green-hover,#1f6340),0 16px 28px color-mix(in srgb,' + G + ' 34%,transparent);transform:translateY(-2px);transition:transform .14s,box-shadow .14s,background .2s}',
    'html .btn.primary:hover{transform:translateY(-3px);box-shadow:0 1px 0 rgba(255,255,255,.3) inset,0 7px 0 var(--green-hover,#1f6340),0 20px 34px color-mix(in srgb,' + G + ' 40%,transparent)}',
    'html .btn.primary:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(255,255,255,.2) inset,0 1px 0 var(--green-hover,#1f6340),0 4px 10px color-mix(in srgb,' + G + ' 30%,transparent)}',
    /* ---- glossy 3D timeline dots ---- */
    '.timeline .item::after{border:0;width:18px;height:18px;left:-27px;background:radial-gradient(circle at 32% 28%,#e3fff0,' + G2 + ' 40%,' + G + ' 100%);box-shadow:0 4px 9px color-mix(in srgb,' + G + ' 55%,transparent),inset -2px -3px 5px rgba(0,0,0,.28)}',
    /* ---- org badges flip like coins ---- */
    '.card:hover .mono{transform:perspective(300px) rotateY(360deg);transition:transform .9s cubic-bezier(.2,.8,.2,1)}',
    /* ---- coin-style logo in the intro / loader ---- */
    '.in-mark{animation:coin3d 6.5s ease-in-out infinite}',
    '@keyframes coin3d{0%,100%{transform:perspective(620px) rotateY(-26deg) rotateX(7deg)}50%{transform:perspective(620px) rotateY(26deg) rotateX(-7deg)}}',
    '.in-mark{box-shadow:1px 1px 0 #1d5a3b,2px 2px 0 #1d5a3b,3px 3px 0 #1d5a3b,4px 4px 0 #1b5236,5px 5px 0 #1b5236,0 22px 60px rgba(40,122,80,.5)}',
    '@media(prefers-reduced-motion:reduce){.in-mark{animation:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  if (reduce || lite) return;

  /* ---------- cubes behind each hero ---------- */
  var rigs = [];
  function cubes(host, defs) {
    var sc = document.createElement('div'); sc.className = 'scene3d'; sc.setAttribute('aria-hidden', 'true');
    var rig = document.createElement('div'); rig.className = 'rig'; sc.appendChild(rig);
    defs.forEach(function (d, k) {
      var w = document.createElement('div'); w.className = 'cw c' + (k + 1);
      w.style.cssText = '--s:' + d[0] + 'px;left:' + d[1] + ';top:' + d[2] + ';--f:' + d[3] + 's;--d:-' + (k * 3) + 's';
      var c = document.createElement('div'); c.className = 'cube'; c.style.setProperty('--t', d[4] + 's');
      for (var i = 0; i < 6; i++) c.appendChild(document.createElement('i'));
      w.appendChild(c); rig.appendChild(w);
    });
    host.appendChild(sc); rigs.push(rig);
  }
  [].forEach.call(document.querySelectorAll('.hero'), function (h) {
    cubes(h, [[96, '3%', '64%', 10, 26], [54, '47%', '8%', 8, 19], [128, '90%', '66%', 12, 32]]);
  });
  [].forEach.call(document.querySelectorAll('.ohero'), function (h) {
    cubes(h, [[70, '86%', '26%', 9, 24], [42, '70%', '68%', 7, 18]]);
  });

  /* ---------- orbit rings around the photo ---------- */
  var ph = document.querySelector('.photo');
  if (ph) { var ob = document.createElement('div'); ob.className = 'orbit'; ob.setAttribute('aria-hidden', 'true'); ob.innerHTML = '<i></i><i class="o2"></i>'; ph.insertBefore(ob, ph.firstChild); }

  if (!fine) return;

  /* ---------- scene leans toward the mouse ---------- */
  var mx = 0, my = 0, rafS = 0;
  addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5;
    if (!rafS) rafS = requestAnimationFrame(function () {
      rafS = 0; var t = 'rotateX(' + (-my * 9).toFixed(2) + 'deg) rotateY(' + (mx * 13).toFixed(2) + 'deg)';
      rigs.forEach(function (r) { r.style.transform = t; });
    });
  }, { passive: true });

  /* ---------- 3D tilt for cards ---------- */
  var SEL = 'main .card, main .rule, main .bl-card';
  var cur = null, rafT = 0, last = null;
  function reset(c) { if (!c) return; c.style.transition = 'transform .55s cubic-bezier(.2,.8,.2,1)'; c.style.transform = ''; setTimeout(function () { if (c !== cur) c.style.transition = ''; }, 600); }
  function ok(c) { return c && !c.classList.contains('fx') && !c.classList.contains('sk') && !c.querySelector('input,textarea,select') && c.offsetWidth < innerWidth * .7; }
  addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    var c = e.target.closest ? e.target.closest(SEL) : null;
    if (c !== cur) { reset(cur); cur = c; }
    if (!ok(c)) return; last = e;
    if (!rafT) rafT = requestAnimationFrame(function () {
      rafT = 0; if (!cur || !last) return;
      var r = cur.getBoundingClientRect(), px = (last.clientX - r.left) / r.width - .5, py = (last.clientY - r.top) / r.height - .5;
      cur.style.transition = 'transform .12s ease-out';
      cur.style.transform = 'perspective(900px) rotateX(' + (-py * 9).toFixed(2) + 'deg) rotateY(' + (px * 11).toFixed(2) + 'deg) translateY(-4px) scale(1.012)';
    });
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { reset(cur); cur = null; });
  addEventListener('scroll', function () { if (cur) { reset(cur); cur = null; } }, { passive: true });
})();
