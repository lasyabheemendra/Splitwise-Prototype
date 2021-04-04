const mongoose = require('mongoose');

const { Schema } = mongoose;

const memberSchema = new Schema({
  name: { type: String },
  email: { type: String },
  accepted: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  status: { type: String, default: 'NA' },

}, {
  versionKey: false,
});

const expenseSchema = new Schema({
  description: { type: String },
  amount: { type: Number, default: 0 },
  paidBy: { type: Number, default: 0 },
  notes: [{ noteby: String, noteText: String }],

}, {
  versionKey: false,
});

const groupsSchema = new Schema({
  groupName: { type: String, required: true, unique: true },
  numberOfMembers: { type: Number, default: 1 },
  members: { type: memberSchema },
  expenses: { type: expenseSchema },

},
{
  versionKey: false,
});

module.exports = mongoose.model('groups', groupsSchema);
