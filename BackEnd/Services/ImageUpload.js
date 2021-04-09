/* eslint-disable no-unused-vars */
/* eslint-disable no-multi-str */
const AWS = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

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

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
// create S3 instance
const s3 = new AWS.S3();

const fileFilter = (req, imagefile, cb) => {
  if (imagefile.mimetype === 'image/jpeg' || imagefile.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};
/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType(imagefile, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(imagefile.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(imagefile.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb('Error: Images Only!');
}

/**
 * Single Upload
 */
const profileImgUpload = multer({
  storage: multerS3({
    s3,
    bucket: S3_BUCKET,
    acl: 'public-read',
    key(req, imagefile, cb) {
      cb(null, `${path.basename(imagefile.originalname, path.extname(imagefile.originalname))}-${Date.now()}${path.extname(imagefile.originalname)}`);
    },
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter(req, imagefile, cb) {
    checkFileType(imagefile, cb);
  },
}).single('imagefile');

module.exports = profileImgUpload;
