# Core
This is planète's core, index.js will load and init every module within

For a main reference, please check the [main planète readme](../README.md)

## Module stucture
Each module has to register itself

### Dependencies
Each module is responsible of it's own dependencies.

When several modules share the same dependencies, those dependencies may be extracted to the main core dependencies

### Requires
Modules will be included in the main node_modules directory during install under the alias `_`.
Thus, when requiring any core module, the proper way to do it is :

```js
  var module = require('_/module');
```

### Init
Modules need to register an init() function taking no parameters, that should initialize and expose all it's functionality.


### Test
Every module has to have it's own test folder

### Docs
Modules shall be self-documented
  1. All modules should contain a reference to it's parent's docs
  2. Each module should contain reference to the related modules docs

## TODO
  - [ ] Create basic module structure
