# fastify-couchdb examples

This directory contains two examples of using the CouchDB plugin with Fastify.

To run them, make sure you `npm install` the root directory (eg ../) so the dependencies are available.

## callbacks.js

This file details a simple example of registering the `fastify-couchdb` plugin and calling it from a simple GET route. This route will list all known databases on the local CouchDB service. Here we use callbacks to pass error and body information along. The `this` keyword can be used to reference the plugin as `this.couch`.

## async.js 

This file shows the same example using `async/await` syntax rather than callbacks.

## Additional examples

If you would like to add additional examples, please open a PR and feel free to contribute. See [Contributing.md](../CONTRIBUTING.md) for details.