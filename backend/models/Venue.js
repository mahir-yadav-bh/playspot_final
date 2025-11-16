const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
});

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sport: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  slots: [slotSchema],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  mapEmbedUrl: { 
    type: String, 
    trim: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Venue', venueSchema);