/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');
const Users = require('../Models/UsersModel');

router.post('/createnew', checkAuth, (req, res) => {
  console.log('Inside user update Request');
  console.log('Req Body : ', req.body);
  console.log('Req Body : ', req.body.user);
  const memberdata = [{
    userID: req.body.user[0].userID,
    accepted: 1,
    balance: 0,
    status: 'NA',
  }];
  console.log('memberdata', memberdata);
  for (let i = 1; i < req.body.user.length; i += 1) {
    memberdata.push({
      userID: req.body.user[i].userID,
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
          console.log('post creation', data);
          console.log('req.body.user[0].userID', req.body.user[0].userID);
          Groups.find({ members: { $elemMatch: { accepted: 1, userID: req.body.user[0].userID } } },
            { groupName: 1, _id: 0 },
            (err1, groupnames) => {
              if (err1) {
                res.status(500).end('Error Occured');
              }
              if (groupnames) {
                const grouplist = [];
                grouplist.push(groupnames.map((name) => name.groupName));
                const returngroups = { groups: grouplist[0] };
                res.status(200).end(JSON.stringify(returngroups));
              } else {
                res.status(401).end('Invalid Credentials');
              }
            });
        }
      });
    }
  });
});

module.exports = router;
