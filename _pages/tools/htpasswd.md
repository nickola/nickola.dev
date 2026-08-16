---
layout: page
section: Tools
title: htpasswd
order: 990
javascript_components:
  - converters.js
---

The `htpasswd` is used to store usernames and passwords for basic HTTP authentication (used in `Apache` and `nginx`). It supports different formats for password:

- `bcrypt`: `$2y$` or `$2a$` + the result of the `crypt_blowfish` algorithm. **Secure.**
- `MD5`: `$apr1$` + the result of the `Apache-specific MD5 algorithm`. Common but insecure.
- `SHA1`: `{SHA}` + Base64-encoded SHA-1. Insecure.
- `CRYPT`: Unix `crypt` function with a randomly-generated 32-bit salt. Insecure.
- `PLAIN TEXT`: Unencrypted. Insecure.

<div id="#converter-htpasswd"></div><script>render('#converter-htpasswd', "htpasswd")</script>
