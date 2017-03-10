---
name: Внешние изменения DOM
permalink: '/guide/external-dom-mutations'
---

# Внешние изменения DOM


## Введение

Иногда приходится работать со сторонними библиотеками, которые рассчитывают на возможность свободно изменять дерево DOM, хранить собственное состояние в нём, или вообще не ограничены каким-то элементом DOM. Есть множество замечательных UI-тулкитов или встраиваемых элементов, которые так работают. В Preact (как и в React), чтобы работать с такими библиотеками, надо сообщить алгоритму Virtual DOM, что он не должен _отменять_ любые сторонние изменения DOM внутри некоторого компонента.


## Техника

This can be as simple as defining a `shouldComponentUpdate()` method on your component, and having it return `false`:

```js
class Block extends Component {
  shouldComponentUpdate() {
    return false;
  }
}
```

Или так:

```js
class Block extends Component {
  shouldComponentUpdate = () => false;
}
```

С этим хуком Preact не будет заново рендерить компонент всякий раз, когда дерево VDOM изменяется. Также в компоненте теперь есть ссылка на его корневой DOM-элемент, которую можно считать статичной, пока компонент не отмонтируется. Как и в любом компоненте, эта ссылка называется `this.base` и соответствует корневому элементу JSX, который возвращён из `render()`.

---

## Пример

Вот пример «отключения» ре-ренденринга для компонента. Учтите, что `render()` всё равно выполняется при создании и монтировании для того, чтобы получить изначальную структуру DOM.

```js
class Example extends Component {
  shouldComponentUpdate() {
    // не рендерить заново при изменениях:
    return false;
  }

  componentWillReceiveProps(nextProps) {
    // здесь можно что-нибудь сделать при изменении props
  }

  componentDidMount() {
    // компонент подключен, можно спокойно изменять DOM:
    let thing = document.createElement('maybe-a-custom-element');
    this.base.appendChild(thing);
  }

  componentWillUnmount() {
    // компонени будет убран из DOM
  }

  render() {
    return <div class="example" />;
  }
}
```


## Демо

[![demo](https://i.gyazo.com/a63622edbeefb2e86d6c0d9c8d66e582.gif)](http://www.webpackbin.com/V1hyNQbpe)

[**Этот пример на Webpackbin**](http://www.webpackbin.com/V1hyNQbpe)


## Примеры использования

Эта техника используется в [preact-token-input](https://github.com/developit/preact-token-input/blob/master/src/index.js) — компонент там используется как обёртка для [tags-input](https://github.com/developit/tags-input). Более серьёзный пример — [preact-richtextarea](https://github.com/developit/preact-richtextarea) — здесь эта техника используется, чтобы избежать повторного рендеринга изменяемого `<iframe>`.
