title: Create a mongodb cluster using Docker with authentication enabled
date: 2018-12-10 21:51:49
tags: mongodb
categories:
- note
---

## Preparations
The following needs to be run only once

```bash
mkdir -p ~/docker-storage/{rc1,rc2,rc3,mongo-keys}
openssl rand -base64 741 > ~/docker-storage/mongo-keys/keyfile
chmod 600 ~/docker-storage/mongo-keys/keyfile
sudo chown 999 ~/docker-storage/mongo-keys/keyfile
docker network create mongo-cluster
```

## Reusable scripts

```bash
start_cluster() {
	for i in 1 2 3; do docker run --rm -p 3000$i:27017 --name rc$i --net mongo-cluster  -v ~/docker-storage/rc$i:/data/db -v ~/docker-storage/mongo-keys/keyfile:/opt/keyfile -d mongo mongod --keyFile /opt/keyfile --replSet test-set; done
}

enter() {
	docker exec -it $1 ${2:-bash}
}

runnode() {
    [ $# -lt 1 ] && echo "Usage: $FUNCNAME script" && return
    scriptname=$1
    shift
    others=$*
     docker run -it --rm --name my-node-script -v "$PWD":/usr/src/app -w /usr/src/app $others node:8 node $scriptname
}

```

Put the above functions into your `.bashrc` or `.zshrc` or just a plain script file, i.e. `util.sh` and source it:
```bash
source util.sh
```

## Bring up the cluster and enter rc1
```
start_cluster
enter rc1
# once inside rc1
mongo
```

Once in mongo shell,
```js
use admin
db.createUser(
  {
    user: "superuser",
    pwd: "supercool",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)
quit()
```

You will be back to the bash shell of `rc1`, type the following to get back to first replica with the newly created credential.
```bash
mongo -u superuser -p supercool --authenticationDatabase admin
```

When mongo shell appears again, issue the following
```js
config = {
  _id: 'test-set',
  members: [
    { _id: 0, host: 'rc1:27017' },
    { _id: 1, host: 'rc2:27017' },
    { _id: 2, host: 'rc3:27017' }
  ]
}
rs.initiate(config)
```

You should see

    { "ok" : 1 }
    test-set:SECONDARY> 

Run `rs.status()` a few times you should be able to see rc1 becomes the MASTER node.

Now it's time to create a regular user:
```js
use admin
db.createUser({ user: 'appUser', pwd: 'appPass', roles: [{db: 'app', role: 'readWrite'}] })
quit()
```

Log in to rc1 mongo shell again with `appUser`

```bash
mongo -u appUser -p appPass --authenticationDatabase admin
```

Once in mongo shell of rc1
```js
use app
db.list.insert([
    {title: 'one'},
    {title: 'two'}
])
```

## Verify replication
To verify replication is working, `enter rc2`, login to mongo shell with the `appUser` credentials above, and run
```js
use app
db.list.find()
```

The output would look something like the following:

    test-set:SECONDARY> db.list.find()
    { "_id" : ObjectId("5c0f2181080076162e179f22"), "title" : "one" }
    { "_id" : ObjectId("5c0f2181080076162e179f23"), "title" : "two" }


## Test with a real node.js project

If you are not satisfied, you can go on and create a simple node.js project to test the replica set:
```bash
docker pull node
mkdir -p ~/projects/test-mongodb
cd $_
npm i mongodb
vim cluster-auth-test.js
```

and enter (or just copy/paste) the following code
```js
const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://appUser:appPass@rc1:27017,rc2:27017,rc3:27017/test?replicaSet=test-set&authSource=admin'
const db = 'test'

const main = async () => {
  console.log('start')
  const client = await MongoClient.connect(url, { useNewUrlParser: true })
  const col = client.db(db).collection('list')
  const res = await col.find({}, { limit: 5 }).toArray()
  console.log(res)
  await client.close()
  console.log('end')
}
main()
```

Save it, and run it with
```bash
runnode cluster-auth-test.js "--net=mongo-cluster"
```

Result:

    start
    [ { _id: 5c0f2181080076162e179f22, title: 'one' },
    { _id: 5c0f2181080076162e179f23, title: 'two' } ]
    end

Note: Since I am running node version 8 in my system, I put `node:8` in the `runnode` script, you might need to adjust that to a different version if version 8 is not installed on your system.