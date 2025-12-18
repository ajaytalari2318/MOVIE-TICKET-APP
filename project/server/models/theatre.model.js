const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, default: 'India' }, // adjust as needed
    pincode: { type: String }
  },
  totalScreens: {
    type: Number,
    required: true,
    min: 1 
  },
  facilities: {
    parking: { type: Boolean, default: false },
    foodCourt: { type: Boolean, default: false },
    wheelchairAccess: { type: Boolean, default: false }
  },
  contact: {
    phone: { type: String },
    email: { type: String }
  }
},
  { timestamps: true }
);

const theatre = mongoose.model('theatres', theatreSchema);
module.exports = theatre
