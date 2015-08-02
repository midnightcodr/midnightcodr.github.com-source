---
layout: post
title: "GA-Z68X-UD3H-B3 F12 Mountain Lion 10.8.3 Installation Notes"
date: 2013-04-08 20:02
comments: true
categories: [howto,tip,tony macx86,hackintosh]
---
Last Friday I had a hard time installing Moutain Lion 10.8.2 onto a GA-Z68X-UD3H-B3 (BIOS version F10), which was running fine with Lion (10.7.3), with either upgrade or clean install method. With some help from [http://www.kakewalk.se/forums/discussion/4008/success-ga-z68x-ud3h-10-8-x-mountain-lion/p1](http://www.kakewalk.se/forums/discussion/4008/success-ga-z68x-ud3h-10-8-x-mountain-lion/p1) and [http://www.tonymacx86.com/](http://www.tonymacx86.com/) I managed to install ML 10.8.3 onto the system. Here are the steps:

1. Make a 10.8.3 Unibeast bootable usb drive (doesn't need to check either options when making the drive with Unibeast) 
2. Upgrade BIOS to F12 (tried UEFI version but got BIOS ID check error hence I settled with F12)
3. In BIOS setting, make sure HPET is set to 64bit. The system has an Agility 3 120GB SSD so the SATA3 port mode should be set to ACHI
4. After installation, boot from Unibeast drive again but choose the OS on the SSD
5. Download DDST (to the desktop), Multibeast from tonymacx86.com, choose the followings (More on the audio later)
{% img center /images/z68x-ud3h-b3-f12-ML-10.8.3.png %}
6. After Multibeast and Lnx2Mac's Realtek driver installations, shutdown, remove Unibeast drive and boot from SSD, network should be working but audio is not working (can see the sound icon, can adjust volume but there's just no sound coming out)
7. Download Audio_Network.zip from [http://ge.tt/6nuMCAL/v/0?c](http://ge.tt/6nuMCAL/v/0?c), unzip but only place AppleHDA.kext onto the desktop
8. Download KextBeast from tonymacx86.com and run it, it should pick up the AppleHDA.kext on the desktop
9. Run Multibeast again, select nothing but Drivers & Bootloaders->Drivers->Audio->Realtek ALC8xx->Without DSDT->ALC889 (basically the same option for audio in step 5)
10. Reboot, audio problem should now be fixed (try different line out port if is sound still missing).
11. (Optional) If you need to use iMessage, you need to install the newest Chimera (2.0.1 currently) from [http://www.tonymacx86.com/downloads.php?do=file&id=164](http://www.tonymacx86.com/downloads.php?do=file&id=164)

## other notes
Trim doesn't seem to be turned on when I checked the system info, need to spend some time to look into that.
