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
router.post('/signup', (req, res) => {
  console.log('Inside signup Post Request');
  console.log('Req Body : ', req.body);
  Users.findOne({
    useremail: req.body.useremail,
  }, (error, result) => {
    console.log('find result', result);
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
          console.log('post creation', err);
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end();
        } else {
          console.log('post creation', data);
          res.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          const payload = {
            _id: data._id,
            username: data.username,
            useremail: data.useremail,
            currency: data.currency,
          };
          const token = jwt.sign(payload, secret, {
            expiresIn: 1008000,
          });
          res.status(200).end(`JWT ${token}`);
        }
      });
    }
  });
});

module.exports = router;
