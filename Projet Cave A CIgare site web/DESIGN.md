---
name: Maison Lemony
description: Caves à cigares sur mesure, cousues main par Samuel Basmadjian à Vienne. Le site est le carnet d'atelier de Sam, pas une vitrine.
colors:
  papier: "#F3EEE4"
  encre: "#1E1A16"
  kraft: "#E5DCCB"
  filet: "#CFC4AE"
  mine: "#625849"
  cognac: "#8F5530"
  danger: "#A8322D"
  footer-rule: "#3A332B"
  footer-muted: "#B9AE99"
typography:
  display-xl:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(42px, 6.2vw, 88px)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.012em"
  display-l:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(36px, 4.2vw, 56px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.008em"
  title-m:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(26px, 2.4vw, 32px)"
    fontWeight: 500
    lineHeight: 1.12
  voix:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(26px, 2.6vw, 36px)"
    fontWeight: 400
    lineHeight: 1.3
  lead:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(20px, 1.6vw, 23px)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1.55
    fontFeature: "\"onum\" 1, \"pnum\" 1"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "11.5px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.18em"
  caption-mono:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.08em"
  note:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "11.5px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.01em"
  measure:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    letterSpacing: "0.04em"
    fontFeature: "\"lnum\" 1, \"tnum\" 1"
rounded:
  none: "0px"
  round: "50%"
spacing:
  gutter: "clamp(20px, 4vw, 56px)"
  page-max: "1360px"
  header: "84px"
  header-compact: "68px"
  section: "clamp(96px, 11vw, 168px)"
  section-head: "clamp(36px, 4vw, 56px)"
  panel: "clamp(24px, 3vw, 40px)"
  field: "30px"
components:
  button-primary:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.papier}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "17px 26px"
  button-primary-hover:
    backgroundColor: "{colors.cognac}"
    textColor: "{colors.papier}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.encre}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "17px 26px"
  button-secondary-hover:
    backgroundColor: "{colors.kraft}"
    textColor: "{colors.encre}"
  link-atelier:
    backgroundColor: "transparent"
    textColor: "{colors.encre}"
    typography: "{typography.label}"
    padding: "14px 0 7px"
  link-atelier-hover:
    textColor: "{colors.cognac}"
  nav-link:
    textColor: "{colors.encre}"
    typography: "{typography.label}"
    padding: "10px 0"
  field-input:
    backgroundColor: "transparent"
    textColor: "{colors.encre}"
    rounded: "{rounded.none}"
    padding: "8px 0 10px"
  choice-card:
    backgroundColor: "{colors.papier}"
    textColor: "{colors.encre}"
    rounded: "{rounded.none}"
    padding: "16px 18px"
  panel:
    backgroundColor: "{colors.papier}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel}"
  panel-kraft:
    backgroundColor: "{colors.kraft}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel}"
  fiche:
    backgroundColor: "{colors.papier}"
    textColor: "{colors.encre}"
    rounded: "{rounded.none}"
    padding: "28px 28px 24px"
  site-footer:
    backgroundColor: "{colors.encre}"
    textColor: "{colors.papier}"
---

# Design System: Maison Lemony

## Overview

**Creative North Star: "Le Carnet d'atelier"**

The site is Sam's workshop notebook, not a showroom. Everything sits on daylight paper (papier), written in ink (encre), with kraft for the surfaces a hand would pin a sample to and filet hairlines for the ruled grid of the page. Cognac is the pencil: it draws the cotes, numbers the pieces, writes the annotations, and nothing else. The world derives from the binding charte « Direction A · L'Établi » v1.0 (`Livrable_Charte_Maison_Lemony/web/tokens.css`); the build is the normative record where it departs.

The voice is Cormorant Garamond at a generous reading size (19px, weight 500, old-style figures), set against IBM Plex Mono for everything that measures, labels or acts. Layout is airy and editorial: wide sections, asymmetric two-column splits, real daylight photographs bleeding off one edge of the page, and long ruled lists in place of card grids. Depth is flat paper; structure comes from rules, not shadows. Motion is slow and quiet: text settles up 12px, cotes draw left to right, large photos breathe toward 1.04.

