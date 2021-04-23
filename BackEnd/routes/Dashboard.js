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
    }).populate('members.userID', 'username useremail')
    .exec((err, user) => {
      if (err) {
        console.log(err);
        res.end();
      }
      console.log('userbalance user', JSON.stringify(user));
      if (user.length !== 0) {
        const tempResult = [];
        for (let i = 0; i < user.length; i += 1) {
          for (let j = 0; j < user[i].members.length; j += 1) {
            const temp = {
              userID: user[i].members[j].userID._id,
              userName: user[i].members[j].userID.username,
              useremail: user[i].members[j].userID.useremail,
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
            ],
          },
        },
      },
    }).populate('members.userID', 'username useremail')
    .exec(
      (err, user) => {
        if (err) {
          console.log(err);
          res.end();
        }
        console.log('get related user', JSON.stringify(user));
        if (user.length !== 0) {
          const tempResult = [];
          for (let i = 0; i < user.length; i += 1) {
            for (let j = 0; j < user[i].members.length; j += 1) {
              if (user[i].members[j].userID.useremail !== req.body.useremail) {
                const temp = user[i].members[j].userID.username;
                tempResult.push(temp);
              }
            }
          }
          const unique = Array.from(new Set(tempResult));
          res.status(200).end(JSON.stringify(unique));
        } else {
          res.status(200).end('No active groups found for this user');
        }
      },
    );
});

router.post('/settleup', checkAuth, async (req, res) => {
  console.log('settleup ', req.body);
  let x;
  let y;
  await Groups.find({ 'members.userID': req.body.otherUser },
    {
      groupName: 1,
      _id: 0,
    },
    (error, groups) => {
      if (error) {
        console.log(error);
        // res.status(401).end('User profile not updated');
      }
      const grouplist = groups.map((a) => a.groupName);
      console.log('/settleup groups', grouplist);
      for (let i = 0; i < grouplist.length; i += 1) {
        x = req.body.userDetails.filter((item) => item.userID === req.body.loggedUser
        && item.group_name === grouplist[i])[0].balance;
        y = req.body.userDetails.filter((item) => item.userID === req.body.otherUser
        && item.group_name === grouplist[i])[0].balance;
        console.log('X value', x);
        console.log('Y value', y);
        if (x > 0) {
          if (Math.abs(y) < x) {
            x += y;
            y = 0;
          } else if (Math.abs(y) >= x) {
            y += x;
            x = 0;
          }
        } else if (x < 0) {
          if (Math.abs(x) < y) {
            y += x;
            x = 0;
          } else if (Math.abs(x) >= y) {
            x += y;
            y = 0;
          }
        }
        console.log('POST calculation X value', x);
        console.log('POST calculation Y value', y);
        console.log('req.body.groups[i]', grouplist[i]);
        console.log('req.body.loggedUser', req.body.loggedUser);
        Groups.updateOne({
          groupName: grouplist[i],
        }, { $set: { 'members.$[elem].balance': x } }, {
          arrayFilters: [{ 'elem.userID': req.body.loggedUser }],
        },
        // eslint-disable-next-line no-loop-func
        (err1, loggeduser) => {
          if (err1) {
            console.log(err1);
            res.status(200).end('Failed to update logged user balance');
          }
          if (loggeduser.nModified !== 0) {
            Groups.updateOne({
              groupName: grouplist[i],
            }, { $set: { 'members.$[elem].balance': y } }, {
              arrayFilters: [{ 'elem.userID': req.body.otherUser }],
            },
            (err9) => {
              if (err9) {
                console.log(err9);
                res.status(200).end('Failed to update other user balance');
              }
            });
          }
        });
      }
    });

  console.log('post for loop reach');
  await Groups.updateMany({
    groupName: req.body.groupname,
  }, { $set: { 'members.$[elem].status': 'NA' } }, {
    arrayFilters: [{ 'elem.balance': 0 }],
  },
  (err4) => {
    if (err4) {
      console.log(err4);
      res.status(500).end('Error Occured while updating  status');
    }
    res.status(200).end('Settled balance between users');
  });
});

module.exports = router;
