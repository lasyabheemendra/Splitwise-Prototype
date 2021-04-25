/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const Groups = require('../Models/GroupsModel');
const Activities = require('../Models/RecentActivities');

async function handle_request(msg, callback) {
  console.log('Inside ne group kafka request');
  console.log('Req Body : ', msg.body);
  console.log('Req Body : ', msg.body.user);
  const memberdata = [{
    userID: msg.body.user[0].userID,
    accepted: 1,
    balance: 0,
    status: 'NA',
  }];
  console.log('memberdata', memberdata);
  for (let i = 1; i < msg.body.user.length; i += 1) {
    memberdata.push({
      userID: msg.body.user[i].userID,
      accepted: 0,
      balance: 0,
      status: 'NA',
    });
  }
  Groups.findOne({
    groupName: msg.body.groupname,
  }, (error, result) => {
    if (error) {
      callback(null, { status: 500, data: "Error Occured" });
    }
    if (result !== null) {
      callback(null, { status: 400, data: "Please Enter unique Group Name" });
    } else {
      Groups.create({
        groupName: msg.body.groupname,
        numberOfMembers: 1,
        members: memberdata,
      }, (err, data) => {
        if (err) {
          callback(null, { status: 500, data: "Failed to Create Group" });
        } else {
          console.log('post creation', data);
          console.log('req.body.user[0].userID', msg.body.user[0].userID);
          Activities.create({
            activityOn: new Date().toDateString(),
            activityBy: msg.body.user[0].userID,
            activityName: 'Created Group',
            activityGroup: data._id,
          },
          (err2, activity) => {
            if (err2) {
              console.log(err2);
              callback(null, { status: 500, data: "Error Occured" });
            }
            if (activity) {
              Groups.find({
                members:
                 { $elemMatch: { accepted: 1, userID: msg.body.user[0].userID } },
              },
              { groupName: 1, _id: 0 },
              (err1, groupnames) => {
                if (err1) {
                  callback(null, { status: 500, data: "Error Occured" });
                }
                if (groupnames) {
                  const grouplist = [];
                  grouplist.push(groupnames.map((name) => name.groupName));
                  console.log('activity', activity);
                  const returngroups = { groups: grouplist[0] };
                  callback(null, { status: 200, data: JSON.stringify(returngroups) });
                } else {
                  callback(null, { status: 401, data: "New group information is not found" });
                }
              });
            } else {
              callback(null, { status: 401, data: "Recent Activity failed" });
            }
          });
        }
      });
    }
  });
}

exports.handle_request = handle_request;