The category's dark-club humidor page and the e-commerce product configurator are the confirmed rejections. Nothing is bought here: buttons lead to a composition or a conversation, never to a cart or a price.

**Key Characteristics:**
- Papier ground, encre text and primary action, kraft surfaces, filet hairlines, cognac only as the annotating pencil.
- Cormorant for voice, Plex Mono for measures, labels and buttons; italic reserved for Sam's real words.
- The cote (dimension line with end ticks) is the recurring graphic, drawn on scroll.
- Square corners everywhere; circles only for physical samples (metal finishes, colour chips, radio ticks).
- Flat paper: hairline rules and tonal kraft fields instead of shadows.
- Real daylight photography, full-bleed to one page edge; missing shots shown as honest dashed placeholders.

## Colors

A warm paper-and-ink palette with a single pencil-brown accent; everything else is a tint of the workbench.

### Primary
- **Encre** (encre): titles, body text, the logo, the primary button, the active tab and stepper marker, the heavy top rule of ledgers, lists and the fiche. Also the ground of the night footer.

### Secondary
- **Cognac** (cognac): the pencil. Cote lines and their ticks, piece numbers, mockup annotations, link underlines, the hover state of the primary button and links, the keyboard focus outline, text selection, and the done state of the composer stepper. Never a section background, never the only carrier of information.

### Neutral
- **Papier** (papier): the page ground and the fill of the fiche, panels and choice cards. Daylight on the workbench.
- **Kraft** (kraft): surfaces: the closing band before the footer, context boxes, kraft panels, photo loading ground, the secondary button hover, and the placeholder for photos still to shoot.
- **Filet** (filet): hairlines only: section and list rules, card and choice borders, table rows, the scrolled header rule, scrollbar thumb. Never text on papier.
- **Mine de plomb** (mine): secondary text, mono captions, field labels, table headers, empty fiche values, the dashed outline of photos to shoot.
- **Danger** (danger): field error underline and error message. The build darkens the charte's `#D83A34` to this value so error text holds AA on papier.
- **Footer rule / footer muted** (footer-rule, footer-muted): the hairline and the small print inside the encre footer, where filet and mine would vanish.

### Named Rules
**The Pencil Rule.** Cognac annotates: cotes, numbers, notes, hover, focus. It never fills a section, a card or a button at rest.

**The Hairline Rule.** Filet draws lines and borders and nothing else; it never sets text on papier.

## Typography

**Display Font:** Cormorant Garamond (with Georgia, serif)
**Body Font:** Cormorant Garamond (with Georgia, serif)
**Label/Mono Font:** IBM Plex Mono (with ui-monospace, monospace)

**Character:** A literary Garamond that speaks in full sentences, paired with a technical mono that reads like the pencil marks on a pattern. Both self-hosted (SIL OFL) in `maquette/assets/fonts/`.

### Hierarchy
- **Display XL** (500, clamp 42-88px, 1, -0.012em): the home hero headline only.
- **Display L** (500, clamp 36-56px, 1.04, -0.008em): section headings and inner page titles. Collection names in the index list run at clamp(36px, 4.4vw, 60px), line-height 1.
- **Title M** (500, clamp 26-32px, 1.12): sub-section and step headings, timeline steps.
- **Voix** (italic 400, clamp 26-36px, 1.3): Sam's real quotations only, signed with the mark and a tracked mono signature.
- **Lead** (400, clamp 20-23px, 1.45, max 36em): the two-line introduction under a page title.
- **Body** (500, 19px, 1.55, old-style proportional figures): running text, max 34em per column. 19px is the floor for reading text.
- **Label** (Plex Mono 500, 11.5px, 0.18em, uppercase): buttons, navigation, tabs, field labels, the atelier link.
- **Caption mono** (Plex Mono 400, 12px, 0.08em, uppercase, mine): materials under a name, swatch codes, fiche sub-values.
- **Note** (Plex Mono 400, 11.5px, 0.01em, sentence case): hints, fiche footnotes, mockup notes and the merci disclaimer.
- **Measure** (Plex Mono 400, 13px, lining tabular figures): numeric cells in spec tables; elevation drawings label in 12px mono.

