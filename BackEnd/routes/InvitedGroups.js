/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const kafka = require('../kafka/client');

const router = express.Router();
const { checkAuth } = require('../passport');
const Groups = require('../Models/GroupsModel');
const Users = require('../Models/UsersModel');

router.post('/invitedgroups', checkAuth, (req, res) => {
  console.log('Inside invited post req', req.body);
  kafka.make_request('managegroup_topic', { path: 'invitedgroups', body: req.body }, (err, results) => {
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

router.post('/accept', checkAuth, (req, res) => {
  console.log('Inside acceptgroups post req', req.body);
  kafka.make_request('managegroup_topic', { path: 'acceptgroups', body: req.body }, (err, results) => {
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

router.post('/leavegroup', checkAuth, (req, res) => {
  console.log('Inside leavegroup post req', req.body);
  kafka.make_request('managegroup_topic', { path: 'leavegroup', body: req.body }, (err, results) => {
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
