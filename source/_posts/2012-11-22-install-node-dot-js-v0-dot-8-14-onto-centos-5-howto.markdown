---
layout: post
title: "Install node.js v0.8.14 onto Centos 5 howto"
date: 2012-11-22 22:04
comments: true
categories: [howto,node.js,centos,bz2]
---
Installing through Linux binaries with the current newest version (v0.8.14) doesn't seem to work. Attempting to run "node -v" would give the folowing errors

	node: /lib/libc.so.6: version `GLIBC_2.9' not found (required by node)
	node: /lib/libc.so.6: version `GLIBC_2.6' not found (required by node)
	node: /lib/libc.so.6: version `GLIBC_2.7' not found (required by node)

Therefore the only way to get it installed onto Centos 5.X (which comes with Python 2.4.3 which will fail while compiling node) is through compiling from source code. I am putting together this guide to ensure the installation is painlessly easy as I've been through the process a few times. The systems I've tested with happened to be both 32bit but I assume the procedures should work with the 64bit system as well, just make sure you download the source files matching the CPU architecture.


## Steps
step 1. build bzip2 from source
{% codeblock lang:bash %}
wget http://bzip.org/1.0.6/bzip2-1.0.6.tar.gz
tar xpzf bzip2-1.0.6.tar.gz
cd bzip2-1.0.6
make
make install
{% endcodeblock %}

step 2. build Python 2.7
{% codeblock lang:bash %}
wget -O - http://www.python.org/ftp/python/2.7.3/Python-2.7.3.tgz|tar xz
cd Python-2.7.3
./configure
make
make install
{% endcodeblock %}

step 3. log out and log back in to the system

step 4. build node 0.8.14
{% codeblock lang:bash %}
wget -O - http://nodejs.org/dist/v0.8.14/node-v0.8.14-linux-x86.tar.gz|tar xz
cd node-v0.8.14
./configure
make
make install
{% endcodeblock %}


## Notes
1. Step 1 is very critical for the installation of the node. Without it, you will get Python error "cannot find module bz2" while running make in step 4;
2. The solution provided by this guide will install Python 2.7 onto your system. If you found something broken with your Python programs, make sure you check the $PATH setting, the OS stock version should have python under /usr/bin/python while the compiled version should be /usr/local/bin/python. Adjust the orders of /usr/local/bin and /usr/bin in $PATh setting if needed.


## References
[http://stackoverflow.com/questions/812781/pythons-bz2-module-not-compiled-by-default](http://stackoverflow.com/questions/812781/pythons-bz2-module-not-compiled-by-default)
[http://nodejs.org/download/](http://nodejs.org/download/)
