'use strict';

const AWS = require('aws-sdk');
const pollKinesis = require('./pollKinesis');

module.exports = function runner(lambda, runOptions) {
  const options = runOptions || {};
  const kinesis = options.kinesis || new AWS.Kinesis({
    endpoint: process.env.KINESIS_ENDPOINT,
    region: 'ap-southeast-2',
    accessKeyId: 'FAKE',
    secretAccessKey: 'ALSO FAKE'
  });
  const streamName = options.streamName || process.env.STREAM_NAME;
  const log = options.console || console;

  const run = pollKinesis(kinesis, streamName, log);
  return run(lambda);
};