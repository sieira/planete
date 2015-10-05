'use strict'

function currier() {
  var args = Array.prototype.slice.call(arguments);
  return function() {
    args.shift().apply(this, args);
  }
}
