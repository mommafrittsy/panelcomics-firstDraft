const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  action_taken: String,
  comic: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'Comic'
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  dates:  {
    action_taken: Date,
    reported: Date,
    reviewed: Date
  },
  page: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Page'
  },
  reason: String,
  reporter: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }
});

module.exports = new mongoose.model('Report', ReportSchema);