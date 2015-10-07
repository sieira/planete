# Core backend
*For a general core reference, please check the [core readme](../README.md)*

This is planète's core backend, index.js will load and init every module within

## Module stucture
### Init
Modules need to register an init() function a callback as a parameter, that should initialize and expose all it's functionality.

Modules should expose an init() method when some initialization is needed. In that case, this initialization has to be performed on the [index.js](./index.js) init method.

Modules should expose as well a close() method, used when some work has to be performed on the application shutdown

Some modules may have a particular behavior before initialization. As an example, the logger module will output to console, and the config module will expose some defaults that are intended to be used on tests, so the core init process don't mess with the core initialization.

### Dependencies
Each module is responsible of it's own npm dependencies.

When several modules share the same dependencies, those dependencies may be extracted to the main core dependencies

### Requires a module
Modules are included in the main node_modules directory during install under the alias `_`.

There are two ways to require any core module :

```js
  var module = require('_').module;
```  

```js
  var module = require('_/module');
```

Core modules are singletons, but some allow to create separated instances. This means that you can, for instance, make any module use a custom logger, while still using the core's one.

```js
  var module = require('_/module').new();
```

This can be a little tricky, but think about the logger. When you get a new logger, you are writing to the console, whereas when getting the core's logger, you will log according to the current configuration. You should use the first option unless you know what you're doing.
