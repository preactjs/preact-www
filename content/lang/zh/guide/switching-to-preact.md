---
name: Switching to Preact from React
permalink: '/guide/switching-to-preact
---



# 用Preact替换React

有两种途径把React替换成Preact:

1.安装 `preact-compat`  
2.把React的入口替换为`preact`，并解决代码冲突

## 简单的 `preact-compat` Alias设置

要想转换成Preact,只需简单的安装，并把`react` 和 `react-dom`的alias设置为`preact-compat`。通过这种方法,你可以在不改变工作流和代码的情况下继续使用React/ReactDOM的语法结构。

`preact-compat` 会让你编译后的代码量增加2kb左右，但是它胜在支持npm仓库中的绝大多数的React模块。另外，`preact-compat`包在Preact的基础上提供必要的适配，让它表现的跟`react`和`react-dom`一样。

安装过程分为两步。第一步，安装preact 和 preact-compat (它们是独立的包):

```sh
npm i -S preact preact-compat
```

安装依赖项后，你需要在构建工具中，通过alias把React的入口指向Preact。

###怎样设置preact-compat的Alias

现在，你已经安装了依赖包。接下来，你需要在构建工具中把所有的imports/requires中的`react` 或 `react-dom`的路径指向到`preact-compat`


#### 通过Webpack设置Alias

根据[resolve.alias](https://webpack.github.io/docs/configuration.html#resolve-alias)文档，在`webpack.config.js`中进行配置。

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

#### 通过Browserify设置Alias

如果你使用的是Browserify，通过[aliasify](https://www.npmjs.com/package/aliasify)来设置Alias

首先，安装aliasify:  
`npm i -D aliasify`

然后，在`package.json`,配置aliasify，使得redirect react路径指向preact-compat:

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

如果你没有使用构建工具，并且想要项目以后都使用`preact-compat`，你可以在代码中的所有imports/requires语句中进行查找替换。
> **find:**    `(['"])react(-dom)?\1`
>
> **replace:** `$1preact-compat$1`

在这种情况中,你会发现这比使用`preact-compat`更彻底。Preact的功能非常齐全，很多常用的React代码库能很轻易的转换到`preact`。
转换途径会在下一部份覆盖到。

### Build & Test

**你已经完成了!**
现在，你可以运行你的build命令，所有的React入口都会被替换成`preact-compat`，你的bundle文件会大大的变小。当然，你最好进行后续的测试环节，并运行你的项目来确保正常运行。

## 最理想的Preact迁移方案
你没必在代码中中去用`preact-compat`来完成React到Preact的迁移。Preact的api几乎跟React的api一致。很多React应用的迁移只需要很少甚至不用作改动。

一般来说，Preact的迁移流程包含以下步骤：
### 1. 安装 Preact

这一步很简单，在使用这个库之前，你必须先安装

```sh
npm install --save preact  # or: npm i -S preact
```

### 2. JSX Pragma: transpile to `h()`
> **背景:**  [JSX] 扩展语法是从React独立出来的语法，[Babel] 和 [Bublé]这些编译器默认会把调用`React.createElement()`来编译JSX。这其中有一些历史原因，但是值得探究的是，这种方式来源于一个已有的技术[Hyperscript]。Preact向它致敬，并试图用使用`h()`来更好理解并简化jsx。

> **长话短说:** 我们需要把`React.createElement()`转换成preact的`h()`


在JSX中，`h()`用于生成每一个元素：

> `<div />` 编译成 `h('div')`
>
> `<Foo />` 编译成 `h(Foo)`
>
> `<a href="/">Hello</a>` 编译成 `h('a', { href:'/' }, 'Hello')`


在上面的每一个例子中，`h`是我们声明的函数来实现JSX语法。

#### 通过 Babel

如果你正在使用Babel，你可以在`.babelrc`或者`package.json`中设置JSX 

```json
{
  "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
}
```

#### 通过 Comments

如果你使用基于Babel的在线编辑器（比如JSFiddle、Codepen），你可以在代码顶部定义一个comment来设置JSX Pragm。

`/** @jsx h */`


#### 通过 Bublé

[Bublé]默认支持JSX语法，只需要设置`jsx`选项：

`buble({ jsx: 'h' })`


### 3. 更新剩下的代码

Preact兼容React的接口，但特意去弃用了部份接口。在这些接口中，最值得注意的是`createClass()`。

<!-- 值得理解的是，JavaScript类是内在的。。。。来代表组件的类型，这在管理组件生命周期的细微差别中起到重要
作用。 -->

如果你的代码严重依赖`createClass()`，你仍然有一个好的选择：Laurence Dorman维护的[standalone `createClass()` implementation](https://github.com/ld0rman/preact-classless-component)能直接用于preact，而它仅仅只有几百字节的大小。除此之外，你可以用Vu Tran的[preact-codemod](https://github.com/vutran/preact-codemod)来实现`createClass()` calls到ES Classes的转换。


另一个值得注意的不同点是Preact默认只支持函数Refs。字符串refs在React中被弃用并很快会被移除，因为他们介绍了一个

如果你想继续使用字符串refs,[this tiny linkedRef function](https://gist.github.com/developit/63e7a81a507c368f7fc0898076f64d8d)提供了一个不过时的版本




### 4. 简化Root节点的 Render

自React 0.13版本以来，`render()`由`react-dom`模块提供。Preact没有使用单独的模块来实现dom节点的渲染因为它本身就是一个很好的dom渲染器。

所以，最后一步把`ReactDOM.render()` 转换成preact的`render()`


```diff
- ReactDOM.render(<App />, document.getElementById('app'));
+ render(<App />, document.body);
```

值得一提的是Preact的`render()`是无损的，所以组件直接渲染到`<body>`是非常合适的（我们甚至鼓励你这样做）。这可能是因为Preact不使用你传递的参数来控制根节点。`render()`的第二个参数事实上是`父节点`－这意味着这是一个dom元素。如果你想再次从根元素渲染（比如热模块的替换），`render()`会把第三个参数作为元素来替换。 

```js
// 首次渲染:
render(<App />, document.body);

// 原地更新:
render(<App />, document.body, document.body.lastElementChild);
```

<!-- 在上面的例子汇总，我们用最后的子节点来作为我们之前的根节点
这可以在很多种情况中使用（jsfiddles, codepens等）
这就是为什么`render()`返回的是根元素：

接下来的例子展示在Webpack的Hot Module Replacement updates中作出响应 -->


```js
// root holds our app's root DOM Element:
let root;

function init() {
  root = render(<App />, document.body, root);
}
init();

// example: Re-render on Webpack HMR update:
if (module.hot) module.hot.accept('./app', init);
```


完整的技术可以参考[preact-boilerplate](https://github.com/developit/preact-boilerplate/blob/master/src/index.js#L6-L18).



[babel]: https://babeljs.io
[bublé]: https://buble.surge.sh
[JSX]: https://facebook.github.io/jsx/
[JSX Pragma]: http://www.jasonformat.com/wtf-is-jsx/
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
