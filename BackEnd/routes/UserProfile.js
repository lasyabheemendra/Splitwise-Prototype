/* eslint-disable no-multi-str */
/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const AWS = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const router = express.Router();
const Users = require('../Models/UsersModel');

const S3_BUCKET = 'lasyabucket';
const AWS_ACCESS_KEY_ID = 'AKIA5TPLVXU2UENP4LHK';
const AWS_SECRET_ACCESS_KEY = 'MIIEowIBAAKCAQEAojYkBXXzy0g5DHTEwqXxVGnnsMe6lRcza5GEEyS7iyR4DnGB \
k4Gb61AWmuBZ44BKSjbKhhsDHkZcZWOZr9SAYvoclagw7RDe9MXfjAmoq6smftuB \
AejDlfg0MkCIMjwPP1ykgGBGdNFbyfbbtogby0W75gtbszh3THagz1/pcEh0Qjpy \
XAs+AiMmgs6kYvVi1IyCYPxX0G2lTNhfAfUCnDLZ3iV5rPrDLhfp/ELNf/gTXlPh \
TOvyN8yqFN2/QIj4j64ZRAI1s5EIXBoCIXG+QbvgcR2wFpvCOrj/dSdHaNrGKuLn \
tMenVnc8jIobJEsHKqRfF9fk8oWLWVHCe5A4gQIDAQABAoIBAQCOwdEv0R/u3q/+ \
a2Gi4MIkBVR3uz9U6OdDGvy+kExRZ5YVOAXOmHltPb23Lg1N7+DxsYjJP0qeQVQd \
kut12DHpaa7wcuYkLP3bM63Ko9GCy4yEho/h60T+XkMpmquCcmME43aO2KwJMRt0 \
AkJZQS4c1lFIYuSgNOihLaHW/9UFEATeJIL5LnJ1G8zfto+3rAdXpuj0Nj53qzSH \
I4E5P3tinP+0B9OVjGI5RzmgL8XAZytQr5JAHMzn3GJWauwGxXf/c5woOhPvri6J \
aNbkLUBw+Nhn4RFcfFS2HuX3QNK/0dOuEihX9xlhkxI6ozOWMzFoV+BDGMWborYY \
Y0FxLI7xAoGBAOmixpnoqS1PSPyexcWk+eIEB1VXi6SX5fWPbABMegdrMfAzIzYA \
PIY15UOkfVqLGimTtXd5zXeUile6PpfN401L1CQ/g3GoXUNe+EIlcHqnlprcGQXk \
WlQ0ThBWU69ggFWZaHruDFLee+iDhX/TKoPEpMpiGZ92FCLzngTPFEm9AoGBALG9 \
HisdaobReg5/mRxkWi5VyQ9tUbUW/nyevWAoLoQkKUeVE2hYFmkCisJTalOiFsa5 \
M9zeK7SrF307G2vq7JWI0ZedP/t6NprPuofxlSpz2U4VRFNIiu9iKvvOFQNZOY6Y \
YqDSXPYTiUbzqHCl0JT1kK+7UV+2IiMe3KbDw5wVAoGAaJpGTNZMGEstJF15spnA \
fx7Kob0GenS/soe6FRAoenXV7/MVSrIkZvpuYTCeJxGsbv0A/DL+eRF6Nvjd2V2G \
7S6MFoaRNSvqRaWZhRP6HhA2b7MnSOoKPzUD1nCwGw8bpjd+/brirZ+K3nk0JhzH \
JiO+nBX73tchAN0N3J1SOgkCgYAywBZSJ0cYkc2xQBve8ISTgGk1n3haJeOqf8UB \
JNgLYSvsRZPSEnzrpQ8r55ePo9OvEIjPgxylrMi7OFpfGShOlk+KZBs12jKnR7My \
R/fYtFWTJx1oTmllavltBu4XE64MmlRnKUnj9bYX7VDmQWJqdifHFcxpcN8UeiZ0 \
86bx9QKBgGOoCesXjzWfzh+s4NLit0il4Ba0a+W4knlrG/4Dt4GiwKrDZnT//BQx \
2+tUtwLJxDBXUxwrwgCNdCxBaEzJyao7rCPJ6Av8vI+rg3ESalvO0Ig1m75NUboR \
1ehjh98UyL1f0mOAHmR6s7rCuYecgrGqtn4sP2xIwKXtTswMgIJ/';
const AWS_REGION = 'us-west-1';
const imapgepath = '';

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
// create S3 instance
const s3 = new AWS.S3();

router.post('/update', (req, res) => {
  console.log('Inside user update Request');
  console.log('Req Body : ', req.body);
  Users.updateOne({ _id: req.body._id }, {
    $set:
    {
      username: req.body.username,
      useremail: req.body.useremail,
      phonenumber: req.body.phonenumber,
      currency: req.body.currency,
      timezone: req.body.timezone,
      language: req.body.language,
    },
  },
  (error, user) => {
    if (error) {
      console.log(error);
      res.status(401).end('User profile not updated');
    }

    res.status(200).end(JSON.stringify(req.body));

    res.end();
  });
});

const fileFilter = (req, file, cb) => {
  console.log('Inside fileFilter');
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

router.post('/profileimageupload', upload.single('profileimage'), (req, res) => {
  console.log('formdata request', req);
  const { file } = req;
  const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

  const s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  // Where you want to store your file

  const params = {
    Bucket: S3_BUCKET,
    Key: req.body._id + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  s3bucket.upload(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: true, Message: err });
    } else {
      // If Success
      console.log('data', data);
      Users.updateOne({ _id: req.body._id }, {
        $set:
        {
          username: req.body.username,
          useremail: req.body.useremail,
          phonenumber: req.body.phonenumber,
          currency: req.body.currency,
          timezone: req.body.timezone,
          language: req.body.language,
          image: data.Location,
        },
      },
      (error, user) => {
        if (error) {
          console.log(error);
          res.status(401).end('User profile not updated');
        }
        const result = {
          _id: req.body._id,
          username: req.body.username,
          useremail: req.body.useremail,
          phonenumber: req.body.phonenumber,
          currency: req.body.currency,
          timezone: req.body.timezone,
          language: req.body.language,
          image: data.Location,
        };
        console.log(JSON.stringify(result));
        res.status(200).end(JSON.stringify(result));
      });
    }
  });
});
module.exports = router;
