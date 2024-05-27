---
name: Signals
description: 'Signals: composable reactive state with automatic rendering'
---

# 信号

信号是用于管理应用程序状态的响应原始概念。

信号的独特之处在于，状态变化会自动更新组件和UI，以实现尽可能高效的操作。自动状态绑定和依赖跟踪使Signals提供了出色的人体工程学和生产力，同时消除了最常见的状态管理陷阱。

信号在任何规模的应用中都有效，符合人体工程学的设计可以加快小型应用的开发速度，性能特征确保在任何规模的应用中,默认设置都是快速的

---

<div><toc></toc></div>

---

## 介绍

JavaScript中许多状态管理的痛苦在于对给定值的变化做出反应，因为值本身并不是直接可观察的。通常的解决方案是通过将值存储在变量中并不断检查它们是否发生了变化来解决这个问题，这既繁琐又不利于性能。理想情况下，我们希望有一种方式来表达一个值，它可以告诉我们何时发生变化。这就是信号的作用。

在其核心概念中，信号是一个具有 .value 属性的对象，该属性保存了一个值。这有一个重要的特性：信号的值可以改变，但信号本身始终保持不变。

```js
// --repl
import { signal } from "@preact/signals";

const count = signal(0);

// Read a signal’s value by accessing .value:
console.log(count.value);   // 0

// Update a signal’s value:
count.value += 1;

// The signal's value has changed:
console.log(count.value);  // 1
```

在Preact中，当信号通过组件树作为props或上下文传递时，我们只传递信号的引用。信号可以在不重新渲染任何组件的情况下更新，因为组件看到信号而不是其值。这让我们跳过所有昂贵的渲染工作，并立即跳转到实际访问信号的.value属性的树中的任何组件。

信号还有一个重要的特性，那就是它们跟踪它们的值何时被访问以及何时更新。在 Preact 中，当从组件内部访问一个信号的 .value 属性时，该信号的值发生变化时，会自动重新渲染组件。

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal } from "@preact/signals";

// Create a signal that can be subscribed to:
const count = signal(0);

function Counter() {
  // Accessing .value in a component automatically re-renders when it changes:
  const value = count.value;

  const increment = () => {
    // A signal is updated by assigning to the `.value` property:
    count.value++;
  }

  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={increment}>click me</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

最后，Signals 被深度集成到 Preact 中，以提供最佳的性能和人体工程学设计。 在上面的示例中，我们访问“count.value”来检索“count”信号的当前值，但这是不必要的。 相反，我们可以直接在 JSX 中使用“count”信号，让 Preact 为我们完成所有工作：

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal } from "@preact/signals";

const count = signal(0);

function Counter() {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => count.value++}>click me</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

## 安装

可以通过将 `@preact/signals` 包添加到您的项目来安装 Signals：

```sh
npm install @preact/signals
```

通过您选择的包管理器安装后，您已经准备好在你的app中引用它了。

## 例子

让我们在现实场景中使用信号。 我们将构建一个待办事项列表应用程序，您可以在其中添加和删除待办事项列表中的项目。 我们将从对状态建模开始。 我们首先需要一个包含待办事项列表的信号，我们可以用“数组”来表示：

```jsx
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Buy groceries" },
  { text: "Walk the dog" },
]);
```

为了让用户为新的待办事项输入文本，我们还需要一个 signal，表明我们很快就会连接到“input”元素。 现在，我们已经可以使用这个signal来创建一个函数，将待办事项添加到我们的列表中。 请记住，我们可以通过分配信号的“.value”属性来更新信号的值：

```jsx
// We'll use this for our input later
const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = ""; // Clear input value on add
}
```

> :bulb: Tip: 仅当您为其分配新值时，信号才会更新。 如果您分配给信号的值等于其当前值，则它不会更新。
>
> ```js
> const count = signal(0);
>
> count.value = 0; // does nothing - value is already 0
>
> count.value = 1; // updates - value is different
> ```

让我们检查一下到目前为止我们的逻辑是否正确。 当我们更新“text”信号并调用“addTodo()”时，我们应该看到一个新项目被添加到“todos”信号中。 我们可以通过直接调用这些函数来模拟这种场景 - 不需要用户界面！

