/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');
const Users = require('../Models/UsersModel');

router.post('/memberinfo', checkAuth, (req, res) => {
  console.log('Inside memberinfo post req', req.body);
  Groups.find({ groupName: req.body.groupName },
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
    (error, user) => {
      if (error) {
        console.log(error);
      }
      const result = { info: user[0] };
      console.log('memberinfo returned value', JSON.stringify(result));
      res.status(200).end(JSON.stringify(result));
    });
});

module.exports = router;
