// Wireframes basse fidélité du site Maison Lemony (arborescence B)
// Usage : node pages.js <dossier de sortie>
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2];

const INK = '#1a1a1a', GREY = '#8a8a8a', LIGHT = '#ececec', RED = '#c62828', MID = '#c4c4c4', SOFT = '#f4f4f4';
const FONT = 'Arial, Helvetica, sans-serif';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const tw = (str, fs) => String(str).length * fs * 0.53;

function wrap(str, max) {
  const out = [];
  for (const para of String(str).split('\n')) {
    let line = '';
    for (const w of para.split(' ')) {
      if ((line + ' ' + w).trim().length > max) { out.push(line.trim()); line = w; }
      else line += ' ' + w;
    }
    out.push(line.trim());
  }
  return out;
}

// ---------------------------------------------------------------- primitives
class Svg {
  constructor() { this.p = []; }
  text(x, y, str, o = {}) {
    const { fs = 13, fill = INK, anchor = 'start', weight = 'normal', italic = false, ls = 0, lh = 1.3 } = o;
    const lines = Array.isArray(str) ? str : String(str).split('\n');
    const t = lines.map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : fs * lh}">${esc(l)}</tspan>`).join('');
    this.p.push(`<text x="${x}" y="${y}" font-family="${FONT}" font-size="${fs}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}"${italic ? ' font-style="italic"' : ''}${ls ? ` letter-spacing="${ls}"` : ''}>${t}</text>`);
    return lines.length * fs * lh;
  }
  rich(x, y, parts, o = {}) {
    const { fs = 13, anchor = 'start' } = o;
    const t = parts.map(([str, fill = INK, weight = 'normal']) => `<tspan fill="${fill}" font-weight="${weight}">${esc(str)}</tspan>`).join('');
    this.p.push(`<text x="${x}" y="${y}" font-family="${FONT}" font-size="${fs}" text-anchor="${anchor}">${t}</text>`);
  }
  rect(x, y, w, h, o = {}) {
    const { fill = '#fff', stroke = INK, sw = 1.5, dash = null, rx = 3 } = o;
    this.p.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
  }
  line(x1, y1, x2, y2, o = {}) {
    const { stroke = INK, sw = 1.2, dash = null } = o;
    this.p.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
  }
  circle(cx, cy, r, o = {}) {
    const { fill = '#fff', stroke = INK, sw = 1.2, dash = null } = o;
    this.p.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
  }
  // Emplacement d'image : boîte grise barrée, avec ce que doit montrer la photo
  img(x, y, w, h, label = '', red = false) {
    this.rect(x, y, w, h, { fill: LIGHT, stroke: red ? RED : MID, sw: red ? 1.6 : 1, dash: red ? '6 4' : null, rx: 2 });
    this.line(x, y, x + w, y + h, { stroke: MID, sw: 1 });
    this.line(x + w, y, x, y + h, { stroke: MID, sw: 1 });
    if (label) {
      const fs = w < 200 ? 10 : 12;
      const lines = wrap(label, Math.max(12, Math.floor((w - 30) / (fs * 0.55))));
      const lw = Math.min(w - 16, Math.max(...lines.map(l => tw(l, fs))) + 18);
      const lh = lines.length * fs * 1.3 + 10;
      this.rect(x + w / 2 - lw / 2, y + h / 2 - lh / 2, lw, lh, { fill: '#fff', stroke: 'none', rx: 2 });
      this.text(x + w / 2, y + h / 2 - lh / 2 + fs + 3, lines, { fs, anchor: 'middle', fill: red ? RED : GREY, italic: true });
    }
  }
  bars(x, y, w, n, gap = 11) {
    for (let i = 0; i < n; i++) this.rect(x, y + i * gap, i === n - 1 ? w * 0.6 : w, 5, { fill: MID, stroke: 'none', rx: 2 });
    return n * gap;
  }
  btn(x, y, label, kind = 'primary', o = {}) {
    const { fs = 14, h = 44, w = tw(label, fs) + 44 } = o;
    if (kind === 'link') {
      this.text(x, y + h / 2 + fs * 0.36, label, { fs, weight: 'bold' });
      this.line(x, y + h / 2 + fs * 0.36 + 4, x + tw(label, fs), y + h / 2 + fs * 0.36 + 4, { sw: 1 });
      return tw(label, fs);
    }
    const p = kind === 'primary';
    this.rect(x, y, w, h, { fill: p ? INK : '#fff', stroke: INK, sw: 1.5, rx: 2 });
    this.text(x + w / 2, y + h / 2 + fs * 0.36, label, { fs, anchor: 'middle', fill: p ? '#fff' : INK, weight: 'bold' });
    return w;
  }
  field(x, y, w, label, o = {}) {
    const { ph = '', h = 42, select = false, value = '', req = false, red = false, area = false } = o;
    this.text(x, y, label + (req ? ' *' : ''), { fs: 12.5, weight: 'bold', fill: red ? RED : INK });
    const bh = area ? 96 : h;
    this.rect(x, y + 8, w, bh, { fill: '#fff', stroke: red ? RED : GREY, sw: 1.2, dash: red ? '6 4' : null, rx: 2 });
    this.text(x + 12, y + 8 + 26, value || ph, { fs: 13, fill: value ? INK : GREY, italic: !value });
    if (select) this.text(x + w - 16, y + 8 + 26, '▾', { fs: 13, anchor: 'middle' });
    return bh + 30;
  }
  radio(x, y, label, on = false) {
    this.circle(x + 8, y - 4, 8, { sw: 1.4 });
    if (on) this.circle(x + 8, y - 4, 4, { fill: INK, stroke: 'none' });
    this.text(x + 24, y + 1, label, { fs: 13 });
    return tw(label, 13) + 50;
  }
  check(x, y, label, on = false) {
    this.rect(x, y - 12, 15, 15, { sw: 1.4, rx: 2 });
    if (on) this.text(x + 7.5, y, '✓', { fs: 13, anchor: 'middle', weight: 'bold' });
    return this.text(x + 26, y, label, { fs: 12.5 });
  }
  pin(x, y, n, red = false) {
    this.circle(x, y, 13, { fill: red ? RED : '#2b2b2b', stroke: '#fff', sw: 2 });
    this.text(x, y + 4.5, String(n), { fs: 12.5, anchor: 'middle', fill: '#fff', weight: 'bold' });
  }
  render(W, H) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Math.ceil(H)}" viewBox="0 0 ${W} ${Math.ceil(H)}">
