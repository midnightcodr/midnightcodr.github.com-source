---
layout: post
title: "Three ways to speed up Raspberry Pi"
date: 2012-11-11 19:52
comments: true
categories: 
---
Raspberry Pi is a fun device to play with but sometimes we wish it can be a tad speedier. In this post I will show you how I did to speed up my rpi. I am running Debian on my rpi so some of the methods might not work for you if you are using different distro.

## 1. Overclock
With the newest Debian wheezy, simply run **raspi-config**, then overclock, OK, choose the one that works for you, choose OK. I settled with 900Mhz because once I use 950MHz, come tasks (such as compilings) could not run properly. Also check out [http://www.raspberrypi.org/archives/tag/overclocking](http://www.raspberrypi.org/archives/tag/overclocking) for more information on overclocking rpi.

## 2. Adjust memory split
By default I got only 184MB of usuable RAM for the system because the rest of the 256MB goes to GPU. While you are still at raspi-config's top menu, choose memory_split. If you run your rpi primarily as a headless server (not running X), just pick the one with the highest system RAM option (240), OK.

**_Note_**: method 1 and 2 require restart to take effect.

## 3. Find out auto-start services and de-select those that don't need to auto-start
For example, if you only need mysql server once a while, it makes no sense to make it run when rpi boots. A simple way to find out what processes are started during boot is through a program **sysv-rc-conf** (not installed by default). Install and fire it up through:
```
sudo apt-get install sysv-rc-conf
sudo sysv-rc-conf
```