```jsx
// --repl
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Buy groceries" },
  { text: "Walk the dog" },
]);

const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = ""; // Reset input value on add
}

// Check if our logic works
console.log(todos.value);
// Logs: [{text: "Buy groceries"}, {text: "Walk the dog"}]


// Simulate adding a new todo
text.value = "Tidy up";
addTodo();

// Check that it added the new item and cleared the `text` signal:
console.log(todos.value);
// Logs: [{text: "Buy groceries"}, {text: "Walk the dog"}, {text: "Tidy up"}]

console.log(text.value);  // Logs: ""
```

我们要添加的最后一个功能是能够从列表中删除待办事项。 为此，我们将添加一个函数，用于从 todos 数组中删除给定的待办事项：

```jsx
function removeTodo(todo) {
  todos.value = todos.value.filter(t => t !== todo);
}
```

## 构建 UI

现在我们已经对应用程序的状态进行了建模，是时候连接一个用户可以与之交互的漂亮 UI 了。

```jsx
function TodoList() {
  const onInput = event => (text.value = event.currentTarget.value);

  return (
    <>
      <input value={text.value} onInput={onInput} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.value.map(todo => (
          <li>
            {todo.text}{' '}
            <button onClick={() => removeTodo(todo)}>❌</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

这样我们就有了一个完全可用的待办事项应用程序！您可以[在这里](/repl?example=todo-list-signals)尝试完整的应用程序：tada：

## 使用 computed signals 驱动状态

让我们向待办事项应用程序添加一项功能：每个待办事项都可以在已完成时进行核对，并且我们将向用户显示他们已完成的项目数。 为此，我们将导入 [`compulated(fn)`](#compulatedfn) 函数，该函数允许我们创建一个根据其他信号的值计算的新信号。 返回的计算信号是只读的，当从回调函数内访问的任何信号发生变化时，其值会自动更新。

```jsx
// --repl
import { signal, computed } from "@preact/signals";

const todos = signal([
  { text: "Buy groceries", completed: true },
  { text: "Walk the dog", completed: false },
]);

// create a signal computed from other signals
const completed = computed(() => {
  // When `todos` changes, this re-runs automatically:
  return todos.value.filter(todo => todo.completed).length;
});

// Logs: 1, because one todo is marked as being completed
console.log(completed.value);
```

我们简单的TODO LIST应用程序不需要很多计算的信号，但是更复杂的应用程序倾向于依靠computed()来避免在多个位置重复状态。

> :bulb: Tip: 尽可能地派生状态以确保状态只有单一真实来源。这是信号的一个关键准则。这在以后应用出现逻辑缺陷时更容易调试，因为需要关心的地方更少。

## 管理全局应用程序状态

到目前为止，我们仅在组件树之外创建了信号。 这对于像待办事项列表这样的小应用程序来说很好，但是对于更大，更复杂的应用程序，这可能会使测试变得困难。测试通常涉及您的应用程序状态中的变化值以重现某种情况，然后将该状态传递给组件并主张渲染的HTML。为此，我们可以将我们的待办事项列表状态提取到一个函数中：

```jsx
function createAppState() {
  const todos = signal([]);

  const completed = computed(() => {
    return todos.value.filter(todo => todo.completed).length
  });

  return { todos, completed }
}
```

> :bulb: Tip: 请注意，我们故意没有使用 `addTodo()` 和 `removeTodo(todo)` 函数。 分离数据与修改它的函数通常有助于简化应用架构。详情请参阅[面向数据设计](https://en.wikipedia.org/wiki/data-oriented_design)。

现在，我们可以在渲染时将待办事项状态作为 props 传递：

```jsx
const state = createAppState();

// ...later:
<TodoList state={state} />
```

这在我们的TODO列表应用程序中可行，因为状态是全局的，但大型应用通常会有多个需要访问相同状态的组件。 这通常需要“状态提升”到一个共同的祖先组件。为了避免使用props在每个组件中手动传递状态，可以将状态放入[上下文](/guide/v10/context)中，以便树中的任何组件都可以访问它。 下面是一个典型例子：

```jsx
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { createAppState } from "./my-app-state";