<rect width="100%" height="100%" fill="#fff"/>
${this.p.join('\n')}
</svg>`;
  }
}

// ---------------------------------------------------------------- page desktop
class Page {
  constructor(s, x, y, w, url = 'maison-lemony.com') {
    Object.assign(this, { s, fx: x, fy: y, fw: w, x0: x + 50, cw: w - 100, y: y + 28, pins: [], start: s.p.length, url });
  }
  pin(n, x, y) { this.pins.push([n, x, y]); }
  space(n) { this.y += n; }

  header(active, o = {}) {
    const s = this.s, y = this.y, h = 72;
    if (o.over) s.text(this.x0, y + h + 16, '', {});
    s.line(this.fx, y + h, this.fx + this.fw, y + h, { stroke: MID, sw: 1 });
    s.circle(this.x0 + 14, y + h / 2, 14);
    s.text(this.x0 + 14, y + h / 2 + 5, 'L', { fs: 14, anchor: 'middle', weight: 'bold' });
    s.text(this.x0 + 38, y + h / 2 + 5, 'MAISON LEMONY', { fs: 15, weight: 'bold', ls: 3 });
    const ctaW = 186, ctaX = this.x0 + this.cw - ctaW;
    s.btn(ctaX, y + h / 2 - 21, 'Composer ma cave', o.quiet ? 'secondary' : 'primary', { w: ctaW, h: 42 });
    s.text(ctaX - 22, y + h / 2 + 5, 'FR · EN', { fs: 12, anchor: 'end', fill: GREY, weight: 'bold' });
    let rx = ctaX - 100;
    for (const l of ['Rendez-vous', 'La Maison', 'Matières']) {
      const lw = tw(l, 14.5);
      s.text(rx, y + h / 2 + 5, l, { fs: 14.5, anchor: 'end', weight: l === active ? 'bold' : 'normal' });
      if (l === active) s.line(rx - lw, y + h / 2 + 14, rx, y + h / 2 + 14, { sw: 2.5 });
      rx -= lw + 40;
    }
    this.y += h;
  }

  hero(o) {
    const s = this.s, y = this.y, h = o.h;
    s.img(this.fx + 1, y, this.fw - 2, h, '', o.red);
    const bw = 540, pad = 34;
    const titleL = o.title.split('\n');
    const subL = o.sub ? wrap(o.sub, 52) : [];
    const bh = pad + 18 + titleL.length * 44 + 10 + subL.length * 21 + (o.primary ? 74 : 0) + pad - 10;
    const bx = this.x0, by = y + (h - bh) / 2;
    s.rect(bx, by, bw, bh, { fill: '#fff', stroke: INK, sw: 1 });
    let cy = by + pad + 6;
    s.text(bx + pad, cy, o.kicker, { fs: 11.5, fill: GREY, ls: 2, weight: 'bold' });
    cy += 44;
    s.text(bx + pad, cy, titleL, { fs: 34, weight: 'bold', lh: 1.3 });
    cy += (titleL.length - 1) * 44 + 34;
    if (subL.length) { s.text(bx + pad, cy, subL, { fs: 16, fill: '#555' }); cy += subL.length * 21; }
    if (o.primary) {
      const w1 = s.btn(bx + pad, cy + 8, o.primary, 'primary');
      if (o.secondary) s.btn(bx + pad + w1 + 26, cy + 8, o.secondary, 'link');
      this.heroBtnY = cy + 30; this.heroBtnX = bx + pad;
    }
    if (o.imgLabel) {
      const lx = this.x0 + this.cw - 300;
      s.rect(lx, y + h - 54, 300, 34, { fill: '#fff', stroke: o.red ? RED : 'none', dash: o.red ? '5 3' : null });
      s.text(lx + 150, y + h - 32, o.imgLabel, { fs: 12, anchor: 'middle', italic: true, fill: o.red ? RED : GREY });
    }
    this.y += h;
  }

  breadcrumb(parts) {
    this.s.text(this.x0, this.y + 34, parts.join('  ›  '), { fs: 12.5, fill: GREY });
    this.y += 52;
  }

  sectionHead(kicker, title, link, o = {}) {
    const s = this.s;
    this.y += o.top ?? 70;
    if (kicker) s.text(this.x0, this.y, kicker, { fs: 11.5, fill: GREY, ls: 2, weight: 'bold' });
    if (title) s.text(this.x0, this.y + 34, title, { fs: 26, weight: 'bold' });
    if (link) s.text(this.x0 + this.cw, this.y + 34, link, { fs: 13.5, anchor: 'end', weight: 'bold' });
    this.y += title ? 62 : 24;
  }

  cards(items, o = {}) {
    const { cols = 4, imgH = 200, gap = 24 } = o;
    const s = this.s, cw = (this.cw - gap * (cols - 1)) / cols;
    let rowY = this.y, maxH = 0;
    this.rowsY = [rowY]; this.cardW = cw;
    items.forEach((it, i) => {
      const c = i % cols;
      if (c === 0 && i > 0) { rowY += maxH + 30; maxH = 0; this.rowsY.push(rowY); }
      const x = this.x0 + c * (cw + gap);
      s.img(x, rowY, cw, imgH, it.img || '', it.imgRed);
      let cy = rowY + imgH + 24;
      if (it.tag) { s.text(x, cy, it.tag.toUpperCase(), { fs: 10.5, fill: GREY, ls: 1.5, weight: 'bold' }); cy += 20; }
      cy += s.text(x, cy, wrap(it.t, Math.floor(cw / 8.6)), { fs: 15.5, weight: 'bold', fill: it.red ? RED : INK }) + 2;
      if (it.s) cy += s.text(x, cy, wrap(it.s, Math.floor(cw / 7)), { fs: 13, fill: it.red ? RED : '#555' });
      if (it.link) { cy += 6; s.text(x, cy, it.link, { fs: 13, weight: 'bold' }); cy += 16; }
      maxH = Math.max(maxH, cy - rowY);
    });
    this.y = rowY + maxH;
  }

  split(o) {
    const s = this.s, h = o.h || 340, y = this.y + (o.top ?? 70);
    const iw = this.cw * 0.5;
    const ix = o.flip ? this.x0 + this.cw - iw : this.x0;
    s.img(ix, y, iw, h, o.img || '', o.imgRed);
    const tx = o.flip ? this.x0 : this.x0 + iw + 60, tw_ = this.cw - iw - 60;
    let cy = y + 30;
    if (o.kicker) { s.text(tx, cy, o.kicker, { fs: 11.5, fill: GREY, ls: 2, weight: 'bold' }); cy += 34; }
    const tl = o.title.split('\n');
    s.text(tx, cy, tl, { fs: 24, weight: 'bold' }); cy += tl.length * 31 + 6;
    if (o.text) { cy += s.text(tx, cy, wrap(o.text, Math.floor(tw_ / 7.6)), { fs: 14.5, fill: '#444' }) + 6; }
    cy += s.bars(tx, cy, tw_, o.lines ?? 4) + 6;
    if (o.facts) for (const f of o.facts) { cy += s.text(tx, cy + 4, f, { fs: 13.5, fill: f.startsWith('?') ? RED : INK }) + 4; }
    if (o.btn) { s.btn(tx, cy + 14, o.btn, 'primary'); this.splitBtn = [tx, cy + 36]; cy += 60; }
    if (o.link) { s.text(tx, cy + 22, o.link, { fs: 14, weight: 'bold' }); cy += 30; }
    this.splitText = [tx, y + 30];
    this.y = Math.max(y + h, cy);
  }

  band(o) {
    const s = this.s, h = o.h || 230, y = this.y + (o.top ?? 80);
    s.rect(this.fx + 1, y, this.fw - 2, h, { fill: SOFT, stroke: 'none', rx: 0 });
    const cx = this.fx + this.fw / 2;
    s.text(cx, y + 74, o.title, { fs: 28, weight: 'bold', anchor: 'middle' });
    if (o.sub) s.text(cx, y + 104, o.sub, { fs: 15, anchor: 'middle', fill: '#555', italic: true });
    const w1 = tw(o.primary, 14) + 44, w2 = o.secondary ? tw(o.secondary, 14) : 0;
    const total = w1 + (o.secondary ? 30 + w2 : 0);
    s.btn(cx - total / 2, y + h - 88, o.primary, 'primary');
    if (o.secondary) s.btn(cx - total / 2 + w1 + 30, y + h - 88, o.secondary, 'link');
    this.bandBtn = [cx - total / 2, y + h - 66];
    this.y = y + h;
  }

  proofs(items, o = {}) {
    const s = this.s, n = items.length, g = 16, w = (this.cw - g * (n - 1)) / n, y = this.y + (o.top ?? 40), h = o.h || 64;
    items.forEach((it, i) => {
      const red = it.startsWith('?');
      const t = red ? it.slice(1).trim() : it;
      const x = this.x0 + i * (w + g);
      s.rect(x, y, w, h, { fill: '#fff', stroke: red ? RED : MID, sw: 1.2, dash: red ? '6 4' : null });
      s.text(x + w / 2, y + h / 2 + 5 - (wrap(t, Math.floor(w / 7.4)).length - 1) * 8.5, wrap(t, Math.floor(w / 7.4)), { fs: 13.5, anchor: 'middle', fill: red ? RED : INK });
    });
    this.y = y + h;
  }

  steps3(items) {
    const s = this.s, n = items.length, g = 40, w = (this.cw - g * (n - 1)) / n;
    items.forEach((it, i) => {
      const x = this.x0 + i * (w + g);
      s.circle(x + 22, this.y + 22, 22, { sw: 1.5 });
      s.text(x + 22, this.y + 29, String(i + 1), { fs: 18, anchor: 'middle', weight: 'bold' });
      s.text(x + 60, this.y + 20, it.t, { fs: 17, weight: 'bold' });
      s.text(x + 60, this.y + 44, wrap(it.s, Math.floor((w - 60) / 7.2)), { fs: 13.5, fill: '#555' });
      if (it.red) s.text(x + 60, this.y + 44 + wrap(it.s, Math.floor((w - 60) / 7.2)).length * 17.5, it.red, { fs: 13.5, fill: RED });
    });
    this.y += 110;
  }

  quote(o) {
    const s = this.s, y = this.y + (o.top ?? 80), cx = this.fx + this.fw / 2;
    s.text(cx, y, '«', { fs: 60, anchor: 'middle', fill: MID });
    s.text(cx, y + 36, wrap(o.text, 70), { fs: 20, anchor: 'middle', italic: true, fill: o.red ? RED : INK });
    const n = wrap(o.text, 70).length;
    s.text(cx, y + 36 + n * 26 + 18, o.author, { fs: 13, anchor: 'middle', fill: o.red ? RED : GREY, weight: 'bold', ls: 1 });
    this.quoteY = y + 20;
    this.y = y + 36 + n * 26 + 30;
  }

  stats(items, o = {}) {
    const s = this.s, n = items.length, w = this.cw / n, y = this.y + (o.top ?? 60);
    items.forEach(([big, small], i) => {
      const x = this.x0 + i * w;
      if (i) s.line(x, y - 10, x, y + 70, { stroke: MID, sw: 1 });
      s.text(x + w / 2, y + 30, big, { fs: 36, anchor: 'middle', weight: 'bold' });
      s.text(x + w / 2, y + 56, wrap(small, 26), { fs: 13, anchor: 'middle', fill: '#555' });
    });
    this.y = y + 90;
  }

  tabs(items, active) {
    const s = this.s, y = this.y + 30;
    let x = this.x0;
    s.line(this.x0, y + 18, this.x0 + this.cw, y + 18, { stroke: MID, sw: 1 });
    for (const t of items) {
      const w = tw(t, 15);
      s.text(x, y + 4, t, { fs: 15, weight: t === active ? 'bold' : 'normal', fill: t === active ? INK : '#555' });
      if (t === active) s.line(x, y + 18, x + w, y + 18, { sw: 3 });
      x += w + 44;
    }
    this.y = y + 18;
  }

  accordion(items, o = {}) {
    const s = this.s; let y = this.y + (o.top ?? 20);
    const x = o.x ?? this.x0, w = o.w ?? this.cw;
    items.forEach((q, i) => {
      s.line(x, y, x + w, y, { stroke: MID, sw: 1 });
      s.text(x, y + 34, q, { fs: 15, weight: i === 0 && o.open ? 'bold' : 'normal' });
      s.text(x + w - 4, y + 34, i === 0 && o.open ? '−' : '+', { fs: 20, anchor: 'end' });
      y += 54;
      if (i === 0 && o.open) { y += s.bars(x, y - 6, w * 0.8, 3) + 10; }
    });
    s.line(x, y, x + w, y, { stroke: MID, sw: 1 });
    this.y = y;
  }

  footer() {
    const s = this.s, y = this.y + 90, h = 290;
    s.line(this.fx, y, this.fx + this.fw, y, { sw: 1.2 });
    const cols = [
      ['MAISON LEMONY', ['Atelier · Vienne (Isère)', 'Téléphone direct', 'Sur rendez-vous', 'Instagram']],
      ['LE SITE', ['Composer ma cave', 'Matières', 'La Maison', 'Rendez-vous']],
      ['SERVICES', ['Entretien & garantie', 'CITES & export', 'Livraison & délais', 'Presse']],
      ['LÉGAL', ['Mentions légales', 'Cookies', 'Confidentialité']],
    ];
    const w = this.cw / 4;
    cols.forEach(([t, ls], i) => {
      const x = this.x0 + i * w;
      s.text(x, y + 52, t, { fs: 11.5, fill: GREY, ls: 2, weight: 'bold' });
      ls.forEach((l, j) => s.text(x, y + 84 + j * 26, l, { fs: 14 }));
    });
    s.line(this.x0, y + h - 60, this.x0 + this.cw, y + h - 60, { stroke: MID, sw: 1 });
    s.text(this.x0, y + h - 28, '© Maison Lemony · Maître Artisan d\'Art · Fabriqué à la main en France', { fs: 12.5, fill: GREY });
    s.text(this.x0 + this.cw, y + h - 28, 'FR · EN', { fs: 12.5, anchor: 'end', weight: 'bold' });
    this.footerY = y;
    this.y = y + h;
  }

  stepper(steps, current) {
    const s = this.s, y = this.y + 46, n = steps.length, step = this.cw / (n - 1);
    for (let i = 0; i < n - 1; i++) s.line(this.x0 + i * step + 16, y, this.x0 + (i + 1) * step - 16, y, { stroke: i < current ? INK : MID, sw: i < current ? 2 : 1.2 });
    steps.forEach((t, i) => {
      const cx = this.x0 + i * step;
      if (i < current) { s.circle(cx, y, 15, { fill: INK, stroke: INK }); s.text(cx, y + 5, '✓', { fs: 14, anchor: 'middle', fill: '#fff', weight: 'bold' }); }
      else if (i === current) { s.circle(cx, y, 15, { sw: 3 }); s.text(cx, y + 5, String(i + 1), { fs: 13, anchor: 'middle', weight: 'bold' }); }
      else { s.circle(cx, y, 15, { stroke: MID }); s.text(cx, y + 5, i === n - 1 ? '✓' : String(i + 1), { fs: 13, anchor: 'middle', fill: GREY }); }
      s.text(cx, y + 40, t, { fs: 13, anchor: 'middle', weight: i === current ? 'bold' : 'normal', fill: i > current ? GREY : INK });
    });
    this.y = y + 70;
    s.line(this.fx, this.y, this.fx + this.fw, this.y, { stroke: MID, sw: 1 });
  }

  close(notes) {
    const s = this.s, H = this.y - this.fy + 2;
    const c = new Svg();
    c.rect(this.fx, this.fy, this.fw, H, { fill: '#fff', stroke: INK, sw: 1.6, rx: 6 });
    c.line(this.fx, this.fy + 28, this.fx + this.fw, this.fy + 28, { sw: 1 });
    [0, 1, 2].forEach(i => c.circle(this.fx + 16 + i * 14, this.fy + 14, 4, { sw: 1 }));
    c.rect(this.fx + 70, this.fy + 7, 380, 14, { stroke: MID, sw: 1, rx: 7 });
    c.text(this.fx + 82, this.fy + 18, this.url, { fs: 9.5, fill: GREY });
    s.p.splice(this.start, 0, ...c.p);
    for (const [n, x, y] of this.pins) s.pin(x, y, n, notes[n - 1].startsWith('?'));
    return this.fy + H;
  }
}

// ---------------------------------------------------------------- téléphone
class Phone {
  constructor(s, x, y, label, h = 760) {
    const w = 360;
    Object.assign(this, { s, x, y, w, h, sx: x + 14, sw: w - 28, cy: y + 52, pins: [] });
    s.text(x, y - 14, label, { fs: 12, fill: GREY, weight: 'bold', ls: 1.5 });
    s.rect(x, y, w, h, { rx: 34, sw: 2.2 });
    s.rect(x + w / 2 - 44, y + 14, 88, 18, { fill: INK, stroke: INK, rx: 9 });
  }
  pin(n, x, y) { this.pins.push([n, x, y]); }
  header(o = {}) {
    const s = this.s, y = this.cy, h = 50;
    s.text(this.sx + 8, y + 30, 'MAISON LEMONY', { fs: 12.5, weight: 'bold', ls: 2 });
    if (o.close) s.text(this.sx + this.sw - 12, y + 32, '✕', { fs: 18, anchor: 'end' });
    else [0, 1, 2].forEach(i => s.line(this.sx + this.sw - 34, y + 18 + i * 7, this.sx + this.sw - 10, y + 18 + i * 7, { sw: 2 }));
    s.line(this.x + 1, y + h, this.x + this.w - 1, y + h, { stroke: MID, sw: 1 });
    this.cy += h;
  }
  done(notes) { for (const [n, x, y] of this.pins) this.s.pin(x, y, n, notes[n - 1].startsWith('?')); }
}

// ---------------------------------------------------------------- planche
const SHEET_W = 1760;
function sheet(file, def) {
  const s = new Svg();
  s.text(30, 54, `${def.num} · ${def.title}`, { fs: 30, weight: 'bold' });
  s.text(30, 84, def.sub, { fs: 15.5, fill: GREY });
  s.text(SHEET_W - 30, 36, 'MAISON LEMONY · SITE COMPLET · WIREFRAME BASSE FIDÉLITÉ · ARBORESCENCE B · OCT. 2026', { fs: 10.5, fill: GREY, anchor: 'end', ls: 1 });
  s.text(SHEET_W - 30, 58, def.where, { fs: 13, fill: GREY, anchor: 'end' });

  const bottom = def.draw(s, def.notes);

  // Colonne de notes
  const nx = def.notesX || 1270;
  let ny = 140;
  s.text(nx, ny, 'CE QU\'IL FAUT REGARDER', { fs: 11.5, fill: GREY, weight: 'bold', ls: 1.5 });
  ny += 34;
  def.notes.forEach((n, i) => {
    const red = n.startsWith('?');
    const t = red ? n.slice(1).trim() : n;
    s.pin(nx + 13, ny, i + 1, red);
    ny += s.text(nx + 38, ny + 5, wrap(t, def.wrapN || 54), { fs: 14, fill: red ? RED : INK, lh: 1.35 }) + 18;
  });
  // Légende
  ny += 20;
  s.line(nx, ny, SHEET_W - 30, ny, { stroke: MID, sw: 1 });
  ny += 30;
  const leg = [
    [() => s.btn(nx, ny - 15, 'Action', 'primary', { h: 26, fs: 11, w: 70 }), 'Action principale (une seule par écran)'],
    [() => s.btn(nx, ny - 15, 'Lien', 'secondary', { h: 26, fs: 11, w: 70 }), 'Action secondaire'],
    [() => s.img(nx, ny - 15, 70, 26), 'Image (le texte dit ce qu\'elle montre)'],
    [() => s.rect(nx, ny - 15, 70, 26, { stroke: RED, dash: '6 4' }), 'Non tranché / à produire'],
    [() => s.pin(nx + 35, ny - 2, 'n'), 'Renvoi vers une note'],
  ];
  for (const [draw, t] of leg) { draw(); s.text(nx + 86, ny + 2, t, { fs: 12.5, fill: GREY }); ny += 38; }

  const H = Math.max(bottom, ny) + 50;
  fs.writeFileSync(path.join(OUT, file + '.svg'), s.render(SHEET_W, H));
  console.log('ok', file, Math.ceil(H));
}

// Une page desktop sur une planche
const desktop = (build, url) => (s, notes) => { const P = new Page(s, 30, 120, 1200, url); build(P); return P.close(notes); };

// ================================================================= 00 · Éléments communs
sheet('00_elements-communs', {
  num: '00', title: 'Éléments communs',
  sub: 'En-tête, pied de page et menu mobile : ce qui se répète sur toutes les pages.',
  where: 'Toutes les pages',
  notes: [
    'Menu court : 3 liens et 1 bouton. « Composer ma cave » reste visible partout. Il passe en contour dans le configurateur et sur Rendez-vous, où la page a déjà son propre bouton principal.',
    'Le lien de la page en cours est en gras et souligné : on sait toujours où l\'on est.',
    'L\'en-tête garde le même aspect quand on fait défiler. Sur le site actuel, il passe au blanc sur une page noire et casse l\'ambiance.',
    'Le pied de page porte ce qu\'on cherche sans le vouloir en premier : services (entretien, CITES, délais), légal, adresse de l\'atelier, téléphone direct.',
    'Plus de bulles flottantes mail et téléphone : sur mobile, elles masquaient le contenu. Le téléphone direct est dans le menu et le pied de page.',
    'Sur mobile, le menu s\'ouvre en plein écran. Le bouton principal et le téléphone sont en bas, là où le pouce arrive sans effort.',
    '? Version anglaise dès le lancement, ou en phase 2 ? La clientèle visée (Genève, Monaco, yachting) la rend presque indispensable.',
    '? Accessoires (étuis, flasques, plateaux) : aucune place prévue dans ce menu. À confirmer avec Sam avant d\'en créer une.',
  ],
  draw(s, notes) {
    // En-tête desktop
    const P = new Page(s, 30, 120, 1200);
    P.header('La Maison');
    P.pin(1, P.x0 + P.cw - 93, P.y - 58);
    P.pin(2, P.x0 + P.cw - 400, P.y - 18);
    P.pin(3, P.x0 + 300, P.y - 36);
    s.img(P.fx + 1, P.y, P.fw - 2, 110, 'Contenu de la page');
    P.y += 110;
    P.footer();
    P.pin(4, P.x0 + 520, P.footerY + 50);
    P.pin(5, P.x0 - 24, P.footerY + 107);
    const b = P.close(notes);
    // Mobile : en-tête + menu ouvert
    const yM = b + 70;
    const M1 = new Phone(s, 30, yM, 'MOBILE · EN-TÊTE', 520);
    M1.header();
    s.img(M1.sx, M1.cy + 12, M1.sw, 200, 'Photo de la page');
    s.text(M1.sx + 10, M1.cy + 250, 'Titre de la page', { fs: 18, weight: 'bold' });
    s.bars(M1.sx + 10, M1.cy + 266, M1.sw - 40, 4);
    s.btn(M1.sx + 10, M1.cy + 330, 'Composer ma cave', 'primary', { w: M1.sw - 20, h: 44 });
    M1.done(notes);
    const M2 = new Phone(s, 430, yM, 'MOBILE · MENU OUVERT', 520);
    M2.header({ close: true });
    ['Composer ma cave', 'Matières', 'La Maison', 'Rendez-vous'].forEach((l, i) => {
      s.text(M2.sx + 14, M2.cy + 50 + i * 54, l, { fs: 22, weight: i === 2 ? 'bold' : 'normal' });
      s.line(M2.sx + 14, M2.cy + 68 + i * 54, M2.sx + M2.sw - 14, M2.cy + 68 + i * 54, { stroke: MID, sw: 1 });
    });
    s.text(M2.sx + 14, M2.cy + 262, 'FR · EN', { fs: 13, weight: 'bold', fill: GREY });
    s.btn(M2.sx + 14, M2.y + 520 - 130, 'Composer ma cave', 'primary', { w: M2.sw - 28, h: 46 });
    s.btn(M2.sx + 14, M2.y + 520 - 74, 'Appeler Sam', 'secondary', { w: M2.sw - 28, h: 46 });
    M2.pin(6, M2.x + M2.w + 4, M2.y + 520 - 100);
    M2.done(notes);
    const P2 = { x: 840, y: yM };
    s.rect(P2.x, P2.y, 390, 140, { stroke: RED, dash: '6 4' });
    s.text(P2.x + 20, P2.y + 36, 'FR · EN', { fs: 18, weight: 'bold', fill: RED });
    s.text(P2.x + 20, P2.y + 64, wrap('Le sélecteur de langue est déjà prévu dans l\'en-tête et le pied de page.', 48), { fs: 13, fill: RED });
    s.pin(P2.x + 390, P2.y, 7, true);
    s.rect(P2.x, P2.y + 170, 390, 140, { stroke: RED, dash: '6 4' });
    s.text(P2.x + 20, P2.y + 206, 'Accessoires ?', { fs: 18, weight: 'bold', fill: RED });
    s.text(P2.x + 20, P2.y + 234, wrap('Pas de rubrique tant que le périmètre n\'est pas confirmé. Option : une section en bas de « Composer ma cave ».', 48), { fs: 13, fill: RED });
    s.pin(P2.x + 390, P2.y + 170, 8, true);
    return yM + 520;
  },
});

// ================================================================= 01 · Accueil
sheet('01_accueil', {
  num: '01', title: 'Accueil',
  sub: 'Faire désirer, rassurer, puis faire entrer dans la composition ou dans la conversation avec Sam.',
  where: 'Accueil',
  notes: [
    '? Le premier écran est une photo fixe et réelle (pas de rendu IA). La cave interactive est mise de côté : elle pourra remplacer cette photo plus tard sans rien changer au reste de la page.',
    'Deux portes dès le premier écran : composer (bouton plein, l\'action voulue) ou parler à Sam (simple lien) pour ceux qui ne veulent pas configurer seuls.',
    'Les preuves arrivent juste sous la photo : à ce prix, la légitimité de Sam rassure avant tout le reste.',
    '? Citer Hermès et Cigar and Spice : accord à obtenir avant la mise en ligne.',
    'Le « comment ça marche » répond à la question muette « et après, je m\'engage à quoi ? ». Il désamorce la peur de cliquer sur Composer.',
    '? Délai de fabrication à confirmer avec Sam. C\'est l\'une des premières questions des clients.',
    '? Prix « à partir de » sous chaque collection : à afficher ou non ? Ça change beaucoup la qualité des demandes reçues.',
    'Sam est montré en personne : on achète une pièce à quelqu\'un, pas à une marque anonyme.',
    '? Témoignage client : texte et autorisation à obtenir (Cigar and Spice, La Pyramide).',
    'La page se termine sur les deux mêmes portes qu\'au début : celui qui a tout lu n\'a pas à remonter.',
  ],
  draw: desktop(P => {
    P.header();
    P.hero({
      h: 620, red: true, kicker: 'MAISON LEMONY · VIENNE, FRANCE',
      title: 'La haute maroquinerie\nfrançaise, au service\ndu cigare.',
      sub: 'Caves à cigares gainées à la main, en cuirs précieux. Chaque pièce est unique et numérotée.',
      primary: 'Composer ma cave', secondary: 'Prendre rendez-vous avec Sam',
      imgLabel: 'Photo réelle : cave ouverte, lumière rasante',
    });
    P.pin(1, P.x0 + P.cw - 20, P.y - 70);
    P.pin(2, P.heroBtnX - 22, P.heroBtnY - 8);
    P.proofs(['Ex-Hermès, responsable de fabrication', 'Maître Artisan d\'Art', '100 % main, point sellier', '? Cigar and Spice, Genève']);
    P.pin(3, P.x0 - 22, P.y - 32);
    P.pin(4, P.x0 + P.cw + 2, P.y - 64);
    P.sectionHead('COMMENT ÇA MARCHE', 'Votre cave en trois temps');
    P.pin(5, P.x0 - 22, P.y - 46);
    P.steps3([
      { t: 'Composer', s: 'Taille, cuir, coloris, bois, métal, gravure. Environ cinq minutes, sans engagement.' },
      { t: 'Échanger avec Sam', s: 'En visio, à l\'atelier de Vienne, ou chez vous.' },
      { t: 'Recevoir votre pièce', s: 'Fabriquée à la main, livrée avec son certificat.', red: 'Délai : ? semaines' },
    ]);
    P.pin(6, P.x0 + 2 * ((P.cw - 80) / 3 + 40) + 200, P.y - 46);
    P.sectionHead('PARTIR D\'UN MODÈLE', 'Quatre collections', 'Voir tous les modèles →');
    P.cards([
      { t: 'Héritage', s: 'Veau, bovin, agneau, chèvre', link: 'À partir de ? €', img: 'Packshot réel' },
      { t: 'Élégance', s: 'Lézard, autruche', link: 'À partir de ? €', img: 'Packshot réel' },
      { t: 'Excellence', s: 'Python', link: 'À partir de ? €', img: 'Packshot réel' },
      { t: 'Prestige', s: 'Alligator porosus, niloticus', link: 'À partir de ? €', img: 'Packshot réel' },
    ], { imgH: 240 });
    P.pin(7, P.x0 + 120, P.y - 8);
    P.sectionHead('MATIÈRES', 'Le bois soutient. Le cuir révèle.', 'Toutes les matières →');
    P.cards([
      { t: 'Alligator', img: 'Macro' }, { t: 'Python', img: 'Macro' }, { t: 'Autruche', img: 'Macro' },
      { t: 'Noyer américain', img: 'Macro' }, { t: 'Tulipier noir', img: 'Macro' }, { t: 'Carbone', img: 'Macro' },
    ], { cols: 6, imgH: 130, gap: 16 });
    P.split({
      kicker: 'LA MAISON', title: 'Sam Basmadjian,\nmaroquinier, ex-Hermès', img: 'Portrait réel de Sam à l\'établi', imgRed: true,
      text: 'Troisième génération de tanneurs, Maître Artisan d\'Art depuis 2026.', lines: 4, link: 'L\'histoire de la Maison →',
    });
    P.pin(8, P.splitText[0] - 24, P.splitText[1] + 34);
    P.quote({ text: 'Texte du témoignage client, deux ou trois lignes au maximum, sur la pièce et la relation avec Sam.', author: 'CIGAR AND SPICE · GENÈVE', red: true });
    P.pin(9, P.fx + P.fw / 2 + 40, P.quoteY - 30);
    P.band({ title: 'Votre cave, votre signature.', sub: 'Chaque pièce naît d\'une conversation.', primary: 'Composer ma cave', secondary: 'Prendre rendez-vous' });
    P.pin(10, P.bandBtn[0] - 24, P.bandBtn[1]);
    P.footer();
  }),
});

// ================================================================= 02 · Composer — une étape
const STEPS = ['Taille', 'Cuir', 'Coloris', 'Bois', 'Métal', 'Gravure', 'Récapitulatif'];
sheet('02_composer-etape', {
  num: '02', title: 'Composer ma cave — une étape',
  sub: 'Exemple : l\'étape 2, le choix du cuir. Les 6 étapes suivent le même gabarit.',
  where: 'Accueil › Composer ma cave › Étape 2 : Cuir',
  notes: [
    'Les étapes restent visibles en haut : on sait où l\'on en est et ce qui reste. Un clic sur une étape terminée permet d\'y revenir.',
    '? Zone de visualisation volontairement vide : photos ou 3D, la décision est mise de côté. Le reste de l\'écran fonctionne dans les deux cas.',
    'On choisit d\'abord un cuir, la collection en découle. Pas besoin de connaître les noms Héritage ou Prestige pour avancer.',
    'Le cuir choisi a un cadre épais et un rond plein : jamais la seule couleur pour dire « sélectionné ».',
    '« Découvrir ce cuir » ouvre un panneau par-dessus, pas une nouvelle page : on ne perd pas sa composition.',
    'Le résumé se remplit au fil des étapes. On voit ce qu\'on a déjà décidé sans revenir en arrière.',
    'Un seul bouton plein, en bas à droite : c\'est là qu\'on arrive quand on a choisi. « Retour » reste en contour.',
    '? Sauvegarder pour plus tard (lien envoyé par e-mail) ? Utile pour une décision à plusieurs semaines, mais demande un e-mail tôt.',
    'Le visiteur qui hésite a une sortie : partir d\'un modèle, ou parler à Sam directement.',
  ],
  draw: desktop(P => {
    const s = P.s;
    P.header(null, { quiet: true });
    P.stepper(STEPS, 1);
    P.pin(1, P.x0 + 90, P.y - 88);
    const y = P.y + 40, lw = 600, rx = P.x0 + 650, rw = P.cw - 650;
    // Visualisation (non tranchée)
    s.rect(P.x0, y, lw, 560, { fill: SOFT, stroke: RED, sw: 1.6, dash: '8 5' });
    s.text(P.x0 + lw / 2, y + 260, 'VISUALISATION DE LA CAVE', { fs: 15, anchor: 'middle', fill: RED, weight: 'bold', ls: 2 });
    s.text(P.x0 + lw / 2, y + 290, ['Photos réelles ou modèle 3D :', 'décision mise de côté pour l\'instant'], { fs: 14, anchor: 'middle', fill: RED, italic: true });
    ['Face', 'Ouverte', 'Détail'].forEach((t, i) => {
      s.rect(P.x0 + i * 96, y + 580, 84, 60, { fill: SOFT, stroke: RED, dash: '5 3', sw: 1.2 });
      s.text(P.x0 + i * 96 + 42, y + 615, t, { fs: 12, anchor: 'middle', fill: RED });
    });
    P.pin(2, P.x0 + lw - 14, y + 14);
    // Panneau de choix
    let cy = y + 6;
    s.text(rx, cy, 'ÉTAPE 2 SUR 6', { fs: 11.5, fill: GREY, ls: 2, weight: 'bold' });
    s.text(rx, cy + 36, 'Choisissez le cuir', { fs: 28, weight: 'bold' });
    s.text(rx, cy + 64, 'Le cuir détermine la collection et les coloris proposés.', { fs: 14, fill: '#555' });
    P.pin(3, rx - 26, cy + 30);
    cy += 92;
    const opts = [
      ['Veau', 'Collection Héritage · souple, patine avec le temps'],
      ['Lézard', 'Collection Élégance · écaille fine'],
      ['Autruche', 'Collection Élégance · grain perlé'],
      ['Python', 'Collection Excellence · écailles larges'],
      ['Alligator (porosus, niloticus)', 'Collection Prestige · la pièce maîtresse'],
    ];
    opts.forEach(([t, d], i) => {
      const sel = i === 4, h = 74;
      s.rect(rx, cy, rw, h, { stroke: sel ? INK : MID, sw: sel ? 3 : 1.2 });
      s.img(rx + 10, cy + 10, 54, 54);
      s.text(rx + 80, cy + 32, t, { fs: 15.5, weight: 'bold' });
      s.text(rx + 80, cy + 54, d, { fs: 12.5, fill: '#555' });
      s.circle(rx + rw - 26, cy + h / 2, 10, { sw: 1.5 });
      if (sel) s.circle(rx + rw - 26, cy + h / 2, 5, { fill: INK, stroke: 'none' });
      if (sel) { P.pin(4, rx + rw + 4, cy + h / 2); }
      cy += h + 10;
    });
    s.text(rx, cy + 18, 'Découvrir ce cuir →', { fs: 14, weight: 'bold' });
    P.pin(5, rx + 160, cy + 13);
    cy += 44;
    s.rect(rx, cy, rw, 92, { fill: SOFT, stroke: 'none' });
    s.text(rx + 16, cy + 26, 'VOTRE COMPOSITION', { fs: 11, fill: GREY, ls: 1.5, weight: 'bold' });
    s.text(rx + 16, cy + 52, ['Taille : 150 cigares · Cuir : Alligator', 'Coloris — · Bois — · Métal — · Gravure —'], { fs: 13.5 });
    P.pin(6, rx + rw + 4, cy + 20);
    cy += 116;
    s.btn(rx, cy, '← Taille', 'secondary', { w: 130 });
    s.btn(rx + rw - 230, cy, 'Continuer : coloris →', 'primary', { w: 230 });
    P.pin(7, rx + rw + 4, cy + 22);
    s.text(rx, cy + 84, 'Recevoir ma composition par e-mail', { fs: 13, fill: RED, weight: 'bold' });
    s.line(rx, cy + 89, rx + tw('Recevoir ma composition par e-mail', 13), cy + 89, { stroke: RED, sw: 1, dash: '3 2' });
    P.pin(8, rx + 250, cy + 79);
    P.y = Math.max(y + 640, cy + 100);
    // Sortie pour les hésitants
    const by = P.y + 50;
    s.rect(P.x0, by, P.cw, 86, { stroke: MID, sw: 1 });
    s.text(P.x0 + 24, by + 38, 'Vous hésitez ?', { fs: 16, weight: 'bold' });
    s.text(P.x0 + 24, by + 62, 'Partez d\'un modèle existant, ou parlez de votre projet à Sam.', { fs: 13.5, fill: '#555' });
    s.btn(P.x0 + P.cw - 430, by + 21, 'Partir d\'un modèle', 'secondary', { w: 190 });
    s.btn(P.x0 + P.cw - 210, by + 21, 'Parler à Sam', 'secondary', { w: 190 });
    P.pin(9, P.x0 - 22, by + 40);
    P.y = by + 86 + 40;
  }, 'maison-lemony.com/composer'),
});

// ================================================================= 03 · Composer — récapitulatif
sheet('03_composer-recapitulatif', {
  num: '03', title: 'Composer ma cave — récapitulatif',
  sub: 'La fin du parcours : relire, corriger, puis envoyer à Sam.',
  where: 'Accueil › Composer ma cave › Récapitulatif',
  notes: [
    'Le récapitulatif a un fond gris et pas de cadre de saisie : on comprend qu\'il se lit et ne se modifie pas ici. Chaque ligne a son lien « Modifier » qui ramène à l\'étape concernée.',
    'Exemple de gravure volontairement long : la mise en page doit tenir avec un nom à rallonge.',
    '? Prix : estimation affichée, fourchette, ou « sur devis » ? À trancher avec Sam et Laurent.',
    '? Délai indicatif : à confirmer avec Sam (capacité de l\'atelier par mois).',
    'L\'action principale n\'est pas « payer » mais « envoyer à Sam » : à ce prix, la vente se conclut en conversation.',
    'Le PDF est secondaire : utile pour en parler autour de soi (associé, conjoint, club) avant de s\'engager.',
    'Trois réassurances au moment de décider : fabrication, CITES, garantie. Pas avant, pas après.',
    '? Durée et contenu de la garantie à définir.',
  ],
  draw: desktop(P => {
    const s = P.s;
    P.header(null, { quiet: true });
    P.stepper(STEPS, 6);
    const y = P.y + 40, lw = 520, rx = P.x0 + 580, rw = P.cw - 580;
    s.rect(P.x0, y, lw, 460, { fill: SOFT, stroke: RED, sw: 1.6, dash: '8 5' });
    s.text(P.x0 + lw / 2, y + 220, 'VISUALISATION DE LA CAVE', { fs: 15, anchor: 'middle', fill: RED, weight: 'bold', ls: 2 });
    s.text(P.x0 + lw / 2, y + 248, 'Décision mise de côté', { fs: 14, anchor: 'middle', fill: RED, italic: true });
    s.text(P.x0, y + 494, 'Composition créée le 31 octobre 2026', { fs: 13, fill: GREY });
    let cy = y + 6;
    s.text(rx, cy, 'RÉCAPITULATIF', { fs: 11.5, fill: GREY, ls: 2, weight: 'bold' });
    s.text(rx, cy + 36, 'Votre cave', { fs: 30, weight: 'bold' });
    cy += 60;
    const rows = [
      ['Taille', '150 cigares · 405 × 285 × 128 mm'],
      ['Collection', 'Prestige'],
      ['Cuir', 'Alligator niloticus'],
      ['Coloris', 'Shadow Blue, finition mate'],
      ['Bois', 'Noyer américain (intérieur sipo)'],
      ['Métal', 'Noir PVD'],
      ['Gravure', '« J.-M. de La Rochefoucauld-Montbel · N° 027 »'],
      ['Inclus', 'Hygromètre LEM-01, humidificateur ACPL-01'],
    ];
    const rh = 44;
    s.rect(rx, cy, rw, rows.length * rh + 16, { fill: SOFT, stroke: 'none' });
    rows.forEach(([k, v], i) => {
      const ry = cy + 8 + i * rh;
      if (i) s.line(rx + 16, ry, rx + rw - 16, ry, { stroke: '#ddd', sw: 1 });
      s.text(rx + 16, ry + 28, k, { fs: 13, fill: GREY });
      s.text(rx + 130, ry + 28, v, { fs: 14 });
      if (k !== 'Inclus') s.text(rx + rw - 16, ry + 28, 'Modifier', { fs: 12.5, anchor: 'end', weight: 'bold' });
    });
    P.pin(1, rx - 24, cy + 20);
    P.pin(2, rx + rw + 4, cy + 8 + 6 * rh + 22);
    cy += rows.length * rh + 30;
    s.rect(rx, cy, rw / 2 - 8, 70, { stroke: RED, dash: '6 4' });
    s.text(rx + 16, cy + 28, 'PRIX', { fs: 11, fill: RED, ls: 1.5, weight: 'bold' });
    s.text(rx + 16, cy + 52, 'Estimation ou sur devis ?', { fs: 15, fill: RED, weight: 'bold' });
    s.rect(rx + rw / 2 + 8, cy, rw / 2 - 8, 70, { stroke: RED, dash: '6 4' });
    s.text(rx + rw / 2 + 24, cy + 28, 'DÉLAI INDICATIF', { fs: 11, fill: RED, ls: 1.5, weight: 'bold' });
    s.text(rx + rw / 2 + 24, cy + 52, '? semaines', { fs: 15, fill: RED, weight: 'bold' });
    P.pin(3, rx - 24, cy + 35);
    P.pin(4, rx + rw + 4, cy + 35);
    cy += 96;
    s.btn(rx, cy, 'Envoyer à Sam et choisir un rendez-vous', 'primary', { w: rw, h: 52, fs: 15 });
    P.pin(5, rx + rw + 4, cy + 26);
    cy += 70;
    s.btn(rx, cy, 'Télécharger le PDF', 'secondary', { w: 230 });
    s.text(rx + rw, cy + 27, 'Recommencer', { fs: 13.5, anchor: 'end', fill: GREY });
    P.pin(6, rx + 254, cy + 22);
    cy += 70;
    P.y = Math.max(y + 520, cy);
    P.proofs(['Fabriquée à la main à Vienne', 'Certificat CITES fourni', '? Garantie : durée ?'], { top: 50 });
    P.pin(7, P.x0 - 22, P.y - 32);
    P.pin(8, P.x0 + P.cw + 2, P.y - 64);
    P.y += 50;
  }, 'maison-lemony.com/composer/recapitulatif'),
});

// ================================================================= 04 · Collection
sheet('04_collection', {
  num: '04', title: 'Partir d\'un modèle — une collection',
  sub: 'Exemple : Prestige. Même gabarit pour Héritage, Élégance, Excellence et les Éditions.',
  where: 'Accueil › Composer ma cave › Partir d\'un modèle › Prestige',
  notes: [
    'Les collections sont des onglets, pas des entrées de menu : on compare en un clic, et le menu reste court.',
    'L\'action principale de la page : composer à partir de cette collection (le cuir est déjà choisi).',
    'Chaque modèle ouvre le configurateur déjà rempli (cuir et coloris). Il ne reste qu\'à choisir taille, bois, métal et gravure.',
    'Données d\'exemple volontairement inégales : nom long, édition limitée, coloris épuisé. La grille doit tenir dans tous ces cas.',
    '? Quels coloris existent en vraie photo ? Seuls ceux-là sont affichés : les rendus IA sont retirés.',
    'Les dimensions sont en tableau : c\'est une information qu\'on compare, pas qu\'on lit.',
    '? Les tailles 200 et 300+ citées dans la presse existent-elles ?',
  ],
  draw: desktop(P => {
    const s = P.s;
    P.header();
    P.breadcrumb(['Composer ma cave', 'Partir d\'un modèle', 'Prestige']);
    P.tabs(['Héritage', 'Élégance', 'Excellence', 'Prestige', 'Éditions'], 'Prestige');
    P.pin(1, P.x0 + 560, P.y - 12);
    P.split({ top: 40, h: 420, kicker: 'COLLECTION PRESTIGE', title: 'L\'alligator,\ndans sa plus belle expression', img: 'Packshot réel : cave Prestige ouverte', text: 'Porosus et niloticus, sélectionnés peau par peau. Brillant ou mat.', lines: 4, btn: 'Composer à partir de Prestige' });
    P.pin(2, P.splitBtn[0] - 24, P.splitBtn[1]);
    P.sectionHead('LES MODÈLES', 'Vingt-deux coloris, et des éditions');
    P.cards([
      { t: 'Black', s: 'Alligator niloticus, brillant', link: 'Choisir ce modèle →', img: 'Packshot réel' },
      { t: 'Cognac', s: 'Alligator porosus, brillant', link: 'Choisir ce modèle →', img: 'Packshot réel' },
      { t: 'Polar White', tag: 'Édition', s: 'Alligator niloticus, mat', link: 'Choisir ce modèle →', img: 'Packshot réel' },
      { t: 'Shadow Blue', tag: 'Édition', s: 'Alligator niloticus, mat', link: 'Choisir ce modèle →', img: 'Packshot réel' },
      { t: 'Niloticus Vert Bouteille, finition mate et satinée', s: 'Nom long : la carte doit tenir', link: 'Choisir ce modèle →', img: 'Packshot réel' },
      { t: 'Carbone', tag: 'Édition limitée · 3 pièces', s: 'Alligator + finition carbone', link: 'Choisir ce modèle →', img: 'Packshot réel' },
      { t: 'Miel', s: 'Épuisé pour l\'instant', link: 'Être prévenu →', img: 'Packshot réel' },
      { t: 'Coloris sans photo réelle', s: 'Masqué tant qu\'il n\'est pas photographié', red: true, img: 'Rendu IA : retiré', imgRed: true },
    ], { imgH: 220 });
    P.pin(3, P.x0 + 160, P.rowsY[0] + 220 + 76);
    P.pin(4, P.x0 + P.cardW - 4, P.rowsY[1] + 4);
    P.pin(5, P.x0 + P.cw + 2, P.y - 140);
    P.sectionHead('CARACTÉRISTIQUES', 'Deux tailles');
    const ty = P.y, cols = [0, 220, 470], tw2 = 700;
    [['Taille', 'Extérieur', 'Intérieur'], ['100 cigares', '375 × 245 × 119 mm', '330 × 220 × 101 mm'], ['150 cigares', '405 × 285 × 128 mm', '360 × 240 × 109 mm'], ['200 / 300+ ?', '—', '—']].forEach((r, i) => {
      const ry = ty + i * 46;
      s.line(P.x0, ry + 46, P.x0 + tw2, ry + 46, { stroke: MID, sw: 1 });
      r.forEach((c, j) => s.text(P.x0 + cols[j], ry + 30, c, { fs: i ? 15 : 12, fill: i === 3 ? RED : i ? INK : GREY, weight: i ? 'normal' : 'bold' }));
    });
    P.pin(6, P.x0 + tw2 + 4, ty + 20);
    P.pin(7, P.x0 + 160, ty + 3 * 46 + 24);
    const lx = P.x0 + 780;
    s.text(lx, ty + 22, 'INCLUS DANS CHAQUE CAVE', { fs: 11, fill: GREY, ls: 1.5, weight: 'bold' });
    s.text(lx, ty + 52, ['Hygromètre LEM-01', 'Humidificateur ACPL-01', 'Plateau amovible, séparateurs', 'Assise velours noir', 'Serrure, deux clés acier'], { fs: 14.5, lh: 1.6 });
    P.y = ty + 4 * 46;
    P.sectionHead('LES AUTRES COLLECTIONS', null);
    P.cards([{ t: 'Héritage', s: 'Veau, bovin, agneau, chèvre' }, { t: 'Élégance', s: 'Lézard, autruche' }, { t: 'Excellence', s: 'Python' }], { cols: 3, imgH: 150 });
    P.band({ title: 'Une couleur en tête qui n\'est pas ici ?', sub: 'Sam peut sourcer une peau sur demande.', primary: 'Composer à partir de Prestige', secondary: 'En parler à Sam' });
    P.footer();
  }, 'maison-lemony.com/composer/prestige'),
});

// ================================================================= 05 · Matières
sheet('05_matieres', {
  num: '05', title: 'Matières',
  sub: 'La bibliothèque des cuirs, bois, métaux et instruments. On y vient pour comprendre, on en repart pour composer.',
  where: 'Accueil › Matières',
  notes: [
    'Sommaire en haut : la page est longue, on saute directement à ce qu\'on cherche.',
    'La collection est écrite sous chaque cuir : c\'est le pont entre le vocabulaire de la matière (python) et celui de la gamme (Excellence).',
    'Chaque cuir a sa page détaillée (planche 06).',
    'Le sipo est noté « toujours à l\'intérieur » : ce n\'est pas un choix, il n\'apparaît donc pas comme une option dans le configurateur.',
    '? Vidéos des gestes : à tourner à l\'atelier. Rien d\'exploitable aujourd\'hui.',
    'La page finit sur l\'action principale : après avoir regardé les matières, on a envie de les combiner.',
  ],
  draw: desktop(P => {
    const s = P.s;
    P.header('Matières');
    const y = P.y + 80;
    s.text(P.x0, y, 'MATIÈRES', { fs: 11.5, fill: GREY, ls: 2, weight: 'bold' });
    s.text(P.x0, y + 50, 'La structure existe pour servir la matière.', { fs: 38, weight: 'bold' });
    s.text(P.x0, y + 86, 'Le bois soutient. Le cuir révèle.', { fs: 18, italic: true, fill: '#555' });
    let ax = P.x0;
    ['Les cuirs', 'Les essences', 'Les métaux', 'Les instruments', 'Les gestes'].forEach(t => {
      const w = tw(t, 14) + 36;
      s.rect(ax, y + 116, w, 36, { stroke: INK, sw: 1, rx: 18 });
      s.text(ax + w / 2, y + 139, t, { fs: 14, anchor: 'middle' });
      ax += w + 12;
    });
    P.pin(1, ax + 10, y + 134);
    P.y = y + 152;
    P.sectionHead('LES CUIRS', 'Cinq peaux, quatre collections');
    P.cards([
      { tag: 'Héritage', t: 'Veau', link: 'Découvrir →', img: 'Macro réelle du grain' },
      { tag: 'Élégance', t: 'Lézard', link: 'Découvrir →', img: 'Macro réelle' },
      { tag: 'Élégance', t: 'Autruche', link: 'Découvrir →', img: 'Macro réelle' },
      { tag: 'Excellence', t: 'Python', link: 'Découvrir →', img: 'Macro réelle' },
      { tag: 'Prestige', t: 'Alligator', link: 'Découvrir →', img: 'Macro réelle' },
    ], { cols: 5, imgH: 200, gap: 18 });
    P.pin(2, P.x0 - 22, P.y - 62);
    P.pin(3, P.x0 + 110, P.y - 10);
    P.sectionHead('LES ESSENCES', 'Six bois');
    P.cards([
      { t: 'Sipo', s: 'Toujours à l\'intérieur', img: 'Macro' }, { t: 'Noyer américain', img: 'Macro' }, { t: 'Tulipier noir', img: 'Macro' },
      { t: 'Bambou caramel', img: 'Macro' }, { t: 'Érable sycomore', img: 'Macro' }, { t: 'Carbone', s: 'Finition spéciale', img: 'Macro' },
    ], { cols: 6, imgH: 140, gap: 16 });
    P.pin(4, P.x0 + 158, P.y - 18);
    P.sectionHead('LES MÉTAUX', 'Charnières, serrure, clés');
    P.cards([{ t: 'Doré poli', img: 'Photo' }, { t: 'Argent poli', img: 'Photo' }, { t: 'Noir PVD', img: 'Photo' }], { cols: 3, imgH: 120 });
    P.split({ kicker: 'LES INSTRUMENTS', title: 'Signés Lemony', img: 'Photo réelle : LEM-01 et ACPL-01', facts: ['Hygromètre LEM-01 · 55 mm · ±5 %', 'Humidificateur ACPL-01'], lines: 3, h: 280 });
    P.sectionHead('LES GESTES', 'À l\'atelier');
    P.cards([
      { t: 'La coupe', img: 'Vidéo courte réelle', imgRed: true }, { t: 'Le parage', img: 'Vidéo courte réelle', imgRed: true },
      { t: 'Le point sellier', img: 'Vidéo courte réelle', imgRed: true }, { t: 'Le gainage', img: 'Vidéo courte réelle', imgRed: true },
    ], { imgH: 180 });
    P.pin(5, P.x0 + P.cw + 2, P.y - 140);
    P.band({ title: 'Composer avec ces matières', primary: 'Composer ma cave', h: 190 });
    P.pin(6, P.bandBtn[0] - 24, P.bandBtn[1]);
    P.footer();
  }, 'maison-lemony.com/matieres'),
});

// ================================================================= 06 · Un cuir
sheet('06_matiere-cuir', {
  num: '06', title: 'Matières — un cuir',
  sub: 'Exemple : l\'alligator. Même gabarit pour les quatre autres cuirs.',
  where: 'Accueil › Matières › Les cuirs › Alligator',
  notes: [
    '« Composer avec ce cuir » ouvre le configurateur à l\'étape Coloris, le cuir déjà choisi.',
    '? Origine des peaux et fournisseurs : ce que Sam accepte de dire publiquement.',
    'Chaque coloris a son nom écrit sous la pastille : jamais la couleur seule. C\'est aussi le vocabulaire que Sam emploie au téléphone.',
    'Cliquer sur un coloris l\'ajoute directement au configurateur.',
    '? Texte CITES à valider (pays visés : Suisse, Monaco, États-Unis, Moyen-Orient ?). Rassurant pour le client, à condition d\'être exact.',
    'Entretien juste à côté : c\'est la question suivante de quelqu\'un qui achète une peau exotique.',
  ],
  draw: desktop(P => {
    const s = P.s;
    P.header('Matières');
    P.breadcrumb(['Matières', 'Les cuirs', 'Alligator']);
    P.split({ top: 20, h: 480, kicker: 'COLLECTION PRESTIGE', title: 'Alligator', img: 'Macro réelle des écailles, lumière rasante', imgRed: true, text: 'Texte court sur le caractère de la peau, sa tenue dans le temps, ce qui la rend rare.', lines: 3, facts: ['Espèces : porosus, niloticus', 'Finitions : brillant, mat', '? Origine des peaux'], btn: 'Composer avec ce cuir' });
    P.pin(1, P.splitBtn[0] - 24, P.splitBtn[1]);
    P.pin(2, P.splitText[0] + 300, P.splitBtn[1] - 60);
    P.sectionHead('COLORIS', 'Vingt-deux coloris');
    const names = ['Black', 'Cognac', 'Havane', 'Miel', 'Bordeaux', 'Shadow Blue', 'Polar White', 'Gris Anthracite', 'Vert Bouteille', 'Chocolat', 'Marine', 'Rouge Ferrari'];
    const per = 6, cwid = P.cw / per;
    names.forEach((n, i) => {
      const x = P.x0 + (i % per) * cwid + cwid / 2, y = P.y + Math.floor(i / per) * 120 + 40;
      s.circle(x, y, 36, { fill: i === 0 ? '#555' : LIGHT, stroke: MID });
      s.text(x, y + 62, n, { fs: 13.5, anchor: 'middle' });
    });
    P.pin(3, P.x0 + cwid / 2 + 46, P.y + 10);
    P.pin(4, P.x0 + cwid * 1.5 + 46, P.y + 10);
    P.y += 240;
    s.text(P.x0, P.y + 10, 'Voir les 10 autres coloris', { fs: 14, weight: 'bold' });
    P.y += 20;
    const by = P.y + 60, bw = (P.cw - 30) / 2;
    s.text(P.x0 + 30, by + 44, 'Export et certificat CITES', { fs: 19, weight: 'bold', fill: RED });
    s.bars(P.x0 + 30, by + 66, bw - 60, 5);
    s.text(P.x0 + 30, by + 150, 'CITES & export : tout savoir →', { fs: 14, weight: 'bold' });
    s.rect(P.x0, by, bw, 220, { fill: 'none', stroke: RED, sw: 1.4, dash: '6 4' });
    P.pin(5, P.x0 + bw - 14, by + 14);
    s.rect(P.x0 + bw + 30, by, bw, 220, { stroke: MID, sw: 1 });
    s.text(P.x0 + bw + 60, by + 44, 'Entretien', { fs: 19, weight: 'bold' });
    s.bars(P.x0 + bw + 60, by + 66, bw - 60, 5);
    s.text(P.x0 + bw + 60, by + 150, 'Entretien & garantie →', { fs: 14, weight: 'bold' });
    P.pin(6, P.x0 + bw * 2 + 16, by + 14);
    P.y = by + 220;
    P.sectionHead('LES AUTRES CUIRS', null);
    P.cards([{ t: 'Veau', tag: 'Héritage' }, { t: 'Lézard', tag: 'Élégance' }, { t: 'Autruche', tag: 'Élégance' }, { t: 'Python', tag: 'Excellence' }], { imgH: 140 });
    P.footer();
  }, 'maison-lemony.com/matieres/alligator'),
});

// ================================================================= 07 · La Maison
sheet('07_la-maison', {
  num: '07', title: 'La Maison',
  sub: 'L\'histoire de Sam, la légitimité, l\'atelier. C\'est la page qui justifie le prix.',
  where: 'Accueil › La Maison',
  notes: [
    '? Portrait de Sam à produire : aucune photo de lui aujourd\'hui, hormis un post Instagram.',
    'Les chiffres clés sont gros et courts : ils se lisent en trois secondes, avant le texte.',
    '? Citer Hermès : vérifier ce qui peut être dit (poste, durée) et obtenir l\'accord si nécessaire.',
    '? Projet d\'atelier-boutique en centre-ville de Vienne : l\'annoncer maintenant, ou attendre l\'ouverture ?',
    'Les références sont triées pour le cigare : on garde les noms qui parlent à cette clientèle, pas la liste complète du site actuel.',
    'Ici, l\'action principale devient le rendez-vous : celui qui vient de lire l\'histoire de Sam veut le rencontrer.',
  ],
  draw: desktop(P => {
    P.header('La Maison');
    P.hero({ h: 560, red: true, kicker: 'LA MAISON', title: 'Sam Basmadjian,\nMaître Artisan d\'Art', sub: 'Maroquinier à Vienne (Isère), troisième génération de tanneurs.', imgLabel: 'Portrait réel : Sam à l\'établi' });
    P.pin(1, P.x0 + P.cw - 20, P.y - 70);
    P.stats([['3', 'générations de tanneurs'], ['187ᵉ', 'Maître Artisan d\'Art en Isère'], ['2017', 'création de la Maison à Vienne'], ['100 %', 'fait main, point sellier']]);
    P.pin(2, P.x0 - 22, P.y - 60);
    P.split({ kicker: 'L\'HÉRITAGE', title: 'Une famille de tanneurs,\nà Pont-Évêque', img: 'Photo d\'archive de la tannerie familiale', lines: 5 });
    P.split({ flip: true, kicker: 'HERMÈS', title: 'Responsable de fabrication\nchez Hermès', img: 'Photo réelle : Sam, gestes de précision', lines: 5, text: 'Petite maroquinerie, sacs, bagagerie. Puis la haute horlogerie suisse.' });
    P.pin(3, P.splitText[0] - 24, P.splitText[1] - 4);
    P.split({ kicker: 'L\'ATELIER', title: 'À Vienne, au bord du Rhône', img: 'Photo réelle de l\'atelier', lines: 3, facts: ['Atelier · Vienne (Isère) · sur rendez-vous', '? Futur atelier-boutique en centre-ville'], link: 'Visiter l\'atelier sur rendez-vous →' });
    P.pin(4, P.splitText[0] + 420, P.splitText[1] + 196);
    P.sectionHead('ILS NOUS FONT CONFIANCE', null);
    P.proofs(['La Pyramide · Vienne, 2 étoiles', 'Cigar and Spice · Genève', 'Jazz à Vienne · partenaire 2023', 'Haute horlogerie suisse'], { top: 0, h: 80 });
    P.pin(5, P.x0 - 22, P.y - 40);
    P.sectionHead('PRESSE', null);
    P.cards([{ t: 'Le Dauphiné Libéré', s: 'Titre de l\'article, date', img: 'Coupure' }, { t: 'L\'Essor', s: 'Titre de l\'article, date', img: 'Coupure' }, { t: 'Magazine de la CMA', s: 'Octobre 2026', img: 'Couverture' }], { cols: 3, imgH: 160 });
    P.band({ title: 'Rencontrer Sam', sub: 'En visio, à l\'atelier, ou chez vous.', primary: 'Prendre rendez-vous', secondary: 'Composer ma cave' });
    P.pin(6, P.bandBtn[0] - 24, P.bandBtn[1]);
    P.footer();
  }, 'maison-lemony.com/la-maison'),
});

// ================================================================= 08 · Rendez-vous
sheet('08_rendez-vous', {
  num: '08', title: 'Rendez-vous',
  sub: 'Formulaire qualifié. Exemple : le visiteur arrive du configurateur, sa composition est déjà là.',
  where: 'Accueil › Rendez-vous',
  notes: [
    'La composition arrive pré-remplie, en lecture seule (fond gris). Sans composition, ce bloc devient « Pas encore de composition ? Décrivez votre projet » avec un lien vers Composer.',
    'Le projet « professionnel » remplace une rubrique Professionnels : golf, yacht, hôtellerie passent par ici, Sam les rappelle.',
    '? Demander le budget : très utile pour Sam, mais peut freiner. À trancher.',
    'Seuls 3 champs sont obligatoires (astérisque) : nom, e-mail, format. Chaque champ en plus fait abandonner des visiteurs.',
    'Le bouton d\'envoi dit ce qui se passe (« Demander mon rendez-vous »), pas « Envoyer ».',
    'Un visage et un téléphone direct à côté du formulaire : on écrit à quelqu\'un, pas à une adresse « contact@ ».',
    '? Délai de réponse promis : 24 h, 48 h ? À afficher seulement si c\'est tenable.',
    'Les 4 questions qui bloquent une décision, fermées par défaut : elles ne prennent pas de place mais répondent avant qu\'on les pose.',
  ],
  draw: desktop(P => {
    const s = P.s;
    P.header('Rendez-vous', { quiet: true });
    const y = P.y + 80;
    s.text(P.x0, y, 'RENDEZ-VOUS PRIVÉ', { fs: 11.5, fill: GREY, ls: 2, weight: 'bold' });
    s.text(P.x0, y + 50, 'Chaque pièce naît d\'une conversation.', { fs: 38, weight: 'bold' });
    s.text(P.x0, y + 84, 'Sam vous répond personnellement.', { fs: 17, fill: '#555' });
    let cy = y + 140;
    const lw = 660, rx = P.x0 + 740, rw = P.cw - 740;
    // Composition pré-remplie
    s.rect(P.x0, cy, lw, 110, { fill: SOFT, stroke: 'none' });
    s.img(P.x0 + 16, cy + 16, 78, 78);
    s.text(P.x0 + 112, cy + 32, 'VOTRE COMPOSITION', { fs: 11, fill: GREY, ls: 1.5, weight: 'bold' });
    s.text(P.x0 + 112, cy + 58, ['Cave 150 cigares · Prestige · Alligator niloticus Shadow Blue mat', 'Noyer américain · Noir PVD · Gravure « J.-M. de La Rochefoucauld… »'], { fs: 13.5 });
    s.text(P.x0 + lw - 16, cy + 32, 'Modifier', { fs: 13, anchor: 'end', weight: 'bold' });
    P.pin(1, P.x0 - 22, cy + 20);
    cy += 150;
    s.text(P.x0, cy, 'Votre projet', { fs: 12.5, weight: 'bold' });
    let rxx = P.x0;
    [['Pour moi', true], ['Un cadeau', false], ['Projet professionnel (golf, yacht, hôtellerie…)', false]].forEach(([t, on]) => { rxx += s.radio(rxx, cy + 32, t, on); });
    P.pin(2, P.x0 + lw + 4, cy + 26);
    cy += 70;
    s.text(P.x0, cy, 'Format du rendez-vous *', { fs: 12.5, weight: 'bold' });
    rxx = P.x0;
    [['En visio', true], ['À l\'atelier de Vienne', false], ['Chez vous ou à bord', false]].forEach(([t, on]) => { rxx += s.radio(rxx, cy + 32, t, on); });
    cy += 70;
    const half = (lw - 24) / 2;
    s.field(P.x0, cy, half, 'Échéance souhaitée', { ph: 'Choisir…', select: true });
    s.field(P.x0 + half + 24, cy, half, 'Budget envisagé', { ph: 'Choisir une fourchette…', select: true, red: true });
    P.pin(3, P.x0 + lw + 4, cy + 30);
    cy += 84;
    s.field(P.x0, cy, half, 'Nom', { req: true, ph: '' });
    s.field(P.x0 + half + 24, cy, half, 'E-mail', { req: true, ph: '' });
    P.pin(4, P.x0 + lw + 4, cy + 30);
    cy += 84;
    s.field(P.x0, cy, half, 'Téléphone', { ph: 'Pour être rappelé' });
    s.field(P.x0 + half + 24, cy, half, 'Pays', { ph: 'Choisir…', select: true });
    cy += 84;
    s.field(P.x0, cy, lw, 'Message (facultatif)', { area: true, ph: 'Une idée, une contrainte, une date…' });
    cy += 136;
    cy += s.check(P.x0, cy, wrap('J\'accepte que Maison Lemony utilise ces informations pour me recontacter au sujet de ma demande.', 90), false) + 20;
    s.btn(P.x0 + lw - 280, cy, 'Demander mon rendez-vous', 'primary', { w: 280, h: 52, fs: 15 });
    P.pin(5, P.x0 + lw + 4, cy + 26);
    // Colonne Sam
    let ay = y + 140;
    s.img(rx, ay, rw, 260, 'Portrait réel de Sam', true);
    ay += 290;
    s.text(rx, ay, ['Vous échangez directement', 'avec Sam Basmadjian.'], { fs: 19, weight: 'bold' });
    ay += 64;
    s.text(rx, ay, 'TÉLÉPHONE DIRECT', { fs: 11, fill: GREY, ls: 1.5, weight: 'bold' });
    s.text(rx, ay + 26, '+33 0 00 00 00 00', { fs: 18 });
    ay += 64;
    s.text(rx, ay, 'ATELIER', { fs: 11, fill: GREY, ls: 1.5, weight: 'bold' });
    s.text(rx, ay + 26, ['Vienne (Isère)', 'Visites sur rendez-vous'], { fs: 15 });
    P.pin(6, rx + rw + 4, y + 440);
    ay += 80;
    s.rect(rx, ay, rw, 56, { stroke: RED, dash: '6 4' });
    s.text(rx + 18, ay + 34, 'Réponse sous ? h ouvrées', { fs: 15, fill: RED, weight: 'bold' });
    P.pin(7, rx + rw + 4, ay + 28);
    P.y = cy + 52;
    P.sectionHead('AVANT DE NOUS ÉCRIRE', 'Les questions fréquentes');
    P.accordion(['Quels sont les délais de fabrication ?', 'Livrez-vous à l\'étranger ? (certificat CITES)', 'Comment entretenir ma cave ?', 'Puis-je voir et toucher les matières avant de décider ?'], { top: 0 });
    P.pin(8, P.x0 - 22, P.y - 190);
    P.footer();
  }, 'maison-lemony.com/rendez-vous'),
});

// ================================================================= 09 · Confirmation + page de service
sheet('09_confirmation-et-services', {
  num: '09', title: 'Confirmation et pages de service',
  sub: 'Ce que voit le visiteur après l\'envoi, et le gabarit commun des pages du pied de page.',
  where: 'Rendez-vous › Confirmation  ·  Pied de page › Entretien & garantie',
  notes: [
    'Le message dit ce qui va se passer et quand, pas seulement « envoyé ». C\'est ce qui évite le coup de fil d\'inquiétude le lendemain.',
    'Le récapitulatif rappelle ce qui a été envoyé : le visiteur peut vérifier qu\'il n\'a rien oublié.',
    'Une seule suite proposée, discrète. Pas de bouton plein : le travail est fait, on ne pousse plus.',
    'Un seul gabarit pour toutes les pages de service : Entretien & garantie, CITES & export, Livraison & délais.',
    'Le sommaire reste fixe à gauche quand on fait défiler : ces pages sont consultées, pas lues d\'une traite.',
    '? Contenus à rédiger : durée de garantie, entretien du cuir et du bois, conditions de livraison et d\'export.',
  ],
  draw(s, notes) {
    const A = new Page(s, 30, 120, 1200, 'maison-lemony.com/rendez-vous/merci');
    A.header();
    const cx = A.fx + A.fw / 2;
    let y = A.y + 90;
    s.circle(cx, y, 32, { sw: 2 });
    s.text(cx, y + 11, '✓', { fs: 30, anchor: 'middle', weight: 'bold' });
    s.text(cx, y + 90, 'Votre demande est bien arrivée.', { fs: 32, anchor: 'middle', weight: 'bold' });
    s.rich(cx, y + 126, [['Sam vous recontacte sous ', '#555'], ['? h', RED, 'bold'], [' pour fixer votre rendez-vous en visio.', '#555']], { fs: 17, anchor: 'middle' });
    A.pin(1, cx + 290, y + 74);
    y += 170;
    s.rect(cx - 330, y, 660, 150, { fill: SOFT, stroke: 'none' });
    s.text(cx - 306, y + 32, 'CE QUE VOUS AVEZ ENVOYÉ', { fs: 11, fill: GREY, ls: 1.5, weight: 'bold' });
    s.text(cx - 306, y + 62, ['Cave 150 cigares · Prestige · Alligator niloticus Shadow Blue mat', 'Rendez-vous en visio · Échéance : printemps 2027', 'Copie envoyée à votre adresse e-mail'], { fs: 14.5, lh: 1.5 });
    A.pin(2, cx + 344, y + 20);
    y += 186;
    s.btn(cx - 270, y, 'Télécharger le récapitulatif (PDF)', 'secondary', { w: 300 });
    s.text(cx + 60, y + 27, 'En attendant, découvrir la Maison →', { fs: 14, weight: 'bold' });
    A.pin(3, cx + 330, y + 22);
    A.y = y + 110;
    const bA = A.close(notes);

    const B = new Page(s, 30, bA + 90, 1200, 'maison-lemony.com/entretien-garantie');
    s.text(30, bA + 66, 'GABARIT DES PAGES DE SERVICE', { fs: 12, fill: GREY, weight: 'bold', ls: 1.5 });
    B.header();
    B.breadcrumb(['Accueil', 'Entretien & garantie']);
    let by = B.y + 40;
    s.text(B.x0, by, 'Entretien & garantie', { fs: 38, weight: 'bold' });
    s.text(B.x0, by + 34, 'Comment prendre soin de votre cave, et ce que couvre la garantie.', { fs: 16, fill: '#555' });
    B.pin(4, B.x0 + 420, by - 10);
    by += 90;
    const sw = 260;
    s.text(B.x0, by, 'SUR CETTE PAGE', { fs: 11, fill: GREY, ls: 1.5, weight: 'bold' });
    ['L\'entretien du cuir', 'L\'entretien du bois', 'L\'humidification', 'La garantie', 'Réparations et restauration'].forEach((t, i) => {
      s.text(B.x0, by + 34 + i * 34, t, { fs: 14.5, weight: i === 0 ? 'bold' : 'normal' });
      if (i === 0) s.line(B.x0 - 12, by + 20 + i * 34, B.x0 - 12, by + 40 + i * 34, { sw: 3 });
    });
    B.pin(5, B.x0 + 200, by - 4);
    const tx = B.x0 + sw + 60, tw3 = B.cw - sw - 60;
    let ty = by - 6;
    [['L\'entretien du cuir', 6], ['L\'entretien du bois', 4], ['La garantie', 5]].forEach(([t, n], i) => {
      s.text(tx, ty + 20, t, { fs: 22, weight: 'bold', fill: i === 2 ? RED : INK });
      ty += 44 + s.bars(tx, ty + 40, tw3, n) + 20;
    });
    s.rect(tx - 14, ty - 150, tw3 + 28, 130, { fill: 'none', stroke: RED, dash: '6 4' });
    B.pin(6, tx + tw3 + 14, ty - 150);
    B.y = ty;
    B.accordion(['Puis-je confier ma cave pour une restauration ?', 'Que faire si l\'hygromètre affiche une valeur anormale ?'], { x: tx, w: tw3, top: 10 });
    B.band({ title: 'Une question sur votre cave ?', primary: 'Écrire à Sam', h: 180, top: 70 });
    B.y += 30;
    return B.close(notes);
  },
});

// ================================================================= 10 · Mobile
sheet('10_mobile', {
  num: '10', title: 'Sur mobile',
  sub: 'Les trois écrans où le mobile change le plus la mise en page : accueil, une étape du configurateur, rendez-vous.',
  where: 'Accueil · Composer ma cave · Rendez-vous',
  notesX: 1240, wrapN: 56,
  notes: [
    'Sur mobile, le titre apparaît tout de suite par-dessus la photo. Sur le site actuel, il disparaissait et ne laissait que deux boutons.',
    'Le bouton principal prend toute la largeur : il se vise au pouce sans effort.',
    '? Visualisation de la cave réduite à une bande en haut : photos ou 3D, toujours mis de côté.',
    'Les choix défilent en liste, un par ligne : c\'est plus lisible qu\'une grille sur un écran étroit.',
    'Barre fixe en bas d\'écran : le résumé et « Continuer » restent toujours accessibles, quelle que soit la longueur de la liste.',
    'Formulaire sur une seule colonne, le bouton d\'appel juste au-dessus : beaucoup préféreront téléphoner que remplir.',
  ],
  draw(s, notes) {
    const y0 = 150;
    // Accueil
    const A = new Phone(s, 30, y0, 'ACCUEIL');
    A.header();
    s.img(A.x + 1, A.cy, A.w - 2, 386, '', true);
    s.rect(A.sx + 10, A.cy + 146, A.sw - 20, 226, { stroke: INK, sw: 1 });
    s.text(A.sx + 26, A.cy + 180, 'MAISON LEMONY', { fs: 10, fill: GREY, ls: 2, weight: 'bold' });
    s.text(A.sx + 26, A.cy + 212, ['La haute maroquinerie', 'française, au service', 'du cigare.'], { fs: 20, weight: 'bold' });
    s.btn(A.sx + 26, A.cy + 288, 'Composer ma cave', 'primary', { w: A.sw - 52, h: 44, fs: 13 });
    s.text(A.sx + 26, A.cy + 352, 'Prendre rendez-vous avec Sam', { fs: 12.5, weight: 'bold' });
    A.pin(1, A.x + A.w - 6, A.cy + 160);
    A.pin(2, A.x + A.w - 6, A.cy + 310);
    let cy = A.cy + 404;
    ['Ex-Hermès', 'Maître Artisan d\'Art'].forEach((t, i) => {
      s.rect(A.sx + (i ? A.sw / 2 + 4 : 0), cy, A.sw / 2 - 4, 44, { stroke: MID, sw: 1 });
      s.text(A.sx + (i ? A.sw / 2 + 4 : 0) + A.sw / 4 - 2, cy + 27, t, { fs: 12, anchor: 'middle' });
    });
    cy += 76;
    s.text(A.sx + 4, cy, 'COMMENT ÇA MARCHE', { fs: 10, fill: GREY, ls: 1.5, weight: 'bold' });
    s.text(A.sx + 4, cy + 28, 'Votre cave en trois temps', { fs: 18, weight: 'bold' });
    s.bars(A.sx + 4, cy + 48, A.sw - 30, 3);
    A.done(notes);

    // Composer
    const C = new Phone(s, 430, y0, 'COMPOSER · ÉTAPE 2');
    C.header();
    s.text(C.sx + 6, C.cy + 26, 'Étape 2 sur 6 · Cuir', { fs: 12.5, weight: 'bold' });
    for (let i = 0; i < 7; i++) s.rect(C.sx + 6 + i * ((C.sw - 12) / 7), C.cy + 38, (C.sw - 12) / 7 - 4, 5, { fill: i < 2 ? INK : MID, stroke: 'none', rx: 2 });
    cy = C.cy + 56;
    s.rect(C.x + 1, cy, C.w - 2, 170, { fill: SOFT, stroke: RED, dash: '6 4', rx: 0 });
    s.text(C.x + C.w / 2, cy + 82, 'VISUALISATION', { fs: 12, anchor: 'middle', fill: RED, weight: 'bold', ls: 1.5 });
    s.text(C.x + C.w / 2, cy + 102, 'photos ou 3D : mis de côté', { fs: 11.5, anchor: 'middle', fill: RED, italic: true });
    C.pin(3, C.x + C.w - 6, cy + 14);
    cy += 190;
    s.text(C.sx + 6, cy + 10, 'Choisissez le cuir', { fs: 20, weight: 'bold' });
    cy += 28;
    [['Veau', 'Héritage'], ['Lézard', 'Élégance'], ['Autruche', 'Élégance'], ['Python', 'Excellence'], ['Alligator', 'Prestige']].forEach(([t, c], i) => {
      const sel = i === 4;
      s.rect(C.sx + 4, cy, C.sw - 8, 54, { stroke: sel ? INK : MID, sw: sel ? 2.6 : 1 });
      s.img(C.sx + 12, cy + 8, 38, 38);
      s.text(C.sx + 62, cy + 24, t, { fs: 14, weight: 'bold' });
      s.text(C.sx + 62, cy + 42, 'Collection ' + c, { fs: 11.5, fill: '#555' });
      s.circle(C.sx + C.sw - 26, cy + 27, 8, { sw: 1.4 });
      if (sel) s.circle(C.sx + C.sw - 26, cy + 27, 4, { fill: INK, stroke: 'none' });
      cy += 62;
    });
    C.pin(4, C.x + C.w - 6, cy - 300);
    const bb = C.y + C.h - 104;
    s.rect(C.x + 8, bb, C.w - 16, 80, { fill: '#fff', stroke: INK, sw: 1, rx: 4 });
    s.text(C.sx + 6, bb + 30, '150 cigares · Alligator', { fs: 12, fill: '#555' });
    s.btn(C.sx + 6, bb + 38, 'Continuer : coloris →', 'primary', { w: C.sw - 12, h: 32, fs: 12.5 });
    C.pin(5, C.x + C.w - 6, bb + 10);
    C.done(notes);

    // Rendez-vous
    const R = new Phone(s, 830, y0, 'RENDEZ-VOUS');
    R.header();
    cy = R.cy + 40;
    s.text(R.sx + 6, cy, ['Chaque pièce naît', 'd\'une conversation.'], { fs: 20, weight: 'bold' });
    cy += 60;
    s.btn(R.sx + 6, cy, 'Appeler Sam', 'secondary', { w: R.sw - 12, h: 40, fs: 13 });
    R.pin(6, R.x + R.w - 6, cy + 20);
    cy += 60;
    s.rect(R.sx + 6, cy, R.sw - 12, 64, { fill: SOFT, stroke: 'none' });
    s.text(R.sx + 18, cy + 24, 'VOTRE COMPOSITION', { fs: 10, fill: GREY, ls: 1.2, weight: 'bold' });
    s.text(R.sx + 18, cy + 46, 'Cave 150 · Prestige · Alligator…', { fs: 12.5 });
    cy += 86;
    s.text(R.sx + 6, cy, 'Format du rendez-vous *', { fs: 12, weight: 'bold' });
    [['En visio', true], ['À l\'atelier de Vienne', false], ['Chez vous ou à bord', false]].forEach(([t, on], i) => s.radio(R.sx + 6, cy + 30 + i * 28, t, on));
    cy += 116;
    s.field(R.sx + 6, cy, R.sw - 12, 'Nom', { req: true, h: 38 });
    cy += 76;
    s.field(R.sx + 6, cy, R.sw - 12, 'E-mail', { req: true, h: 38 });
    cy += 76;
    s.field(R.sx + 6, cy, R.sw - 12, 'Téléphone', { h: 38, ph: 'Pour être rappelé' });
    s.btn(R.sx + 6, R.y + R.h - 70, 'Demander mon rendez-vous', 'primary', { w: R.sw - 12, h: 44, fs: 13 });
    R.done(notes);
    return y0 + 760;
  },
});
