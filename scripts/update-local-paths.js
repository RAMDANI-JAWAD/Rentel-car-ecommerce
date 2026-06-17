const fs = require('fs');
const path = require('path');

const PRODUCTS_JSON = path.join(__dirname, '..', 'client', 'public', 'data', 'products.json');
const IMAGES_DIR = path.join(__dirname, '..', 'client', 'public', 'images');

const ID_TO_FOLDER = {
  'bmw-m4-competition': 'bmw',
  'mercedes-c63s-amg': 'merce',
  'jeep-wrangler-willys': 'jeep',
  'porsche-panamera': null,
  'volkswagen-golf-8-r': null,
  'range-rover-sport': 'range',
  'mercedes-benz-g-class': 'gclas',
  'jaguar-f-type-coupe': 'jaguar',
  'renault-clio-6-hybrid': 'clio',
  'dacia-sandero-stepway-extreme': 'dacia',
  'ferrari-sf90-stradale': 'ferrari',
  'toyota-corolla-2026': 'toyota',
  'lamborghini-huracan-2025': 'lamborghini',
  'mercedes-benz': 'mercedes',
  'tesla-model-s-plaid': 'tesla',
  'volkswagen-touareg-r': 'touareg',
  'mini-3-door-jcw': 'mini',
  'toyota-hilux-gr-sport': 'hilux',
  'peugeot-208-gt': 'peugeot',
  'audi-rs-6-avant': 'rs6',
  'rolls-royce-cullinan': 'rollsroyce',
};

function getImageFiles(folder) {
  const dir = path.join(IMAGES_DIR, folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => /\.(jpe?g|png|gif|webp|svg|avif)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'));
let changed = false;

for (const car of products) {
  const folder = ID_TO_FOLDER[car.id];
  if (!folder) {
    console.log(`Skipping "${car.id}" — no matching folder in /images/`);
    continue;
  }

  const files = getImageFiles(folder);
  if (files.length === 0) {
    console.log(`Skipping "${car.id}" — folder "${folder}" is empty`);
    continue;
  }

  const localImages = files.map(f => `/images/${folder}/${f}`);

  if (car.mainImage && !car.mainImage.startsWith('http')) {
    console.log(`  Keeping existing mainImage for "${car.id}"`);
  } else {
    car.mainImage = localImages[0] || car.mainImage;
    changed = true;
    console.log(`  Updated mainImage for "${car.id}" -> ${car.mainImage}`);
  }

  if (car.image2 && !car.image2.startsWith('http') && car.image2 !== '') {
    // keep existing
  } else if (localImages.length >= 2) {
    car.image2 = localImages[1];
    changed = true;
    console.log(`  Updated image2 for "${car.id}" -> ${car.image2}`);
  } else if (car.image2 === '' || car.image2?.startsWith('http')) {
    car.image2 = '';
    changed = true;
  }

  if (car.image3 && !car.image3.startsWith('http') && car.image3 !== '') {
    // keep existing
  } else if (localImages.length >= 3) {
    car.image3 = localImages[2];
    changed = true;
    console.log(`  Updated image3 for "${car.id}" -> ${car.image3}`);
  } else if (car.image3 === '' || car.image3?.startsWith('http')) {
    car.image3 = '';
    changed = true;
  }

  const hasExternalImages = car.images?.some(i => typeof i === 'string' && i.startsWith('http'));
  if (hasExternalImages || !car.images || car.images.length === 0) {
    car.images = [...localImages];
    changed = true;
    console.log(`  Updated images[] for "${car.id}"`);
  }
}

if (changed) {
  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2), 'utf-8');
  console.log('\nproducts.json updated successfully.');
} else {
  console.log('\nNo changes needed.');
}
