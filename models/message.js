const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  date: Date, 
  member_number: Number,
  text: String,
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

module.exports = mongoose.model('Message', MessageSchema);