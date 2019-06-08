title: Add error code(s) to Hapijs output
date: 2019-06-08 15:51:01
tags: hapijs
categories:
- note
- howto
---
Joi validation is powerful and easy to work with, however it's not always obvious or easy to add stuff like error code(s) to the hapijs response. This post will show you a way (or two) to deal with that problem.

## Step 1, assign error codes to each validation error
Quick example:
```javascript
server.route({
  method: 'POST',
  path: '/person',
  options: {
    validate: {
      payload: {
        firstName: Joi.string()
          .min(5)
          .max(10)
          .required()
          .error(errors => {
            errors.forEach(err => {
              switch (err.type) {
                case 'any.empty':
                case 'any.required':
                  err.message = 'Firstname should not be empty!'
                  err.context = {
                    errorCode: 111
                  }
                  break
                case 'string.min':
                  err.message = `Firstname should have at least ${
                    err.context.limit
                  } characters!`
                  err.context = {
                    errorCode: 121
                  }
                  break
                case 'string.max':
                  err.message = `Firstname should have at most ${
                    err.context.limit
                  } characters!`
                  err.context = {
                    errorCode: 131
                  }
                  break
                default:
                  break
              }
            })
            return errors
          })
      }
    }
  },
  handler: async request => {
    // todo: handle saving the paylod
    console.log('to save', request.payload)
    return { result: 'ok' }
  }
})
```

## Step 2, customize failAction when creating Hapi server
```javascript
const Boom = require('@hapi/boom')
const server = Hapi.Server({
  // ...
  routes: {
    validate: {
      failAction: (request, h, err) => {
        const firstError = err.details[0]
        if (firstError.context.errorCode !== undefined) {
          throw Boom.badRequest(err.message, {
            errorCode: firstError.context.errorCode
          })
        } else {
          throw Boom.badRequest(err.message)
        }
      }
    }
  }
})
```

## Step 3, customize response
The reason this step is needed is because Hapi would strip out the injected `errorCode` attribute created by step 2
```javascript
server.ext('onPreResponse', (request, h) => {
  const response = request.response
  if (!response.isBoom) {
    return h.continue
  }
  const { data } = response
  if (data !== undefined) {
    response.output.payload = {
      ...response.output.payload,
      ...data
    }
  }
  return h.continue
})
```

With the above setup, request
```bash
curl http://localhost:3000/person -d ''
````

would result in
```json
{"statusCode":400,"error":"Bad Request","message":"child \"firstName\" fails because [Firstname should not be empty!]","errorCode":111}
```

By default `abortEarly: true` is set Hapi, if multiple error codes are desired, only Step 2 needs to be adjusted to
```javascript
const server = Hapi.Server({
  // ...
  routes: {
    validate: {
      options: {
        abortEarly: false
      },
      failAction: (request, h, err) => {
        const errorCodes = err.details
          .map(e => e.context.errorCode)
          .filter(e => e !== undefined)
        throw Boom.badRequest(err.message, { errorCodes })
      }
    }
  }
})
```

request

```bash
curl http://localhost:3000/person -d 'firstName='
```
would return
```json
{"statusCode":400,"error":"Bad Request","message":"child \"firstName\" fails because [Firstname should not be empty!, Firstname should have at least 5 characters!]","errorCodes":[111,121]}
```

If you need to add error code in your application code, you can simply achieve that by returning a `Boom` like the following

```javascript
return Boom.badRequest('Your error message here', { errorCode: YOUR_CODE })
```

I've composed a [gist](https://gist.github.com/midnightcodr/c47a1c3322818e9ba42cd264b19885f6) in case you want to save some typings in trying out the code. Cheers!