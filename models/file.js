const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true
  },
  comic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comic'
  },
  container: String,
  contentType: String,
  created: Date,
  id: String,
  name: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page'
  },
  public: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number,
    default: 0
  },
  uploader: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  uploadType: String,
  url: String
});

module.exports = mongoose.model('File', FileSchema);