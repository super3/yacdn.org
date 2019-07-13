# YaCDN Design Doc

## Motivation

Traditional CDNs are great, they have made the web faster and more reliable under accelerating and massive demand for web services. However sometimes [these traditional centralized CDNs fail](https://www.zdnet.com/article/cloudflare-stutters-and-the-internet-stumbles/) talking half of the internet with them. They also consolidate power into the hands of a few large entities with no direct accountability to users. As user privacy and security is becoming a larger concern to users, traditional CDNs are not ideal.

We belive that a distributed and decentralized CDN solution can solve these issues, in addition to innovations that would make it it a better choice than a traditional CDN. Due to its archetecture it can be made cheaper, faster, more secure, and more private than a centralized counterpart.
 
## Abstract

YaCDN, Yet Another CDN, takes strong inspiration from peer-to-peer and cryptoeconomic systems. Through a distributed system of incentivisation, third-parties could host nodes of their own accord and receive income on a per-request basis.

This has many immediate practical advantages:

* Creating and maintaing the network has far less cost, expecially if using existing excess bandwidth/hardware
* Greater and more global coverage than possible through buying up servers
* Because it can be deployed anywhere, it can achive much better latency than any other solution at scale
* Not controlled by a single entity, archtecture, network, or hardware so the failures will have limited impact
* Market based economy, the network can quickly grow and shrink based on demand. Deploying new infrastructure takes minutes, not months.
* Near unlimited throughput by adding as many nodes as needed

## Design Choices

### Nodes

In YaCDN anyone can run an endpoint node, which can cache content from the original website and serve it to users when requested. In order for clients to find appropriate endpoint nodes, they must poll a form of registry. Every node exposes a `/nodes` endpoint which points to the nearest other nodes to the user. The client can either use `yacdn.org/nodes` or any other to find the best node for them to use.

### Incentivisation

Why would someone run an endpoint node? YaCDN pays nodes for per-gigabyte of traffic and per-request. We plan to release an automated system whereby nodes are routed traffic and paid for their services via a master node. In future, this sytem will route and pay for traffic without the need for a master node, or where the master node can be untrused. 

### Client Implementation

We currently have an HTTP interface for static files, and plan on publishing a simple javascript micro library for use in websites and other projects.

## Use Cases

* **Application/Firmware Updates** - Application or firmware updates to thousands or millions of devices. If the updates do not need to be pushed immediately, YaCDN can be used a low cost solution. If a high prority security update is needed YaCDN can distribute the update faster than any traditional CDN due to its distributed nature. 

* **Video Streaming Service** - A service akin to Netflix or Spotify could implement a solution using YaCDN where each client would lookup from a registry, then stream from a caching node in their local area.

* **Hyper Local CDN** - When latency is important, YaCDN has a unique advantage over traditional CDNs. Because YaCDN nodes can be run anywhere, content/data could be served from the building next door rather than a data center 3 states away.

* **Underserved CDN** - Traditional CDNs have real costs to build out capacity to serve customers in a particular region. While a particular region might have use for CDN, a smaller market might not warrent the inital investment. Because YaCDN can run on any hardware at any scale, it can be deployed to underserved regions with minimal effort and cost.
