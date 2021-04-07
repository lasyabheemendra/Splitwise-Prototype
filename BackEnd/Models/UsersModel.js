const mongoose = require('mongoose');

const { Schema } = mongoose;

const usersSchema = new Schema({
  useremail: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  phonenumber: { type: String, default: '' },
  currency: { type: String, default: '$' },
  timezone: { type: String, default: '-08:00' },
  language: { type: String, default: 'English' },
  image: { type: String, default: '' },
  invitedGroups: [{ type: String }],
  acceptedGroups: [{ type: String }],
},
{
  versionKey: false,
});

module.exports = mongoose.model('users', usersSchema);
