---
name: Switching to Preact from React
permalink: '/guide/switching-to-preact
---



# 用 Preact 替换 React

有两种途径把 React 替换成 Preact：

1. 安装 `preact-compat`  
2. 把 React 的入口替换为 `preact`，并解决代码冲突

## 简单的 `preact-compat` Alias 设置

要想转换成 Preact，只需简单的安装，并把 `react` 和 `react-dom` 的 alias 设置为 `preact-compat`。通过这种方法，你可以在不改变工作流和代码的情况下继续使用 React/ReactDOM 的语法结构。

`preact-compat` 会让你编译后的代码量增加 2kb 左右，但是它胜在支持 npm 仓库中的绝大多数的 React 模块。另外，`preact-compat` 包在 Preact 的基础上提供必要的适配，让它表现的跟 `react` 和 `react-dom` 一样。

安装过程分为两步。第一步，安装 preact 和 preact-compat（它们是独立的包）：

```sh
npm i -S preact preact-compat
```

安装依赖项后，你需要在构建工具中，通过 alias 把 React 的入口指向 Preact。

### 怎样设置 preact-compat 的 Alias

现在，你已经安装了依赖包。接下来，你需要在构建工具中把所有的 imports/requires 中的 `react` 或 `react-dom` 的路径指向到 `preact-compat`。


#### 通过 Webpack 设置 Alias

