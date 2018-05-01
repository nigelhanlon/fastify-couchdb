const fastify = require('fastify')()

const COUCHDB_URL = 'http://localhost:5984'

fastify.register(require('../index'), {url: COUCHDB_URL})

fastify.get('/', async (request, reply) => {
  const { err, body } = await fastify.couch.db.list()
  reply.send(err || { databases: body })
})

const start = async () => {
  try {
    await fastify.listen(3000)
    console.log('Listening on http://127.0.0.1:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
