# Core backend
*For a general core reference, please check the [core readme](../README.md)*

## Description
This is planète's core backend, index.js will load and init every module within

This core is designed as a composite. **The core is a core-module himself**, which defines automatically one property per sub-module.

### Dependencies
Each module is responsible of it's own npm dependencies.

When several modules share the same dependencies, those dependencies may be extracted to the main core dependencies

## Require module
During installation, the core backend is linked in the main node_modules directory under the alias `_`. You can then retrieve it using `core`

Please, note that there are consequently two ways to require any core module :

***Good***
```js
  var module = core.module;
```  
***Not so good***
```js
  var module = require('_/module');
```

The second option is not a good approach, since it ignores all the control process the core performs on modules to guarantee (or at least try to guarantee) an error-free execution.

Core modules are singletons, but some allow to create separated instances. This means that you can, for instance, make any module use a custom logger, while still using the core's one.

```js
  var module = require('_/module').new();
```

This `new` is just a naming convention, when developing your own modules you can name it whatever you want, but it's preferable to keep some consistence on naming.

### Module stucture
*Please check the [sample module](../sample-module) for an overview, and [core-module](./core-module.js) for implementation details*
Every module registers automatically his sub-modules as properties named the same as the subdirectory they are contained in (on the modules dir).
Every module registers automatically an app as his `app` property, taken from its `app.js` file.

When instantiating a new module, a reference to the directory containing the modules directory and the app has to be given to the constructor. Usually as:

```js
  var Module = (function() {
    var CoreModule = require('_/core-module');

    var mod = new CoreModule(__dirname);

    //...

    return mod;
  })();

  module.exports = Module;
```

## Properties
The core module exposes one property per sub-module, whose name is the directory where the sub-module is stocked. The same applies to every sub-module.

## Methods
  - `isInstalled` Checks on the database module if there is already a registered user, and returns true if that's the case. There will probably be more things to checks in the future
  - `init` Registers every sub-module app on his own, using a base endpoint with the name of the submodule. The database module API will then be located in /db, for instance. After this, it starts the core app, listening to requests on $HOST:$PORT
  - `close` Gracefully closes every module that need to perform som task when an exception happens, or a SIGKILL or a SIGTERM is received

## API
Check any module documentation for an overview of the available endpoints. The backend is suppossed to not expose any get method. In exchange, it allows the frontend to register its owns. This is a risky design decission, but allows different frontends to be attached to the backend without constraining them to use a particular set of documents. Please check the [fronted docs](../frontend/README.md) for further information
