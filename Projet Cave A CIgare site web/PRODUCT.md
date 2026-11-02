# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS with a little vanilla JavaScript (user's choice, 2026-10-31). Multi-page, opens directly in a browser, no build step. Current deliverable is a clickable mockup of the whole site in `maquette/`.

## Users

- Wealthy cigar amateurs (France, Switzerland, Monaco, Middle East, US) looking for a unique, signed piece with a story; they browse calmly, often on mobile, and decide over weeks.
- Professional buyers: golf clubs, yachting, palaces and cigar lounges, business gifts. They need a fast, precise contact path.
- Sam Basmadjian himself, who receives every request and answers personally.

## Product Purpose

Showcase Maison Lemony's made-to-measure cigar humidors and turn interest into a qualified conversation with Sam. Nothing is sold online. Success = a visitor composes a cave (size, leather, colour, wood, metal, engraving) or picks a collection, then sends a request that reaches Sam already precise.

## Positioning

The cave is made by one named craftsman: Samuel Basmadjian, Maître artisan d'art in Vienne (Isère), third generation of tanners. Every piece is numbered, made by hand in 8 to 10 weeks, about ten pieces a month at most.

## Operating Context

- Site tree "B · Atelier de composition" (chosen 2026-10-31): Composer ma cave · Matières · La Maison · Rendez-vous. Wireframes in `_wireframes/site/`.
- No live visualiser or 3D simulator: "Composer ma cave" is a sequence of choices ending in a request to Sam.
- Choosing a collection pre-fills the contact message with a text specific to that collection.
- Collections: Héritage (veau, bovin, agneau, chèvre), Élégance (lézard, autruche), Excellence (python), Prestige (alligator porosus, niloticus), plus Éditions (Black, Carbone, Polar White, Shadow Blue…).
- Sizes: 100 cigares (ext. 375 × 245 × 119 mm), 150 cigares (ext. 405 × 285 × 128 mm). Woods: sipo (interior, always), noyer américain, tulipier noir, bambou caramel, érable sycomore, carbone. Metals: doré poli, argent poli, noir PVD. Instruments: hygromètre LEM-01, humidificateur ACPL-01.

## Capabilities and Constraints

- Never display a price; "prix sur demande, après une conversation" (charte). Pricing to be settled with Sam.
- Lead time: 8 to 10 weeks (charte, brochure).
- Contact form: four fields at most (name, email or phone, country, project), no budget field. Response promise "Sam vous répond sous 48 heures" (to be confirmed).
- Primary action site-wide: "Composer ma cave" (user decision, overrides the charte's "Prendre rendez-vous"); one primary button per screen.
- Bilingual FR / EN planned; mockup in French.
- Open: which colourways exist as real photos, sizes 200/300+, CITES copy, accessories scope, Instagram handle.

## Brand Commitments

- Charte graphique v1.0 « Direction A · L'Établi » in `Livrable_Charte_Maison_Lemony/` (tokens.css, brand.json, logos) is binding.
- Voice: precise, sensual, sober; trade words over marketing words; short sentences; italic only for Sam's real quotes, never invented.
- Do not cite Hermès. Do not stack superlatives (exception, noble, absolu, prestigieux). Never "Acheter", "Ajouter au panier", "Voir le prix".
- No AI-generated imagery in production; stock photos in the mockup are placeholders until the workshop shoot.

## Evidence on Hand

- Fiche d'immersion and site audit (`_fiche/`), brochure facts, charte (`Livrable_Charte_Maison_Lemony/`).
- Real references: La Pyramide (Vienne), Cigar and Spice (Genève), Jazz à Vienne 2023 partner; press: Le Dauphiné Libéré, L'Essor, magazine de la CMA (oct. 2026). Permission to cite clients not yet confirmed.
- Contact: atelier Vienne (38200) sur rendez-vous, sam@lemony-design.com, +33 6 17 52 85 59.
- Missing: portrait of Sam, workshop photos, real packshots per colourway, testimonials. Do not fabricate them.

## Product Principles

1. The man is the brand: show Sam, his hands and his workshop before the object.
2. Everything leads to a conversation, never to a checkout.
3. The real, never the render.
4. Precision over praise: dimensions, leathers, weeks, piece numbers.

## Accessibility & Inclusion

WCAG 2.1 AA contrast on the pairs actually used; body text 19px minimum in Cormorant 500; visible keyboard focus (2px cognac outline, 3px offset); cognac never carries information alone; motion never hides content and respects reduced motion.
