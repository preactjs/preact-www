---
title: Preact 11
description: 'The wait is finally over: Preact 11 is here!'
date: 2026-09-29
authors:
  - The Preact Team
---

# Preact 11

The wait is finally over: Preact 11 is here!

Preact 11 is an incremental update upon the stability and dependability of Preact X, bringing with it a number of new features like [Hydration 2.0](/guide/v11/upgrade-guide#hydration-20), [automatic ref forwarding](/guide/v11/upgrade-guide#refs-are-forwarded-by-default), and [Object.is equality checks in hook arguments](/guide/v11/upgrade-guide#objectis-for-equality-checks-in-hook-arguments).

The [Road to Preact 11](https://github.com/preactjs/preact/issues/2621) ticket was started over six years ago, and since then, we've managed to stretch and extend the life of Preact X far beyond what we imagined at the time. So many features, refactors, and overall improvements that were thought impossible without breaking changes found a form & home in X. This, however, requireed extensive work to avoid negatively affecting the performance and size of the library for consumers.

This is why we've decided it's finally time to bundle up all the breaking changes that we've been considering over the years and release a new major version of Preact. Preact 11 will allow us to build for the modern web, it will allow us to clean up some features that never quite developed, and it will allow us to better and more efficiently support users going forward.

The [upgrade guide](/guide/v11/upgrade-guide) contains all the information you need to migrate your Preact X applications to Preact 11, including the list of new features and supported browser versions. For most users, this should be a straightforward and quick upgrade, with most changes being type-related as we've done a lot of work to make them stricter and exported from a better location.

All of our first-party packages, like [@preact/signals](https://github.com/preactjs/signals), [preact-render-to-string](https://github.com/preactjs/preact-render-to-string), [preact-iso](https://github.com/preactjs/preact-iso), [prefresh](https://github.com/preactjs/prefresh), and [@preact/preset-vite](https://github.com/preactjs/preset-vite), have supported Preact 11 since we started publishing prereleases months ago, so there's a great chance your dependencies are already Preact 11-compatible.

We want to thank everyone who has contributed to Preact and its ecosystem over the years, without your help, we wouldn't be where we are today. We hope you enjoy and are as excited about Preact 11 as we are!

<span>- The Preact Team</span>
