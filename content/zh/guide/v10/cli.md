---
name: CLI
permalink: '/cli'
description: 'Preact CLI 文档'
---

# Preact CLI

[Preact CLI](https://github.com/preactjs/preact-cli/) 帮您快速构建运行飞快的渐进式 Web 应用。

Preact CLI 帮您快速新建一个立即可用的简单、易懂的脚手架项目，免去您手动创建新项目的麻烦。Preact 基于您所熟悉的开源工具构建，但您使用 CLI 则无需自己手动配置第三方工具——如 Webpack、Babel、Terser 等等。热加载、行内嵌入关键 CSS 等功能已自动为您设置完毕。

Preact CLI 为您的应用指向绝佳性能之路。新建项目在生产模式中仅包含 4.5 kB 的 JavaScript 代码，即便是在缓慢的设备和网络环境也能在三秒内开始交互。

## 功能特性

Preact CLI 自带如下功能特性：

- 生成 Lighthouse 满分成绩的脚手架项目。 ([证明](https://googlechrome.github.io/lighthouse/viewer/?gist=142af6838482417af741d966e7804346))
- 根据路由自动切割代码。
- 使用 async! 前缀显式切割组件。
- 为不同的浏览器加载不同的 JavaScript。
- 使用 Workbox 自动生成 Service Worker 进行离线缓存。
- 支持快速载入的 PRPL 范式。
- 无需配置的预渲染/服务端渲染脱水。
- 支持 CSS 模块、LESS、Sass、Stylus，附带 Autoprefixer。
- 使用自带工具监视您的打包/分块大小。
- 自动挂载应用，附带调试助手及支持热模块替换。
- Preact。
- preact-router。
- 为 fetch 和 Promise 按需加载 1.5kb 的 Polyfill。

如果您有兴趣的话，欢迎您开始阅读[开始入门](/guide/v10/cli/getting-started)一章。
