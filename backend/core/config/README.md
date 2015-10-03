# Config
*This module is part of planète's core, whose docs can be found [here](../README.md)*

This module load, store, and allow access to every system-wide variable.
Config is a singleton that will expose the same contents to any instance.

It's part of planète's core, whose docs can be found [here](../README.md)

## env
> Storing [configuration in the environment](http://12factor.net/config) is one of the tenets of a [twelve-factor app](http://12factor.net/). Anything that is likely to change between deployment environments–such as resource handles for databases or credentials for external services–should be extracted from the code into environment variables.
[Brandon Keepers' Dotenv in Ruby](https://github.com/bkeepers/dotenv)

Planète uses therefore a .env file to store this kind of configuration. This may not be an exhaustive list, it only includes those envs for which a default fallback value is defined.

 - NODE_ENV: `String`
    values: `development` || `production`
    default: `'development'`
 - HOST: `String`
    values: Any string. A malformed IP or domain name will silently fail
    default: `'localhost'`
 - PORT: `Number`
    values: Any number.
    default: `8080`
