const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  date: Date,
  dislikes: [],
  likes: [],
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  public_id: String,
  replying: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  },
  removed: {
    type: Boolean,
    default: false
  },
  text: String,
  user: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
});

module.exports = mongoose.model('Comment', CommentSchema);