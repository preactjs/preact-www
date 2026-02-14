---
title: Pruebas con Preact Testing Library
description: Pruebas de aplicaciones Preact hechas fáciles con testing-library
translation_by:
  - Ezequiel Mastropietro
---

# Pruebas con Preact Testing Library

La [Preact Testing Library](https://github.com/testing-library/preact-testing-library) es un wrapper ligero alrededor de `preact/test-utils`. Proporciona un conjunto de métodos de consulta para acceder al DOM renderizado de una manera similar a cómo un usuario encuentra elementos en una página. Este enfoque te permite escribir pruebas que no dependen de los detalles de implementación. En consecuencia, esto hace que las pruebas sean más fáciles de mantener y más resistentes cuando el componente siendo probado es refactorizado.

A diferencia de [Enzyme](/guide/v10/unit-testing-with-enzyme), Preact Testing Library debe ser llamada dentro de un entorno DOM.

---

<toc></toc>

---

## Instalación

Instala el adaptador testing-library Preact a través del siguiente comando:

```bash
npm install --save-dev @testing-library/preact
```

> Nota: Esta librería se basa en que hay un entorno DOM presente. Si estás usando [Jest](https://github.com/facebook/jest) ya está incluido y habilitado por defecto. Si estás usando otro ejecutor de pruebas como [Mocha](https://github.com/mochajs/mocha) o [Jasmine](https://github.com/jasmine/jasmine) puedes agregar un entorno DOM a node instalando [jsdom](https://github.com/jsdom/jsdom).

## Uso

Supongamos que tenemos un componente `Counter` que muestra un valor inicial, con un botón para actualizarlo:

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export function Counter({ initialCount }) {
	const [count, setCount] = useState(initialCount);
	const increment = () => setCount(count + 1);

	return (
		<div>
			Current value: {count}
			<button onClick={increment}>Increment</button>
		</div>
	);
}
```

Queremos verificar que nuestro Counter muestre el conteo inicial y que hacer clic en el botón lo incremente. Usando el ejecutor de pruebas de tu elección, como [Jest](https://github.com/facebook/jest) o [Mocha](https://github.com/mochajs/mocha), podemos escribir estos dos escenarios:

```jsx
import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';

import Counter from '../src/Counter';

describe('Counter', () => {
	test('should display initial count', () => {
		const { container } = render(<Counter initialCount={5} />);
		expect(container.textContent).toMatch('Current value: 5');
	});

	test('should increment after "Increment" button is clicked', async () => {
		render(<Counter initialCount={5} />);

		fireEvent.click(screen.getByText('Increment'));
		await waitFor(() => {
			// .toBeInTheDocument() es una aserción que viene de jest-dom.
			// De otro modo, podrías usar .toBeDefined().
			expect(screen.getByText('Current value: 6')).toBeInTheDocument();
		});
	});
});
```

Quizás notaste la llamada `waitFor()` allí. Necesitamos esto para asegurar que Preact tuvo tiempo suficiente para renderizar al DOM y vaciar todos los efectos pendientes.

```jsx
test('should increment counter', async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Increment'));
  // INCORRECTO: Preact probablemente no haya terminado de renderizar aquí
  expect(screen.getByText("Current value: 6")).toBeInTheDocument();
});
```

Debajo del capó, `waitFor` llama repetidamente a la función callback pasada hasta que no lance un error más o se agote el tiempo (predeterminado: 1000ms). En el ejemplo anterior sabemos que la actualización se completó, cuando el contador se incrementa y el nuevo valor se renderiza en el DOM.

También podemos escribir pruebas de una manera asincrónica-primero usando la versión "findBy" de las consultas en lugar de "getBy". Las consultas asincrónicas reintentan usando `waitFor` debajo del capó, y devuelven Promesas, por lo que necesitas hacer await sobre ellas.

```jsx
test('should increment counter', async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Increment'));

  await screen.findByText('Current value: 6'); // espera a que el elemento cambie

  expect(screen.getByText("Current value: 6")).toBeInTheDocument(); // pasa
});
```

## Encontrando Elementos

Con un entorno DOM completo en su lugar, podemos verificar nuestros nodos DOM directamente. Comúnmente las pruebas verifican que los atributos estén presentes como un valor de entrada o que un elemento aparezca/desaparezca. Para hacer esto, necesitamos ser capaces de ubicar elementos en el DOM.

### Usando Contenido

La filosofía de Testing Library es que "cuanto más tus pruebas se parezcan a la forma en que se usa tu software, más confianza pueden darte".

La forma recomendada de interactuar con una página es encontrando elementos de la forma en que un usuario lo hace, a través del contenido de texto.

Puedes encontrar una guía para elegir la consulta correcta en la página ['¿Qué consulta debo usar?'](https://testing-library.com/docs/guide-which-query) de la documentación de Testing Library. La consulta más simple es `getByText`, que busca en el `textContent` de los elementos. También hay consultas para texto de etiqueta, placeholder, atributos de título, etc. La consulta `getByRole` es la más poderosa en que abstrae el DOM y te permite encontrar elementos en el árbol de accesibilidad, que es cómo tu página es leída por un lector de pantalla. Combinando [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques) y [`nombre accesible`](https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_name) cubre muchos recorridos DOM comunes en una sola consulta.

```jsx
import { render, fireEvent, screen } from '@testing-library/preact';

