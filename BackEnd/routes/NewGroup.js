/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const express = require('express');
const kafka = require('../kafka/client');

const router = express.Router();
const { checkAuth } = require('../passport');

router.post('/createnew', checkAuth, (req, res) => {
  console.log('Inside user update Request');
  console.log('Req Body : ', req.body);
  console.log('Req Body : ', req.body.user);
  kafka.make_request('newgroup_topic', req.body, (err, results) => {
    if (err) {
      console.log(err);
      res.writeHead(err.status, {
        'Content-Type': 'text/plain',
      });
      res.end(err.data);
    } else {
      res.writeHead(results.status, {
        'Content-Type': 'text/plain',
      });
      res.end(results.data);
    }
  });
});

module.exports = router;
