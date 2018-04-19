# fastify-couchdb

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

Fastify CouchDB connection plugin, with this you can share the same CouchDB connection in every part of your server.

Under the hood the popular [nano](https://github.com/apache/couchdb-nano) module is used, with the options that you pass to `register` passed to the nano instance.

## Install
```
npm i fastify-couchdb --save
```
## Usage
Add it to you project with `register` and you are done!
This plugin will add the `couch` namespace in your Fastify instance which you can treat exactly like an instance of nano.

Example:
```js
const fastify = require('fastify')

fastify.register(require('fastify-couchdb'), {
  url: 'http://localhost:5984'
})

// Using Callbacks
fastify.get('/rabbit', (req, reply) => {
  const rabbits = fastify.couch.db.use('rabbits')
  rabbits.get('whiterabbit', function(err, body) {
    reply.send(err || body)
  });

})

// Or Using Async/Await
fastify.get('/rabbit', async (req, reply) => {
  try {
    const rabbits = fastify.couch.db.use('rabbits');
    const body = rabbits.get('whiterabbit')
    reply.send(body);
  }
  catch(err) {
    reply.send(err);
  }

})
```

Async await is support as well if you prefer:
```js
const fastify = require('fastify')

fastify.register(require('fastify-couchdb'), {
  url: 'http://localhost:5984'
})

// Or Using Async/Await
fastify.get('/rabbit', async (req, reply) => {
  try {
    const rabbits = fastify.couch.db.use('rabbits');
    const body = rabbits.get('whiterabbit')
    reply.send(body);
  }
  catch(err) {
    reply.send(err);
  }

})
```

## Development and Testing

First, start postgres with:

```
$ npm run couchdb
```

Then in another terminal:

```
$ npm test
```

## License

Licensed under [Apache-2.0](./LICENSE).