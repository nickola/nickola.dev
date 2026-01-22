---
layout: page
section: DevOps
title: Kubernetes
order: 100
---

* TOC
{:toc}

# About

Kubernetes is a container orchestration engine for automating deployment,
scaling and management of containerized applications.

# Components

Kubernetes cluster contains a set of nodes (machines).
`master` nodes (`Control Plane`) manage the `worker` nodes and the cluster.

`Control Plane` makes decisions about the cluster (for example: `Pods` scheduling),
detecting and responding to cluster events (example: starting new `Pod` when `replicas` field of `Deployment` is unsatisfied).

`Control Plane` components can be run on any machine in the cluster (`master` node can be `worker` node in the same time),
but it's recommended to run `Control Plane` components on separate nodes (without user containers and with high availability).

For example, in AWS (Amazon Web Services) EKS (Elastic Kubernetes Service) `Control Plane` runs in an account managed by AWS itself,
on its own set of Amazon EC2 instances in multiple availability zones.

## Control Plane components

  - `kube-apiserver`: Exposes the Kubernetes API (`kubectl` uses this API).
  - `etcd`: Key-value storage, keeps all cluster data.
  - `kube-scheduler`: Watches for newly created `Pods` with no assigned node, and selects a node for them to run on.
    It checks factors like resource requirements, affinity, anti-affinity, etc.
  - `kube-controller-manager`: Runs controller processes. For example:
    `Node controller` - responsible for noticing and responding when nodes go down.
  - `cloud-controller-manager`: Cloud-specific control logic (for cloud providers).

## Node components

  - `kubelet`: Agent that runs on each node. It makes sure that containers are running.
    It doesn't manage containers which were not created by Kubernetes.
  - `kube-proxy`: Network proxy that runs on each node, maintains network rules on nodes.
    Uses the operating system packet filtering layer (`iptables` or `IPVS`) if there available,
    otherwise `kube-proxy` forwards the traffic itself.
  - `Container runtime`: Software that is responsible for running containers, for example: `containerd`, `CRI-O` or
    any other implementation of the Kubernetes `CRI` (Container Runtime Interface).

## Other components

  - `CoreDNS`: `Deployment` (`Pods`) responsible for DNS names resolution for all pods in the cluster.
  - `aws-node` (in Amazon EKS): `DaemonSet` (`Pods`) responsible for IP address management at the node level.

# Workloads

Workload is an application running on Kubernetes.

## Pods

`Pod` is the smallest deployable unit, it represents a set of running containers
with shared storage and network resources.

`Pod` phases: `Pending` (accepted, waiting to be scheduled, downloading images), `Running` (bound to node, at least one container is running), `Succeeded` (all containers successfully terminated), `Failed` (all containers terminated and at least one terminated with non-zero exit code), `Unknown` (can't get state, node connection issues).

`Pod` statuses: `Running` (phase `Running`), `Pending` (phase `Pending`), `Completed` (phase `Running` or `Failed`), `ImagePullBackOff` (can't pull image, will keep trying), `CrashLoopBackOff` (container is started, but crashes, will keep trying to restart).

Container states: `Waiting` (waiting for start up, example: pulling image), `Running` (is executing without issues), `Terminated` (you check reason and exit code).

Container `restartPolicy`: `Always` (container will be restarted even if exited successfully - zero exit code), `OnFailure` (container will be restarted only if exited with a non-zero exit), `Never` (container will not be restarted at all).

## Workload Resources and Controllers

Workload resources manage a set of pods on your behalf, these resources configure controllers.
Controller tracks Kubernetes resources, it tries to make the current state come closer to desired state.

- `Deployment`: Provides declarative updates for `Pods` and `ReplicaSets`. Creates and controls `ReplicaSet` for `Pods`.
  Deployment is a good fit for managing a stateless applications, where any `Pod` is interchangeable.
- `ReplicaSet`: Maintain a stable set of replica `Pods` running at any given time.
- `StatefulSet`: Manages `Pods` similar to `Deployment`, but provides guarantees about the ordering and uniqueness of these Pods.
  Provides: stable persistent storage, ordered graceful deployment and scaling, ordered automated rolling updates
  (here "stable" is synonymous with persistence across `Pod` (re)scheduling).
  If application **doesn't require** any stable identifiers or ordered deployment, deletion or scaling - it should be deployed using `Deployment`.
- `DaemonSet`: Ensures that all (or some: `nodeSelector`, `affinity`) nodes run a copy of a Pod.
  Useful for node-local operations, for example: get node metrics.
- `Jobs`: Creates one or more (if `parallelism` is greater `1`) `Pods` and will continue to retry (specified number of times) execution if `Pod` fails.
  When a specified number of successful completions (`completions` can me greater than `1` if  `parallelism` is greater than `1`)
  is reached - `Job` is successfully completed. Deleting `Job` will clean up the `Pods` it created.
  Suspending (`suspend: true`) `Job` will delete its active `Pods` until the `Job` is resumed again.
- `CronJob`: Performs regular scheduled actions (scheduling with CRON syntax). Creates `Jobs` according to a schedule.

# Liveness, Readiness and Startup Probes

`livenessProbe` is used to know when to restart a container. For example: application is running but doesn't work properly (deadlock or some other issue).
Restarting a container in such state can help to make the application more available despite bugs.

`readinessProbe` is used to know when a container is ready to accept traffic. `Pod` is ready when all of its containers are ready.
When `Pod` is not ready, it is removed from `Service`.

`startupProbe` is used to know when a container application has started. If configured, it disables `livenessProbe` and `readinessProbe` checks until it succeeds,
making sure those probes don't interfere with the application startup. Useful for slow starting containers.

Probes configuration:
  - `initialDelaySeconds`: Wait number of seconds after the container has started (before probe).
    Defaults to `0` seconds, minimum is `0`.
  - `periodSeconds`: How often (in seconds) to perform the probe. Default to `10` seconds, minimum value is `1`.
  - `timeoutSeconds`: Number of seconds after which the probe times out. Defaults to `1` second, minimum is `1`.
  - `successThreshold`: Minimum consecutive successes for the probe to be considered successful after having failed.
    Defaults to `1`, minimum is `1`.
  - `failureThreshold`: After the probe fails specified times in a row, the overall check has failed:
    the container is not ready / healthy / live. For the case of a startup or liveness probe - container will be restarted.

# Service

`Service` is an abstract way to expose application running on a set of `Pods` (based on `selector` - `Pod` labels) as a network service (load balanced as round robin / random).

`Service` types:
  - `ClusterIP`: Default type, cluster-internal IP address. Only reachable within the cluster network.
  - `NodePort`: Exposes the service on each node at a static port.
  - `LoadBalancer`: Cloud provider will create a load balancer (integrates NodePort with cloud-based load balancers).
  - `ExternalName`: Map to a DNS name, will return `CNAME` record with specified value.

If `selector` is not defined, corresponding `EndpointSlice` (legacy `Endpoints`) are not created automatically and should be created manually. `EndpointSlice` contains references to a set of network endpoints.

Headless `Service` used when you don't need load balancing across `Pods` and single IP for the `Service`. If will return DNS `A` / `AAAA` records for each IP or DNS `CNAME` record for `type: ExternalName`. It can be created if explicitly specify `None` for the `clusterIP` field.

# Examples

## Environment variables

> File: [environment-variables.yaml](/devops/kubernetes-examples/environment-variables.yaml)
{% capture environment_variables %}{% include_relative kubernetes-examples/environment-variables.yaml %}{% endcapture %}

```yaml
{{ environment_variables | strip }}
```
