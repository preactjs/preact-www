---
name: Переход на Preact с React
permalink: '/guide/switching-to-preact'
---

# Переход на Preact с React

Существует два разных подхода к переходу с React на Preact:

1. Установите псевдоним `preact-compat`
2. Переключите ваши импорты на `preact` и удалите несовместимый код

---

<div><toc></toc></div>

---

## Просто: использование псевдонима `preact-compat`

Переход на Preact может быть таким же простым, как установка `preact-compat` и создание псевдонимов `react` и `react-dom`.
Это позволит вам продолжать писать код React/ReactDOM без каких-либо изменений в вашем рабочем процессе или кодовой базе.
`preact-compat` добавляет около 2 КБ к размеру вашего пакета, но имеет преимущество в том, что поддерживает
подавляющее большинство существующих модулей React, которые вы можете найти на npm. Пакет `preact-compat` предоставляет
все необходимые доработки поверх ядра Preact, чтобы заставить его работать так же, как `react` и `react-dom`, в одном модуле.

Процесс установки состоит из двух шагов.
Сначала необходимо установить preact и preact-compat (это отдельные пакеты):

```sh
npm i -S preact preact-compat
```

Установив эти зависимости, настройте систему сборки на псевдоним импортов React, чтобы они указывали на Preact.


### Как настроить псевдоним для preact-compat

Теперь, когда зависимости установлены, вам нужно настроить систему сборки
чтобы перенаправить все импорты/запросы, ищущие `react` или `react-dom` с помощью `preact-compat`.

#### Настройка псевдонимов в Webpack

Просто добавьте следующую конфигурацию [resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias) в ваш `webpack.config.js`:

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

#### Настройка псевдонимов в Parcel

Parcel поддерживает определение псевдонимов модулей прямо в вашем файле `package.json` под ключом `"aliases"`:

```json
{
  "alias": {
    "react": "preact-compat",
    "react-dom": "preact-compat"
  }
}
```

#### Настройка псевдонимов в Browserify

