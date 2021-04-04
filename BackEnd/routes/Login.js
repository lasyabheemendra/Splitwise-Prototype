/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const md5 = require('md5');

const router = express.Router();
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const Users = require('../Models/UsersModel');
const { auth } = require('../passport');

auth();

// Route to handle Post Request Call
router.post('/login', (req, res) => {
  console.log('login details', req.body);
  Users.findOne({ useremail: req.body.useremail, password: md5(req.body.password) },
    (error, user) => {
      if (error) {
        res.status(500).end('Error Occured');
      }
      if (user) {
        console.log('login response', user);
        const payload = {
          _id: user._id,
          username: user.username,
          useremail: user.useremail,
          currency: user.currency,
        };
        const token = jwt.sign(payload, secret, {
          expiresIn: 1008000,
        });
        res.status(200).end(`JWT ${token}`);
      } else {
        res.status(401).end('Invalid Credentials');
      }
    });
});

module.exports = router;
