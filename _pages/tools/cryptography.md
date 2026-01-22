---
layout: page
section: Tools
title: Cryptography
order: 920
javascript_components:
  - converters.js
---

* TOC
{:toc}

# MD5

The `MD5` (Message Digest 5) is a cryptographic hash function which produces a `128-bit` hash value.
It has been cryptographically broken and considered **insecure** (it should not be used).

<div id="#converter-md5"></div><script>render('#converter-md5', 'md5')</script>

# SHA-1

The `SHA-1` (Secure Hash Algorithm 1) is a cryptographic hash function which produces a `160-bit` hash value.
It has been cryptographically broken and considered **insecure** (it should not be used).

<div id="#sha1"></div><script>render('#sha1', 'sha1')</script>

# SHA-2

The `SHA-2` (Secure Hash Algorithm 2) is a set of cryptographic hash functions, it consists hash functions
which produce `224-bit`, `256-bit`, `384-bit` or `512-bit` hash values.

<div id="#sha224"></div><script>render('#sha224', 'sha224')</script>
<div id="#sha256"></div><script>render('#sha256', 'sha256')</script>
<div id="#sha384"></div><script>render('#sha384', 'sha384')</script>
<div id="#sha512"></div><script>render('#sha512', 'sha512')</script>
