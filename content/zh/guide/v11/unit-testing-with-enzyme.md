---
title: 使用 Enzyme 进行单元测试
description: 使用 Enzyme 简化对 Preact 应用的测试
---

# 使用 Enzyme 进行单元测试

Airbnb 的 [Enzyme](https://airbnb.io/enzyme/) 是一个用于为 React 组件编写测试的库。它通过“适配器（adapters）”支持不同版本的 React 及类 React 库。Preact 团队维护了一个针对 Preact 的适配器。

Enzyme 支持在普通或无头浏览器中运行的测试（例如通过 [Karma](http://karma-runner.github.io/latest/index.html)），也支持在 Node 环境中使用 [jsdom](https://github.com/jsdom/jsdom) 模拟浏览器 API 来运行测试。

有关 Enzyme 的详细入门和 API 参考，请参阅 [Enzyme 文档](https://airbnb.io/enzyme/)。本指南余下部分说明如何将 Enzyme 与 Preact 配置在一起，以及 Enzyme 在与 Preact 配合使用时与 React 的差异。

---

<toc></toc>

---

## 安装

使用以下命令安装 Enzyme 及 Preact 适配器：

```bash
npm install --save-dev enzyme enzyme-adapter-preact-pure
```

## 配置

在你的测试初始化代码中，需要将 Enzyme 配置为使用 Preact 适配器：

```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

configure({ adapter: new Adapter() });
```

关于如何在不同测试运行器（如 Mocha、Jest）中使用 Enzyme 的更多指南，请参见 Enzyme 文档中的 [Guides](https://airbnb.io/enzyme/docs/guides.html) 部分。

## 示例

假设我们有一个简单的 `Counter` 组件，它显示一个初始值并提供一个按钮来增加计数：

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function Counter({ initialCount }) {
	const [count, setCount] = useState(initialCount);
	const increment = () => setCount(count + 1);

	return (
		<div>
			Current value: {count}
			<button onClick={increment}>Increment</button>
		</div>
	);
}
```

使用例如 Mocha 或 Jest 的测试运行器，你可以编写如下测试来验证其行为：

```jsx
import { expect } from 'chai';
import { h } from 'preact';
import { mount } from 'enzyme';

import Counter from '../src/Counter';

describe('Counter', () => {
	it('should display initial count', () => {
		const wrapper = mount(<Counter initialCount={5} />);
		expect(wrapper.text()).to.include('Current value: 5');
	});

	it('should increment after "Increment" button is clicked', () => {
		const wrapper = mount(<Counter initialCount={5} />);

		wrapper.find('button').simulate('click');

		expect(wrapper.text()).to.include('Current value: 6');
	});
});
```

要查看可运行的示例项目和其它示例，请参阅 Preact 适配器仓库中的 [examples/](https://github.com/preactjs/enzyme-adapter-preact-pure/blob/master/README.md#example-projects) 目录。

## Enzyme 的工作原理

Enzyme 使用已配置的适配器来渲染组件及其子节点。适配器会将渲染输出转换为一个标准化的内部表示（即“React Standard Tree”）。Enzyme 在此基础上封装了一个带有查询和触发更新方法的包装对象。该包装对象的 API 使用类似 CSS 的 [选择器](https://airbnb.io/enzyme/docs/api/selector.html) 来定位输出中的部分节点。

## 完整渲染、浅渲染和字符串渲染

Enzyme 提供三种渲染“模式”：

```jsx
import { mount, shallow, render } from 'enzyme';

// 完整渲染组件树：
const wrapper = mount(<MyComponent prop="value" />);

// 仅渲染 `MyComponent` 的直接输出（即将子组件“模拟”为占位符）:
const wrapper = shallow(<MyComponent prop="value" />);

// 将完整组件树渲染为 HTML 字符串并解析结果:
const wrapper = render(<MyComponent prop="value" />);
```

- `mount` 会以浏览器中相同的方式渲染组件及其所有后代节点。

- `shallow` 只渲染组件直接输出的 DOM 节点。任何子组件都会被替换为仅输出其子内容的占位符。

  这种模式的优点是可以在不依赖子组件实现细节的情况下为组件编写测试，从而无需构造所有子组件的依赖。

  注意：`shallow` 在 Preact 适配器中的内部实现与 React 不同。详情参见下文的“差异”一节。

- `render`（注意不要与 Preact 的 `render` 函数混淆）将组件渲染为 HTML 字符串，适用于在服务端测试渲染输出或在不触发副作用的情况下渲染组件。

## 使用 `act` 触发状态更新和副作用

在前面的示例中，使用了 `.simulate('click')` 来触发按钮点击。

Enzyme 知道对 `simulate` 的调用可能会改变组件状态或触发副作用，因此会在 `simulate` 返回之前立即应用相应的状态更新或副作用。Enzyme 在使用 `mount` 或 `shallow` 初次渲染组件以及通过 `setProps` 更新组件时也会执行相同的刷新行为。

但如果事件是在 Enzyme 的方法调用之外触发的，例如直接调用事件处理器（如按钮的 `onClick` 属性），Enzyme 并不会自动感知这些变化。在这种情况下，测试代码需要手动触发状态更新和副作用的执行，并让 Enzyme 刷新其对渲染输出的视图。

- 若要同步执行状态更新和副作用，可使用 `preact/test-utils` 中的 `act` 函数来包裹触发更新的代码。
- 若要让 Enzyme 刷新其对渲染输出的视图，可使用包装对象的 `.update()` 方法。

例如，下面是对计数器测试的另一种写法，它直接调用按钮的 `onClick` 属性，而不是通过 Enzyme 的 `simulate`：

```js
import { act } from 'preact/test-utils';
```

```jsx
it('should increment after "Increment" button is clicked', () => {
	const wrapper = mount(<Counter initialCount={5} />);
	const onClick = wrapper.find('button').props().onClick;

	act(() => {
		// 直接调用按钮的点击处理器（而不是通过 Enzyme 的 API）
		onClick();
	});
	// 刷新 Enzyme 对渲染输出的视图
	wrapper.update();

	expect(wrapper.text()).to.include('Current value: 6');
});
```

## 与 React 下的 Enzyme 的差异

总体目标是让使用 Enzyme + React 编写的测试能较容易地在 Enzyme + Preact 下工作，反之亦然。这避免了在将组件从 Preact 切换到 React（或反向）时需重写所有测试的需求。

不过，还是有一些行为差异需要注意：

- `shallow` 渲染模式在底层的工作方式不同。它在只渲染组件“一层深度”方面与 React 一致，但与 React 不同的是它会创建真实的 DOM 节点，并且会运行所有常规的生命周期钩子和副作用。
- `simulate` 方法会派发真实的 DOM 事件，而在 React 的适配器中，`simulate` 只是调用对应的 `on<EventName>` 属性。
- 在 Preact 中，状态更新（例如调用 `setState` 后）会被合并并异步应用。React 中状态更新可能会立即应用或根据上下文被批处理。为了简化测试，Preact 适配器会在初次渲染以及通过 `setProps` 或 `simulate` 触发的更新后刷新状态更新和副作用。当状态更新或副作用是通过其他方式触发时，测试代码可能需要使用 `preact/test-utils` 中的 `act` 手动触发刷新。

如需更多细节，请参阅 Preact 适配器的 [README](https://github.com/preactjs/enzyme-adapter-preact-pure#differences-compared-to-enzyme--react)。
