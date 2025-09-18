---
title: Формы
description: Формы и элементы управления формами позволяют собирать пользовательский ввод в вашем приложении и являются фундаментальным строительным блоком большинства веб-приложений
---

# Формы

Формы в Preact работают так же, как в HTML и JS: вы рендерите элементы управления, прикрепляете слушатели событий и отправляете информацию.

---

<toc></toc>

---

## Основные элементы управления формами

Часто вам нужно собирать пользовательский ввод в вашем приложении, и здесь появляются элементы `<input>`, `<textarea>` и `<select>`. Эти элементы являются общими строительными блоками форм в HTML и Preact.

### Input (text)

Чтобы начать, мы создадим простое текстовое поле ввода, которое будет обновлять значение состояния по мере того, как пользователь печатает. Мы будем использовать событие `onInput` для прослушивания изменений значения поля ввода и обновления состояния при каждом нажатии клавиши. Это значение состояния затем рендерится в элементе `<p>`, поэтому мы можем видеть результаты.

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
					Имя: <input onInput={this.onInput} />
				</label>
				<p>Привет, {name}</p>
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
				Имя: <input onInput={e => setName(e.currentTarget.value)} />
			</label>
			<p>Привет, {name}</p>
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
					Разрешить контакт: <input type="checkbox" onClick={this.toggleContact} />
				</label>
				<label>
					Телефон:{' '}
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
					Почта:{' '}
					<input
						type="radio"
						name="contact"
						value="mail"
						onClick={this.setRadioValue}
						disabled={!allowContact}
					/>
				</label>
				<p>
					Вы {allowContact ? 'разрешили' : 'не разрешили'} контакт{' '}
					{allowContact && ` через ${this.state.contactMethod}`}
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
				Разрешить контакт: <input type="checkbox" onClick={toggleContact} />
			</label>
			<label>
				Телефон:{' '}
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
				Почта:{' '}
				<input
					type="radio"
					name="contact"
					value="mail"
					onClick={setRadioValue}
					disabled={!allowContact}
				/>
			</label>
			<p>
				Вы {allowContact ? 'разрешили' : 'не разрешили'} контакт{' '}
				{allowContact && ` через ${contactMethod}`}
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
				<p>Вы выбрали: {value}</p>
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
			<p>Вы выбрали: {value}</p>
		</div>
	);
}
// --repl-after
render(<MySelect />, document.getElementById('app'));
```

</tab-group>

## Основные формы

В то время как простые элементы ввода полезны и вы можете далеко продвинуться с ними, часто мы видим, как наши элементы ввода вырастают в _формы_, способные группировать несколько элементов управления вместе. Чтобы помочь управлять этим, мы обращаемся к элементу `<form>`.

Для демонстрации мы создадим новый элемент `<form>`, который содержит два поля `<input>`: одно для имени пользователя и одно для фамилии. Мы будем использовать событие `onSubmit` для прослушивания отправки формы и обновления состояния полным именем пользователя.

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
		e.currentTarget.reset(); // Очищаем элементы ввода для подготовки к следующей отправке
	};

	render(_, { fullName }) {
		return (
			<div class="form-example">
				<form onSubmit={this.onSubmit}>
					<label>
						Имя: <input name="firstName" />
					</label>
					<label>
						Фамилия: <input name="lastName" />
					</label>
					<button>Отправить</button>
				</form>
				{fullName && <p>Привет, {fullName}</p>}
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
		e.currentTarget.reset(); // Очищаем элементы ввода для подготовки к следующей отправке
	};

	return (
		<div class="form-example">
			<form onSubmit={onSubmit}>
				<label>
					Имя: <input name="firstName" />
				</label>
				<label>
					Фамилия: <input name="lastName" />
				</label>
				<button>Отправить</button>
			</form>
			{fullName && <p>Привет, {fullName}</p>}
		</div>
	);
}

// --repl-after
render(<FullNameForm />, document.getElementById('app'));
```

</tab-group>

> **Примечание**: Хотя часто можно встретить формы на React и Preact, где каждое поле ввода привязано к состоянию компонента, это часто избыточно и может стать громоздким. В качестве общего практического правила в большинстве случаев предпочтительнее использовать `onSubmit` и API [`FormData`](https://developer.mozilla.org/ru/docs/Web/API/FormData), используя состояние компонента только тогда, когда это действительно необходимо. Это снижает сложность ваших компонентов и может избежать ненужных перерисовок.

## Управляемые и неуправляемые компоненты

Когда говорят об элементах управления формами, вы можете встретить термины «Управляемый компонент» и «Неуправляемый компонент». Эти термины относятся к тому, управляется ли явно значение элемента управления формы компонентом. В общем, вы должны стараться использовать _Неуправляемые_ компоненты всякий раз, когда это возможно, DOM полностью способен обрабатывать состояние `<input>`:

```jsx
// Неуправляемый, потому что Preact не устанавливает значение
<input onInput={myEventHandler} />
```

Однако есть ситуации, в которых вам может понадобиться более строгий контроль над значением ввода, в этом случае можно использовать _Управляемые_ компоненты.

```jsx
// Управляемый, потому что Preact устанавливает значение
<input value={myValue} onInput={myEventHandler} />
```

Preact имеет известную проблему с управляемыми компонентами: повторные рендеры требуются для того, чтобы Preact мог контролировать значения ввода. Это означает, что если ваш обработчик событий не обновляет состояние или не вызывает повторный рендер каким-то образом, значение ввода не будет контролироваться, иногда становясь не синхронизированным с состоянием компонента.

Примером одной из таких проблемных ситуаций является следующее: скажем, у вас есть поле ввода, которое должно быть ограничено 3 символами. У вас может быть обработчик событий вроде следующего:

```js
const onInput = e => {
	if (e.currentTarget.value.length <= 3) {
		setValue(e.currentTarget.value);
	}
};
```

Проблема с этим заключается в случаях, когда ввод не проходит это условие: потому что мы не запускаем `setValue`, компонент не рендерится повторно, и потому что компонент не рендерится повторно, значение ввода не контролируется правильно. Однако, даже если мы добавим `else { setValue(value) }` к этому обработчику, Preact достаточно умён, чтобы обнаружить, когда значение не изменилось, и поэтому он не будет повторно рендерить компонент. Это оставляет нас с [`refs`](/guide/v10/refs), чтобы заполнить разрыв между состоянием DOM и состоянием Preact.

> Для получения дополнительной информации о контролируемых компонентах в Preact см. [Контролируемые элементы ввода](https://www.jovidecroock.com/blog/controlled-inputs) от Джови Де Крука.

Вот пример того, как можно использовать управляемый компонент для ограничения количества символов в поле ввода:

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
			// Восстанавливаем выделение
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
					Этот ввод ограничен 3 символами:{' '}
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
			// Восстанавливаем выделение
			inputRef.current.setSelectionRange(start - diffLength, end - diffLength);
		}
	};

	return (
		<div class="form-example">
			<label>
				Этот ввод ограничен 3 символами:{' '}
				<input ref={inputRef} value={value} onInput={onInput} />
			</label>
		</div>
	);
};
// --repl-after
render(<LimitedInput />, document.getElementById('app'));
```

</tab-group>
