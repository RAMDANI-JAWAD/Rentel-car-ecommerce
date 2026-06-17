const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  favorites: [{
    id: String,
    name: String,
    price: String,
    mainImage: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
