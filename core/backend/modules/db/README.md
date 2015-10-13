# DB
*This module is part of planète's core backend, whose docs can be found [here](../../README.md)*

## Description
This module handles communication with the database

## Properties
This module will expose all the models contained in the model directory as properties, named according to the model file name.

Currently this properties are:

 - `db.session`
  Keep track of active sessions, registering
    - `user` A reference to the logged user
    - `token` The authorization token for the session
    - `createdAt` The session creation date
    - `expireAt` The timestamp of the instant when the session will expire. This is automatically handled by mongoDB
 - `db.user`
  Signed in users
    - `username` User name `required`
    - `firstname` User's real name
    - `lastname` User's real second name
    - `password` User's password hash
    - `timestamps`
      - `creation` Timestamp for the moment when the user registered
    - `login`
      - `failures` Array of timestams for all the unsuccessful login attepts
      - `sucess` Array of timestams for all the successful login attepts

## Methods
  - `connect` Establishes a connection with the database
  - `isConnected`
    return: `boolean`
    Checks if the database is connected
  - `close` Gracefully closes the database connection
  - `hasUsers`
    return: `boolean`
    Checks if there are registered users
  - `registerRootUser`
    Add a user ignoring authorization only if there are none in the database. This will be used during the installation process

## API
This module exposes an app, which will be used by the main one, and has the following endpoints:
  - `/status`: Returns the value of isConnected method
  - `/register-root-user` Gets a User object from the request body, and registers the root user.
    - response: 200 on success, 401 on error, 503 when the database is not connected
