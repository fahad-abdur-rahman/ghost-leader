/* Floating WhatsApp button. The number and the ready-made message come from the admin panel
   (Profile & Links, Site texts). No number saved = no button. */
(function () {
  if (window.__faWa) return; window.__faWa = 1;
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || root.classList.contains('lite');
  function bn() { return root.getAttribute('lang') === 'bn'; }
  function load() { try { return JSON.parse(localStorage.getItem('fa-wa') || 'null'); } catch (e) { return null; } }

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
    '@keyframes waIn{from{opacity:0;transform:translateY(24px) scale(.6)}to{opacity:1;transform:none}}',
    '@keyframes waPulse{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.7)}}',
    '@media(max-width:520px){.fa-wa{right:12px;bottom:calc(76px + env(safe-area-inset-bottom))}.fa-wa .t{display:none}}',
    '@media(prefers-reduced-motion:reduce){.fa-wa,.fa-wa .b::after{animation:none}.fa-wa .b::after{display:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var el = null;
  function render() {
    var c = load(), n = c && c.n;
    if (!n) { if (el && el.parentNode) el.parentNode.removeChild(el); el = null; return; }
    var msg = (bn() && c.mb) ? c.mb : (c.m || '');
    var label = bn() ? '\u09b9\u09cb\u09af\u09bc\u09be\u099f\u09b8\u0985\u09cd\u09af\u09be\u09aa\u09c7 \u09ae\u09c7\u09b8\u09c7\u099c \u0995\u09b0\u09c1\u09a8' : 'Chat on WhatsApp';
    if (!el) {
      el = document.createElement('a'); el.className = 'fa-wa'; el.target = '_blank'; el.rel = 'noopener noreferrer';
      el.innerHTML = '<span class="b" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.3.6 4.4 1.7 6.3L3.3 28.6l7-1.8c1.8 1 3.8 1.500 5.700 1.500 7 0 12.600-5.600 12.600-12.600S23 3 16 3zm0 22.900c-1.800 0-3.600-.5-5.100-1.400l-.4-.2-4.100 1.100 1.100-4-.3-.4a10.200 10.200 0 0 1-1.600-5.500C5.600 9.900 10.300 5.300 16 5.300s10.400 4.600 10.400 10.300S21.700 25.900 16 25.900zm5.700-7.600c-.3-.2-1.800-.9-2.100-1-.3-.1-.5-.2-.7.200-.2.300-.8 1-1 1.200-.2.200-.4.200-.7.100-.3-.2-1.300-.5-2.500-1.500-.9-.8-1.500-1.800-1.700-2.100-.2-.3 0-.5.100-.6l.5-.5c.1-.2.200-.3.300-.5.100-.2 0-.4 0-.5-.1-.2-.7-1.700-1-2.300-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1.100 1.100-1.100 2.600s1.100 3 1.300 3.200c.2.200 2.200 3.400 5.300 4.700 2 .8 2.700.9 3.700.7.600-.1 1.800-.7 2.100-1.500.3-.7.300-1.300.2-1.500-.1-.2-.3-.3-.6-.4z"/></svg></span><span class="t"></span>';
      el.addEventListener('click', function () { try { window.faTrack && window.faTrack('whatsapp_click'); } catch (e) {} });
      document.body.appendChild(el);
    }
    el.href = 'https://wa.me/' + n + (msg ? '?text=' + encodeURIComponent(msg) : '');
    el.setAttribute('aria-label', label); el.querySelector('.t').textContent = label;
  }
  render();
  window.addEventListener('fa-wa', render);
  new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ['lang'] });
})();
