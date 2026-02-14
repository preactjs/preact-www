---
title: Prueba Unitaria con Enzyme
description: Pruebas de aplicaciones Preact hechas fáciles con enzyme
translation_by:
  - Ezequiel Mastropietro
---

# Prueba Unitaria con Enzyme

[Enzyme](https://airbnb.io/enzyme/) de Airbnb es una librería para escribir
pruebas para componentes React. Soporta diferentes versiones de React y
librerías similares a React usando "adaptadores". Hay un adaptador para Preact,
mantenido por el equipo de Preact.

Enzyme soporta pruebas que se ejecutan en un navegador normal o headless usando una herramienta
como [Karma](http://karma-runner.github.io/latest/index.html) o pruebas que
se ejecutan en Node usando [jsdom](https://github.com/jsdom/jsdom) como una
implementación simulada de las APIs del navegador.

Para una introducción detallada al uso de Enzyme y una referencia de la API, consulta la
[documentación de Enzyme](https://airbnb.io/enzyme/). El resto de esta guía
explica cómo configurar Enzyme con Preact, así como las formas en las que Enzyme con
Preact difiere de Enzyme con React.

---

<toc></toc>

---

## Instalación

Instala Enzyme y el adaptador de Preact usando:

```bash
npm install --save-dev enzyme enzyme-adapter-preact-pure
```

## Configuración

En tu código de configuración de prueba, necesitarás configurar Enzyme para usar el adaptador de Preact:

```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

configure({ adapter: new Adapter() });
```

Para obtener orientación sobre el uso de Enzyme con diferentes ejecutores de pruebas, consulta la sección de [Guías](https://airbnb.io/enzyme/docs/guides.html) de la documentación de Enzyme.

## Ejemplo

Supongamos que tenemos un componente simple `Counter` que muestra un valor inicial, con un botón para actualizarlo:

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function Counter({ initialCount }) {
	const [count, setCount] = useState(initialCount);
	const increment = () => setCount(count + 1);

	return (
		<div>
			Valor actual: {count}
			<button onClick={increment}>Incrementar</button>
		</div>
	);
}
```

Usando un ejecutor de pruebas como mocha o Jest, puedes escribir una prueba para verificar que funciona como se espera:

```jsx
import { expect } from 'chai';
import { h } from 'preact';
import { mount } from 'enzyme';

import Counter from '../src/Counter';

describe('Counter', () => {
	it('debería mostrar el recuento inicial', () => {
		const wrapper = mount(<Counter initialCount={5} />);
		expect(wrapper.text()).to.include('Valor actual: 5');
	});

	it('debería incrementar después de hacer clic en el botón "Incrementar"', () => {
		const wrapper = mount(<Counter initialCount={5} />);

		wrapper.find('button').simulate('click');

		expect(wrapper.text()).to.include('Valor actual: 6');
	});
});
```

Para una versión ejecutable de este proyecto y otros ejemplos, consulta el directorio [examples/](https://github.com/preactjs/enzyme-adapter-preact-pure/blob/master/README.md#example-projects) en el repositorio del adaptador de Preact.

## Cómo funciona Enzyme

Enzyme usa la librería adaptadora con la que ha sido configurada para renderizar un componente y sus hijos. El adaptador luego convierte el resultado a una representación interna estándar (un "React Standard Tree"). Enzyme luego lo envuelve con un objeto que tiene métodos para consultar el resultado y desencadenar actualizaciones. La API del objeto wrapper usa [selectores](https://airbnb.io/enzyme/docs/api/selector.html) similares a CSS para ubicar partes de la salida.

## Renderizado completo, superficial y de cadena

Enzyme tiene tres "modos" de renderizado:

```jsx
import { mount, shallow, render } from 'enzyme';

// Renderizar el árbol de componentes completo:
const wrapper = mount(<MyComponent prop="value" />);

// Renderizar solo la salida directa de `MyComponent` (es decir, "mock" componentes hijo
// para renderizar solo como marcadores de posición):
const wrapper = shallow(<MyComponent prop="value" />);

// Renderizar el árbol de componentes completo a una cadena HTML, y analizar el resultado:
const wrapper = render(<MyComponent prop="value" />);
```

- La función `mount` renderiza el componente y todos sus descendientes de la misma manera que serían renderizados en el navegador.

- La función `shallow` renderiza solo los nodos DOM que son devueltos directamente por el componente. Cualquier componente hijo es reemplazado con marcadores de posición que solo emiten sus propios hijos.

  La ventaja de este modo es que puedes escribir pruebas para componentes sin depender de los detalles de los componentes hijo y sin necesidad de construir todas sus dependencias.

  El modo de renderizado `shallow` funciona internamente de forma diferente con el adaptador de Preact en comparación con React. Consulta la sección de Diferencias más abajo para más detalles.

- La función `render` (¡no confundir con la función `render` de Preact!) renderiza un componente a una cadena HTML. Esto es útil para probar la salida de renderización en el servidor, o renderizar un componente sin disparar ninguno de sus efectos.

## Disparando actualizaciones de estado y efectos con `act`

En el ejemplo anterior, `.simulate('click')` fue usado para hacer clic en un botón.

Enzyme sabe que las llamadas a `simulate` probablemente cambiarán el estado de un
componente o desencadenarán efectos, por lo que aplicará cualquier actualización de estado o efecto
inmediatamente antes de que `simulate` devuelva. Enzyme hace lo mismo cuando el componente
se renderiza inicialmente usando `mount` o `shallow` y cuando un componente se actualiza
usando `setProps`.

Sin embargo, si un evento ocurre fuera de una llamada del método Enzyme, como llamar directamente
a un manejador de eventos (por ejemplo, la propiedad `onClick` del botón), entonces Enzyme no
será consciente del cambio. En este caso, tu prueba necesitará disparar la ejecución
de actualizaciones de estado y efectos y luego pedirle a Enzyme que actualice su vista de la
salida.

- Para ejecutar actualizaciones de estado y efectos de forma sincrónica, usa la función `act`
  de `preact/test-utils` para envolver el código que dispara las actualizaciones
- Para actualizar la vista de Enzyme de la salida renderizada usa el método `.update()` del wrapper

Por ejemplo, aquí hay una versión diferente de la prueba para incrementar el
contador, modificada para llamar a la propiedad `onClick` del botón directamente, en lugar de ir
a través del método `simulate`:

```js
import { act } from 'preact/test-utils';
```

```jsx
it('debería incrementar después de hacer clic en el botón "Incrementar"', () => {
	const wrapper = mount(<Counter initialCount={5} />);
	const onClick = wrapper.find('button').props().onClick;

	act(() => {
		// Invoca el manejador de clic del botón, pero esta vez directamente, en lugar de
		// a través de una API de Enzyme
		onClick();
	});
	// Actualiza la vista de Enzyme de la salida
	wrapper.update();

	expect(wrapper.text()).to.include('Valor actual: 6');
});
```

## Diferencias de Enzyme con React

La intención general es que las pruebas escritas usando Enzyme + React se puedan adaptar fácilmente
para funcionar con Enzyme + Preact o viceversa. Esto evita la necesidad de reescribir todas
tus pruebas si necesitas cambiar un componente inicialmente escrito para Preact
para que funcione con React o viceversa.

Sin embargo, hay algunas diferencias en el comportamiento entre este adaptador y los adaptadores
React de Enzyme a tener en cuenta:

- El modo de renderizado "superficial" funciona diferentemente internamente. Es
  consistente con React al renderizar solo un componente "un nivel de profundidad" pero,
  a diferencia de React, crea nodos DOM reales. También ejecuta todos los hooks de ciclo de vida
  normales y efectos.
- El método `simulate` envía eventos DOM reales, mientras que en los adaptadores de
  React, `simulate` solo llama a la propiedad `on<EventName>`
- En Preact, las actualizaciones de estado (por ejemplo, después de una llamada a `setState`) se agrupan
  y se aplican de forma asincrónica. En React, las actualizaciones de estado se pueden aplicar inmediatamente
  o por lotes dependiendo del contexto. Para facilitar la escritura de pruebas, el
  adaptador de Preact vacía las actualizaciones de estado y los efectos después de renderizaciones iniciales y
  actualizaciones desencadenadas a través de llamadas `setProps` o `simulate` en un adaptador. Cuando las actualizaciones de estado o
  los efectos son desencadenados por otros medios, tu código de prueba podría necesitar
  desencadenar manualmente el vaciado de efectos y actualizaciones de estado usando `act` desde
  el paquete `preact/test-utils`.

Para más detalles, consulta [el README del adaptador de Preact](https://github.com/preactjs/enzyme-adapter-preact-pure#differences-compared-to-enzyme--react).
