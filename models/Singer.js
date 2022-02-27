const mongoose = require('mongoose');

const SingerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  music_name: {
    type: String,
    required: true,
  },
  music_id: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    default: 0
  },
  isActive: { // User
    type: Boolean,
    default: true
  },
  isSinging: { // User (automático)
    type: Boolean,
    default: false,
    unique: true
  },
  nextInQueue: { // Admin
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

// Model "singer" vai sair "singers" no banco, pois o mongoose sempre usa o plural.
module.exports = Singer = mongoose.model('singer', SingerSchema);

