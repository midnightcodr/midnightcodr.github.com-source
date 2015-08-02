---
layout: post
title: "Install Gitlab(6.4) on Raspberry PI"
date: 2014-01-11 09:31
comments: true
categories: [gitlab, raspberrypi, rpi] 
---

I am a big fan of both Raspberry PI and Gitlab so it kinda bugs me when my attempts to install Gitlab onto RPI didn't succeed because of failure to install therubyracer gem. Others experienced the similar problems I encountered: [http://www.raspberrypi.org/phpBB3/viewtopic.php?t=32716&p=397934](http://www.raspberrypi.org/phpBB3/viewtopic.php?t=32716&p=397934), by following most of user dpenezic's instruction I finally made it to install Gitlab (currently at version 6.4) onto my RPI (512MB Ram but only 384MB is available to the system as I allocate the rest to GPU). So here are what I did:

## Steps
1) Follow [https://github.com/gitlabhq/gitlabhq/blob/6-4-stable/doc/install/installation.md](https://github.com/gitlabhq/gitlabhq/blob/6-4-stable/doc/install/installation.md) until "Install Gems"

2) Install libv8 ([https://github.com/cowboyd/libv8](https://github.com/cowboyd/libv8))

	# [update: added git-svn to the list on 1/17/2014]
	sudo apt-get install -y subversion git-svn
	[ -d ~/tmp ] || mkdir ~/tmp
	cd ~/tmp
	git clone https://github.com/cowboyd/libv8
	cd libv8
	bundle install
	# be patient, the following command takes a while
	bundle exec rake clean build binary
	sudo gem install pkg/libv8-3.11.8.17-armv6l-linux.gem

3) Modify /home/git/gitlab/Gemfile (and .lock) to skip installation of libv8 (as it's installed through the above step) and the rubyracer

	cd /home/git/gitlab
	sudo -u git -H editor Gemfile	# and remove the line: gem "therubyracer"
	sudo -u git -H editor Gemfile.lock	# and removed the following lines
		libv8 (3.16.14.3)
		therubyracer (0.12.0)
		  libv8 (~> 3.16.14.0)
		  ref
4) Install node.js, you can take a look at the script I came up with to compile node.js in RPI: [https://github.com/midnightcodr/rpi_node_install](https://github.com/midnightcodr/rpi_node_install)

5) Now you can resume the "Install Gems" step in the Gitlab installation guide

	sudo -u git -H bundle install --deployment --without development test postgres aws
	# and the rest

## Notes
1) 384MB is not enough to run "Compile assets" step on the gitlab installation guide so I had to add some more swap memory by following [http://www.cyberciti.biz/faq/linux-add-a-swap-file-howto/](http://www.cyberciti.biz/faq/linux-add-a-swap-file-howto/)

	sudo dd if=/dev/zero of=/swapfile1 bs=1024 count=524288
	sudo mkswap /swapfile1
	sudo chmod 0600 /swapfile1
	sudo swapon /swapfile1

2) Make sure the server_name setting in /etc/nginx/sites-available/gitlab matches gitlab_url in /home/git/gitlab-shell/config.yml, also add an entry to your RPI's /etc/hosts

	127.0.0.1	gitlab.server.hostname

3) With the current version of Gitlab, performance is not that bad at all - it takes about 2 seconds to switch pages.
