const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, default: '' },
  price: { type: String, required: true },
  year: { type: Number },
  fuel: { type: String, default: 'Essence' },
  transmission: { type: String, default: 'Automatique' },
  description: { type: String, default: '' },
  mainImage: { type: String, default: '' },
  images: [String],
  image2: { type: String, default: '' },
  image3: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  videoId: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
