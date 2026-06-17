const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PRODUCTS_JSON = path.join(__dirname, '..', 'client', 'public', 'data', 'products.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'client', 'public', 'images', 'downloaded');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'));

const IMAGE_FIELDS = ['mainImage', 'image2', 'image3', 'images'];

function isExternalUrl(val) {
  return typeof val === 'string' && val.startsWith('http');
}

function isVideoUrl(val) {
  return /youtube\.com|youtu\.be/i.test(val);
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const handler = (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    };
    const client = url.startsWith('https') ? https : http;
    client.get(url, handler).on('error', (err) => {
      file.close();
      fs.unlinkSync(dest, () => {});
      reject(err);
    });
  });
}

function extFromUrl(url) {
  const cleaned = url.split('?')[0].split('#')[0];
  const ext = path.extname(cleaned);
  if (ext && ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif'].includes(ext.toLowerCase())) {
    return ext;
  }
  return '.jpg';
}

(async () => {
  let changed = false;

  for (const car of products) {
    for (const field of IMAGE_FIELDS) {
      const val = car[field];
      if (!val) continue;

      if (Array.isArray(val)) {
        const newArr = [];
        for (let i = 0; i < val.length; i++) {
          const item = val[i];
          if (isExternalUrl(item) && !isVideoUrl(item)) {
            const ext = extFromUrl(item);
            const filename = `${car.id}_${field}_${i}${ext}`;
            const dest = path.join(OUTPUT_DIR, filename);
            const localPath = `/images/downloaded/${filename}`;
            console.log(`Downloading ${item} -> ${localPath}`);
            try {
              await download(item, dest);
              newArr.push(localPath);
              changed = true;
            } catch (err) {
              console.error(`Failed to download ${item}: ${err.message}`);
              newArr.push(item);
            }
          } else {
            newArr.push(item);
          }
        }
        car[field] = newArr;
      } else {
        if (isExternalUrl(val) && !isVideoUrl(val)) {
          const ext = extFromUrl(val);
          const filename = `${car.id}_${field}${ext}`;
          const dest = path.join(OUTPUT_DIR, filename);
          const localPath = `/images/downloaded/${filename}`;
          console.log(`Downloading ${val} -> ${localPath}`);
          try {
            await download(val, dest);
            car[field] = localPath;
            changed = true;
          } catch (err) {
            console.error(`Failed to download ${val}: ${err.message}`);
          }
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2), 'utf-8');
    console.log('\nproducts.json updated with local paths.');
  } else {
    console.log('No external image URLs found.');
  }

  console.log('Done.');
})();
