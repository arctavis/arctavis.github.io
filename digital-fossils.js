const artworks = [{"number": 16, "title": "Fossil of Block Zero", "description": "The fossilized block zero.", "description_ru": "Окаменевший нулевой блок.", "id": "2e961736caea074171cc741a2cbfac220d20328dc3fa27b3d312ce416a71826di0", "image": "assets/art/016.svg"}, {"number": 17, "title": "Hash Fragment #A1 — The Ancient Code", "description": "A fragment of an ancient hash.", "description_ru": "Фрагмент древнего хэша.", "id": "0e530b6509a0a49666bb7f0b7c9aae92cf907e782345bf24c5904c7d52a3e59ei0", "image": "assets/art/017.svg"}, {"number": 18, "title": "Salt of the Miners — Digital Ore", "description": "Digital proof-of-work ore.", "description_ru": "Цифровая руда PoW.", "id": "c5952f9c5e81bcbbe34f5d776b0b84189d539c97d7789c6741d2cc065959281ci0", "image": "assets/art/018.svg"}, {"number": 19, "title": "MWEB Crystal Delta", "description": "Crystals of privacy.", "description_ru": "Кристаллы приватности.", "id": "f68c0548064a1b3c2d74283998a36945e2700ae6f93e50362aabab83d438af28i0", "image": "assets/art/019.svg"}, {"number": 20, "title": "Silver Quartz — Litecoin Ore", "description": "The primordial mineral of the silver chain.", "description_ru": "Первичный минерал серебряной цепи.", "id": "afbd334b7933036d3c610f2a5d7daaa90fb5d1943f638110fcedd967497ff7eei0", "image": "assets/art/020.svg"}, {"number": 21, "title": "Genesis Shard of 2011", "description": "A shard of the first year.", "description_ru": "Осколок первого года.", "id": "78bd6b7bcaa39f5ac23024b6eee27ddeb5752c9629915f6969770e09c48bcfc4i0", "image": "assets/art/021.svg"}, {"number": 22, "title": "Blockfossil #2017", "description": "Layers of the SegWit era.", "description_ru": "Слои эпохи SegWit.", "id": "0098dda4f428de750a7fd74564d39459e65b490b38b602c52f359d994eed3301i0", "image": "assets/art/022.svg"}, {"number": 23, "title": "Halving Fossil — Scarcity Core", "description": "The core of scarcity.", "description_ru": "Ядро дефицита.", "id": "b8eb9782921b4eeca23cc4adf91549e809f583b23a61851cb604c756f6ab220ci0", "image": "assets/art/023.svg"}, {"number": 24, "title": "Iron Hash Cinder", "description": "Proof-of-work ash, polygonal structures.", "description_ru": "Пепел PoW, полигональные структуры.", "id": "54d3d025312954b114d8e28effb069a0506c5cd85b9651b721304e3a76114964i0", "image": "assets/art/024.svg"}, {"number": 25, "title": "Lightning Relic", "description": "Fossilized lightning.", "description_ru": "Окаменевшая молния.", "id": "f79c6831f84118e257d65b190d916a7dc9a23191a37423f898c6975143eb57b8i0", "image": "assets/art/025.svg"}, {"number": 26, "title": "Miner’s Crown — Proof of Work Relic", "description": "A miner’s relic.", "description_ru": "Реликт шахтёра.", "id": "9726afd2393e25049c13ba458794c4d4a4841378f101c00f2b77a1b74b3dfd6fi0", "image": "assets/art/026.svg"}, {"number": 27, "title": "MWEB Obsidian Gate", "description": "A private portal.", "description_ru": "Приватный портал.", "id": "811cccf20386343a58cb80759c8c2a53292985b0643e47f0ca3f7d4cb6a8c715i0", "image": "assets/art/027.svg"}, {"number": 28, "title": "Forge of the Republic", "description": "A digital forge.", "description_ru": "Цифровая кузница.", "id": "d91de0cfe81628a015026f4b356dc44102c2f1b2ae5b82c271eb631199d7d6d4i0", "image": "assets/art/028.svg"}, {"number": 29, "title": "The Cold Wallet Relic", "description": "A fossilized vault.", "description_ru": "Окаменевший сейф.", "id": "a57a0968343f48f5f5e6f1b1ac98e9619e8aa2e3a0063a0d665a2ccea432e05bi0", "image": "assets/art/029.svg"}, {"number": 30, "title": "Block Summit — The Eternal Peak", "description": "", "description_ru": "", "id": "a48bb8c3a641b4b5b92b8fd12f4f707d784d60eefedb805ed300ebba89339a26i0", "image": "assets/art/030.svg"}];
const gallery = document.querySelector('#gallery');
const cards = [...gallery.children];
const search = document.querySelector('#search');
const sort = document.querySelector('#sort');
function filterGallery() {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  for (const card of cards) {
    card.hidden = !(card.dataset.title.includes(query) || card.dataset.number.padStart(3, '0').includes(query));
    if (!card.hidden) count++;
  }
  document.querySelector('#result-count').textContent = `${count} ${count === 1 ? 'work' : 'works'}${query ? ' found' : ' in this chapter'}`;
  document.querySelector('#empty').hidden = count !== 0;
}
search.addEventListener('input', filterGallery);
sort.addEventListener('change', () => {
  cards.sort((a, b) => sort.value === 'asc' ? a.dataset.number - b.dataset.number : b.dataset.number - a.dataset.number);
  cards.forEach(card => gallery.append(card));
});
const viewer = document.querySelector('#viewer');
let currentIndex = 0;
let returnFocus;
function showArtwork(index) {
  currentIndex = index;
  const work = artworks[index];
  document.querySelector('#viewer-title').textContent = work.title;
  document.querySelector('#viewer-count').textContent = `${String(work.number).padStart(3, '0')} · ${index + 1} OF ${artworks.length} ARTIFACTS`;
  const image = document.querySelector('#viewer-img');
  image.src = work.image;
  image.alt = `${work.title} — artwork by Arctavis`;
  document.querySelector('#viewer-id').textContent = work.id;
  document.querySelector('#viewer-description').textContent = work.description;
  document.querySelector('#original-link').href = `https://ordliteverse.com/inscription/${work.id}`;
  document.querySelector('#svg-link').href = work.image;
  document.querySelector('#svg-link').download = `arctavis-${String(work.number).padStart(3,'0')}.svg`;
  document.querySelector('#previous').disabled = index === 0;
  document.querySelector('#next').disabled = index === artworks.length - 1;
}
document.querySelectorAll('.art-open, .title-open').forEach(trigger => {
  trigger.addEventListener('click', event => {
    event.preventDefault();
    returnFocus = trigger;
    showArtwork(artworks.findIndex(work => work.number === Number(trigger.dataset.number)));
    viewer.showModal();
    document.body.classList.add('modal-open');
    document.querySelector('#close-viewer').focus();
  });
});
document.querySelector('#close-viewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  returnFocus?.focus();
});
viewer.addEventListener('click', event => {
  const rect = viewer.getBoundingClientRect();
  if (event.target === viewer && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) viewer.close();
});
document.querySelector('#previous').addEventListener('click', () => { if (currentIndex > 0) showArtwork(currentIndex - 1); });
document.querySelector('#next').addEventListener('click', () => { if (currentIndex < artworks.length - 1) showArtwork(currentIndex + 1); });
viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && currentIndex > 0) {event.preventDefault();showArtwork(currentIndex - 1);}
  if (event.key === 'ArrowRight' && currentIndex < artworks.length - 1) {event.preventDefault();showArtwork(currentIndex + 1);}
});
document.querySelector('#copy-address').addEventListener('click', async () => {
  const address = document.querySelector('#address');
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(address.textContent);
    status.textContent = 'Address copied.';
  } catch {
    const range = document.createRange();range.selectNodeContents(address);
    const selection = window.getSelection();selection.removeAllRanges();selection.addRange(range);
    status.textContent = 'Address selected. Copy it using your browser.';
  }
});
