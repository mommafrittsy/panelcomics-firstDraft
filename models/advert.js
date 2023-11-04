const mongoose = require('mongoose');

const AdvertSchema = new mongoose.Schema({
  approval: {type:String, default:'pending'},
  comic: {type:mongoose.Schema.Types.ObjectId, ref:'Comic'},
  cost: Number,
  clicks: [
    {
      date:String,
      count: {type:Number, default:0}
    }
  ],
  dates: {
    end: Date,
    start: Date,
    submitted: Date
  },
  image: {type:mongoose.Schema.Types.ObjectId, ref:'File'},
  mature: {type:Boolean, default:true},
  name: String,
  reported: {type:Boolean, default:false},
  user: {type:mongoose.Schema.Types.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Advert', AdvertSchema);