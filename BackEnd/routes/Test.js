/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();

router.get('/testing', (req, res) => {
  console.log('Inside Test Post Request');
  console.log('Req Body : ', req.body);
  res.send('Inside Test Post Request');
});

module.exports = router;
