'use strict'

var PLUGIN_NAME = 'gulp-filter-each'

var through = require('through2')
var PluginError = require('plugin-error')

module.exports = function (fn) {
  // Check if function passed as argument
  if (!fn) {
    throw new PluginError(
      PLUGIN_NAME,
      'A function must be supplied as an argument'
    )
  }

  // Check if argument is a function
  var type = typeof fn
  if (type !== 'function') {
    throw new PluginError(
      PLUGIN_NAME,
      'Argument must be a function but got: "' + type + '"'
    )
  }

  // Does function argument take a third argument (callback)
  var async = fn.length > 2

  return through.obj(function (file, enc, callback) {
    // Check if file contents are a buffer
    if (!file.isBuffer()) {
      return callback()
    }

    var self = this

    // Callback to use for async mode
    function done (result) {
      if (result) self.push(file) // Keep file
      callback()
    }

    // Convert file content to string
    var content = file.contents.toString('utf8')

    // Call supplied function and store result
    var result = fn(content, file.path, done)

    // If not async mode, perform filter logic based on supplied function result
    if (!async) {
      if (result) self.push(file) // Keep file
      callback()
    }
  })
}
