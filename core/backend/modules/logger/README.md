# Logger
*This module is part of planète's core backend, whose docs can be found [here](../../README.md)*

## Description
This module will handle logging.
The logger will by default print on the console, unless `NODE_ENV` is set to `test`, no other logging method has been implemented yet

## Properties
This module does not expose any property

## Methods
***Output***

  - `log` same as console.log
  - `info` Prints a yellow [i] token, and then the rest of the parameters
  - `OK` Prints a green [✔] token, and then the rest of the parameters
  - `error` Prints a red [x] token, and then the rest of the parameters
  - `http` Prints a blue [ǁ] token, and then the rest of the parameters
  - `stack` Same as error

***Others***

  - `new` Allows to retrieve a custom logger that other modules will be able to configure by themselves
    returns: A new logger module

### Middleware
  - `middleware` Provides a middleware that will log every request (according to the configuration options) on the format
  `[ǁ] :client-ip - ":method :url" :response-status`


## API
This module does not expose any endpoint
