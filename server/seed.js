require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const path = require('path');
const fs = require('fs');
const Car = require('./models/Car');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const productsPath = path.join(__dirname, '..', 'client', 'public', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    await Car.deleteMany({});
    console.log('Cleared existing cars');

    const cars = products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand || '',
      price: p.price,
      year: p.year,
      fuel: p.fuel || 'Essence',
      transmission: p.transmission || 'Automatique',
      description: p.description || '',
      mainImage: p.mainImage || '',
      images: p.images || [],
      image2: p.image2 || '',
      image3: p.image3 || '',
      videoUrl: p.videoUrl || '',
      videoId: p.videoId || '',
    }));

    await Car.insertMany(cars);
    console.log(`Seeded ${cars.length} cars successfully`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
