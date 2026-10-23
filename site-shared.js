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

// Rebuild the "Organizations" dropdown in the menu from the saved list.
export function fillNav(orgs, activeSlug) {
  var box = document.querySelector('#orgMenu .ddm-in');
  if (!box || !Array.isArray(orgs) || !orgs.length) return;
  [].slice.call(box.querySelectorAll('a:not([data-all])')).forEach(function (a) { a.remove(); });
  orgs.forEach(function (o) {
    if (!o || !o.name) return;
    var a = document.createElement('a');
    a.href = orgHref(o);
    if (orgSlug(o) === activeSlug) a.setAttribute('aria-current', 'page');
    var lg = document.createElement('span'); lg.className = 'lg'; lg.setAttribute('aria-hidden', 'true');
    logoInto(lg, o);
    var t = document.createElement('span'); t.textContent = o.name;
    a.appendChild(lg); a.appendChild(t);
    box.appendChild(a);
  });
}