Если вы используете Browserify, псевдонимы можно определить, добавив трансформацию [aliasify](https://www.npmjs.com/package/aliasify).

Сначала установите трансформацию: `npm i -D aliasify`

Затем в файле `package.json` укажите aliasify перенаправлять импорт react на preact-compat:

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

Чаще всего preact-compat используется для поддержки React-совместимых модулей сторонних разработчиков. При использовании Browserify не забудьте настроить преобразование [Aliasify](https://www.npmjs.com/package/aliasify) на **глобальное** с помощью опции `--global-transform` [Browserify option](https://github.com/browserify/browserify).


#### Ручная настройка псевдонимов

Если вы не используете систему сборки или хотите навсегда перейти на `preact-compat`, вы также можете найти и заменить все импорты/требования в вашей кодовой базе, как это делает псевдоним:

> **найти:**    `(['"])react(-dom)?\1`
>
> **заменить:** `$1preact-compat$1`

Однако в этом случае вам может показаться более целесообразным перейти непосредственно на `preact`, а не полагаться на `preact-compat`.
Ядро Preact достаточно полнофункционально, и многие идиоматические кодовые базы React могут быть сразу переведены на `preact` без особых усилий.
Этот подход рассматривается в следующем разделе.

#### Настройка псевдонимов в Node с помощью module-alias

Для целей SSR, если вы не используете бандлер вроде webpack для сборки кода на стороне сервера, вы можете использовать пакет [module-alias](https://www.npmjs.com/package/module-alias), чтобы заменить react на preact.

```sh
npm i -S module-alias
```

`patchPreact.js`:
```js
var path = require('path')
var moduleAlias = require('module-alias')

moduleAlias.addAliases({
  'react': 'preact-compat/dist/preact-compat.min',
  'react-dom': 'preact-compat/dist/preact-compat.min',
  'create-react-class': path.resolve(__dirname, './create-preact-class')
})
```

`create-preact-class.js`:
```js
import { createClass } from 'preact-compat/dist/preact-compat.min'
export default createClass
```

Если вы используете новый синтаксис `импорта` на вашем сервере с Babel, написание этих строк поверх других импортов не сработает, поскольку Babel перемещает все импорты в верхнюю часть модуля. В этом случае сохраните приведённый выше код как `patchPreact.js`, а затем импортируйте его в верхнюю часть вашего файла (`import './patchPreact'`). Подробнее об использовании `module-alias` можно прочитать [здесь](https://www.npmjs.com/package/module-alias).


Также можно создавать псевдонимы непосредственно в node без пакета `module-alias`. Это зависит от внутренних свойств системы модулей Node, поэтому действуйте осторожно. Чтобы задать псевдоним вручную:

```js
// patchPreact.js
var React = require('react')
var ReactDOM = require('react-dom')
var ReactDOMServer = require('react-dom/server')
var CreateReactClass = require('create-react-class')
var Preact = require('preact-compat/dist/preact-compat.min')
var Module = module.constructor
Module._cache[require.resolve('react')].exports = Preact
Module._cache[require.resolve('react-dom')].exports = Preact
Module._cache[require.resolve('create-react-class')].exports.default = Preact.createClass
```

### Сборка и тестирование

**Вы закончили!**
Теперь при запуске сборки все ваши импорты React будут импортировать `preact-compat`, и ваш пакет станет намного меньше.
Всегда полезно запустить набор тестов и, конечно, загрузить приложение, чтобы посмотреть, как оно работает.


---


## Оптимально: Переход на Preact

Для перехода с React на Preact не обязательно использовать `preact-compat` в своей собственной кодовой базе.
API Preact практически идентичен API React, и многие кодовые базы React могут быть перенесены практически без изменений.

Как правило, процесс перехода на Preact состоит из нескольких этапов:

### 1. Установка Preact

Это очень просто: чтобы использовать библиотеку, вам нужно будет установить ее!

```sh
npm install --save preact  # или: npm i -S preact
```

### 2. JSX-прагма: транспилирование в `h()`

> **История:** Хотя расширение языка [JSX] не зависит от React, популярные
> транспайлеры, такие как [Babel] и [Bublé], по умолчанию преобразуют JSX в вызовы `React.createElement()`.
> Для этого есть исторические причины, но стоит понимать, что функция вызывает JSX
> транспиляции — это фактически уже существующая технология под названием [Hyperscript]. Preact отдает дань уважения
> этому и пытается способствовать лучшему пониманию простоты JSX с помощью `h()`,
> используя [JSX-прагму][JSX Pragma]
>
> **TL;DR:** Нам нужно отключить `React.createElement()` для `h()` preact.

В JSX «прагма» — это имя функции, которая обрабатывает создание каждого элемента:

> `<div />` транспилируется в `h('div')`
>
> `<Foo />` транспилируется в `h(Foo)`
>
> `<a href="/">Hello</a>` транспилируется в `h('a', { href:'/' }, 'Hello')`

В каждом приведенном выше примере `h` — это имя функции, которую мы объявили как прагму JSX.


#### Через Babel

Если вы используете Babel, вы можете установить JSX-прагму в свой `.babelrc` или `package.json` (в зависимости от того, что вы предпочитаете):

```json
{
  "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
}
```


#### Через комментарии

Если вы работаете в онлайн-редакторе на базе Babel (например, JSFiddle или Codepen), вы можете установить JSX-прагму, указав комментарий в верхней части вашего кода:

`/** @jsx h */`


#### Через Bublé

[Bublé] по умолчанию поставляется с поддержкой JSX. Просто установите опцию `jsx`:

`buble({ jsx: 'h' })`


### 3. Обновление устаревшего кода

Хотя Preact стремится быть API-совместимым с React, некоторые части интерфейса намеренно не включены.
Наиболее примечательным из них является `createClass()`. Мнения по поводу классов и ООП сильно различаются, но
стоит понимать, что классы JavaScript находятся внутри библиотек VDOM и представляют типы компонентов,
что важно при работе с нюансами управления жизненным циклом компонентов.

Если ваша кодовая база сильно зависит от метода `createClass()`, у вас всё ещё есть отличный вариант:
Лоуренс Дорман поддерживает [автономную реализацию `createClass()`](https://github.com/ld0rman/preact-classless-component), которая работает напрямую с preact и имеет размер всего несколько сотен байт.
Альтернативно, вы можете автоматически преобразовать вызовы `createClass()` в классы ES, используя [preact-codemod](https://github.com/vutran/preact-codemod) от Vu Tran.

Ещё одно отличие, на которое стоит обратить внимание, заключается в том, что Preact по умолчанию поддерживает только ссылки на функции.
Ссылки на строки устарели в React и скоро будут удалены, поскольку они создают удивительную сложность при незначительной выгоде.
Если вы хотите продолжать использовать ссылки на строки, [эта крошечная функция linkedRef](https://gist.github.com/developit/63e7a81a507c368f7fc0898076f64d8d) предлагает перспективную версию, которая по-прежнему заполняет `this.refs.$$` подобно строковым ссылкам. Простота этой крошечной оболочки для ссылок на функции также помогает проиллюстрировать, почему ссылки на функции теперь являются предпочтительным выбором в будущем.


### 4. Упрощение корневого рендеринга

Начиная с React 0.13, функция `render()` предоставляется модулем `react-dom`.
Preact не использует отдельный модуль для рендеринга DOM, поскольку он ориентирован исключительно на то, чтобы быть отличным рендерером DOM.
Итак, последний шаг в преобразовании вашей кодовой базы в Preact — это переключение `ReactDOM.render()` на `render()` Preact:

```diff
- ReactDOM.render(<App />, document.getElementById('app'));
+ render(<App />, document.body);
```

Также стоит отметить, что функция `render()` в Preact является неразрушающей, поэтому рендеринг в `<body>` вполне возможен (даже поощряется).
Это возможно, поскольку Preact не предполагает, что он контролирует весь корневой элемент, который вы ему передаете. Второй аргумент функции `render()` на самом деле является `parent`, что означает, что это элемент DOM для рендеринга _into_. Если вы хотите выполнить повторный рендеринг из корня (возможно, для горячей замены модуля), `render()` принимает заменяемый элемент в качестве третьего аргумента:

```js
// первоначальный рендеринг:
render(<App />, document.body);

// обновление:
render(<App />, document.body, document.body.lastElementChild);
```

В приведённом выше примере мы полагаемся на то, что последний дочерний элемент является нашим ранее отрисованным корнем.
Хотя это работает во многих случаях (jsfiddles, codepens и т. д.), лучше иметь больше контроля.
Вот почему `render()` возвращает корневой элемент: вы передаете его в качестве третьего аргумента для повторного рендеринга на месте.
В следующем примере показано, как выполнить повторный рендеринг в ответ на обновления горячей замены модулей Webpack:

```js
// root содержит корневой элемент DOM нашего приложения:
let root;

function init() {
  root = render(<App />, document.body, root);
}
init();

// пример: повторный рендеринг при обновлении Webpack HMR:
if (module.hot) module.hot.accept('./app', init);
```

Полную технику можно увидеть в [preact-boilerplate](https://github.com/developit/preact-boilerplate/blob/master/src/index.js#L6-L18).


[Babel]: https://babeljs.io
[Bublé]: https://buble.surge.sh
[JSX]: https://facebook.github.io/jsx/
[JSX Pragma]: http://www.jasonformat.com/wtf-is-jsx/
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[Hyperscript]: https://github.com/dominictarr/hyperscript
