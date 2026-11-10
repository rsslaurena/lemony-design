// Génère les pages statiques de la maquette Maison Lemony.
// Usage : node maquette/_src/build.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ------------------------------------------------------------------ photos (Unsplash, licence Unsplash)
const P = {
  hero: ['photo-1607969892435-1063b49bc963', 'Carter Yocham', 'JYIoO7xysAU', 'Un artisan travaille une pièce de bois à l\'établi'],
  maison: ['photo-1607969891751-1374d59ab4fa', 'Carter Yocham', 'dFkLQt4R5ts', 'Un artisan assis dans son atelier'],
  mains: ['photo-1607969889406-f60ce0c51311', 'Carter Yocham', 'Mdl0o8Ze4s8', 'Les mains d\'un artisan au travail'],
  outils: ['photo-1647502191516-68a4f8c74ed4', 'Joel Lee', 'p2dpUK3AfCM', 'Outils de maroquinier alignés sur une planche'],
  poincon: ['photo-1531188929123-0cfa61e6c770', 'La Compagnie Robinson', 'KGQlg-K4VWA', 'Une main frappe une griffe dans le cuir'],
  veau: ['photo-1716295177956-420a647c83ac', 'Jayanth Muppaneni', 'm5o4dOHAibM', 'Cuir de veau couleur cognac, cousu'],
  fil: ['photo-1496180317060-d2026272f138', 'Dane Deaner', 'JNpmCYZID68', 'Fil de lin et règle posés sur une peau'],
  etabli: ['photo-1633419946251-6d8b5dd33170', 'Yasamine June', '2PMdixMFvvU', 'Un établi garni d\'outils'],
  croco_noir: ['photo-1731272832794-d66014ad7d87', 'Ksenia Pixelesse', 'lNbFhTFj35I', 'Peau d\'alligator noire en gros plan'],
  croco_miel: ['photo-1521748484217-0d9c5f3728d1', 'Anton Darius', 'xtqWk-gBe68', 'Peau à écailles brun miel en gros plan'],
  lezard: ['photo-1595066989325-465d1db69c99', 'engin akyurt', 'UV7FBSplWI0', 'Écailles fines et régulières en gros plan'],
  python: ['photo-1614999273262-edb2051c9368', 'Giulio Gabrieli', '9_uGTrQ6LOU', 'Peau de python grise en gros plan'],
  bois_fonce: ['photo-1546484396-fb3fc6f95f98', 'Joshua Bartell', '6vvIBTvL90A', 'Bois sombre au fil serré'],
  bois_noyer: ['photo-1582055193464-943584223be1', 'Patrick Fore', 'bg20VZvrfvY', 'Planche de noyer'],
  coffret: ['photo-1770816307472-945144576a1f', 'Tim Schmidbauer', 'BuZSvqpXghw', 'Coffret de bois au couvercle ouvert'],
  cave_coin: ['photo-1749842839761-e5ae74f82a30', 'Considerate Agency', 'S7tCPnB1zbE', 'Angle d\'une cave à cigares sombre et filet de laiton'],
  hygro: ['photo-1749842839703-a48d77cc76aa', 'Considerate Agency', 'SpArEhZ_EOE', 'Hygromètre à cadran sur le couvercle d\'une cave'],
  cle: ['photo-1677951570313-b0750351c461', 'Dima Solomin', 'LkoDqb5E3zg', 'Une clé de laiton dans sa serrure'],
  cave_ouverte: ['photo-1749842839713-dea4f1165499', 'Considerate Agency', 'Syqhp713L-M', 'Une cave à cigares ouverte'],
  cave_cigares: ['photo-1749842839766-8b71630a627d', 'Considerate Agency', 'ZWxKxRcxaas', 'Cigares rangés dans une cave ouverte'],
  vienne: ['photo-1699177304641-f6657491c0ff', 'Carnet de Voyage d\'Alex', 'ccCf12IHyJ4', 'Le théâtre antique de Vienne vu du ciel'],
};
const usedPhotos = new Set();
const url = (id, w, h) => `https://images.unsplash.com/${id}?w=${w}${h ? `&h=${h}` : ''}&q=72&auto=format&fit=crop`;
function img(key, o = {}) {
  const [id, , , alt] = P[key];
  usedPhotos.add(key);
  const { sizes = '(max-width: 860px) 100vw, 50vw', eager = false, cls = '' } = o;
  const set = [480, 800, 1200, 1800].map(w => `${url(id, w)} ${w}w`).join(', ');
  return `<img src="${url(id, 1200)}" srcset="${set}" sizes="${sizes}" alt="${alt}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"${cls ? ` class="${cls}"` : ''}>`;
}
// Crédits regroupés sur credits.html (pas de légende sous les photos, à la demande de l'équipe)
const cap = () => '';
const photo = (key, o = {}) => `<div class="photo${o.slow ? ' slow' : ''}">${img(key, o)}</div>${o.nocap ? '' : cap(key)}`;
const toShoot = (label, ratio = '3/4') => `<div class="to-shoot" style="aspect-ratio:${ratio}">${label}<br>photo à produire</div>`;
const arrow = '<svg class="arrow" viewBox="0 0 18 9" aria-hidden="true"><path d="M0 4.5h16.5M13 1l3.5 3.5L13 8" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>';
const arrowOut = '<svg class="arrow-out" viewBox="0 0 30 12" aria-hidden="true"><path d="M0 6h28M23 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>';
const note = t => `<p class="note"><b>À valider</b> ${t}</p>`;
const cote = (a, b = '') => `<div class="cote" data-draw><span>${a}</span><i></i>${b ? `<span>${b}</span>` : ''}</div>`;

