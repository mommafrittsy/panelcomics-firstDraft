const mongoose = require('mongoose')
      passMon = require('passport-local-mongoose');

const StaffSchema = new mongoose.Schema({
  birthdate: Date,
  department: String,
  email: String,
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  name: {
    given: String,
    preferred: String,
    surname: String
  },
  office: String,
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  user_account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  username: String
});

StaffSchema.plugin(passMon, {usernameLowerCase:true});

module.exports = mongoose.model('Staff', StaffSchema);