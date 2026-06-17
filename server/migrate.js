require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Car = require('./models/Car');
const User = require('./models/User');

const PRODUCTS_FILE = path.join(__dirname, '..', 'client', 'public', 'data', 'products.json');
const USERS_FILE = path.join(__dirname, 'users.json');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Migrate cars
  if (fs.existsSync(PRODUCTS_FILE)) {
    const cars = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    for (const car of cars) {
      await Car.updateOne({ id: car.id }, { $set: car }, { upsert: true });
    }
    console.log(`Migrated ${cars.length} cars`);
  }

  // Migrate users
  if (fs.existsSync(USERS_FILE)) {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    for (const user of users) {
      await User.updateOne({ email: user.email }, { $set: user }, { upsert: true });
    }
    console.log(`Migrated ${users.length} users`);
  }

  await mongoose.disconnect();
  console.log('Migration complete');
}

migrate().catch(console.error);
