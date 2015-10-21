# Core front-end
*For a general core reference, please check the [core readme](../README.md)*

## Description
This is planète's core frontend, index.js will load and register routes for every module within.

This core is designed as a composite. **The core is a core-module himself**, which registers a sub-router per sub-module.

## Dependencies
Each module is responsible of it's own npm and bower dependencies.

When several modules share the same dependencies, those dependencies may be extracted to the main core dependencies

## Routing
The decision has been taken to make the front-end attach its own routings to the back-end.
This, in an effort to completely separate the front-end from the back-end.
Although this may seem a bit confusing, it allows to plug any other front-end to the back-end, without constraining the front-end developer to design a particular set of documents, while keeps all the purely back-end API functions encapsulated in the backend.

Every module (the main frontend module as well) creates its own router. There are two ways this router can be created:

  1. Auto
  This is the default. Every module is created with a 'routes' property. It contains a router that contains all the sub-module routers on it, and give access to his own `/` (which will request to render `./views/index.jade`) and any of the views contained on the `views` directory and subdirectories

  2. Manual
  In addition to the default behavior, the router can be created within the directory `routes` of each module.
  This allows to add additional behavior to the routing. For instance, it is possible to attach an authorization middleware to a module, so the views are not accessible to non-logged users, as done in the [admin's module router](./modules/admin/routes).

  It is as simple as this:

  ```js
  var Routes = (function () {
    var router = express.Router();

    router.use(auth.middleware);

    return router;
  })();

  module.exports = Routes;
  ```

  Just another little example, a module could redirect to another place given a particular condition. The main module does it, as it checks for the system to be configured avoiding to show the main page when it is not, redirecting to the setup page.

  Again, a child's play

  ```js
  var Routes = (function () {
    var router = express.Router();

    router.get('/', function (req, res, next) {
      core.isInstalled(function (err, itIs) {
        if(itIs) { next(); }
        else { res.redirect('/setup'); }
      });
    });

    return router;
  })();

  module.exports = Routes;
  ```

  This is nonetheless not needed in most cases


### Module stucture
*Please check the [sample module](../sample-module) for an overview, and [core-module](./core-module.js) for implementation details*
Every module registers automatically  a router, with its endpoint being its own name, this router uses the sub-sub-module routes the same way.

For instance, if a module is stocked on `#/modules/mod`, and there is a second module in `#/modules/mod/modules/submod`, the first one's templates (contained on it's views dir) will be accessible through `/mod/viewname`, and the second in `/mod/submod/viewname`

## Properties
Each module has the following properties:

  - dir: The path to the directory where the module logic is contained
  - routes: The router

## Methods
  - scriptsInjector: This is just temporary, and will evolve... If you really need to know what it is, open an issue and I'll take the time to explain it.