// ------------------------------------------------------------------ données
const COLLECTIONS = {
  heritage: { name: 'Héritage', cuirs: ['veau'], line: 'Veau, bovin, agneau, chèvre', photo: 'veau', title: 'Le veau, qui se patine avec les années.', text: 'Un cuir souple et dense, tanné comme le faisait la tannerie familiale. Il fonce doucement à la lumière et garde la trace de la main qui l\'ouvre chaque soir.' },
  elegance: { name: 'Élégance', cuirs: ['lezard', 'autruche'], line: 'Lézard, autruche', photo: 'lezard', title: 'L\'écaille fine du lézard, le grain perlé de l\'autruche.', text: 'Deux peaux exotiques au relief discret. Le lézard pour un dessin serré et régulier, l\'autruche pour son grain en relief, laissé par l\'emplacement des plumes.' },
  excellence: { name: 'Excellence', cuirs: ['python'], line: 'Python', photo: 'python', title: 'Le python, dont le dessin change d\'une peau à l\'autre.', text: 'Des écailles larges qui se soulèvent légèrement sous les doigts. Chaque peau porte son propre motif : deux caves Excellence ne se ressemblent jamais tout à fait.' },
  prestige: { name: 'Prestige', cuirs: ['alligator'], line: 'Alligator porosus, niloticus', photo: 'croco_miel', title: 'L\'alligator, choisi peau par peau.', text: 'Porosus ou niloticus, sélectionné pour la régularité des écailles du ventre. Finition brillante, polie à l\'agate, ou mate. Des éditions numérotées complètent la collection.' },
};
const C = (n, h) => ({ n, h });
const CUIRS = {
  veau: { name: 'Veau', collection: 'heritage', photo: 'veau', exotic: false, extra: 'Aussi en bovin, agneau ou chèvre.', text: 'Un cuir souple et dense, qui prend une patine avec les années et garde la mémoire de la main.', finitions: 'Lisse ou grainé', coloris: [C('Naturel', '#C9A27A'), C('Cognac', '#8F5530'), C('Havane', '#6B4029'), C('Tabac', '#7A5536'), C('Chocolat', '#4A2E22'), C('Bordeaux', '#5E1F24'), C('Vert anglais', '#2F3F31'), C('Marine', '#1F2A3A'), C('Gris ardoise', '#4D5054'), C('Noir', '#1C1A18')] },
  lezard: { name: 'Lézard', collection: 'elegance', photo: 'lezard', exotic: true, text: 'Une écaille fine et régulière, un toucher sec. Le plus discret des cuirs exotiques.', finitions: 'Brillant ou mat', coloris: [C('Naturel', '#B89B74'), C('Miel', '#A87632'), C('Havane', '#6E4630'), C('Chocolat', '#4A3024'), C('Rouge', '#7E2A24'), C('Vert', '#3C4A36'), C('Bleu nuit', '#22283A'), C('Gris perle', '#A7A39B'), C('Noir', '#1D1B19')] },
  autruche: { name: 'Autruche', collection: 'elegance', photo: null, exotic: true, text: 'Le grain perlé laissé par l\'emplacement des plumes, en relief sous les doigts.', finitions: 'Pleine peau', coloris: [C('Cognac', '#8F5530'), C('Tabac', '#7A5536'), C('Taupe', '#8A7764'), C('Chocolat', '#4A2E22'), C('Bordeaux', '#5E1F24'), C('Vert mousse', '#55603F'), C('Marine', '#1F2A3A'), C('Gris', '#7D7A74'), C('Noir', '#1C1A18')] },
  python: { name: 'Python', collection: 'excellence', photo: 'python', exotic: true, text: 'Des écailles larges qui se soulèvent légèrement, un dessin qui change d\'une peau à l\'autre.', finitions: 'Naturel ou teinté', coloris: [C('Naturel', '#B9A88C'), C('Roche', '#8A8274'), C('Fumé', '#5A5650'), C('Brun', '#5B3E2C'), C('Cognac', '#8F5530'), C('Bordeaux', '#5E1F24'), C('Bleu ardoise', '#3D4A57'), C('Vert bronze', '#4E513A'), C('Noir', '#1C1A18')] },
  alligator: { name: 'Alligator', collection: 'prestige', photo: 'croco_miel', exotic: true, text: 'Porosus ou niloticus, choisi peau par peau pour la régularité des écailles. Brillant ou mat.', finitions: 'Brillant (poli à l\'agate) ou mat', coloris: [C('Black', '#151413'), C('Cognac', '#8A4F2A'), C('Havane', '#5E3824'), C('Miel', '#A5702F'), C('Chocolat', '#3E2A20'), C('Bordeaux', '#561C22'), C('Rouge', '#7C2121'), C('Vert bouteille', '#23392E'), C('Marine', '#1C2638'), C('Gris anthracite', '#3A3B3D'), C('Taupe', '#7A6A5C'), C('Naturel', '#B79A73')], editions: [C('Black', '#151413'), C('Carbone', '#2A2A2A'), C('Polar White', '#EDEAE3'), C('Shadow Blue', '#2F3E57')] },
};
const TAILLES = [
  { id: '100', name: '100 cigares', ext: '375 × 245 × 119 mm', int: '330 × 220 × 101 mm' },
  { id: '150', name: '150 cigares', ext: '405 × 285 × 128 mm', int: '360 × 240 × 109 mm' },
];
const BOIS = [
  { id: 'noyer', name: 'Noyer américain', h: '#6A4A33' },
  { id: 'tulipier', name: 'Tulipier noir', h: '#3A2E27' },
  { id: 'bambou', name: 'Bambou caramel', h: '#B07B45' },
  { id: 'erable', name: 'Érable sycomore', h: '#D9C7A6' },
  { id: 'carbone', name: 'Carbone', h: '#2B2B2B', sub: 'Finition spéciale' },
];
const METAUX = [
  { id: 'dore', name: 'Doré poli', h: '#C2A061' },
  { id: 'argent', name: 'Argent poli', h: '#C9C8C2' },
  { id: 'noir', name: 'Noir PVD', h: '#2A2826' },
];
// Message pré-rempli du formulaire, selon la collection choisie
const MESSAGES = {
  heritage: 'Bonjour Sam,\n\nJe m\'intéresse à une cave de la collection Héritage, en veau. Quels coloris me conseillez-vous, et comment la patine évolue-t-elle avec les années ?\n\nLa cave serait pour ',
  elegance: 'Bonjour Sam,\n\nJe m\'intéresse à une cave de la collection Élégance. J\'hésite entre le lézard et l\'autruche : pouvez-vous m\'en dire plus sur leur toucher, leur tenue et les coloris disponibles ?\n\nLa cave serait pour ',
  excellence: 'Bonjour Sam,\n\nJe m\'intéresse à une cave de la collection Excellence, en python. J\'aimerais voir les coloris disponibles et le dessin des peaux que vous avez en ce moment.\n\nLa cave serait pour ',
  prestige: 'Bonjour Sam,\n\nJe m\'intéresse à une cave de la collection Prestige, en alligator. J\'aimerais connaître les coloris disponibles, la différence entre porosus et niloticus, et entre les finitions brillante et mate.\n\nLa cave serait pour ',
  editions: 'Bonjour Sam,\n\nJe m\'intéresse à l\'une de vos éditions en alligator (Black, Carbone, Polar White, Shadow Blue). Reste-t-il des pièces disponibles dans l\'une d\'elles ?\n\nLa cave serait pour ',
};
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Vue de face cotée d'une cave : dessin au trait, cotes cognac, comme au crayon sur un patron
function elevation(t, o = {}) {
  const [L, D, H] = t.ext.match(/\d+/g).map(Number);
  const s = 0.62, x = 20, y = 34, w = L * s, h = H * s, lid = Math.round(h * 0.34), cx = x + w, by = y + h;
  const labels = o.labels !== false;
  const text = `<g font-family="IBM Plex Mono, monospace" font-size="12" letter-spacing=".04em" fill="var(--cognac)"><text x="${x + w / 2}" y="${by + 38}" text-anchor="middle">${L} mm</text><text x="${cx + 26}" y="${y + h / 2 + 4}">${H} mm</text><text x="${x}" y="${y - 14}" fill="var(--mine)">prof. ${D} mm</text></g>`;
  return `<svg class="elev" viewBox="0 0 340 ${labels ? 160 : 136}" role="img" aria-label="Vue de face : ${L} mm de large, ${H} mm de haut, ${D} mm de profondeur">`
    + `<g fill="none" stroke="var(--encre)" stroke-width="1.2"><rect x="${x}" y="${y}" width="${w}" height="${h}"/><line x1="${x}" y1="${y + lid}" x2="${cx}" y2="${y + lid}"/><rect x="${x + w / 2 - 7}" y="${y + lid - 3}" width="14" height="9"/></g>`
    + `<g stroke="var(--cognac)" stroke-width="1"><line x1="${x}" y1="${by + 16}" x2="${cx}" y2="${by + 16}"/><line x1="${x}" y1="${by + 11}" x2="${x}" y2="${by + 21}"/><line x1="${cx}" y1="${by + 11}" x2="${cx}" y2="${by + 21}"/><line x1="${cx + 16}" y1="${y}" x2="${cx + 16}" y2="${by}"/><line x1="${cx + 11}" y1="${y}" x2="${cx + 21}" y2="${y}"/><line x1="${cx + 11}" y1="${by}" x2="${cx + 21}" y2="${by}"/></g>`
    + (labels ? text : '') + '</svg>';
}

