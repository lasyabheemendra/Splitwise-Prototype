/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const md5 = require('md5');

const router = express.Router();
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const Users = require('../Models/UsersModel');
const Groups = require('../Models/GroupsModel');
const { auth } = require('../passport');

auth();

// Route to handle Post Request Call
router.post('/login', (req, res) => {
  Users.findOne({ useremail: req.body.useremail, password: md5(req.body.password) },
    (error, user) => {
      if (error) {
        res.status(500).end('Error Occured');
      }
      if (user) {
        const payload = {
          _id: user._id,
          username: user.username,
        };
        const token = jwt.sign(payload, secret, {
          expiresIn: 1008000,
        });
        Groups.find({ members: { $elemMatch: { accepted: 1, userID: user._id } } },
          { groupName: 1, _id: 0 },
          (err1, groupnames) => {
            if (err1) {
              res.status(500).end('Error Occured');
            }
            if (groupnames) {
              const grouplist = groupnames.map((a) => a.groupName);
              console.log('groupnames result', grouplist);
              const result = { info: user, token: `JWT ${token}`, groups: grouplist };
              res.status(200).end(JSON.stringify(result));
            } else {
              console.log('groupnames result is emplty', groupnames);
              res.end();
            }
          });
      } else {
        res.status(401).end('Invalid Credentials');
      }
    });
});

module.exports = router;
