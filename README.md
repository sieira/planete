# Disclaimer
As for the present version (0.0.0), this repository is absolutely useless.

# Planete
Mudular Node.js CMS

# Install
Installation process uses grunt, you'll need to install it prior to running following script
 1. `npm install`
 2. `grunt build`

# Configure
Pleanète's core has several configuration layers

## Environment configuration
Planète uses [dotenv](https://github.com/bkeepers/dotenv)

## Core configuration
Please refer to the [core docs](backend/core/README.md)


# Testing
Just run `grunt test` or `npm test`

# How to collaborate
Please refer to the [collaboration docs](docs/collaboration/README.md)

# Changelog

## TODO

 - [x] Make grunt install all module dependencies recursively seeking the directory tree
   - Made by improving [grunt-auto-install](https://github.com/Manabu-GT/grunt-auto-install) module on 30/09/2015
 - [ ] Override the npm install process, so local dependencies are ignored when already present in the project root

# Greetings
To all those who created or contributed to every npm module used by planète. Not all among them are here, but the ones that are here, are here.

 - [Ryan Lienhart Dahl](https://github.com/ry) And all those who contributed on node.js
 - [Strongloop](https://strongloop.com) For the [express module](http://expressjs.com/)
 - [The gruntjs team](https://github.com/orgs/gruntjs/people)
 - [Peter Halliday](https://github.com/pghalliday) For his [grunt-mocha-test module](https://github.com/pghalliday/grunt-mocha-test)
 - [Brandom Keepers](https://github.com/bkeepers) For his dotenv module
 - [Mark Harter](https://strongloop.com/strongblog/author/marc/) Who inspired the modular structure of planete with [this article](https://strongloop.com/strongblog/modular-node-js-express/)
 - [Manabu Shimobe](https://github.com/Manabu-GT) for his very handy [grunt-auto-install](https://github.com/Manabu-GT/grunt-auto-install) module
