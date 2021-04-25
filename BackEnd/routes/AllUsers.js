/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');

const kafka = require('../kafka/client');

const router = express.Router();
const { checkAuth } = require('../passport');
const Users = require('../Models/UsersModel');

router.post('/all', checkAuth, (req, res) => {
  console.log('Inside user update Request');
  kafka.make_request('allusers_topic', req.body, (err, results) => {
    if (err) {
      console.log('make request backed folder errored', err);
      res.writeHead(err.status, {
        'Content-Type': 'text/plain',
      });
      res.end(err.data);
    } else {
      console.log('make request backend folder success');
      res.writeHead(results.status, {
        'Content-Type': 'text/plain',
      });
      res.end(results.data);
    }
  });
});

module.exports = router;
