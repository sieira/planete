# Authorization
> **This document is incomplete, and needs to be inmproved**
*This module is part of planète's core backend, whose docs can be found [here](../../README.md)*

## Description
This module uses both the [user](../db/models/user.js) and the [role](../db/models/role.js) DB models to describe a role-based access control.

### Roles
There is a set of [default roles](../db/models/default-roles.json) that can be extended by the user:

  - Root: It's the main role, there should be a single root user, although this hasn't been ensured yet.
  - Admin: An administrator is supposed to be able to manage roles, users and content within a particular domain.
  - Author: Authors create and update their own content in a given domain, but they are not allowed to publish it.
  - Editor: Editors can read, update, publish/un-publish contents created by any author in his domain.

### Privileges
Privileges are expressed as model/permissions sets.

```json
{ "model": "role", "actions": "D$CRUDP" },
```

In this example, the users with this role are able to manipulate the role model within their domain, and perform Create, Read, Update, Delete and Publish operations.

```js
  /^[UD]\$(?!.*([CRUDP]).*\1)[CRUDP]*$/
```

Domain: Determines whether the permission set after the `$` applies to User's content, or content of another users in the same group (domain).

## Properties

## Methods

### Middleware

## API