test('should be able to sign in', async () => {
	render(<MyLoginForm />);

	// Ubica la entrada usando el rol textbox y el nombre accesible,
	// que es estable sin importar si usas un elemento label, aria-label, o
	// relación aria-labelledby
	const field = await screen.findByRole('textbox', { name: 'Sign In' });

	// escribe en el campo
	fireEvent.change(field, { value: 'user123' });
});
```

A veces, usar contenido de texto directamente crea fricción cuando el contenido cambia mucho, o si usas un marco de internacionalización que traduce texto a diferentes idiomas. Puedes evitar esto tratando el texto como datos que haces snapshot, lo que facilita la actualización pero mantiene la fuente de verdad fuera de la prueba.

```jsx
test('should be able to sign in', async () => {
	render(<MyLoginForm />);

	// ¿Qué pasa si renderizamos la aplicación en otro idioma o cambiamos el texto? La prueba falla.
	const field = await screen.findByRole('textbox', { name: 'Sign In' });
	fireEvent.change(field, { value: 'user123' });
});
```

Incluso si no usas un marco de traducción, puedes mantener tus cadenas en un archivo separado y usar la misma estrategia que en el ejemplo a continuación:

```jsx
test('should be able to sign in', async () => {
	render(<MyLoginForm />);

	// Podemos usar nuestra función de traducción directamente en la prueba
	const label = translate('signinpage.label', 'en-US');
	// Haz snapshot del resultado para que sepas qué está pasando
	expect(label).toMatchInlineSnapshot(`Sign In`);

	const field = await screen.findByRole('textbox', { name: label });
	fireEvent.change(field, { value: 'user123' });
});
```

### Usando IDs de Prueba

Los IDs de prueba son atributos de datos agregados a elementos DOM para ayudar en casos donde seleccionar contenido es ambiguo o impredecible, o para desacoplarse de detalles de implementación como la estructura del DOM. Se pueden usar cuando ninguno de los otros métodos para encontrar elementos tiene sentido.

```jsx
function Foo({ onClick }) {
	return (
		<button onClick={onClick} data-testid="foo">
			click here
		</button>
	);
}

// Solo funciona si el texto permanece igual
fireEvent.click(screen.getByText('click here'));

// Funciona si cambiamos el texto
fireEvent.click(screen.getByTestId('foo'));
```

## Debugging Tests
purando Pruebas

Para depurar el estado actual del DOM puedes usar la función `debug()` para imprimir una versión embellecida del DOM.

```jsx
const { debug } = render(<App />);

// Imprime una versión embellecida del DOM
debug()
```

## Proporcionando Proveedores de Contexto Personalizados

Bastante a menudo terminarás con un componente que depende del estado de contexto compartido. Los Proveedores comunes típicamente van desde Routers, State, hasta a veces Themes y otros que son globales para tu aplicación específica. Esto puede volverse tedioso de configurar para cada caso de prueba repetidamente, así que recomendamos crear una función `render` personalizada envolviendo la de `@testing-library/preact`.

```jsx
// helpers.js
import { render as originalRender } from '@testing-library/preact';
import { createMemoryHistory } from 'history';
import { FooContext } from './foo';

const history = createMemoryHistory();

export function render(vnode) {
	return originalRender(
		<FooContext.Provider value="foo">
			<Router history={history}>{vnode}</Router>
		</FooContext.Provider>
	);
}

// Uso como de costumbre. ¡Mira mamá, sin proveedores!
render(<MyComponent />);
```

## Probando Hooks de Preact

¡Con `@testing-library/preact` también podemos probar la implementación de nuestros hooks!
Imagina que queremos reutilizar la funcionalidad del contador para múltiples componentes (¡sé que nos encantan los contadores!) y la hemos extraído a un hook. Y ahora queremos probarla.

```jsx
import { useState, useCallback } from 'preact/hooks';

const useCounter = () => {
	const [count, setCount] = useState(0);
	const increment = useCallback(() => setCount(c => c + 1), []);
	return { count, increment };
};
```

Como antes, el enfoque detrás de esto es similar: Queremos verificar que podamos incrementar nuestro contador. Así que necesitamos llamar a nuestro hook de alguna manera. Esto se puede hacer con la función `renderHook()`, que automáticamente crea un componente envolvente internamente. La función devuelve el valor de retorno actual del hook bajo `result.current`, que podemos usar para hacer nuestras verificaciones:

```jsx
import { renderHook, act } from '@testing-library/preact';
import useCounter from './useCounter';

test('should increment counter', () => {
	const { result } = renderHook(() => useCounter());

	// Inicialmente el contador debe ser 0
	expect(result.current.count).toBe(0);

	// Actualicemos el contador llamando a un callback del hook
	act(() => {
		result.current.increment();
	});

	// Verifica que el valor de retorno del hook refleje el nuevo estado.
	expect(result.current.count).toBe(1);
});
```

Para más información sobre `@testing-library/preact` revisa https://github.com/testing-library/preact-testing-library .
