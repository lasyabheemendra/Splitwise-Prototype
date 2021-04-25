/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const kafka = require('../kafka/client');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');
const Activities = require('../Models/RecentActivities');

router.post('/addexpense', checkAuth, (req, res) => {
  console.log('Inside addexpense post req', req.body);
  kafka.make_request('addexpense_topic', { path: 'addexpense', body: req.body }, (err, results) => {
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

router.post('/comment', checkAuth, (req, res) => {
  console.log('inside comment', req.body);
  kafka.make_request('addexpense_topic', { path: 'addcomment', body: req.body }, (err, results) => {
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

router.post('/deletecomment', checkAuth, (req, res) => {
  console.log('inside delete comment', req.body);
  kafka.make_request('addexpense_topic', { path: 'deletecomment', body: req.body }, (err, results) => {
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
