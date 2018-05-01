'use strict'

const fp = require('fastify-plugin')
const nano = require('nano')

function fastifyCouchDB (fastify, options, next) {
  const couch = nano(options)
  fastify.decorate('couch', couch)
  next()
}

module.exports = fp(fastifyCouchDB, {
  fastify: '>=1.1.0',
  name: 'fastify-couchdb'
})
