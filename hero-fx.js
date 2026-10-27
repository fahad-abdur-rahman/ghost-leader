/* Home page hero: name letters fade in one by one, slowly moving colour mesh behind it,
   and the photo tilts in 3D (with a soft light glare) when the mouse moves near it. */
(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || root.classList.contains('lite')) return;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var E = 'cubic-bezier(.2,.8,.2,1)';

  var css = [
    /* name */
    '.hero h1.chs span{background:none!important;-webkit-text-fill-color:currentColor;color:var(--green-text)}',
    '.hero h1.chs .w{display:inline-block;white-space:nowrap}',
    '.hero h1.chs .ch{display:inline-block;font-style:normal;opacity:0;transform:translateY(.75em) rotateX(-70deg) scale(.9);transform-origin:50% 100%;filter:blur(9px);animation:chIn .95s ' + E + ' forwards;animation-delay:calc(var(--i) * .06s);animation-play-state:paused}',
    '.hero h1.chs.go .ch{animation-play-state:running}',
    '@keyframes chIn{60%{filter:blur(1px)}to{opacity:1;transform:none;filter:none}}',
    /* colour mesh */
    '.blob.c{width:430px;height:430px;background:#7FDDB0;top:250px;left:32%;opacity:.15;animation:meshC 23s ease-in-out infinite}',
    '.blob.d{width:380px;height:380px;background:#2FB8A8;top:-30px;right:22%;opacity:.14;animation:meshD 27s ease-in-out infinite}',
    '.blob.a{animation:meshA 19s ease-in-out infinite}.blob.b{animation:meshB 24s ease-in-out infinite}',
    '@keyframes meshA{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(140px,90px) scale(1.25)}70%{transform:translate(60px,-40px) scale(.92)}}',
    '@keyframes meshB{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(-130px,70px) scale(1.2)}75%{transform:translate(-40px,-70px) scale(.9)}}',
    '@keyframes meshC{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(120px,-80px) scale(1.2)}66%{transform:translate(-90px,60px) scale(.9)}}',
    '@keyframes meshD{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-110px,100px) scale(1.18)}}',
    ':root[data-theme="dark"] .blob.c{opacity:.26}:root[data-theme="dark"] .blob.d{opacity:.24}',
    /* photo depth + glare */
    '.photo .ring{translate:0 0 -22px}.photo .chipf.one{translate:0 0 54px}.photo .chipf.two{translate:0 0 74px}.photo .motto{translate:0 0 34px}',
    '.photo .glare{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .35s;background:radial-gradient(circle at var(--gx,50%) var(--gy,25%),rgba(255,255,255,.34),transparent 46%);mix-blend-mode:soft-light}',
    '.photo.tilting .glare{opacity:1}',
    '@media(hover:none){.photo{animation:sway 9s ease-in-out infinite}@keyframes sway{0%,100%{transform:perspective(900px) rotateY(-4deg) rotateX(1deg)}50%{transform:perspective(900px) rotateY(4deg) rotateX(-1deg)}}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- colour mesh ---------- */
  var au = document.querySelector('.aurora');
  if (au) ['c', 'd'].forEach(function (k) { var b = document.createElement('div'); b.className = 'blob ' + k; au.appendChild(b); });

  /* ---------- name letters ---------- */
  var h1 = document.getElementById('hero-title');
  if (h1) {
    var before = h1.innerHTML, n = 0;
    function split(txt, into) {
      txt.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { into.appendChild(document.createTextNode(' ')); return; }
        var w = document.createElement('b'); w.className = 'w'; w.setAttribute('aria-hidden', 'true'); w.style.fontWeight = 'inherit';
        Array.from(part).forEach(function (c) { var i = document.createElement('i'); i.className = 'ch'; i.style.setProperty('--i', n++); i.textContent = c; w.appendChild(i); });
        into.appendChild(w);
      });
    }
    var label = h1.textContent.replace(/\s+/g, ' ').trim();
    var nodes = Array.prototype.slice.call(h1.childNodes); h1.textContent = '';
    nodes.forEach(function (nd) {
      if (nd.nodeType === 3) split(nd.textContent, h1);
      else if (nd.nodeType === 1) { var c = nd.cloneNode(false); split(nd.textContent, c); h1.appendChild(c); }
    });
    h1.setAttribute('aria-label', label); h1.classList.add('chs');
    var started = false;
    function go() {
      if (started) return; started = true; h1.classList.add('go');
      setTimeout(function () { /* animation over: put the original text back (gradient, translation, etc.) */
        if (h1.classList.contains('chs')) { h1.classList.remove('chs', 'go'); h1.removeAttribute('aria-label'); h1.innerHTML = before; }
      }, n * 60 + 1300);
    }
    function waitIntro() {
      if (!root.classList.contains('intro-on')) return go();
      var mo = new MutationObserver(function () { if (!root.classList.contains('intro-on')) { mo.disconnect(); setTimeout(go, 150); } });
      mo.observe(root, { attributes: true, attributeFilter: ['class'] });
      setTimeout(go, 9000); /* never stay hidden */
    }
    setTimeout(waitIntro, 0);
  }

  /* ---------- 3D photo tilt with glare (mouse only) ---------- */
  var photo = document.querySelector('.photo');
  if (photo) {
    var fr = photo.querySelector('.frame');
    if (fr) { var gl = document.createElement('div'); gl.className = 'glare'; gl.setAttribute('aria-hidden', 'true'); fr.appendChild(gl); }
    if (fine) {
      var pend = null, rafP = 0;
      function apply() {
        rafP = 0; var e = pend; if (!e) return;
        var r = photo.getBoundingClientRect();
        if (e.clientX > r.left - 110 && e.clientX < r.right + 110 && e.clientY > r.top - 110 && e.clientY < r.bottom + 110) {
          var px = Math.max(-.6, Math.min(.6, (e.clientX - r.left) / r.width - .5)), py = Math.max(-.6, Math.min(.6, (e.clientY - r.top) / r.height - .5));
          photo.style.transform = 'perspective(900px) rotateY(' + (px * 20).toFixed(2) + 'deg) rotateX(' + (-py * 16).toFixed(2) + 'deg) scale(1.02)';
          photo.style.setProperty('--gx', ((px + .5) * 100).toFixed(0) + '%'); photo.style.setProperty('--gy', ((py + .5) * 100).toFixed(0) + '%');
          photo.classList.add('tilting');
        } else { photo.style.transform = ''; photo.classList.remove('tilting'); }
      }
      document.addEventListener('pointermove', function (e) { if (e.pointerType && e.pointerType !== 'mouse') return; pend = e; if (!rafP) rafP = requestAnimationFrame(apply); }, { passive: true });
      document.documentElement.addEventListener('pointerleave', function () { pend = null; photo.style.transform = ''; photo.classList.remove('tilting'); });
    }
  }
})();
