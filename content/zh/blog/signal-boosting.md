---
title: Signal(信号)性能提升
date: 2022-09-24
authors:
  - Joachim Viide
translation_by:
  - zhi zheng
---

# Signal 性能提升

Preact Signals 的新版本为响应式系统的基础带来了显著的性能更新。继续阅读，了解我们采用了哪些技巧来实现这一目标。

我们最近[宣布](https://twitter.com/jviide/status/1572570215350964224)了 Preact Signals 包的新版本：

* [@preact/signals-core](https://www.npmjs.com/package/@preact/signals-core) 1.2.0 用于共享核心功能
* [@preact/signals](https://www.npmjs.com/package/@preact/signals) 1.1.0 用于 Preact 绑定
* [@preact/signals-react](https://www.npmjs.com/package/@preact/signals-react) 1.1.0 用于 React 绑定

这篇文章将概述我们为优化 **@preact/signals-core** 所采取的步骤。它是作为框架特定绑定的基础包，但也可以独立使用。

Signals 是 Preact 团队对响应式编程的实现。如果你想要对 Signals 有一个温和的介绍，了解它们是什么以及如何与 Preact 结合使用，[Signals 发布博文](/blog/introducing-signals)已经为你准备好了。如需深入了解，请查看[官方文档](/guide/v10/signals)。

应该指出的是，这些概念并非由我们发明。响应式编程有相当长的历史，并已在 JavaScript 世界中被 [Vue.js](https://vuejs.org/)、[Svelte](https://svelte.dev/)、[SolidJS](https://www.solidjs.com/)、[RxJS](https://rxjs.dev/) 和太多其他框架广泛普及。向他们所有人致敬！

## Signals 核心的快速导览

让我们从 **@preact/signals-core** 包中的基本功能概述开始。

下面的代码片段使用从该包导入的函数。仅在引入新函数时才显示导入语句。

### Signals

普通的 _signals_ 是我们响应式系统基于的基本根值。其他库可能称它们为"可观察对象"（[MobX](https://mobx.js.org/observable-state.html)、[RxJS](https://rxjs.dev/guide/observable)）或"引用"（[Vue](https://vuejs.org/guide/extras/reactivity-in-depth.html#how-reactivity-works-in-vue)）。Preact 团队采用了 [SolidJS](https://www.solidjs.com/tutorial/introduction_signals) 使用的术语"signal"。

Signals 表示包装在响应式外壳中的任意 JavaScript 值。你为 signal 提供一个初始值，然后可以在后续过程中读取和更新它。

```js
// --repl
import { signal } from "@preact/signals-core";

const s = signal(0);
console.log(s.value); // 控制台: 0

s.value = 1;
console.log(s.value); // 控制台: 1
```

单独使用 signals 并不是特别有趣，直到它们与另外两个原语Computed signals 和 Effects结合使用时才变得有趣。

### 计算信号

Computed signals使用compute functions从其他信号派生新值。

```js
// --repl
import { signal, computed } from "@preact/signals-core";

const s1 = signal("Hello");
const s2 = signal("World");

const c = computed(() => {
  return s1.value + " " + s2.value;
});
```

传递给 `computed(...)` 的计算函数不会立即运行。这是因为计算信号是 _惰性_(lazily) 计算的，即只有在读取它们的值时才会计算。

```js
// --repl
import { signal, computed } from "@preact/signals-core";

const s1 = signal("Hello");
const s2 = signal("World");

const c = computed(() => {
  return s1.value + " " + s2.value;
});
// --repl-before
console.log(c.value); // 控制台: Hello World
```

计算值也会被 _缓存_。它们的计算函数可能会非常昂贵，所以我们只想在必要时重新运行它们。运行中的计算函数会跟踪在其运行期间实际读取的信号值。如果没有值发生变化，那么我们可以跳过重新计算。在上面的例子中，只要 `a.value` 和 `b.value` 都保持不变，我们就可以无限期地重复使用之前计算的 `c.value`。促进这种 _依赖跟踪_(dependency tracking) 是我们首先需要将原始值包装到信号中的原因。

```js
// --repl
import { signal, computed } from "@preact/signals-core";

const s1 = signal("Hello");
const s2 = signal("World");

const c = computed(() => {
  return s1.value + " " + s2.value;
});

console.log(c.value); // 控制台: Hello World
// --repl-before
// s1 和 s2 没有变化，这里不会重新计算
console.log(c.value); // 控制台: Hello World

s2.value = "darkness my old friend";

// s2 已经改变，所以计算函数会再次运行
console.log(c.value); // 控制台: Hello darkness my old friend
```

事实上，计算信号本身就是信号。计算信号可以依赖于其他计算信号。

```js
// --repl
import { signal, computed } from "@preact/signals-core";
// --repl-before
const count = signal(1);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);

console.log(quadruple.value); // 控制台: 4
count.value = 20;
console.log(quadruple.value); // 控制台: 80
```

依赖项集合不必保持静态。计算信号将只对最新依赖项集中的变化做出反应。

```js
// --repl
import { signal, computed } from "@preact/signals-core";
// --repl-before
const choice = signal(true);
const funk = signal("Uptown");
const purple = signal("Haze");

const c = computed(() => {
  if (choice.value) {
    console.log(funk.value, "Funk");
  } else {
    console.log("Purple", purple.value);
  }
});
c.value;               // 控制台: Uptown Funk

purple.value = "Rain"; // purple 不是依赖项，所以
c.value;               // 效果不会运行

choice.value = false;
c.value;               // 控制台: Purple Rain

funk.value = "Da";     // funk 不再是依赖项，所以
c.value;               // 效果不会运行
```

这三个特性 - 依赖项跟踪、惰性和缓存 - 是响应式库中常见的功能。Vue 的 _计算属性_(computed properties) 是[一个突出的例子](https://dev.to/linusborg/vue-when-a-computed-property-can-be-the-wrong-tool-195j)。

### 效果

计算信号很适合没有副作用的[纯函数](https://en.wikipedia.org/wiki/Pure_function)。它们也是惰性的。那么，如果我们想对信号值的变化做出反应，而不必不断地轮询它们，该怎么办呢？效果来救援！

与计算信号一样，效果也是用一个函数（_效果函数_）(effect function)创建的，也会跟踪它们的依赖项。然而，效果不是惰性的，而是 _急切的_(eager)。效果函数在效果被创建时立即运行，然后在依赖值发生变化时一次又一次地运行。

```js
// --repl
import { signal, computed, effect } from "@preact/signals-core";

const count = signal(1);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);

effect(() => {
  console.log("quadruple is now", quadruple.value);
});               // 控制台: quadruple value is now 4

count.value = 20; // 控制台: quadruple value is now 80
```

这些反应是由 _通知_(notifications) 触发的。当一个普通信号变化时，它会通知其直接依赖者。然后这些依赖者又会通知它们自己的直接依赖者，依此类推。像在响应式系统中[常见](https://mobx.js.org/computeds.html)的那样，通知路径上的计算信号会将自己标记为过时并准备重新计算。如果通知一路传递到一个效果，那么该效果会安排自己在所有先前安排的效果完成后尽快运行。

当你使用完一个效果后，调用效果创建时返回的 _处理函数_(disposer)：

```js
// --repl
import { signal, computed, effect } from "@preact/signals-core";
// --repl-before
const count = signal(1);
const double = computed(() => count.value * 2);
const quadruple = computed(() => double.value * 2);

const dispose = effect(() => {
  console.log("quadruple is now", quadruple.value);
});                 // 控制台: quadruple value is now 4

dispose();
count.value = 20;  // 控制台上不会打印任何内容
```

还有其他函数，如 [`batch`](/guide/v10/signals/#batchfn)，但这三个与下面的实现说明最相关。

# 实现说明

当我们着手实现上述原语的更高性能版本时，我们必须找到快速的方法来完成以下所有子任务：

* 依赖跟踪：跟踪使用的信号（普通或计算）。依赖项可能会动态变化。
* 惰性：计算函数应该只按需运行。
* 缓存：计算信号应该只在其依赖项可能已更改时重新计算。
* 急切性：当其依赖链中的某些内容改变时，效果应该尽快运行。

响应式系统可以通过无数种不同的方式实现。**@preact/signals-core** 的第一个发布版本基于 Sets，所以我们将继续使用这种方法来对比和比较。

### 依赖跟踪

每当计算/效果函数开始评估时，它需要一种方式来捕获在其运行期间读取的信号。为此，计算信号或效果将自己设置为当前的 _评估上下文_。当读取信号的 `.value` 属性时，它会调用一个 [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)。getter 将信号添加为评估上下文的依赖项，_源_。上下文也被添加为信号的依赖者，_目标_。

最终，信号和效果始终对它们的依赖项和依赖者有一个最新的视图。然后，每个信号可以在其值发生变化时通知其依赖者。效果和计算信号可以引用它们的依赖集，以便在效果被处理等情况下从这些通知中取消订阅。

![信号和效果始终对它们的依赖项（源）和依赖者（目标）有一个最新的视图](/signals/signal-boosting-01.png)

同一信号可能在同一评估上下文中被多次读取。在这种情况下，对依赖项和依赖者条目进行某种去重将会很方便。我们还需要一种方式来处理变化的依赖集：要么在每次运行时重建依赖集，要么逐步添加/删除依赖项/依赖者。

JavaScript 的 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 对象非常适合所有这些需求。像许多其他实现一样，Preact Signals 的原始版本使用了它们。Sets 允许在 [常数 O(1) 时间](https://en.wikipedia.org/wiki/Time_complexity#Constant_time)（平均）内 _添加_ 和 _删除_ 项目，以及在 [线性 O(n) 时间](https://en.wikipedia.org/wiki/Time_complexity#Linear_time) 内遍历当前项目。重复项也会自动处理！难怪许多响应式系统利用 Sets（或 [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)）。这就是合适的工具。

然而，我们想知道是否有一些替代方法。创建 Sets 可能相对昂贵，而且至少计算信号可能需要两个单独的 Sets：一个用于依赖项，一个用于依赖者。Jason 再次表现出他的特点，[基准测试](https://esbench.com/bench/6317fc2a6c89f600a5701bc9)了 Set 迭代与数组相比的表现。会有大量的迭代，所以这一切都加起来。

![Set 迭代比数组迭代稍慢](/signals/signal-boosting-01b.png)

Sets 还有一个特性，它们按插入顺序迭代。这很酷 - 这正是我们在处理缓存时需要的。但是顺序可能不总是保持不变。观察以下场景：

```js
// --repl
import { signal, computed } from "@preact/signals-core";
// --repl-before
const s1 = signal(0);
const s2 = signal(0);
const s3 = signal(0);

const c = computed(() => {
  if (s1.value) {
    s2.value;
    s3.value;
  } else {
    s3.value;
    s2.value;
  }
});
```

根据 `s1` 的值，依赖项的顺序可能是 `s1, s2, s3` 或 `s1, s3, s2`。需要采取特殊步骤来保持 Sets 的顺序：要么移除然后再添加项目，要么在函数运行前清空集合，或者为每次运行创建一个新的集合。每种方法都可能导致内存流失。而所有这些只是为了应对依赖项顺序变化的理论但可能罕见的情况。

还有多种其他方法可以处理这个问题。例如，对依赖项进行编号然后排序。我们最终探索了[链表](https://en.wikipedia.org/wiki/Linked_list)。

### 链表

链表通常被认为相当原始，但对于我们的目的来说，它们具有一些非常好的特性。如果你有双向链表节点，那么以下操作可以非常便宜：

* 在 O(1) 时间内将一个项目插入到列表的一端。
* 在 O(1) 时间内从列表中的任何位置删除一个节点（你已经有了指向该节点的指针）。
* 在 O(n) 时间内遍历列表（每个节点 O(1)）。

事实证明，这些操作是我们管理依赖项/依赖者列表所需的全部内容。

让我们首先为每个依赖关系创建一个"源节点"(source Node)。节点的 `source` 属性指向被依赖的信号。每个节点都有 `nextSource` 和 `prevSource` 属性，分别指向依赖列表中的下一个和上一个源节点。效果或计算信号获得一个 `sources` 属性，指向列表的第一个节点。现在我们可以遍历依赖项，插入新的依赖项，并从列表中删除依赖项以进行重新排序。

![效果和计算信号将它们的依赖项保存在双向链表中](/signals/signal-boosting-02.png)

现在让我们反向做同样的事情：为每个依赖者创建一个"目标节点"。节点的 `target` 属性指向依赖的效果或计算信号。`nextTarget` 和 `prevTarget` 构建一个双向链表。普通和计算信号获得一个 `targets` 属性，指向它们依赖者列表中的第一个目标节点。

![信号将它们的依赖者保存在双向链表中](/signals/signal-boosting-03.png)

但是，依赖项和依赖者是成对出现的。对于每个源节点，**必须**有一个相应的目标节点。我们可以利用这一事实，将"源节点"和"目标节点"合并为"节点"。每个节点变成一种四联结的怪物，依赖者可以将其用作其依赖列表的一部分，反之亦然。

![每个节点变成一种四联结的怪物，依赖者可以将其用作其依赖列表的一部分，反之亦然](/signals/signal-boosting-04.png)

每个节点可以为记账目的附加额外的内容。在每个计算/效果函数之前，我们遍历之前的依赖项，设置每个节点的"未使用"标志。我们还暂时将节点存储到其 `.source.node` 属性中，以便以后使用。然后函数可以开始运行。

在运行期间，每次读取依赖项时，记账值可用于发现该依赖项是否已在此次或上次运行期间被看到。如果依赖项来自上次运行，我们可以回收其节点。对于以前未见过的依赖项，我们创建新节点。然后节点被重新排列，使它们按照使用的相反顺序排列。在运行结束时，我们再次遍历依赖列表，清除仍然带有"未使用"标志的节点。然后我们反转剩余节点的列表，以保持整齐，以便以后使用。

这种精细的死亡之舞使我们能够为每对依赖-依赖者分配仅一个节点，然后只要依赖关系存在，就可以无限期地使用该节点。如果依赖树保持稳定，那么内存消耗在初始构建阶段后也会保持有效稳定。同时依赖列表保持最新状态并按使用顺序排列。每个节点只需常数 O(1) 量的工作。不错！

### Eager Effects

处理好依赖跟踪后，通过change-notifications实现Eager Effects相对简单。信号通知其依赖者有关值变化的信息。如果依赖本身是具有依赖者的计算信号，那么它会向前传递通知，依此类推。收到通知的效果会安排自己运行。

我们在这里添加了几个优化。如果通知的接收端之前已经收到通知，并且还没有机会运行，那么它不会向前传递通知。这缓解了依赖树扇出或扇入时的级联通知雪崩。如果信号的值实际上没有改变（例如 `s.value = s.value`），普通信号也不会通知其依赖者。但这只是出于礼貌。

为了使效果能够安排自己，需要有某种排定效果的列表。我们为每个 Effect 实例添加了一个专用属性 `.nextBatchedEffect`，让 Effect 实例在单向链接的调度列表中充当节点的双重职责。这减少了内存流失，因为重复调度同一效果不需要额外的内存分配或释放。

### 插曲：通知订阅与GC

我们并非完全诚实。计算信号实际上并不*总是*从它们的依赖项获得通知。计算信号仅在有东西（如效果）监听该信号本身时才订阅依赖项通知。这避免了像这样的情况下的问题：

```js
const s = signal(0);

{
  const c = computed(() => s.value)
}
// c 已经超出作用域
```

如果 `c` 总是订阅来自 `s` 的通知，那么 `c` 就不能被垃圾回收，直到 `s` 也超出作用域。这是因为 `s` 会保持对 `c` 的引用。

有多种解决此问题的方法，例如使用 [WeakRefs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef) 或要求手动处理计算信号。在我们的情况下，由于所有 O(1) 的东西，链表提供了一种非常方便的方式来动态订阅和取消订阅依赖项通知。最终结果是，你不必特别注意悬空的计算信号引用。我们认为这是最符合人体工程学和性能最高的方法。

在计算信号**已经**订阅通知的情况下，我们可以利用这种知识进行额外的优化。这就引出了惰性与缓存的问题。

### 惰性与缓存计算信号

实现惰性计算信号的最简单方法是每次读取其值时都重新计算。不过，这样效率不会太高。这就是缓存和依赖跟踪大有帮助的地方。

每个普通和计算信号都有自己的*版本号*。每次它们注意到自己的值发生变化时，它们都会增加自己的版本号。当运行计算函数时，它会在节点中存储其依赖项的最后看到的版本号。我们本可以选择在节点中存储先前的依赖值而不是版本号。然而，由于计算信号是惰性的，因此它们可能会无限期地保留过时且可能昂贵的值。所以我们认为版本编号是一个安全的折衷方案。

我们最终采用了以下算法来确定计算信号何时可以休息并重用其缓存值：

1. 如果自上次运行以来没有任何信号发生变化，则退出并返回缓存值。

> 每次普通信号改变时，它也会增加一个*全局版本号*，这个版本号由所有普通信号共享。每个计算信号会跟踪它们上次看到的全局版本号。如果自上次计算以来全局版本没有变化，那么可以提前跳过重新计算。在这种情况下，任何计算值都不可能有任何变化。

2. 如果计算信号正在监听通知，并且自上次运行以来没有收到通知，则退出并返回缓存值。

> 当计算信号从其依赖项获得通知时，它会将缓存值标记为过时。如前所述，计算信号并不总是获得通知。但是当它们确实获得通知时，我们可以利用它。

3. 按顺序重新评估依赖项。检查它们的版本号。如果即使在重新评估后，也没有依赖项改变其版本号，则退出并返回缓存值。

> 这一步是我们特别关注保持依赖项按使用顺序排列的原因。如果一个依赖项发生变化，那么我们不想重新评估列表中稍后出现的依赖项，因为这可能只是不必要的工作。谁知道呢，也许第一个依赖项的变化会导致下一次计算函数运行删除后面的依赖项。

4. 运行计算函数。如果返回的值与缓存的值不同，则增加计算信号的版本号。缓存并返回新值。

> 这是最后的手段！但至少如果新值等于缓存的值，那么版本号不会改变，并且下游的依赖者可以使用它来优化自己的缓存。

最后两个步骤通常会递归到依赖项中。这就是为什么前面的步骤旨在尝试短路递归的原因。

# 结语

按照 Preact 的典型风格，在此过程中还添加了多个较小的优化。[源代码](https://github.com/preactjs/signals/tree/main/packages/core/src)包含一些可能有用也可能没用的注释。如果你对我们想出的各种边缘情况感到好奇，想确保我们的实现是健壮的，请查看[测试](https://github.com/preactjs/signals/tree/main/packages/core/test)。

这篇文章是一种脑力倾泻。它概述了我们为使 **@preact/signals-core** 版本 1.2.0 变得更好（按照某种"更好"的定义）而采取的主要步骤。希望这里列出的一些想法能引起共鸣，并被他人重用和重组。至少这是我们的梦想！

非常感谢所有贡献者。也感谢你读到这里！这是一次旅程。