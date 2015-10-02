## TODO

 - [x] Make grunt install all module dependencies recursively seeking the directory tree

   ✔ Done by improving [grunt-auto-install](https://github.com/Manabu-GT/grunt-auto-install) module on 30/09/2015
 - [ ] Fix the server tests (it remains listening to requests after closing), it is related to [this github thread](https://github.com/nodejs/node/issues/2642)

## Improviconrs
Improvements that are as feasible as riding unicorns

These are things that, although will be convenient, don't add so much value, requiring a big effort or major changes that make them not of utmost importance at all.

 - [ ] Override the npm install process, so local dependencies are ignored when already present in the project root
