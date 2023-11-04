const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  bonus_materials: {
    background: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'File'
    }],
    character: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'File'
    }],
    concept: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'File'
    }],
    drafts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'File'
    }],
    extras: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'File'
    }],
    reference: [{
      type: mongoose.Schema.Types.ObjectId,
      ref:'File'
    }]
  },
  comic: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Comic'
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  credits: {
    lead_artist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    }],
    artist:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    }],
    background_artist:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    }],
    character_artist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    }], 
    concept_artist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    }],
    editor: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    }],
    writer: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    }], 
    patrons: []
  },
  dates: {
    created: Date,
    published: Date,
    updated: {
      date: Date,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  },
  description: String,
  discussion: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  free: {
    type: Boolean,
    default: false
  },
  likes: [],
  mature: {
    type:Boolean,
    default:false
  },
  number: Number,
  page: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'File'
  },
  public_id: String,
  published: {type: Boolean, default: false},
  purchasers: [],
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  },
  removed: {
    type: Boolean,
    default: false
  },
  scripts: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'File'
  }],
  summary: String,
  title: String,
  views: {
    type:Number,
    default:0
  }
});

module.exports = mongoose.model('Page', PageSchema);