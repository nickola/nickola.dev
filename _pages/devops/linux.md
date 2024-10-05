---
layout: page
section: DevOps
title: Linux
order: 300
---

* TOC
{:toc}

# About

Linux is open-source Unix-like operating system based on the Linux kernel.
Linux kernel was first released in 1991 by Linus Torvalds.

# "proc" filesystem

`proc` filesystem is a pseudo-filesystem which provides an interface to kernel data structures,
it represents information about system and processes in a hierarchical file-like structure.
It is commonly mounted at `/proc`.

Most of the files in the proc filesystem are read-only, but some files are writable, allowing kernel variables to be changed.

Examples:
  - CPU information: `cat /proc/cpuinfo`
  - Load average: `cat /proc/loadavg`

# Load average

`Load average` (`LA`) represents the average system load – the number of processes executed by the CPU or are waiting for execution.
It is displayed for a period of time (`1`, `5` and `15` minutes) in the output of the `top` or `uptime` commands.

It can be also checked using `proc` filesystem: `cat /proc/loadavg`.
The first three columns is `load average`. The fourth column shows the number of currently running processes and the total number of processes.
The last column displays the last process ID used.

# Process states

Linux process states:
  - `R` (running or runnable): On run queue, is running or waiting for the CPU.
  - `S` (interruptible sleep): Waiting for an event, such as input from the terminal, will react to signals.
  - `D` (uninterruptible sleep): Usually IO, cannot be killed or interrupted with a signal.
  - `Z` (zombie / defunct): Terminated but its exit status is not read by parent process yet.
  - `T` (stopped): Stopped, for example: `kill -STOP <PID>`,  `Ctrl + Z`.
