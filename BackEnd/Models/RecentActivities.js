const mongoose = require('mongoose');

const Users = require('./UsersModel');
const Groups = require('./GroupsModel');

const { Schema } = mongoose;

const activitiesSchema = new Schema({
  activityOn: { type: String },
  activityBy: { type: Schema.Types.ObjectId, ref: Users },
  activityName: { type: String },
  activityGroup: { type: Schema.Types.ObjectId, ref: Groups },

},
{
  versionKey: false,
});

module.exports = mongoose.model('activities', activitiesSchema);
