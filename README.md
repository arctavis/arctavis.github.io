# Arctavis — Historical Genesis

Static, dependency-free exhibition for **I. Historical Genesis — A New Era**. Includes 15 local SVG works, a searchable gallery, artwork viewer with keyboard navigation, links to Litecoin inscription records, and the original support address.

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

The embedded gallery records in `gallery.js` and static cards in `index.html` reflect the same 15 records. When updating the collection, update both as well as the data files. The static cards remain accessible without JavaScript; search and the modal viewer require JavaScript.

External explorer availability only affects outbound inscription links, not the exhibition images. The site is a showcase; it does not list NFTs for sale, sign transactions, or make ownership assertions. The other two series chapters are mentioned using the supplied metadata but are not represented as available exhibits.
