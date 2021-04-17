/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');
const Users = require('../Models/UsersModel');

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

router.post('/accept', checkAuth, (req, res) => {
  console.log('Inside acceptgroups post req', req.body);
  Groups.updateMany({
    groupName: { $in: req.body.groups },
  }, { $set: { 'members.$[elem].accepted': 1 }, $inc: { numberOfMembers: 1 } }, {
    arrayFilters: [{ 'elem.email': req.body.useremail }],
  },
  (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).end('Error Occured');
    }
    if (result.nModified !== 0) {
      Users.updateOne({
        useremail: req.body.useremail,
      }, { $push: { acceptedGroups: { $each: req.body.groups } } }, (errors, results) => {
        if (errors) {
          res.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          res.end('Failed to Add Group to user list');
        } else {
          Users.findOne({ useremail: req.body.useremail },
            (err1, user) => {
              if (err1) {
                res.status(500).end('Error Occured while fetching user details');
              }
              console.log(JSON.stringify(user));
              res.writeHead(200, {
                'Content-Type': 'text/plain',
              });
              res.status(200).end(JSON.stringify(user));
            });
        }
      });
    } else {
      res.status(400).end('No accepted groups modified');
    }
  });
});

module.exports = router;
