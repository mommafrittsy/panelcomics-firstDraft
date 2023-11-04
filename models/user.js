const mongoose = require('mongoose'),
      passMon = require('passport-local-mongoose');
      
const UserSchema = new mongoose.Schema({
  address:{
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: String,
    post: String
  },
  adverts:[{
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'Advert'
  }],
  available: {
    type: Boolean,
    default: false
  },
  bag: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }], 
  banner: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'File'
  },
  biography: String,
  birthdate: Date,
  comics: {
    admin: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comic'
    }],
    created: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comic'
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comic'
    }],
    purchased: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comic'
    }],
    recent:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comic'
    }]
  },
  contact: {
    marketing: {type:Boolean, default: false},
    notifications: {type:Boolean, default: false}
  },
  country: {
    code: String,
    name: String,
    currency: String
  },
  day: {type: Boolean, default: false},
  email: String,
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  genres: [],
  groups: [],
  login: {
    tFA: {type: Boolean, default: false},
    ips: [],
    mostRecent: Date,
    registered: Date,
    verified: {type:Boolean, default:false}
  },
  matureFilter: {type:Boolean, default:true},
  merch: [],
  mobile: String,
  name: {
    given: String,
    surname: String,
    preferred: String
  },
  notifications:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Notification'
  }],
  profile: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'File'
  },
  publicID: String,
  publishable: {
    type:Boolean,
    default:false
  },
  purchases: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase'
  }],
  stripe: {
    connect: String,
    customer: String
  },
  subscriptionLevel: {
    hadTrial: {type:Boolean, default:false},
    id: String,
    limits: {
      comics: {type: Number, default:0},
      data: {type: Number, default:0}
    },
    panelFee: Number,
    period: String,
    subType: String,
    usage: {
      comics: {type: Number, default:0},
      data: {type: Number, default:0}
    }
  },
  searchKey: String,
  social: {
    facebook: String,
    instagram: String,
    patreon: String,
    tumblr: String,
    twitter: String,
    youtube: String
  },
  tags: [],
  username: String,
  views: [{
    id:String,
    currentPage:String
  }]
});

UserSchema.plugin(passMon, {usernameLowerCase:true, usernameField:'email'});

module.exports = mongoose.model('User', UserSchema);