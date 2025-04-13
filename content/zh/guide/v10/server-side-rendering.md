---
title: 服务端渲染
description: '通过服务端渲染来向用户快速呈现您的 Preact 应用。'
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

```jsx
import render from 'preact-render-to-string';
import { h } from 'preact';

const App = <div class="foo">内容</div>;

console.log(render(App));
// <div class="foo">内容</div>
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
