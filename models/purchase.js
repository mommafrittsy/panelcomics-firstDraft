const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0
  },
  comic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comic'
  },
  date: Date,
  pages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page'
  }],
  receipt: String,
  transaction_id: String,
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);