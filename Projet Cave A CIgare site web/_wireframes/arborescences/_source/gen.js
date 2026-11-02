// Génère les 3 planches d'arborescence (SVG) — Maison Lemony
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2];

const INK = '#1a1a1a', GREY = '#8a8a8a', LIGHT = '#ececec', RED = '#c62828', MID = '#bdbdbd';
const FONT = 'Arial, Helvetica, sans-serif';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(str, max) {
  const out = []; let line = '';
  for (const w of str.split(' ')) {
    if ((line + ' ' + w).trim().length > max) { out.push(line.trim()); line = w; }
    else line += ' ' + w;
  }
  if (line.trim()) out.push(line.trim());
  return out;
}

class Svg {
  constructor() { this.p = []; this.h = 0; }
  text(x, y, str, o = {}) {
    const { fs = 13, fill = INK, anchor = 'start', weight = 'normal', italic = false, ls = 0 } = o;
    const lines = Array.isArray(str) ? str : String(str).split('\n');
    const t = lines.map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : fs * 1.25}">${esc(l)}</tspan>`).join('');
    this.p.push(`<text x="${x}" y="${y}" font-family="${FONT}" font-size="${fs}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}"${italic ? ' font-style="italic"' : ''}${ls ? ` letter-spacing="${ls}"` : ''}>${t}</text>`);
    return lines.length * fs * 1.25;
  }
  rect(x, y, w, h, o = {}) {
    const { fill = '#fff', stroke = INK, sw = 1.5, dash = null, rx = 3 } = o;
    this.p.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
  }
  line(x1, y1, x2, y2, o = {}) {
    const { stroke = INK, sw = 1.2, dash = null, arrow = false } = o;
    this.p.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}${arrow ? ' marker-end="url(#arr)"' : ''}/>`);
  }
  circle(cx, cy, r, o = {}) {
    const { fill = '#fff', stroke = INK, sw = 1.2 } = o;
    this.p.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`);
  }
  img(x, y, w, h) { // emplacement image : boîte grise barrée
    this.rect(x, y, w, h, { fill: LIGHT, stroke: MID, sw: 1, rx: 2 });
    this.line(x, y, x + w, y + h, { stroke: MID, sw: 1 });
    this.line(x + w, y, x, y + h, { stroke: MID, sw: 1 });
  }
  bars(x, y, w, n, gap = 9) { // lignes de texte factices
    for (let i = 0; i < n; i++) this.rect(x, y + i * gap, i === n - 1 ? w * 0.6 : w, 4, { fill: MID, stroke: 'none', rx: 2 });
  }
  render(W, H) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${INK}"/></marker></defs>
