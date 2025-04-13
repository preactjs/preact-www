---
title: Отличия от React
---

# Отличия от React

Сам по себе Preact не является переосмыслением React. Различия есть. Многие из этих различий тривиальны или могут быть полностью устранены с помощью [preact-compat], который представляет собой тонкий слой над Preact, пытающийся достичь 100% совместимости с React.

Причина, по которой Preact не пытается включить в себя все возможности React, заключается в том, чтобы оставаться **маленьким** и **сфокусированным** — в противном случае было бы разумнее просто направлять оптимизации в проект React, который уже является очень сложной и хорошо структурированной кодовой базой.

---

<toc></toc>

---

## Совместимость версий

Для Preact и [preact-compat] совместимость версий измеряется по отношению к _текущему_ и _предыдущему_ основным выпускам React. Когда команда React анонсирует новые функции, они могут быть добавлены в ядро Preact, если это имеет смысл с учетом [Целей проекта][Project Goals]. Это довольно демократичный процесс, постоянно развивающийся благодаря обсуждениям и решениям, принимаемым открыто, с помощью issues и pull requests.

> Таким образом, на сайте и в документации при обсуждении совместимости или сравнении React указывается `0.14.x` и `15.x`.


## Что включено?

- [Классовые компоненты ES6]
    - _Классы обеспечивают выразительный способ определения компонентов с состоянием_
- [Компоненты высшего порядка]
    - _компоненты, которые возвращают другие компоненты из `render()`, фактически обёртки_
- [Чисто функциональные компоненты без состояния]
    - _функции, которые получают `props` в качестве аргументов и возвращают JSX/VDOM_
- [Contexts]: В Preact [3.0] была добавлена поддержка устаревшего `контекстного API`.
    - _Поддержка [нового api](https://reactjs.org/docs/context.html) обсуждается в [PR #963](https://github.com/preactjs/preact/pull/963)._
- [Refs]: Поддержка refs-функций была добавлена в Preact [4.0]. Строковые refs поддерживаются в `preact-compat`.
    - _Ссылки предоставляют возможность ссылаться на отображаемые элементы и дочерние компоненты._
- Различие Virtual DOM
    - _Это данность: различия в Preact просты, но эффективны и **[чрезвычайно](http://developit.github.io/js-repaint-perfs/) [быстры](https://localvoid.github.io/uibench/)**._
- `h()`, более обобщённая версия `React.createElement`
    - _Изначально эта идея называлась [hyperscript] и имеет ценность далеко за пределами экосистемы React, поэтому Preact продвигает оригинальный стандарт. ([Почему `h()`?](https://jasonformat.com/wtf-is-jsx))_
    - _Это также немного более читабельно: `h('a', { href:'/' }, h('span', null, 'Home'))`_


## Что добавлено?

Preact добавляет несколько удобных функций, вдохновленных работой сообщества React:

- `this.props` и `this.state` передаются в `render()`
    - _Вы по-прежнему можете ссылаться на них вручную. Это просто чище, особенно при [деструктуризации][destructuring]_
- Пакетное обновление DOM, отменяемое/согласованное с помощью `setTimeout(1)`. _(также можно использовать requestAnimationFrame)_
- Вы можете просто использовать `class` для классов CSS. `className` по-прежнему поддерживается, но `class` предпочтительнее.
- Переработка/сохранение компонентов и элементов.


## Чего не хватает?

- [PropType] Валидация: Не все используют PropTypes, поэтому они не являются частью ядра Preact.
    - _**PropTypes полностью поддерживаются** в [preact-compat], или вы можете использовать их вручную._
- [Children]: В Preact в этом нет необходимости, поскольку `props.children` _всегда является массивом_.
    - _`React.Children` полностью поддерживается в [preact-compat]._
- Синтетические события: Цель поддержки браузера Preact не требует этих дополнительных затрат.
    - _Для обработки событий Preact использует встроенный в браузер `addEventListener`. Полный список обработчиков событий DOM см. в статье [GlobalEventHandlers]._
    - _Полная реализация событий означает больше проблем с обслуживанием и производительностью, а также более широкий API._


## Что изменилось?

У Preact и React есть и более тонкие различия:

- `render()` принимает третий аргумент, который является корневым узлом для _замены_, в противном случае он добавляется. В будущих версиях это может немного измениться, возможно, автоматическое определение того, что замена рендера уместна, путём проверки корневого узла.
- Компоненты не реализуют `contextTypes` или `childContextTypes`. Потомки получают все записи `контекста`, полученные из `getChildContext()`.

[Project Goals]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[3.0]: https://github.com/preactjs/preact/milestones/3.0
[4.0]: https://github.com/preactjs/preact/milestones/4.0
[preact-compat]: https://github.com/preactjs/preact-compat
[PropType]: https://github.com/developit/proptypes
[Contexts]: https://reactjs.org/docs/legacy-context.html
[Refs]: https://facebook.github.io/react/docs/more-about-refs.html
[Children]: https://facebook.github.io/react/docs/top-level-api.html#reactchildren
[GlobalEventHandlers]: https://mdn2.netlify.app/en-us/docs/web/api/globaleventhandlers/
[Классовые компоненты ES6]: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
[Компоненты высшего порядка]: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
[Чисто функциональные компоненты без состояния]: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
[destructuring]: http://www.2ality.com/2015/01/es6-destructuring.html
[Linked State]: /guide/v8/linked-state
