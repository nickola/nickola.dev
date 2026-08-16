---
layout: page
section: Projects
title: Web Console
redirect_from:
  - /webconsole
  - /web-console
order: 300
javascript_components:
  - console.js
---

- Web Console is a web-based application that allows to execute shell commands on a server directly from a browser (web-based shell).
- Web Console is very light, does not require any database and can be installed and configured in about 3 minutes. Installation process is really simple:
  - 🔗 [Download](https://github.com/nickola/web-console/releases/download/v0.9.7/webconsole-0.9.7.zip) the latest version of the Web Console.
  - 📦 Unpack archive and open file `webconsole.php` in your favorite text editor.
  - ✏️ At the beginning of the file enter your `$USER` and `$PASSWORD` credentials. Edit any other settings that you need (see description in the comments).
  - 🖥️ Upload changed `webconsole.php` file to the web server and open it in the browser.

## Preview

<div class="preview-list">
  <div class="preview" style="border-width: 0; min-width: 300px"><img src="/static/projects/web-console.png"/></div>
</div>

## Features

- 🔆 **Clean interface**<br>
  _Web Console has an easy to use and clean interface. It looks and feels like a real terminal._

- 🚀 **Simple installation**<br>
  _Installation and configuration process is very simple. Web Console does not require any database and can be installed and configured in about 3 minutes._
  _Web Console can be easily installed on a shared web hosting._

- ⭐️ **Secure**<br>
  _You can configure HTTPS (SSL) on your web server and all Web Console traffic will be encrypted._
  _Also, Web Console has a flag for search engines that will disallow the Web Console page from indexing._

- ⚙️ **Open-source**<br>
  _Web Console is open-source application and can be customized by anyone._
  _Also, third-party components are used in the Web Console._
  _Checkout Web Console repository at [GitHub](https://github.com/nickola/web-console){:target="_blank"}._

## Frequently Asked Questions

- 💬 **When I pass command to Web Console, under which user account it is executed on the web server?**

  By default Web Console is running under the web server user account (or for some web server configurations it is a specified user, who run scripts).
  All commands, which you pass to Web Console, executed using that user account.
  For example, execute `id` command in the Web Console and you will see current user account information. For example:
  ```
  user@skynet /tmp$ id
  uid=777(www) gid=777(www) groups=777(www)
  ```

- 💬 **How to run command with `sudo` (as `root`) using Web Console?**

  To run commands using `sudo` you need to configure `/etc/sudoers` file.
  You can read more information about it in [sudo official manual page](http://www.sudo.ws/sudo/man/sudoers.html){:target="_blank"}.
  For example, execute `id` command in the Web Console and you will see user account under which Web Console is running:
  ```
  user@skynet /tmp$ id
  uid=777(www) gid=777(www) groups=777(www)
  ```
  Now you need allow that user to use `sudo`.
  For example, we will allow `www` user to run any commands as `root` using `sudo` without password
  (but, we are highly recommend to run Web Console with minimal permissions, depends on your Web Console usage requirements).
  To do that, add the following line to the `/etc/sudoers` file:
  ```
  www ALL=(ALL) NOPASSWD: ALL
  ```
  Now you can execute commands with `sudo`, for example:
  ```
  user@skynet /tmp$ sudo id
  uid=0(root) gid=0(root) groups=0(root)
  ```

- 💬 **How to run `vi` / `vim` or `ping` (commands that waiting for some input or executes something infinitely using Web Console)?**

  When Web Console executes command on the web server side, it is waiting for command result (output) and sends that result back to you.
  So, if your command is waiting for some input (like `vi` / `vim`) or executes something infinitely (like `ping`) you can't directly
  send input (or `CTRL-C`) to that kind of commands using Web Console.
  As alternative, you can use `sed` text editor (see [sed website](https://www.gnu.org/software/sed/){:target="_blank"}) or
  tools like [Expect](https://en.wikipedia.org/wiki/Expect){:target="_blank"} that will pass required input to that kind of commands.

- 💬 **How to run command on remote (another) server using Web Console?**

  Just write a script that will run passed command on the remote server and simply call this script with Web Console and pass command to it.
  You can easily customize Web Console source code to run this script automatically for all passed commands
  (see Web Console repository at [GitHub](https://github.com/nickola/web-console){:target="_blank"}).

<!-- Donate -->
{% include donate.html %}

<!-- Comments -->
{% include comments.html %}
