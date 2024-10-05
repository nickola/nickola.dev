---
layout: page
section: DevOps
title: OpenSSL
order: 500
---

* TOC
{:toc}

# About

`OpenSSL` is a software toolkit for general-purpose cryptography, in implements cryptographic functions
and provides various utility functions.

# Encrypt and decrypt a string

We will use `AES-256` (Advanced Encryption Standard with 256 bits block size) encryption
in CBC (Cipher Block Chaining) mode.

Encryption:

```shell
echo "Message" | openssl aes-256-cbc -base64 -pass pass:password

U2FsdGVkX19HwyPahBZvi2pDMQ1cR9nDYGvriqUo1UM=
```

Decryption:

```shell
echo "U2FsdGVkX19HwyPahBZvi2pDMQ1cR9nDYGvriqUo1UM=" | openssl aes-256-cbc -d -base64 -pass pass:password

Message
```

Used `openssl` options:
  - `-base64`: Perform `Base64` encoding / decoding.
  - `-pass`: Passphrase, `pass:<value>` for plain text.
  - `-d`: Decrypt the input data.
