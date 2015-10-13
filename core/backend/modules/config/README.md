# Config
*This module is part of planète's core backend, whose docs can be found [here](../../README.md)*

## Description
This module load, store, and allow access to every system-wide variable.

> Storing [configuration in the environment](http://12factor.net/config) is one of the tenets of a [twelve-factor app](http://12factor.net/). Anything that is likely to change between deployment environments–such as resource handles for databases or credentials for external services–should be extracted from the code into environment variables.

> \-\-  [Brandon Keepers' Dotenv in Ruby](https://github.com/bkeepers/dotenv)

## Properties
Planète uses an .env file to store this kind of configuration. Config will have at least as many properties as entries are found in the .env file.
**This may not be an exhaustive list**, it only includes those envs for which a default fallback value is defined.
Please check [env.example](../../../../env.example) for a complete list of the required envs.

 - NODE_ENV: `String`
    values: `development` || `production`
    default: `'development'`
 - HOST: `String`
    values: Any string. A malformed IP or domain name will silently fail
    default: `'localhost'`
 - PORT: `Number`
    values: Any number.
    default: `8080`

## Methods
This module does not have any method

## API
This module does not expose any app