### Named Rules
**The Measure Rule.** Anything that is a dimension, a count, a code or an action is mono; anything that is a sentence is Cormorant.

**The Label Floor Rule.** Mono text is never set below 11.5px. The only exception is the logo lockup's tagline, which belongs to the logo artwork.

**The Real Voice Rule.** Italic is Sam's quoted voice, never decoration and never invented.

## Layout

A single centered page column, `min(1360px, 100vw - 2 × gutter)`, with a fluid gutter (spacing.gutter). Sections open with generous top space (spacing.section); a section head is a two-column grid with the heading left and either a short body or an atelier link right-aligned to the baseline.

The recurring compositions are asymmetric: the hero is 1.55fr text to 1fr photo with the photo bleeding off the right edge of the viewport; splits are 1:1 with a 4:5 photo that can bleed left or right; the composer is 1.5fr choices to a sticky fiche; rendez-vous is 1.45fr form to a Sam aside. Lists replace grids: ledgers (4 columns divided by filet), the collection index (full-width rows with a peeking photo on hover), facts in two columns, horizontal snap strips of 3:4 photos.

Breakpoints from the build: 960px (header collapses to the menu button, composer and fiche stack), 860px (hero, splits, footer and section heads go single column; the hero photo moves above the text at 16:10), 760px (timeline, choices, metals and the index list collapse), 640px (form grid to one column). The sticky header is 84px, 68px under 960px.

## Elevation & Depth

Flat paper. There are no drop shadows anywhere in the system. Depth is conveyed by rules (an encre top rule over a filet grid), by the kraft tonal field against papier, and by the encre footer as the one dark ground. The only box-shadows in the build are inset 1px hairlines: around round colour chips and metal finishes (a 12-18% encre ring so pale swatches keep an edge), and the inset encre ring that doubles the border of a selected choice.

### Named Rules
**The Flat Paper Rule.** Nothing floats. State is shown by a heavier rule, a filled tick or a colour change, never by lifting a surface.

## Shapes

Square corners throughout (rounded.none): buttons, fields, cards, panels, the fiche, photos. Circles (rounded.round) are reserved for things that are physically round or stand for a physical sample: metal finish discs, colour chips in the composer, the radio tick. Borders are 1px hairlines (filet at rest, mine on hover, encre when selected or structural); dashed 1px borders mean "provisional": cognac dashes above mockup notes, mine dashes around photos still to shoot. Line drawings (front elevations of the caves) are 1.2px encre strokes with 1px cognac cotes.

## Components

