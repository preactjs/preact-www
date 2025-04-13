---
title: Рабочие процессы без сборки
description: 'Хотя такие инструменты сборки, как Webpack, Rollup и Vite, невероятно мощны и полезны, Preact полностью поддерживает создание приложений без них.'
---

# Рабочие процессы без сборки

Хотя такие инструменты сборки, как Webpack, Rollup и Vite, невероятно мощны и полезны, Preact полностью поддерживает сборку приложения без них.

Рабочие процессы без сборки — это способ разработки веб-приложений без использования инструментов сборки, вместо этого полагаясь на браузер для облегчения загрузки и выполнения модулей. Это отличный способ начать работу с Preact, который может отлично работать в любых масштабах.

---

<toc></toc>

---

## Карты импорта

[Карта импорта](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) — это новая функция браузера,
позволяющая вам контролировать, как браузеры разрешают спецификаторы модулей, обычно для преобразования пустых спецификаторов, таких как `preact`, в URL-адрес CDN, например `https://esm.sh/preact`. Хотя многие предпочитают эстетику карт импорта, существуют также реальные преимущества их использования, такие как упрощение версионирования, уменьшение/устранение дублирования и
лучший доступ к более мощным функциям CDN.

В общем, мы рекомендуем использовать карты импорта для тех, кто решает обойтись без инструментов сборки, так как они помогают решить некоторые проблемы, с которыми вы можете столкнуться при использовании простых URL-адресов CDN в ваших спецификаторах импорта (подробнее об этом ниже).

### Пример использования

На [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) есть много информации о том, как использовать карты импорта, но базовый пример выглядит следующим образом:

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="importmap">
      {
        "imports": {
          "preact": "https://esm.sh/preact@10.23.1",
          "htm/preact": "https://esm.sh/htm@3.1.1/preact?external=preact"
        }
      }
    </script>
  </head>
  <body>
    <div id="app"></div>

    <script type="module">
      import { render } from 'preact';
      import { html } from 'htm/preact';
      export function App() {
        return html`<h1>Привет, мир!</h1>`;
      }
      render(html`<${App} />`, document.getElementById('app'));
    </script>
  </body>
</html>
```

Мы создаем тег `<script>` с атрибутом `type="importmap"`, а затем определяем в нем модули, которые хотим использовать, в виде JSON. Позже, в теге `<script type="module">`, мы можем импортировать эти модули с помощью голых спецификаторов, аналогично тому, что вы видите в Node.

> **Важно:** Мы используем `?external=preact` в приведённом выше примере, поскольку https://esm.sh поможет предоставить
> модуль, который вы запрашиваете, а также его зависимости — для `htm/preact` это означает также предоставление
> копии `preact`. Однако Preact должен использоваться только как синглтон, и в вашем приложении должна быть только одна его копия.
>
> Используя `?external=preact`, мы сообщаем `esm.sh`, что он не должен предоставлять копию `preact`, мы можем обрабатывать
> это сами. Поэтому браузер будет использовать нашу карту импорта для разрешения `preact`, используя один экземпляр Preact
> для всего кода.

### Рецепты и общие шаблоны

Хотя этот список не является исчерпывающим, здесь приведены некоторые общие шаблоны и рецепты, которые могут пригодиться вам при работе с картами импорта. Если у вас есть шаблон, которым вы хотели бы поделиться, [дайте нам знать](https://github.com/preactjs/preact-www/issues/new)!

В этих примерах мы будем использовать https://esm.sh в качестве CDN — это великолепная CDN, ориентированная на ESM, которая немного более гибкая и мощная, чем некоторые другие, но ни в коем случае не ограничивается ею. Как бы вы ни решили обслуживать свои модули, убедитесь, что вы знакомы с политикой в отношении зависимостей: Дублирование `preact` и некоторых других библиотек вызовет (часто тонкие и неожиданные) проблемы. Для `esm.sh` мы решаем эту проблему с помощью параметра запроса `?external`, но другие CDN могут работать по-другому.

#### Preact с хуками, сигналами и HTM

```html
<script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.23.1",
      "preact/": "https://esm.sh/preact@10.23.1/",
      "@preact/signals": "https://esm.sh/@preact/signals@1.3.0?external=preact",
      "htm/preact": "https://esm.sh/htm@3.1.1/preact?external=preact"
    }
  }
</script>
```

#### Использование Preact вместо React

```html
<script type="importmap">
  {
    "imports": {
      "preact": "https://esm.sh/preact@10.23.1",
      "preact/": "https://esm.sh/preact@10.23.1/",
      "react": "https://esm.sh/preact@10.23.1/compat",
      "react/": "https://esm.sh/preact@10.23.1/compat/",
      "react-dom": "https://esm.sh/preact@10.23.1/compat",
      "@mui/material": "https://esm.sh/@mui/material@5.16.7?external=react,react-dom"
    }
  }
</script>
```

## HTM

Хотя JSX обычно является самым популярным способом написания приложений на Preact, он требует этапа сборки для преобразования нестандартного синтаксиса во что-то, что браузеры и другие среды выполнения могут понимать нативно. Однако ручное написание вызовов `h`/`createElement` может быть немного утомительным и не самым удобным, поэтому мы рекомендуем альтернативу, похожую на JSX, под названием [HTM](https://github.com/developit/htm).

HTM не требует этапа сборки (хотя он и может использовать его, см. [`babel-plugin-htm`](https://github.com/developit/htm/tree/master/packages/babel-plugin-htm)), а использует синтаксис [шаблонных строк](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates), который является функцией JavaScript, существующей с 2015 года и поддерживаемой во всех современных браузерах. Это всё более популярный способ написания приложений на Preact и, вероятно, самый популярный для тех, кто решает обойтись без этапа сборки.

HTM поддерживает все стандартные функции Preact, включая компоненты, хуки, сигналы и т. д., единственное отличие заключается в синтаксисе, используемом для написания возвращаемого значения «JSX».

```js
// --repl
import { render } from 'preact';
// --repl-before
import { useState } from 'preact/hooks';
import { html } from 'htm/preact';

function Button({ action, children }) {
  return html`<button onClick=${action}>${children}</button>`;
}

function Counter() {
  const [count, setCount] = useState(0);

  return html`
    <div class="counter-container">
      <${Button} action=${() => setCount(count + 1)}>Увеличить<//>
      <input readonly value=${count} />
      <${Button} action=${() => setCount(count - 1)}>Уменьшить<//>
    </div>
  `;
}
// --repl-after
render(<Counter />, document.getElementById('app'));
```