const AppState = createContext();

render(
  <AppState.Provider value={createAppState()}>
    <App />
  </AppState.Provider>
);

// ...later when you need access to your app state
function App() {
  const state = useContext(AppState);
  return <p>{state.completed}</p>;
}
```

如果你想了解更多有关上下文的更信息，请参阅[上下文](/guide/v10/context)。

## 使用信号的本地状态

应用的大部分状态最终都是使用props和context传递的。但是，在许多情况下，组件具有特定于该组件的内部状态。没有理由让这些状态称为全局业务逻辑的一部分，因此应将其限制于需要它的组件中。在这些情况下，我们可以使用`useSignal()` 和 `useComputed()` 钩子：

```jsx
import { useSignal, useComputed } from "@preact/signals";

function Counter() {
  const count = useSignal(0);
  const double = useComputed(() => count.value * 2);

  return (
    <div>
      <p>{count} x 2 = {double}</p>
      <button onClick={() => count.value++}>click me</button>
    </div>
  );
}
```

这两个钩子是[`signal()`](#signalinitialvalue) 和 [`computed()`](#computedfn) 的简单封装，它们在组件首次运行时构造信号，并简单地在之后的渲染中使用相同的信号。

> :bulb: 以下是幕后的实现：
>
> ```js
> function useSignal(value) {
>  return useMemo(() => signal(value), []);
> }
> ```

## signals 高级用法

到目前为止，我们所涵盖的主题是已经可以满足需求。以下部分针对希望通过完全使用信号对应用程序状态建模来获得更多益处的读者。

### 对组件之外的 signal 做出反应

在组件树外使用信号时，您可能已经注意到，除非您读取它的 .value，否则 computed signals 不会重新计算。这是因为默认情况下，信号是懒惰的：它们仅在访问其值时计算新值。

```js
const count = signal(0);
const double = computed(() => count.value * 2);

// Despite updating the `count` signal on which the `double` signal depends,
// `double` does not yet update because nothing has used its value.
count.value = 1;

// Reading the value of `double` triggers it to be re-computed:
console.log(double.value); // Logs: 2
```

这提出了一个问题：我们如何订阅组件树之外的信号？也许我们想在信号的值更改或保持时将某些内容记录到控制台上。[LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

要运行任意代码来响应信号变化，我们可以使用 [`effect(fn)`](#effectfn)。与计算信号类似，effect 跟踪访问了哪些信号，并在这些信号发生变化时重新运行其回调。 与计算信号不同，[`effect()`](#effectfn) 不返回信号 - 它是一系列更改的结束。

```js
import { signal, computed, effect } from "@preact/signals-core";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => `${name.value} ${surname.value}`);

// Logs name every time it changes:
effect(() => console.log(fullName.value));
// Logs: "Jane Doe"

// Updating `name` updates `fullName`, which triggers the effect again:
name.value = "John";
// Logs: "John Doe"
```

可以调用返回的函数来清除 effect 并取消订阅它访问的信号。

```js
import { signal, effect } from "@preact/signals-core";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => name.value + " " + surname.value);

const dispose = effect(() => console.log(fullName.value));
// Logs: "Jane Doe"

// Destroy effect and subscriptions:
dispose();

// Updating `name` does not run the effect because it has been disposed.
// It also doesn't re-compute `fullName` now that nothing is observing it.
name.value = "John";
```

> :bulb: Tip: 如果你大量使用 effect，不要忘了清理。否则会浪费内存。


## 读取signal而无需订阅它们

在极少数情况下，您需要在 [`effect(fn)`](#effectfn) 内写入signal，但不希望signal更改时重新运行effect，您可以使用 `.peek()` 获取 signal 当前值而不订阅它们。

```js
const delta = signal(0);
const count = signal(0);

effect(() => {
  // Update `count` without subscribing to `count`:
  count.value = count.peek() + delta.value;
});

// Setting `delta` reruns the effect:
delta.value = 1;

