---
title: 服务端渲染
description: 通过服务端渲染来向用户快速呈现您的 Preact 应用。
---

# 服务端渲染

服务端渲染 (Server-Side Rendering， 或简称为 “SSR”) 将应用先渲染成 HTML 再发送给客户端以加快加载时间。除此之外，服务端渲染还能在测试中大显身手。

---

<toc></toc>

---

## 安装

Preact 的服务端渲染程序有一个[独立仓库](https://github.com/preactjs/preact-render-to-string/)，您可以使用您偏好的包管理器安装：

```bash
npm install -S preact-render-to-string
```

上述命令执行完毕后，您可以直接使用。我们可以通过下面的代码解释其所有的 API：

## 基本用法

基本功能可以通过一个简单的代码片段来最好地解释：

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const App = <div class="foo">内容</div>;

console.log(render(App));
// <div class="foo">内容</div>
```

## 使用 `Suspense` & `lazy` 进行异步渲染 

你可能会发现自己需要渲染动态加载的组件，比如在使用 `Suspense` 和 `lazy` 来实现代码分割时（以及其他一些用例）。异步渲染器会等待 `Promise` 解析完成，从而让你能够完整地构建 `HTML` 字符串：


```jsx
// page/home.js
export default () => {
    return <h1>Home page</h1>;
};
```

```jsx
// main.js
import { Suspense, lazy } from 'preact/compat';

// Creation of the lazy component
const HomePage = lazy(() => import('./pages/home'));

const Main = () => {
    return (
        <Suspense fallback={<p>Loading</p>}>
            <HomePage />
        </Suspense>
    );
};
```

上述内容是使用代码分割的 Preact 应用程序的典型设置，无需进行任何更改即可使用服务器端渲染。

要渲染此应用程序，我们需要略微偏离基本用法示例，并使用 `renderToStringAsync` 导出来渲染我们的应用程序：

```jsx
import { renderToStringAsync } from 'preact-render-to-string';
import { Main } from './main';

const main = async () => {
    // Rendering of lazy components
    const html = await renderToStringAsync(<Main />);

    console.log(html);
    // <h1>Home page</h1>
};

// Execution & error handling
main().catch((error) => {
    console.error(error);
});
```

## 浅层渲染 (Shallow Rendering)

有些时候，您不需要渲染整个元素树。为此，您可以使用浅层渲染程序来输出子元素名称，而非其返回值。

```jsx
import { shallow } from 'preact-render-to-string';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

console.log(shallow(App));
// <div class="foo"><Foo /></div>
```

## 美化模式

如果您需要格式化/美化输出结果的话，没问题！您可以传入 `pretty` 选项来保留输出结果的空格和缩进。

```jsx
import render from 'preact-render-to-string/jsx';
import { h } from 'preact';

const Foo = () => <div>foo</div>;
const App = <div class="foo"><Foo /></div>;

console.log(render(App, {}, { pretty: true }));
// 日志：
// <div class="foo">
//   <div>foo</div>
// </div>
```

## JSX 模式

JSX 渲染模式特别适合快照测试。此渲染模式会将渲染内容视为 JSX。

```jsx
import render from 'preact-render-to-string/jsx';
import { h } from 'preact';

const App = <div data-foo={true} />;

console.log(render(App));
// 日志：<div data-foo={true} />
```
