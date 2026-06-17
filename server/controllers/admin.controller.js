const User = require('../models/User');
const Car = require('../models/Car');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin.' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully.' });
  } catch {
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be user or admin.' });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.role = role;
    await user.save();
    res.json({ message: 'User role updated.', user: { email: user.email, name: user.name, role: user.role } });
  } catch {
    res.status(500).json({ message: 'Failed to update user role.' });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ id: req.params.id });
    if (!car) return res.status(404).json({ message: 'Car not found.' });
    res.json({ message: 'Car deleted successfully.' });
  } catch {
    res.status(500).json({ message: 'Failed to delete car.' });
  }
};
