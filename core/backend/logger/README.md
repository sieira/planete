# Logger
This logger module allows to retrieve custom loggers

```js
  require('_/logger').new()
```
Returns a new instance of the logger

## Middleware
Logger provides a middleware that will log every request (according to the configuration options) on the format
`:request-type :url request from :origin-ip`
