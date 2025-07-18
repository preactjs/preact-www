---
title: preact-custom-element
description: Оборачиваем компонент Preact в виде пользовательского элемента
---

# preact-custom-element

Маленький размер Preact и подход, ориентированный на стандарты, делают его отличным выбором для создания веб-компонентов.

Preact разработан для рендеринга как полных приложений, так и отдельных частей страницы, что делает его естественным выбором для создания веб-компонентов. Многие компании используют этот подход для построения систем компонентов или дизайна, которые затем оборачиваются в набор веб-компонентов, что позволяет повторно использовать их в различных проектах и в других фреймворках, продолжая предлагать знакомые API Preact.

---

<toc></toc>

---

## Создание веб-компонента

Любой компонент Preact можно превратить в веб-компонент с помощью [preact-custom-element](https://github.com/preactjs/preact-custom-element), очень тонкой обёртки, соответствующей спецификации Custom Elements v1.

```jsx
import register from 'preact-custom-element';

const Greeting = ({ name = 'мир' }) => <p>Привет, {name}!</p>;

register(Greeting, 'x-greeting', ['name'], { shadow: false });
//          ^            ^           ^             ^
//          |      Имя HTML-тега     |       используем shadow-dom
//   Определение компонента      Наблюдаемые атрибуты
```

> Примечание. Согласно [Спецификации пользовательского элемента](https://html.spec.whatwg.org/multipage/custom-elements.html#prod-potentialcustomelementname), имя тега должно содержать дефис (`-`).

Используйте новое имя тега в HTML, ключи и значения атрибутов будут переданы в качестве параметров:

```html
<x-greeting name="Вася"></x-greeting>
```

Вывод:

```html
<p>Вася, привет!</p>
```

### Наблюдаемые атрибуты

Веб-компоненты требуют явного указания имён атрибутов, за которыми вы хотите наблюдать, чтобы реагировать при изменении их значений. Их можно указать с помощью третьего параметра, передаваемого функции `register()`:

```jsx
// Прослушиваем изменения атрибута `name`
register(Greeting, 'x-greeting', ['name']);
```

Если вы опустите третий параметр в `register()`, список наблюдаемых атрибутов можно указать с помощью статического свойства `observedAttributes` вашего компонента. Это также работает для имени пользовательского элемента, которое можно указать с помощью статического свойства `tagName`:

```jsx
import register from 'preact-custom-element';

// <x-greeting name="Павлик"></x-greeting>
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

Если атрибуты наблюдения (`observedAttributes`) не указаны, они будут автоматически определены по ключам `propTypes` компонента, если такие присутствуют:

```jsx
// Другой вариант: используем PropTypes:
function FullName({ first, last }) {
  return (
    <span>
      {first} {last}
    </span>
  );
}

FullName.propTypes = {
  first: Object, // использование PropTypes или
  last: Object, // трюк для определения нетипизированных параметров
};

register(FullName, 'full-name');
```

### Передача слотов в качестве параметров

Функция `register()` имеет четвертый параметр для передачи параметров. В настоящее время поддерживаются только опция `shadow`, которая прикрепляет теневое дерево DOM к указанному элементу. Если эта опция включена, это позволяет использовать именованные элементы `<slot>` для пересылки дочерних элементов пользовательского элемента в определённые места теневого дерева.

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
  <span slot="heading">Хороший заголовок</span>
  <span slot="content">Отличный контент</span>
</text-section>
```
