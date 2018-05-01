// Require the framework and instantiate it
const fastify = require('fastify')()

const COUCHDB_URL = 'http://localhost:5984'

fastify.register(require('../index'), {url: COUCHDB_URL})

// Declare a route
fastify.get('/', function (request, reply) {
  this.couch.db.list(function (err, body) {
    reply.send(err || { databases: body })
  })
})

// Run the server!
fastify.listen(3000, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log('Listening on http://127.0.0.1:3000')
})
