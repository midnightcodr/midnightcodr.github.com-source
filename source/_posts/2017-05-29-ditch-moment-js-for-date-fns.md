title: ditch moment.js for date-fns
date: 2017-05-29 15:50:42
tags: [javascript]
categories: [Programming]
---
I was a moment.js fan until I heard about date-fns. One of the biggest problem with moment.js is that date operations such as .subtract or .add mutates the object! Take the following code for example:
```javascript
var now = new moment()
var prev = now.subtract(5, 'days')
// both prev and now are 5 days ago
// if you need to preserve 'now', you need to do something like
var prev = now.clone()
prev.subtract(5, 'days')
// prev will be 5 days ago but now remains the initial value
```
I was surprised in a great deal to find out such weird behavior through googling and bugs in my projects. To make things worse, moment's doc dosn't tell you clearly that calling `.subtract()` or `.add()` would mutate the original object.

Another issue working with moment.js is that Moment object is not a native javascript Date object, which means conversions are required, which in turn creates two new problems:
1. Bad performance
2. Not straigh-forward to work with because you will need to call `.toDate()` to convert Moment into Date, or `moment()` to convert Date (or date string) into Moment

date-fns is billed as the underscore for Dates. If you are a big fan of underscore (or lodash), you know what that means.

Tldr; here's the date-fns version of the previous code snippet:

```javascript
var subDays = require('date-fns/sub_days');	// note you can import only the function you need
var now = new Date();
var prev = subDays(now, 5);
// now remains the initial value
```

I have converted some of my existing projects into using date-fns and the experience has been awesome since I don't have to live with the annoyance that moment.js brings.

Don't just take my words, go give https://date-fns.org/ a try, or simply
```bash
npm i date-fns
```
if you are already convinced.
