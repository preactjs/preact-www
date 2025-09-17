---
title: 通过preact 测试库测试
description: Testing Preact applications made easy with testing-library
---

# 使用 Preact Testing Library 进行测试

[Preact Testing Library](https://github.com/testing-library/preact-testing-library) 是 `preact/test-utils` 的一个轻量级包装器。它提供了一组查询方法，用于以类似用户在页面上查找元素的方式访问渲染的 DOM。这种方法允许您编写不依赖于实现细节的测试。因此，当被测试的组件进行重构时，这使得测试更容易维护且更具弹性。

与 [Enzyme](/guide/v10/unit-testing-with-enzyme) 不同，Preact Testing Library 必须在 DOM 环境中调用。

---

<toc></toc>

---

## 安装

通过以下命令安装 testing-library 的 Preact 适配器：

```bash
npm install --save-dev @testing-library/preact
```

> 注意：该库依赖于存在的 DOM 环境。如果您使用 [Jest](https://github.com/facebook/jest)，它已经包含并默认启用。如果您使用其他测试运行器，如 [Mocha](https://github.com/mochajs/mocha) 或 [Jasmine](https://github.com/jasmine/jasmine)，您可以通过安装 [jsdom](https://github.com/jsdom/jsdom) 为 node 添加 DOM 环境。

## 使用

假设我们有一个 `Counter` 组件，它显示一个初始值，并带有一个更新它的按钮：

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export function Counter({ initialCount }) {
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

我们要验证我们的 Counter 显示初始计数，并且点击按钮将增加它。使用您选择的测试运行器，如 [Jest](https://github.com/facebook/jest) 或 [Mocha](https://github.com/mochajs/mocha)，我们可以编写这两个场景：

```jsx
import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';

import Counter from '../src/Counter';

describe('Counter', () => {
	test('应该显示初始计数', () => {
		const { container } = render(<Counter initialCount={5} />);
		expect(container.textContent).toMatch('当前值: 5');
	});

	test('点击"增加"按钮后应该增加', async () => {
		render(<Counter initialCount={5} />);

		fireEvent.click(screen.getByText('增加'));
		await waitFor(() => {
			// .toBeInTheDocument() 是来自 jest-dom 的断言。
			// 否则您可以使用 .toBeDefined()。
			expect(screen.getByText('当前值: 6')).toBeInTheDocument();
		});
	});
});
```

您可能已经注意到了 `waitFor()` 调用。我们需要这个来确保 Preact 有足够的时间渲染到 DOM 并刷新所有待处理的效果。

```jsx
test('应该增加计数器", async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('增加'));
  // 错误：Preact 可能还没有完成渲染
  expect(screen.getByText("当前值: 6")).toBeInTheDocument();
});
```

在底层，`waitFor` 重复调用传递的回调函数，直到它不再抛出错误或超时（默认：1000ms）。在上面的例子中，我们知道更新完成是在计数器增加并且新值被渲染到 DOM 中时。

我们也可以使用 "findBy" 版本的查询而不是 "getBy" 来以异步优先的方式编写测试。异步查询在底层使用 `waitFor` 重试，并返回 Promise，所以您需要等待它们。

```jsx
test('应该增加计数器", async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('增加'));

  await screen.findByText('当前值: 6'); // 等待更改的元素

  expect(screen.getByText("当前值: 6")).toBeInTheDocument(); // 通过
});
```

## 查找元素

有了完整的 DOM 环境，我们可以直接验证我们的 DOM 节点。通常，测试会检查存在的属性，如输入值，或者元素出现/消失。为此，我们需要能够在 DOM 中定位元素。

### 使用内容

Testing Library 的理念是"您的测试越像您的软件被使用的方式，它们能给您的信心就越大"。

与页面交互的推荐方式是通过文本内容以用户的方式查找元素。

您可以在 Testing Library 文档的 ['应该使用哪个查询'](https://testing-library.com/docs/guide-which-query) 页面上找到选择正确查询的指南。最简单的查询是 `getByText`，它查看元素的 `textContent`。还有针对标签文本、占位符、标题属性等的查询。`getByRole` 查询最强大，因为它抽象了 DOM，并允许您在可访问性树中查找元素，这是屏幕阅读器读取页面的方式。结合 [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques) 和 [`accessible name`](https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_name) 在单个查询中涵盖了许多常见的 DOM 遍历。

```jsx
import { render, fireEvent, screen } from '@testing-library/preact';

test('应该能够登录', async () => {
	render(<MyLoginForm />);

	// 使用文本框角色和可访问名称定位输入框，
	// 无论您使用标签元素、aria-label 还是
	// aria-labelledby 关系，它都是稳定的
	const field = await screen.findByRole('textbox', { name: '登录' });

	// 在字段中输入
	fireEvent.change(field, { value: 'user123' });
});
```

有时，当内容变化很大，或者如果您使用将文本翻译成不同语言的国际化框架时，直接使用文本内容会造成摩擦。您可以通过将文本视为可快照的数据来解决这个问题，使其易于更新，但将真相源保持在测试之外。

```jsx
test('应该能够登录', async () => {
	render(<MyLoginForm />);

	// 如果我们以另一种语言渲染应用，或者更改文本呢？测试失败。
	const field = await screen.findByRole('textbox', { name: '登录' });
	fireEvent.change(field, { value: 'user123' });
});
```

即使您不使用翻译框架，您也可以将字符串保存在单独的文件中，并使用与下面示例相同的策略：

```jsx
test('应该能够登录', async () => {
	render(<MyLoginForm />);

	// 我们可以在测试中直接使用我们的翻译函数
	const label = translate('signinpage.label', 'zh-CN');
	// 快照结果，这样我们知道发生了什么
	expect(label).toMatchInlineSnapshot(`登录`);

	const field = await screen.findByRole('textbox', { name: label });
	fireEvent.change(field, { value: 'user123' });
});
```

### 使用测试 ID

测试 ID 是添加到 DOM 元素的数据属性，用于在选择内容模糊或不可预测的情况下提供帮助，或者与实现细节解耦，如 DOM 结构。当其他查找元素的方法都不合适时，可以使用它们。

```jsx
function Foo({ onClick }) {
	return (
		<button onClick={onClick} data-testid="foo">
			点击此处
		</button>
	);
}

// 仅在文本保持不变时有效
fireEvent.click(screen.getByText('点击此处'));

// 即使我们更改文本也有效
fireEvent.click(screen.getByTestId('foo'));
```

## 调试测试

要调试当前的 DOM 状态，您可以使用 `debug()` 函数打印出一个美化版本的 DOM。

```jsx
const { debug } = render(<App />);

// 打印出一个美化版本的 DOM
debug();
```

## 提供自定义上下文提供者

您经常会遇到依赖共享上下文状态的组件。常见的提供者通常从路由器、状态，有时是主题和其他特定于您的应用的全局提供者。对于每个测试用例重复设置这些可能变得繁琐，因此我们建议通过包装 `@testing-library/preact` 中的那个来创建自定义 `render` 函数。

```jsx
// helpers.js
import { render as originalRender } from '@testing-library/preact';
import { createMemoryHistory } from 'history';
import { FooContext } from './foo';

const history = createMemoryHistory();

export function render(vnode) {
	return originalRender(
		<FooContext.Provider value="foo">
			<Router history={history}>{vnode}</Router>
		</FooContext.Provider>
	);
}

// 像往常一样使用。看，没有提供者！
render(<MyComponent />);
```

## 测试 Preact Hooks

使用 `@testing-library/preact`，我们还可以测试我们 hook 的实现！
想象一下，我们希望为多个组件重用计数器功能（我知道我们喜欢计数器！）并将其提取到一个 hook 中。现在我们想测试它。

```jsx
import { useState, useCallback } from 'preact/hooks';

const useCounter = () => {
	const [count, setCount] = useState(0);
	const increment = useCallback(() => setCount(c => c + 1), []);
	return { count, increment };
};
```

与之前一样，背后的方法类似：我们想要验证我们可以增加我们的计数器。所以我们需要以某种方式调用我们的 hook。这可以通过 `renderHook()` 函数完成，它在内部自动创建一个包围组件。该函数在 `result.current` 下返回当前 hook 返回值，我们可以用它来进行验证：

```jsx
import { renderHook, act } from '@testing-library/preact';
import useCounter from './useCounter';

test('应该增加计数器', () => {
	const { result } = renderHook(() => useCounter());

	// 最初计数器应该是 0
	expect(result.current.count).toBe(0);

	// 让我们通过调用 hook 回调来更新计数器
	act(() => {
		result.current.increment();
	});

	// 检查 hook 返回值是否反映了新状态。
	expect(result.current.count).toBe(1);
});
```

有关 `@testing-library/preact` 的更多信息，请查看 https://github.com/testing-library/preact-testing-library 。
