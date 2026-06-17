const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  const { name, profilePicture } = req.body;
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (name !== undefined) user.name = name;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    await user.save();
    res.json({ message: 'Profile updated successfully.', name: user.name, profilePicture: user.profilePicture });
  } catch {
    res.status(500).json({ message: 'Update failed.' });
  }
};
