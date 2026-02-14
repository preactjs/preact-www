---
title: Formularios
description: Los formularios y controles de formulario te permiten recopilar entrada del usuario en tu aplicación y son un bloque de construcción fundamental de la mayoría de aplicaciones web
translation_by:
  - Ezequiel Mastropietro
---

# Formularios

Los formularios en Preact funcionan de la misma manera que en HTML y JS: renderizas controles, adjuntas listeners de eventos y envías información.

---

<toc></toc>

---

## Controles de Formulario Básicos

A menudo querrás recopilar entrada del usuario en tu aplicación, y aquí es donde entran los elementos `<input>`, `<textarea>` y `<select>`. Estos elementos son los bloques de construcción comunes de formularios en HTML y Preact.

### Input (texto)

Para comenzar, crearemos un campo de entrada de texto simple que actualizará un valor de estado a medida que el usuario escribe. Usaremos el evento `onInput` para escuchar cambios en el valor del campo de entrada y actualizar el estado por cada pulsación de tecla. Este valor de estado se renderiza en un elemento `<p>`, para que podamos ver los resultados.

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class BasicInput extends Component {
	state = { name: '' };

	onInput = e => this.setState({ name: e.currentTarget.value });

	render(_, { name }) {
		return (
			<div class="form-example">
				<label>
					Name: <input onInput={this.onInput} />
				</label>
				<p>Hello {name}</p>
			</div>
		);
	}
}
// --repl-after
render(<BasicInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState } from 'preact/hooks';
// --repl-before
function BasicInput() {
	const [name, setName] = useState('');

	return (
		<div class="form-example">
			<label>
				Name: <input onInput={e => setName(e.currentTarget.value)} />
			</label>
			<p>Hello {name}</p>
		</div>
	);
}
// --repl-after
render(<BasicInput />, document.getElementById('app'));
```

</tab-group>

### Input (checkbox & radio)

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class BasicRadioButton extends Component {
	state = {
		allowContact: false,
		contactMethod: ''
	};

	toggleContact = () =>
		this.setState({ allowContact: !this.state.allowContact });
	setRadioValue = e => this.setState({ contactMethod: e.currentTarget.value });

	render(_, { allowContact }) {
		return (
			<div class="form-example">
				<label>
					Allow contact: <input type="checkbox" onClick={this.toggleContact} />
				</label>
				<label>
					Phone:{' '}
					<input
						type="radio"
						name="contact"
						value="phone"
						onClick={this.setRadioValue}
						disabled={!allowContact}
					/>
				</label>
				<label>
					Email:{' '}
					<input
						type="radio"
						name="contact"
						value="email"
						onClick={this.setRadioValue}
						disabled={!allowContact}
					/>
				</label>
				<label>
					Mail:{' '}
					<input
						type="radio"
						name="contact"
						value="mail"
						onClick={this.setRadioValue}
						disabled={!allowContact}
					/>
				</label>
				<p>
					You {allowContact ? 'have allowed' : 'have not allowed'} contact{' '}
					{allowContact && ` via ${this.state.contactMethod}`}
				</p>
			</div>
		);
	}
}
// --repl-after
render(<BasicRadioButton />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState } from 'preact/hooks';
// --repl-before
function BasicRadioButton() {
	const [allowContact, setAllowContact] = useState(false);
	const [contactMethod, setContactMethod] = useState('');

	const toggleContact = () => setAllowContact(!allowContact);
	const setRadioValue = e => setContactMethod(e.currentTarget.value);

	return (
		<div class="form-example">
			<label>
				Allow contact: <input type="checkbox" onClick={toggleContact} />
			</label>
			<label>
				Phone:{' '}
				<input
					type="radio"
					name="contact"
					value="phone"
					onClick={setRadioValue}
					disabled={!allowContact}
				/>
			</label>
			<label>
				Email:{' '}
				<input
					type="radio"
					name="contact"
					value="email"
					onClick={setRadioValue}
					disabled={!allowContact}
				/>
			</label>
			<label>
				Mail:{' '}
				<input
					type="radio"
					name="contact"
					value="mail"
					onClick={setRadioValue}
					disabled={!allowContact}
				/>
			</label>
			<p>
				You {allowContact ? 'have allowed' : 'have not allowed'} contact{' '}
				{allowContact && ` via ${contactMethod}`}
			</p>
		</div>
	);
}
// --repl-after
render(<BasicRadioButton />, document.getElementById('app'));
```

