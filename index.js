'use strict'

const fp = require('fastify-plugin')
const nano = require('nano')

async function fastifyCouchDB (fastify, options, next) {
  if (fastify.couch) {
    next(new Error('fastify-couchdb has already registered'))
  } else {
    fastify.couch = await nano(options)
  }

  next()
}

module.exports = fp(fastifyCouchDB, {
  fastify: '>=1.1.0',
  name: 'fastify-couchdb'
})
