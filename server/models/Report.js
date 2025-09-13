const mongoose = require('mongoose');


const reportSchema = new mongoose.Schema({
  title:
   {
    type: String,
    required: true,
    trim: true
  },
  description:
   {
    type: String,
    required: true
  },
  location: 
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates:
     {
      type: [Number], 
      required: true
    }
  },
  hazardType: {
    type: String,
    required: true,
    enum: ['tsunami', 'storm_surge', 'high_waves', 'coastal_flooding', 'unusual_tides', 'other']
  },
  images: [String], //img path
  reportedBy: String, //ill link it to user later
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

reportSchema.index({ location: '2dsphere' });//geospatial index for loc

module.exports = mongoose.model('Report', reportSchema);