---
name: Контекст
description: 'Контекст позволяет передавать параметры через промежуточные компоненты. В этом документе описывается как новый, так и старый API'
---

# Контекст

Контекст позволяет передавать значение дочернему компоненту в глубине дерева, не пропуская его через все последующие компоненты с помощью `props`. Очень популярным вариантом такого использования является тематическое оформление. В двух словах контекст можно представить как способ выполнения обновлений в стиле `pub-sub` в Preact.

Существует два различных способа использования контекста: Через новый API `createContext` и старый API контекста. Разница между ними заключается в том, что старый вариант не может обновить дочерний компонент, когда компонент между ними прерывает рендеринг через `shouldComponentUpdate`. Поэтому мы настоятельно рекомендуем всегда использовать `createContext`.

---

<div><toc></toc></div>

---

## createContext

Сначала нам необходимо создать объект контекста, который мы сможем передавать по кругу. Это делается с помощью функции `createContext(initialValue)`. Он возвращает компонент `Provider`, который используется для установки значения контекста, и компонент `Consumer`, который извлекает значение из контекста.

Аргумент `initialValue` используется только в том случае, если у контекста нет соответствующего `Provider` над ним в дереве. Это может быть полезно для изолированного тестирования компонентов, поскольку позволяет избежать необходимости создания оборачивающего `Provider`.

```jsx
// --repl
import { render, createContext } from 'preact';

const SomeComponent = (props) => props.children;
// --repl-before
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {(theme) => {
        return (
          <button {...props} class={'btn ' + theme}>
            Переключить тему
          </button>
        );
      }}
    </Theme.Consumer>
  );
}

function App() {
  return (
    <Theme.Provider value='dark'>
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    </Theme.Provider>
  );
}
// --repl-after
render(<App />, document.getElementById('app'));
```

> Более простой способ использовать контекст — использовать хук [useContext](/guide/v10/hooks/#usecontext).

## Устаревший API контекста

Мы включаем устаревший API в основном из соображений обратной совместимости. Он был заменен API `createContext`. У устаревшего API есть известные проблемы, такие как блокировка обновлений, если между ними есть компоненты, которые возвращают false в `shouldComponentUpdate`. Если вам всё же нужно его использовать, продолжайте читать.

Чтобы передать пользовательскую переменную через контекст, компонент должен иметь метод `getChildContext`. Там вы возвращаете новые значения, которые хотите сохранить в контексте. Доступ к контексту можно получить через второй аргумент в функциональных компонентах или через `this.context` в компоненте на основе класса.

```jsx
// --repl
import { render } from 'preact';

const SomeOtherComponent = (props) => props.children;
// --repl-before
function ThemedButton(props, context) {
  return (
    <button {...props} class={'btn ' + context.theme}>
      Переключить тему
    </button>
  );
}

class App extends Component {
  getChildContext() {
    return {
      theme: 'light',
    };
  }

  render() {
    return (
      <div>
        <SomeOtherComponent>
          <ThemedButton />
        </SomeOtherComponent>
      </div>
    );
  }
}
// --repl-after
render(<App />, document.getElementById('app'));
```
