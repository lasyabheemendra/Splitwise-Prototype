/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const kafka = require('../kafka/client');

const Activities = require('../Models/RecentActivities');

async function handle_request(msg, callback) {
  console.log('Inside getrecentactivities Request');
  Activities.find()
    .populate({ path: 'activityBy', select: 'username -_id' })
    .populate({ path: 'activityGroup', select: 'groupName -_id' })
    .exec((err2, groups) => {
      if (err2) {
        console.log(err2);
      }
      console.log('Activities', groups);
      const expenseresults = { info: groups };
      console.log('Activities info expenseresults', expenseresults);
      console.log('Activities JSON groups', JSON.stringify(expenseresults));
      callback(null, { status: 200, data: JSON.stringify(expenseresults) });
    });
}

exports.handle_request = handle_request;
