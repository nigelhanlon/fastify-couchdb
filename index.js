'use strict'

const fp = require('fastify-plugin')
const nano = require('nano')

function fastifyCouchDB (fastify, options, next) {
  if (fastify.hasDecorator('couch')) {
    next(new Error('fastify-couchdb has already registered'))
  } else {
    const couch = nano(options)
    fastify.decorate('couch', couch)

    if (couch.config.db) {
      console.log(couch.use)
      const defaultDB = couch.use(couch.config.db)
      fastify.decorateRequest('db', defaultDB, ['couch'])
    }
  }

  next()
}

module.exports = fp(fastifyCouchDB, {
  fastify: '>=1.1.0',
  name: 'fastify-couchdb'
})
