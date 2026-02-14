---
title: Web Components
description: Cómo usar web components con Preact
translation_by:
  - Ezequiel Mastropietro
---

# Web Components

Los Web Components son un conjunto de diferentes tecnologías que te permiten crear elementos HTML personalizados reutilizables y encapsulados que son completamente agnósticos del framework. Ejemplos de Web Components incluyen elementos como `<material-card>` o `<tab-bar>`.

Como primitivo de plataforma, Preact [soporta completamente Web Components](https://custom-elements-everywhere.com/#preact), permitiendo el uso transparente de ciclos de vida, propiedades y eventos de Custom Elements en tus aplicaciones Preact.

Preact y Web Components son tecnologías complementarias: Los Web Components proporcionan un conjunto de primitivos de bajo nivel para extender el navegador, y Preact proporciona un modelo de componentes de alto nivel que se sitúa sobre esos primitivos.

---

<toc></toc>

---

## Renderizar Web Components

En Preact, los web components funcionan como otros elementos DOM. Pueden ser renderizados usando su nombre de etiqueta registrado:

```jsx
customElements.define(
	'x-foo',
	class extends HTMLElement {
		// ...
	}
);

function Foo() {
	return <x-foo />;
}
```

### Propiedades y Atributos

JSX no proporciona una forma de diferenciar entre propiedades y atributos. Los Elementos Personalizados generalmente dependen de propiedades personalizadas para soportar la configuración de valores complejos que no se pueden expresar como atributos. Esto funciona bien en Preact, porque el renderizador determina automáticamente si establecer valores usando una propiedad o un atributo inspeccionando el elemento DOM afectado. Cuando un Elemento Personalizado define un [setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) para una propiedad dada, Preact detecta su existencia y usará el setter en lugar de un atributo.

```jsx
customElements.define(
	'context-menu',
	class extends HTMLElement {
		set position({ x, y }) {
			this.style.cssText = `left:${x}px; top:${y}px;`;
		}
	}
);

function Foo() {
	return <context-menu position={{ x: 10, y: 20 }}> ... </context-menu>;
}
```

> **Nota:** Preact no hace suposiciones sobre esquemas de nombres e intentará no forzar nombres (coerción), ya sea en JSX o en cualquier otro lugar, a propiedades del DOM. Si un elemento personalizado tiene un nombre de propiedad `someProperty`, entonces deberá establecerse usando exactamente la misma capitalización y ortografía (`someProperty=...`). `someproperty=...` o `some-property=...` no funcionarán.

Al renderizar HTML estático usando `preact-render-to-string` ("SSR"), los valores de propiedades complejas como el objeto anterior no se serializan automáticamente. Estos se aplican una vez que el HTML estático se hidrata en el cliente.

### Acceder a Métodos de Instancia

Para poder acceder a la instancia de tu componente web personalizado, podemos aprovechar las `refs`:

```jsx
function Foo() {
	const myRef = useRef(null);

	useEffect(() => {
		if (myRef.current) {
			myRef.current.hacerAlgo();
		}
	}, []);

	return <x-foo ref={myRef} />;
}
```

### Disparar Eventos Personalizados

Preact normaliza el uso de mayúsculas y minúsculas de los eventos DOM estándar integrados, que normalmente distinguen entre mayúsculas y minúsculas. Esta es la razón por la que es posible pasar una propiedad `onChange` a `<input>`, a pesar de que el nombre del evento real sea `"change"`. Los Elementos Personalizados a menudo disparan eventos personalizados como parte de su API pública; sin embargo, no hay forma de saber qué eventos personalizados podrían dispararse. Para asegurar que los Elementos Personalizados sean compatibles sin problemas en Preact, las propiedades del manejador de eventos no reconocidas que se pasen a un elemento DOM se registran usando sus mayúsculas exactamente como se especificaron.

```jsx
// Evento DOM incorporado: escucha un evento "click"
<input onClick={() => console.log('clic')} />

// Elemento Personalizado: escucha evento "TabChange" (¡distingue entre mayúsculas y minúsculas!)
<tab-bar onTabChange={() => console.log('cambio de pestaña')} />

// Corregido: escucha evento "tabchange" (minúsculas)
<tab-bar ontabchange={() => console.log('cambio de pestaña')} />
```
