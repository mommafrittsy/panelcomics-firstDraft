const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  accepted: {
    type: Boolean,
    default: false
  },
  comic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comic'
  },
  dates: {
    accepted: Date,
    added: Date,
    declined: Date
  },
  number: Number,
  role: [],
  upload: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Member', MemberSchema);