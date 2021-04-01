/* eslint-disable no-unused-vars */
const agent = require('supertest');
const should = require('should');
const { get } = require('../index');

// eslint-disable-next-line no-unused-vars

const server = agent('http://localhost:3000');

// UNIT test begin

describe('POST unit API calls', () => {
  // #1 should return home page

  it('get group balance of sent group name', (done) => {
    // calling home page api
    server
      .post('/groupbalance')
      .expect(200) // THis is HTTP response
      .send({ groupName: 'party' })
      .end((err, res) => {
        // HTTP status should be 200
        res.status.should.equal(200);
        done();
      });
  });
});
