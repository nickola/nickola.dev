---
layout: page
section: DevOps
title: Docker
order: 200
---

* TOC
{:toc}

# About

Docker is a tool used to automate the deployment of applications in lightweight containers
so that applications can work efficiently in different environments.

# Start container

We can start a container with the following command:

```shell
docker run [<options>] <image> [<arguments_for_image>]
```

By default, if you specify only image name, Docker pulls image from
[Docker Hub](https://hub.docker.com) — largest library and community for container images.

## Start "nginx" container

Let's start official [nginx](https://hub.docker.com/_/nginx) image:

```shell
docker run --rm -it -p 8080:80 nginx

... [notice] ...: nginx/...
... [notice] ...: start worker processes
...
```

Used `docker run` options:
  - `--rm`: Automatically remove the container when it exits.
  - `-i` / `--interactive`: Keep STDIN open even if not attached.
  - `-t` / `--tty`: Allocate a pseudo-TTY.
  - `-p` / `--publish`: Publish a port from container to the host (`<host_port>:<container_port>`).
    Use multiple times for multiple ports.

Let's list containers:

```shell
docker ps

CONTAINER ID IMAGE COMMAND CREATED       STATUS       PORTS                NAMES
11aa22bb33cc nginx ...     5 seconds ago Up 5 seconds 0.0.0.0:8080->80/tcp random_name_nginx
```

Let's connect to the started `nginx` via `curl`:

```shell
curl localhost:8080

<!DOCTYPE html>
...
<title>Welcome to nginx!</title>
...
```

## Start "PostgreSQL" container

Let's start official [PostgreSQL](https://hub.docker.com/_/postgres) image:

```shell
docker run --rm -it -p 15432:5432 -e POSTGRES_PASSWORD=password \
           -v $HOME/postgres_volume:/var/lib/postgresql/data postgres

...
PostgreSQL init process complete; ready for start up.
...
... database system is ready to accept connections
```

New used `docker run` options:
  - `-e` / `--env`: Environment variables. Use multiple times for multiple variables.
  - `-v` / `--volume`: Bind mount a volume (`<host_path>:<container_path>`, absolute paths must be used).
    Use multiple times for multiple volumes.

Let's list containers:

```shell
docker ps

CONTAINER ID IMAGE    COMMAND CREATED       STATUS       PORTS                   NAMES
aa11bb22cc33 postgres ...     5 seconds ago Up 5 seconds 0.0.0.0:15432->5432/tcp random_name_postgres
```

Let's connect to the started `PostgreSQL` via `psql` command:

```shell
PGPASSWORD=password psql --host localhost --port 15432 --user postgres --command "SELECT version()"

    version
---------------
 PostgreSQL ...
```

## Connect to your host from the container

You can use the special DNS name `host.docker.internal` to connect to your host from the container (works on Mac and Windows).
On Linux, add `--add-host=host.docker.internal:host-gateway` to your Docker command to enable this feature.

Let's connect to our started `PostgreSQL` via `psql` command from another container:

```shell
docker run --rm -it -e PGPASSWORD=password postgres \
       psql --host host.docker.internal --port 15432 --user postgres --command "SELECT version()"

    version
---------------
 PostgreSQL ...
```
