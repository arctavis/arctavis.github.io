const artworks = [{"number": 1, "title": "Genesis Spark", "id": "d8fe722d5ca9cda7ee02668b329531f4584a59cc2ba6d9040d2fb9f8aee789fdi0", "image": "assets/art/001.svg"}, {"number": 2, "title": "Rebel Miners: The GPU Frontier", "id": "d09504e3ac990253338aa74bb80c104fcc84376ef5c9c0ad08394df0c6eba646i0", "image": "assets/art/002.svg"}, {"number": 3, "title": "The Pioneer Node: Foundation Of The Chain", "id": "ca3d383714ba32e8def1cd8b21dab945e6286369bd2bdb0b8ab8d0728d74ddeei0", "image": "assets/art/003.svg"}, {"number": 4, "title": "SegWit Revolt: The Battle Of Scalability", "id": "e5c873026b182b5774ae61716457ab45c8a5df39ae8cd33eec0e62dcad89ddbei0", "image": "assets/art/004.svg"}, {"number": 5, "title": "Halving Act I: Scarcity Decree", "id": "3594657d892448c34530b7f8596c0150769925b14143ec81056a997a1947be8ai0", "image": "assets/art/005.svg"}, {"number": 6, "title": "Commerce Awakening: The First Crypto Merchants", "id": "64fcde8becb5fc0dcfdae27f1d97b5ac3c2a9d2aa16a01f1bcd645976f9eee12i0", "image": "assets/art/006.svg"}, {"number": 7, "title": "Lightning Covenant: The Pact Of Instant Energy", "id": "107dd0f747f4d3bda399b1de2c7acaac3c77ffbea74338d60b1d3f7143550bd7i0", "image": "assets/art/007.svg"}, {"number": 8, "title": "MWEB: The Privacy Amendment", "id": "511dac3cf5a0fee3066378a4b17d4c4b43e193457a0d4aaed93238d476bf90bei0", "image": "assets/art/008.svg"}, {"number": 9, "title": "The Node Reformation: Unchaining Of The Republic", "id": "16c7bb458fa4657314fde5fdb68cb0bb216030fd3ca59eac60a9fd82c75438dbi0", "image": "assets/art/009.svg"}, {"number": 10, "title": "Halving Act II: The Great Division", "id": "0d6464bad346a57d218d6bc04b78c690f9468e725ad13baa06cceb69510eec99i0", "image": "assets/art/010.svg"}, {"number": 11, "title": "ETF Era: The Institutional Recognition", "id": "49e07fc9c50e6f4c04f9aa3b58104cc334809a357402399f5ad8afca7e8b3c11i0", "image": "assets/art/011.svg"}, {"number": 12, "title": "Ordinal Frontier: The Cultural Awakening", "id": "1aeb7825db0107fb1e4c1c31877866dd17ad42d920554c0c9ec88e7cbad733a6i0", "image": "assets/art/012.svg"}, {"number": 13, "title": "Era Of Miners: The Iron Brotherhood", "id": "eba70cec22d516fa00b9fcd2953cc4becfe968f871376f21322cfdf222c80390i0", "image": "assets/art/013.svg"}, {"number": 14, "title": "MWEB Propagation: The Shadow Expansion", "id": "eb895a357024f45b2dc08c3945451320b2745c4e1056446095d072245e33586ei0", "image": "assets/art/014.svg"}, {"number": 15, "title": "The American Protocol: Litecoin As An Invention Of A Republic", "id": "f9a4d1d347253045c484756c4db78524f3b04d3db81cd4bb485ccec5c088dbcfi0", "image": "assets/art/015.svg"}];
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
  document.querySelector('#viewer-count').textContent = `${String(work.number).padStart(3, '0')} / ${artworks.length} WORKS`;
  const image = document.querySelector('#viewer-img');
  image.src = work.image;
  image.alt = `${work.title} — artwork by Arctavis`;
  document.querySelector('#viewer-id').textContent = work.id;
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
    showArtwork(Number(trigger.dataset.number) - 1);
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
