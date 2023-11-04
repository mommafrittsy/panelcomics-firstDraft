const mongoose = require('mongoose');

const ComicSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  banner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  banned: [],
  dates: {
    created: Date,
    updated: {
      date: Date,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  links: {
    facebook: String,
    instagram: String,
    patreon: String,
    tumblr: String,
    twitter: String,
    youtube: String
  },
  mature: {
    type: Boolean,
    default: false
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],
  monetization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Monetization'
  },
  pages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page'
  }],
  public_id: String,
  purchasers: [],
  purchases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comic'
  }],
  room_key: String,
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  },
  social: {
    facebook: String,
    instagram: String,
    patreon: String,
    tumblr: String,
    twitter: String,
    youtube: String
  },
  schedule: {
    style: {type: String, default:'as-available'},
    times: []
  },
  status: String,
  summary: String,
  tips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tip'
  }],
  title: String,
  views: {type: Number, default: 0},
  website: String
});

module.exports = mongoose.model('Comic', ComicSchema);