---
layout: page
section: Tools
title: Network
order: 940
javascript_components:
  - converters.js
---

* TOC
{:toc}

# CIDR

Classless Inter-Domain Routing (CIDR) is a method for allocating IP addresses and IP routing.
Number after `/` represents the number of network bits (unchanged and always `1`) in the IP address.
The objective of CIDR it to improve the previous classful network addressing architecture
(3 classes - Class A: `/8`, Class B: `/16`, Class C: `/24`).

<div id="#converter-cidr"></div><script>render("#converter-cidr", "cidr")</script>
