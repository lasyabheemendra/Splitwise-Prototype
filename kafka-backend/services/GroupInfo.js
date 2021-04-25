/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const Groups = require('../Models/GroupsModel');

async function handle_request(msg, callback) {
  console.log('Inside memberinfo post req', msg);
  Groups.findOne({ groupName: msg.groupName })
    .populate('members.userID', 'username')
    .populate({ path: 'expenses.paidBy', select: 'username -_id' })
    .populate({ path: 'expenses.notes.noteby', select: 'username -_id' })
    .exec((err2, groups) => {
      if (err2) {
        console.log(err2);
      }
      console.log('member info groups', groups);
      const expenseresults = { info: groups };
      console.log('member info expenseresults', expenseresults);
      console.log('memberinfo aggregate groups', JSON.stringify(expenseresults));
      callback(null, { status: 200, data: JSON.stringify(expenseresults) });
    });
}

exports.handle_request = handle_request;
