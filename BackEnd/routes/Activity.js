/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');
const kafka = require('../kafka/client');

const router = express.Router();
const { checkAuth } = require('../passport');
const Activities = require('../Models/RecentActivities');

router.get('/getrecentactivities', checkAuth, (req, res) => {
  console.log('Inside getrecentactivities Request');
  Activities.find()
    .populate({ path: 'activityBy', select: 'username -_id' })
    .populate({ path: 'activityGroup', select: 'groupName -_id' })
    .exec((err2, groups) => {
      if (err2) {
        console.log(err2);
      }
      console.log('Activities', groups);
      const expenseresults = { info: groups };
      console.log('Activities info expenseresults', expenseresults);
      console.log('Activities JSON groups', JSON.stringify(expenseresults));
      res.status(200).end(JSON.stringify(expenseresults));
      res.end();
    });
});

module.exports = router;
