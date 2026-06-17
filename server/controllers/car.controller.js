const Car = require('../models/Car');

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch {
    res.json([]);
  }
};

exports.createCar = async (req, res) => {
  const { name, price, mainImage, fuel, year, brand } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and price are required.' });
  }
  try {
    const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newCar = await Car.create({
      id, name, price, year: year || new Date().getFullYear(),
      fuel: fuel || 'Essence', transmission: 'Automatique',
      description: `${brand ? brand + ' ' : ''}${name} — Ajouté récemment.`,
      mainImage: mainImage || '/images/placeholder.jpg',
      images: [mainImage || '/images/placeholder.jpg'],
    });
    res.json({ message: 'Car added successfully.', car: newCar });
  } catch {
    res.status(500).json({ message: 'Failed to add car.' });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findOne({ id: req.params.id });
    if (!car) return res.status(404).json({ message: 'Car not found.' });
    Object.assign(car, req.body);
    await car.save();
    res.json({ message: 'Car updated successfully.', car });
  } catch {
    res.status(500).json({ message: 'Failed to update car.' });
  }
};
