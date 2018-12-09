title: mongodb authentication by example
date: 2018-12-09 13:09:22
tags: mongodb
categories:
- note
---

## Procedures
### Follow instruction in reference #1 to create an administrator user

```
use admin
db.createUser(
  {
    user: "superuser",
    pwd: "supercool",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)
```

### Create non-administrator users
Once the administrator is created, restart mongod with option `--auth` enabled, and connect to it using 
```
mongo -u superuser -p supercool --authenticationDatabase admin
```

Let's say we are going to have a new database named `app` and we need to create a user to access that. We can either issue `use admin` or `use app` before the `db.createUser` command. Here comes the first note about mongodb authentication: by issuing `use admin`, it doesn't mean the user (details) will be created in database admin, instead, all users information will be stored in `system.users` collection. The command `use admin` or `use app` only serves as an identification purpose for non-administrator user creation, nothing else. Because of this reason and it might be a bit easier for user management, I would suggest that `admin` be used for all users. Therefore, run the following commands:
```
use app
db.list.insertOne({
    title: 'learn mongodb authentication'
})

use admin
db.createUser(
  {
    user: "appUser",
    pwd: "appPass",
    roles: [ { role: "readWrite", db: "app" } ]
  }
)

```

To test if the user is created successfully, exit mongo shell and issue a new one
```
mongo -u appUser -p appPass --authenticationDatabase admin app
show collections
```
The last command should show the collection `list` created by `superuser` in previous mongo shell session. To ensure user appUser does have the read/write privilege in db `app`,
```
db.find()
db.list.insertOne({
    something: 'else'
})
db.list.find()
```
Note: Since user `appUser` is configured to allow access to only db `app`, if you issue `show databases` command, only `app` would return, and that's also the reason `app` needs to be specified in the `mongo` command.


## References:
1. [MongoDB Manual](https://docs.mongodb.com/manual/tutorial/enable-authentication/) on authentication.

2. [SO entry](https://stackoverflow.com/questions/49445201/mongodb-should-i-put-users-in-admin-db-or-local-db) on which authentication database to use