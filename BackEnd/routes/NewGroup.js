/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');

router.post('/createnew', checkAuth, (req, res) => {
  console.log('Inside user update Request');
  console.log('Req Body : ', req.body);
  console.log('Req Body : ', req.body.user);
  const memberdata = [{
    name: req.body.user[0].username,
    email: req.body.user[0].useremail,
    accepted: 1,
    balance: 0,
    status: 'NA',
  }];
  for (let i = 1; i < req.body.user.length; i += 1) {
    memberdata.push({
      name: req.body.user[i].username,
      email: req.body.user[i].useremail,
      accepted: 0,
      balance: 0,
      status: 'NA',
    });
  }
  Groups.findOne({
    groupName: req.body.groupname,
  }, (error, result) => {
    if (error) {
      res.status(500).end('Error Occured');
    }
    if (result !== null) {
      res.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      res.end('Please Enter unique Group Name');
    } else {
      Groups.create({
        groupName: req.body.groupname,
        numberOfMembers: 1,
        members: memberdata,
      }, (err, data) => {
        if (err) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end('Failed to Create Group');
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          res.status(200).end('Success');
        }
      });
    }
  });
});

module.exports = router;
