---
name: Project Goals
permalink: '/about/project-goals'
---

# Metas del proyecto

## Metas

Preact tiene como objetivo cumplir con los siguientes puntos:

- **Performante:** Renderizar rápido y eficientemente
- **Tamaño:** Tamaño pequeño y liviano _(aproximadamente 3.5kb)_
- **Eficiencia:** Uso eficiente de la memoria
- **Comprensibilidad:** Entender el código fuente debería llevar muy poco tiempo, a penas unas horas
- **Compatibilidad:** Preact apunta ser _compatible en gran medida_ con la API React. [preact-compat] intenta lograr la mayor compatibilidad posible con React.

## Funcionalidades excluidas

Algunas funcionalidades de React son omitidas intencionalmente en Preact, ya que no cumplen con los puntos mencionados anteriormente, o bien, porque no encajan dentro del alcance del conjunto básico de funciones de Preact.

- Los ítems excluidos se pueden encontrar en la sección [¿Qué falta?]:
    - PropTypes, ya que se pueden utilizar como una librería separada
    - Children, ya que Preact siempre empaqueta los children como un Array
    - Synthetic Events, ya que Preact no tiene soporte para navegadores antiguos como IE8

[preact-compat]: https://github.com/developit/preact-compat/
[¿Qué falta?]: /guide/differences-to-react#whats-missing
