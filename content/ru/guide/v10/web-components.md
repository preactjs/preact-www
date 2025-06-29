---
title: Веб-компоненты
description: Как использовать веб-компоненты с Preact
---

# Веб-компоненты

Небольшой размер Preact и подход, ориентированный на стандарты, делают его отличным выбором для создания веб-компонентов.

Веб-компоненты — это набор стандартов, которые позволяют создавать новые типы элементов HTML — пользовательские элементы, такие как `<material-card>` или `<tab-bar>`.
Preact [полностью поддерживает эти стандарты](https://custom-elements-everywhere.com/#preact), позволяя беспрепятственно использовать жизненные циклы, свойства и события пользовательских элементов.

Preact предназначен для рендеринга как полных приложений, так и отдельных частей страницы, что делает его естественным для создания веб-компонентов. Многие компании используют его для создания компонентов или систем проектирования, которые затем объединяются в набор веб-компонентов, что позволяет повторно использовать их в нескольких проектах и ​​в других средах.

Preact и веб-компоненты являются взаимодополняющими технологиями: веб-компоненты предоставляют набор примитивов низкого уровня для расширения браузера, а Preact предоставляет модель компонентов высокого уровня, которая может располагаться поверх этих примитивов.

---

<toc></toc>

---

## Рендеринг веб-компонентов

В Preact веб-компоненты работают так же, как и другие элементы DOM. Их можно визуализировать, используя зарегистрированное имя тега:

```jsx
customElements.define(
  'x-foo',
  class extends HTMLElement {
    // ...
  }
);

function Foo() {
  return <x-foo />;
}
```

### Свойства и атрибуты

JSX не предоставляет возможности различать свойства и атрибуты. Пользовательские элементы обычно полагаются на пользовательские свойства для поддержки установки сложных значений, которые не могут быть выражены как атрибуты. Это хорошо работает в Preact, поскольку средство визуализации автоматически определяет, следует ли устанавливать значения с помощью свойства или атрибута, проверяя затронутый элемент DOM. Когда пользовательский элемент определяет [сеттер](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/set) для данного свойства, Preact обнаруживает его существование и будет использовать сеттер вместо атрибута.

```jsx
customElements.define(
  'context-menu',
  class extends HTMLElement {
    set position({ x, y }) {
      this.style.cssText = `left:${x}px; top:${y}px;`;
    }
  }
);

function Foo() {
  return <context-menu position={{ x: 10, y: 20 }}> ... </context-menu>;
}
```

> **Примечание:** Preact не делает никаких предположений относительно схем именования и не пытается навязать имена, в JSX или иным образом, свойствам DOM. Если у пользовательского элемента есть свойство с именем `someProperty`, его нужно задать с помощью `someProperty=...`, а не `some-property=...`.

При рендеринге статического HTML с использованием `preact-render-to-string` («SSR») сложные значения свойств, такие как объект выше, не сериализуются автоматически. Они применяются после гидратации статического HTML на клиенте.

### Доступ к методам экземпляра

Чтобы получить доступ к экземпляру вашего пользовательского веб-компонента, мы можем использовать ссылки:

```jsx
function Foo() {
  const myRef = useRef(null);

  useEffect(() => {
    if (myRef.current) {
      myRef.current.doSomething();
    }
  }, []);

  return <x-foo ref={myRef} />;
}
```

### Запуск пользовательских событий

Preact нормализует регистр стандартных встроенных событий DOM, которые обычно чувствительны к регистру. Именно по этой причине можно передать свойство onChange в `<input>`, несмотря на то, что фактическое имя события — `"change"`. Пользовательские элементы часто запускают пользовательские события как часть своего общедоступного API, однако невозможно узнать, какие пользовательские события могут быть запущены. Чтобы обеспечить беспрепятственную поддержку пользовательских элементов в Preact, аргументы нераспознанного обработчика событий, передаваемые элементу DOM, регистрируются с использованием их регистра точно так, как указано.

```jsx
// Встроенное событие DOM: прослушивает событие «клика»
<input onClick={() => console.log('клик')} />

// Пользовательский элемент: прослушивает событие TabChange (с учётом регистра!)
<tab-bar onTabChange={() => console.log('смена вкладки')} />

// Исправлено: прослушивается событие «tabchange» (строчные буквы).
<tab-bar ontabchange={() => console.log('смена вкладки')} />
```

## Создание веб-компонента

Любой компонент Preact можно превратить в веб-компонент с помощью [preact-custom-element](https://github.com/preactjs/preact-custom-element), очень тонкой оболочки, соответствующей спецификации Custom Elements v1.

```jsx
import register from 'preact-custom-element';

const Greeting = ({ name = 'мир' }) => <p>Привет, {name}!</p>;

register(Greeting, 'x-greeting', ['name'], { shadow: false });
//          ^            ^           ^             ^
//          |      Имя HTML-тега     |       Использование shadow-dom
//   Определение компонента      Наблюдаемые атрибуты
```

> Примечание. Согласно [Спецификации пользовательского элемента](https://html.spec.whatwg.org/multipage/custom-elements.html#prod-potentialcustomelementname), имя тега должно содержать дефис (`-`).

Используйте новое имя тега в HTML, ключи и значения атрибутов будут переданы в качестве параметров:

```html
<x-greeting name="Ваня"></x-greeting>
```

Вывод:

```html
<p>Привет, Ваня!</p>
```

### Наблюдаемые атрибуты

Веб-компоненты требуют явного указания имён атрибутов, за которыми вы хотите наблюдать, чтобы реагировать при изменении их значений. Их можно указать с помощью третьего параметра, передаваемого функции `register()`:

```jsx
// Прослушивать изменения атрибута `name`
register(Greeting, 'x-greeting', ['name']);
```

Если вы опустите третий параметр в `register()`, список наблюдаемых атрибутов можно указать с помощью статического свойства `observedAttributes` вашего Компонента. Это также работает для имени пользовательского элемента, которое можно указать с помощью статического свойства `tagName`:

```jsx
import register from 'preact-custom-element';

// <x-greeting name="Павлик"></x-greeting>
class Greeting extends Component {
  // Регистрируемся как <x-greeting>:
  static tagName = 'x-greeting';

  // Отслеживаем эти атрибуты:
  static observedAttributes = ['name'];

  render({ name }) {
    return <p>Привет, {name}!</p>;
  }
}
register(Greeting);
```

Если `observedAttributes` не указаны, они будут выведены из ключей `propTypes`, если они присутствуют в компоненте:

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

Функция `register()` имеет четвертый параметр для передачи опций. В настоящее время поддерживаются только опция `shadow`, которая прикрепляет теневое дерево DOM к указанному элементу. Если эта опция включена, это позволяет использовать именованные элементы `<slot>` для пересылки дочерних элементов пользовательского элемента в определённые места теневого дерева.

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