<rect width="100%" height="100%" fill="#fff"/>
${this.p.join('\n')}
</svg>`;
  }
}

// ---------- Nœuds d'arborescence ----------
const KIND = {
  root: { fill: INK, stroke: INK, color: '#fff', weight: 'bold', fs: 15 },
  l1: { fill: '#fff', stroke: INK, sw: 2.2, color: INK, weight: 'bold', fs: 14 },
  cta: { fill: INK, stroke: INK, color: '#fff', weight: 'bold', fs: 14 },
  l2: { fill: '#fff', stroke: INK, sw: 1.1, color: INK, fs: 12 },
  l3: { fill: LIGHT, stroke: MID, sw: 1, color: INK, fs: 11.5 },
  tpl: { fill: LIGHT, stroke: GREY, sw: 1.1, dash: '4 3', color: INK, fs: 11.5, italic: true },
  open: { fill: '#fff', stroke: RED, sw: 1.4, dash: '5 3', color: RED, fs: 12 },
  open1: { fill: '#fff', stroke: RED, sw: 2.2, dash: '6 3', color: RED, weight: 'bold', fs: 14 },
};
function node(s, x, y, w, h, label, kind = 'l2') {
  const k = KIND[kind];
  s.rect(x, y, w, h, { fill: k.fill, stroke: k.stroke, sw: k.sw || 1.5, dash: k.dash });
  const lines = String(label).split('\n');
  const lh = k.fs * 1.25;
  const y0 = y + h / 2 - ((lines.length - 1) * lh) / 2 + k.fs * 0.36;
  s.text(x + w / 2, y0, lines, { fs: k.fs, fill: k.color, anchor: 'middle', weight: k.weight || 'normal', italic: k.italic });
}

// Colonne : en-tête de rubrique + sous-pages reliées par une épine
function column(s, x, y, w, head, items, headKind = 'l1', headH = 46) {
  node(s, x, y, w, headH, head, headKind);
  let cy = y + headH + 12;
  const spine2 = x + 10, spine3 = x + 30;
  let last2 = null, l3top = null, last3 = null;
  const closeL3 = () => { if (last3 !== null) s.line(spine3, l3top, spine3, last3, { stroke: GREY, sw: 1 }); last3 = null; };
  for (const it of items) {
    const o = typeof it === 'string' ? { label: it } : it;
    if (o.note) { // annotation libre sous la colonne
      closeL3();
      cy += s.text(x + 4, cy + 12, wrap(o.note, Math.floor(w / 6.3)), { fs: 11, fill: o.red ? RED : GREY, italic: true }) + 6;
      continue;
    }
    const lvl = o.lvl || 2;
    const lines = o.label.split('\n').length;
    const h = o.h || (lines > 1 ? 18 + lines * 14 : 28);
    if (lvl === 2) {
      closeL3();
      const bx = x + 22;
      node(s, bx, cy, w - 22, h, o.label, o.kind || 'l2');
      s.line(spine2, cy + h / 2, bx, cy + h / 2);
      last2 = cy + h / 2; l3top = cy + h;
    } else {
      const bx = x + 42;
      node(s, bx, cy, w - 42, h, o.label, o.kind || 'l3');
      s.line(spine3, cy + h / 2, bx, cy + h / 2, { stroke: GREY, sw: 1 });
      last3 = cy + h / 2;
    }
    cy += h + 8;
  }
  closeL3();
  if (last2 !== null) s.line(spine2, y + headH, spine2, last2);
  return cy;
}

// ---------- Maquette de page d'accueil (zoning) ----------
function homeFrame(s, x, y, w, blocks, caption) {
  s.text(x, y - 12, caption, { fs: 12, fill: GREY, weight: 'bold', ls: 1.5 });
  const ix = x + 14, iw = w - 28;
  let cy = y + 28 + 10;
  const parts = [];
  for (const b of blocks) {
    const h = b.h || 40;
    const lab = (t, red) => s.text(ix, cy - 3, t.toUpperCase(), { fs: 9, fill: red ? RED : GREY, ls: 1 });
    switch (b.type) {
      case 'nav': {
        s.rect(ix, cy, iw, h, { fill: '#fff', stroke: INK, sw: 1 });
        s.rect(ix + 10, cy + h / 2 - 9, 70, 18, { fill: '#fff', stroke: INK, sw: 1 });
        s.text(ix + 45, cy + h / 2 + 4, 'LEMONY', { fs: 10, anchor: 'middle', weight: 'bold', ls: 1 });
        const ctaW = b.ctaW || 110;
        const fsL = b.linkFs || 10, lx0 = ix + 96, lmax = ix + iw - ctaW - 20;
        const rows = [[]]; let lx = lx0;
        for (const l of b.links) {
          const lw = l.length * fsL * 0.56;
          if (lx + lw > lmax && rows[rows.length - 1].length) { rows.push([]); lx = lx0; }
          rows[rows.length - 1].push([lx, l]); lx += lw + 16;
        }
        const rh = fsL * 1.7, top = cy + h / 2 - ((rows.length - 1) * rh) / 2 + fsL * 0.36;
        rows.forEach((r, i) => r.forEach(([x, l]) => s.text(x, top + i * rh, l, { fs: fsL })));
        s.rect(ix + iw - ctaW - 8, cy + h / 2 - 11, ctaW, 22, { fill: INK, stroke: INK, rx: 2 });
        s.text(ix + iw - ctaW / 2 - 8, cy + h / 2 + 4, b.cta, { fs: 10, fill: '#fff', anchor: 'middle', weight: 'bold' });
        if (b.note) s.text(ix, cy + h + 12, b.note, { fs: 10.5, fill: b.red ? RED : GREY, italic: true });
        cy += h + (b.note ? 40 : 24);
        break;
      }
      case 'hero': {
        lab(b.label);
        s.img(ix, cy, iw, h);
        s.rect(ix + iw / 2 - 120, cy + h / 2 - 34, 240, 68, { fill: '#fff', stroke: INK, sw: 1 });
        s.text(ix + iw / 2, cy + h / 2 - 8, b.title, { fs: 14, anchor: 'middle', weight: 'bold' });
        s.text(ix + iw / 2, cy + h / 2 + 14, b.sub, { fs: 11, anchor: 'middle', fill: GREY, italic: true });
        if (b.swatches) {
          const n = b.swatches, r = 9, gap = 26, sx = ix + iw / 2 - ((n - 1) * gap) / 2;
          s.rect(ix + iw / 2 - 110, cy + h - 44, 220, 34, { fill: '#fff', stroke: INK, sw: 1 });
          for (let i = 0; i < n; i++) s.circle(sx + i * gap, cy + h - 27, r, { fill: i === 0 ? INK : '#fff' });
        }
        if (b.scroll) s.text(ix + iw / 2, cy + h - 12, '⌄  défiler', { fs: 11, anchor: 'middle', fill: GREY });
        cy += h + 18;
        break;
      }
      case 'text': {
        lab(b.label);
        s.rect(ix, cy, iw, h, { fill: '#fff', stroke: MID, sw: 1 });
        s.text(ix + iw / 2, cy + 24, b.title, { fs: 12.5, anchor: 'middle', italic: true });
        s.bars(ix + 70, cy + 38, iw - 140, Math.max(1, Math.floor((h - 44) / 10)));
        cy += h + 18;
        break;
      }
      case 'grid': {
        lab(b.label, b.red);
        const n = b.caps.length, g = 8, cw = (iw - g * (n - 1)) / n;
        b.caps.forEach((c, i) => {
          s.img(ix + i * (cw + g), cy, cw, h - 22);
          s.text(ix + i * (cw + g) + cw / 2, cy + h - 6, c, { fs: 10, anchor: 'middle' });
        });
        cy += h + 18;
        break;
      }
      case 'split': {
        lab(b.label);
        const hw = iw * 0.45;
        s.img(b.flip ? ix + iw - hw : ix, cy, hw, h);
        const tx = b.flip ? ix : ix + hw + 14;
        s.text(tx, cy + 18, b.title, { fs: 12.5, weight: 'bold' });
        s.bars(tx, cy + 30, iw - hw - 20, Math.floor((h - 50) / 10));
        if (b.link) s.text(tx, cy + h - 6, b.link, { fs: 10.5, fill: INK });
        cy += h + 18;
        break;
      }
      case 'proof': {
        lab(b.label);
        const n = b.items.length, g = 8, cw = (iw - g * (n - 1)) / n;
        b.items.forEach((c, i) => {
          s.rect(ix + i * (cw + g), cy, cw, h, { fill: '#fff', stroke: MID, sw: 1 });
          s.text(ix + i * (cw + g) + cw / 2, cy + h / 2 + 4, c, { fs: 10, anchor: 'middle' });
        });
        cy += h + 18;
        break;
      }
      case 'cta': {
        lab(b.label);
        s.rect(ix, cy, iw, h, { fill: LIGHT, stroke: 'none' });
        s.text(ix + iw / 2, cy + 24, b.title, { fs: 13, anchor: 'middle', weight: 'bold' });
        const bw = 170;
        const two = !!b.second;
        const bx = two ? ix + iw / 2 - bw - 6 : ix + iw / 2 - bw / 2;
        s.rect(bx, cy + h - 40, bw, 28, { fill: INK, stroke: INK, rx: 2 });
        s.text(bx + bw / 2, cy + h - 21, b.button, { fs: 11, fill: '#fff', anchor: 'middle', weight: 'bold' });
        if (two) {
          s.rect(ix + iw / 2 + 6, cy + h - 40, bw, 28, { fill: '#fff', stroke: INK, rx: 2 });
          s.text(ix + iw / 2 + 6 + bw / 2, cy + h - 21, b.second, { fs: 11, anchor: 'middle' });
        }
        cy += h + 18;
        break;
      }
      case 'chapter': {
        s.text(ix, cy - 3, b.num + '  ' + b.label.toUpperCase(), { fs: 9, fill: GREY, ls: 1 });
        if (b.inner === 'grid') {
          const n = 4, g = 6, cw = (iw - 30 - g * 3) / n;
          for (let i = 0; i < n; i++) s.img(ix + i * (cw + g), cy, cw, h);
        } else if (b.inner === 'strip') {
          const n = 5, g = 6, cw = (iw - 30 - g * 4) / n;
          for (let i = 0; i < n; i++) s.img(ix + i * (cw + g), cy, cw, h);
        } else if (b.inner === 'cta') {
          s.rect(ix, cy, iw - 30, h, { fill: LIGHT, stroke: 'none' });
          s.rect(ix + (iw - 30) / 2 - 85, cy + h / 2 - 14, 170, 28, { fill: INK, stroke: INK, rx: 2 });
          s.text(ix + (iw - 30) / 2, cy + h / 2 + 5, 'Demander un rendez-vous', { fs: 11, fill: '#fff', anchor: 'middle', weight: 'bold' });
        } else {
          s.img(ix, cy, iw - 30, h);
          s.rect(ix + 14, cy + h - 34, 220, 24, { fill: '#fff', stroke: INK, sw: 1 });
          s.text(ix + 24, cy + h - 18, b.phrase, { fs: 11, italic: true });
        }
        if (b.link) s.text(ix + iw - 34, cy + h + 12, b.link, { fs: 10, anchor: 'end' });
        b._y = cy + h / 2; parts.push(b);
        cy += h + (b.link ? 30 : 20);
        break;
      }
      case 'footer': {
        s.rect(ix, cy, iw, h, { fill: '#fff', stroke: INK, sw: 1 });
        s.bars(ix + 12, cy + 14, iw * 0.3, 3);
        s.bars(ix + iw * 0.38, cy + 14, iw * 0.25, 3);
        s.bars(ix + iw * 0.7, cy + 14, iw * 0.25, 3);
        s.text(ix + iw - 10, cy + h - 8, 'FR · EN', { fs: 10, anchor: 'end', weight: 'bold' });
        cy += h + 14;
        break;
      }
    }
  }
  // Index des chapitres (option C)
  const ch = parts.filter(p => p.type === 'chapter');
  if (ch.length) {
    const rx = ix + iw - 10;
    s.line(rx, ch[0]._y, rx, ch[ch.length - 1]._y, { stroke: MID, sw: 1 });
    ch.forEach((c, i) => { s.circle(rx, c._y, 6, { fill: i === 0 ? INK : '#fff', sw: 1 }); });
    s.text(rx, ch[0]._y - 14, 'index', { fs: 9, anchor: 'middle', fill: GREY });
  }
  const H = cy - y;
  // Cadre navigateur dessiné après coup, derrière : on l'insère en tête
  const chrome = new Svg();
  chrome.rect(x, y, w, H, { fill: '#fff', stroke: INK, sw: 1.6, rx: 6 });
  chrome.line(x, y + 28, x + w, y + 28, { sw: 1 });
  [0, 1, 2].forEach(i => chrome.circle(x + 16 + i * 14, y + 14, 4, { fill: '#fff', sw: 1 }));
  chrome.rect(x + 70, y + 7, w - 90, 14, { fill: '#fff', stroke: MID, sw: 1, rx: 7 });
  chrome.text(x + 80, y + 18, 'maison-lemony.com', { fs: 9.5, fill: GREY });
  return { chrome: chrome.p, bottom: y + H };
}

// ---------- Planche ----------
// La maquette d'accueil est dessinée en dernier, son cadre est réinséré dessous.
function sheetOrdered(opt) {
  const s = new Svg();
  const W = 1600;
  s.text(30, 48, opt.title, { fs: 26, weight: 'bold' });
  s.text(30, 76, opt.sub, { fs: 14.5, fill: GREY });
  s.text(W - 30, 30, 'MAISON LEMONY · ARBORESCENCE · WIREFRAME BASSE FIDÉLITÉ · OCT. 2026', { fs: 10, fill: GREY, anchor: 'end', ls: 1 });
  s.text(W - 30, 50, opt.tag, { fs: 11.5, fill: GREY, anchor: 'end' });
  const treeBottom = opt.tree(s);
  const fy = treeBottom + 14;
  s.rect(30, fy, 1010, 36, { fill: '#fff', stroke: GREY, sw: 1, dash: '4 3' });
  s.text(44, fy + 23, 'Pied de page (toutes les pages)  ·  ' + opt.footer, { fs: 11.5 });
  const ny = fy + 76;
  s.text(30, ny, 'LE PRINCIPE', { fs: 10.5, fill: GREY, weight: 'bold', ls: 1.5 });
  let yl = ny + 22;
  yl += s.text(30, yl, wrap(opt.principe, 112), { fs: 13.5 }) + 10;
  for (const p of opt.pour) yl += s.text(30, yl, wrap('+  ' + p, 128), { fs: 12.5 }) + 3;
  yl += 4;
  for (const c of opt.contre) yl += s.text(30, yl, wrap('–  ' + c, 128), { fs: 12.5, fill: '#444' }) + 3;
  // Non tranché, sous le principe pour ne pas serrer
  yl += 16;
  s.text(30, yl, 'NON TRANCHÉ', { fs: 10.5, fill: RED, weight: 'bold', ls: 1.5 });
  yl += 22;
  for (const q of opt.open) yl += s.text(30, yl, wrap('?  ' + q, 128), { fs: 12.5, fill: RED }) + 4;
  const ly = yl + 22;
  const leg = [['root', 'Point d\'entrée'], ['l1', 'Rubrique du menu'], ['l2', 'Sous-page'], ['l3', 'Section dans la page'], ['tpl', 'Gabarit répété'], ['cta', 'Action principale'], ['open', 'Non tranché']];
  let lx = 30;
  leg.forEach(([k, t]) => { node(s, lx, ly, 26, 16, '', k); s.text(lx + 33, ly + 12.5, t, { fs: 11, fill: GREY }); lx += 46 + t.length * 6 + 8; });

  const before = s.p.length;
  const hf = homeFrame(s, 1090, 112, 480, opt.home, 'CE QUE ÇA DONNE SUR L\'ACCUEIL');
  s.p.splice(before, 0, ...hf.chrome);
  const H = Math.max(ly + 40, hf.bottom + 30);
  return s.render(W, H);
}

// Racine + bus horizontal vers les colonnes
function rootAndBus(s, label, centers, rootY = 108, busY = 178) {
  const cx = 30 + 1010 / 2;
  node(s, cx - 90, rootY, 180, 40, label, 'root');
  s.line(cx, rootY + 40, cx, busY);
  s.line(Math.min(...centers), busY, Math.max(...centers), busY);
  centers.forEach(c => s.line(c, busY, c, busY + 20));
}

// =====================================================================
const A = {
  title: 'Option A — Le salon classique',
  sub: 'Une rubrique par sujet. Reprend l\'arborescence de départ de la fiche d\'immersion.',
  tag: '7 rubriques · 1 action principale : « Rendez-vous privé »',
  tree(s) {
    const w = 134, g = 12.6, x0 = 30, y = 198;
    const cols = [
      ['La Maison', ['Sam Basmadjian', 'Héritage tannerie', 'Hermès & Maître\nArtisan d\'Art', 'L\'atelier à Vienne', 'Presse']],
      ['Collections', ['Héritage', 'Élégance', 'Excellence', 'Prestige', 'Éditions\n(Black, Carbone…)', { label: 'Fiche d\'une cave\n(×n)', kind: 'tpl' }]],
      ['Savoir-faire', ['Les cuirs', 'Les essences\nde bois', 'Instruments\nLEM-01 · ACPL-01', 'Les gestes']],
      ['Sur-mesure', ['Le process\nen 4 temps', { label: 'Configurateur ?', kind: 'open' }, 'Gravure\n& marquage']],
      ['Accessoires ?', [{ label: 'Étuis', kind: 'open' }, { label: 'Flasques', kind: 'open' }, { label: 'Plateaux', kind: 'open' }]],
      ['Professionnels', ['Golf & clubs', 'Yachting', 'Hôtellerie\n& lounges', 'Cadeaux\nd\'affaires']],
      ['Rendez-vous\nprivé', ['Formulaire\nqualifié', 'Visio ou atelier', 'Téléphone direct']],
    ];
    const centers = cols.map((_, i) => x0 + i * (w + g) + w / 2);
    rootAndBus(s, 'Accueil', centers);
    let bottom = 0;
    cols.forEach(([h, items], i) => {
      const kind = i === 6 ? 'cta' : (h.endsWith('?') ? 'open1' : 'l1');
      bottom = Math.max(bottom, column(s, x0 + i * (w + g), y, w, h, items, kind));
    });
    // Recouvrement Savoir-faire / Sur-mesure
    s.line(centers[2] + 40, bottom + 4, centers[3] - 40, bottom + 4, { stroke: GREY, dash: '3 3' });
    s.text((centers[2] + centers[3]) / 2, bottom + 20, 'cuirs et bois présents des deux côtés', { fs: 10.5, fill: GREY, anchor: 'middle', italic: true });
    return bottom + 26;
  },
  footer: 'Entretien & garantie · CITES & export · Presse · Instagram · Mentions · Cookies · FR / EN',
  principe: 'Chaque sujet a sa porte d\'entrée. Le visiteur qui sait ce qu\'il cherche (une collection, l\'histoire de Sam, un projet pro) y va en un clic. C\'est la structure la plus familière et la plus simple à faire évoluer.',
  pour: ['Lisible tout de suite, aucun mode d\'emploi.', 'Bon pour Google : une page = un sujet = une recherche (« cave à cigares alligator », « humidor yacht »…).'],
  contre: ['7 rubriques + un bouton : le menu est chargé, il passera en menu burger dès la tablette.', 'Ça ressemble plus à un catalogue qu\'à un salon privé : on « consulte » plutôt qu\'on est reçu.', 'Savoir-faire et Sur-mesure se marchent dessus (les cuirs et les bois apparaissent dans les deux).'],
  open: ['Accessoires : rubrique à part entière, ou rien tant que Sam n\'a pas confirmé le périmètre ?', 'Configurateur : vraie page interactive, ou simple description du process ?', 'Prix : affichés, « à partir de », ou sur demande ? Ça change le contenu des fiches.'],
  home: [
    { type: 'nav', h: 58, links: ['La Maison', 'Collections', 'Savoir-faire', 'Sur-mesure', 'Accessoires', 'Professionnels'], cta: 'Rendez-vous privé', ctaW: 118, note: '6 liens + 1 bouton : le menu passe déjà sur deux lignes' },
    { type: 'hero', h: 200, label: 'Film d\'ouverture 30–60 s', title: 'MAISON LEMONY', sub: 'L\'art de préserver l\'exception' },
    { type: 'text', h: 74, label: 'Signature', title: '« La structure existe pour servir la matière. »' },
    { type: 'grid', h: 118, label: 'Les 4 collections', caps: ['Héritage', 'Élégance', 'Excellence', 'Prestige'] },
    { type: 'proof', h: 40, label: 'Preuves', items: ['Ex-Hermès', 'Maître Artisan d\'Art', 'La Pyramide', 'Cigar and Spice'] },
    { type: 'split', h: 100, label: 'Savoir-faire', title: 'Du geste à l\'émotion', link: 'Découvrir le savoir-faire →' },
    { type: 'split', h: 86, label: 'Professionnels', title: 'Golf, yacht, hôtellerie', link: 'Projets professionnels →', flip: true },
    { type: 'cta', h: 80, label: 'Conversion', title: 'Chaque pièce naît d\'une conversation.', button: 'Prendre rendez-vous' },
    { type: 'footer', h: 50 },
  ],
};

const B = {
  title: 'Option B — L\'Atelier de composition',
  sub: 'Le site tourne autour d\'un geste : composer sa cave. Tout le reste nourrit ce parcours.',
  tag: '4 rubriques · 1 action principale : « Composer ma cave »',
  tree(s) {
    const w = 236, g = 22.6, x0 = 30, y = 198;
    const cols = [
      ['Composer ma cave', [
        'Partir d\'un modèle',
        { label: 'Héritage · Élégance ·\nExcellence · Prestige', lvl: 3 },
        { label: 'Éditions (Black, Carbone…)', lvl: 3 },
        'Étape 1 · Taille (100 / 150)',
        'Étape 2 · Cuir',
        'Étape 3 · Coloris',
        'Étape 4 · Bois',
        'Étape 5 · Métal & serrure',
        'Étape 6 · Gravure',
        { label: 'Récapitulatif + PDF', kind: 'tpl' },
        { note: 'Le bouton final envoie la composition vers Rendez-vous.' },
      ], 'cta'],
      ['Matières', [
        'Les cuirs',
        { label: 'Veau · Lézard · Autruche ·\nPython · Alligator', lvl: 3 },
        'Les essences de bois',
        'Les instruments\nLEM-01 · ACPL-01',
        'Les gestes de l\'atelier',
        { note: 'Chaque matière a un bouton « Composer avec ce cuir » qui ouvre le configurateur déjà réglé.' },
      ], 'l1'],
      ['La Maison', ['Sam Basmadjian', 'Héritage & Hermès', 'Maître Artisan d\'Art', 'L\'atelier à Vienne', 'Presse'], 'l1'],
      ['Rendez-vous', [
        'Formulaire (pré-rempli\npar la composition)',
        'Visio, atelier ou chez vous',
        'Téléphone direct',
        'Projets professionnels\n(golf, yacht, hôtellerie)',
        { label: 'Accessoires ?', kind: 'open' },
      ], 'l1'],
    ];
    const centers = cols.map((_, i) => x0 + i * (w + g) + w / 2);
    rootAndBus(s, 'Accueil', centers);
    let bottom = 0;
    cols.forEach(([h, items, k], i) => { bottom = Math.max(bottom, column(s, x0 + i * (w + g), y, w, h, items, k)); });
    // Flèches de renvoi vers le configurateur
    s.line(centers[1] - 40, y + 23, centers[0] + w / 2 + 2, y + 23, { dash: '5 4', arrow: true, sw: 1.2 });
    s.text((centers[0] + centers[1]) / 2 + 10, y - 4, 'pré-règle', { fs: 10.5, fill: GREY, italic: true, anchor: 'middle' });
    return bottom;
  },
  footer: 'Entretien & garantie · CITES & export · Instagram · Mentions · Cookies · FR / EN',
  principe: 'On ne présente pas un catalogue, on invite à composer. Le visiteur essaie les cuirs, les bois, la gravure, et repart avec un récapitulatif qu\'il envoie à Sam. Le rendez-vous arrive en fin de parcours, avec une demande déjà précise.',
  pour: ['Différenciant : aucun concurrent artisan ne le propose. Le visiteur reste, joue, revient.', 'Le devis arrive qualifié : taille, cuir, bois et budget sont connus avant le premier appel.'],
  contre: ['Tout dépend des photos : il faut un vrai packshot par coloris, au même cadrage (et pas un rendu IA).', 'Le plus cher à développer et à maintenir des trois options.', 'Le visiteur qui veut seulement regarder est poussé à « faire » trop tôt.'],
  open: ['Combien de combinaisons existent en vraies photos ? C\'est ce qui fixe la taille du configurateur.', 'Afficher un prix estimé dans le récapitulatif, ou seulement au rendez-vous ?', 'Accessoires : pas de place naturelle dans ce parcours. À confirmer avec Sam.'],
  home: [
    { type: 'nav', links: ['Matières', 'La Maison', 'Rendez-vous'], cta: 'Composer ma cave', ctaW: 120 },
    { type: 'hero', h: 220, label: 'Cave interactive', title: 'Composez votre cave', sub: 'Changez le cuir, la pièce change sous vos yeux', swatches: 7 },
    { type: 'proof', h: 50, label: 'Comment ça marche', items: ['1 · Composer', '2 · Échanger avec Sam', '3 · Recevoir'] },
    { type: 'grid', h: 112, label: 'Ou partir d\'un modèle', caps: ['Héritage', 'Élégance', 'Excellence', 'Prestige'] },
    { type: 'grid', h: 82, label: 'Les matières', caps: ['Alligator', 'Python', 'Autruche', 'Noyer', 'Carbone'] },
    { type: 'split', h: 100, label: 'La Maison', title: 'Sam Basmadjian, ex-Hermès', link: 'L\'histoire de la Maison →' },
    { type: 'proof', h: 40, label: 'Preuves', items: ['Maître Artisan d\'Art', 'La Pyramide', 'Cigar and Spice'] },
    { type: 'cta', h: 84, label: 'Conversion', title: 'Votre cave, votre signature.', button: 'Composer ma cave', second: 'Prendre rendez-vous' },
    { type: 'footer', h: 50 },
  ],
};

const C = {
  title: 'Option C — Le récit',
  sub: 'L\'accueil se lit comme une visite privée en 5 chapitres. Peu de pages, mais profondes.',
  tag: '3 rubriques · 1 action principale : « Demander un rendez-vous »',
  tree(s) {
    // Racine à gauche + chaîne des chapitres
    node(s, 30, 120, 170, 58, 'Accueil\n= le récit', 'root');
    s.text(222, 108, 'CHAPITRES DE L\'ACCUEIL, DANS L\'ORDRE DU DÉFILEMENT', { fs: 9.5, fill: GREY, ls: 1.2 });
    const chW = 150, chG = 16, chX = 222;
    const chapters = ['I · Le geste\nSam, l\'atelier, les mains', 'II · La matière\ncuirs, bois, instruments', 'III · La pièce\nles 4 collections', 'IV · La signature\ngravure, numéro', 'V · Le rendez-vous\nl\'invitation'];
    const chC = [];
    s.line(200, 149, chX, 149, { arrow: true });
    chapters.forEach((c, i) => {
      const x = chX + i * (chW + chG);
      node(s, x, 120, chW, 58, c, 'l3');
      chC.push(x + chW / 2);
      if (i < 4) s.line(x + chW, 149, x + chW + chG, 149, { arrow: true });
    });
    // Rubriques
    const w = 310, g = 40, x0 = 30, y = 290, busY = 252;
    const centers = [0, 1, 2].map(i => x0 + i * (w + g) + w / 2);
    s.line(115, 178, 115, busY);
    s.line(115, busY, centers[2], busY);
    centers.forEach(c => s.line(c, busY, c, y));
    s.text(565, busY + 18, 'menu (toujours accessible)', { fs: 10.5, fill: GREY, italic: true });
    // Renvois chapitre → rubrique
    [[0, 0], [1, 0], [2, 1], [3, 2], [4, 2]].forEach(([c, r]) => {
      s.line(chC[c], 178, centers[r] + (c - 2) * 8, y - 2, { dash: '4 4', stroke: GREY, sw: 1 });
    });
    s.text(chC[4] + 4, 212, '« en savoir plus »', { fs: 10.5, fill: GREY, italic: true, anchor: 'start' });
    const cols = [
      ['La Maison', ['Sam Basmadjian', 'Héritage tannerie & Hermès', 'Maître Artisan d\'Art', 'L\'atelier à Vienne', 'Matières & savoir-faire', { label: 'Cuirs · Bois · Instruments · Gestes', lvl: 3 }, 'Presse'], 'l1'],
      ['Les Pièces', ['Héritage', 'Élégance', 'Excellence', 'Prestige', 'Éditions (Black, Carbone…)', { label: 'Pièce N° 0xx — page certificat\n(cuir, origine, date, artisan)', kind: 'tpl' }], 'l1'],
      ['Rendez-vous', ['Le sur-mesure en 4 temps', 'Formulaire qualifié', 'Visio, atelier ou chez vous', 'Téléphone direct', { label: 'Professionnels ?', kind: 'open' }, { label: 'Accessoires ?', kind: 'open' }], 'cta'],
    ];
    let bottom = 0;
    cols.forEach(([h, items, k], i) => { bottom = Math.max(bottom, column(s, x0 + i * (w + g), y, w, h, items, k)); });
    return bottom;
  },
  footer: 'Entretien & garantie · CITES & export · Presse · Instagram · Mentions · Cookies · FR / EN',
  principe: 'Le site se comporte comme une visite privée : on entre, on écoute l\'histoire dans l\'ordre, et chaque chapitre ouvre une porte vers une page où l\'on peut approfondir. Très peu de menu, beaucoup d\'image, un rythme lent.',
  pour: ['Colle à l\'idée « la lenteur comme luxe » et au positionnement salon privé.', 'Naturel sur mobile : on fait défiler, on ne cherche pas dans un menu.', 'Les pièces numérotées donnent une histoire à chaque cave vendue, et une preuve aux suivantes.'],
  contre: ['Repose entièrement sur des images et un film réels, qui n\'existent pas encore.', 'L\'accueil porte presque tout : moins de pages pour être trouvé sur Google.', 'Le visiteur pressé (un pro, un acheteur décidé) doit faire défiler pour trouver son info.'],
  open: ['Combien de pièces numérotées peut-on documenter dès le lancement (photos, accord des clients) ?', 'Le shooting + film à l\'atelier peut-il être fait avant la mise en ligne ?', 'Professionnels et Accessoires : pas de rubrique prévue. À confirmer avec Sam.'],
  home: [
    { type: 'nav', links: ['La Maison', 'Les Pièces'], cta: 'Rendez-vous', ctaW: 96 },
    { type: 'hero', h: 190, label: 'Film plein écran', title: 'MAISON LEMONY', sub: 'Là où le temps se suspend', scroll: true },
    { type: 'chapter', num: 'I', label: 'Le geste', h: 104, phrase: '« La main guide la matière… »', link: 'La Maison →' },
    { type: 'chapter', num: 'II', label: 'La matière', h: 66, inner: 'strip', link: 'Matières & savoir-faire →' },
    { type: 'chapter', num: 'III', label: 'La pièce', h: 76, inner: 'grid', link: 'Toutes les pièces →' },
    { type: 'chapter', num: 'IV', label: 'La signature', h: 90, phrase: 'Pièce N° 027 · Lausanne Palace' },
    { type: 'chapter', num: 'V', label: 'Le rendez-vous', h: 74, inner: 'cta' },
    { type: 'footer', h: 50 },
  ],
};

for (const [name, opt] of [['A_salon-classique', A], ['B_atelier-composition', B], ['C_recit', C]]) {
  fs.writeFileSync(path.join(OUT, `arbo_${name}.svg`), sheetOrdered(opt));
  console.log('ok', name);
}
