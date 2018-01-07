# local-kinesis-lambda-runner

This is a modified version of the Rabble Rouser lamda package to remove the environment variable restriction and instead
accept parameters so you can run several local Kinesis functions. It is compatible with the main project, with extended options
to take advantage of the parameters.

> The Rabble Rouser project makes extensive use of kinesis streams, and also uses lambda functions to process events from
the stream. We want a way to spin up a whole Rabble Rouser instance locally, and this package is part of the solution to
that problem.

This is a script that will poll a kinesis stream forever, and invoke your lambda function whenever a new event is
detected.

Also if someone can come up with a better name, please do.

## Usage with Environment Variables (Original)

First install the package as a development dependency:
```sh
npm install --save-dev https://github.com/tarwn/local-kinesis-lambda-runner.git#package
```

### Sample "localDev.js"

To use the Environment Vairables (next section), you can do this

```js
const run = require('@rabblerouser/local-kinesis-lambda-runner');
const lambda = require('./index').handler;

run(lambda);
```

The parameters are optional, so you can specify them all:

```js
const run = require('@rabblerouser/local-kinesis-lambda-runner');
const lambda = require('./index').handler;

run(lambda);
```

or rely on the default kinesis object, but specify a streamName:

```js
const run = require('@rabblerouser/local-kinesis-lambda-runner');
const lambda = require('./index').handler;

run(lambda, { streamName: process.env.STREAM_NAME });
```

or run multiple handlers for various streams:

```js
const run = require('@rabblerouser/local-kinesis-lambda-runner');

const lambda1 = require('./index').handler;
const lambda2 = require('./index').handler;

run(lambda1, { streamName: process.env.STREAM_NAME });
run(lambda2, { streamName: process.env.STREAM_NAME_2 });
```

or define the kinesis object yourself to minimize memory footprint:

```js
const run = require('@rabblerouser/local-kinesis-lambda-runner');

const kinesis = new AWS.Kinesis({
  endpoint: process.env.KINESIS_ENDPOINT,
  region: 'ap-southeast-2',
  accessKeyId: 'FAKE',
  secretAccessKey: 'ALSO FAKE',
});

const lambda1 = require('./index').handler;
const lambda2 = require('./index').handler;

run(lambda1, { kinesis: kinesis, streamName: process.env.STREAM_NAME });
run(lambda2, { kinesis: kinesis, streamName: process.env.STREAM_NAME_2 });
```

### Running it

If you follow the setup above, you can start up your lambda locally with `npm start`, although it won't work properly
without a little configuration:

- `KINESIS_ENDPOINT`: The endpoint where kinesis is located
- `STREAM_NAME`: The name of the stream to poll

E.g:
```sh
KINESIS_ENDPOINT="http://kinesis:4567" STREAM_NAME="rabblerouser_stream" npm start
```

Note that this is only intended for local development with something like [kinesalite](https://github.com/mhart/kinesalite),
so the AWS region and credentials are internally hardcoded to arbitrary values. This script could be extended to support
running against a real kinesis stream, it would just be a matter of parameterising the extra config.

For a full example of this script in action, see the docker-compose config for [rabblerouser/core](https://github.com/rabblerouser/core).

## Publishing this library

Scoped packages (which this is) are private by default on npm, which is a paid feature. To publish publically, use this
command:

```sh
npm publish --access=public
```
