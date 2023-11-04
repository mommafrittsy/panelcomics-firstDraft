const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    comic: {
      id: String,
      image: String,
      title: String
    },
    comment: String,
    date: Date,
    from: {
      id: String,
      image: String,
      username: String
    },
    important: {
      type: Boolean,
      default: false
    },
    page: {
      id: String,
      image: String,
      title: String
    },
    type: String,
    url: String
});

module.exports = mongoose.model('Notification', NoteSchema);