---
name: Ссылки
description: 'Ссылки можно использовать для доступа к необработанным узлам DOM, отрендеренным Preact.'
---

# Ссылки

Всегда будут сценарии, в которых вам понадобится прямая ссылка на DOM-элемент или компонент, отрендеренный Preact. `Refs` позволяют вам сделать именно это.

Типичный вариант использования — измерение фактического размера узла DOM. Хотя ссылку на экземпляр компонента можно получить через `ref`, мы обычно не рекомендуем это делать. Это создаст жёсткую связь между родительским и дочерним компонентами, что нарушит возможность компоновки модели компонента. В большинстве случаев более естественно просто передать обратный вызов в качестве свойства, а не пытаться напрямую вызвать метод компонента класса.

---

<div><toc></toc></div>

---

## createRef

Функция `createRef` возвращает обычный объект с одним свойством: `current`. При каждом вызове метода `render` Preact присваивает узлу или компоненту DOM значение `current`.

```jsx
// --repl
import { render, Component, createRef } from 'preact';
// --repl-before
class Foo extends Component {
  ref = createRef();

  componentDidMount() {
    console.log(this.ref.current);
    // Лог: [HTMLDivElement]
  }

  render() {
    return <div ref={this.ref}>foo</div>;
  }
}
// --repl-after
render(<Foo />, document.getElementById('app'));
```

## Обратные ссылки

Другой способ получения ссылки на элемент может быть осуществлен путём передачи функции обратного вызова. Он немного сложнее, но работает аналогично `createRef`.

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class Foo extends Component {
  ref = null;
  setRef = (dom) => (this.ref = dom);

  componentDidMount() {
    console.log(this.ref);
    // Лог: [HTMLDivElement]
  }

  render() {
    return <div ref={this.setRef}>foo</div>;
  }
}
// --repl-after
render(<Foo />, document.getElementById('app'));
```

> Если обратный вызов ref определён как встроенная функция, то он будет вызван дважды. Один раз с `null`, а затем с реальной ссылкой. Это распространенная ошибка, и API `createRef` немного облегчает её, заставляя пользователя проверять, определена ли `ref.current`.

## Собираем всё воедино

Допустим, нам нужно получить ссылку на узел DOM, чтобы измерить его ширину и высоту. У нас есть простой компонент, в котором необходимо заменить значения placeholder на реально измеренные.

```jsx
class Foo extends Component {
  // Здесь мы хотим использовать реальную ширину из узла DOM
  state = {
    width: 0,
    height: 0,
  };

  render(_, { width, height }) {
    return (
      <div>
        Ширина: {width}, высота: {height}
      </div>
    );
  }
}
```

Измерение имеет смысл только после вызова метода `render` и установки компонента в DOM. До этого узла DOM не будет существовать, и пытаться его измерить не имеет смысла.

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class Foo extends Component {
  state = {
    width: 0,
    height: 0,
  };

  ref = createRef();

  componentDidMount() {
    // Для обеспечения безопасности: Проверьте, была ли предоставлена ссылка
    if (this.ref.current) {
      const dimensions = this.ref.current.getBoundingClientRect();
      this.setState({
        width: dimensions.width,
        height: dimensions.height,
      });
    }
  }

  render(_, { width, height }) {
    return (
      <div ref={this.ref}>
        Ширина: {width}, высота: {height}
      </div>
    );
  }
}
// --repl-after
render(<Foo />, document.getElementById('app'));
```

Вот и всё! Теперь компонент при установке всегда будет отображать ширину и высоту.
