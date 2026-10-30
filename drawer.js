// Side drawer menu (phones/tablets). Shared by every page.
(function () {
  var menu = document.getElementById('menu'), dr = document.getElementById('drawer'), bg = document.getElementById('drawerBg');
  if (!menu || !dr || !bg) return;
  var closeBtn = document.getElementById('drawerClose');
  function open() {
    dr.classList.add('open'); bg.classList.add('open');
    menu.setAttribute('aria-expanded', 'true'); menu.setAttribute('aria-label', 'Close menu');
    document.documentElement.style.overflow = 'hidden';
    setTimeout(function () { if (closeBtn) closeBtn.focus(); }, 60);
  }
  function close(back) {
    dr.classList.remove('open'); bg.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open menu');
    document.documentElement.style.overflow = '';
    if (back) menu.focus();
  }
  menu.addEventListener('click', function () { dr.classList.contains('open') ? close(true) : open(); });
  bg.addEventListener('click', function () { close(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { close(true); });
  dr.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) close(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dr.classList.contains('open')) close(true); });
  window.addEventListener('resize', function () { if (innerWidth > 1250 && dr.classList.contains('open')) close(false); });
})();