// This won't rerun the effect because it didn't access `.value`:
count.value = 10;
```

> :bulb: Tip: 不想订阅信号的情况很少见。大多数情况下你都希望 effect 订阅所有信号。只有在真正需要的时候才使用 `.peek()`。


## 批更新

还记得我们之前在待办事项应用程序中使用的`addTodo()`函数吗？ 回顾一下它的样子：

```js
const todos = signal([]);
const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = "";
}
```


请注意，该函数触发两个单独的更新：一个是在设置 `todos.value` 时，另一个是在设置 `text` 的值时。 出于性能或其他原因，这种情况有时并不理想，需要将这两个更新合并为一个。 [`batch(fn)`](#batchfn) 函数可用于在回调结束时将多个值更新合并为一个“提交”：

```js
function addTodo() {
  batch(() => {
    todos.value = [...todos.value, { text: text.value }];
    text.value = "";
  });
}
```

访问批处理内已修改的信号将反映其更新值。访问已被批处理内的另一个信号无效的计算信号时，将仅重新计算必要的依赖关系，以返回该计算信号的最新值。任何其他无效信号均不受影响，并且仅在批处理结束时更新。

```js
// --repl
import { signal, computed, effect, batch } from "@preact/signals-core";

const count = signal(0);
const double = computed(() => count.value * 2);
const triple = computed(() => count.value * 3);

effect(() => console.log(double.value, triple.value));

batch(() => {
  // set `count`, invalidating `double` and `triple`:
  count.value = 1;

  // Despite being batched, `double` reflects the new computed value.
  // However, `triple` will only update once the callback completes.
  console.log(double.value); // Logs: 2
});
```


> :bulb: Tip: 批处理也可以嵌套，这种情况下只有最外层的批处理完成时才会进行更新。


### 渲染优化

通过信号我们可以绕过虚拟DOM渲染，将信号变化直接绑定到DOM操作。如果将 signals 传递到JSX的文本位置，它就会以文本形式自动就地更新，无需虚拟DOM差分计算：

```jsx
const count = signal(0);

function Unoptimized() {
  // Re-renders the component when `count` changes:
  return <p>{count.value}</p>;
}

function Optimized() {
  // Text automatically updates without re-rendering the component:
  return <p>{count}</p>;
}
```


要启用此优化，请将信号传递到JSX，而不是访问其 `.value` 属性。

将信号作为 props 传递给 DOM 元素时，也支持类似的渲染优化。

## API

本节是信号 API 概览。它的目的是为已经知道如何使用 signal 的人提供快速参考。

### signal(initialValue)

以给定参数为初始值创建一个新的信号：

```js
const count = signal(0);
```

在组件内创建信号时，请使用hook变体：`useSignal(initialValue)`。

返回的信号具有 `.value` 属性，可以获取或设置该属性来读取和写入其值。 要读取信号而不订阅它，请使用 `signal.peek()`。

### computed(fn)

创建一个根据其他信号的值计算的新信号。返回的计算信号是只读的，当回调函数内访问的任何信号发生变化时，其值会自动更新。

```js
const name = signal("Jane");
const surname = signal("Doe");

const fullName = computed(() => `${name.value} ${surname.value}`);
```

在组件内创建计算信号时，请使用钩子变体：`useCompulated(fn)`。

### effect(fn)

要根据信号变化运行任意代码，可以使用 `effect(fn)`。与计算信号类似，effect 会跟踪哪些信号被访问，并在这些信号发生变化时重新运行其回调。与计算信号不同的是，`effect()` 不返回信号 - 它是一系列更改的结束。

```js
const name = signal("Jane");

// Log to console when `name` changes:
effect(() => console.log('Hello', name.value));
// Logs: "Hello Jane"

name.value = "John";
// Logs: "Hello John"
```

当响应组件内的信号变化时，请使用钩子变体：`useSignalEffect(fn)`。

### batch(fn)

`batch(fn)` 函数可用于在提供的回调结束时将多个值更新合并为一个“提交”。 批处理可以嵌套，并且只有在最外面的批处理回调完成后才会刷新更改。 访问批处理内已修改的信号将反映其更新值。

```js
const name = signal("Jane");
const surname = signal("Doe");

// Combine both writes into one update
batch(() => {
  name.value = "John";
  surname.value = "Smith";
});
```
