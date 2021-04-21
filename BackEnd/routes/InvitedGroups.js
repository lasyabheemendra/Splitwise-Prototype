/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');
const Users = require('../Models/UsersModel');

router.post('/invitedgroups', checkAuth, (req, res) => {
  console.log('Inside invited post req', req.body);
  Groups.find({
    members: {
      $elemMatch: {
        accepted: 0,
        userID: mongoose.Types.ObjectId(req.body.userID),
      },
    },
  },
  { groupName: 1, _id: 0 },
  (error, user) => {
    if (error) {
      res.status(500).end('Error Occured');
    }
    if (user) {
      console.log(user);
      res.status(200).end(JSON.stringify(user));
    } else {
      res.status(400).end('No Pending Invitations');
    }
  });
});

router.post('/accept', checkAuth, (req, res) => {
  console.log('Inside acceptgroups post req', req.body);
  Groups.updateMany({
    groupName: { $in: req.body.groups },
  }, { $set: { 'members.$[elem].accepted': 1 }, $inc: { numberOfMembers: 1 } }, {
    arrayFilters: [{ 'elem.userID': mongoose.Types.ObjectId(req.body.userID) }],
  },
  (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).end('Error Occured');
    }
    if (result.nModified !== 0) {
      Groups.find({
        members: {
          $elemMatch: {
            accepted: 1,
            userID: mongoose.Types.ObjectId(req.body.userID),
          },
        },
      },
      { groupName: 1, _id: 0 },
      (err1, groupnames) => {
        if (err1) {
          console.log('getdata err1', err1);
          res.status(500).end('Error Occured');
        }
        console.log('groupnames', JSON.stringify(groupnames));
        if (groupnames) {
          console.log('groupnames groupnames groupnames', groupnames);
          const grouplist = groupnames.map((a) => a.groupName);
          console.log('groupnames result', grouplist);
          const results = { groups: grouplist };
          console.log('new API result', JSON.stringify(results));
          res.status(200).end(JSON.stringify(results));
        } else {
          console.log('groupnames result is emplty', groupnames);
          res.end();
        }
      });
    } else {
      res.status(400).end('No accepted groups modified');
    }
  });
});

module.exports = router;
