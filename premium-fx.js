/* Premium motion layer for every page. Pure add-on: nothing here changes content or layout.
   - scroll progress bar            - cards / chips / footer columns rise in one after another
   - section underline draws in     - soft fade between pages
   - cursor ring (mouse only)       - button ripple
   - smooth light/dark switch
   Everything is skipped for visitors who asked their device for reduced motion. */
(function () {
  if (window.__faPremium) return; window.__faPremium = 1;
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var E = 'cubic-bezier(.2,.8,.2,1)';

  var css = [
    '#faProg{position:fixed;left:0;top:0;height:3px;width:100%;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,var(--green,#287A50),var(--green-2,#3FAE7C),#7FDDB0);box-shadow:0 0 12px rgba(63,174,124,.55);z-index:2147482000;pointer-events:none;will-change:transform}',
    '.fx{opacity:0;transform:translateY(28px) scale(.965);filter:blur(6px);transition:opacity .85s ' + E + ',transform .95s ' + E + ',filter .8s ' + E + ';transition-delay:var(--fd,0s);will-change:opacity,transform}',
    '.fx.fx-in{opacity:1;transform:none;filter:none}',
    '.sh h2.fx-h::after{transform:scaleX(0);transform-origin:left center;transition:transform 1.05s .25s ' + E + '}',
    '.sh h2.fx-h.fx-in::after{transform:scaleX(1)}',
    'html.fa-leave{opacity:0;transition:opacity .22s ease}',
    'html.fa-theming *,html.fa-theming *::before,html.fa-theming *::after{transition:background-color .45s ease,color .35s ease,border-color .45s ease,box-shadow .45s ease!important}',
    '.fx-rip{position:absolute;border-radius:50%;background:currentColor;opacity:.2;transform:scale(0);pointer-events:none;animation:fxRip .65s ease-out forwards}',
    '@keyframes fxRip{to{transform:scale(1);opacity:0}}',
    '.fx-cur,.fx-dot{position:fixed;left:0;top:0;pointer-events:none;border-radius:50%;opacity:0;z-index:2147482500}',
    '.fx-cur{width:36px;height:36px;margin:-18px 0 0 -18px;border:1.5px solid var(--green,#287A50);transition:opacity .3s,width .28s ' + E + ',height .28s ' + E + ',margin .28s ' + E + ',background .28s,border-color .28s}',
    '.fx-dot{width:6px;height:6px;margin:-3px 0 0 -3px;background:var(--green,#287A50);transition:opacity .3s}',
    '.fx-cur.on{opacity:.55}.fx-dot.on{opacity:.9}',
    '.fx-cur.hot{width:62px;height:62px;margin:-31px 0 0 -31px;opacity:.85;background:color-mix(in srgb,var(--green,#287A50) 13%,transparent)}',
    '.logo{gap:10px}',
    '.logo b{font-size:.7rem;letter-spacing:.02em;position:relative;overflow:hidden;box-shadow:0 4px 14px rgba(40,122,80,.35),inset 0 1px 0 rgba(255,255,255,.28);transition:transform .45s ' + E + ',box-shadow .45s}',
    '.logo b::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-18deg);animation:lgShine 5.5s ease-in-out infinite}',
    '.logo:hover b{transform:rotate(-8deg) scale(1.1);box-shadow:0 8px 22px rgba(63,174,124,.55),inset 0 1px 0 rgba(255,255,255,.35)}',
    '.logo,.logo .lt{white-space:nowrap}',
    '.logo .lt{font-weight:800;letter-spacing:.17em;margin-right:-.17em;background:linear-gradient(100deg,var(--text,#161a18) 0%,var(--text,#161a18) 38%,var(--green-2,#3FAE7C) 50%,var(--text,#161a18) 62%,var(--text,#161a18) 100%);background-size:260% 100%;background-position:100% 0;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:ltSweep 6s ease-in-out infinite;transition:letter-spacing .5s ' + E + '}',
    '.logo:hover .lt{letter-spacing:.23em}',
    '.logo .lt i{font-style:normal;-webkit-text-fill-color:var(--green,#287A50);color:var(--green,#287A50);display:inline-block;margin-left:.04em;text-shadow:0 0 10px rgba(63,174,124,.7);animation:ltDot 2.4s ease-in-out infinite}',
    '@keyframes ltSweep{0%,25%{background-position:100% 0}60%,100%{background-position:0 0}}',
    '@keyframes lgShine{0%,60%{left:-60%}85%,100%{left:130%}}',
    '@keyframes ltDot{50%{opacity:.35;transform:scale(1.35)}}',
    '@media(prefers-reduced-motion:reduce){.logo b::after,.logo .lt,.logo .lt i{animation:none}.logo .lt{background-position:100% 0}}',
    '@media(max-width:1200px){.links{gap:0}.links a{padding:8px 7px;font-size:.78rem}.logo .lt{letter-spacing:.1em;margin-right:-.1em}.logo:hover .lt{letter-spacing:.14em}}',
    '@media(max-width:1060px){.links a{padding:8px 5px;font-size:.74rem}.logo .lt{letter-spacing:.05em;margin-right:-.05em}.logo{gap:7px}}',
    'a.gl-link{white-space:nowrap;color:#2f9d6c!important;font-weight:700;text-shadow:0 0 0 rgba(63,174,124,0)}',
    'html[data-theme="dark"] a.gl-link{color:#7FDDB0!important}',
    'a.gl-link:hover{text-shadow:0 0 14px rgba(63,174,124,.7)}',
    'a.gl-link span{display:inline-block;animation:glBob 3.4s ease-in-out infinite}',
    '@keyframes glBob{50%{transform:translateY(-3px) rotate(-6deg)}}',
    '@media(prefers-reduced-motion:reduce){a.gl-link span{animation:none}}',
    '@media(prefers-reduced-motion:reduce){.fx,.fx.fx-in{opacity:1;transform:none;filter:none;transition:none}.sh h2.fx-h::after{transform:none;transition:none}#faProg{display:none}html.fa-leave{opacity:1}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- scroll progress bar ---------- */
  if (!reduce) {
    var bar = document.createElement('div'); bar.id = 'faProg'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var tick = false;
    var upd = function () {
      var h = root.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 4 ? Math.min(1, Math.max(0, (window.scrollY || 0) / h)) : 0).toFixed(4) + ')';
      tick = false;
    };
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    addEventListener('resize', upd, { passive: true });
    upd();
  }

  /* ---------- rise-in for cards, chips, footer columns, section headings ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var SEL = 'main .card, main .chip, footer.sf .sf-top > div, main .sh h2';
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        show(en.target, 0);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    function show(el, tries) {
      /* wait until a parent section that fades in by itself is visible, so the animation is seen */
      var anc = el.parentElement && el.parentElement.closest('.reveal:not(.show)');
      if (anc && tries < 14) { setTimeout(function () { show(el, tries + 1); }, 120); return; }
      el.classList.add('fx-in');
      setTimeout(function () { el.classList.remove('fx', 'fx-in', 'fx-h'); el.style.removeProperty('--fd'); }, 1700);
    }
    function prep(el) {
      if (el.__fx || el.classList.contains('reveal')) return;
      el.__fx = 1;
      if (el.matches('h2')) el.classList.add('fx-h');
      else {
        var idx = 0, s = el.previousElementSibling;
        while (s && idx < 8) { idx++; s = s.previousElementSibling; }
        el.style.setProperty('--fd', (Math.min(idx, 7) * 0.07).toFixed(2) + 's');
        el.classList.add('fx');
      }
      io.observe(el);
    }
    function scan(node) {
      if (node.nodeType !== 1) return;
      if (node.matches && node.matches(SEL)) prep(node);
      if (node.querySelectorAll) [].forEach.call(node.querySelectorAll(SEL), prep);
    }
    scan(document.body);
    var pend = [], sched = false;
    new MutationObserver(function (ms) {
      ms.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) { pend.push(n); }); });
      if (!sched && pend.length) {
        sched = true;
        requestAnimationFrame(function () { var l = pend; pend = []; sched = false; l.forEach(scan); });
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- soft fade when moving between pages ---------- */
  if (!reduce) {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      var u; try { u = new URL(a.href, location.href); } catch (er) { return; }
      if (u.origin !== location.origin || !/^https?:$/.test(u.protocol)) return;
      if (u.pathname === location.pathname && u.search === location.search) return; /* same page / #anchor */
      root.classList.add('fa-leave');
      setTimeout(function () { root.classList.remove('fa-leave'); }, 2500); /* never get stuck */
    });
    addEventListener('pageshow', function () { root.classList.remove('fa-leave'); });
  }

  /* ---------- smooth colour change when switching light / dark ---------- */
  if (!reduce) {
    var tm;
    new MutationObserver(function () {
      root.classList.add('fa-theming'); clearTimeout(tm);
      tm = setTimeout(function () { root.classList.remove('fa-theming'); }, 600);
    }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  }

  /* ---------- button ripple ---------- */
  if (!reduce) {
    document.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('a.btn, button.btn');
      if (!b) return;
      var cs = getComputedStyle(b);
      if (cs.position === 'static') b.style.position = 'relative';
      b.style.overflow = 'hidden';
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
      var s = document.createElement('span'); s.className = 'fx-rip'; s.setAttribute('aria-hidden', 'true');
      s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(s);
      setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 750);
    }, { passive: true });
  }

  /* ---------- cursor ring (mouse only) ---------- */
  if (!reduce && fine) {
    var ring = document.createElement('div'); ring.className = 'fx-cur'; ring.setAttribute('aria-hidden', 'true');
    var dot = document.createElement('div'); dot.className = 'fx-dot'; dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring); document.body.appendChild(dot);
    var mx = -100, my = -100, rx = -100, ry = -100, run = false;
    function loop() {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2;
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      if (Math.abs(mx - rx) + Math.abs(my - ry) > 0.3) requestAnimationFrame(loop); else run = false;
    }
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      ring.classList.add('on'); dot.classList.add('on');
      var hot = e.target.closest && e.target.closest('a, button, .card, [role="button"], summary, label, input, textarea, select');
      ring.classList.toggle('hot', !!hot);
      if (!run) { run = true; requestAnimationFrame(loop); }
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', function () { ring.classList.remove('on', 'hot'); dot.classList.remove('on'); });
  }
})();
