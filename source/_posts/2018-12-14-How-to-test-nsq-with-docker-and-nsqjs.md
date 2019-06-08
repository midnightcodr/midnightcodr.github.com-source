title: How to test nsq with docker (and nsqjs)
date: 2018-12-14 21:47:51
tags: nsq
categories:
- note
- howto
---

## Preparations
1. Find out docker host's IP and create the following shell function. Replace `172.17.0.1` with the one found on your system:

```bash
export DOCKER_HOST=172.17.0.1
runnsq() {
  host=$DOCKER_HOST
  docker run --rm --name lookupd -p 4160:4160 -p 4161:4161 -d nsqio/nsq /nsqlookupd
  docker run --rm --name nsqd -p 4150:4150 -p 4151:4151 -d nsqio/nsq /nsqd \
      --broadcast-address=$host --lookupd-tcp-address=$host:4160
  docker run --rm --name nsqadmin -p 4171:4171 -d nsqio/nsq /nsqadmin \
      --lookupd-http-address=$host:4161
}

```

2. Get nsq
```bash
docker pull nsqio/nsq
```

## Start the containers
```bash
run-nsq
```

## Publish a message **
```
curl -d 'hello world' "http://$DOCKER_HOST:4151/pub?topic=sample_topic"
```

## Set up a consumer
```bash
mkdir -p ~/projects/test-nsq
cd $_
npm i nsqjs
```

Create consumer.js as listed below. 

```js

// consumer.js
const nsq = require('nsqjs')

const reader = new nsq.Reader('sample_topic', 'test_channel', {
  lookupdHTTPAddresses: `${process.env.DOCKER_HOST}:4161`
})

reader.connect()

console.log('started')
reader.on('message', msg => {
  console.log('Received message [%s]: %s', msg.id, msg.body.toString())
  msg.finish()
})

```

## Test
```bash
node consumer.js
```

You should see something similar to:

```bash
Received message [0abc62e587053000]: hello world
```

## nsqadmin
Open `http://127.0.0.1:4171/` from a browser.

** The reason why publisher runs before consumer is for the topic to be created before a consumer can subscribe to it.