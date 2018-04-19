'use strict'

const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const fastifyCouchDB = require('./index')

test('fastify.couchdb namespace should exist', t => {
  t.plan(2)

  const fastify = Fastify()

  fastify.register(fastifyCouchDB, {
    url: 'http://localhost:5984'
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
    url: 'http://localhost:5984'
  })

  fastify.ready(async err => {
    t.error(err)

    await fastify.couch.db.create('test')
    const mydb = fastify.couch.db.use('test')
    const { body } = await mydb.insert({ happy: true }, 'rabbit')
    t.deepEqual(JSON.parse(body), {'happy': true})

    fastify.close()
  })
})
