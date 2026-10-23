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
