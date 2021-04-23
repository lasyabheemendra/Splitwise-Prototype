/* eslint-disable no-multi-str */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const AWS = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');

// use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// use express session to maintain session data
app.use(session({
  secret: 'cmpe273_kafka_passport_mongo',
  resave: false,
  saveUninitialized: false,
  duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration: 5 * 60 * 1000,
}));

app.use(bodyParser.json());

// Allow Access Control
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

const md5 = require('md5');
const mongoose = require('mongoose');
const { mongoDB } = require('./config');
const Users = require('./Models/UsersModel');
const Groups = require('./Models/GroupsModel');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
};

mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    process.exit(1);
    console.log('MongoDB Connection Failed');
  } else {
    console.log('MongoDB Connected');
  }
});
app.use(express.static('public'));
app.use(bodyParser.json());

const sessionUserName = '';
const sessionUserEmail = '';
const sessionCurrency = '';

const Signup = require('./routes/Signup');
const Login = require('./routes/Login');
const UserProfile = require('./routes/UserProfile');
const AllUsers = require('./routes/AllUsers');
const newGroup = require('./routes/NewGroup');
const invitedGroup = require('./routes/InvitedGroups');
const groupInfo = require('./routes/GroupInfo');
const expenses = require('./routes/Expenses');
const dashboard = require('./routes/Dashboard');
const activities = require('./routes/Activity');

app.use('/user', Signup);
app.use('/user', Login);
app.use('/user', UserProfile);
app.use('/getusers', AllUsers);
app.use('/group', newGroup);
app.use('/mygroups', invitedGroup);
app.use('/groups', groupInfo);
app.use('/expense', expenses);
app.use('/dashboard', dashboard);
app.use('/activities', activities);

// start your server on port 3001
app.listen(3001);
console.log('Server Listening on port 3001');