// ------------------------------------------------------------------ gabarit commun
const NAV = [['matieres.html', 'Matières', 'matieres'], ['la-maison.html', 'La Maison', 'maison'], ['rendez-vous.html', 'Rendez-vous', 'rdv']];
function layout({ file, title, desc, nav = '', quiet = false, body, closing = '' }) {
  const links = NAV.map(([h, t, k]) => `<a href="${h}"${k === nav ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  return `<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#F3EEE4">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="assets/img/mark.svg" type="image/svg+xml">
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="preload" href="assets/fonts/cormorantgaramond-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/fonts.css">
<link rel="stylesheet" href="assets/css/site.css">
<link rel="stylesheet" href="assets/css/fonts-essai.css">
<link rel="stylesheet" href="assets/css/essai-typo.css">
<script>
document.documentElement.classList.replace('no-js','js');
// Essais typographiques : ?typo=oranienbaum, noto, duo ou titres pour la visite ; ?typo=charte revient à la charte
try { let q = new URLSearchParams(location.search).get('typo'); if (q === 'essai') q = 'duo';
  if (q) sessionStorage.setItem('lemony-typo', q);
  const t = q || sessionStorage.getItem('lemony-typo');
  if (['oranienbaum', 'noto', 'duo'].includes(t)) document.documentElement.classList.add('typo-essai', 'typo-' + t);
  if (t === 'titres') document.documentElement.classList.add('typo-titres'); } catch (e) {}
</script>
</head>
<body data-page="${file.replace('.html', '')}">
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="site-header">
  <div class="wrap">
    <a class="logo" href="index.html" aria-label="Maison Lemony, accueil"><img src="assets/img/mark.svg" alt="" width="22" height="40"><span class="logo-text"><b>LEMONY</b><small>MAISON · VIENNE</small></span></a>
    <nav class="nav" aria-label="Navigation principale">${links}</nav>
    <div class="lang"><b aria-current="true">FR</b><span>·</span><span aria-disabled="true" title="Version anglaise à venir">EN</span></div>
    <a class="btn ${quiet ? 'btn-secondary' : 'btn-primary'} header-cta" href="composer.html">Composer ma cave</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-mobile" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="mobile-menu" id="menu-mobile">
  <nav aria-label="Navigation mobile"><a href="composer.html">Composer ma cave</a>${links}</nav>
  <div class="mm-foot">
    <a class="btn btn-primary" href="composer.html">Composer ma cave ${arrow}</a>
    <a class="btn btn-secondary" href="tel:+33617528559">Appeler Sam</a>
    <p class="mono">FR · EN (à venir)</p>
  </div>
</div>
<main id="contenu">
${body}
</main>
${closing}
<footer class="site-footer">
  <div class="wrap">
    <div class="foot-top">
      <div class="foot-brand"><img src="assets/img/mark-papier.svg" alt="" width="30" height="56"><p>Caves à cigares sur mesure, en cuirs précieux. Faites à la main à Vienne.</p></div>
      <div class="foot-col"><h2>L'atelier</h2><ul><li>Vienne (38200)</li><li>Sur rendez-vous</li><li><a href="tel:+33617528559">+33 6 17 52 85 59</a></li><li><a href="mailto:sam@lemony-design.com">sam@lemony-design.com</a></li></ul></div>
      <div class="foot-col"><h2>Le site</h2><ul><li><a href="composer.html">Composer ma cave</a></li><li><a href="matieres.html">Matières</a></li><li><a href="la-maison.html">La Maison</a></li><li><a href="rendez-vous.html">Rendez-vous</a></li></ul></div>
      <div class="foot-col"><h2>Services</h2><ul><li><a href="entretien-garantie.html">Entretien &amp; garantie</a></li><li><a href="entretien-garantie.html#cites">CITES &amp; export</a></li><li><a href="entretien-garantie.html#livraison">Livraison &amp; délais</a></li><li><a href="credits.html">Crédits photos</a></li></ul></div>
    </div>
    <div class="foot-bottom"><span>© Maison Lemony · Samuel Basmadjian, Maître artisan d'art · Fait main en France</span><span>Maquette · octobre 2026 · Mentions légales · Cookies</span></div>
  </div>
</footer>
<script src="assets/js/data.js"></script>
<script src="assets/js/site.js"></script>
</body>
</html>
`;
}
const pages = {};
const page = (file, o) => { pages[file] = layout({ file, ...o }); };
const closing = (title, text, primary = ['composer.html', 'Composer ma cave'], secondary = ['rendez-vous.html', 'Prendre rendez-vous']) => `<section class="closing" aria-labelledby="closing-t"><div class="wrap">
  <div><h2 class="display-l" id="closing-t" data-reveal>${title}</h2></div>
  <div data-reveal><p class="lead">${text}</p><div class="actions"><a class="btn btn-primary" href="${primary[0]}">${primary[1]} ${arrow}</a>${secondary ? `<a class="link-atelier" href="${secondary[0]}">${secondary[1]}</a>` : ''}</div></div>
</div></section>`;
const crumbs = items => `<nav class="crumbs" aria-label="Fil d'Ariane">${items.map(([h, t], i) => (h ? `<a href="${h}">${t}</a>` : `<span aria-current="page" style="margin:0;color:var(--encre)">${t}</span>`) + (i < items.length - 1 ? '<span>/</span>' : '')).join('')}</nav>`;
const collectionIndex = (exclude) => `<div class="index-wrap"><ul class="index-list" data-peek>
${Object.entries(COLLECTIONS).filter(([k]) => k !== exclude).map(([k, c]) => `  <li><a href="collection-${k}.html" data-peek-src="${url(P[c.photo][0], 640)}">${img(c.photo, { cls: 'index-thumb', sizes: '76px' })}<span class="name">${c.name}</span><span class="mono">${c.line}</span>${arrowOut}</a></li>`).join('\n')}
</ul><div class="index-peek" aria-hidden="true"><img alt="" src="${url(P.veau[0], 640)}"></div></div>`;

// ------------------------------------------------------------------ Accueil
page('index.html', {
  title: 'Maison Lemony · Caves à cigares sur mesure, cousues main à Vienne',
  desc: 'Caves à cigares sur mesure en cuirs précieux, faites à la main par Samuel Basmadjian, Maître artisan d\'art à Vienne. Huit à dix semaines d\'atelier.',
  body: `
<section class="wrap hero" aria-labelledby="hero-t">
  <div class="hero-text">
    <h1 class="display-xl" id="hero-t">Des caves à cigares cousues main, à Vienne.</h1>
    <p class="lead">Samuel Basmadjian choisit chaque peau, la pare, la griffe et la coud au point sellier sur une structure de bois. Une pièce numérotée, huit à dix semaines d'atelier.</p>
    <div class="actions"><a class="btn btn-primary" href="composer.html">Composer ma cave ${arrow}</a><a class="link-atelier" href="rendez-vous.html">Prendre rendez-vous</a></div>
  </div>
  <div class="hero-media">
    <div class="photo slow">${img('hero', { eager: true, sizes: '(max-width: 860px) 100vw, 42vw' })}</div>
    ${cote('8 à 10 semaines d\'atelier', 'une dizaine de pièces par mois')}
    ${cap('hero')}
  </div>
</section>

<section class="wrap" aria-label="La Maison en bref">
  <dl class="ledger" data-reveal>
    <div><dt>Maître artisan d'art</dt><dd>187ᵉ en Isère, depuis 2026</dd></div>
    <div><dt>Héritage</dt><dd>Troisième génération de tanneurs</dd></div>
    <div><dt>Fabrication</dt><dd>Entièrement à la main, point sellier</dd></div>
    <div><dt>Atelier</dt><dd>Vienne (Isère), sur rendez-vous</dd></div>
  </dl>
</section>

<section class="wrap section" aria-labelledby="temps-t">
  <div class="section-head"><h2 class="display-l" id="temps-t" data-reveal>Votre cave en trois temps.</h2><p class="muted body-col" data-reveal>Rien ne s'achète en ligne. Vous composez, Sam vous répond, puis l'atelier s'en charge.</p></div>
  <ol class="timeline" role="list" style="list-style:none;margin:0;padding:0">
    <li class="step" data-reveal>${cote('Aujourd\'hui')}<h3>Composer</h3><p>Taille, cuir, coloris, bois, métal, gravure. Quelques minutes, sans engagement.</p></li>
    <li class="step" data-reveal>${cote('Ensuite')}<h3>Échanger avec Sam</h3><p>En visio, à l'atelier de Vienne ou chez vous. Le prix se fixe à ce moment-là.</p></li>
    <li class="step" data-reveal>${cote('8 à 10 semaines')}<h3>Recevoir votre pièce</h3><p>Numérotée, livrée avec son certificat et, pour les peaux exotiques, ses documents CITES.</p></li>
  </ol>
</section>

<section class="wrap section" aria-labelledby="coll-t">
  <div class="section-head"><h2 class="display-l" id="coll-t" data-reveal>Partir d'une collection.</h2><a class="link-atelier" href="composer.html">Ou composer librement</a></div>
  ${collectionIndex()}
</section>

<section class="wrap section" aria-labelledby="mat-t">
  <div class="section-head"><h2 class="display-l" id="mat-t" data-reveal>Le bois soutient. Le cuir révèle.</h2><a class="link-atelier" href="matieres.html">Toutes les matières</a></div>
  <div class="strip" data-reveal>
    ${[['veau', 'Veau', 'Héritage', 'cuir-veau.html'], ['lezard', 'Lézard', 'Élégance', 'cuir-lezard.html'], ['python', 'Python', 'Excellence', 'cuir-python.html'], ['croco_noir', 'Alligator', 'Prestige', 'cuir-alligator.html'], ['bois_noyer', 'Noyer américain', 'Essence', 'matieres.html#essences'], ['bois_fonce', 'Tulipier noir', 'Essence', 'matieres.html#essences']].map(([k, n, c, h]) => `<figure><a href="${h}" style="text-decoration:none">${photo(k, { nocap: true, sizes: '(max-width: 760px) 50vw, 17vw' })}<figcaption><b>${n}</b><span class="mono">${c}</span></figcaption></a></figure>`).join('\n    ')}
  </div>
</section>

<section class="wrap section" aria-labelledby="sam-t">
  <div class="split">
    <div>${photo('poincon', { slow: true })}</div>
    <div>
      <h2 class="display-l" id="sam-t" data-reveal>De la tannerie familiale à l'atelier de Vienne.</h2>
      <p class="body-col" data-reveal>Fils d'un contremaître tanneur de Pont-Évêque, Samuel Basmadjian a dirigé la fabrication de petite maroquinerie, de sacs et de bagagerie en haute maroquinerie, puis travaillé pour l'horlogerie suisse. Il fonde Maison Lemony en 2017.</p>
      <blockquote class="voix" data-reveal style="margin:40px 0 0">« Le cuir, une matière qui a une histoire et une odeur. »<div class="voix-sig"><img src="assets/img/mark.svg" alt="" width="14" height="26">Samuel Basmadjian</div></blockquote>
      <p style="margin-top:40px"><a class="link-atelier" href="la-maison.html">L'histoire de la Maison</a></p>
    </div>
  </div>
</section>

<section class="wrap section" aria-labelledby="refs-t">
  <h2 class="title-m" id="refs-t" style="margin-bottom:24px">Ils ont fait confiance à l'atelier</h2>
  <ul class="refs"><li>La Pyramide, Vienne</li><li>Cigar and Spice, Genève</li><li>Jazz à Vienne 2023</li><li>Le Dauphiné Libéré</li><li>L'Essor</li><li>Magazine de la CMA</li></ul>
  ${note('accord des clients pour être cités, et témoignage de Cigar and Spice')}
</section>`,
  closing: closing('Chaque pièce naît d\'une conversation.', 'Composez votre cave, ou écrivez directement à Sam. Il vous répond lui-même.'),
});

// ------------------------------------------------------------------ Composer ma cave
const choice = (name, value, title, sub, media, checked = false) => `<label class="choice${media ? '' : ' no-media'}"><input type="radio" name="${name}" value="${value}"${checked ? ' checked' : ''}>${media || ''}<span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span><span class="tick" aria-hidden="true"></span></label>`;
const STEPS = ['Taille', 'Cuir', 'Coloris', 'Bois', 'Métal', 'Gravure', 'Envoyer'];
page('composer.html', {
  title: 'Composer ma cave · Maison Lemony',
  desc: 'Choisissez la taille, le cuir, le coloris, le bois, le métal et la gravure de votre cave à cigares, puis envoyez votre fiche à Sam.',
  quiet: true,
  body: `
<section class="wrap page-head">
  ${crumbs([['index.html', 'Accueil'], [null, 'Composer ma cave']])}
  <h1 class="display-l">Composer ma cave</h1>
  <p class="lead">Six choix, puis Sam reprend la main. Rien n'est engagé : vous recevez une réponse, pas une facture.</p>
</section>
<div class="wrap composer">
  <form id="composer" novalidate aria-label="Composition de la cave">
    <ol class="stepper" aria-label="Étapes">${STEPS.map((s, i) => `<li><button type="button" data-goto="${i}"${i ? ' disabled' : ' aria-current="step"'}><span>${String(i + 1).padStart(2, '0')}</span>${s}</button></li>`).join('')}</ol>

    <fieldset class="step-panel" data-step="0"><legend><h2 class="title-m">La taille</h2></legend>
      <p class="intro">Deux formats d'atelier. L'intérieur est en sipo, avec plateau amovible et séparateurs mobiles.</p>
      <div class="choices">${TAILLES.map(t => choice('taille', t.id, t.name, `Ext. ${t.ext} · int. ${t.int}`, elevation(t, { labels: false }))).join('')}</div>
      ${note('formats 200 et 300+ cités dans la presse : existent-ils ?')}
    </fieldset>

    <fieldset class="step-panel" data-step="1" hidden><legend><h2 class="title-m">Le cuir</h2></legend>
      <p class="intro">Le cuir détermine la collection. Vous pouvez aussi <a href="collection-prestige.html">partir d'une collection</a>.</p>
      <div class="choices">${Object.entries(CUIRS).map(([k, c]) => choice('cuir', k, c.name, `Collection ${COLLECTIONS[c.collection].name}${c.extra ? ' · ' + c.extra.replace('Aussi en ', 'aussi ').replace('.', '') : ''}${c.photo ? '' : ' · photo à venir'}`, c.photo ? img(c.photo, { cls: 'thumb', sizes: '64px' }) : '<span class="thumb" aria-hidden="true"></span>')).join('')}</div>
    </fieldset>

    <fieldset class="step-panel" data-step="2" hidden><legend><h2 class="title-m">Le coloris</h2></legend>
      <p class="intro" data-coloris-intro>Choisissez d'abord un cuir.</p>
      <div class="choices cols-2" data-coloris></div>
      ${note('noms et teintes provisoires, en attente des packshots réels')}
    </fieldset>

    <fieldset class="step-panel" data-step="3" hidden><legend><h2 class="title-m">Le bois</h2></legend>
      <p class="intro">L'essence visible de la structure. L'intérieur reste en sipo, qui régule l'humidité.</p>
      <div class="choices cols-2">${BOIS.map(b => choice('bois', b.id, b.name, b.sub || '', `<span class="chip" style="--c:${b.h};border-radius:0"></span>`)).join('')}</div>
    </fieldset>

    <fieldset class="step-panel" data-step="4" hidden><legend><h2 class="title-m">Le métal</h2></legend>
      <p class="intro">Charnières, serrure et deux clés en acier, dans la même finition.</p>
      <div class="choices cols-3">${METAUX.map(m => choice('metal', m.id, m.name, '', `<span class="chip" style="--c:${m.h}"></span>`)).join('')}</div>
    </fieldset>

    <fieldset class="step-panel" data-step="5" hidden><legend><h2 class="title-m">La gravure</h2></legend>
      <p class="intro">Facultative. Un nom, des initiales, une date, gravés à l'intérieur du couvercle. Le numéro de pièce est gravé d'office.</p>
      <label class="field"><span>Texte à graver <em class="counter mono" style="text-transform:none" data-counter>0 / 40</em></span><input type="text" name="gravure" maxlength="40" placeholder="Par exemple : J.-M. R. · 12 juin 2027" autocomplete="off"></label>
    </fieldset>

    <fieldset class="step-panel" data-step="6" hidden><legend><h2 class="title-m">Votre fiche est prête</h2></legend>
      <p class="intro">Relisez-la à droite. En l'envoyant, vous ne vous engagez à rien : Sam l'étudie et vous répond lui-même pour en parler, fixer le prix et le calendrier.</p>
      <div class="actions"><button class="btn btn-primary" type="submit">Envoyer ma fiche à Sam ${arrow}</button><button class="btn btn-secondary" type="button" data-print>Imprimer la fiche</button></div>
      <p class="ph-cap" data-missing hidden></p>
    </fieldset>

    <div class="step-nav"><button class="btn btn-secondary" type="button" data-prev>Retour</button><button class="btn btn-primary" type="button" data-next>Continuer ${arrow}</button></div>
  </form>

  <aside class="fiche" aria-labelledby="fiche-t">
    <div class="fiche-head"><h2 id="fiche-t">Fiche de pièce</h2><span class="mono-num">N° à attribuer</span></div>
    <dl aria-live="polite">
      ${['taille', 'cuir', 'coloris', 'bois', 'metal', 'gravure'].map((k, i) => `<div class="row" data-row="${k}"><dt>${['Taille', 'Cuir', 'Coloris', 'Bois', 'Métal', 'Gravure'][i]}</dt><dd><span class="empty">—</span></dd></div>`).join('\n      ')}
    </dl>
    <div class="fiche-foot">
      <p><b>Intérieur</b> · sipo, assise velours noir, hygromètre LEM-01, humidificateur ACPL-01</p>
      <p><b>Délai</b> · 8 à 10 semaines d'atelier</p>
      <p><b>Prix</b> · sur demande, après échange avec Sam</p>
    </div>
  </aside>
</div>`,
});

// ------------------------------------------------------------------ Collections
for (const [k, c] of Object.entries(COLLECTIONS)) {
  const groups = c.cuirs.map(cu => {
    const cuir = CUIRS[cu];
    const sw = list => `<ul class="swatches">${list.map(x => `<li><a class="swatch" href="composer.html?cuir=${cu}&amp;coloris=${slug(x.n)}" style="--c:${x.h}"><i></i><b>${x.n}</b></a></li>`).join('')}</ul>`;
    return `${c.cuirs.length > 1 || cuir.editions ? `<h3 class="title-m" style="margin:48px 0 24px">${cuir.name}</h3>` : ''}${sw(cuir.coloris)}${cuir.editions ? `<h3 class="title-m" id="editions" style="margin:64px 0 8px">Les éditions</h3><p class="muted" style="margin-bottom:24px">Séries courtes et numérotées. <a href="rendez-vous.html?collection=editions">Demander les pièces disponibles</a></p>${sw(cuir.editions)}` : ''}`;
  }).join('');
  page(`collection-${k}.html`, {
    title: `Collection ${c.name} · Maison Lemony`,
    desc: `Caves à cigares de la collection ${c.name} (${c.line}), faites main à Vienne.`,
    body: `
<section class="wrap page-head">
  ${crumbs([['index.html', 'Accueil'], ['composer.html', 'Composer ma cave'], [null, 'Collection ' + c.name]])}
  <h1 class="display-l">Collection ${c.name}</h1>
  <nav class="tabs" aria-label="Collections">${Object.entries(COLLECTIONS).map(([kk, cc]) => `<a href="collection-${kk}.html"${kk === k ? ' aria-current="page"' : ''}>${cc.name}</a>`).join('')}</nav>
</section>
<section class="wrap" style="margin-top:clamp(40px,5vw,72px)">
  <div class="split bleed-l">
    <div>${photo(c.photo, { slow: true })}</div>
    <div>
      <h2 class="display-l" data-reveal>${c.title}</h2>
      <p class="body-col" data-reveal>${c.text}</p>
      ${cote(c.line)}
      <div class="actions" style="margin-top:40px"><a class="btn btn-primary" href="composer.html?collection=${k}">Composer à partir de ${c.name} ${arrow}</a><a class="link-atelier" href="rendez-vous.html?collection=${k}">En parler à Sam</a></div>
    </div>
  </div>
</section>
<section class="wrap section" aria-labelledby="col-t">
  <div class="section-head"><h2 class="display-l" id="col-t">Les coloris</h2><p class="muted body-col">Teintes indicatives. Un clic sur un coloris ouvre la composition avec ce cuir et cette teinte déjà choisis.</p></div>
  ${groups}
  ${note('noms et teintes provisoires : seuls les coloris photographiés en vrai seront publiés')}
</section>
<section class="wrap section" aria-labelledby="dim-t">
  <div class="split" style="align-items:start">
    <div><h2 class="display-l" id="dim-t" style="margin-bottom:28px">Deux tailles</h2>
      <div class="elevations">${TAILLES.map(t => `<figure>${elevation(t)}<figcaption>${t.name}</figcaption></figure>`).join('')}</div>
      <div class="table-scroll"><table class="specs"><thead><tr><th scope="col">Format</th><th scope="col">Extérieur</th><th scope="col">Intérieur</th></tr></thead><tbody>${TAILLES.map(t => `<tr><td>${t.name}</td><td class="num">${t.ext}</td><td class="num">${t.int}</td></tr>`).join('')}</tbody></table></div>
    </div>
    <div><h3 class="title-m" style="margin-bottom:22px">Dans chaque cave</h3>
      <ul class="inline-list"><li>Hygromètre LEM-01 et humidificateur ACPL-01</li><li>Plateau amovible, séparateurs mobiles</li><li>Assise en velours noir</li><li>Serrure et deux clés en acier</li><li>Numéro de pièce gravé, gravure personnelle en option</li></ul>
    </div>
  </div>
</section>
<section class="wrap section" aria-labelledby="other-t">
  <h2 class="title-m" id="other-t" style="margin-bottom:24px">Les autres collections</h2>
  ${collectionIndex(k)}
</section>`,
    closing: closing('Une teinte en tête qui n\'est pas ici ?', 'Sam peut chercher une peau sur demande. Dites-lui ce que vous imaginez.', [`composer.html?collection=${k}`, `Composer à partir de ${c.name}`], [`rendez-vous.html?collection=${k}`, 'En parler à Sam']),
  });
}

// ------------------------------------------------------------------ Matières
page('matieres.html', {
  title: 'Matières · Maison Lemony',
  desc: 'Les cuirs, les bois, les métaux et les instruments des caves Maison Lemony.',
  nav: 'matieres',
  body: `
<section class="wrap page-head">
  ${crumbs([['index.html', 'Accueil'], [null, 'Matières']])}
  <h1 class="display-xl">La structure existe pour servir la matière.</h1>
  <p class="lead">Le bois soutient. Le cuir révèle.</p>
  <nav class="tabs" aria-label="Sur cette page"><a href="#cuirs">Les cuirs</a><a href="#essences">Les essences</a><a href="#metaux">Les métaux</a><a href="#instruments">Les instruments</a><a href="#gestes">Les gestes</a></nav>
</section>
<section class="wrap section" id="cuirs" aria-labelledby="cuirs-t">
  <div class="section-head"><h2 class="display-l" id="cuirs-t">Cinq peaux, quatre collections</h2><p class="muted body-col">Sous chaque cuir, la collection à laquelle il appartient.</p></div>
  <div class="strip" style="grid-auto-columns:minmax(200px,1fr)">${Object.entries(CUIRS).map(([k, c]) => `<figure><a href="cuir-${k}.html" style="text-decoration:none">${c.photo ? photo(c.photo, { nocap: true, sizes: '(max-width: 760px) 60vw, 20vw' }) : toShoot('Autruche')}<figcaption><b>${c.name}</b><span class="mono">${COLLECTIONS[c.collection].name}</span></figcaption></a></figure>`).join('')}</div>
</section>
<section class="wrap section" id="essences" aria-labelledby="ess-t">
  <div class="section-head"><h2 class="display-l" id="ess-t">Six essences</h2><p class="muted body-col">Le sipo tapisse l'intérieur de chaque cave : il n'est pas à choisir. Les cinq autres habillent la structure.</p></div>
  <div class="strip">
    <figure>${toShoot('Sipo · intérieur')}<figcaption><b>Sipo</b><span class="mono">Toujours à l'intérieur</span></figcaption></figure>
    <figure>${photo('bois_noyer', { nocap: true, sizes: '20vw' })}<figcaption><b>Noyer américain</b></figcaption></figure>
    <figure>${photo('bois_fonce', { nocap: true, sizes: '20vw' })}<figcaption><b>Tulipier noir</b></figcaption></figure>
    <figure>${toShoot('Bambou caramel')}<figcaption><b>Bambou caramel</b></figcaption></figure>
    <figure>${toShoot('Érable sycomore')}<figcaption><b>Érable sycomore</b></figcaption></figure>
    <figure>${toShoot('Carbone')}<figcaption><b>Carbone</b><span class="mono">Finition spéciale</span></figcaption></figure>
  </div>
</section>
<section class="wrap section" id="metaux" aria-labelledby="met-t">
  <h2 class="display-l" id="met-t" style="margin-bottom:36px">Trois finitions de métal</h2>
  <ul class="metals">${METAUX.map(m => `<li><i style="--c:${m.h}"></i>${m.name}</li>`).join('')}</ul>
  <p class="muted" style="margin-top:20px">Charnières, serrure et deux clés en acier, dans la même finition.</p>
</section>
<section class="wrap section" id="instruments" aria-labelledby="ins-t">
  <div class="split flip">
    <div>${photo('hygro', { slow: true, cls: 'pos-top' })}</div>
    <div>
      <h2 class="display-l" id="ins-t" data-reveal>Des instruments signés du monogramme.</h2>
      <p class="body-col" data-reveal>Dessinés pour les caves Lemony : un hygromètre à cadran et un humidificateur, logés dans le couvercle.</p>
      <table class="specs" style="margin-top:28px"><tbody><tr><td>Hygromètre LEM-01</td><td class="num">⌀ 55 mm · précision ±5 %</td></tr><tr><td>Humidificateur ACPL-01</td><td class="num">intégré au couvercle</td></tr></tbody></table>
    </div>
  </div>
</section>
<section class="wrap section" id="gestes" aria-labelledby="ges-t">
  <div class="section-head"><h2 class="display-l" id="ges-t">Parer, griffer, coudre au point sellier.</h2><p class="muted body-col">Les gestes de l'atelier, de la peau brute à la cave fermée.</p></div>
  <div class="strip">${[['outils', 'Découper'], ['etabli', 'Parer'], ['poincon', 'Griffer'], ['fil', 'Coudre au point sellier'], ['coffret', 'Gainer le bois']].map(([k, t]) => `<figure>${photo(k, { nocap: true, sizes: '(max-width: 760px) 60vw, 20vw' })}<figcaption><b>${t}</b></figcaption></figure>`).join('')}</div>
  ${note('vidéos courtes des vrais gestes, à tourner à l\'atelier de Vienne')}
</section>`,
  closing: closing('Composer avec ces matières.', 'Choisissez un cuir, une essence et un métal : la fiche de votre cave se remplit au fil des choix.'),
});

// ------------------------------------------------------------------ Une page par cuir
for (const [k, c] of Object.entries(CUIRS)) {
  const col = COLLECTIONS[c.collection];
  page(`cuir-${k}.html`, {
    title: `${c.name} · Matières · Maison Lemony`,
    desc: `Le ${c.name.toLowerCase()} des caves Maison Lemony, collection ${col.name}.`,
    nav: 'matieres',
    body: `
<section class="wrap page-head">
  ${crumbs([['index.html', 'Accueil'], ['matieres.html', 'Matières'], ['matieres.html#cuirs', 'Les cuirs'], [null, c.name]])}
</section>
<section class="wrap">
  <div class="split bleed-l">
    <div>${c.photo ? photo(c.photo, { slow: true, eager: true }) : toShoot('Macro du grain d\'autruche, lumière rasante', '4/5')}</div>
    <div>
      <h1 class="display-xl" data-reveal>${c.name}</h1>
      <p class="lead" data-reveal style="margin-top:20px">${c.text}</p>
      <table class="specs" style="margin:28px 0 40px"><tbody>
        <tr><th scope="row">Collection</th><td><a href="collection-${c.collection}.html">${col.name}</a></td></tr>
        <tr><th scope="row">Finitions</th><td>${c.finitions}</td></tr>
        ${c.extra ? `<tr><th scope="row">Autres peaux</th><td>${c.extra.replace('Aussi en ', '').replace('.', '')}</td></tr>` : ''}
        <tr><th scope="row">Origine</th><td class="muted">À préciser avec Sam</td></tr>
      </tbody></table>
      <div class="actions"><a class="btn btn-primary" href="composer.html?cuir=${k}">Composer avec ce cuir ${arrow}</a><a class="link-atelier" href="rendez-vous.html?collection=${c.collection}">En parler à Sam</a></div>
    </div>
  </div>
</section>
<section class="wrap section" aria-labelledby="clr-t">
  <div class="section-head"><h2 class="display-l" id="clr-t">${c.coloris.length} coloris</h2><p class="muted body-col">Teintes indicatives. Un clic ajoute le coloris à votre composition.</p></div>
  <ul class="swatches">${c.coloris.map(x => `<li><a class="swatch" href="composer.html?cuir=${k}&amp;coloris=${slug(x.n)}" style="--c:${x.h}"><i></i><b>${x.n}</b></a></li>`).join('')}</ul>
  ${note('noms et teintes provisoires, en attente des packshots réels')}
</section>
<section class="wrap section">
  <div class="duo">
    ${c.exotic ? `<div class="panel"><h2>Export et certificat CITES</h2><p class="muted">Les peaux exotiques voyagent avec leurs documents CITES. Pour une livraison en Suisse, à Monaco, aux États-Unis ou à bord, l'atelier prépare les certificats avec la pièce.</p>${note('liste des pays et formalités exactes à confirmer')}<p style="margin-top:20px"><a class="link-atelier" href="entretien-garantie.html#cites">CITES et export</a></p></div>` : `<div class="panel"><h2>Une patine qui se construit</h2><p class="muted">Le veau fonce doucement à la lumière et au toucher. Un baume neutre une à deux fois par an suffit à le nourrir.</p>${note('conseils d\'entretien à rédiger avec Sam')}</div>`}
    <div class="panel kraft"><h2>Entretien</h2><p class="muted">Un chiffon doux et sec, loin d'une source de chaleur. Pour une rayure ou une tache, Sam préfère qu'on le contacte plutôt que d'essayer un produit.</p><p style="margin-top:20px"><a class="link-atelier" href="entretien-garantie.html">Entretien et garantie</a></p></div>
  </div>
</section>
<section class="wrap section" aria-labelledby="oth-t">
  <h2 class="title-m" id="oth-t" style="margin-bottom:24px">Les autres cuirs</h2>
  <ul class="index-list">${Object.entries(CUIRS).filter(([kk]) => kk !== k).map(([kk, cc]) => `<li><a href="cuir-${kk}.html"><span class="name">${cc.name}</span><span class="mono">Collection ${COLLECTIONS[cc.collection].name}</span>${arrowOut}</a></li>`).join('')}</ul>
</section>`,
  });
}

// ------------------------------------------------------------------ La Maison
page('la-maison.html', {
  title: 'La Maison · Samuel Basmadjian, Maître artisan d\'art · Maison Lemony',
  desc: 'Samuel Basmadjian, maroquinier à Vienne, troisième génération de tanneurs, Maître artisan d\'art depuis 2026.',
  nav: 'maison',
  body: `
<section class="wrap page-head">
  ${crumbs([['index.html', 'Accueil'], [null, 'La Maison']])}
  <div class="split bleed-r" style="align-items:end">
    <div>
      <h1 class="display-l" data-reveal>Samuel Basmadjian, Maître artisan d'art.</h1>
      <p class="lead" data-reveal style="margin-top:28px">Maroquinier à Vienne, troisième génération de tanneurs. Sam est la marque : chaque cave sort de ses mains, et c'est lui qui vous répond.</p>
    </div>
    <div>${photo('etabli', { slow: true, eager: true })}${note('portrait réel de Sam à l\'établi, plan large et plan serré')}</div>
  </div>
</section>

<section class="wrap section" aria-labelledby="rep-t">
  <h2 class="display-l" id="rep-t" style="margin-bottom:40px">Repères</h2>
  <ol class="inline-list" style="list-style:none">
    ${[['Pont-Évêque', 'Une famille de tanneurs. Le père de Sam est contremaître à la tannerie : l\'odeur du cuir, d\'abord.'], ['Haute maroquinerie', 'Responsable de fabrication : petite maroquinerie, sacs, bagagerie.'], ['Horlogerie suisse', 'Bracelets et bijouterie de montres, jusqu\'au titane.'], ['2017', 'Création de Maison Lemony à Vienne.'], ['Avril 2026', 'Maître artisan d\'art, 187ᵉ en Isère.']].map(([y, t]) => `<li style="display:grid;grid-template-columns:minmax(140px,240px) 1fr;gap:24px;padding:24px 0" data-reveal><span class="mono-num" style="padding-top:8px">${y}</span><span style="font-size:23px;line-height:1.35">${t}</span></li>`).join('\n    ')}
  </ol>
</section>

<section class="wrap section">
  <blockquote class="voix" style="margin:0 auto;max-width:18em;text-align:center;font-size:clamp(32px,3.6vw,52px)" data-reveal>« Le cuir, une matière qui a une histoire et une odeur. »<div class="voix-sig" style="justify-content:center"><img src="assets/img/mark.svg" alt="" width="14" height="26">Samuel Basmadjian</div></blockquote>
</section>

<section class="wrap section" aria-labelledby="ate-t">
  <div class="split flip">
    <div>${photo('vienne', { slow: true })}</div>
    <div>
      <h2 class="display-l" id="ate-t" data-reveal>L'atelier, à Vienne.</h2>
      <p class="body-col" data-reveal>Entre Lyon et la vallée du Rhône. L'atelier reçoit sur rendez-vous, pour voir les peaux, les bois, et une pièce en cours.</p>
      ${note('projet d\'atelier-boutique en centre-ville : l\'annoncer maintenant ou à l\'ouverture ?')}
      <p style="margin-top:32px"><a class="link-atelier" href="rendez-vous.html">Visiter l'atelier sur rendez-vous</a></p>
    </div>
  </div>
</section>

<section class="wrap section" aria-labelledby="pr-t">
  <div class="duo">
    <div><h2 class="title-m" id="pr-t" style="margin-bottom:20px">Ils ont fait confiance à l'atelier</h2><ul class="inline-list"><li>La Pyramide, Vienne</li><li>Cigar and Spice, Genève · cave en autruche, Lausanne Palace</li><li>Jazz à Vienne · partenaire officiel 2023</li></ul></div>
    <div><h2 class="title-m" style="margin-bottom:20px">Presse</h2><ul class="inline-list"><li>Le Dauphiné Libéré</li><li>L'Essor</li><li>Magazine de la CMA · octobre 2026</li></ul></div>
  </div>
  ${note('accord des clients pour être cités ; liens vers les articles')}
</section>`,
  closing: closing('Rencontrer Sam.', 'En visio, à l\'atelier de Vienne ou chez vous. Composez d\'abord votre cave, ou écrivez-lui directement.'),
});

// ------------------------------------------------------------------ Rendez-vous
page('rendez-vous.html', {
  title: 'Rendez-vous · Écrire à Sam · Maison Lemony',
  desc: 'Écrivez à Samuel Basmadjian pour parler de votre cave à cigares. Réponse sous 48 heures.',
  nav: 'rdv',
  quiet: true,
  body: `
<section class="wrap page-head">
  ${crumbs([['index.html', 'Accueil'], [null, 'Rendez-vous']])}
  <h1 class="display-xl">Chaque pièce naît d'une conversation.</h1>
  <p class="lead">Écrivez à Sam : il vous répond lui-même sous 48 heures, puis vous convenez d'un rendez-vous en visio, à l'atelier ou chez vous.</p>
</section>
<div class="wrap rdv">
  <form id="rdv" action="merci.html" novalidate>
    <div class="context-box" data-context hidden></div>
    <div class="form-grid">
      <label class="field"><span>Votre nom</span><input name="nom" autocomplete="name" required placeholder="Jean Martin"><em class="err">Indiquez votre nom pour que Sam sache à qui il répond.</em></label>
      <label class="field"><span>Email ou téléphone</span><input name="contact" autocomplete="email" required placeholder="vous@exemple.fr ou +33 6…"><em class="err">Laissez un email ou un numéro où Sam peut vous joindre.</em></label>
      <label class="field full"><span>Pays</span><select name="pays" autocomplete="country-name"><option>France</option><option>Suisse</option><option>Monaco</option><option>Belgique</option><option>Luxembourg</option><option>Royaume-Uni</option><option>États-Unis</option><option>Émirats arabes unis</option><option>Autre pays</option></select></label>
      <label class="field full"><span>Votre projet</span><textarea name="projet" rows="9" placeholder="Une cave de 150 cigares en porosus, pour un anniversaire en juin…"></textarea><em class="hint" data-hint>Un mot sur votre projet suffit : la taille, une peau, une date, une occasion.</em></label>
    </div>
    <label class="consent"><input type="checkbox" name="consent" required><span>J'accepte que Maison Lemony utilise ces informations pour me répondre au sujet de cette demande, et pour rien d'autre.</span></label>
    <p class="err" data-consent-err hidden style="font:500 11px/1.5 var(--font-mono);color:var(--danger);margin:-20px 0 24px">Cochez la case pour que Sam puisse vous répondre.</p>
    <button class="btn btn-primary" type="submit">Envoyer ma demande à Sam ${arrow}</button>
    ${note('« réponse sous 48 heures » à confirmer avec Sam')}
  </form>
  <aside class="aside-sam" aria-labelledby="sam-t">
    ${toShoot('Portrait de Sam à l\'établi', '4/5')}
    <h2 id="sam-t" style="margin-top:28px">Vous écrivez à Sam, pas à un service client.</h2>
    <dl class="contact-lines">
      <div><dt>Téléphone direct</dt><dd><a href="tel:+33617528559">+33 6 17 52 85 59</a></dd></div>
      <div><dt>Email</dt><dd><a href="mailto:sam@lemony-design.com">sam@lemony-design.com</a></dd></div>
      <div><dt>Atelier</dt><dd>Vienne (38200), sur rendez-vous</dd></div>
      <div><dt>Rendez-vous</dt><dd>En visio, à l'atelier, ou chez vous</dd></div>
    </dl>
  </aside>
</div>
<section class="wrap section" aria-labelledby="faq-t">
  <h2 class="display-l" id="faq-t" style="margin-bottom:32px">Avant d'écrire</h2>
  <div class="faq">
    <details><summary>Combien de temps faut-il pour fabriquer une cave ?</summary><div><p>Huit à dix semaines d'atelier, à partir du moment où la composition et le prix sont convenus avec Sam. L'atelier ne fabrique qu'une dizaine de pièces par mois.</p></div></details>
    <details><summary>Combien coûte une cave ?</summary><div><p>Le prix dépend de la peau, du format et des finitions. Il se fixe avec Sam, après votre échange : aucun prix n'est affiché sur le site.</p></div></details>
    <details><summary>Livrez-vous à l'étranger ?</summary><div><p>Oui. Les peaux exotiques voyagent avec leurs documents CITES, que l'atelier prépare avec la pièce.</p>${note('pays desservis et formalités exactes')}</div></details>
    <details><summary>Puis-je voir et toucher les peaux avant de décider ?</summary><div><p>À l'atelier de Vienne, sur rendez-vous. À distance, Sam vous montre les peaux en visio.</p></div></details>
  </div>
</section>`,
});

// ------------------------------------------------------------------ Merci
page('merci.html', {
  title: 'Demande envoyée · Maison Lemony',
  desc: 'Votre demande est bien partie. Sam vous répond sous 48 heures.',
  body: `
<section class="wrap thanks" aria-labelledby="ok-t">
  <img class="mark-seal" src="assets/img/mark.svg" alt="" width="46" height="85">
  <h1 class="display-xl" id="ok-t">Votre demande est partie.</h1>
  <p class="lead" style="margin-top:24px">Sam la lit lui-même et vous répond <span data-who>à l'adresse ou au numéro que vous avez laissé</span>.</p>
  ${note('délai de réponse à annoncer (48 heures ?)')}
  <div class="context-box" data-sent hidden></div>
  <div class="actions" style="margin-top:40px"><a class="link-atelier" href="la-maison.html">En attendant, découvrir la Maison</a><a class="link-atelier" href="matieres.html">Les matières</a></div>
  <p class="ph-cap" style="margin-top:48px">Maquette : aucun message n'est réellement envoyé.</p>
</section>`,
});

// ------------------------------------------------------------------ Entretien & garantie (gabarit des pages de service)
page('entretien-garantie.html', {
  title: 'Entretien, garantie et export · Maison Lemony',
  desc: 'Prendre soin d\'une cave Lemony, garantie, CITES, livraison et délais.',
  body: `
<section class="wrap page-head">
  ${crumbs([['index.html', 'Accueil'], [null, 'Entretien & garantie']])}
  <h1 class="display-l">Entretien, garantie et export</h1>
  <p class="lead">Prendre soin de votre cave, et ce que l'atelier fait pour elle après la livraison.</p>
</section>
<div class="wrap service">
  <nav class="toc" aria-label="Sur cette page"><p class="mono" style="margin:0">Sur cette page</p><ol>
    <li><a href="#cuir">Le cuir</a></li><li><a href="#bois">Le bois</a></li><li><a href="#humidite">L'humidité</a></li><li><a href="#garantie">La garantie</a></li><li><a href="#cites">CITES et export</a></li><li><a href="#livraison">Livraison et délais</a></li>
  </ol></nav>
  <div class="body-col">
    <section id="cuir"><h2 class="title-m">Le cuir</h2><p>Un chiffon doux et sec suffit au quotidien. Gardez la cave à l'écart d'une fenêtre plein sud et d'un radiateur. Pour une tache ou une rayure, contactez l'atelier avant d'essayer un produit.</p>${note('conseils détaillés par peau à rédiger avec Sam')}</section>
    <section id="bois"><h2 class="title-m">Le bois</h2><p>L'intérieur en sipo absorbe et rend l'humidité. Ne le vernissez pas et ne le lavez pas : il travaille avec les cigares.</p></section>
    <section id="humidite"><h2 class="title-m">L'humidité</h2><p>L'hygromètre LEM-01 indique le taux d'humidité ; l'humidificateur ACPL-01 se recharge selon ses indications.</p>${note('taux recommandé, fréquence et liquide de recharge à préciser')}</section>
    <section id="garantie"><h2 class="title-m">La garantie</h2><p>Chaque cave est livrée avec son certificat de pièce : numéro, peau, essence, dates de fabrication, signature de Sam.</p>${note('durée et contenu de la garantie à définir')}</section>
    <section id="cites"><h2 class="title-m">CITES et export</h2><p>Lézard, autruche, python et alligator voyagent avec leurs documents CITES, préparés par l'atelier avec la pièce. Ils sont aussi exigés pour une livraison à bord d'un yacht.</p>${note('pays, délais administratifs et cas de l\'autruche à vérifier')}</section>
    <section id="livraison"><h2 class="title-m">Livraison et délais</h2><p>Huit à dix semaines d'atelier après validation de la composition et du prix. Remise en main propre à l'atelier, ou livraison assurée.</p>${note('modes et zones de livraison à confirmer')}</section>
  </div>
</div>`,
  closing: closing('Une question sur votre cave ?', 'Sam répond lui-même, y compris longtemps après la livraison.', ['rendez-vous.html', 'Écrire à Sam'], null),
});

// ------------------------------------------------------------------ Crédits
page('credits.html', {
  title: 'Crédits photos · Maison Lemony',
  desc: 'Crédits des photographies d\'illustration de la maquette.',
  body: `
<section class="wrap page-head">
  ${crumbs([['index.html', 'Accueil'], [null, 'Crédits photos']])}
  <h1 class="display-l">Crédits photos</h1>
  <p class="lead">Photographies d'illustration issues d'Unsplash (licence Unsplash), en attendant le shooting à l'atelier de Vienne. Aucune ne montre une pièce Lemony.</p>
</section>
<section class="wrap" style="margin-top:48px"><ul class="credits">${Object.entries(P).filter(([k]) => usedPhotos.has(k)).map(([k, [, a, s, alt]]) => `<li>${alt} · <a href="https://unsplash.com/photos/${s}">${a}</a></li>`).join('')}</ul></section>`,
});

// ------------------------------------------------------------------ écriture
// Liens internes sans .html : GitHub Pages sert composer.html à l'adresse /composer
const cleanLinks = html => html
  .replace(/(href|action)="index\.html"/g, '$1="./"')
  .replace(/(href|action)="([a-z0-9-]+)\.html(?=[#?"])/g, '$1="$2');
for (const [f, html] of Object.entries(pages)) fs.writeFileSync(path.join(ROOT, f), cleanLinks(html));
const DATA = { collections: COLLECTIONS, cuirs: CUIRS, tailles: TAILLES, bois: BOIS, metaux: METAUX, messages: MESSAGES, photos: Object.fromEntries(Object.entries(P).map(([k, v]) => [k, url(v[0], 160, 160)])) };
fs.writeFileSync(path.join(ROOT, 'assets/js/data.js'), '// Généré par _src/build.js\nwindow.LEMONY = ' + JSON.stringify(DATA) + ';\n');
console.log('pages :', Object.keys(pages).length, '· photos :', usedPhotos.size);
