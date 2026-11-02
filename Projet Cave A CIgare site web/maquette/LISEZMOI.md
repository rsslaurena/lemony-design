# Maquette du site Maison Lemony

Maquette cliquable de tout le site (arborescence B), construite sur la charte « L'Établi ».

## L'ouvrir

Double-cliquer sur `index.html` suffit. Pour que le parcours Composer → Rendez-vous → Merci garde la composition d'une page à l'autre, préférer le petit serveur :

```bash
node maquette/_src/serve.js
```

puis ouvrir http://localhost:4321.

## Modifier

Les textes, collections, cuirs, coloris et messages pré-remplis sont dans `_src/build.js`. Après une modification :

```bash
node maquette/_src/build.js
```

Styles : `assets/css/site.css` (tokens de la charte en tête). Comportements : `assets/js/site.js`.

## Ce qui est provisoire

- Les photos viennent d'Unsplash et sont légendées « Photo d'illustration » ; elles seront remplacées par le shooting d'atelier. Crédits : `credits.html`.
- Les noms et teintes de coloris sont provisoires.
- Les mentions « À valider », en cognac, signalent les points à trancher avec Sam (citations de clients, CITES, garantie, délai de réponse, formats 200/300+).
- Aucun message n'est réellement envoyé.
