/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const mongoose = require('mongoose');

const Groups = require('../Models/GroupsModel');
const Users = require('../Models/UsersModel');

let handle_request = async (msg, callback) => {
  console.log("Expenses, path= ", msg.path);
  switch (msg.path) {
    case "invitedgroups":
      handle_invitedgroups_request(msg, callback);
      break;
    case "acceptgroups":
      handle_acceptgroups_request(msg, callback);
      break;
    case "leavegroup":
      handle_leavegroup_request(msg, callback);
      break;
    default:
      callback(null, { status: 500, data: "no path found" });
  }
};

async function handle_invitedgroups_request(msg, callback) {
  console.log('Inside invited post req', msg.body);
  Groups.find({
    members: {
      $elemMatch: {
        accepted: 0,
        userID: mongoose.Types.ObjectId(msg.body.userID),
      },
    },
  },
  { groupName: 1, _id: 0 },
  (error, user) => {
    if (error) {
      callback(null, { status: 500, data: "Error Occured" });
    }
    if (user) {
      console.log(user);
      callback(null, { status: 200, data: JSON.stringify(user) });
    } else {
      callback(null, { status: 400, data: "No Pending Invitations" });
    }
  });
}

async function handle_acceptgroups_request(msg, callback) {
  console.log('Inside acceptgroups post req', msg.body);
  Groups.updateMany({
    groupName: { $in: msg.body.groups },
  }, { $set: { 'members.$[elem].accepted': 1 }, $inc: { numberOfMembers: 1 } }, {
    arrayFilters: [{ 'elem.userID': mongoose.Types.ObjectId(msg.body.userID) }],
  },
  (error, result) => {
    if (error) {
      console.log(error);
      callback(null, { status: 500, data: "Error Occured" });
    }
    if (result.nModified !== 0) {
      Groups.find({
        members: {
          $elemMatch: {
            accepted: 1,
            userID: mongoose.Types.ObjectId(msg.body.userID),
          },
        },
      },
      { groupName: 1, _id: 0 },
      (err1, groupnames) => {
        if (err1) {
          console.log('getdata err1', err1);
          callback(null, { status: 500, data: "Error Occured" });
        }
        console.log('groupnames', JSON.stringify(groupnames));
        if (groupnames) {
          console.log('groupnames groupnames groupnames', groupnames);
          const grouplist = groupnames.map((a) => a.groupName);
          console.log('groupnames result', grouplist);
          const results = { groups: grouplist };
          console.log('new API result', JSON.stringify(results));
          callback(null, { status: 200, data: JSON.stringify(results) });
        } else {
          console.log('groupnames result is emplty', groupnames);
          callback(null, { status: 200, data: "" });
        }
      });
    } else {
      callback(null, { status: 400, data: "No accepted groups modified" });
    }
  });
}

async function handle_leavegroup_request(msg, callback) {
  console.log('Inside leavegroup post req', msg.body);
  Groups.updateOne({ groupName: msg.body.groupName },
    {
      $pull: { members: { _id: mongoose.Types.ObjectId(msg.body.memberId) } },
      $inc: { numberOfMembers: -1 },
    },

    (err2, leave) => {
      if (err2) {
        console.log(err2);
        callback(null, { status: 500, data: "Error Occured while leaving group" });
      }
      console.log('post leave group', leave);
      if (leave.nModified !== 0) {
        Groups.find({
          members: {
            $elemMatch: {
              accepted: 1,
              userID: mongoose.Types.ObjectId(msg.body.userID),
            },
          },
        },
        { groupName: 1, _id: 0 },
        (err1, groupnames) => {
          if (err1) {
            console.log('getdata err1', err1);
            callback(null, { status: 500, data: "Error Occured while leaving group" });
          }
          if (groupnames) {
            const grouplist = groupnames.map((a) => a.groupName);
            const results = { groups: grouplist };
            callback(null, { status: 200, data: JSON.stringify(results) });
          } else {
            console.log('groupnames result is emplty', groupnames);
            callback(null, { status: 200, data: "" });
          }
        });
      }
    });
}

exports.handle_request = handle_request;
