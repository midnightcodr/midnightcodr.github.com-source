---
layout: post
title: "Generate SSL certificate with 1 easy step"
date: 2012-10-10 22:22
comments: true
categories: [SSL, openssl] 
---
Originally I created a post on how to generate ssl certificate with one simple step:
[http://ricochen.wordpress.com/2010/01/01/generate-ssl-certificate-in-1-quick-step/](http://ricochen.wordpress.com/2010/01/01/generate-ssl-certificate-in-1-quick-step/)

I am here to document the procedure in this first post of my Octopress based blog.

Command to generate SSL certificate (and its associated private key) is pretty straight-forward:
``` sh
$ openssl req -new -x509 -days 3650 -keyout key.pem -out cert.pem -newkey rsa:2048 -subj "/CN=hostname.example.org"
```

If a password is created in the above step, you'll need one extra step to remove it unless you want to type the password everytime you restart the web server:

``` sh
$ openssl rsa -in key.pem -out key.pem
```
