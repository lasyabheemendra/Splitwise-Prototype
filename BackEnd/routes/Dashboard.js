/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const kafka = require('../kafka/client');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');
const Users = require('../Models/UsersModel');

router.post('/getdata', checkAuth, (req, res) => {
  console.log('getdata ', req.body);
  kafka.make_request('dashboard_topic', { path: 'getdata', body: req.body }, (err, results) => {
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

router.post('/userbalance', checkAuth, (req, res) => {
  console.log('userbalance', req.body);
  kafka.make_request('dashboard_topic', { path: 'userbalance', body: req.body }, (err, results) => {
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

router.post('/getrelatedusers', checkAuth, (req, res) => {
  kafka.make_request('dashboard_topic', { path: 'getrelatedusers', body: req.body }, (err, results) => {
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

router.post('/settleup', checkAuth, async (req, res) => {
  console.log('settleup ', req.body);
  kafka.make_request('dashboard_topic', { path: 'settleup', body: req.body }, (err, results) => {
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
