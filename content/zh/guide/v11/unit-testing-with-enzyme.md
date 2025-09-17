---
title: 通过Enzyme进行单元测试
description: Testing Preact applications made easy with enzyme
---

# 使用 Enzyme 进行单元测试

Airbnb 的 [Enzyme](https://airbnb.io/enzyme/) 是一个用于为 React 组件编写测试的库。它通过使用"适配器"支持不同版本的 React 和类 React 库。Preact 团队维护着一个适用于 Preact 的适配器。

Enzyme 支持使用工具如 [Karma](http://karma-runner.github.io/latest/index.html) 在正常或无头浏览器中运行的测试，或者使用 [jsdom](https://github.com/jsdom/jsdom) 作为浏览器 API 的模拟实现在 Node 中运行的测试。

有关使用 Enzyme 的详细介绍和 API 参考，请参阅 [Enzyme 文档](https://airbnb.io/enzyme/)。本指南的其余部分将解释如何在 Preact 中设置 Enzyme，以及 Enzyme 与 Preact 的使用方式与 Enzyme 与 React 的使用方式有何不同。

---

<toc></toc>

---

## 安装

使用以下命令安装 Enzyme 和 Preact 适配器：

```bash
npm install --save-dev enzyme enzyme-adapter-preact-pure
```

## 配置

在您的测试设置代码中，您需要配置 Enzyme 使用 Preact 适配器：

```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

configure({ adapter: new Adapter() });
```

有关将 Enzyme 与不同测试运行器一起使用的指导，请参阅 Enzyme 文档的 [指南](https://airbnb.io/enzyme/docs/guides.html) 部分。

## 示例

假设我们有一个简单的 `Counter` 组件，它显示一个初始值，并有一个更新它的按钮：

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function Counter({ initialCount }) {
	const [count, setCount] = useState(initialCount);
	const increment = () => setCount(count + 1);

	return (
		<div>
			当前值: {count}
			<button onClick={increment}>增加</button>
		</div>
	);
}
```

使用如 mocha 或 Jest 等测试运行器，您可以编写测试来检查它是否如预期工作：

```jsx
import { expect } from 'chai';
import { h } from 'preact';
import { mount } from 'enzyme';

import Counter from '../src/Counter';

describe('Counter', () => {
	it('应该显示初始计数', () => {
		const wrapper = mount(<Counter initialCount={5} />);
		expect(wrapper.text()).to.include('当前值: 5');
	});

	it('点击"增加"按钮后应该递增', () => {
		const wrapper = mount(<Counter initialCount={5} />);

		wrapper.find('button').simulate('click');

		expect(wrapper.text()).to.include('当前值: 6');
	});
});
```

有关此项目的可运行版本和其他示例，请参阅 Preact 适配器仓库中的 [examples/](https://github.com/preactjs/enzyme-adapter-preact-pure/blob/master/README.md#example-projects) 目录。

## Enzyme 的工作原理

Enzyme 使用它配置的适配器库来渲染组件及其子组件。然后，适配器将输出转换为标准化的内部表示（"React 标准树"）。Enzyme 然后用一个对象包装它，该对象具有查询输出和触发更新的方法。包装器对象的 API 使用类似 CSS 的 [选择器](https://airbnb.io/enzyme/docs/api/selector.html) 来定位输出的各个部分。

## 完整、浅层和字符串渲染

Enzyme 有三种渲染"模式"：

```jsx
import { mount, shallow, render } from 'enzyme';

// 渲染完整的组件树：
const wrapper = mount(<MyComponent prop="value" />);

// 只渲染 `MyComponent` 的直接输出（即，"模拟"子组件以仅作为占位符渲染）：
const wrapper = shallow(<MyComponent prop="value" />);

// 将完整的组件树渲染为 HTML 字符串，并解析结果：
const wrapper = render(<MyComponent prop="value" />);
```

- `mount` 函数以与在浏览器中相同的方式渲染组件及其所有后代。

- `shallow` 函数仅渲染由组件直接输出的 DOM 节点。任何子组件都会被替换为只输出其子组件的占位符。

  这种模式的优点是您可以为组件编写测试，而不依赖于子组件的细节和需要构建其所有依赖项。

  与 React 相比，`shallow` 渲染模式在 Preact 适配器中的内部工作方式有所不同。有关详细信息，请参阅下面的差异部分。

- `render` 函数（不要与 Preact 的 `render` 函数混淆！）将组件渲染为 HTML 字符串。这对于测试服务器上的渲染输出，或在不触发任何效果的情况下渲染组件很有用。

## 使用 `act` 触发状态更新和效果

在前面的示例中，使用了 `.simulate('click')` 来点击按钮。

Enzyme 知道对 `simulate` 的调用很可能会改变组件的状态或触发效果，因此它会在 `simulate` 返回之前立即应用任何状态更新或效果。当使用 `mount` 或 `shallow` 最初渲染组件，以及使用 `setProps` 更新组件时，Enzyme 也会这样做。

但是，如果事件发生在 Enzyme 方法调用之外，例如直接调用事件处理程序（例如按钮的 `onClick` 属性），则 Enzyme 不会意识到这种变化。在这种情况下，您的测试需要触发状态更新和效果的执行，然后要求 Enzyme 刷新其对输出的视图。

- 要同步执行状态更新和效果，请使用 `preact/test-utils` 中的 `act` 函数包装触发更新的代码
- 要更新 Enzyme 对渲染输出的视图，请使用包装器的 `.update()` 方法

例如，这里是递增计数器测试的不同版本，修改为直接调用按钮的 `onClick` 属性，而不是通过 `simulate` 方法：

```js
import { act } from 'preact/test-utils';
```

```jsx
it('点击"增加"按钮后应该递增', () => {
	const wrapper = mount(<Counter initialCount={5} />);
	const onClick = wrapper.find('button').props().onClick;

	act(() => {
		// 调用按钮的点击处理程序，但这次是直接调用，而不是
		// 通过 Enzyme API
		onClick();
	});
	// 刷新 Enzyme 对输出的视图
	wrapper.update();

	expect(wrapper.text()).to.include('当前值: 6');
});
```

## 与 Enzyme + React 的区别

总体目标是使用 Enzyme + React 编写的测试可以轻松地转换为使用 Enzyme + Preact 工作，反之亦然。这样可以避免在需要将最初为 Preact 编写的组件切换到 React 或反之亦然时，重写所有测试。

但是，这个适配器与 Enzyme 的 React 适配器之间存在一些行为差异需要注意：

- "浅层"渲染模式在内部工作方式不同。它与 React 在只渲染组件"一层深度"方面是一致的，但与 React 不同的是，它创建真实的 DOM 节点。它还运行所有常规的生命周期钩子和效果。
- `simulate` 方法会触发实际的 DOM 事件，而在 React 适配器中，`simulate` 只调用 `on<EventName>` 属性
- 在 Preact 中，状态更新（例如在调用 `setState` 后）被批处理并异步应用。在 React 中，状态更新可以立即应用或根据上下文批处理。为了使编写测试更容易，Preact 适配器会在初始渲染和通过适配器上的 `setProps` 或 `simulate` 调用触发的更新后刷新状态更新和效果。当状态更新或效果通过其他方式触发时，您的测试代码可能需要使用 `preact/test-utils` 包中的 `act` 手动触发效果和状态更新的刷新。

有关更多详细信息，请参阅 [Preact 适配器的 README](https://github.com/preactjs/enzyme-adapter-preact-pure#differences-compared-to-enzyme--react)。
