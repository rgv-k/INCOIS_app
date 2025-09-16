const mongoose = require('mongoose');

// Define the schema for the Report collection
const ReportSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  hazardType: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number], // Array of numbers for [longitude, latitude]
      required: true
    }
  },
  reportedAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Create and export the Report model
module.exports = mongoose.model('Report', ReportSchema);