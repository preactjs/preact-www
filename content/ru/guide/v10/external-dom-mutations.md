---
name: Внешние мутации DOM
permalink: '/guide/external-dom-mutations'
description: 'Как интегрировать Preact с jQuery и другими фрагментами JavaScript, которые непосредственно изменяют DOM'
---

# Внешние мутации DOM

Иногда возникает необходимость работы со сторонними библиотеками, которые рассчитывают на свободную мутацию DOM, сохранение состояния внутри него или вообще не имеют границ компонентов. Существует множество замечательных наборов инструментов пользовательского интерфейса или многократно используемых элементов, которые работают именно таким образом.

В Preact (и аналогично в React) для работы с подобными библиотеками необходимо указать алгоритму рендеринга/дифференцирования Virtual DOM, что он не должен пытаться _отменять_ любые внешние DOM-мутации, выполняемые внутри данного компонента (или элемента DOM, который он представляет).

---

<div><toc></toc></div>

---

## Техника

Это может быть так же просто, как определить метод `shouldComponentUpdate()` для вашего компонента и заставить его возвращать `false`:

```jsx
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

... или покороче:

```jsx
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

После установки этого хука жизненного цикла и указания Preact не перерисовывать компонент при изменениях в дереве Virtual DOM, ваш компонент теперь имеет ссылку на свой корневой элемент DOM, который можно рассматривать как статический до тех пор, пока компонент не будет демонтирован. Как и в любом компоненте, эта ссылка называется просто `this.base` и соответствует корневому JSX-элементу, который был возвращен из `render()`.

---

## Пример пошагового руководства

Приведем пример «выключения» повторного рендеринга для компонента. Обратите внимание, что `render()` по-прежнему вызывается в процессе создания и установки компонента, чтобы сформировать его начальную структуру DOM.

```jsx
class Example extends Component {
  shouldComponentUpdate() {
    // не пересчитывать через diff:
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // здесь можно что-то сделать с входящими параметрами, если нужно
  }

  componentDidMount() {
    // компонент смонтирован, можно свободно модифицировать DOM:
    let thing = document.createElement('maybe-a-custom-element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // компонент будет удален из DOM, выполняем все необходимые действия по очистке
  }

  render() {
    return <div class='example' />;
  }
}
```

## Демонстрация

[![demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**Посмотреть эту демонстрацию на Webpackbin**](https://www.webpackbin.com/bins/-KflCmJ5bvKsRF8WDkzb)

## Реальные примеры

В качестве альтернативы можно посмотреть на этот прием в [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) — он использует компонент как точку опоры в DOM, но затем отключает обновления и позволяет [tags-input](https://github.com/developit/tags-input) взять на себя управление. Более сложным примером может служить [preact-richtextarea](https://github.com/developit/preact-richtextarea), в котором эта техника используется для того, чтобы избежать повторного отображения редактируемого `<iframe>`.
