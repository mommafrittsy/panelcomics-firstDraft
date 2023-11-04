const mongoose = require("mongoose");

const MonetizationSchema = new mongoose.Schema({
  approved: {
    type: Boolean,
    default: false
  },
  bulk: {
    discount: {type: Number, default: 0},
    items: {type: Number, default: 0}
  },
  comic: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Comic'
  },
  cost: Number,
  dates:{
    approved: Date,
    rejected: Date,
    requested: Date,
    reviewed: Date,
    updated: Date
  },
  free: Number,
  status: {
    type:String,
    default:'Pending'
  },
  staff: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Staff'
  },
  style: String
});

module.exports = mongoose.model('Monetization', MonetizationSchema);