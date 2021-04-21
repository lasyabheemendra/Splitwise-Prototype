/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const { checkAuth } = require('../passport');
const Users = require('../Models/UsersModel');

router.post('/all', checkAuth, (req, res) => {
  console.log('Inside user update Request');
  Users.find({ useremail: { $ne: req.body.email } }, { username: 1, useremail: 1, _id: 1 },
    (error, user) => {
      if (error) {
        console.log(error);
        // res.status(401).end('User profile not updated');
      }
      console.log('all user results', user);
      res.status(200).end(JSON.stringify(user));

      res.end();
    });
});

module.exports = router;
