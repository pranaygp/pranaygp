---
title: "6x Faster Now Uploads with HTTP/2"
date: 2017-11-06
draft: false
tags: [zeit, now, http2, open-source, performance]
repost_of:
  name: "ZEIT blog"
  url: "https://web.archive.org/web/20171206161230/https://zeit.co/blog/http2-uploads"
kudos: 0
---

I found myself discussing priorities for making my first open source contributions to the [Now CLI](https://github.com/vercel/vercel) with [@rauchg](https://twitter.com/rauchg). After bouncing some ideas around, we decided to take a look at optimizing the deployment pipeline.

In this blog post I'll narrate the process behind my two pull requests that resulted in a **6 times faster** upload step for all deployments of [Now](https://web.archive.org/web/2017/https://zeit.co/now) users on the [canary channel](https://web.archive.org/web/2017/https://zeit.co/blog/canary)!

### First Steps

I started by reading the GitHub repository for the `now` CLI program ([now-cli](https://github.com/vercel/vercel)) to better understand how the internals worked. I learned the deployment pipeline broadly consists of 3 steps:

1. Deployment files enumeration
2. File synchronization
3. Deployment creation

The first one involves recursively finding all files in a directory, excluding some of them and then computing hashes for every file. This way, Now only uploads _new_ ones to the server.

When the list of files is passed to the next step, `now-cli` collects all the hashes that are **unique**. This is important because large repositories can contain many duplicate files.

I then measured how long these independent steps took. I found out that by substituting the usage of [array-unique](https://github.com/jonschlinkert/array-unique) with a better datastructure would be a nice initial improvement.

That led to my [first PR](https://github.com/vercel/vercel/pull/933), the results of which are shown below.

| Medium project (fresh upload) | Time    |
| ----------------------------- | ------: |
| Old deduping                  | 2.578ms |
| New deduping                  | 0.614ms |

<p class="code-caption">A nice 76% speed up, but even larger wins lay ahead.</p>

### Enter HTTP/2

My next goal was to try and optimize the second phase: synchronizing files to the server. For a new project, or when someone migrates an existing project to Now, this can take quite some time as we need to upload hundreds or thousands of files to the server.

There are two key points about this part of the pipeline:

1. The process is highly parallelizable, as uploads can happen in any order
2. The main goal is to saturate the available bandwidth, minimize bandwidth overhead (like redundant HTTP headers) and minimize roundtrips

The Now CLI was sending these requests over HTTP/1, batching multiple requests together. This made it work well, but our problem description fits perfectly what [HTTP/2 set out to improve](https://en.wikipedia.org/wiki/HTTP/2#Goals)!

HTTP/2 brings a lot of new features and improvements. [Server push](https://en.wikipedia.org/wiki/HTTP/2_Server_Push) is often talked about as the big win for browsers. Something easy to forget, however, is that HTTP/2 has massive wins when making multiple requests to the same server. How? Simple: HTTP/2 favors a single socket open to a server, allowing multiple non-blocking requests to occur over the same channel.

I ascertained that **`api.zeit.co` supported HTTP/2** (as do all Now deployments!), and then started researching [the new `http2`](https://web.archive.org/web/2017/https://zeit.co/blog/node-8-9) module in Node.js. Given that the Now codebase made extensive use of the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with [node-fetch](https://github.com/bitinn/node-fetch), I thought substituting it with [fetch-h2](https://github.com/grantila/fetch-h2) seemed like a reasonable solution to quickly add HTTP/2 support.

I figured I'd give this a [shot](https://github.com/vercel/vercel/pull/953). In essence, the idea boiled down to still make one `POST` request per file, but reduce the overhead by just re-using the same socket for all requests. This seemed to make things **a lot faster!** To find out precisely just how fast, I ran some experiments.

### Experiments

I setup a script that generated 2KB files, each just being a random collection of words from the english dictionary (to best resemble source code and account for compression). I then tried deploying test projects containing 100, 500 and 1000 such files to resemble an array of project sizes. The results?

| Project               | HTTP/1.1 | HTTP/2  |
| --------------------- | -------: | ------: |
| Small (100 files)     |   9819ms |  3067ms |
| Medium (500 files)    |  48156ms |  7807ms |
| Large (1000 files)    |  84481ms | 14382ms |

<p class="code-caption">Real-world projects, like ZEIT's Next.js Web UI, are 6 times faster to upload.</p>

I found **massive** speed ups with large projects (and significant ones even at smaller projects). A **6x speedup** meant the difference between grabbing a snack after running `now` and liking a [tweet](https://twitter.com/zeithq/status/911515424227053568) instead.

### Ready Today

Using HTTP/2 has already been enabled on our [canary release channel](https://web.archive.org/web/2017/https://zeit.co/blog/canary). Since we use [PKG](https://github.com/vercel/pkg) and distribute `now` as a binary, we don't have to worry about users upgrading to the latest Node 9.0.0. You can forget about that `--expose-http2` flag!

```bash
npm i -g now@canary
```

As [`http2`](https://nodejs.org/api/http2.html) in Node.js is still experimental, some issues could occur. So far we have encountered none! If you find any, please let us know.

### Conclusions

I've always enjoyed making open source contributions, and being able to work with [@rauchg](https://twitter.com/rauchg) and [@leo](https://twitter.com/notquiteleo) and contribute to Now was a fantastic experience, and I know I've helped hundreds of thousands of developers save time. Working with the team at ▲ZEIT was very smooth, and my two pull requests got reviewed and merged quickly:

- [#933: Faster array-unique implementation](https://github.com/vercel/vercel/pull/933)
- [#953: Added support for HTTP/2](https://github.com/vercel/vercel/pull/953)

I also want to thank [Gustaf Räntilä](https://twitter.com/grantila) for his excellent work on [fetch-h2](https://github.com/grantila/fetch-h2), which made working with the low-level `http2` module a breeze!

If you're interested in helping out with Now CLI, or simply want to take a shot at contributing to an [open source project](https://web.archive.org/web/2017/https://zeit.co/oss), check out the outstanding [issues](https://github.com/vercel/vercel/issues) and try giving one of them a shot!
