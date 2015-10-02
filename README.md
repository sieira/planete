# Disclaimer
As for the present version (0.0.0), this repository is absolutely useless.

# Planete
Mudular Node.js CMS

# Install
Installation process uses grunt, you'll need to install it prior to running following script
 0. `npm install`
 1. You need to download [this branch](https://github.com/sieira/grunt-auto-install) of `grunt-auto-install` and override the default until my PR is accepted (if it is)
 2. `grunt build`

# Configure
Pleanète's core has several configuration layers.

## Environment configuration
Planète uses [dotenv](https://github.com/bkeepers/dotenv)

In order to deploy or test the system, you need to create a .env file on the project root. You can copy/rename what is in env.example

 - NODE_ENV:
  - Values: [development|production]

## Core configuration
Please refer to the [core docs](backend/core/README.md)


# Testing
Just run `grunt test` or `npm test`

# How to collaborate
Please refer to the [collaboration docs](docs/collaboration/README.md)

# Changelog

# Greetings
To all those who created or contributed to every npm module used by planète. Not all among them are here, but the ones that are here, are here.

 - [Ryan Lienhart Dahl](https://github.com/ry) And all those who contributed on node.js
 - [Strongloop](https://strongloop.com) For the [express module](http://expressjs.com/)
 - [The gruntjs team](https://github.com/orgs/gruntjs/people)
 - [Peter Halliday](https://github.com/pghalliday) For his [grunt-mocha-test module](https://github.com/pghalliday/grunt-mocha-test)
 - [Manabu Shimobe](https://github.com/Manabu-GT) for his very handy [grunt-auto-install](https://github.com/Manabu-GT/grunt-auto-install) module
 - [Brandom Keepers](https://github.com/bkeepers) For his dotenv module
 - [Mark Harter](https://strongloop.com/strongblog/author/marc/) Who inspired the modular structure of planete with [this article](https://strongloop.com/strongblog/modular-node-js-express/)