</tab-group>

### Select

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class MySelect extends Component {
	state = { value: '' };

	onChange = e => {
		this.setState({ value: e.currentTarget.value });
	};

	render(_, { value }) {
		return (
			<div class="form-example">
				<select onChange={this.onChange}>
					<option value="A">A</option>
					<option value="B">B</option>
					<option value="C">C</option>
				</select>
				<p>You selected: {value}</p>
			</div>
		);
	}
}
// --repl-after
render(<MySelect />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState } from 'preact/hooks';
// --repl-before
function MySelect() {
	const [value, setValue] = useState('');

	return (
		<div class="form-example">
			<select onChange={e => setValue(e.currentTarget.value)}>
				<option value="A">A</option>
				<option value="B">B</option>
				<option value="C">C</option>
			</select>
			<p>You selected: {value}</p>
		</form>
	);
}
// --repl-after
render(<MySelect />, document.getElementById('app'));
```

</tab-group>

## Formularios Básicos

Aunque los inputs simples son útiles y puedes llegar lejos con ellos, a menudo veremos que nuestros inputs crecen hasta convertirse en _formularios_ que son capaces de agrupar múltiples controles juntos. Para ayudarte a gestionar esto, recurrimos al elemento `<form>`.

Para demostrarlo, crearemos un nuevo elemento `<form>` que contenga dos campos `<input>`: uno para el nombre del usuario y otro para el apellido. Usaremos el evento `onSubmit` para escuchar el envío del formulario y actualizar el estado con el nombre completo del usuario.

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class FullNameForm extends Component {
	state = { fullName: '' };

	onSubmit = e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		this.setState({
			fullName: formData.get('firstName') + ' ' + formData.get('lastName')
		});
		e.currentTarget.reset(); // Limpia el input para preparalo para el próximo envío
	};

	render(_, { fullName }) {
		return (
			<div class="form-example">
				<form onSubmit={this.onSubmit}>
					<label>
						First Name: <input name="firstName" />
					</label>
					<label>
						Last Name: <input name="lastName" />
					</label>
					<button>Submit</button>
				</form>
				{fullName && <p>Hello {fullName}</p>}
			</div>
		);
	}
}
// --repl-after
render(<FullNameForm />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState } from 'preact/hooks';
// --repl-before
function FullNameForm() {
	const [fullName, setFullName] = useState('');

	const onSubmit = e => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		setFullName(formData.get('firstName') + ' ' + formData.get('lastName'));
		e.currentTarget.reset(); // Limpia el input para preparalo para el próximo envío
	};

	return (
		<div class="form-example">
			<form onSubmit={onSubmit}>
				<label>
					First Name: <input name="firstName" />
				</label>
				<label>
					Last Name: <input name="lastName" />
				</label>
				<button>Submit</button>
			</form>
			{fullName && <p>Hello {fullName}</p>}
		</div>
	);
}

// --repl-after
render(<FullNameForm />, document.getElementById('app'));
```

</tab-group>

