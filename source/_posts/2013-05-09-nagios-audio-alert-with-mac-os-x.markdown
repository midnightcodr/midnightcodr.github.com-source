---
layout: post
title: "Nagios audio alert with Mac OS X"
date: 2013-05-09 20:50
comments: true
categories: [howto,fun,nagios,node.js]
---
## Background
You have a nagios server running Linux and you have a nice OS at work called Mac OS X which comes with a handy text-to-speech feature. Wouldn't it be nice if you can turn your workstation into a nagios audio alert system? In this post I'll show you extactly how you can achieve that.

## Requirements
- node.js installed on the client, along with a module called execSync (installed by command `npm install -g execSync`)
- nc (netcat) is installed on the nagios server (most distro comes with it so this shouldn't be a problem)

## Code on the client
{% include_code nagios-audio-alert.js %}
Run the code from terminal:
```
node /usr/local/bin/nagios-audio-alert.js
```
## Do some test runs on the client

```
echo "service::PROBLEM::service down test"|nc -u -w 1 127.0.0.1 20123
echo "host::PROBLEM::host test123 is down"|nc -u -w 1 127.0.0.1 20123
```

If everything goes well, ^C to exit the nagios-audio-alert.js program and move on to nagios server.

## Modification to nagios server's config files

- command.cfg

```
	...
	define command{
			command_name    notify-host-by-tts
			command_line /usr/bin/printf "host::$NOTIFICATIONTYPE$::$HOSTNAME$ is $HOSTSTATE$"|nc -u -v -w 1 <replace_with_ip_of_mac_client> 20123
			}
	...
```
- template.cfg

```
	...
	define contact{
			name                            generic-contact         ; The name of this contact template
			service_notification_period     24x7                    ; service notifications can be sent anytime
			host_notification_period        24x7                    ; host notifications can be sent anytime
			service_notification_options    u,c,r,f,s               ; send notifications for all service states, flapping events, and scheduled downtime events
			host_notification_options       d,u,r,f,s               ; send notifications for all host states, flapping events, and scheduled downtime events
			#service_notification_commands   notify-service-by-email        ; send service notifications via email
			service_notification_commands   notify-service-by-tts,notify-service-by-email	; notify thru audio & email
			#host_notification_commands      notify-host-by-email   ; send host notifications via email
			host_notification_commands      notify-host-by-tts,notify-host-by-email
			register                        0                       ; DONT REGISTER THIS DEFINITION - ITS NOT A REAL CONTACT, JUST A TEMPLATE!
			}
	...
```

- Restart nagios server after making the above changes, always test nagios configuration before restarting: `/etc/init.d/nagios checkconfig`

## Run nagios-audio-server.js as a daemon
Rason for this is that we want the Mac to be able to play alerts even when the user is not logged in. Create `/System/Library/LaunchDaemons/nagios-audio-alert.plist` with the following content, change `CHANGE_TO_YOUR_USERNAME_ON_MAC` to your mac username
{% include_code nagios-audio-alert.plist.xml %}
then
```
sudo launchctl load -w /System/Library/LaunchDaemons/nagios-audio-alert.plist
```

## Some notes
- 20123 is the UDP port I grabbed from the air, change to whatever port you like (make sure they are in sync in both the js code and nagios config file command.cfg
- Reason why execSync is needed is because if you have two (or more) messages come in at the same time (or almost simultaneously), you want the messages to be played one after another
- If you have filewall on either the client or the nagios server, make sure they allow the traffic for the protocol/port used
- A mac client is not really a hard requirement to build a nagios audio alert system like this, a Linux box that is capable of doing text-to-audio can handle this kind of task with ease, some code in nagios-audio-alert.js need to be changed though
