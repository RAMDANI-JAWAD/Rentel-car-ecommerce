const User = require('../models/User');

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    res.json(user ? user.favorites : []);
  } catch {
    res.json([]);
  }
};

exports.addFavorite = async (req, res) => {
  const { car } = req.body;
  if (!car) return res.status(400).json({ message: 'Car data required.' });
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (!user.favorites.find((f) => f.id === car.id)) {
      user.favorites.push(car);
    }
    await user.save();
    res.json({ message: 'Added to favorites.', favorites: user.favorites });
  } catch {
    res.status(500).json({ message: 'Failed to add favorite.' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.favorites = user.favorites.filter((f) => f.id !== req.params.carId);
    await user.save();
    res.json({ message: 'Removed from favorites.', favorites: user.favorites });
  } catch {
    res.status(500).json({ message: 'Failed to remove favorite.' });
  }
};
