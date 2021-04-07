/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const Users = require('../Models/UsersModel');

router.post('/update', (req, res) => {
  console.log('Inside user update Request');
  console.log('Req Body : ', req.body);
  Users.updateOne({ _id: req.body._id }, {
    $set:
    {
      username: req.body.username,
      useremail: req.body.useremail,
      phonenumber: req.body.phonenumber,
      currency: req.body.currency,
      timezone: req.body.timezone,
      language: req.body.language,
    },
  },
  (error, user) => {
    if (error) {
      console.log(error);
      res.status(500).end('Error Occured');
    }
    if (user.nModified === 1) {
      res.status(200).end(JSON.stringify(req.body));
    } else {
      res.status(401).end('User profile not updated');
    }

    res.end();
  });
});

module.exports = router;
