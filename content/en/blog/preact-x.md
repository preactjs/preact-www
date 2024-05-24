---
title: Preact X, a story of stability
date: 2024-05-24
authors:
  - Jovi De Croock
---

# Preact X, a story of stability

A lot of you have been waiting for [the infamous Preact 11](https://github.com/preactjs/preact/issues/2621), an issue started
back in July 2020, and for clarity I have been as well. When we started on Preact 11 we believed that there was
no way to introduce the things we were looking for in Preact X...

- Using a backing VNode structure to reduce GC, by doing this we'd only use the result of `h()` to update our backing-node.
- Reconciler performance, adding fast routes for mounting/...
- Some breaking changes like removing `px` suffixing and `forwardRef`
- Addressing event/child-diffing bugs

The above were our goals, when breaking these down we can clearly see that there's a distinction here, only point 3 would
be a breaking change for our consumers while point 1 would have a huge impact to folks building extensions like Preact Signals,
Preact devtools, ...

As we were exploring Preact 11 we experimented with a new type of diffing, branded [skew based diffing](https://github.com/preactjs/preact/pull/3388),
this landed in Preact 11 and we saw real performance improvements as well as this fixing a bunch of long-running bugs. As time went on
and we invested more time in Preact 11 we started noticing that the improvements we were landing wreen't exclusive to Preact 11...

## Releases

Since our Preact 11 announceement there have been 18 (!!) minor versions of Preact, a lot of these have been largely inspired by the work
that we have been doing on Preact X. Let's go over a few of these

### 10.5.0

The introduction of [resumed hydration](https://github.com/preactjs/preact/pull/2754) this functionality basically allows suspending during
the re-hydration of your component tree. This means that for instance in the following component tree we'll re-hydrate and make the `Header`
interactive while the `LazyArticleHeader` suspends, in the meanwhile the server-rendered DOM will stay on screeen. When the lazy-load finishes
we'll continue re-hdyrating, our `Header` and `LazyArticleHeader` can be interacted with while our `LazyContents` resolve. This is a pretty
powereful feature to make your most important stuff interactive while not overloading the bundle-size/download-size of your initial bundle.

```jsx
const App = () => {
  return (
    <>
      <Header>
      <main>
        <Suspense>
          <LazyArticleHeader />
          <Suspense>
            <article>
              <LazyContents />
            </article>
          </Suspense>
        </Suspense>
      </main>
    </>
  )
}
```

### 10.8.0

In 10.8.0 we introduced [state settling](https://github.com/preactjs/preact/pull/3553), this would ensure that if a component updates hook-state
during render that we'd pick this up, cancel prior effects and render on. We'd ofcourse have to ensure that this didn't loop but this feature
reduces the amount of renders are queued up because of in-render state invocations, this feature also increased our compatability with the
React ecosystem as a lot of libraries relied on effects not being called multiple times due to in-render state updates.

### 10.11.0

After a lot of research we found a way to introduce [useId](https://github.com/preactjs/preact/pull/3583) into Preact, this required at on of research
of how we could go about adding unique values for a given tree-structure. One of our maintainers wrote about
[our research at the time](https://www.jovidecroock.com/blog/preact-use-id) and we've iterated on it ever since trying to make it as collission free as possible...

### 10.15.0

We found that a pass through re-render resulting in multiple new components re-rendering could result in our `rerenderQueue` being out of order, this could
result in our (context) updates propagating to components that would afterwards render _again_ with stale values, you can check out
[the commit message](https://github.com/preactjs/preact/commit/672782adbf9ccefa7a4d7c175f0adf8580f73c92) for a really detailed explanation! Doing so both
batches these updates up as well as increased our alignment for React libraries.

### 10.16.0

In our research for v11 we went deep on child-diffing as we were aware that there were a few cases where our current algorithm would fail, just listing a few

- [https://github.com/preactjs/preact/issues/3973](removing an element before another would cause re-insertion)
- [https://github.com/preactjs/preact/issues/2622](re-insertiosn when removing more than 1 child)
- [https://github.com/preactjs/preact/issues/2783](unnecessary unmounting of keyed nodes)

Not all of these resulted in a bad state, some just meant decreased performance... When we found out that we could port skew-based diffing to Preact X we
were thrilled, not only would we fix a lot of cases we could see how this algorithm behaves in the wild! Which in retrospect, it did great, at times I would
have wished we had good testbeds to run these on first rather than our community having to report issues. I do want to use this opportunity to thank you all
for helping us out by always filing considerate issues with reproductions, you all are the absolute best!

### 10.19.0

In 10.19.0 Marvin applied his research from [fresh](https://fresh.deno.dev/) to add [pre-compiled JSX functions](https://github.com/preactjs/preact/pull/4177),
this basically allows you to pre-compile your components during transpilation, when render-to-string is running we just have to concatenate the strings rather
than allocating memory for the whole VNode tree. The transform for this is exclusive to Deno at the moment but the general concept is present in Preact!

### 10.20.2

We have faced a number of issues where an event could bubble up to a newly inserted VNode which would result in undesired behaviour, this was fixed
[by adding an event-clock](https://github.com/preactjs/preact/pull/4322). In the following scenario, you would click the button which sets state, the browser
interleaves event bubbling with micro-ticks, which is also what Preact uses to schedule updates. This combination means that Preact will update the UI, meaning
that the `<div>` will get that `onClick` handler which we'll bubble up to and invoke the `click` again toggling this state immediately off again.

```jsx
const App = () => {
  const [toggled, setToggled] = useState(false);

  return toggled ? <div onClick={() => setToggled(false)}><span>clear</span></div> : <div><button onClick={() => setToggled(true)}>toggle on</button></div>
}
```

## Stability

The above are some cherry-picked releases of things that our community received _without_ breaking changes, but there is so much more... Adding a new major
version always leaves a part of the community behind and we don't want to do that. Stability is great, we as the Preact team love stability. That being said
during this whole adventure of releases we actually released so much more...

- [Signals](https://github.com/preactjs/signals)
- [Async rendering](https://github.com/preactjs/preact-render-to-string/pull/333)
- [Streaming rendering](https://github.com/preactjs/preact-render-to-string/pull/354)
- [Prefresh](https://github.com/preactjs/prefresh)

We value our ecoystem and we value the extensions being built through our `options API`.

This doesn't mean that Preact 11 won't happen but it might not be the thing that we initially promised, instead we might just drop IE11 support and give you
those performance improvments, all while giving you the stability of Preact X. We could work on more ecosystem projects, meta-frameworks, ... however we'd love
for y'all to express your opinion, what does preact need according to you?

We aren't gone, we are here to listen to you and we want to grow this community together, I'm sorry it's been this long since you heard from us and we'll do
our very best to improve... Feel free to remind us, but keep in mind that we are only a few people serving a lot.
