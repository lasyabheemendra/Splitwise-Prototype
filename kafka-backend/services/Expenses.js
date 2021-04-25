/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const Groups = require('../Models/GroupsModel');
const Activities = require('../Models/RecentActivities');


let handle_request = async (msg, callback) => {
  console.log("Expenses, path= ", msg.path);
  switch (msg.path) {
    case "addexpense":
      handle_addexpense_request(msg, callback);
      break;
    case "addcomment":
      handle_addcomment_request(msg, callback);
      break;
    case "deletecomment":
      handle_deletecomment_request(msg, callback);
      break;
    default:
      callback(null, { status: 500, data: "no path found" });
  }
};

async function handle_addexpense_request(msg, callback) {
  console.log('Inside addexpense post req kafka', msg);
  const expenseData = [{
    name: msg.description,
    amount: Number(msg.amount),
    paidOn: new Date().toDateString(),
    paidBy: msg.paidby,
  }];
  console.log('expenseData', expenseData);
  Groups.updateOne({
    groupName: msg.groupname,
  }, { $push: { expenses: { $each: expenseData } } },
  (error, result) => {
    if (error) {
      console.log(error);
      callback(null, { status: 500, data: "Not Able to add expense" });
    }
    if (result.nModified !== 0) {
      const share = Number(msg.amount / msg.NOM);
      console.log('share', share);
      Groups.find({ groupName: msg.groupname },
        {
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
        },
        (err, group) => {
          if (err) {
            console.log(err);
          }
          // console.log('get members', JSON.stringify(group[0].members));
          for (let i = 0; i < group[0].members.length; i += 1) {
            console.log('group[0].members[i].userID', group[0].members[i].userID.toString());
            console.log('msg.paidby', msg.paidby);
            if (group[0].members[i].userID.toString() === msg.paidby) {
              console.log('paidbyemail', group[0].members[i].userID);
              console.log('paidbyemail balance', group[0].members[i].balance);
              Groups.updateOne({
                groupName: msg.groupname,
              }, { $set: { 'members.$[elem].balance': group[0].members[i].balance + (msg.amount - share) } }, {
                arrayFilters: [{ 'elem.userID': msg.paidby }],
              },
              (err1) => {
                if (err1) {
                  console.log(err1);
                  callback(null, { status: 500, data: "Error Occured while updating paid member balance" });
                }
              });
            } else if (group[0].members[i].userID !== msg.paidby) {
              Groups.updateOne({
                groupName: msg.groupname,
              }, { $set: { 'members.$[elem].balance': group[0].members[i].balance - share } }, {
                arrayFilters: [{ 'elem.userID': group[0].members[i].userID }],
              },
              (err2) => {
                if (err2) {
                  console.log(err2);
                  callback(null, { status: 500, data: "Error Occured while updating not paid member balance" });
                }
              });
            }
          }
          if (group[0].members.length > 0) {
            Groups.updateMany({
              groupName: msg.groupname,
            }, { $set: { 'members.$[elem].status': 'owes' } }, {
              arrayFilters: [{ 'elem.balance': { $lt: 0 } }],
            },
            (err3) => {
              if (err3) {
                console.log(err3);
                callback(null, { status: 500, data: "Error Occured while updating owes status" });
              }
              Groups.updateMany({
                groupName: msg.groupname,
              }, { $set: { 'members.$[elem].status': 'gets back' } }, {
                arrayFilters: [{ 'elem.balance': { $gt: 0 } }],
              },
              (err4) => {
                if (err4) {
                  console.log(err4);
                  callback(null, { status: 500, data: "Error Occured while updating gets back status" });
                }
                // here comes activity
                Activities.create({
                  activityOn: new Date().toDateString(),
                  activityBy: msg.paidby,
                  activityName: `Added "${msg.description}" Expense in`,
                  activityGroup: group[0]._id,
                }, (err5) => {
                  if (err5) {
                    console.log(err5);
                    callback(null, { status: 500, data: "Error Occured while updating gets back status" });
                  }
                  Groups.findOne({ groupName: msg.groupname })
                    .populate('members.userID', 'username')
                    .populate({ path: 'expenses.paidBy', select: 'username -_id' })
                    .populate({ path: 'expenses.notes.noteby', select: 'username -_id' })
                    .exec((err2, groups) => {
                      if (err2) {
                        console.log(err2);
                      }
                      const expenseresults = { info: groups };
                      callback(null, { status: 200, data: JSON.stringify(expenseresults) });
                    });
                });
              });
            });
          }
        });
    } else {
      callback(null, { status: 400, data: "No accepted groups modified" });
    }
  });
}

async function handle_addexpense_request(msg, callback) {
  console.log('inside comment',msg );
  Groups.updateOne({
    groupName: msg.group,
    'expenses._id': mongoose.Types.ObjectId(msg.expenseID),
  }, {
    $push:
  { 'expenses.$.notes': { noteby: msg.noteBy, noteText: msg.noteText } },
  },
  (err2, notes) => {
    if (err2) {
      console.log(err2);
      callback(null, { status: 500, data: "Error Occured while updating not paid member balance" });
    }
    console.log('post update comment', notes);
    if (notes.nModified !== 0) {
      Groups.findOne({ groupName: msg.group })
        .populate('members.userID', 'username')
        .populate({ path: 'expenses.paidBy', select: 'username -_id' })
        .populate({ path: 'expenses.notes.noteby', select: 'username -_id' })
        .exec((error, commentgroups) => {
          if (error) {
            console.log(error);
          }
          console.log('commentgroups info groups', commentgroups);
          const expenseresults = { info: commentgroups };
          callback(null, { status: 200, data: JSON.stringify(expenseresults) });
        });
    }
  });
}

async function handle_deletecomment_request(msg, callback) {
  console.log('inside delete comment', msg);
  Groups.updateOne({
    groupName: msg.group,
    'expenses._id': mongoose.Types.ObjectId(msg.expenseID),
  }, {
    $pull:
  { 'expenses.$.notes': { _id: mongoose.Types.ObjectId(msg.noteid) } },
  },
  (err2, notes) => {
    if (err2) {
      console.log(err2);
      callback(null, { status: 500, data: "Error Occured while deleting note comments" });
    }
    console.log('post delete comment', notes);
    if (notes.nModified !== 0) {
      Groups.findOne({ groupName: msg.group })
        .populate('members.userID', 'username')
        .populate({ path: 'expenses.paidBy', select: 'username -_id' })
        .populate({ path: 'expenses.notes.noteby', select: 'username -_id' })
        .exec((error, commentgroups) => {
          if (error) {
            console.log(error);
          }
          console.log('delete commentgroups info groups', commentgroups);
          const expenseresults = { info: commentgroups };
          console.log('delete commentgroups info expenseresults', expenseresults);
          console.log('delete commentgroups aggregate groups', JSON.stringify(expenseresults));
          callback(null, { status: 200, data: JSON.stringify(expenseresults) });
        });
    }
  });
}

exports.handle_request = handle_request;
