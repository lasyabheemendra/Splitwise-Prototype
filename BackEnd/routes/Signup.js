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
router.post('/signup', (req, res) => {
  Users.findOne({
    useremail: req.body.useremail,
  }, (error, result) => {
    if (error) {
      res.status(500).end('Error Occured');
    }
    if (result !== null) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('User already exists');
    } else {
      Users.create({
        useremail: req.body.useremail,
        username: req.body.username,
        password: md5(req.body.password),
      }, (err, data) => {
        if (err) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end();
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          const payload = {
            _id: data._id,
            username: data.username,
          };
          const token = jwt.sign(payload, secret, {
            expiresIn: 1008000,
          });
          const results = { info: data, token: `JWT ${token}` };
          res.status(200).end(JSON.stringify(results));
        }
      });
    }
  });
});

module.exports = router;
