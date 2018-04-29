'use strict'

const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const fastifyCouchDB = require('./index')

const COUCHDB_URL = 'http://localhost:5984'
const TEST_DB = 'test'

test('fastify.couchdb namespace should exist', t => {
  t.plan(2)

  const fastify = Fastify()

  fastify.register(fastifyCouchDB, {
    url: COUCHDB_URL
  })

  fastify.ready(err => {
    t.error(err)
    t.ok(fastify.couch)
    fastify.close()
  })
})

test('should be able to connect and perform a query', t => {
  t.plan(2)

  const fastify = Fastify()

  fastify.register(fastifyCouchDB, {
    url: COUCHDB_URL
  })

  fastify.ready(async err => {
    t.error(err)

    await fastify.couch.db.create(TEST_DB)
    const mydb = fastify.couch.db.use(TEST_DB)
    const { body } = await mydb.insert({ happy: true }, 'rabbit')
    t.deepEqual(JSON.parse(body), {'happy': true})

    fastify.close()
  })
})

test('should accept a default db to connect to', t => {
  t.plan(2)

  const fastify = Fastify()

  fastify.register(fastifyCouchDB, {
    url: `${COUCHDB_URL}/${TEST_DB}`
  })

  fastify.ready(async err => {
    t.error(err)
    const { body } = await fastify.couch.insert({ happy: true, colour: 'white' }, 'rabbit')
    t.deepEqual(JSON.parse(body), {happy: true, colour: 'white'})

    fastify.close()
  })
})
