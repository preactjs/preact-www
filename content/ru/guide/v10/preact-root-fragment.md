---
title: preact-root-fragment
description: Независимая реализация параметра `replaceNode` (устаревшего в Preact 10) для Preact 10+
---

# preact-root-fragment

preact-root-fragment — это независимая и более гибкая реализация параметра `replaceNode` (устаревшего в Preact 10) для Preact 10+.

Она предоставляет способ рендеринга или гидратации дерева Preact с использованием подмножества дочерних элементов внутри родительского элемента, переданного в `render()`:

```html
<body>
	<div id="root"> ⬅ передаем это в render() как родительский DOM-элемент...

		<script src="/etc.js"></script>

		<div class="app"> ⬅ ... но мы хотим использовать это дерево, а не скрипт
			<!-- ... -->
		</div>
	</div>
</body>
```

---

<toc></toc>

---

## Зачем это мне?

Это особенно полезно для [частичной гидратации](https://jasonformat.com/islands-architecture/), которая часто требует рендеринга нескольких отдельных деревьев Preact в один и тот же родительский DOM-элемент. Представьте сценарий ниже — какие элементы мы должны передать в `hydrate(jsx, parent)`, чтобы каждый виджет `<section>` гидратировался без перезаписи других?

```html
<div id="sidebar">
  <section id="widgetA"><h1>Виджет A</h1></section>
  <section id="widgetB"><h1>Виджет B</h1></section>
  <section id="widgetC"><h1>Виджет C</h1></section>
</div>
```

Preact 10 предоставлял несколько непонятный третий аргумент для `render` и `hydrate` под названием `replaceNode`, который можно было использовать в приведённом выше случае:

```jsx
render(<A />, sidebar, widgetA); // вставить результат в <div id="sidebar">, обрабатывая только <section id="widgetA">
render(<B />, sidebar, widgetB); // то же самое, но только для widgetB
render(<C />, sidebar, widgetC); // то же самое, но только для widgetC
```

Хотя аргумент `replaceNode` оказался полезным для обработки сценариев вроде приведённого выше, он был ограничен одним DOM-элементом и не мог работать с деревьями Preact, имеющими несколько корневых элементов. Кроме того, он плохо справлялся с обновлениями, когда несколько деревьев монтировались в один и тот же родительский DOM-элемент, что, как оказалось, является ключевым сценарием использования.

В будущем мы предоставляем эту функциональность в виде независимой библиотеки под названием `preact-root-fragment`.

## Как это работает

`preact-root-fragment` предоставляет функцию `createRootFragment`:

```ts
createRootFragment(parent: ContainerNode, children: ContainerNode | ContainerNode[]);
```

Вызов этой функции с родительским DOM-элементом и одним или несколькими дочерними элементами возвращает «Фрагмент с сохранением состояния». Это фальшивый DOM-элемент, который притворяется, что содержит предоставленные дочерние элементы, сохраняя их в их существующем реальном родительском элементе. Его можно передать в `render()` или `hydrate()` вместо аргумента `parent`.

Используя предыдущий пример, мы можем заменить устаревшее использование `replaceNode` на `createRootFragment`:

```jsx
import { createRootFragment } from 'preact-root-fragment';

render(<A />, createRootFragment(sidebar, widgetA));
render(<B />, createRootFragment(sidebar, widgetB));
render(<C />, createRootFragment(sidebar, widgetC));
```

Поскольку мы создаем отдельные родители «Фрагментов с сохранением состояния» для каждой передачи в `render()`, Preact будет относиться к каждому как к независимому дереву Virtual DOM.

## Несколько корневых элементов

В отличие от параметра `replaceNode` из Preact 10, `createRootFragment` может принимать массив дочерних элементов, которые будут использоваться как корневые элементы при рендеринге. Это особенно полезно при рендеринге дерева Virtual DOM, которое генерирует несколько корневых элементов, например, фрагмент или массив:

```jsx
import { createRootFragment } from 'preact-root-fragment';
import { render } from 'preact';

function App() {
  return (
    <>
      <h1>Example</h1>
      <p>Hello world!</p>
    </>
  );
}

// Используем только последние два дочерних элемента внутри <body>:
const children = [].slice.call(document.body.children, -2);

render(<App />, createRootFragment(document.body, children));
```

## Поддержка версий Preact

Эта библиотека работает с Preact 10 и 11.
