---
layout: page
section: DevOps
title: AWS
title_long: AWS (Amazon Web Services)
order: 400
---

* TOC
{:toc}

# About

Amazon Web Services is reliable and scalable cloud computing services from Amazon.

# Region

`Region` is a separate geographic location. Each `Region` contains minimum 3 isolated and physically separate `Availability Zones`.
Examples: `us-east-1`, `us-east-2`, `us-west-1`.

# Availability Zone

`Availability Zone` (AZ) is isolated location within region, it is one or more data centers with independent power, cooling and physical security.
`Availability Zone` has redundant high-speed connection between other `Availability Zones` in `Region`.
Examples: `us-east-1a`, `us-east-1b`, `us-east-1c`.

`Availability Zone` states: `available`, `information`, `impaired` (has issues), `unavailable` (can't be used).

# Identity and Access Management

Identity and Access Management (IAM) provides access control across all of AWS.
You can specify who can access which services and resources and under which conditions.

# Virtual Private Cloud

Virtual Private Cloud (VPC) is a logically isolated virtual network. VPC supports IPv4 and IPv6 addressing.
VPC size for IPv4 (in CIDR notation): maximum - `/16` (`65 536` IPs), minimum `/28` (16 IPs).
CIDR block for IPv6 has a fixed prefix: `/56`. IP address size: IPv4 - 32 bit, IPv6 - 128 bit.

Private IPv4 address ranges (RFC 1918):
  - `10.0.0.0/8` (`16 777 216` IPs): `10.0.0.0 - 10.255.255.255`, subnet example - `10.0.0.0/16`.
  - `172.16.0.0/12` (`1 048 576` IPs): `172.16.0.0 - 172.31.255.255`, subnet example - `172.31.0.0/16`.
  - `192.168.0.0/16` (`65 536` IPs): `192.168.0.0 - 192.168.255.255`, subnet example - `192.168.0.0/20` (`192.168.0.0 - 192.168.15.255`).

5 IPs in VPC are `reserved`, for example (for network `10.0.0.0/16`): 10.0.0.0 (network), 10.0.0.1 (router), 10.0.0.2 (DNS),
10.0.0.3 (for future), 10.0.0.255 (broadcast, not supported).

Resources are placed in `Subnets` - segments of the `VPC` (with a nested IP address range).
Each subnet must reside entirely within one `Availability Zone` and cannot span multiple zones.

Subnet types:
  - `Public Subnet`: Has Internet access (via Internet Gateway), instances have public IPs and accessible from Internet.
  - `Private Subnet`: Doesn't have or has Internet access (via NAT Gateway), not accessible from Internet.

Other VPC objects:

  - `Internet Gateway`: VPC connection to the Internet.
  - `NAT Gateway`: Managed Network Address Translation (NAT) service for private subnets, used to access other VPC or Internet.
    To access the Internet, `NAT Gateway` should be placed in a public subnet.
  - `Peering Connection`: Connection between different VPCs (it can be inter-region VPC peering, even in another AWS account).
  - `Virtual Private Gateway`: Endpoint (single VPC only) for a site-to-site virtual private network (VPN).
    Used for connection between two or more networks, such as a corporate network and a corporate network.
  - `VPC Endpoints`: Private connection from VPC to other services in AWS (for example: `S3`). Traffic does not leave the AWS network.
  - `Egress-only Internet Gateway`: Gateway to provide egress only access for IPv6 traffic from the VPC to the Internet (works as a NAT gateway for IPv6 traffic).


## Common VPC scenarios

### VPC with public subnet(s)

Recommended if you want to run public-facing applications (for example: website).

```
                                         +----------+
                                         | Internet |
                                         +----------+
                                              |
                                     +------------------+
                                     | Internet Gateway |
                                     +------------------+
                                              |
+-------------------------------------------------------------------------------------------+
| VPC (10.0.0.0/16)                                                                         |
|                                                                                           |
| +------------------------------------------+ +------------------------------------------+ |
| | Availability zone A                      | | Availability zone B                      | |
| |                                          | |                                          | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| | | Public Subnet (10.0.1.0/24)          | | | | Public Subnet (10.0.2.0/24)          | | |
| | | Route: 0.0.0.0/0 -> Internet Gateway | | | | Route: 0.0.0.0/0 -> Internet Gateway | | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| +------------------------------------------+ +------------------------------------------+ |
+-------------------------------------------------------------------------------------------+
```

### VPC with public and private subnets (with NAT)

Recommended if you want to run public-facing applications (for example: website) and you need other servers,
that are not publicly accessible (for example: databases).
You can also use only one `NAT Gateway` for all private subnets,
but separate `NAT Gateway` for each `Availability Zone` is more reliable solution.

```
                                         +----------+
                                         | Internet |
                                         +----------+
                                              |
                                     +------------------+
                                     | Internet Gateway |
                                     +------------------+
                                              |
+-------------------------------------------------------------------------------------------+
| VPC (10.0.0.0/16)                                                                         |
|                                                                                           |
| +------------------------------------------+ +------------------------------------------+ |
| | Availability zone A                      | | Availability zone B                      | |
| |                                          | |                                          | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| | | Public Subnet (10.0.1.0/24)          | | | | Public Subnet (10.0.2.0/24)          | | |
| | | Route: 0.0.0.0/0 -> Internet Gateway | | | | Route: 0.0.0.0/0 -> Internet Gateway | | |
| | |                                      | | | |                                      | | |
| | |        +-------------------+         | | | |         +-------------------+        | | |
| | |        |   NAT Gateway A   |         | | | |         |   NAT Gateway B   |        | | |
| | |        +-------------------+         | | | |         +-------------------+        | | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| |                    |                     | |                     |                    | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| | | Private Subnet (10.0.10.0/24)        | | | | Private Subnet (10.0.22.0/24)        | | |
| | | Route: 0.0.0.0/0 -> NAT Gateway A    | | | | Route: 0.0.0.0/0 -> NAT Gateway B    | | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| +------------------------------------------+ +------------------------------------------+ |
+-------------------------------------------------------------------------------------------+
```

### VPC with public and private subnets and site-to-site VPN access

Recommended if you want to extend your network into the cloud and VPC needs access the Internet.

```
                              +----------+     +-------------------+
                              | Internet |     | Corporate Network |
                              +----------+     +-------------------+
                                   |                     |
                          +------------------+    +-------------+
                          | Internet Gateway |    | VPN Gateway |
                          +------------------+    +-------------+
                                   |                     |
+-------------------------------------------------------------------------------------------+
| VPC (10.0.0.0/16)                                                                         |
|                                                                                           |
| +------------------------------------------+ +------------------------------------------+ |
| | Availability zone A                      | | Availability zone B                      | |
| |                                          | |                                          | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| | | Public Subnet (10.0.1.0/24)          | | | | Public Subnet (10.0.2.0/24)          | | |
| | | Route: 0.0.0.0/0 -> Internet Gateway | | | | Route: 0.0.0.0/0 -> Internet Gateway | | |
| | |                                      | | | |                                      | | |
| | |        +-------------------+         | | | |         +-------------------+        | | |
| | |        |   NAT Gateway A   |         | | | |         |   NAT Gateway B   |        | | |
| | |        +-------------------+         | | | |         +-------------------+        | | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| |                    |                     | |                     |                    | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| | | Private Subnet (10.0.10.0/24)        | | | | Private Subnet (10.0.22.0/24)        | | |
| | | Route: 0.0.0.0/0 -> NAT Gateway A    | | | | Route: 0.0.0.0/0 -> NAT Gateway B    | | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| +------------------------------------------+ +------------------------------------------+ |
+-------------------------------------------------------------------------------------------+
```

### VPC with private subnet(s) and site-to-site VPN access

Recommended if you want to extend your network into the cloud and VPC doesn't need access the Internet.

```
                                    +-------------------+
                                    | Corporate Network |
                                    +-------------------+
                                              |
                                       +-------------+
                                       | VPN Gateway |
                                       +-------------+
                                              |
+-------------------------------------------------------------------------------------------+
| VPC (10.0.0.0/16)                                                                         |
|                                                                                           |
| +------------------------------------------+ +------------------------------------------+ |
| | Availability zone A                      | | Availability zone B                      | |
| |                                          | |                                          | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| | | Private Subnet (10.0.10.0/24)        | | | | Private Subnet (10.0.22.0/24)        | | |
| | +--------------------------------------+ | | +--------------------------------------+ | |
| +------------------------------------------+ +------------------------------------------+ |
+-------------------------------------------------------------------------------------------+
```
