/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');
const Users = require('../Models/UsersModel');

router.post('/getdata', checkAuth, (req, res) => {
  console.log('getdata ', req.body);
  Users.findOne({ _id: mongoose.Types.ObjectId(req.body.userID) },
    (error, user) => {
      if (error) {
        res.status(500).end('Error Occured');
      }
      console.log('user._id', user._id);
      if (user) {
        Groups.find({
          members: {
            $elemMatch: {
              accepted: 1,
              userID: mongoose.Types.ObjectId(user._id),
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
            const result = { info: user, groups: grouplist };
            console.log('new API result', JSON.stringify(result));
            res.status(200).end(JSON.stringify(result));
          } else {
            console.log('groupnames result is emplty', groupnames);
            res.end();
          }
        });
      } else {
        res.status(401).end('No user Data found');
      }
    });
});

router.post('/userbalance', checkAuth, (req, res) => {
  console.log('userbalance', req.body);
  Groups.find({ groupName: { $in: req.body.groups } },
    {
      _id: 0,
      groupName: 1,
      members: {
        $filter: {
          input: '$members',
          as: 'members',
          cond: {
            $and: [
              { $eq: ['$$members.accepted', 1] },
            ],
          },
        },
      },
    },
    (err, user) => {
      if (err) {
        console.log(err);
        res.end();
      }
      if (user.length !== 0) {
        const tempResult = [];
        for (let i = 0; i < user.length; i += 1) {
          for (let j = 0; j < user[i].members.length; j += 1) {
            const temp = {
              userName: user[i].members[j].name,
              useremail: user[i].members[j].email,
              balance: user[i].members[j].balance,
              status: user[i].members[j].status,
              group_name: user[i].groupName,
            };

            tempResult.push(temp);
          }
        }
        res.status(200).end(JSON.stringify(tempResult));
      } else {
        res.status(200).end('No active groups found for this user');
      }
    });
});

router.post('/getrelatedusers', checkAuth, (req, res) => {
  Groups.find({ groupName: { $in: req.body.groups } },
    {
      _id: 0,
      members: {
        $filter: {
          input: '$members',
          as: 'members',
          cond: {
            $and: [
              { $eq: ['$$members.accepted', 1] }, { $ne: ['$$members.balance', 0] },
              { $ne: ['$$members.email', req.body.useremail] },
            ],
          },
        },
      },
    },
    (err, user) => {
      if (err) {
        console.log(err);
        res.end();
      }
      if (user.length !== 0) {
        const tempResult = [];
        for (let i = 0; i < user.length; i += 1) {
          for (let j = 0; j < user[i].members.length; j += 1) {
            const temp = user[i].members[j].name;
            tempResult.push(temp);
          }
        }
        const unique = Array.from(new Set(tempResult));
        res.status(200).end(JSON.stringify(unique));
        // res.status(200).end(JSON.stringify(tempResult));
      } else {
        res.status(200).end('No active groups found for this user');
      }
    });
});

router.post('/settleup', checkAuth, (req, res) => {
  console.log('settleup ', req.body);
});

module.exports = router;
