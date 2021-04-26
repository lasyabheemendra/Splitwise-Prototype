/* eslint-disable import/order */
const chai = require('chai');
chai.use(require('chai-http'));

const app = require('../index');
const md5 = require('md5');
const { expect } = require('chai');
// const should = chai.should();

const agent = require('chai').request.agent(app);

// UNIT test begin

describe('splitwiselab2', () => {
  describe('Login Test', () => {
    it('invalid Login test', (done) => {
      agent
        .post('/user/login')
        .send({ email_id: 'kamala@sjsu.com', password: 'password' })
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.text).to.equal('Invalid Credentials');
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });

  describe('New user signup Test', () => {
    it('new user signup test', (done) => {
      agent
        .post('/user/signup')
        .send({
          useremail: 'kamala@sjsu.com',
          username: 'Test User',
          password: md5('password'),
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.text).to.equal('User already exists');
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });

  describe('Get Recentactivities Test', () => {
    it('Get Recentactivities test', (done) => {
      agent
        .get('/activities/getrecentactivities')
        .then((res) => {
          expect(res).to.have.status(401);
          expect((res.text).length).to.be.at.least(0);

          expect(JSON.parse(res.text).length).to.be.at.least(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });

  describe('Get all users Test', () => {
    it('Get all users test', (done) => {
      agent
        .post('/getusers/all')
        .send({
          email: 'kamala@sjsu.com',
        })
        .then((res) => {
          expect(res).to.have.status(401);
          expect((res.text).length).to.be.at.least(1);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });

  describe('Get group info Test', () => {
    it('Get group info test', (done) => {
      agent
        .post('/groups/memberinfo')
        .send({
          groupName: 'pgne bill',
        })
        .then((res) => {
          expect(res).to.have.status(401);
          expect((res.text).length).to.be.at.least(0);
          done();
        })
        .catch((error) => {
          done(error);
        });
    });
  });
});
