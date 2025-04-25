const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  video: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Video', 
    required: true 
  },
  intervals: [{
    start: { type: Number, required: true },
    end: { type: Number, required: true }
  }],
  lastPosition: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);