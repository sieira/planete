# Authentication
*This module is part of planète's core backend, whose docs can be found [here](../../README.md)*

## Description
This module uses both the [user](../db/models/user.js) DB model to implement a token-based authentication

## Properties
This module does not expose any property

## Methods
This module exposes the following methods:

  - Login: Tries to authenticate the user, if the login succeeds, creates a new session with a token, it registers every successful and failed login attempt with the corresponding IP on the database.
  - Logout: Deletes the user session, and only the user session referenced by the given token. Any other session from the same user remains active.

### Middleware

It's an express middleware that returns the http 401 code (Unauthorized) if the given user is not authenticated (it's actually a wrapper around [passport.authenticate](http://passportjs.org/docs/authenticate) using a simple BearerStrategy

## API
This module exposes an app, which will be used by the main one, and has the following endpoints:
  - `/login`: Gets some users credentials and try to perform the login, returns 201 and a session (user id and token) when succeeded, and 401 and an empty body when failed.
  - `/logout`: Gets some session data (userId and token) and deletes the corresponding session, returns 204 when succeeded and 401 otherwise
