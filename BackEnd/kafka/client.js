/* eslint-disable global-require */
/* eslint-disable camelcase */
/* eslint-disable no-console */
const rpc = new (require('./kafkarpc'))();

// make request to kafka
function make_request(queue_name, msg_payload, callback) {
  console.log('in make request');
  //console.log('msg_payload',msg_payload);
  rpc.makeRequest(queue_name, msg_payload, (err, response) => {
    if (err) console.error('rpc client make request errored',err);
    else {
      console.log('rcp make request response success', response);
      callback(null, response);
    }
  });
}

exports.make_request = make_request;
