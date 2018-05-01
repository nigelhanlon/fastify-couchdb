'use strict'

const t = require('tap')
const test = t.test
const Fastify = require('fastify')
const fastifyCouchDB = require('./index')
const nano = require('nano')

const COUCHDB_URL = 'http://localhost:5984'
const TEST_DB = 'test'

const couch = nano(COUCHDB_URL)

t.beforeEach((done) => {
  couch.db.create(TEST_DB, (err) => {
    if (err && err.message !== 'The database could not be created, the file already exists.') {
      t.bailout('Cannot create test db: ' + err.message)
    }
    done()
  })
})

t.afterEach((done) => {
  couch.db.destroy(TEST_DB, (err) => {
    if (err && err.message !== 'Cannot delete test db: Database does not exist.') {
      t.bailout('Cannot delete test db: ' + err.message)
    }
    done()
  })
})

test('fastify.couch namespace should exist', t => {
  const fastify = Fastify()

  fastify.register(fastifyCouchDB, {
    url: COUCHDB_URL
  })

  fastify.ready((err) => {
    t.error(err)
    t.ok(fastify.couch)
    fastify.close()
    t.end()
  })
})

test('should be able to connect and perform a query', t => {
  const fastify = Fastify()

  fastify.register(fastifyCouchDB, {
    url: COUCHDB_URL
  })

  fastify.ready((err) => {
    t.error(err)

    const mydb = fastify.couch.db.use(TEST_DB)

    mydb.insert({ happy: true }, 'rabbit', (err, body) => {
      t.error(err)
      t.equal(body.id, 'rabbit')
      t.equal(body.ok, true)

      mydb.get('rabbit', (err, body) => {
        t.error(err)
        t.equal(body.happy, true)

        fastify.close()
        t.end()
      })
    })
  })
})

test('should accept a default db to connect to', t => {
  const fastify = Fastify()

  fastify.register(fastifyCouchDB, {
    url: `${COUCHDB_URL}/${TEST_DB}`
  })

  fastify.ready((err) => {
    t.error(err)
    fastify.couch.insert({ colour: 'white' }, 'rabbit', (err, body) => {
      t.error(err)
      t.equal(body.id, 'rabbit')
      t.equal(body.ok, true)

      fastify.close()
      t.end()
    })
  })
})
