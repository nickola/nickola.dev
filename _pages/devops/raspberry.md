---
layout: page
section: DevOps
title: Raspberry Pi
order: 50
---

* TOC
{:toc}

# About

[Raspberry Pi](https://www.raspberrypi.com) is a series of small single-board computers (SBCs).
I use Raspberry Pi 5 as a simple home server running Kubernetes (using [K3S](https://k3s.io)).
On this page, you can find some notes about Raspberry Pi 5 configuration.

<div class="images-grid">
  <img src="/static/raspberry/raspberry-1.jpg" alt="Raspberry Pi 5, Raspberry Pi Case, Raspberry Pi 45W USB-C Power Supply, Raspberry Pi SD Card" />
  <img src="/static/raspberry/raspberry-2.jpg" alt="Raspberry Pi 5, Raspberry Pi M.2 HAT+, Raspberry Pi SSD, Raspberry Pi Active Cooler" />
</div>

# Configuring locale

If you change locale in Raspberry Pi Imager during the installation of Raspberry Pi OS, you might see the following warning message when logging in to the Raspberry Pi via SSH:

```
setlocale: LC_ALL: cannot change locale (en_US.UTF-8)
```

To fix this issue, do the following:
  - Edit `/etc/locale.gen` file:
    ```shell
    sudo vi /etc/locale.gen
    ```
  - Uncomment the line containing `en_US.UTF-8`.
  - Update locale:
    ```shell
    sudo locale-gen en_US.UTF-8
    sudo update-locale en_US.UTF-8
    ```
  - Done, the issue should be resolved.

# Checking temperature

To check Raspberry Pi temperature, run the following command:
```shell
vcgencmd measure_temp
temp=52.7'C
```

To check the cooling device state (fan speed), run the following commands:
```shell
# Current state
cat /sys/devices/virtual/thermal/cooling_device0/cur_state
1

# Maximum value
cat /sys/devices/virtual/thermal/cooling_device0/max_state
4
```

# Turning off all LEDs

To turn off Raspberry Pi 5 LEDs, do the following:
  - Edit `/boot/firmware/config.txt` file:
    ```shell
    sudo vi /boot/firmware/config.txt
    ```
  - Add the following at the end of the file (in the `[all]` section):
    ```
    # ADDED: Turn off all LEDs
    dtparam=pwr_led_trigger=default-on
    dtparam=pwr_led_activelow=off
    dtparam=act_led_trigger=none
    dtparam=act_led_activelow=off
    dtparam=eth_led0=4
    dtparam=eth_led1=4
    ```
  - Reboot:
    ```shell
    sudo reboot
    ```
  - Done, LEDs should be turned off.

  It's not possible to turn off the [M.2 HAT+](https://www.raspberrypi.com/products/m2-hat-plus)
  and [SSD](https://www.raspberrypi.com/products/ssd) LEDs, so I just covered them with electrical tape.

# Enabling cgroups

If you want to install Kubernetes (in my case, [K3S](https://k3s.io)), you should [enable](https://docs.k3s.io/installation/requirements?os=pi#operating-systems) `cgroups`.
Do the following:
  - Edit `/boot/firmware/cmdline.txt` file:
    ```shell
    sudo vi /boot/firmware/cmdline.txt
    ```
  - Add the following to the end of the line:
    ```
    cgroup_memory=1 cgroup_enable=memory
    ```
  - Reboot:
    ```shell
    sudo reboot
    ```
  - Done, check that `cgroups` are enabled:
    ```shell
    cat /proc/cmdline
    ... cgroup_memory=1 cgroup_enable=memory

    mount | grep cgroup
    cgroup2 on /sys/fs/cgroup type cgroup2 ...
    ```
