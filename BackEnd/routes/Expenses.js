/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');
const Activities = require('../Models/RecentActivities');

router.post('/addexpense', checkAuth, (req, res) => {
  console.log('Inside addexpense post req', req.body);
  const expenseData = [{
    name: req.body.description,
    amount: Number(req.body.amount),
    paidOn: new Date().toDateString(),
    paidBy: req.body.paidby,
  }];
  console.log('expenseData', expenseData);
  Groups.updateOne({
    groupName: req.body.groupname,
  }, { $push: { expenses: { $each: expenseData } } },
  (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).end('Not Able to add expense');
    }
    if (result.nModified !== 0) {
      const share = Number(req.body.amount / req.body.NOM);
      console.log('share', share);
      Groups.find({ groupName: req.body.groupname },
        {
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
        (err, group) => {
          if (err) {
            console.log(err);
          }
          // console.log('get members', JSON.stringify(group[0].members));
          for (let i = 0; i < group[0].members.length; i += 1) {
            console.log('group[0].members[i].userID', group[0].members[i].userID.toString());
            console.log('req.body.paidby', req.body.paidby);
            if (group[0].members[i].userID.toString() === req.body.paidby) {
              console.log('paidbyemail', group[0].members[i].userID);
              console.log('paidbyemail balance', group[0].members[i].balance);
              Groups.updateOne({
                groupName: req.body.groupname,
              }, { $set: { 'members.$[elem].balance': group[0].members[i].balance + (req.body.amount - share) } }, {
                arrayFilters: [{ 'elem.userID': req.body.paidby }],
              },
              (err1) => {
                if (err1) {
                  console.log(err1);
                  res.status(500).end('Error Occured while updating paid member balance');
                }
              });
            } else if (group[0].members[i].userID !== req.body.paidby) {
              Groups.updateOne({
                groupName: req.body.groupname,
              }, { $set: { 'members.$[elem].balance': group[0].members[i].balance - share } }, {
                arrayFilters: [{ 'elem.userID': group[0].members[i].userID }],
              },
              (err2) => {
                if (err2) {
                  console.log(err2);
                  res.status(500).end('Error Occured while updating not paid member balance');
                }
              });
            }
          }
          if (group[0].members.length > 0) {
            Groups.updateMany({
              groupName: req.body.groupname,
            }, { $set: { 'members.$[elem].status': 'owes' } }, {
              arrayFilters: [{ 'elem.balance': { $lt: 0 } }],
            },
            (err3) => {
              if (err3) {
                console.log(err3);
                res.status(500).end('Error Occured while updating owes status');
              }
              Groups.updateMany({
                groupName: req.body.groupname,
              }, { $set: { 'members.$[elem].status': 'gets back' } }, {
                arrayFilters: [{ 'elem.balance': { $gt: 0 } }],
              },
              (err4) => {
                if (err4) {
                  console.log(err4);
                  res.status(500).end('Error Occured while updating gets back status');
                }
                // here comes activity
                Activities.create({
                  activityOn: new Date().toDateString(),
                  activityBy: req.body.paidby,
                  activityName: `Added "${req.body.description}" Expense in`,
                  activityGroup: group[0]._id,
                }, (err5) => {
                  if (err5) {
                    console.log(err5);
                    res.status(500).end('Error Occured while updating gets back status');
                  }
                  Groups.findOne({ groupName: req.body.groupname })
                    .populate('members.userID', 'username')
                    .populate({ path: 'expenses.paidBy', select: 'username -_id' })
                    .populate({ path: 'expenses.notes.noteby', select: 'username -_id' })
                    .exec((err2, groups) => {
                      if (err2) {
                        console.log(err2);
                      }
                      const expenseresults = { info: groups };
                      res.status(200).end(JSON.stringify(expenseresults));
                      res.end();
                    });
                });
              });
            });
          }
        });
    } else {
      res.status(400).end('No accepted groups modified');
    }
  });
});

router.post('/comment', checkAuth, (req, res) => {
  console.log('inside comment', req.body);
  Groups.updateOne({
    groupName: req.body.group,
    'expenses._id': mongoose.Types.ObjectId(req.body.expenseID),
  }, {
    $push:
  { 'expenses.$.notes': { noteby: req.body.noteBy, noteText: req.body.noteText } },
  },
  (err2, notes) => {
    if (err2) {
      console.log(err2);
      res.status(500).end('Error Occured while updating not paid member balance');
    }
    console.log('post update comment', notes);
    if (notes.nModified !== 0) {
      Groups.findOne({ groupName: req.body.group })
        .populate('members.userID', 'username')
        .populate({ path: 'expenses.paidBy', select: 'username -_id' })
        .populate({ path: 'expenses.notes.noteby', select: 'username -_id' })
        .exec((error, commentgroups) => {
          if (error) {
            console.log(error);
          }
          console.log('commentgroups info groups', commentgroups);
          const expenseresults = { info: commentgroups };
          res.status(200).end(JSON.stringify(expenseresults));
          res.end();
        });
    }
  });
});

router.post('/deletecomment', checkAuth, (req, res) => {
  console.log('inside delete comment', req.body);
  Groups.updateOne({
    groupName: req.body.group,
    'expenses._id': mongoose.Types.ObjectId(req.body.expenseID),
  }, {
    $pull:
  { 'expenses.$.notes': { _id: mongoose.Types.ObjectId(req.body.noteid) } },
  },
  (err2, notes) => {
    if (err2) {
      console.log(err2);
      res.status(500).end('Error Occured while deleting note comments');
    }
    console.log('post delete comment', notes);
    if (notes.nModified !== 0) {
      Groups.findOne({ groupName: req.body.group })
        .populate('members.userID', 'username')
        .populate({ path: 'expenses.paidBy', select: 'username -_id' })
        .populate({ path: 'expenses.notes.noteby', select: 'username -_id' })
        .exec((error, commentgroups) => {
          if (error) {
            console.log(error);
          }
          console.log('delete commentgroups info groups', commentgroups);
          const expenseresults = { info: commentgroups };
          console.log('delete commentgroups info expenseresults', expenseresults);
          console.log('delete commentgroups aggregate groups', JSON.stringify(expenseresults));
          res.status(200).end(JSON.stringify(expenseresults));
          res.end();
        });
    }
  });
});
module.exports = router;
