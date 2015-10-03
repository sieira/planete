## TODO

 - [x] Make grunt install all module dependencies recursively seeking the directory tree

   ✔ Done by improving [grunt-auto-install](https://github.com/Manabu-GT/grunt-auto-install) module on 30/09/2015
 - [ ] Fix the server tests (it remains listening to requests after closing), it is related to [this github thread](https://github.com/nodejs/node/issues/2642)
 - [x] Create basic module structure

   ✔ Done, check the [sample-module](backend/core/sample-module) 03/10/2015
 - [ ] Create a shutdown mechanism that calls every module close() method.
 - [ ] Create a module prototype with a default behavior for init() and close()

## Improviconrs
Improvements that are as feasible as riding unicorns

These are things that, although will be convenient, don't add so much value, requiring a big effort or major changes that make them not of utmost importance at all.

 - [ ] Override the npm install process, so local dependencies are ignored when already present in the project root
