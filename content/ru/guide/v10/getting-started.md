---
name: Первые шаги
description: 'Как начать работу с Preact. Мы научимся настраивать инструменты (если таковые имеются) и приступим к написанию приложения.'
---

# Первые шаги

Впервые в Preact и Virtual DOM? Ознакомьтесь с [учебником](/tutorial).

Это руководство поможет вам приступить к разработке приложений Preact, используя 3 популярных варианта.
Если вы новичок в Preact, мы рекомендуем начать с [Vite](#create-a-vite-powered-preact-app).

---

<div><toc></toc></div>

---

## Не требуются инструменты сборки

Preact упакован для использования непосредственно в браузере и не требует сборки или использования каких-либо инструментов:

```html
<script type="module">
  import { h, render } from 'https://esm.sh/preact';

  // Создаём свое приложение
  const app = h('h1', null, 'Привет, мир!');

  render(app, document.body);
</script>
```

[🔨 Изменить на Glitch](https://glitch.com/~preact-no-build-tools)

Основным недостатком такой разработки является отсутствие JSX, который требует этапа сборки. Эргономичная и производительная альтернатива JSX описана в следующем разделе.

### Альтернативы JSX

Написание необработанных вызовов `h` или `createElement` может быть утомительным. Преимущество JSX в том, что он похож на HTML, что, по нашему опыту, делает его более понятным для многих разработчиков. Однако JSX требует этапа сборки, поэтому мы настоятельно рекомендуем использовать альтернативу под названием [HTM][htm].

[HTM][htm] — это JSX-подобный синтаксис, который работает в стандартном JavaScript. Вместо шага сборки он использует собственный синтаксис JavaScript — [теговые шаблоны](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Template_literals#%D1%82%D0%B5%D0%B3%D0%BE%D0%B2%D1%8B%D0%B5_%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B), который был добавлен в 2015 году и поддерживается во [всех современных браузерах](https://caniuse.com/#feat=template-literals). Этот способ написания приложений для Preact становится всё более популярным, поскольку в нем меньше движущихся частей, в которых нужно разбираться, чем в традиционном инструментарии для сборки интерфейса.

```html
<script type="module">
  import { h, render } from 'https://esm.sh/preact';
  import htm from 'https://esm.sh/htm';

  // Инициализация htm с помощью Preact
  const html = htm.bind(h);

  function App(props) {
    return html`<h1>Привет, ${props.name}!</h1>`;
  }

  render(html`<${App} name="мир" />`, document.body);
</script>
```

[🔨 Изменить на Glitch](https://glitch.com/~preact-with-htm)

> **Совет:** HTM также предоставляет удобную версию Preact с возможностью однократного импорта:
>
> `import { html, render } from 'https://esm.sh/htm/preact/standalone'`

Более полный пример см. в разделе [Использование Preact с HTM и ImportMaps](#using-preact-with-htm-and-importmaps), а дополнительную информацию о HTM можно найти в [документации][htm].

[htm]: https://github.com/developit/htm

## Создание приложений Preact на базе Vite

За последние несколько лет [Vite](https://vitejs.dev) стал невероятно популярным инструментом для создания приложений на многих фреймворках, и Preact не является исключением. Он построен на базе таких популярных инструментов, как ES-модули, Rollup и ESBuild. Vite, используя наш инициализатор или свой шаблон Preact, не требует никакой конфигурации или предварительных знаний для начала работы, и эта простота делает его очень популярным способом использования Preact.

Для быстрого начала работы с Vite можно воспользоваться нашим инициализатором `create-preact`. Это интерактивное приложение с интерфейсом командной строки (CLI), которое может быть запущено в терминале на вашем компьютере. С его помощью можно создать новое приложение, выполнив следующее:

```bash
npm init preact
```

Это поможет вам создать новое приложение Preact и предоставит некоторые возможности, такие как TypeScript, маршрутизация (через `preact-iso`) и поддержка ESLint.

> **Совет:** Ни одно из этих решений не должно быть окончательным, вы всегда можете добавить или убрать их из проекта позже, если передумаете.

### Подготовка к разработке

Теперь мы готовы к запуску нашего приложения. Чтобы запустить сервер разработки, выполните следующую команду в папке только что созданного проекта:

```bash
# Переходим в папку сгенерированного проекта
cd my-preact-app

# Запускаем сервер разработки
npm run dev
```

После запуска сервер выведет URL-адрес локальной разработки для открытия в браузере.
Теперь вы готовы приступить к созданию своего приложения!

### Создание производственной сборки

Наступает момент, когда необходимо развернуть приложение в каком-либо месте. Vite поставляется с удобной командой `build`, которая позволяет создать высокооптимизированную сборку.

```bash
npm run build
```

По завершении у вас будет новая папка `dist/`, которую можно будет развернуть непосредственно на сервере.

> Полный список всех доступных команд и их параметров см. в [документации Vite CLI](https://vitejs.dev/guide/cli.html).

## Интеграция в существующий конвейер

Если у вас уже есть настроенный конвейер инструментов, весьма вероятно, что он включает в себя сборщик. Наиболее популярными вариантами являются [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org) или [parcel](https://parceljs.org/). Preact работает со всеми из коробки, никаких серьезных изменений не требуется!

### Настройка JSX

Чтобы транспилировать JSX, вам понадобится плагин Babel, который преобразует его в действительный код JavaScript. Мы все используем [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx). После установки вам необходимо указать функцию для JSX, которую следует использовать:

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
        "pragma": "h",
        "pragmaFrag": "Fragment"
      }
    ]
  ]
}
```

> [Babel](https://babeljs.io/) имеет одну из лучших документаций. Мы настоятельно рекомендуем проверить её, чтобы получить ответы на вопросы, касающиеся Babel и его настройки.

### Псевдонимы React для Preact

В какой-то момент вы, вероятно, захотите использовать обширную экосистему React. Библиотеки и компоненты, изначально написанные для React, без проблем работают с нашим уровнем совместимости. Чтобы использовать его, нам нужно указать весь импорт `react` и `react-dom` в Preact. Этот шаг называется _псевдонимы_.

> **Примечание:** Если вы используете Vite, Preact CLI или WMR, эти псевдонимы обрабатываются автоматически по умолчанию.

#### Псевдонимы в Webpack

Чтобы создать псевдоним для любого пакета в Webpack, вам необходимо добавить раздел `resolve.alias` в вашу конфигурацию. В зависимости от используемой вами конфигурации этот раздел может уже присутствовать, но в нем могут отсутствовать псевдонимы Preact.

```js
const config = {
  //...snip
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat', // Должно быть ниже test-utils
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
};
```

#### Псевдонимы в Node

При работе в Node псевдонимы бандлера (Webpack, Rollup и т. д.) не будут работать, как это видно в NextJS. Чтобы это исправить, мы можем использовать псевдонимы непосредственно в нашем `package.json`:

```json
{
  "dependencies": {
    "react": "npm:@preact/compat",
    "react-dom": "npm:@preact/compat"
  }
}
```

#### Псевдонимы в Parcel

Parcel использует стандартный файл `package.json` для чтения параметров конфигурации под ключом `alias`.

```json
{
  "alias": {
    "react": "preact/compat",
    "react-dom/test-utils": "preact/test-utils",
    "react-dom": "preact/compat",
    "react/jsx-runtime": "preact/jsx-runtime"
  }
}
```

#### Псевдонимы в Rollup

Чтобы создать псевдоним в Rollup, вам необходимо установить [@rollup/plugin-alias](https://github.com/rollup/plugins/tree/master/packages/alias).
Плагин необходимо разместить перед вашим [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)

```js
import alias from '@rollup/plugin-alias';

module.exports = {
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
      ],
    }),
  ],
};
```

#### Псевдонимы в Jest

[Jest](https://jestjs.io/) позволяет перезаписывать пути к модулям аналогично сборщикам. Эти перезаписи настраиваются с использованием регулярных выражений в вашей конфигурации Jest:

```json
{
  "moduleNameMapper": {
    "^react$": "preact/compat",
    "^react-dom/test-utils$": "preact/test-utils",
    "^react-dom$": "preact/compat",
    "^react/jsx-runtime$": "preact/jsx-runtime"
  }
}
```

#### Псевдонимы в TypeScript

TypeScript, даже если он используется вместе со сборщиком, имеет свой собственный процесс разрешения типов. Чтобы гарантировать использование типов Preact вместо типов React, вам нужно добавить следующую конфигурацию в ваш `tsconfig.json` (или `jsconfig.json`):

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react/jsx-runtime": ["./node_modules/preact/jsx-runtime"],
      "react-dom": ["./node_modules/preact/compat/"]
    }
  }
}
```

