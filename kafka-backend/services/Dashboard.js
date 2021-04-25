/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const mongoose = require('mongoose');

const Groups = require('../Models/GroupsModel');
const Users = require('../Models/UsersModel');

let handle_request = async (msg, callback) => {
  console.log("Expenses, path= ", msg.path);
  switch (msg.path) {
    case "getdata":
      handle_getdata_request(msg, callback);
      break;
    case "userbalance":
      handle_userbalance_request(msg, callback);
      break;
    case "getrelatedusers":
      handle_getrelatedusers_request(msg, callback);
      break;
      case "settleup":
        handle_settleup_request(msg, callback);
        break;
    default:
      callback(null, { status: 500, data: "no path found" });
  }
};

async function handle_getdata_request(msg, callback) {
  console.log('getdata ', msg.body);
  Users.findOne({ _id: mongoose.Types.ObjectId(msg.body.userID) },
    (error, user) => {
      if (error) {
        callback(null, { status: 500, data: "Error Occured" });
      }
      console.log('user._id', user._id);
      if (user) {
        Groups.find({
          members: {
            $elemMatch: {
              accepted: 1,
              userID: mongoose.Types.ObjectId(user._id),
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
            const grouplist = groupnames.map((a) => a.groupName);
            const result = { info: user, groups: grouplist };
            callback(null, { status: 200, data: JSON.stringify(result) });
          } else {
            console.log('groupnames result is emplty', groupnames);
            callback(null, { status: 200, data: "" });
          }
        });
      } else {
        callback(null, { status: 401, data: "No user Data found" })
      }
    });
}

async function handle_userbalance_request(msg, callback) {
  console.log('userbalance', msg.body);
  Groups.find({ groupName: { $in: msg.body.groups } },
    {
      _id: 0,
      groupName: 1,
      members: {
        $filter: {
          input: '$members',
          as: 'members',
          cond: {
            $and: [
              { $eq: ['$$members.accepted', 1] },
            ],
          },
        },
      },
    }).populate('members.userID', 'username useremail')
    .exec((err, user) => {
      if (err) {
        console.log(err);
        callback(null, { status: 200, data: "" })
      }
      console.log('userbalance user', JSON.stringify(user));
      if (user.length !== 0) {
        const tempResult = [];
        for (let i = 0; i < user.length; i += 1) {
          for (let j = 0; j < user[i].members.length; j += 1) {
            const temp = {
              userID: user[i].members[j].userID._id,
              userName: user[i].members[j].userID.username,
              useremail: user[i].members[j].userID.useremail,
              balance: user[i].members[j].balance,
              status: user[i].members[j].status,
              group_name: user[i].groupName,
            };

            tempResult.push(temp);
          }
        }
        callback(null, { status: 200, data: JSON.stringify(tempResult) })
      } else {
        callback(null, { status: 200, data: "No active groups found for this user" })
      }
    });
}

async function handle_getrelatedusers_request(msg, callback) {
  Groups.find({ groupName: { $in: msg.body.groups } },
    {
      _id: 0,
      members: {
        $filter: {
          input: '$members',
          as: 'members',
          cond: {
            $and: [
              { $eq: ['$$members.accepted', 1] }, { $ne: ['$$members.balance', 0] },
            ],
          },
        },
      },
    }).populate('members.userID', 'username useremail')
    .exec(
      (err, user) => {
        if (err) {
          console.log(err);
          callback(null, { status: 200, data: "" })
        }
        console.log('get related user', JSON.stringify(user));
        if (user.length !== 0) {
          const tempResult = [];
          for (let i = 0; i < user.length; i += 1) {
            for (let j = 0; j < user[i].members.length; j += 1) {
              if (user[i].members[j].userID.useremail !== msg.body.useremail) {
                const temp = user[i].members[j].userID.username;
                tempResult.push(temp);
              }
            }
          }
          const unique = Array.from(new Set(tempResult));
          callback(null, { status: 200, data: JSON.stringify(unique) })
        } else {
          callback(null, { status: 200, data: "No active groups found for this user" })
        }
      },
    );
}

async function handle_settleup_request(msg, callback) {
  console.log('settleup ', msg.body);
  let x;
  let y;
  await Groups.find({ 'members.userID': msg.body.otherUser },
    {
      groupName: 1,
      _id: 0,
    },
    (error, groups) => {
      if (error) {
        console.log(error);
      }
      const grouplist = groups.map((a) => a.groupName);
      console.log('/settleup groups logged in', msg.body.groups);
      console.log('/settleup groups', grouplist);
      const intersection = msg.body.groups.filter((item) => grouplist.includes(item));
      console.log('/intersection groups', intersection);
      for (let i = 0; i < intersection.length; i += 1) {
        x = msg.body.userDetails.filter((item) => item.userID === msg.body.loggedUser
        && item.group_name === intersection[i])[0].balance;
        y = msg.body.userDetails.filter((item) => item.userID === msg.body.otherUser
        && item.group_name === intersection[i])[0].balance;
        console.log('X value', x);
        console.log('Y value', y);
        if (x > 0) {
          if (Math.abs(y) < x) {
            x += y;
            y = 0;
          } else if (Math.abs(y) >= x) {
            y += x;
            x = 0;
          }
        } else if (x < 0) {
          if (Math.abs(x) < y) {
            y += x;
            x = 0;
          } else if (Math.abs(x) >= y) {
            x += y;
            y = 0;
          }
        }
        console.log('POST calculation X value', x);
        console.log('POST calculation Y value', y);
        console.log('msg.body.groups[i]', intersection[i]);
        console.log('msg.body.loggedUser', msg.body.loggedUser);
        Groups.updateOne({
          groupName: intersection[i],
        }, { $set: { 'members.$[elem].balance': x.toFixed(2) } }, {
          arrayFilters: [{ 'elem.userID': msg.body.loggedUser }],
        },
        // eslint-disable-next-line no-loop-func
        (err1, loggeduser) => {
          if (err1) {
            console.log(err1);
            callback(null, { status: 200, data: "Failed to update logged user balance" });
          }
          if (loggeduser.nModified !== 0) {
            Groups.updateOne({
              groupName: intersection[i],
            }, { $set: { 'members.$[elem].balance': y.toFixed(2) } }, {
              arrayFilters: [{ 'elem.userID': msg.body.otherUser }],
            },
            (err9) => {
              if (err9) {
                console.log(err9);
                callback(null, { status: 200, data: "Failed to update other user balance" });
              }
              Groups.updateMany({
                groupName: intersection[i],
              }, { $set: { 'members.$[elem].status': 'NA' } }, {
                arrayFilters: [{ 'elem.balance': 0 }],
              },
              (err4, status) => {
                if (err4) {
                  console.log(err4);
                  callback(null, { status: 500, data: "Error Occured while updating  status" });
                }
                callback(null, { status: 200, data: "Settled balance between users" });
              });
            });
          }
        });
      }
    });
}

exports.handle_request = handle_request;
