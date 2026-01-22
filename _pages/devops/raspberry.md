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

# Configuring network

If you want to use Raspberry Pi as a server in your local network, you will need a static IP address.
To configure a static Wi-Fi IP address, do the following (assuming that NetworkManager is used for network configuration in your OS):
  - Edit your Wi-Fi connection settings in NetworkManager:
    ```shell
    sudo vi /etc/NetworkManager/system-connections/preconfigured.nmconnection
    ```
  - In the `[ipv4]` section, set your desired static configuration. For example:
    ```
    [ipv4]
    address1=192.168.1.5/24
    gateway=192.168.1.1
    dns=192.168.1.1
    method=manual
    ```
  - In the `[wifi]` section, disable power save mode to ensure the Wi-Fi adapter is always available (does not go to "sleep" mode):
    ```
    [wifi]
    powersave=2
    ```
  - Restart NetworkManager (be careful, IP address will be changed):
    ```shell
    sudo systemctl restart NetworkManager
    ```
  - Done, check that the IP address has changed. And check that power save mode is disabled:
    ```shell
    sudo nmcli connection show preconfigured | grep powersave
    802-11-wireless.powersave: 2 (disable)
    ```

If multiple Wi-Fi networks share the same `SSID`, and you connect to Wi-Fi using `SSID` only, you may see the following log messages:
  ```shell
  sudo journalctl | grep Associated
  ... wpa_supplicant[XXX]: wlan0: Associated with 11:22:33:44:55:55
  ... wpa_supplicant[XXX]: wlan0: Associated with 11:22:33:44:55:77
  ... wpa_supplicant[XXX]: wlan0: Associated with 11:22:33:44:55:55
  ... wpa_supplicant[XXX]: wlan0: Associated with 11:22:33:44:55:77
  ```

This indicates that Wi-Fi is constantly reconnecting to different networks. Eventually, the router may block the connection and disconnect the device:
  ```shell
  sudo journalctl | grep WRONG_KEY --context 15
  ... wpa_supplicant[XXX]: wlan0: CTRL-EVENT-DISCONNECTED bssid=11:22:33:44:55:55 reason=6
  ... wpa_supplicant[XXX]: wlan0: WPA: 4-Way Handshake failed - pre-shared key may be incorrect
  ... wpa_supplicant[XXX]: wlan0: CTRL-EVENT-SSID-TEMP-DISABLED id=0 ssid="WIFINETWORK" auth_failures=1 duration=10 reason=WRONG_KEY
  ... NetworkManager[XXX]: <info> ... device (wlan0): supplicant interface state: 4way_handshake -> disconnected
  ```

To fix this, add the `BSSID` to the NetworkManager configuration (`[wifi]` section) and restart NetworkManager:
  ```
  [wifi]
  ssid=WIFINETWORK
  bssid=11:22:33:44:55:55
  ```

To find the correct `BSSID`, do the following:
  ```shell
  sudo nmcli device wifi rescan
  sudo nmcli device wifi list
  IN-USE  BSSID              SSID         MODE   CHAN  RATE        SIGNAL ...
  *       11:22:33:44:55:55  WIFINETWORK  Infra  XXX   XXX Mbit/s  XX     ...
          11:22:33:44:55:77  WIFINETWORK  Infra  XXX   XXX Mbit/s  XX     ...
  ```

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
