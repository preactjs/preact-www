---
name: Методы жизненного цикла
permalink: '/guide/lifecycle-methods'
---

# Жизненный цикл компонентов и его методы

> _**Подсказка:** Если вы использовали HTML5 Custom Elements, то это очень похоже на методы жизненного цикла `attachedCallback` и `detachedCallback`._

Preact вызывает следующие методы жизненного цикла, если они заданы для компонента:

| Метод                       | Когда вызывается                                            |
|-----------------------------|-------------------------------------------------------------|
| `componentWillMount`        | перед тем, как компонент будет добавлен в DOM               |
| `componentDidMount`         | после того, как компонент будет добавлен в DOM              |
| `componentWillUnmount`      | перед удалением из DOM                                      |
| `componentDidUnmount`       | после удаления из DOM                                       |
| `componentWillReceiveProps` | перед получением новых `props`                              |
| `shouldComponentUpdate`     | перед `render()`. Для пропуска рендера должен вернуть false |
| `componentWillUpdate`       | перед `render()`                                            |
| `componentDidUpdate`        | после `render()`                                            |
