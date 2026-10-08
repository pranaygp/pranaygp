---
title: "Serverless Docker Beta"
date: 2018-08-14
draft: false
tags: [zeit, now, docker, serverless]
repost_of:
  name: "ZEIT blog"
  url: "https://web.archive.org/web/20181206000255/https://zeit.co/blog/serverless-docker"
  coauthors: ["Guillermo Rauch", "Naoyuki Kanezawa", "Nathan Rajlich"]
kudos: 0
---

The focus of our [ZEIT Day Keynote](https://www.youtube.com/watch?v=yqACl3tRHNI) this year was on the new capabilities of the Now cloud platform. In particular, we emphasized our focus on **Serverless Docker Deployments**.

Today, we are announcing their availability as a public beta, which features:

- A **10x-20x improvement in cold boot performance**, based on data from 1.5M+ deployments
  - This translates into a **sub-second** cold boot (full round trip) for most workloads
- A new **`slot`** configuration property which defines the resource allocation in terms of CPU and Memory, defaulting to `c.125-m512` (.125 of a vCPU and 512MB of memory)
  - This enables **fitting your application** into the most appropriate set of constraints, paving the road to special CPU features, GPU cores, etc.
- Strictly specified tunable **limits**
  - **Maximum execution time** (defaulting to **5 minutes**, with a maximum of **15 minutes**)
  - A **shutdown timeout** after the last request (defaulting to **1 minute**, max **15**)
  - **Maximum request concurrency** before **automatically scaling** (defaulting to **10**)
- Support for **HTTP/2.0 and WebSocket** connections to the deployments
  - No need to rewrite your applications as _functions_, but you can still do that
- **Automatic port discovery**. We no longer rely on the `EXPOSE` instruction. We automatically forward traffic to the port of the process started by `CMD`

Read on to learn how it works or head directly to our [examples](https://github.com/vercel/now-examples).

## Walkthrough

### Serverless Node.js Functions

Let's deploy a simple function exposed as an HTTP service using `micro`:

_▶ Demo video (not preserved in the archive): a simple function accessible via `node-function.now.sh`, built with `npm ci`._

Here is what happened:

- A deployment is created, diffing our local file system with the cloud
- A simple `Dockerfile` is used to hold the **instructions to build the project**
- We build with **our own preference** of Node.js version (`10`) and package manager (`npm ci`)
- The `index.js` file contains **our main function**
- The serverless container is limited to **just .125 CPUs and 512MB of memory**
- DNS lookup + TLS handshake + Cold Boot + Full roundtrip happens in **600ms~**
- Once the deployment instance is warm, subsequent requests take **100ms~**

The only requirement to make this work is for your `now.json` to activate the beta via a feature flag:

```json title="now.json"
{
  "type": "docker",
  "features": {
    "cloud": "v2"
  }
}
```

### Serverless Go + Websockets

Let's go a bit deeper into the power of this technology. The next example will take an image _right from the Docker registry_, of a program written in [Go](https://go.dev).

_▶ Demo video (not preserved in the archive): a serverless shell, powered by HTTP/2.0 and WebSockets, available at `terminal.now.sh`._

This demo highlights:

- The usage of an unmodified `Dockerfile` from the **public Docker registry**
- A different programming language and runtime: **Go**
- **Transient statefulness**, as evidenced by our ability to inspect the filesystem
  - After 5 minutes (the default duration), the state will recycle
- **Sub-500ms cold roundtrip**. Go exhibits better startup performance, even though this is a larger application (usually 400ms-500ms for this example)
- The service responds to HTTP requests to serve the initial HTML and then a **WebSocket connection** to exchange the PTY data

### Serverless Rust (Global)

This infrastructure works remarkably well in combination with [Global Now](https://web.archive.org/web/20190218021402/https://zeit.co/blog/multi-dc). In other words, it takes **one flag to deploy serverlessly to all our global locations**.

Here is an example of deploying Rust + [Hyper](https://hyper.rs):

_▶ Demo video (not preserved in the archive): a Rust microservice instantly available in every region at `rust-http-microservice-v2.now.sh`._

This is equivalent to the rest of the examples, but we scaled right from the get-go to _all regions_ by running `now --regions all`.

It's also possible to scale _after you have already deployed_, by running:

```sh
// scale to sfo
now scale rust-http-microservice-v2.now.sh sfo

// scale to all regions
now scale rust-http-microservice-v2.now.sh all

// disable everywhere
now scale rust-http-microservice-v2.now.sh 0
```

### Automatic Horizontal Scalability

To underline the ability of this system to automatically scale with the parameters you define, within the boundaries that you define, here is an example that stress tests with `wrk`, a load-testing tool:

_▶ Demo video (not preserved in the archive): instant and predictable horizontal scalability._

This is, in our opinion, the most important defining characteristic of **Serverless Deployments**. However, it's not the only one, as we will see next.

## Principles of Serverless Computing

We selected these demos in particular to underline a very important point. We think Serverless can be a very general computing model. **One that does not require new protocols, new APIs and can support every programming language and framework without large rewrites**.

Here are three of the underlying ideas behind this new architecture.

### 1. Focus on Code, Not Infrastructure

Serverless enables engineers to focus on code rather than managing servers, VMs, registries, clusters, load balancers, availability zones, and so on.

This, in turn, allows you to define your engineering workflow solely around **source control** and its associated tools (like pull requests). [Our recent GitHub integration](https://web.archive.org/web/20181010154619/https://zeit.co/github), therefore, makes it possible to deploy a Docker container in the cloud solely by creating a `Dockerfile`.

It is not sufficient to _ignore that the infrastructure is there_, or forget about it. The **execution model** must make it so that manual intervention, inspection, replication, and monitoring or alert-based uptime assurance is completely unnecessary, which takes us to our next two points.

#### What Are the Benefits?

When we deployed the examples above, we didn't have to deal with:

- Clusters or federations of clusters
- Build nodes or build farms
- Container registries and authentication
- Container image storage, garbage collection and distributed caching

### 2. Deployments Should Self-Heal

A very common category of failure of software applications is associated with failures that occur after programs get into states that the developers didn't anticipate, usually arising after many _cycles_.

In other words, programs can fail unexpectedly from accumulating state over a long lifespan of operation. Perhaps the most common example of this is a memory leak: the unanticipated growth of irreclaimable memory that ultimately concludes in a faulty application.

> Serverless means never having to "try turning it off and back on again"

Serverless models completely remove this category of issues, ensuring that no request goes unserviced during the recycling, upgrading or scaling of an application, even when it encounters runtime errors.

#### How Does Now Ensure This?

Your deployment instances are constantly **recycling and rotating**. Because of the request-driven nature of scheduling execution, combined with **limits** such as maximum execution length, you avoid many common operational errors completely.

### 3. Deployments Should Automatically and Predictably Scale

Perhaps the most important or appealing aspect of the serverless paradigm is the promise of _automatic scalability_.

In its most basic form, a function automatically scales with a 1:1 mapping of requests to resource allocations. A request comes in, a new function is provisioned or an existing one is re-used.

We have taken this a step further, by allowing you to customize the concurrency your process can handle.

## Technical Details

This new infrastructure is already available to Docker deployments made in the free tier, or for paying subscriptions that opt-into the feature via `now.json`:

```json title="now.json"
{
  "type": "docker",
  "features": {
    "cloud": "v2"
  }
}
```

Please ensure that your Now CLI is up to date, or deploy directly via our [GitHub integration](https://web.archive.org/web/20181010154619/https://zeit.co/github) or API.

### Limits

#### Hard Limits

These limits are fixed. They are subject to change once the feature goes into General Availability.

- A maximum of `3` concurrent deployment instances for OSS
- A maximum of `10` concurrent deployment instances per subscription
- A maximum of `500` concurrent requests/connections across deployments per subscription

#### Soft Limits

These limits are configurable in `now.json` as part of a `limits` object.

- `maxConcurrentReqs` max concurrency of each process (min `1`, max `1024`, default `10`)
- `duration` max amount of time in **ms** your process can run (min/default 5 minutes, max 15 minutes)
- `timeout` how long in _ms_ to wait after the last request to downscale (min/default 1 minute, max 15 minutes)

### Pricing

While in beta, we require a paid subscription to be able to go over the maximum of `3` concurrent deployment instances. Current rates apply and are subject to change.

## Next up: Faster, More Capable, Smaller

### Faster Cold Start

Despite having so dramatically sped up instantiation times, we still have very significant room for improvement.

We are excited about unveiling some of these over the coming weeks before the new infrastructure goes into General Availability.

### Additional `slot` Configurations

We will introduce new `slot` identifiers so that you can fit your applications into other CPU/memory combinations.

This is important for resource-intensive applications.

### Smaller Images

When your code is built, we post-process the resulting snapshot and let you know what the total size is.

We are confident that in its present form, our system can fit the vast majority of our customers' workloads without any issues.

However, we are currently developing improvements to optimize this dimension further, without you having to make any changes.

## Conclusions

This beta contains the lessons and the experiences of a massively distributed and diverse user base, that has completed millions of deployments, over the past two years.

To get started, we suggest you take a look at the comprehensive [list of examples](https://github.com/vercel/now-examples) we put together for this release.

Over the coming weeks, we will share more in-depth articles and documentation about our new offering.

Your feedback is crucial during this period. Please let us know how well it works for you.
