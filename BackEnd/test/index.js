/* eslint-disable no-unused-vars */
const agent = require('supertest');
const md5 = require('md5');
const should = require('should');
const { get } = require('../index');

const server = agent('http://localhost:3000');

// UNIT test 1 begin

describe('POST Login Test', () => {
  it('Customer Incorrect Login credentials', (done) => {
    server
      .post('/user/login')
      .expect(200)
      .send({ useremail: 'kamala@sjsu.com', password: md5('lasya') })
      .end((err, res) => {
        res.status.should.equal(200);
        res.text.should.equal('Invalid Credentials');
        done();
      });
  });
});
