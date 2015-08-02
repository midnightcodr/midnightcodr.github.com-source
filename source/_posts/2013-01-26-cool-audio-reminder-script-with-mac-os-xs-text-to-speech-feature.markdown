---
layout: post
title: "Cool Audio Reminder Script With MAC OS X's Text-to-speech Feature"
date: 2013-01-26 00:00
comments: true
categories: [fun, health, programming]
---
## Why
We know that [sitting for too long is harmful for our health](http://abcnews.go.com/WN/sitting-long-work-pose-health-danger/story?id=11926874). My solution to this problem is to set up a friendly reminder using Mac OS X’s speech to text feature, and a bit of programming. So here we go:

## Steps
1). Create a reminder file under your home directory, for example,
{% codeblock lang:bash %}
$ vi ~/break_reminder
{% endcodeblock %}


{% codeblock content of ~/break_reminder %}
Stand up and walk around Your_Name.
Don't be lazy Your_Name, I know you can do it.
Stand up now, Your_Name, and do some exercises.
Sitting for too long is not healthy for you Your_Name.
Take a walk, get some water Your_Name.
You need a short break Your_Name.
Don't stick your butt to the chair for too long Your_Name.
{% endcodeblock %}

Obviously change Your_Name to something that you want the voice to call you. This is one that I created, feel free to change the content.

2). Create the reminder shell script
```
$ vi ~/reminder.sh
```
{% codeblock lang:bash %}
#!/usr/bin/env bash
(( total_lines = $(wc -l < ~/break_reminder) )) && (( line = $RANDOM % $total_lines + 1 )) && sed -n ${line}p ~/break_reminder|say
{% endcodeblock %}
3). Run some dry tests by running
{% codeblock lang:bash %}
bash ~/reminder.sh
{% endcodeblock %}
4). Add the reminder to crontab
{% codeblock lang:bash %}
crontab -e
{% endcodeblock %}
insert the following line:

0 9-16 * * 1-5 bash ~/reminder.sh

This will run the reminder script from 9am to 4pm hourly on the clock Monday through Friday. If you are new to crontab, refer to [http://en.wikipedia.org/wiki/Cron](http://en.wikipedia.org/wiki/Cron) for more details.

## Notes
1. I tried putting the meat inside ~/reminder.sh directly into crontab, didn’t work, that’s why this extra script is needed.
1. Feel free to change the env from bash to zsh in ~/reminder.sh, I have tested it to work with both bash and zsh.
1. Personally I prefer Serena’s voice, you need to download it via these steps: Search for “Dictation & Speech” in the spotlight -> Tick “Text to Speech” -> Tick “Customize”, then “Serena” from System Voice dropdown, you will be prompted to download the voice file if it has not been downloaded before.
1. The reminder (break_reminder) and script (reminder.sh) can be found in my github repository: [https://github.com/midnightcodr/break_reminder](https://github.com/midnightcodr/break_reminder).
