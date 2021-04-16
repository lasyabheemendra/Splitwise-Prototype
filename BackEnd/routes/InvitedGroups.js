/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');

router.post('/invitedgroups', checkAuth, (req, res) => {
  console.log('Inside invited post req', req.body);
  Groups.find({ members: { $elemMatch: { accepted: 0, email: req.body.email } } },
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

module.exports = router;