> **Nota**: Aunque es bastante común ver formularios de React y Preact que vinculan cada campo de entrada al estado del componente, a menudo es innecesario y puede volverse engorroso. Como una regla muy general, deberías preferir usar `onSubmit` y la API [`FormData`](https://developer.mozilla.org/es/docs/Web/API/FormData) en la mayoría de los casos, usando el estado del componente solo cuando sea necesario. Esto reduce la complejidad de tus componentes y puede evitar rerenders innecesarios.

## Componentes Controlados y No Controlados

Al hablar sobre controles de formulario, puedes encontrar los términos "Componente Controlado" y "Componente No Controlado". Estos términos se refieren a si el valor del control del formulario es explícitamente gestionado por el componente. En general, deberías intentar usar Componentes _No Controlados_ siempre que sea posible, el DOM es completamente capaz de manejar el estado de `<input>`:

```jsx
// No controlado, porque Preact no establece el valor
<input onInput={myEventHandler} />
```

Sin embargo, hay situaciones en las que es posible que necesites ejercer un control más estrecho sobre el valor de entrada, en cuyo caso, se pueden usar Componentes _Controlados_.

```jsx
// Controlado, porque Preact establece el valor
<input value={myValue} onInput={myEventHandler} />
```

Preact tiene un problema conocido con componentes controlados: se requieren rerenders para que Preact ejerza control sobre los valores de entrada. Esto significa que si tu manejador de eventos no actualiza el estado o desencadena un rerender de alguna forma, el valor de entrada no será controlado, a veces quedando fuera de sincronización con el estado del componente.

Un ejemplo de una de estas situaciones problemáticas sería el siguiente: digamos que tienes un campo de entrada que debe limitarse a 3 caracteres. Es posible que tengas un manejador de eventos como el siguiente:

```js
const onInput = e => {
	if (e.currentTarget.value.length <= 3) {
		setValue(e.currentTarget.value);
	}
};
```

El problema con esto es en los casos donde la entrada falla esa condición: porque no ejecutamos `setValue`, el componente no se vuelve a renderizar, y porque el componente no se vuelve a renderizar, el valor de entrada no se controla correctamente. Sin embargo, incluso si agregáramos un `else { setValue(value) }` a ese manejador, Preact es lo suficientemente inteligente como para detectar cuándo el valor no ha cambiado y por lo tanto no volverá a renderizar el componente. Esto nos deja con [`refs`](/guide/v10/refs) para cerrar la brecha entre el estado del DOM y el estado de Preact.

> Para más información sobre componentes controlados en Preact, consulta [Controlled Inputs](https://www.jovidecroock.com/blog/controlled-inputs) de Jovi De Croock.

Aquí hay un ejemplo de cómo podrías usar un componente controlado para limitar el número de caracteres en un campo de entrada:

<tab-group tabstring="Classes, Hooks">

```jsx
// --repl
import { render, Component, createRef } from 'preact';
// --repl-before
class LimitedInput extends Component {
	state = { value: '' };
	inputRef = createRef(null);

	onInput = e => {
		if (e.currentTarget.value.length <= 3) {
			this.setState({ value: e.currentTarget.value });
		} else {
			const start = this.inputRef.current.selectionStart;
			const end = this.inputRef.current.selectionEnd;
			const diffLength = Math.abs(
				e.currentTarget.value.length - this.state.value.length
			);
			this.inputRef.current.value = this.state.value;
			// Restuara la selección
			this.inputRef.current.setSelectionRange(
				start - diffLength,
				end - diffLength
			);
		}
	};

	render(_, { value }) {
		return (
			<div class="form-example">
				<label>
					This input is limited to 3 characters:{' '}
					<input ref={this.inputRef} value={value} onInput={this.onInput} />
				</label>
			</div>
		);
	}
}
// --repl-after
render(<LimitedInput />, document.getElementById('app'));
```

```jsx
// --repl
import { render } from 'preact';
import { useState, useRef } from 'preact/hooks';
// --repl-before
const LimitedInput = () => {
	const [value, setValue] = useState('');
	const inputRef = useRef();

	const onInput = e => {
		if (e.currentTarget.value.length <= 3) {
			setValue(e.currentTarget.value);
		} else {
			const start = inputRef.current.selectionStart;
			const end = inputRef.current.selectionEnd;
			const diffLength = Math.abs(e.currentTarget.value.length - value.length);
			inputRef.current.value = value;
			// Restaura la selección
			inputRef.current.setSelectionRange(start - diffLength, end - diffLength);
		}
	};

	return (
		<div class="form-example">
			<label>
				This input is limited to 3 characters:{' '}
				<input ref={inputRef} value={value} onInput={onInput} />
			</label>
		</div>
	);
};
// --repl-after
render(<LimitedInput />, document.getElementById('app'));
```

</tab-group>
