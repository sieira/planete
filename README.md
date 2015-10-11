# Disclaimer
As for the present version (0.0.0), this repository is absolutely useless.

# Planete
Mudular Node.js CMS

# Install
 0. `sudo npm install -g bower`
 1. `npm install`
 2. `grunt build`

# Configure
*You can find extensive information about the configuration layer on the [configuration module readme](core/backend/modules/config/README.md).*

Pleanète's core has several configuration layers.

## Environment configuration
In order to deploy or test the system, you need to create a .env file on the project root. You can copy/rename what is in env.example

Check the [configuration module readme](core/backend/modules/config/README.md#env) for a detailed explanation.

## Core configuration
Please refer to the [core docs](core/backend/README.md) and the [configuration module readme](core/backend/modules/config/README.md).

# Testing
Just run `npm test`

Note: Since planète uses some ES6 functionalities that are not still fully supported by node, `grunt test` will fail for all the tests involving modules that use ES6 functionality needing to use some particular --harmony flag.
[This answer explains it on detail](http://stackoverflow.com/a/17751775/1430607)

# How to collaborate
Please refer to the [collaboration docs](docs/collaboration/README.md)

# Changelog

# Greetings
To all those who created or contributed to every npm module used by planète. Not all among them are here, but the ones that are here, are here.

 - [Ryan Lienhart Dahl](https://github.com/ry) And all those who contributed on node.js
 - [Strongloop](https://strongloop.com) For the [express module](http://expressjs.com/)
 - [The gruntjs team](https://github.com/orgs/gruntjs/people)
 - ["Cowboy" Ben Alman](http://benalman.com/) and [Kyle Robinson Young](https://github.com/shama) (among others) For their [grunt-contrib-symlink](https://github.com/gruntjs/grunt-contrib-symlink) module
 - [Peter Halliday](https://github.com/pghalliday) For his [grunt-mocha-test](https://github.com/pghalliday/grunt-mocha-test) module
 - [Manabu Shimobe](https://github.com/Manabu-GT) For his very handy [grunt-auto-install](https://github.com/Manabu-GT/grunt-auto-install) module
 - [Brandom Keepers](https://github.com/bkeepers) For his [dotenv](https://www.npmjs.com/package/dotenv) module
 - [TJ Holowaychuk](https://github.com/tj) For his ubiquity as well as for his jade module (As well as any person having contributed to any of his project)
 - [Mark Harter](https://strongloop.com/strongblog/author/marc/) Who inspired the modular structure of planete with [this article](https://strongloop.com/strongblog/modular-node-js-express/)
