/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const Users = require('../Models/UsersModel');

async function handle_request(msg, callback) {
  console.log('Inside user update Request');
  Users.find({ useremail: { $ne: msg.email } }, { username: 1, useremail: 1, _id: 1 },
    (error, user) => {
      if (error) {
        console.log(error);
      }
      console.log('all user results', user);
      callback(null, { status: 200, data: JSON.stringify(user) });
    });
}

exports.handle_request = handle_request;
