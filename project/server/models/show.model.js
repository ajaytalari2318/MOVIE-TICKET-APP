const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  // Basic Show Information
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movies',
    required: true
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'theatres',
    required: true
  },
  
  // Show Details
  showDate: {
    type: Date,
    required: true
  },
  showTime: {
    type: String,
    required: true,
    // Format: "HH:MM" (24-hour format)
  },
  
  // Screen Information
  screenNumber: {
    type: Number,
    required: true,
    min: 1
  },
  screenName: {
    type: String,
    // e.g., "Screen 1", "IMAX", "Gold Class"
  },
  
  // Seating Information
  totalSeats: {
    type: Number,
    required: true,
    min: 1
  },
  availableSeats: {
    type: Number,
    required: true
  },
  bookedSeats: [{
    seatNumber: String,
    row: String,
    seatType: {
      type: String,
      enum: ['normal', 'premium', 'recliner']
    }
  }],
  
  // Pricing
  pricing: {
    normal: {
      type: Number,
      required: true,
      min: 0
    },
    premium: {
      type: Number,
      default: 0
    },
    recliner: {
      type: Number,
      default: 0
    }
  },
  
  // Show Features
  features: {
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX', '4DX', 'IMAX 3D'],
      default: '2D'
    },
    language: {
      type: String,
      required: true
    },
    subtitles: {
      type: Boolean,
      default: false
    },
    audioFormat: {
      type: String,
      enum: ['Dolby Atmos', 'DTS', 'Standard'],
      default: 'Standard'
    }
  },
  
  // Status Management
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed', 'housefull'],
    default: 'active'
  },
  
  // Special Offers
  offers: [{
    offerName: String,
    discountPercentage: Number,
    validFrom: Date,
    validTo: Date,
    minSeats: Number
  }],
  
  // Additional Information
  notes: {
    type: String,
    maxlength: 500
  },
  
})

const Show = mongoose.model('shows', showSchema);
module.exports = Show;