Кроме того, вы можете включить `skipLibCheck`, как мы это делаем в примере выше. Некоторые библиотеки React используют типы, которые не могут быть предоставлены `preact/compat` (хотя мы делаем всё возможное, чтобы это исправить), и поэтому эти библиотеки могут быть источником ошибок компиляции TypeScript. Установив `skipLibCheck`, вы можете сообщить TS, что ему не нужно выполнять полную проверку всех файлов `.d.ts` (обычно они ограничены вашими библиотеками в `node_modules`), что исправит эти ошибки.

### Использование Preact с HTM и ImportMaps

[Карта импорта](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) — это новая функция,
позволяющая вам контролировать, как браузеры разрешают спецификаторы модулей, обычно для преобразования пустых спецификаторов, таких как `preact`, в URL-адрес CDN, например `https://esm.sh/preact`. Хотя многие предпочитают эстетику импортных карт, существуют также реальные преимущества их использования, такие как больший контроль над разрешением модуля (читайте дальше, чтобы узнать, как использовать псевдонимы) и решение бремени (а также возможных ошибок), возникающее при копировании URL-адресов CDN из файла в файл.

Вот пример используемой карты импорта:

```html
<script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.19.2",
      "preact/": "https://esm.sh/preact@10.19.2/",
      "htm/preact": "https://esm.sh/htm@3.1.1/preact?external=preact"
    }
  }
</script>

<script type="module">
  import { render } from 'preact';
  import { useReducer } from 'preact/hooks';
  import { html } from 'htm/preact';

  export function App() {
    const [count, add] = useReducer((a, b) => a + b, 0);

    return html`
      <button onClick=${() => add(-1)}>Уменьшить</button>
      <input readonly size="4" value=${count} />
      <button onClick=${() => add(1)}>Увеличить</button>
    `;
  }

  render(html`<${App} />`, document.body);
</script>
```

> **Примечание:** В приведённом выше примере мы используем `?external=preact`, так как многие CDN предоставят запрашиваемый вами модуль, а также его зависимости. Однако это может привести к сбою в работе Preact, поскольку он (и React тоже) ожидают загрузки как синглтоны (одновременно активен только 1 экземпляр). Использование `?external` сообщает `esm.sh`, что ему не нужно предоставлять копию `preact`, мы можем справиться с этим сами с помощью нашей карты импорта.

Вы даже можете использовать карты импорта для поддержки псевдонимов:

```html
<script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/preact@10.19.2/compat",
      "react-dom": "https://esm.sh/preact@10.19.2/compat"
    }
  }
</script>
```
