---
name: Lifecycle-Methoden
permalink: '/guide/lifecycle-methods'
---

# Lifecycle-Methoden

> _**Tipp:** Falls du schon mal HTML5 Custom Elements verwendet hast, das ist vergleichbar mit den Lifecycle-Methoden `attachedCallback` und `detachedCallback`._

Preact führt die folgenden Lifecycle-Methoden aus, wenn diese bei einer Komponente definiert sind:

| Lifecycle-Methode           | Wann sie ausgeführt wird                         |
|-----------------------------|--------------------------------------------------|
| `componentWillMount`        | bevor die Komponente ins DOM gemounted wurde     |
| `componentDidMount`         | nachdem die Komponente ins DOM gemounted wurde   |
| `componentWillUnmount`      | vor dem Entfernen aus dem DOM                    |
| `componentDidUnmount`       | nach dem Entfernen aus dem DOM                   |
| `componentWillReceiveProps` | bevor neue Props akzeptiert wurden               |
| `shouldComponentUpdate`     | vor `render()`. Gib `false` zurück um das Rendern zu überspringen |
| `componentWillUpdate`       | vor `render()`                                   |
| `componentDidUpdate`        | nach `render()`                                  |
