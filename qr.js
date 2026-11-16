/* Small QR-code maker (byte mode, error level M, versions 1-10 = up to ~210 characters). No libraries.
   FA_QR.make(text) -> { size, modules[y][x] (true = dark) } ;  FA_QR.draw(canvas, text, { scale, margin, dark, light }) */
(function (root) {
  var EC = { 1: [10, [[1, 16]]], 2: [16, [[1, 28]]], 3: [26, [[1, 44]]], 4: [18, [[2, 32]]], 5: [24, [[2, 43]]], 6: [16, [[4, 27]]], 7: [18, [[4, 31]]], 8: [22, [[2, 38], [2, 39]]], 9: [22, [[3, 36], [2, 37]]], 10: [26, [[4, 43], [1, 44]]] };
  var ALIGN = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50] };
  var EXP = [], LOG = [];
  (function () { var x = 1, i; for (i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; } for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255]; })();
  function gmul(a, b) { return a && b ? EXP[LOG[a] + LOG[b]] : 0; }
  function rsGen(n) { var g = [1], i, j; for (i = 0; i < n; i++) { var ng = []; for (j = 0; j <= g.length; j++) ng.push(0); for (j = 0; j < g.length; j++) { ng[j] ^= g[j]; ng[j + 1] ^= gmul(g[j], EXP[i]); } g = ng; } return g; }
  function rsEnc(data, n) {
    var g = rsGen(n), res = [], i, j; for (i = 0; i < n; i++) res.push(0);
    for (i = 0; i < data.length; i++) { var f = data[i] ^ res[0]; res.shift(); res.push(0); if (f) for (j = 0; j < n; j++) res[j] ^= gmul(g[j + 1], f); }
    return res;
  }
  function bytesOf(text) {
    if (typeof TextEncoder !== 'undefined') return Array.prototype.slice.call(new TextEncoder().encode(text));
    var s = unescape(encodeURIComponent(text)), a = [], i; for (i = 0; i < s.length; i++) a.push(s.charCodeAt(i)); return a;
  }
  function dataCap(v) { var t = 0; EC[v][1].forEach(function (g) { t += g[0] * g[1]; }); return t; }
  function bit(x, i) { return ((x >>> i) & 1) !== 0; }

  function make(text) {
    var bytes = bytesOf(String(text)), v, cc;
    for (v = 1; v <= 10; v++) { cc = v < 10 ? 8 : 16; if ((4 + cc + bytes.length * 8 + 7) >> 3 <= dataCap(v)) break; }
    if (v > 10) throw new Error('Text is too long for the QR code');
    var size = 17 + 4 * v, cap = dataCap(v);
    /* bit stream */
    var bits = [];
    function put(val, len) { for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    put(4, 4); put(bytes.length, cc); bytes.forEach(function (b) { put(b, 8); });
    for (var t = 0; t < 4 && bits.length < cap * 8; t++) bits.push(0);
    while (bits.length % 8) bits.push(0);
    var cw = []; for (var i = 0; i < bits.length; i += 8) { var b = 0; for (var k = 0; k < 8; k++) b = (b << 1) | bits[i + k]; cw.push(b); }
    for (var pad = 0xEC; cw.length < cap; pad ^= 0xEC ^ 0x11) cw.push(pad);
    /* blocks + error correction */
    var ecLen = EC[v][0], blocks = [], pos = 0;
    EC[v][1].forEach(function (g) { for (var n = 0; n < g[0]; n++) { var d = cw.slice(pos, pos + g[1]); pos += g[1]; blocks.push({ d: d, e: rsEnc(d, ecLen) }); } });
    var out = [], maxD = 0; blocks.forEach(function (bl) { if (bl.d.length > maxD) maxD = bl.d.length; });
    for (i = 0; i < maxD; i++) blocks.forEach(function (bl) { if (i < bl.d.length) out.push(bl.d[i]); });
    for (i = 0; i < ecLen; i++) blocks.forEach(function (bl) { out.push(bl.e[i]); });
    /* matrix */
    var M = [], F = [], y, x;
    for (y = 0; y < size; y++) { M.push([]); F.push([]); for (x = 0; x < size; x++) { M[y].push(false); F[y].push(false); } }
    function setF(x, y, d) { M[y][x] = d; F[y][x] = true; }
    function finder(cx, cy) { for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) { var xx = cx + dx, yy = cy + dy, dist = Math.max(Math.abs(dx), Math.abs(dy)); if (xx >= 0 && xx < size && yy >= 0 && yy < size) setF(xx, yy, dist !== 2 && dist !== 4); } }
    function align(cx, cy) { for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) setF(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }
    for (i = 0; i < size; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    var ap = ALIGN[v], last = ap.length - 1;
    for (i = 0; i < ap.length; i++) for (var j = 0; j < ap.length; j++) { if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) continue; align(ap[i], ap[j]); }
    function formatBits(mask) { var data = (0 << 3) | mask, rem = data, n; for (n = 0; n < 10; n++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537); return ((data << 10) | rem) ^ 0x5412; }
    function drawFormat(mask) {
      var bs = formatBits(mask), n;
      for (n = 0; n <= 5; n++) setF(8, n, bit(bs, n)); setF(8, 7, bit(bs, 6)); setF(8, 8, bit(bs, 7)); setF(7, 8, bit(bs, 8));
      for (n = 9; n < 15; n++) setF(14 - n, 8, bit(bs, n));
      for (n = 0; n < 8; n++) setF(size - 1 - n, 8, bit(bs, n));
      for (n = 8; n < 15; n++) setF(8, size - 15 + n, bit(bs, n));
      setF(8, size - 8, true);
    }
    drawFormat(0);
    if (v >= 7) { var rem = v, n2; for (n2 = 0; n2 < 12; n2++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25); var vb = (v << 12) | rem; for (n2 = 0; n2 < 18; n2++) { var c = bit(vb, n2), a = size - 11 + (n2 % 3), b2 = Math.floor(n2 / 3); setF(a, b2, c); setF(b2, a, c); } }
    /* data */
    var idx = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) for (var jj = 0; jj < 2; jj++) {
        var xx = right - jj, up = ((right + 1) & 2) === 0, yy = up ? size - 1 - vert : vert;
        if (!F[yy][xx] && idx < out.length * 8) { M[yy][xx] = bit(out[idx >>> 3], 7 - (idx & 7)); idx++; }
      }
    }
    function applyMask(mask) {
      for (var yy = 0; yy < size; yy++) for (var xx = 0; xx < size; xx++) {
        if (F[yy][xx]) continue; var inv;
        switch (mask) {
          case 0: inv = (xx + yy) % 2 === 0; break; case 1: inv = yy % 2 === 0; break; case 2: inv = xx % 3 === 0; break; case 3: inv = (xx + yy) % 3 === 0; break;
          case 4: inv = (Math.floor(xx / 3) + Math.floor(yy / 2)) % 2 === 0; break; case 5: inv = (xx * yy) % 2 + (xx * yy) % 3 === 0; break;
          case 6: inv = ((xx * yy) % 2 + (xx * yy) % 3) % 2 === 0; break; default: inv = ((xx + yy) % 2 + (xx * yy) % 3) % 2 === 0;
        }
        if (inv) M[yy][xx] = !M[yy][xx];
      }
    }
    function penalty() {
      var p = 0, y, x, run, k, dark = 0;
      for (y = 0; y < size; y++) { run = 1; for (x = 1; x < size; x++) { if (M[y][x] === M[y][x - 1]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (x = 0; x < size; x++) { run = 1; for (y = 1; y < size; y++) { if (M[y][x] === M[y - 1][x]) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
      for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) { var c = M[y][x]; if (c === M[y][x + 1] && c === M[y + 1][x] && c === M[y + 1][x + 1]) p += 3; }
      var pa = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], pb = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
      function match(get, arr) { for (var s = 0; s + 11 <= size; s++) { var ok = true; for (var q = 0; q < 11; q++) if ((get(s + q) ? 1 : 0) !== arr[q]) { ok = false; break; } if (ok) p += 40; } }
      for (y = 0; y < size; y++) { (function (yy) { match(function (i) { return M[yy][i]; }, pa); match(function (i) { return M[yy][i]; }, pb); })(y); }
      for (x = 0; x < size; x++) { (function (xx) { match(function (i) { return M[i][xx]; }, pa); match(function (i) { return M[i][xx]; }, pb); })(x); }
      for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (M[y][x]) dark++;
      k = Math.ceil(Math.abs(dark * 20 - size * size * 10) / (size * size)) - 1; p += k * 10;
      return p;
    }
    var best = 0, bestP = 1e9;
    for (var m = 0; m < 8; m++) { applyMask(m); drawFormat(m); var pp = penalty(); if (pp < bestP) { bestP = pp; best = m; } applyMask(m); }
    applyMask(best); drawFormat(best);
    return { size: size, modules: M, version: v };
  }

  function draw(canvas, text, o) {
    o = o || {}; var q = make(text), scale = o.scale || 8, margin = o.margin == null ? 4 : o.margin, n = q.size + margin * 2;
    canvas.width = canvas.height = n * scale;
    var cx = canvas.getContext('2d'); cx.fillStyle = o.light || '#fff'; cx.fillRect(0, 0, canvas.width, canvas.height); cx.fillStyle = o.dark || '#000';
    for (var y = 0; y < q.size; y++) for (var x = 0; x < q.size; x++) if (q.modules[y][x]) cx.fillRect((x + margin) * scale, (y + margin) * scale, scale, scale);
    return q;
  }
  root.FA_QR = { make: make, draw: draw };
})(typeof window !== 'undefined' ? window : globalThis);