### Buttons
Quiet, typeset, square. Three levels from the charte; none of them buys.
- **Shape:** square (0px), 1px border slot always present.
- **Primary:** encre fill, papier label text, 17px × 26px, with an 18 × 9px drawn arrow. One per screen; site-wide its words are "Composer ma cave" (user decision overriding the charte's "Prendre rendez-vous"); on collection pages it reads "Composer à partir de [collection]".
- **Hover / Focus:** primary turns cognac; secondary fills kraft; transitions 0.35s on the system ease. Focus is the global 2px cognac outline at 3px offset. Disabled sits at 45% opacity.
- **Secondary:** transparent with a 1px encre border, same label and padding.
- **Atelier link (tertiary):** mono label with no box, underlined by a 1px cognac rule; hover turns the text cognac. Used for "Prendre rendez-vous" and section-head links.

### Chips (colour and metal samples)
- **Style:** a 46px (composer) or 44px (metals list) disc filled with the sample colour, edged by an inset encre hairline; square 112px swatches on material pages, outlined in encre at 3px offset on hover.
- **State:** they live inside choice cards; selection is shown by the card, not the chip.

### Cards / Containers
- **Corner Style:** square.
- **Background:** papier panels with a 1px filet border, or kraft panels with matching kraft border; context boxes are kraft without border.
- **Shadow Strategy:** none (see Flat Paper Rule).
- **Internal Padding:** spacing.panel; context boxes 22px × 24px.
- **Choice card:** a grid of media, name (22px Cormorant) with a mono caption, and a round tick. Filet border at rest, mine on hover, encre border plus inset encre ring and filled tick when checked; focus outline moves to the card.

### Inputs / Fields
- **Style:** underline-only: transparent ground, 1px encre bottom rule, 21px Cormorant 500 text, mono label above in mine. Textareas get a filet frame and a faint kraft wash (35%). Selects keep the underline with a drawn chevron.
- **Focus:** the underline turns cognac and doubles to 2px (border plus 1px shadow line); no glow.
- **Error / Disabled:** danger underline and a 12px mono 500 message beneath.

### Navigation
- **Style:** slim sticky papier header, logo mark plus spaced Cormorant wordmark left, mono label links right with 34px gaps, FR/EN switch, and a compact primary button. A filet rule appears under the header once scrolled.
- **Active:** current page underlined by a 1px cognac rule. Tabs on inner pages use a 2px encre underline for the current tab and mine for the rest.
- **Mobile:** under 960px a three-line drawn menu button opens a full-height papier sheet with 34px Cormorant links divided by filet rules and full-width buttons at the foot.
- **Breadcrumbs:** 18px Cormorant in mine, slash separators in filet.

### Cote (signature)
The dimension line with end ticks, Sam's pencil mark. A 1px cognac line between two 9px ticks, flanked by mono uppercase text in cognac. With `data-draw`, the line scales in from the left (0.9s) and the text fades in after (0.6s, 0.7s delay) when it enters the viewport. It states lead times under the hero photo, marks the timeline steps, and underlines each value in the fiche.

### Fiche de pièce (signature)
The composer's summary card, styled as a workshop record: papier ground with a 1px encre frame, a 30px heading over an encre rule, rows of mono label (92px column) and Cormorant value divided by filet rules, a cognac piece-number slot ("N° à attribuer"), mono footnotes, and a full-width primary button. Sticky beside the choices on desktop. Each newly set value flashes from cognac to encre (0.9s) and gains its cote.

### Front elevation (signature)
A line drawing of the cave seen from the front, scaled from the real exterior dimensions: encre box, lid line and clasp, cognac cotes for width and height, mono dimensions in cognac with depth in mine. Used in size choices and collection pages in place of a product render.

### Ruled lists
Ledger, index list, facts, specs table, FAQ and contact lines share one grammar: an encre top rule, filet rules between entries, mono labels over Cormorant values. The index list indents 18px on hover while its cognac arrow slides 6px. FAQ toggles are a drawn plus that rotates 45°.

### Photo
Full-bleed daylight photographs in square frames over a kraft loading ground. Large ones carry the slow zoom (to 1.04 over 6s). A photo not yet shot is a kraft box with a dashed mine border and a mono caption saying what is to be shot.

## Do's and Don'ts

### Do:
- **Do** keep papier as the page ground and encre for text and the single primary button per screen.
- **Do** reserve cognac for cotes, piece numbers, annotations, hover and focus (The Pencil Rule).
- **Do** set every measure, code, label and action in IBM Plex Mono at 11.5px or larger, and every sentence in Cormorant at 19px or larger.
- **Do** draw structure with 1px rules: an encre rule to open a list, filet rules between entries.
- **Do** use the cote with end ticks as the recurring graphic, drawn left to right on scroll.
- **Do** show sizes as dimensioned front elevations and colours as indicative samples.
- **Do** move with the system ease `cubic-bezier(.16, 1, .3, 1)`: fade and 12px rise over 0.9s, and drop every transition under reduced motion.
- **Do** mark missing photographs honestly with the dashed "à photographier" placeholder.

### Don't:
- **Don't** fill a section, card or resting button with cognac.
- **Don't** use filet for text.
- **Don't** round corners on rectangles or add drop shadows; circles are for physical samples only.
- **Don't** use italic except for Sam's real quotations.
- **Don't** build a shop picker or configurator chrome: no prices, carts, "Acheter", "Ajouter au panier" or "Voir le prix" anywhere in the UI.
- **Don't** turn the site into a dark-club humidor page; encre is a ground only for the footer.
- **Don't** put photo credit captions under images; credits live on the credits page.
- **Don't** use renders or AI-generated imagery in place of the workshop photographs.
