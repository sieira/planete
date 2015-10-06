## TODO

 - [ ] Create a module prototype with a default behavior for init() and close()
 - [ ] Allow the DB module to register nested models (recursive)

 - [x] Allow the modules to log to the core logger as well as its own

   ✔ Done by adding a new() method to logger module on 05/10/2015
 - [x] Make grunt install all module dependencies recursively seeking the directory tree

   ✔ Done by improving [grunt-auto-install](https://github.com/Manabu-GT/grunt-auto-install) module on 30/09/2015
 - [x] Create basic module structure

   ✔ Done, check the [sample-module](backend/core/sample-module) 03/10/2015
 - [x] Create a shutdown mechanism that calls every module close() method.

   ✔ The main file captures SIGERM and SIGINT and requests the core to close

## Improviconrs
Improvements that are as feasible as riding unicorns

These are things that, although will be convenient, don't add so much value, requiring a big effort or major changes that make them not of utmost importance at all.

 - [ ] Override the npm install process, so local dependencies are ignored when already present in the project root
