const mongoose = require('mongoose');

const TipSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0
  },
  comic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comic'
  },
  comment: String,
  date: Date,
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  page:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page'
  },
  transaction: String
});

module.exports = mongoose.model('Tip', TipSchema);