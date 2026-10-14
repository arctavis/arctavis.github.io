# Arctavis — Three Chapters of Litecoin Art

Static, dependency-free exhibition for the three-chapter **Arctavis** collection. Includes 42 original onchain SVG artworks, searchable chapter galleries, accessible artwork viewers, inscription links, and the original support address.

## Run locally

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. No build, API key, wallet connection, or third-party font is required. GitHub Pages can serve the root directory directly.

## Collection and provenance

- `data/collection.json` and `data/inscriptions.json`: supplied collection metadata.
- `data/artworks.json`: display titles, image paths, and inscription IDs.
- `assets/art/001.svg` through `015.svg`: unmodified SVG content retrieved from `https://ordliteverse.com/content/{inscription_id}`.
- `assets/cover.jpg`: social preview derived from work 001; originals remain SVG.

The HTML pages contain static cards, which remain accessible without JavaScript. The first two chapters embed gallery records in JavaScript; Chapter III reads its records from `data/american-symbols/artworks.json`. Search and in-page artwork viewers require JavaScript.

External explorer availability only affects outbound inscription links, not the exhibition images. The site is a showcase; it does not list NFTs for sale, sign transactions, or make ownership assertions. All three chapters are represented as available exhibits.


## II. Digital Fossils

15 original Litecoin inscriptions, works 016–030, displayed at `digital-fossils.html`.
Collection metadata: `data/digital-fossils/meta.json`. Inscription manifest: `data/digital-fossils/inscriptions.json`. Gallery data: `data/digital-fossils/artworks.json`. SVG originals are stored without modification in `assets/art/016.svg` through `030.svg`.

Number 028 is Forge of the Republic (d91de0…d6d4i0); number 029 is The Cold Wallet Relic (a57a09…e05bi0), per the artist’s correction. No description was supplied for number 030, so its description is left empty. English descriptions translate the artist’s Russian descriptions, which are retained alongside them.

## III. American Symbols of Innovation

Twelve original Litecoin inscriptions, works 031–042, shown in [American Symbols of Innovation](american-symbols.html). Artwork metadata: `data/american-symbols/artworks.json`, inscription manifest: `data/american-symbols/inscriptions.json`, collection metadata: `data/american-symbols/meta.json`.

The original SVGs were retrieved from Litecoin inscription-content endpoints (`ordliteverse.com/content/{inscription_id}` with `ordinalslite.com/content/{inscription_id}` as fallback), checked for valid SVG format, and stored locally as `assets/art/031.svg` through `042.svg`. Their sources are not substituted with generated artwork.

The finale, #042 **The American Genesis — Union of Liberty & Code**, is highlighted in understated gold as **Genesis Masterpiece · Collection Finale**, an artist-designated distinction. No assertion is made about verified rarity, market value, or sale price.

## Current chapter status and validation

- **Historical Genesis:** 15 works (#001–015), all SVG originals stored locally.
- **Digital Fossils:** 15 works (#016–030), all SVG originals stored locally. #028 is **Forge of the Republic** and #029 is **The Cold Wallet Relic**.
- **American Symbols of Innovation:** 12 works (#031–042), all SVG originals stored locally.
- Description for #030 was not supplied, so it remains blank.

To check all 42 inscription IDs, SVG files, artwork sequences, JSON records, and static gallery cards, run:

```sh
node scripts/validate-gallery.mjs
```

The validation checks website integrity and SVG syntax; it does not independently authenticate onchain ownership, rarity or monetary value. A one-shot import workflow exists at `.github/workflows/import-american-symbols.yml` to retrieve and validate original inscriptions again if needed.
