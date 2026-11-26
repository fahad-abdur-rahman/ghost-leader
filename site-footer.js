/* Shared footer for every page. Replaces the plain one-line footer with a full footer
   (brand, explore links, organizations, connect). Organizations and social links are copied from the
   site menu, so whatever is saved in the admin panel shows here too. */
(function () {
  var ft = document.querySelector('footer');
  if (!ft || ft.getAttribute('data-sf')) return;
  ft.setAttribute('data-sf', '1');

  var css = 'footer.sf{padding:0;margin-top:30px;text-align:left;font-size:.92rem;color:var(--muted);border-top:1px solid var(--border);background:color-mix(in srgb,var(--green) 4%,var(--bg))}' +
    '.sf-top{display:grid;grid-template-columns:1.5fr 1fr 1.2fr 1fr;gap:26px;padding:30px 0 22px}' +
    '.sf-brand .logo{display:inline-flex;align-items:center;gap:10px;font-weight:800;font-size:1.15rem;color:var(--text);text-decoration:none}' +
    '.sf-brand p{margin:8px 0 0;max-width:300px;line-height:1.5}' +
    '.sf-brand .sf-motto{margin-top:10px;font-weight:700;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--green-text)}' +
    '.sf h2{margin:0 0 10px;font-size:.74rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--text)}' +
    '.sf-list{display:flex;flex-direction:column;gap:7px}' +
    '.sf-list a{color:var(--muted);text-decoration:none;width:fit-content;transition:color .2s,transform .2s}' +
    '.sf-list a:hover{color:var(--green-text);transform:translateX(3px)}' +
    '.sf-r{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.sf-bot{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 0 calc(16px + env(safe-area-inset-bottom));border-top:1px solid var(--border);font-size:.8rem}' +
    '@media(max-width:900px){.sf-top{grid-template-columns:1fr 1fr;gap:22px 18px}.sf-brand{grid-column:1/-1}}' +
    '@media(max-width:480px){.sf-top{padding:24px 0 16px;font-size:.88rem}.sf-brand .sf-motto{margin-top:6px}.sf-top>div:last-child{grid-column:1/-1}.sf-top>div:last-child .sf-list{flex-direction:row;flex-wrap:wrap;gap:6px 18px}.sf-bot{flex-direction:column;gap:6px;padding-right:64px}}' +
    '.sf-credit{text-align:center;padding:14px 20px;margin-top:24px;font-size:.88rem;color:var(--muted);border-top:1px solid var(--border)}.sf-credit a{color:var(--green-text);font-weight:700;text-decoration:none;border-bottom:1px solid transparent;transition:border-color .2s}.sf-credit a:hover,.sf-credit a:focus-visible{border-bottom-color:currentColor}footer.sf{margin-top:0;border-top:0}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function a(href, text, ext) {
    var n = document.createElement('a'); n.href = href; n.textContent = text;
    if (ext) { n.target = '_blank'; n.rel = 'me noopener noreferrer'; }
    return n;
  }
  function col(title, id) {
    var d = document.createElement('div');
    var h = document.createElement('h2'); h.textContent = title; d.appendChild(h);
    var l = document.createElement('div'); l.className = 'sf-list'; l.id = id; d.appendChild(l);
    return d;
  }

  /* credit line right above the footer */
  var cr = document.createElement('div'); cr.className = 'sf-credit';
  cr.appendChild(document.createTextNode('Built & Developed by '));
  var ca = document.createElement('a'); ca.href = 'https://fahad-abdur-rahman.github.io/ghost-leader/'; ca.textContent = 'Fahad Abdur Rahman'; cr.appendChild(ca);
  ft.parentNode.insertBefore(cr, ft);

  ft.className = 'sf';
  ft.textContent = '';
  var wrap = document.createElement('div'); wrap.className = 'wrap';

  var top = document.createElement('div'); top.className = 'sf-top';
  var brand = document.createElement('div'); brand.className = 'sf-brand';
  var logo = a('index.html', ''); logo.className = 'logo'; logo.setAttribute('aria-label', 'Fahad Abdur Rahman — home');
  var lb = document.createElement('b'); lb.textContent = 'FA'; logo.appendChild(lb);
  var lt = document.createElement('span'); lt.className = 'lt'; lt.appendChild(document.createTextNode('FAHAD')); var dt = document.createElement('i'); dt.textContent = '.'; lt.appendChild(dt); logo.appendChild(lt);
  var p1 = document.createElement('p'); p1.textContent = 'Ideas into Impact.';
  var p2 = document.createElement('p'); p2.className = 'sf-motto'; p2.textContent = 'Better Youth · Better Tomorrow';
  brand.appendChild(logo); brand.appendChild(p1); brand.appendChild(p2);

  var cE = col('Explore', 'sfExplore'), cO = col('Organizations', 'sfOrgs'), cC = col('Connect', 'sfConnect');
  top.appendChild(brand); top.appendChild(cE); top.appendChild(cO); top.appendChild(cC);

  var bot = document.createElement('div'); bot.className = 'sf-bot';
  var left = document.createElement('span');
  left.appendChild(document.createTextNode('© '));
  var yr = document.createElement('span'); yr.id = 'yr'; yr.textContent = new Date().getFullYear(); left.appendChild(yr);
  left.appendChild(document.createTextNode(' '));
  var rights = document.createElement('span'); rights.textContent = 'Fahad Abdur Rahman. All rights reserved.'; left.appendChild(rights);
  var right = document.createElement('span'); right.className = 'sf-r';
  var loc = document.createElement('span'); loc.textContent = 'Joypurhat, Bangladesh'; right.appendChild(loc);
  if (window.faLite) {
    var lb2 = document.createElement('button'); lb2.type = 'button'; lb2.className = 'fa-lite-btn';
    lb2.setAttribute('aria-pressed', window.faLite.on ? 'true' : 'false');
    lb2.textContent = window.faLite.on ? 'Lite mode: On' : 'Lite mode: Off';
    lb2.title = 'Turns off heavy effects. Good for slow phones.';
    lb2.addEventListener('click', function () { window.faLite.set(!window.faLite.on); });
    right.appendChild(lb2);
  }
  bot.appendChild(left); bot.appendChild(right);

  wrap.appendChild(top); wrap.appendChild(bot); ft.appendChild(wrap);

  /* Explore links */
  [['Home', 'index.html#home'], ['About', 'about.html'], ['Blog', 'blog.html'], ['Services', 'web-services.html'], ['👻 Ghost Leader', 'ghost-leader.html'], ['Projects', 'projects.html'], ['Contact', 'contact.html'], ['Digital card', 'card.html'], ['Challenge', 'challenge.html']]
    .forEach(function (x) { cE.lastChild.appendChild(a(x[1], x[0])); });

  /* Organizations + Connect: copy from the site menu (which is filled from the admin panel) */
  function mirror() {
    var orgs = document.querySelectorAll('#drOrgs a');
    if (orgs.length) {
      cO.lastChild.textContent = '';
      [].forEach.call(orgs, function (x) {
        var spans = x.querySelectorAll('span'), t = spans.length ? spans[spans.length - 1].textContent : x.textContent;
        cO.lastChild.appendChild(a(x.getAttribute('href'), (t || '').trim()));
      });
    } else if (!cO.lastChild.children.length) {
      [['All organizations', 'index.html#organizations'], ['TalentVerse Bangladesh', 'talentverse-bangladesh.html'], ['ATHAR Islamic Youth Forum', 'athar-islamic-youth-forum.html'], ['Visionary Youth Alliance', 'visionary-youth-alliance.html']]
        .forEach(function (x) { cO.lastChild.appendChild(a(x[1], x[0])); });
    }
    var con = document.querySelectorAll('#drConnect a');
    if (con.length) {
      cC.lastChild.textContent = '';
      [].forEach.call(con, function (x) {
        cC.lastChild.appendChild(a(x.getAttribute('href'), x.textContent.trim(), x.target === '_blank'));
      });
    } else if (!cC.lastChild.children.length) {
      cC.lastChild.appendChild(a('mailto:fahad.ar.official@gmail.com', 'Email'));
    }
  }
  mirror();
  function later() { Promise.resolve(window.faContent).then(mirror, mirror); }
  if (document.readyState === 'complete') later(); else window.addEventListener('load', later);
})();
