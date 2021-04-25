const mongoose = require('mongoose');

const Users = require('./UsersModel');

const { Schema } = mongoose;

const memberSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: Users },
  accepted: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  status: { type: String, default: 'NA' },

}, {
  versionKey: false,
});

const expenseSchema = new Schema({
  name: { type: String },
  paidBy: [{ type: Schema.Types.ObjectId, ref: Users }],
  paidOn: { type: String },
  amount: { type: Number, default: 0 },
  notes: [{ noteby: { type: Schema.Types.ObjectId, ref: Users }, noteText: { type: String } }],

}, {
  versionKey: false,
});

const groupsSchema = new Schema({
  groupName: { type: String, required: true, unique: true },
  numberOfMembers: { type: Number, default: 1 },
  members: [{ type: memberSchema }],
  expenses: [{ type: expenseSchema }],

},
{
  versionKey: false,
});

module.exports = mongoose.model('groups', groupsSchema);
