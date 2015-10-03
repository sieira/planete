# Core
*For a bakend reference, please check the [backend readme](..//README.md)*

This is planète's core, index.js will load and init every module within

## Module stucture
Modules should expose an init() method when some initialization is needed. In that case, this initialization has to be performed on the [index.js](./index.js) init method.

Modules should expose as well a close() method, used when some work has to be performed on the application shutdown

Some modules may have a particular behavior before initialization. As an example, the logger module will output to console, and the config module will expose some defaults that are intended to be used on tests, so the core init process don't mess with the core initialization.

### Dependencies
Each module is responsible of it's own dependencies.

When several modules share the same dependencies, those dependencies may be extracted to the main core dependencies

### Requires a module
Modules are included in the main node_modules directory during install under the alias `_`.

Most modules are not singleton, this means that you can, for instance, make any module use a custom logger, while still using the core's one.

Thus, when requiring any core module, there are two ways to do it depending on your needs :

  1. Require the instance of the module that's registered on the core.

```js
  var module = require('_').module;
```  
  2. Require a new instance of the module

```js
  var module = require('_/module');
```

This can be a little tricky, but think about the logger. When you get a new logger, you are writing to the console, whereas when getting the core's logger, you will log according to the current configuration. You should use the firs option unless you know what you're doing.

### Init
Modules need to register an init() function taking no parameters, that should initialize and expose all it's functionality.


### Test
Every module has to have it's own test folder

### Docs
Modules shall be self-documented
  1. All modules should contain a reference to it's parent's docs
  2. Each module should contain reference to the related modules docs
