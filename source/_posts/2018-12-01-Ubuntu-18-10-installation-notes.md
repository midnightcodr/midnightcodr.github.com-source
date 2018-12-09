title: Ubuntu 18.10 installation notes
date: 2018-12-01 15:57:55
tags:
- ubuntu
categories:
- os
- note
---
[Ubuntu 18.10](https://www.ubuntu.com/download/alternative-downloads) was released not long ago and I decided to give it a try on my Acer Helios 300 (2018 version) and I couldn't be happier with the result that I made the switch from Manjaro.

## Hardware preparation
I opted to keep the default Windows 10 installation on the built-in nvme drive and install a spare 120G SSD drive to the ssd slot. By default BIOS has SATA mode set to `Optane` mode which would cause ubuntu not being able to see the drive. Change to `ACHI` mode instead. Secure Boot feature also needs to be disabled in the BIOS. The trackpad is set to `Advanced` mode by default in BIOS, change it to `Basic` because otherwise it won't operate in Linux.


## A note on backing up the disk to an image
If you want to do a whole system backup before making any changes. You can use `Deepin Clone` tool from [Deepin Live System] (https://www.deepin.org/en/download/). I used to use `CloneZilla` to make system backups but it no longer works on this laptop even with UEFI version of the tool - it just won't show up in the boot menu.


## Software preparation
Downloading the iso from ubuntu.com might be painfully slow. To speed up the downloading, use a bittorrent tool and download from [here](http://releases.ubuntu.com/cosmic/) instead. I downloaded http://releases.ubuntu.com/cosmic/ubuntu-18.10-desktop-amd64.iso.torrent


## "missing" touchpad right click button
Upon reboot after the installation, I found that the right button on the trackpad behaves exactly the same as the left button (or a single tap since I enabled that). A bit googling indicates that the two finger tap is the replacement. Therefore make sure tapping is enabled in touchpad and remember to use two finger tapping to mimic the old right click. It doesn't take long before I get used to the new behavior.


## install docker with the correct user/group setting
If you plan to install docker and operate it with non-root user, make sure you do the following BEFORE you install it (under Ubuntu Software)
```
sudo usermod -aG docker $USER
newgrp docker
```

Without the above steps it requires root privileges to run docker commands.


## Don't install visual studio code from Ubuntu Software
Instead, download and install the package from https://go.microsoft.com/fwlink/?LinkID=760868.
If you do install from Ubuntu Software (aka snap) you'll end up with a very slow start-up problem with VSC. See the issue reported at https://github.com/Microsoft/vscode/issues/61565.


## Get hardware sensor information
To get information such temperature about the laptop's cpu/ssd, install `Psensor` from Ubuntu Software.


## Unofficial benchmark results using redis
With docker/redis I made a quick benchmarking comparison between Manjaro Gnome (17) and Ubuntu (18.10) and I was blown away by the result from Ubuntu. With Manjaro I got about 60K/s operation while I am getting a whopping 150K+/s result from Ubuntu. I am not sure how the result can be so significantly different between Manjaro and Ubuntu. Below is the steps I took on both systems (I did these steps before and after Manjaro is replaced on my laptop).
```
docker pull redis
docker run --name my-redis --rm -d redis
docker exec -it my-redis redis-benchmark -q
```
Hardware configurations of this laptop:

- CPU i7-8750H with 16G of RAM
- 256G nvme drive (with Windows 10 installed)
- 120G SSD (with Ubuntu 18.10 installed)