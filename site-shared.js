// Small helpers shared by index.html and the organization pages.
export var STATIC_PAGES = ['talentverse-bangladesh', 'nexera-youth-network', 'visionary-youth-alliance'];

export function slugify(s) {
  return String(s || '').toLowerCase().trim().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
export function orgSlug(o) { return (o && o.slug) ? String(o.slug) : slugify(o && o.name); }
export function orgHref(o) {
  var s = orgSlug(o);
  return STATIC_PAGES.indexOf(s) >= 0 ? s + '.html' : 'organization.html?o=' + encodeURIComponent(s);
}
// Only allow uploaded images (data:) or https images.
export function safeImg(u) {
  u = String(u || '').trim();
  if (/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+\/=]+$/.test(u)) return u;
  if (/^https:\/\/\S+$/i.test(u)) return u;
  return '';
}
export function mono(o) { return String((o && (o.mono || o.name)) || '').slice(0, 2).toUpperCase(); }

// Put the logo (or the two badge letters) into an element.
export function logoInto(el, o, altSuffix) {
  el.textContent = '';
  var src = safeImg(o && o.logo);
  if (src) {
    var im = document.createElement('img');
    im.src = src; im.alt = (o.name || 'Organization') + (altSuffix || ' logo');
    im.loading = 'lazy'; im.decoding = 'async';
    im.addEventListener('error', function () { el.classList.remove('has-logo'); el.textContent = mono(o); });
    el.appendChild(im); el.classList.add('has-logo');
  } else { el.classList.remove('has-logo'); el.textContent = mono(o); }
}

// Rebuild the "Organizations" dropdown (desktop) and drawer list (mobile) from the saved list.
export function fillNav(orgs, activeSlug) {
  if (!Array.isArray(orgs) || !orgs.length) return;
  function build(box, cls) {
    if (!box) return;
    [].slice.call(box.querySelectorAll('a:not([data-all])')).forEach(function (a) { a.remove(); });
    orgs.forEach(function (o) {
      if (!o || !o.name) return;
      var a = document.createElement('a');
      a.href = orgHref(o);
      if (cls) a.className = cls;
      if (orgSlug(o) === activeSlug) a.setAttribute('aria-current', 'page');
      var lg = document.createElement('span'); lg.className = 'lg'; lg.setAttribute('aria-hidden', 'true');
      logoInto(lg, o);
      var t = document.createElement('span'); t.textContent = o.name;
      a.appendChild(lg); a.appendChild(t);
      box.appendChild(a);
    });
  }
  build(document.querySelector('#orgMenu .ddm-in'), '');
  build(document.getElementById('drOrgs'), 'dl');
}

// "Connect" block of the drawer: email + the social links saved in the admin panel.
export function fillConnect(d) {
  var box = document.getElementById('drConnect');
  if (!box || !d) return;
  var labels = { linkedin: 'LinkedIn', facebook: 'Facebook', github: 'GitHub', x: 'X / Twitter', youtube: 'YouTube' };
  var email = d.profile && d.profile.email;
  var items = [];
  function add(text, href, ext) { items.push([text, href, ext]); }
  function draw() {
    if (!items.length) return;
    box.textContent = '';
    items.forEach(function (it) {
      var a = document.createElement('a'); a.className = 'dl'; a.href = it[1]; a.textContent = it[0];
      if (it[2]) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      box.appendChild(a);
    });
  }
  if (email && /^[^\s@]+@[^\s@]+$/.test(email)) add('Email', 'mailto:' + email, false);
  var soc = d.social || {};
  Object.keys(labels).forEach(function (k) {
    if (soc[k] && /^https?:\/\//i.test(soc[k])) add(labels[k], soc[k], true);
  });
  draw();
}

// Bangla / English content: admin saves English in "key" and Bangla in "keyBn".
// localize() returns a copy where, on the Bangla site, every non-empty "keyBn" replaces "key".
export function isBn() { return document.documentElement.getAttribute('lang') === 'bn'; }
export function localize(d) {
  var bn = isBn();
  function walk(v) {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') {
      var o = {};
      Object.keys(v).forEach(function (k) { if (!/.Bn$/.test(k)) o[k] = walk(v[k]); });
      if (bn) Object.keys(v).forEach(function (k) {
        if (/.Bn$/.test(k) && typeof v[k] === 'string' && v[k].trim()) o[k.slice(0, -2)] = v[k];
      });
      return o;
    }
    return v;
  }
  return walk(d);
}
// Run fn again whenever the visitor switches বাংলা / EN.
export function onLangChange(fn) {
  var last = isBn();
  new MutationObserver(function () { if (isBn() !== last) { last = isBn(); fn(); } })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
}
