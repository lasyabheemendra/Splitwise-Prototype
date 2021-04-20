/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');
const Users = require('../Models/UsersModel');

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
          const results = { info: group[0].members };
          console.log('get members', JSON.stringify(group[0].members));
          for (let i = 0; i < group[0].members.length; i += 1) {
            if (group[0].members[i].email === req.body.paidbyemail) {
              console.log('paidbyemail', group[0].members[i].email);
              console.log('paidbyemail balance', group[0].members[i].balance);
              Groups.updateOne({
                groupName: req.body.groupname,
              }, { $set: { 'members.$[elem].balance': group[0].members[i].balance + (req.body.amount - share) } }, {
                arrayFilters: [{ 'elem.email': req.body.paidbyemail }],
              },
              (err1, paidmember) => {
                if (err1) {
                  console.log(err1);
                  res.status(500).end('Error Occured while updating paid member balance');
                }
              });
            } else if (group[0].members[i].email !== req.body.paidbyemail) {
              console.log('NOT paidbyemail--', group[0].members[i].email);
              console.log('NOT paidbyemail balance', group[0].members[i].balance);
              console.log('balance expected', group[0].members[i].balance - share);
              Groups.updateOne({
                groupName: req.body.groupname,
              }, { $set: { 'members.$[elem].balance': group[0].members[i].balance - share } }, {
                arrayFilters: [{ 'elem.email': group[0].members[i].email }],
              },
              (err2, notpaidmember) => {
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
            (err3, paidmember) => {
              if (err3) {
                console.log(err3);
                res.status(500).end('Error Occured while updating owes status');
              }
              Groups.updateMany({
                groupName: req.body.groupname,
              }, { $set: { 'members.$[elem].status': 'gets back' } }, {
                arrayFilters: [{ 'elem.balance': { $gt: 0 } }],
              },
              (err4, notpaidmember) => {
                if (err4) {
                  console.log(err4);
                  res.status(500).end('Error Occured while updating gets back status');
                }

                Groups.find({ groupName: req.body.groupname },
                  {
                    groupName: 1,
                    numberOfMembers: 1,
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
                    expenses: 1,
                  },
                  (err2, groups) => {
                    if (err) {
                      console.log(err);
                    }
                    const upadtedresult = { info: groups[0] };
                    console.log('add expense result', JSON.stringify(upadtedresult));
                    res.status(200).end(JSON.stringify(upadtedresult));
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

module.exports = router;
