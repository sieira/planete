# Logger
*This module is part of planète's core backend, whose docs can be found [here](../README.md)*

## Defaults
The logger will by default print on the console, unless `NODE_ENV` is set to `test`

## Custom logger
This logger module allows to retrieve custom loggers

```js
  require('_/logger').new()
```
Returns a new instance of the logger that you can configure independently, allowing you to use separated loggers for each module

## Middleware
Logger provides a middleware that will log every request (according to the configuration options) on the format
`:request-type :url request from :origin-ip`
