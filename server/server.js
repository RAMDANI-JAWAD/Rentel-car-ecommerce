const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const SECRET_KEY = 'mySecretKey';
const USERS_FILE = path.join(__dirname, 'users.json');
const PRODUCTS_FILE = path.join(__dirname, '..', 'client', 'public', 'data', 'products.json');

function readUsers() {
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    return users.map((u) => ({ ...u, favorites: u.favorites || [] }));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.use(cors());
app.use(express.json());

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
}

app.post('/api/register', (req, res) => {
  const { email, password, profilePicture, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  const users = readUsers();
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: 'Email already exists.' });
  }
  users.push({ email, password, name: name || '', profilePicture: profilePicture || '', favorites: [] });
  writeUsers(users);
  res.json({ message: 'User registered successfully.' });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    const token = jwt.sign(
      { email: user.email, profilePicture: user.profilePicture, name: user.name },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
    return res.json({
      message: 'Login successful.',
      token,
      email: user.email,
      name: user.name || '',
      profilePicture: user.profilePicture || '',
    });
  }
  res.status(401).json({ message: 'Invalid email or password.' });
});

app.put('/api/user/update', verifyToken, (req, res) => {
  const { name, profilePicture } = req.body;
  const users = readUsers();
  const user = users.find((u) => u.email === req.user.email);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  if (name !== undefined) user.name = name;
  if (profilePicture !== undefined) user.profilePicture = profilePicture;
  writeUsers(users);
  res.json({
    message: 'Profile updated successfully.',
    name: user.name,
    profilePicture: user.profilePicture,
  });
});

app.get('/api/favorites', verifyToken, (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.email === req.user.email);
  res.json(user ? user.favorites : []);
});

app.post('/api/favorites', verifyToken, (req, res) => {
  const { car } = req.body;
  if (!car) return res.status(400).json({ message: 'Car data required.' });
  const users = readUsers();
  const user = users.find((u) => u.email === req.user.email);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  if (!user.favorites.find((f) => f.id === car.id)) {
    user.favorites.push(car);
  }
  writeUsers(users);
  res.json({ message: 'Added to favorites.', favorites: user.favorites });
});

app.delete('/api/favorites/:carId', verifyToken, (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.email === req.user.email);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  user.favorites = user.favorites.filter((f) => f.id !== req.params.carId);
  writeUsers(users);
  res.json({ message: 'Removed from favorites.', favorites: user.favorites });
});

app.get('/api/cars', (req, res) => {
  try {
    const cars = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    res.json(cars);
  } catch {
    res.json([]);
  }
});

app.post('/api/cars', verifyToken, (req, res) => {
  const { name, price, mainImage, fuel, year, brand } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required.' });
  }
  try {
    const cars = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newCar = {
      id,
      name,
      price,
      year: year || new Date().getFullYear(),
      fuel: fuel || 'Essence',
      transmission: 'Automatique',
      description: `${brand ? brand + ' ' : ''}${name} — Ajouté récemment.`,
      mainImage: mainImage || '/images/placeholder.jpg',
      images: [mainImage || '/images/placeholder.jpg'],
    };
    cars.push(newCar);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(cars, null, 2));
    res.json({ message: 'Car added successfully.', car: newCar });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add car.' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
