'use strict'

const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const fastifyCouchDB = require('./index')
const nano = require('nano')

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

test('should expose a db key on the request object', async t => {
  t.plan(1)

  const couch = nano('http://localhost:5984')
  await couch.db.create('reqtest')
  const mydb = await couch.db.use('reqtest')
  await mydb.insert({ green: true }, 'trees')

  const fastify = Fastify()
  fastify.register(fastifyCouchDB, {
    url: 'http://localhost:5984/reqtest'
  })

  fastify.get('/', async function (req, reply) {
    // t.ok(req.db)
    const data = await req.db.get('trees')
    reply(data)
  })

  try {
    const { payload } = await fastify.inject({
      method: 'GET',
      url: '/',
      payload: {}
    })
    console.log(payload)
  } catch (err) {
    t.fail(err)
  }
})
