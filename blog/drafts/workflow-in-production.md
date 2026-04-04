---
title: "Workflow in Production: 100M Runs Later"
date: 2026-04-04
draft: true
tags: [workflow, engineering, vercel, durable-execution]
---

Six months ago we launched the [Workflow SDK](https://useworkflow.dev) and the internet had opinions. The `"use workflow"` directive — a string at the top of a function that turns it into a durable, resumable workflow — was called everything from "brilliant" to "dangerous vendor lock-in." Tanner Linsley wrote a [whole post](https://tanstack.com/blog/directives-and-the-platform-boundary) about it. Twitter did its thing.

We wrote about our reasoning at the time. If you want the deep technical explanation of why directives, it's in the docs: [Understanding Directives](https://useworkflow.dev/docs/how-it-works/understanding-directives). I'm not going to relitigate that here.

What I want to talk about is what happened next. We've now processed **100 million production runs** and **500 million steps**. We're going GA. And I think the decisions we made — including the controversial ones — are holding up. Some of them in ways we expected. Some in ways we didn't.

---

## The Compiler Bet

The criticism that got the most traction was about the compiler. Workflow uses an SWC plugin that transforms your code at build time. `"use workflow"` isn't a runtime check — it's an instruction to the compiler to rewrite your function into a durable state machine. Every `await` becomes a checkpoint. If the process dies, it resumes from the last completed step.

People saw this and thought: *magic*. And magic in production scares people. Fair.

But here's what we didn't fully explain at launch: the compiler wasn't a cute DX trick. It was the entire point.

### It started with Temporal

A year before we built Workflow, I was obsessed with [Temporal](https://temporal.io/). What Temporal got right — and what I think is genuinely profound — is the realization that **JavaScript itself is already the best representation of a DAG**. You don't need Airflow. You don't need Step Functions. You don't need a graph DSL or a JSON blob. `if` statements are conditionals. `for` loops are iteration. `try/catch` is error handling. `async/await` is sequencing.

The language already has everything you need to express a workflow. Temporal figured this out: constrain the execution to a deterministic VM, and plain JavaScript becomes a serializable, replayable workflow definition.

I loved that idea. What I didn't love was the weight of it. Getting a Temporal cluster running, configuring workers, managing the infrastructure — the gap between the beautiful abstraction and the actual DX was enormous. The *dream* of Temporal was "just write JavaScript." The *reality* was a significant ops burden before you could write your first workflow.

### Why not explicit APIs?

The natural question is: why not do what Inngest or Hatchet do? Explicit SDKs, explicit step functions, explicit APIs. No compiler magic.

The problem is subtle but fundamental: **it's still a DSL**. You're still teaching someone a new SDK. You're still asking them to think in terms of `step.run()` and `step.sleep()` instead of just... writing JavaScript. There's still a learning curve. You can't just take everything you know about async/await and apply it directly.

We wanted functions to just *be* workflows. Not "workflow-flavored functions" — actual JavaScript functions where `async/await` and promises give you everything you need. The compiler is what makes this possible. It takes code written in the ideal way and compiles it to work the way we need it to.

### What the compiler unlocks

Beyond the DX, there's a deeper reason we went this route. By constraining the runtime to a deterministic JavaScript VM that we control, we unlocked an entire design space that isn't available to systems built on explicit APIs.

Replay-to-resume (loading cached step results and skipping completed work) is the naive-but-production-ready implementation. It's what event sourcing has proven and what Temporal has proven. But it's the floor, not the ceiling.

There's a lot we've already designed — and are actively building for v5 and v6 — that's only possible because we have a compiler and a constrained runtime. Optimizations to scheduling, checkpointing, and execution that simply can't be done if the system only sees your code at runtime. We locked in the DX first. Now we can make massive improvements to the engine without changing how you write code.

I'm not ready to share the details yet, but this was always the plan. The compiler isn't overhead — it's the foundation.

### The NPM ecosystem bet

Here's the thing I'm most excited about that almost nobody is talking about.

We took inspiration from React. In React, you can ship JSX components as NPM packages. Design systems, UI primitives, complex widgets — they're just packages you install and use. They work in any React codebase. That's a powerful ecosystem pattern.

We had the same idea for Workflow. What if people could write durable steps, hooks, even entire sub-workflows and ship them as NPM packages? Install a package, use its functions, and if you're running inside a workflow, you automatically get durability and suspension. If you're *not* in a workflow context, they work as regular functions. You'd never know they were designed for workflows.

This is already happening. [Mux AI](https://mux.com) and [Worldcoin](https://worldcoin.org) are shipping packages that work exactly this way. Anyone can install them and use them — they're just directives. They compose into any workflow.

Compare this to the alternative. If you ship a package for Temporal, it only works for Temporal users. A package for Inngest only works for Inngest users. You've created a walled garden. With directives, you ship JavaScript that works everywhere and *happens* to be durable when used in the right context.

This is the long game. If the ecosystem grows — if people ship reusable workflow primitives as NPM packages the way they ship React components today — that's what proves Workflow's bet was right. We're just starting to see the first packages. But I think this is where the real compounding happens.

---

## What Held Up

Beyond the compiler, here's what we got right.

**The "just JavaScript" philosophy.** Workflow code looks like regular async functions because it *is* regular async functions. New engineers on teams using Workflow don't need to learn a new paradigm. They write JavaScript. The senior engineers on the team configured the workflow compiler once, and now everyone benefits from durability without thinking about it.

**Pull-based execution.** Workers pull tasks as they have capacity. No coordinator, no push mechanism, no HTTP callbacks. This makes Workflow trivially self-hostable and means you don't need to think about load management at the infrastructure level.

**Progressive adoption.** You can add `"use workflow"` to one function in your codebase and leave everything else alone. There's no all-or-nothing migration. This turned out to be critical for adoption — teams add it where they need durability and ignore it everywhere else.

---

## What We Got Wrong

### The launch communication

We shipped a powerful idea without enough context. The `"use workflow"` directive *looks* like it could be a language feature, and we didn't do enough to explain upfront that it's a compiler directive — powerful, intentional, but not part of the JavaScript spec. The backlash was partly a communication failure.

If I could redo the launch, I'd lead with the [Understanding Directives](https://useworkflow.dev/docs/how-it-works/understanding-directives) doc, not the marketing page. Engineers want to understand *how* before they trust *what*.

### [TODO: Pranay — what other mistakes/reflections do you want to include? Some options:]
- Error messages when things go wrong in the compiler transform
- Debugging experience for replayed steps
- Specific production incidents or edge cases
- Things that surprised you at scale
- Features you shipped too early or too late

---

## 100M Runs

We're going GA. The system has processed 100 million production runs and 500 million steps. It's powering AI agents, background jobs, multi-day processes, and things we didn't anticipate when we designed it.

The compiler bet is paying off. The ecosystem bet is just getting started. And the best stuff — the things the compiler makes possible that nothing else can — is still coming.

If you tried Workflow at launch and bounced off the controversy, I'd encourage you to look again. The same engineering decisions that felt risky six months ago are the ones enabling things that aren't possible any other way.

[Get started →](https://useworkflow.dev/docs/getting-started)

---

*I'm Pranay Prakash. I built Workflow at Vercel. If you have questions or want to argue about compilers, I'm [@pranaygp](https://x.com/pranaygp) on X.*
