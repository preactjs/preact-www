---
title: preact-custom-element
description: Оберните свой Preact-компонент в пользовательский элемент
---

# preact-custom-element

Маленький размер Preact и подход, ориентированный на стандарты, делают его отличным выбором для создания веб-компонентов.

Preact спроектирован для рендеринга как полноценных приложений, так и отдельных частей страницы, что делает его естественным выбором для построения веб-компонентов. Многие компании используют этот подход, чтобы создавать компоненты или дизайн-системы, которые затем оборачиваются в набор веб-компонентов. Это позволяет повторно использовать их в разных проектах и внутри других фреймворков, сохраняя при этом привычные API Preact.

---

<toc></toc>

---

## Создание веб-компонента

Любой компонент Preact может быть превращен в веб-компонент с помощью [preact-custom-element](https://github.com/preactjs/preact-custom-element), очень тонкой обёртки, которая соответствует спецификации Custom Elements v1.

```jsx
import register from 'preact-custom-element';

const Greeting = ({ name = 'World' }) => <p>Привет, {name}!</p>;

register(Greeting, 'x-greeting', ['name'], { shadow: false });
//          ^            ^           ^             ^
//          |      HTML-тег       |       использовать shadow-dom
//   Определение компонента      Отслеживаемые атрибуты
```

> Примечание: Согласно [Спецификации пользовательских элементов](http://w3c.github.io/webcomponents/spec/custom/#prod-potentialcustomelementname), имя тега должно содержать дефис (`-`).

Используйте новое имя тега в HTML, ключи атрибутов и значения будут переданы как пропсы:

```html
<x-greeting name="Вася Пупкин"></x-greeting>
```

Вывод:

```html
<p>Привет, Вася Пупкин!</p>
```

### Отслеживаемые атрибуты

Веб-компоненты требуют явного перечисления имен атрибутов, которые вы хотите отслеживать, чтобы реагировать на изменения их значений. Они могут быть указаны через третий параметр, передаваемый функции `register()`:

```jsx
// Прослушиваем изменения атрибута `name`
register(Greeting, 'x-greeting', ['name']);
```

Если вы опустите третий параметр для `register()`, список атрибутов для отслеживания может быть указан с использованием статического свойства `observedAttributes` на компоненте. Это также работает для имени Пользовательского элемента, которое может быть указано с использованием статического свойства `tagName`:

```jsx
import register from 'preact-custom-element';

// <x-greeting name="Bo"></x-greeting>
class Greeting extends Component {
	// Регистрируем как <x-greeting>:
	static tagName = 'x-greeting';

	// Отслеживаем эти атрибуты:
	static observedAttributes = ['name'];

	render({ name }) {
		return <p>Привет, {name}!</p>;
	}
}
register(Greeting);
```

Если `observedAttributes` не указаны, они будут выведены из ключей `propTypes`, если присутствуют на компоненте:

```jsx
// Другой вариант: используйте PropTypes:
function FullName({ first, last }) {
	return (
		<span>
			{first} {last}
		</span>
	);
}

FullName.propTypes = {
	first: Object, // вы можете использовать PropTypes, или это
	last: Object // трюк для определения не-типизированных пропсов.
};

register(FullName, 'full-name');
```

### Передача слотов как пропсов

Функция `register()` имеет четвертый параметр для передачи опций; в настоящее время поддерживается только опция `shadow`, которая прикрепляет дерево shadow DOM к указанному элементу. При включении это позволяет использовать именованные элементы `<slot>` для пересылки дочерних элементов пользовательского элемента к определённым местам в дереве shadow.

```jsx
function TextSection({ heading, content }) {
	return (
		<div>
			<h1>{heading}</h1>
			<p>{content}</p>
		</div>
	);
}

register(TextSection, 'text-section', [], { shadow: true });
```

Использование:

```html
<text-section>
	<span slot="heading">Приятный заголовок</span>
	<span slot="content">Шикарный контент</span>
</text-section>
```
