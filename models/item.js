const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  date: Date,
  id: String,
  image: String,
  name: String,
  price: Number,
  type: String
});

module.exports = mongoose.model('Item', ItemSchema);