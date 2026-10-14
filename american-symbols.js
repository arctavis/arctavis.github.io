/* Arctavis — Chapter III gallery controls and accessible in-page artwork viewer.
   Static cards remain usable as ordinary inscription links without JavaScript. */
(async () => {
  const grid = document.querySelector('#gallery');
  if (!grid) return;
  let artworks;
  try {
    const response = await fetch('data/american-symbols/artworks.json');
    if (!response.ok) return;
    artworks = await response.json();
    if (!Array.isArray(artworks) || artworks.length !== 12) return;
  } catch { return; }

  const cards = [...grid.querySelectorAll('.card')];
  const toolbar = document.querySelector('.collection .toolbar');
  const count = document.createElement('p');
  count.id = 'result-count';
  count.setAttribute('role', 'status');
  count.textContent = '12 works in this chapter';
  toolbar.replaceChildren(count);

  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.innerHTML = '<label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Find a work…" aria-label="Search artwork titles or numbers"></label><label class="sort"><span class="sr-only">Sort artworks</span><select id="sort"><option value="asc">Chapter order ↑</option><option value="desc">Reverse order ↓</option></select></label>';
  toolbar.append(controls);

  const empty = document.createElement('p');
  empty.id = 'empty';
  empty.hidden = true;
  empty.textContent = 'No works found. Try another title or number.';
  grid.after(empty);

  const search = controls.querySelector('#search');
  const sort = controls.querySelector('#sort');
  function filter() {
    const q = search.value.trim().toLowerCase();
    let visible = 0;
    for (const card of cards) {
      const match = card.dataset.title.includes(q) || card.dataset.number.padStart(3, '0').includes(q);
      card.hidden = !match;
      if (match) visible++;
    }
    count.textContent = visible + (visible === 1 ? ' work' : ' works') + (q ? ' found' : ' in this chapter');
    empty.hidden = visible > 0;
  }
  search.addEventListener('input', filter);
  sort.addEventListener('change', () => {
    cards.sort((a, b) => sort.value === 'asc' ? Number(a.dataset.number)-Number(b.dataset.number) : Number(b.dataset.number)-Number(a.dataset.number));
    cards.forEach(card => grid.append(card));
  });

  const viewer = document.createElement('dialog');
  viewer.id = 'viewer';
  viewer.setAttribute('aria-labelledby', 'viewer-title');
  viewer.innerHTML = '<div class="viewer-top"><span id="viewer-count"></span><button id="close-viewer" aria-label="Close artwork viewer">Close ×</button></div><div class="viewer-body"><div class="viewer-image"><img id="viewer-img" alt="" width="1024" height="1024"></div><div class="viewer-details"><p class="eyebrow">AMERICAN SYMBOLS OF INNOVATION</p><h2 id="viewer-title"></h2><p>By Arctavis · Litecoin inscription</p><p id="viewer-description"></p><p id="viewer-designation" class="finale-designation" hidden>GENESIS MASTERPIECE · COLLECTION FINALE</p><dl><dt>INSCRIPTION ID</dt><dd id="viewer-id"></dd><dt>MEDIUM</dt><dd>SVG · Original on-chain artwork</dd><dt>CHAPTER</dt><dd>III. American Symbols of Innovation</dd></dl><a class="primary" id="original-link" target="_blank" rel="noopener noreferrer">View on-chain record ↗</a><a class="download" id="svg-link" download>Download original SVG ↓</a><div class="viewer-navigation"><button id="previous" aria-label="Previous artwork">← Previous</button><button id="next" aria-label="Next artwork">Next →</button></div></div></div>';
  document.body.append(viewer);
  let currentIndex = 0;
  let focusReturn;
  const img = viewer.querySelector('#viewer-img');
  function show(index) {
    currentIndex = index;
    const work = artworks[index];
    viewer.querySelector('#viewer-count').textContent = String(work.number).padStart(3,'0') + ' · ' + (index+1) + ' OF 12 ARTIFACTS';
    viewer.querySelector('#viewer-title').textContent = work.title;
    viewer.querySelector('#viewer-description').textContent = work.description || work.description_ru || '';
    viewer.querySelector('#viewer-designation').hidden = work.number !== 42;
    viewer.querySelector('#viewer-id').textContent = work.id;
    img.src = work.image;
    img.alt = work.title + ' — artwork by Arctavis';
    viewer.querySelector('#original-link').href = 'https://ordliteverse.com/inscription/' + work.id;
    const download = viewer.querySelector('#svg-link');
    download.href = work.image;
    download.download = 'arctavis-' + String(work.number).padStart(3,'0') + '.svg';
    viewer.querySelector('#previous').disabled = index === 0;
    viewer.querySelector('#next').disabled = index === artworks.length-1;
  }

  document.querySelectorAll('.card .art-open, .card h3 a, .hero-art .art-open').forEach(link => {
    link.addEventListener('click', event => {
      const num = Number(link.closest('[data-number]')?.dataset.number || 42);
      const index = artworks.findIndex(a => a.number === num);
      if (index < 0) return;
      event.preventDefault();
      focusReturn = link;
      show(index);
      viewer.showModal();
      document.body.classList.add('modal-open');
      viewer.querySelector('#close-viewer').focus();
    });
  });
  viewer.querySelector('#close-viewer').addEventListener('click', () => viewer.close());
  viewer.querySelector('#previous').addEventListener('click', () => { if(currentIndex > 0) show(currentIndex-1); });
  viewer.querySelector('#next').addEventListener('click', () => { if(currentIndex < 11) show(currentIndex+1); });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && currentIndex > 0) { event.preventDefault(); show(currentIndex-1); }
    if (event.key === 'ArrowRight' && currentIndex < 11) { event.preventDefault(); show(currentIndex+1); }
  });
  viewer.addEventListener('close', () => { document.body.classList.remove('modal-open'); focusReturn?.focus(); });
  viewer.addEventListener('click', event => {
    const rect = viewer.getBoundingClientRect();
    if (event.target === viewer && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) viewer.close();
  });
  document.querySelector('#copy-address')?.addEventListener('click', async () => {
    const addr = document.querySelector('#address');
    const status = document.querySelector('#copy-status');
    try { await navigator.clipboard.writeText(addr.textContent); status.textContent='Address copied.'; }
    catch { status.textContent='Select the address to copy it.'; }
  });
})();