根据 [resolve.alias](https://webpack.github.io/docs/configuration.html#resolve-alias) 文档，在 `webpack.config.js` 中进行配置。

```json
{
  "resolve": {
    "alias": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### 通过 Browserify 设置 Alias

如果你使用的是 Browserify，通过 [aliasify](https://www.npmjs.com/package/aliasify) 来设置 Alias。

首先，安装 aliasify：
`npm i -D aliasify`

然后，在 `package.json`，配置 aliasify，使得 redirect react 路径指向 preact-compat：

```json
{
  "aliasify": {
    "aliases": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```


#### 手动修改别名

如果你没有使用构建工具，并且想要项目以后都使用 `preact-compat`，你可以在代码中的所有 imports/requires 语句中进行查找替换。
> **find:**    `(['"])react(-dom)?\1`
>
> **replace:** `$1preact-compat$1`

在这种情况中，你会发现这比使用 `preact-compat` 更彻底。Preact 的功能非常齐全，很多常用的 React 代码库能很轻易的转换到 `preact`。
转换途径会在下一部份覆盖到。

### Build & Test

** 你已经完成了！**
现在，你可以运行你的 build 命令，所有的 React 入口都会被替换成 `preact-compat`，你的 bundle 文件会大大的变小。当然，你最好进行后续的测试环节，并运行你的项目来确保正常运行。

## 最理想的 Preact 迁移方案
你没必在代码中中去用 `preact-compat` 来完成 React 到 Preact 的迁移。Preact 的 api 几乎跟 React 的 api 一致。很多 React 应用的迁移只需要很少甚至不用作改动。

一般来说，Preact 的迁移流程包含以下步骤：
### 1. 安装 Preact

这一步很简单，在使用这个库之前，你必须先安装

```sh
npm install --save preact  # or: npm i -S preact
```

### 2. JSX 语法：转换到 `h()`
> ** 背景：** [JSX] 扩展语法是从 React 独立出来的语法，[Babel] 和 [Bublé] 这些编译器默认会把调用 `React.createElement()` 来编译 JSX。这其中有一些历史原因，但是值得探究的是，这种方式来源于一个已有的技术 [Hyperscript]。Preact 向它致敬，并试图用使用 `h()` 来更好理解并简化 jsx。

> ** 长话短说：** 我们需要把 `React.createElement()` 转换成 preact 的 `h()`


在 JSX 中，`h()` 用于生成每一个元素：

> `<div />` 编译成 `h('div')`
>
> `<Foo />` 编译成 `h(Foo)`
>
> `<a href="/">Hello</a>` 编译成 `h('a', { href:'/' }, 'Hello')`


在上面的每一个例子中，`h` 是我们声明的函数来实现 JSX 语法。

#### 通过 Babel

如果你正在使用 Babel，你可以在 `.babelrc` 或者 `package.json` 中设置 JSX：

```json
{
  "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
}
```

#### 通过 Comments

如果你使用基于 Babel 的在线编辑器（比如 JSFiddle、Codepen），你可以在代码顶部定义一个 comment 来设置 JSX Pragm：

`/** @jsx h */`


#### 通过 Bublé

[Bublé](https://buble.surge.sh) 默认支持 JSX 语法，只需要设置 `jsx` 选项：

`buble({ jsx: 'h' })`


### 3. 更新剩下的代码

Preact 兼容 React 的接口，但特意去弃用了部份接口。在这些接口中，最值得注意的是 `createClass()`。


值得理解的是，JavaScript 类是内置于虚拟 DOM 的库中去代表组件的类型，这在管理组件生命周期的细微差别中起到重要作用。

如果你的代码严重依赖 `createClass()`，你仍然有一个好的选择：Laurence Dorman 维护的 [standalone `createClass()` implementation](https://github.com/ld0rman/preact-classless-component) 能直接用于 preact，而它仅仅只有几百字节的大小。除此之外，你可以用 Vu Tran 的 [preact-codemod](https://github.com/vutran/preact-codemod) 来实现 `createClass()` calls 到 ES Classes 的转换。


另一个值得注意的不同点是 Preact 默认只支持函数 Refs。字符串 refs 在 React 中被弃用并很快会被移除，因为他们引入了不少的复杂度但收益却很少。

如果你想继续使用字符串 refs,[this tiny linkedRef function](https://gist.github.com/developit/63e7a81a507c368f7fc0898076f64d8d)提供了一个不过时的版本，它仍然像字符串 Refs 那样通过 `this.refs.$$` 调用。
函数 Refs 也说明为什么函数 Refs 现在更被推荐。




### 4. 简化 Root 节点的 Render

自 React 0.13 版本以来，`render()` 由 `react-dom` 模块提供。Preact 没有使用单独的模块来实现 dom 节点的渲染因为它本身就是一个很好的 dom 渲染器。

所以，最后一步把 `ReactDOM.render()` 转换成 preact 的 `render()`


```diff
- ReactDOM.render(<App />, document.getElementById('app'));
+ render(<App />, document.body);
```

值得一提的是 Preact 的 `render()` 是无损的，所以组件直接渲染到 `<body>` 是非常合适的（我们甚至鼓励你这样做）。这可能是因为 Preact 不使用你传递的参数来控制根节点。`render()` 的第二个参数事实上是 `父节点` —— 这意味着这是一个将内容渲染进去的 dom 元素。如果你想再次从根元素渲染（比如热模块的替换），render()会把第三个参数作为元素来替换。


```js
// 首次渲染:
render(<App />, document.body);

// 更新:
render(<App />, document.body, document.body.lastElementChild);
```
在上面的例子中，我们依赖于最后一个子元素作为我们之前渲染的根节点。尽管这对于大部份情况都可行（jsfiddles, codepens 等），但最好还是对节点有更好的控制。这就是为什么 render() 返回根节点：你将根节点作为第三个参数传进去，让它适当地重新渲染。接下来的例子展示了 Preact 如何应对 webpack 的 hot module replacement（热替换）而进行重新渲染。


```js
// root 包裹我们应用的根节点:
let root;

function init() {
  root = render(<App />, document.body, root);
}
init();

// example: Re-render on Webpack HMR update:
if (module.hot) module.hot.accept('./app', init);
```


完整的技术可以参考 [preact-boilerplate](https://github.com/developit/preact-boilerplate/blob/master/src/index.js#L6-L18)。



[babel]: https://babeljs.io
[bublé]: https://buble.surge.sh
[JSX]: https://facebook.github.io/jsx/
[JSX Pragma]: http://www.jasonformat.com/wtf-is-jsx/
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
