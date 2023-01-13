---
name: 'Preact CLI：预渲染'
permalink: '/cli/pre-rendering'
description: '使用 Preact CLI 自动预渲染页面。'
---

# 预渲染页面

Preact CLI 会将您的页面自动预渲染成静态 HTML 来加速访问。

在为生产模式构建应用时，Preact CLI 会自动渲染您的组件，并将渲染结果保存为静态 HTML。这样，您网站的访客甚至在加载 JavaScript 前就能看到预渲染的 HTML 版本网站。

> **⚠️ 请注意：**预渲染时，您的组件模块会在 Node.js 环境中执行，此环境缺失大部分 Web API。为此，您需要将部分代码使用缺失 API 的代码包裹在 `if (typeof window !== 'undefined')` 判断语句中。

## 多 URL 和自定义数据

出厂情况下，Preact 仅预渲染主页。为了预渲染其他 URL，您需要在项目中添加 `prerender-urls.json` 文件。您可以在此文件中为每个 URL 传递额外数据到 `<App />` 组件的属性。

```json
[
  {
    "url": "/", // 必填
    "title": "可爱狗狗",
    "breeds": ["柴犬", "金毛", "哈士奇"]
  },
  {
    "url": "/breeds/shiba", // 必填
    "title": "柴犬！",
    "photo": "/assets/shiba.jpg"
  }
]
```

### 动态预渲染

除了手动添加 `prerender-urls.json` 文件的方式之外，您也可以从 JavaScript 文件中导出相同信息。您需要在此文件中导出返回预渲染配置的函数才能让 Preact CLI 读取。

除了以上操作之外，您还需要在 Preact CLI 中指定 JavaScript 配置文件的文件名：

`preact build --prerenderUrls ./prerender-urls.js`

我们预渲染数据的 `prerender-urls.js` 可能长这样：

```js
const breeds = ["柴犬", "金毛", "哈士奇"];

module.exports = function() {
  return [
    {
      url: "/",
      title: "可爱狗狗",
      breeds
    },
    {
      url: "/breeds/shiba",
      title: "柴犬！",
      photo: "/assets/shiba.jpg",
      breeds
    }
  ];
};
```

#### 在 HTML 中使用预渲染的值

上述方法在预渲染中提供的值可在 `template.html` 和其他生成的 `html` 文件中使用，您可在 HTML 中通过 `htmlWebpackPlugin.options.CLI_DATA.preRenderData.<键值>` 为预渲染提供元标签和其他有用的数据。

```html
  <html>
    <head>
      <meta name="demo-keyword" content="<%= htmlWebpackPlugin.options.CLI_DATA.preRenderData.blah %>">
    </head>
  </html>
```

### 使用外部数据来源

您可使用 Preact CLI 的自定义预渲染系统与外部数据源 (如 CMS) 集成。为此，您需要在 `prerender-urls.js` 文件中导出一个异步函数：

```js
module.exports = async function() {
  const response = await fetch('https://cms.example.com/pages/');
  const pages = await response.json();
  return pages.map(page => ({
    url: page.url,
    title: page.title,
    meta: page.meta,
    data: page.data
  }));
};
```

## 消费预渲染数据

所有预渲染的页面内都包含一个带有预渲染数据的内联脚本：

```html
<script type="__PREACT_CLI_DATA__">{
  "preRenderData": {
    "url": "/",
    "photo": "/assets/shiba.jpg"
  }
}</script>
```

您可以在代码中使用此脚本进行“脱水”处理，这非常适合搭配 Redux 和 GraphQL 等状态管理方案使用。JSON 数据中存在的 `"url"` 键确保其只在脱水化处理预渲染路由时使用。

> **💡 小提示：**当用户首次使用您的应用时，HTML 中只会存在访问页面的预渲染数据，避免额外下载内容。当用户通过客户端导航跳转到其他路由时，访问页面中不会含有内联预渲染数据。若您想要获取访问页面的数据，您可以向 `/<新路由>/preact_prerender_data.json` 发送请求。此文件由 Preact CLI 在构建时自动生成。

### 使用 `@preact/prerender-data-provider`

为了简化上述步骤，我们为您打造了一款自动脱水处理和获取数据的包装库。该库会在访问匹配 URL 时自动搜索并解析内联脚本中的预渲染数据，或在客户端导航时自动获取预渲染数据。

要使用此库，请通过 npm 安装：

`npm i -D @preact/prerender-data-provider`

安装完毕后，您可导入该库并在 App 组件 (`components/app.js`) 中使用：

```jsx
import { Provider } from '@preact/prerender-data-provider';

export default class App extends Component {
  // ...
  render(props) {
    return (
      <Provider value={props}>
        // 此处应有应用逻辑！
      </Provider>
    )
  }
}
```

您的路由组件可通过 `prerender-data-provider` 访问预渲染数据：

```jsx
import { usePrerenderData } from '@preact/prerender-data-provider';

export default function MyRoute(props) {

  // 您也可以通过使用 usePrerenderData(props, false); 的方式让钩子不自动获取预渲染数据
  const [data, loading, error] = usePrerenderData(props);

  if (loading) return <h1>加载中...</h1>;

  if (error) return <p>错误：{error}</p>;

  return (
    <div>
      // 在此处使用数据
    </div>
  );
}
```

向 `usePrerenderData` 的第二个参数传递 `false` 将禁用动态获取 `preact_prerender_data.json` 功能。除了上述的钩子外，您还可以使用 `<PrerenderData>`，其方法体与钩子相同。
