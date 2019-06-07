# YaCDN Design

## Motivation

Traditional CDNs are great, they make the web fast, reliable and open to all. However, they require massive startup capital and initial customers to buy servers all over the world.

They also consolidate power into the hands of a single, large entity with no direct accountability to users and services.

## Abstract

Yacdn takes strong inspiration from peer-to-peer and cryptoeconomic systems. Through a distributed system of incentivisation, third-parties could host nodes of their own accord and receive income on a per-request basis.

This has two immediate practical advantages.

* Creating an initial network has far less upfront cost
* Greater and more local global coverage than possible through buying up servers

## Design Choices

### Centralised vs. Decentralised

In order for clients to find appropriate nodes, they must poll a form of registry. Are these registries controlled by our centralised team or can anyone run one?

Currently, we are using a distributed-ready solution: every node exposes a `/nodes` endpoint which points to the nearest other nodes to the user. The client can either use `yacdn.org/nodes` or any other.

However, this has knock-on effects for incentivisation: how do we pay nodes if we don't route traffic to them?

### Incentivisation

How do we get people to run nodes?

* Pay nodes per-gigabyte of traffic
* Pay nodes per-request of traffic

In a centralised system, we could implement anti-spam measures then pay nodes however a distributed system becomes significantly more complex.

### Client Implementation

Do we issue small code libraries or do we publish a specification and expect services to implement accordingly?

## Use Cases

### Video Streaming Service

A service akin to Netflix or Spotify could implement a solution using Yacdn where each client would lookup from a registry, then stream from a caching node in their local area.
