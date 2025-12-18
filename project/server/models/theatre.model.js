// server/models/theatre.model.js - Enhanced Version
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
    country: { type: String, default: 'India' },
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
    wheelchairAccess: { type: Boolean, default: false },
    threeDScreen: { type: Boolean, default: false },
    reclinerSeats: { type: Boolean, default: false }
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  approvedAt: {
    type: Date
  }
},
  { timestamps: true }
);

const theatre = mongoose.model('theatres', theatreSchema);
module.exports = theatre;