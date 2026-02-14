---
title: preact-custom-element
description: Envuelve tu componente Preact como un elemento personalizado
translation_by:
  - Ezequiel Mastropietro
---

# preact-custom-element

El tamaño diminuto de Preact y su enfoque orientado a los estándares lo hacen una excelente opción para construir web components.

Preact está diseñado para renderizar tanto aplicaciones completas como partes individuales de una página, lo que lo hace un ajuste natural para la construcción de Web Components. Muchas empresas usan este enfoque para construir sistemas de componentes o diseño que luego se envuelven en un conjunto de Web Components, permitiendo la reutilización en múltiples proyectos y dentro de otros frameworks mientras se ofrecen las APIs de Preact familiares.

---

<toc></toc>

---

## Creando un Elemento Personalizado Web

Cualquier componente Preact se puede convertir en un elemento web con [preact-custom-element](https://github.com/preactjs/preact-custom-element), un envoltura muy delgada que se adhiere a la especificación de Elementos Personalizados v1.

```jsx
import register from 'preact-custom-element';

const Greeting = ({ name = 'World' }) => <p>Hello, {name}!</p>;

register(Greeting, 'x-greeting', ['name'], { shadow: false });
//          ^            ^           ^             ^
//          |      HTML tag name     |       use shadow-dom
// Definición de componente   Atributos observados
```

> Nota: Según la [Especificación de Elemento Personalizado](http://w3c.github.io/webcomponents/spec/custom/#prod-potentialcustomelementname), el nombre de la etiqueta debe contener un guión (`-`).

Usa el nuevo nombre de etiqueta en HTML, las claves y valores de atributo se pasarán como props:

```html
<x-greeting name="Billy Jo"></x-greeting>
```

Salida:

```html
<p>Hello, Billy Jo!</p>
```

### Atributos Observados

Los Elementos Personalizados requieren listar explícitamente los nombres de atributos que deseas observar para responder cuando sus valores cambian. Estos se pueden especificar mediante el tercer parámetro que se pasa a la función `register()`:

```jsx
// Escuchar cambios en el atributo `name`
register(Greeting, 'x-greeting', ['name']);
```

Si omites el tercer parámetro a `register()`, la lista de atributos a observar se puede especificar usando una propiedad estática `observedAttributes` en tu Componente. Esto también funciona para el nombre del Elemento Personalizado, que se puede especificar usando una propiedad estática `tagName`:

```jsx
import register from 'preact-custom-element';

// <x-greeting name="Bo"></x-greeting>
class Greeting extends Component {
	// Se registra como <x-greeting>:
	static tagName = 'x-greeting';

	// Realiza un seguimiento de estos atributos:
	static observedAttributes = ['name'];

	render({ name }) {
		return <p>Hello, {name}!</p>;
	}
}
register(Greeting);
```

Si no se especifican `observedAttributes`, se inferirán de las claves de `propTypes` si están presentes en el Componente:

```jsx
// Otras opciones: use PropTypes:
function FullName({ first, last }) {
	return (
		<span>
			{first} {last}
		</span>
	);
}

FullName.propTypes = {
	first: Object, // Puedes usar PropTypes o este
	last: Object // truco para definir props sin tipo.
};

register(FullName, 'full-name');
```

### Pasando slots como props

La función `register()` tiene un cuarto parámetro para pasar opciones; actualmente, solo la opción `shadow` se soporta, que asocia un árbol de DOM de sombra al elemento especificado. Cuando se habilita, esto permite el uso de elementos `<slot>` nombrados para adelantar los hijos del Elemento Personalizado a lugares específicos en el árbol de sombra.

```jsx
function TextSection({ heading, content }) {
	return (
		<div>
			<h1>{heading}</h1>
			<p>{content}</p>
		</div>
	);
}

register(TextSection, 'text-section', [], { shadow: true });
```

Uso:

```html
<text-section>
	<span slot="heading">Nice heading</span>
	<span slot="content">Great content</span>
</text-section>
```
