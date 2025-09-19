---
title: Компоненты
description: Узнайте, как их создавать и использовать для компоновки пользовательских интерфейсов
---

# Компоненты

Компоненты представляют собой базовый строительный блок в Preact. Они играют ключевую роль в упрощении создания сложных пользовательских интерфейсов из небольших строительных блоков. Они также отвечают за привязку состояния к отображаемому выводу.

В Preact есть два вида компонентов, о которых мы поговорим в этом руководстве.

---

<toc></toc>

---

## Функциональные компоненты

Функциональные компоненты являются обычными функциями, которые получают `props` как первый аргумент. Имя функции **должно** начинаться с заглавной буквы, чтобы они работали в JSX.

```jsx
// --repl
import { render } from 'preact';

// --repl-before
function MyComponent(props) {
	return <div>Меня зовут {props.name}.</div>;
}

// Использование
const App = <MyComponent name="Вася" />;

// Рендерит: <div>Меня зовут Вася.</div>
render(App, document.body);
```

> В более ранних версиях они были известны как `"Stateless Components"`. Это больше не актуально с [хуками](/guide/v10/hooks).

## Классовые компоненты

Классовые компоненты могут иметь состояние и методы жизненного цикла. Последние — специальные методы, которые будут вызваны, когда компонент прикрепляется к DOM или уничтожается, например.

Вот простой классовый компонент под названием `<Clock>`, который отображает текущее время:

```jsx
// --repl
import { Component, render } from 'preact';

// --repl-before
class Clock extends Component {
	constructor() {
		super();
		this.state = { time: Date.now() };
	}

	// Жизненный цикл: Вызывается при создании компонента
	componentDidMount() {
		// обновление времени каждую секунду
		this.timer = setInterval(() => {
			this.setState({ time: Date.now() });
		}, 1000);
	}

	// Жизненный цикл: Вызывается перед уничтожением компонента
	componentWillUnmount() {
		// остановка, когда компонент не отображается
		clearInterval(this.timer);
	}

	render() {
		let time = new Date(this.state.time).toLocaleTimeString();
		return <span>{time}</span>;
	}
}
// --repl-after
render(<Clock />, document.getElementById('app'));
```

### Методы жизненного цикла

Чтобы время часов обновлялось каждую секунду, нам нужно знать, когда компонент `<Clock>` монтируется в DOM. _Если вы использовали пользовательские элементы HTML5, это похоже на методы жизненного цикла `attachedCallback` и `detachedCallback`._ Preact вызывает следующие методы жизненного цикла, если они определены для компонента:

| Метод жизненного цикла                                      | Когда он вызывается                                                                                      |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `componentWillMount()`                                     | (deprecated) перед монтированием компонента в DOM                                                         |
| `componentDidMount()`                                      | после монтирования компонента в DOM                                                                       |
| `componentWillUnmount()`                                   | перед удалением из DOM                                                                                     |
| `componentWillReceiveProps(nextProps, nextContext)`        | перед принятием новых props _(deprecated)_                                                                |
| `getDerivedStateFromProps(nextProps, prevState)`           | прямо перед `shouldComponentUpdate`. Верните объект для обновления state или `null` для пропуска обновления. Используйте осторожно. |
| `shouldComponentUpdate(nextProps, nextState, nextContext)` | перед `render()`. Верните `false` для пропуска рендеринга                                                 |
| `componentWillUpdate(nextProps, nextState, nextContext)`   | перед `render()` _(deprecated)_                                                                            |
| `getSnapshotBeforeUpdate(prevProps, prevState)`            | вызывается прямо перед `render()`. Возвращаемое значение передается в `componentDidUpdate`.               |
| `componentDidUpdate(prevProps, prevState, snapshot)`       | после `render()`                                                                                           |

Вот визуальная схема их взаимосвязи (изначально опубликована в [твите](https://web.archive.org/web/20191118010106/https://twitter.com/dan_abramov/status/981712092611989509) Дана Абрамова):

![Диаграмма методов жизненного цикла компонентов](/guide/components-lifecycle-diagram.png)

### Границы ошибок

Граница ошибок — это компонент, который реализует либо `componentDidCatch()`, либо статический метод `getDerivedStateFromError()` (или оба). Это специальные методы, которые позволяют вам перехватывать любые ошибки, которые происходят во время рендеринга, и обычно используются для предоставления более приятных сообщений об ошибках или другого запасного контента и сохранения информации для целей логирования. Важно отметить, что границы ошибок не могут перехватывать все ошибки, и те, что выброшены в обработчиках событий или асинхронном коде (например, вызов `fetch()`), нуждаются в отдельной обработке.

Когда ошибка перехвачена, мы можем использовать эти методы для реакции на любые ошибки и отображения приятного сообщения об ошибке или любого другого запасного контента.

```jsx
// --repl
import { Component, render } from 'preact';
// --repl-before
class ErrorBoundary extends Component {
	constructor() {
		super();
		this.state = { errored: false };
	}

	static getDerivedStateFromError(error) {
		return { errored: true };
	}

	componentDidCatch(error, errorInfo) {
		errorReportingService(error, errorInfo);
	}

	render(props, state) {
		if (state.errored) {
			return <p>Что-то пошло не так</p>;
		}
		return props.children;
	}
}
// --repl-after
render(<ErrorBoundary />, document.getElementById('app'));
```

## Фрагменты

`Fragment` позволяет вам возвращать несколько элементов одновременно. Они решают ограничение JSX, где каждый «блок» должен иметь единственный корневой элемент. Вы часто будете сталкиваться с ними в комбинации со списками, таблицами или с CSS flexbox, где любой промежуточный элемент иначе повлиял бы на стилизацию.

```jsx
// --repl
import { Fragment, render } from 'preact';

function TodoItems() {
	return (
		<Fragment>
			<li>A</li>
			<li>B</li>
			<li>C</li>
		</Fragment>
	);
}

const App = (
	<ul>
		<TodoItems />
		<li>D</li>
	</ul>
);

render(App, container);
// Рендерит:
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```

Обратите внимание, что большинство современных транспиляторов позволяют использовать более короткий синтаксис для `Fragments`. Более короткий является намного более распространённым и является тем, с которым вы обычно будете сталкиваться.

```jsx
// Это:
const Foo = <Fragment>foo</Fragment>;
// ...то же самое, что и это:
const Bar = <>foo</>;
```

Вы также можете возвращать массивы из ваших компонентов:

```jsx
function Columns() {
	return [<td>Привет</td>, <td>мир</td>];
}
```

Не забудьте добавить ключи к `Fragments`, если вы создаете их в цикле:

```jsx
function Glossary(props) {
	return (
		<dl>
			{props.items.map(item => (
				// Без ключа Preact приходится угадывать, какие элементы
				// изменились при повторном рендеринге.
				<Fragment key={item.id}>
					<dt>{item.term}</dt>
					<dd>{item.description}</dd>
				</Fragment>
			))}
		</dl>
	);
}
```
