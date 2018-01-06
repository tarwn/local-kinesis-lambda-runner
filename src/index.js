const AWS = require('aws-sdk');
const pollKinesis = require('./pollKinesis');


module.exports = function (lambda, options) {
  options = options || {};
  const kinesis = options.kinesis || kinesis = new AWS.Kinesis({
    endpoint: process.env.KINESIS_ENDPOINT,
    region: 'ap-southeast-2',
    accessKeyId: 'FAKE',
    secretAccessKey: 'ALSO FAKE',
  });
  const streamName = options.streamName || process.env.STREAM_NAME;
  const console = options.console || console;
  
  var run = pollKinesis(kinesis, streamName, console)
  return run(lambda);
}
