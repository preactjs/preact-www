---
title: 引用
description: 引用（Refs）是一种创建组件实例本地稳定值的方式，这些值可以在渲染过程中保持不变。
---

# 引用

引用（References），简称 refs，是稳定的、局部的值，它们在组件渲染过程中保持不变，但当它们改变时不会像状态（state）或属性（props）那样触发重新渲染。

最常见的是，您会看到 refs 用于促进对 DOM 的命令式操作，但它们也可以用于存储您需要保持稳定的任何任意本地值。您可以使用它们来跟踪之前的状态值，保持对间隔或超时 ID 的引用，或者简单地作为计数器值。重要的是，refs 不应该用于渲染逻辑，而只应该在生命周期方法和事件处理程序中使用。

---

<toc></toc>

---

## 创建引用

在 Preact 中创建 refs 有两种方式，取决于您喜欢的组件风格：`createRef`（类组件）和`useRef`（函数组件/钩子）。这两个 API 的基本工作方式相同：它们创建一个具有`current`属性的稳定的普通对象，可以选择性地初始化为一个值。

<tab-group tabstring="Classes, Hooks">

```jsx
import { createRef } from 'preact';

class MyComponent extends Component {
	countRef = createRef();
	inputRef = createRef(null);

	// ...
}
```

```jsx
import { useRef } from 'preact/hooks';

function MyComponent() {
	const countRef = useRef();
	const inputRef = useRef(null);

	// ...
}
```

</tab-group>

## 使用引用访问 DOM 节点

refs 最常见的用例是访问组件的底层 DOM 节点。这对于命令式 DOM 操作很有用，例如测量元素、调用各种元素上的原生方法（如`.focus()`或`.play()`），以及与用原生 JS 编写的第三方库集成。在以下示例中，在渲染后，Preact 将把 DOM 节点分配给 ref 对象的`current`属性，使其在组件挂载后可用。

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component, createRef } from 'preact';
// --repl-before
class MyInput extends Component {
	ref = createRef(null);

	componentDidMount() {
		console.log(this.ref.current);
		// 输出: [HTMLInputElement]
	}

	render() {
		return <input ref={this.ref} />;
	}
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
// --repl-before
function MyInput() {
	const ref = useRef(null);

	useEffect(() => {
		console.log(ref.current);
		// 输出: [HTMLInputElement]
	}, []);

	return <input ref={ref} />;
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

</tab-group>

### 回调引用

使用引用的另一种方式是将函数传递给`ref`属性，其中 DOM 节点将作为参数传递。

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class MyInput extends Component {
	render() {
		return (
			<input
				ref={dom => {
					console.log('已挂载:', dom);

					// 从Preact 10.23.0开始，您可以选择返回一个清理函数
					return () => {
						console.log('已卸载:', dom);
					};
				}}
			/>
		);
	}
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
// --repl-before
function MyInput() {
	return (
		<input
			ref={dom => {
				console.log('已挂载:', dom);

				// 从Preact 10.23.0开始，您可以选择返回一个清理函数
				return () => {
					console.log('已卸载:', dom);
				};
			}}
		/>
	);
}
// --repl-after
render(<MyInput />, document.getElementById('app'));
```

</tab-group>

> 如果提供的 ref 回调不稳定（例如上面所示的内联定义的回调），并且*没有*返回清理函数，则在所有重新渲染时**它将被调用两次**：一次传入`null`，然后一次传入实际引用。这是一个常见问题，`createRef`/`useRef` API 通过强制用户检查`ref.current`是否已定义，使这个问题变得更容易处理。
>
> 相比之下，稳定的函数可以是类组件实例上的方法、组件外部定义的函数，或者例如使用`useCallback`创建的函数。

## 使用引用存储本地值

然而，refs 并不限于存储 DOM 节点；它们可以用于存储您可能需要的任何类型的值。

在下面的例子中，我们将一个间隔的 ID 存储在 ref 中，以便能够独立地启动和停止它。

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component, createRef } from 'preact';
// --repl-before
class SimpleClock extends Component {
	state = {
		time: Date.now()
	};
	intervalId = createRef(null);

	startClock = () => {
		this.setState({ time: Date.now() });
		this.intervalId.current = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	};

	stopClock = () => {
		clearInterval(this.intervalId.current);
	};

	render(_, { time }) {
		const formattedTime = new Date(time).toLocaleTimeString();

		return (
			<div>
				<button onClick={this.startClock}>启动时钟</button>
				<time dateTime={formattedTime}>{formattedTime}</time>
				<button onClick={this.stopClock}>停止时钟</button>
			</div>
		);
	}
}
// --repl-after
render(<SimpleClock />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState, useRef } from 'preact/hooks';
// --repl-before
function SimpleClock() {
	const [time, setTime] = useState(Date.now());
	const intervalId = useRef(null);

	const startClock = () => {
		setTime(Date.now());
		intervalId.current = setInterval(() => {
			setTime(Date.now());
		}, 1000);
	};

	const stopClock = () => {
		clearInterval(intervalId.current);
	};

	const formattedTime = new Date(time).toLocaleTimeString();

	return (
		<div>
			<button onClick={startClock}>启动时钟</button>
			<time dateTime={formattedTime}>{formattedTime}</time>
			<button onClick={stopClock}>停止时钟</button>
		</div>
	);
}
// --repl-after
render(<SimpleClock />, document.getElementById('app'));
```

</tab-group>
