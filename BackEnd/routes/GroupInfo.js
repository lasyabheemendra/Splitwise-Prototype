/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');

router.post('/memberinfo', checkAuth, (req, res) => {
  console.log('Inside memberinfo post req', req.body);
  Groups.findOne({ groupName: req.body.groupName })
    .populate('members.userID', 'username')
    .populate({ path: 'expenses.paidBy', select: 'username -_id' })
    .populate({ path: 'expenses.notes.noteby', select: 'username -_id' })
    .exec((err2, groups) => {
      if (err2) {
        console.log(err2);
      }
      console.log('member info groups', groups);
      const expenseresults = { info: groups };
      console.log('member info expenseresults', expenseresults);
      console.log('memberinfo aggregate groups', JSON.stringify(expenseresults));
      res.status(200).end(JSON.stringify(expenseresults));
      res.end();
    });
});

module.exports = router;
