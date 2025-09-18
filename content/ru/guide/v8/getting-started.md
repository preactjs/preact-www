---
title: Первые шаги
---

# Первые шаги

В этом руководстве мы рассмотрим создание простого компонента «тикающие часы». Более подробную информацию по каждой теме можно найти на специальных страницах в меню "Руководство".

> :information_desk_person: Вам [не _обязательно_ использовать ES2015 для работы с Preact](https://github.com/developit/preact-without-babel)... но стоит это сделать. Это руководство предполагает, что у вас настроена сборка с ES2015 с использованием babel и/или webpack/browserify/gulp/grunt/и т.д. Если у вас нет такой сборки, начните с [preact-cli](https://github.com/preactjs/preact-cli) или [шаблона CodePen](http://codepen.io/developit/pen/pgaROe?editors=0010).

---

<toc></toc>

---

## Импортируйте то, что вам нужно

Модуль `preact` предоставляет именованные и стандартные экспорты, так что вы можете импортировать либо все в выбранное вами пространство имен, либо только то, что вам нужно, как локальные:

**Именованный импорт:**

```js
import { h, render, Component } from 'preact';

// Сообщите Babel, что нужно преобразовать JSX в вызовы h():
/** @jsx h */
```

**По умолчанию:**

```js
import preact from 'preact';

// Сообщите Babel, что нужно преобразовать JSX в вызовы preact.h():
/** @jsx preact.h */
```

> Именованный импорт хорошо подходит для высокоструктурированных приложений, в то время как импорт по умолчанию выполняется быстро и не требует обновления при использовании различных частей библиотеки.

**Подключение через CDN:**

```html
<script src="https://cdn.jsdelivr.net/npm/preact/dist/preact.min.js"></script>

<!-- Чтобы загрузить Preact как JS-модуль: -->
<script src="https://cdn.jsdelivr.net/npm/preact/dist/preact.mjs" type="module"></script>
```

### Глобальная директива

Вместо того чтобы объявлять директиву `@jsx` в своем коде, лучше всего настроить её глобально в файле `.babelrc`.

**Именованный импорт:**
>**Для Babel 5 и ниже:**
>
> ```json
> { "jsxPragma": "h" }
> ```
>
> **Для Babel 6:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"h" }]
>   ]
> }
> ```
>
> **Для Babel 7:**
>
> ```json
> {
>   "plugins": [
>     ["@babel/plugin-transform-react-jsx", { "pragma":"h" }]
>   ]
> }
> ```

**По умолчанию:**
>**Для Babel 5 и ниже:**
>
> ```json
> { "jsxPragma": "preact.h" }
> ```
>
> **Для Babel 6:**
>
> ```json
> {
>   "plugins": [
>     ["transform-react-jsx", { "pragma":"preact.h" }]
>   ]
> }
> ```
>
> **Для Babel 7:**
>
> ```json
> {
>   "plugins": [
>     ["@babel/plugin-transform-react-jsx", { "pragma":"preact.h" }]
>   ]
> }
> ```

---


## Рендеринг JSX

Из коробки Preact предоставляет функцию `h()`, которая превращает ваш JSX в элементы виртуального DOM _([вот так](https://jasonformat.com/wtf-is-jsx))_. Она также предоставляет функцию `render()`, которая создает дерево DOM из этого виртуального DOM.

Чтобы отобразить JSX, просто импортируйте эти две функции и используйте их следующим образом:

```js
import { h, render } from 'preact';

render((
	<div id="foo">
		<span>Hello, world!</span>
		<button onClick={ e => alert("hi!") }>Нажми меня</button>
	</div>
), document.body);
```

Это должно показаться довольно простым, если вы использовали [hyperscript] или одного из его [многочисленных друзей](https://github.com/developit/vhtml).

Однако рендерить hyperscript с помощью виртуального DOM бессмысленно. Мы хотим рендерить компоненты и обновлять их при изменении данных — вот где сила диффинга виртуального DOM. :star2:


---


## Компоненты

Preact экспортирует общий класс `Component`, который может быть расширен для создания инкапсулированных, самообновляющихся частей пользовательского интерфейса. Компоненты поддерживают все стандартные методы [жизненного цикла](#the-component-lifecycle) React, такие как `shouldComponentUpdate()` и `componentWillReceiveProps()`. Предоставление конкретных реализаций этих методов является предпочтительным механизмом для управления тем, _когда_ и _как_ обновляются компоненты.

У компонентов также есть метод `render()`, но в отличие от React, этому методу в качестве аргументов передаются `(props, state)`. Это обеспечивает эргономичное средство для деструктуризации `props` и `state` в локальные переменные, на которые можно ссылаться из JSX.

Давайте рассмотрим очень простой компонент `Clock`, который показывает текущее время.

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	render() {
		let time = new Date().toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// отображаем экземпляр Clock в <body>:
render(<Clock />, document.body);
```


Это замечательно. При запуске проекта получается следующая структура HTML DOM:

```html
<span>10:28:57 PM</span>
```


---


## Жизненный цикл компонента

Для того чтобы время на часах обновлялось каждую секунду, нам нужно знать, когда `<Clock>` будет подключен к DOM. _Если вы использовали пользовательские элементы HTML5, это похоже на методы жизненного цикла `attachedCallback` и `detachedCallback`._ Preact вызывает следующие методы жизненного цикла, если они определены для Компонента:

| Метод            | Когда вызывается                              |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | до того, как компонент будет установлен в DOM     |
| `componentDidMount`         | после того, как компонент будет установлен в DOM      |
| `componentWillUnmount`      | до удаления из DOM                    |
| `componentWillReceiveProps` | до того, как новые параметры будут приняты                    |
| `shouldComponentUpdate`     | перед `render()`. Верните `false`, чтобы пропустить рендеринг |
| `componentWillUpdate`       | перед `render()`.                                |
| `componentDidUpdate`        | после `render()`                                 |



Итак, мы хотим, чтобы 1-секундный таймер запускался, как только компонент будет добавлен в DOM, и останавливался, если он будет удалён. Мы создадим таймер и сохраним ссылку на него в `componentDidMount`, а остановим таймер в `componentWillUnmount`. При каждом тике таймера мы будем обновлять объект `state` компонента с новым значением времени. Это автоматически приведет к перерисовке компонента.

```js
import { h, render, Component } from 'preact';

class Clock extends Component {
	constructor() {
		super();
		// задаём начальное время:
		this.state = { time: Date.now() };
	}

	componentDidMount() {
		// обновляем время ежесекундно
		this.timer = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	}

	componentWillUnmount() {
		// останавливаем обновление при размонтировании компонента
		clearInterval(this.timer);
	}

	render(props, state) {
		let time = new Date(state.time).toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

// отображаем экземпляр Clock в <body>:
render(<Clock />, document.body);
```


---


Теперь у нас есть [тикающие часы](http://jsfiddle.net/developit/u9m5x0L7/embedded/result,js/)!


[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
