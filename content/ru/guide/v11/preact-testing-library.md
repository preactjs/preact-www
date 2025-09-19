---
title: Тестирование с Preact Testing Library
description: Тестирование приложений Preact упрощено с testing-library
---

# Тестирование с Preact Testing Library

[Preact Testing Library](https://github.com/testing-library/preact-testing-library) — это лёгкая обёртка над `preact/test-utils`. Она предоставляет набор методов запросов для доступа к отрендеренному DOM способом, похожим на то, как пользователь находит элементы на странице. Этот подход позволяет писать тесты, которые не зависят от деталей реализации. Следовательно, это делает тесты легче поддерживать и более устойчивыми при рефакторинге тестируемого компонента.

В отличие от [Enzyme](/guide/v10/unit-testing-with-enzyme), Preact Testing Library должна вызываться внутри DOM-среды.

---

<toc></toc>

---

## Установка

Установите адаптер testing-library для Preact с помощью следующей команды:

```bash
npm install --save-dev @testing-library/preact
```

> Примечание: Эта библиотека полагается на наличие DOM-среды. Если вы используете [Jest](https://github.com/facebook/jest), она уже включена по умолчанию. Если вы используете другой раннер тестов, такой как [Mocha](https://github.com/mochajs/mocha) или [Jasmine](https://github.com/jasmine/jasmine), вы можете добавить DOM-среду в node, установив [jsdom](https://github.com/jsdom/jsdom).

## Использование

Предположим, у нас есть компонент `Counter`, который отображает начальное значение с кнопкой для его обновления:

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export function Counter({ initialCount }) {
	const [count, setCount] = useState(initialCount);
	const increment = () => setCount(count + 1);

	return (
		<div>
			Текущее значение: {count}
			<button onClick={increment}>Увеличить</button>
		</div>
	);
}
```

Мы хотим убедиться, что наш Counter отображает начальный счёт и что нажатие кнопки увеличит его. Используя раннер тестов по вашему выбору, такой как [Jest](https://github.com/facebook/jest) или [Mocha](https://github.com/mochajs/mocha), мы можем написать эти два сценария:

```jsx
import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';

import Counter from '../src/Counter';

describe('Counter', () => {
	test('should display initial count', () => {
		const { container } = render(<Counter initialCount={5} />);
		expect(container.textContent).toMatch('Текущее значение: 5');
	});

	test('should increment after "Increment" button is clicked', async () => {
		render(<Counter initialCount={5} />);

		fireEvent.click(screen.getByText('Увеличить'));
		await waitFor(() => {
			// .toBeInTheDocument() — это утверждение, которое приходит из jest-dom.
			// Иначе вы могли бы использовать .toBeDefined().
			expect(screen.getByText('Текущее значение: 6')).toBeInTheDocument();
		});
	});
});
```

Вы могли заметить в коде вызов `waitFor()`. Нам нужно это, чтобы убедиться, что Preact имел достаточно времени для рендеринга в DOM и сброса всех ожидающих эффектов.

```jsx
test('should increment counter", async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Увеличить'));
  // НЕПРАВИЛЬНО: Preact, вероятно, не завершил рендеринг здесь
  expect(screen.getByText("Текущее значение: 6")).toBeInTheDocument();
});
```

Под капотом `waitFor` повторно вызывает переданную функцию колбека, пока она не перестанет выдавать ошибку или не истечет таймаут (по умолчанию: 1000ms). В приведённом выше примере мы знаем, что обновление завершено, когда счётчик увеличен и новое значение отрендерено в DOM.

Мы также можем писать тесты в асинхронном стиле, используя версии запросов `findBy` вместо `getBy`. Асинхронные запросы повторяются с использованием `waitFor` под капотом и возвращают промисы, поэтому их нужно ожидать с помощью `await`.

```jsx
test('should increment counter", async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Увеличить'));

  await screen.findByText('Текущее значение: 6'); // ожидает изменённый элемент

  expect(screen.getByText("Текущее значение: 6")).toBeInTheDocument(); // проходит
});
```

## Поиск элементов

С полной DOM-средой на месте, мы можем проверять наши DOM-узлы напрямую. Обычно тесты проверяют наличие атрибутов, таких как значение `input` или что элемент появился/исчез. Для этого нам нужно уметь находить элементы в DOM.

### Использование содержимого

Философия Testing Library заключается в том, что «чем больше ваши тесты похожи на то, как используется ваше программное обеспечение, тем больше уверенности они могут вам дать».

Рекомендуемый способ взаимодействия со страницей — находить элементы так, как это делает пользователь, через текстовое содержимое.

Вы можете найти руководство по выбору правильного запроса на странице ['Which query should I use'](https://testing-library.com/docs/guide-which-query) документации Testing Library. Самый простой запрос — `getByText`, который смотрит на `textContent` элементов. Есть также запросы для текста метки, плейсхолдера, атрибутов title и т. д. Запрос `getByRole` — самый мощный, поскольку он абстрагируется от DOM и позволяет находить элементы в дереве доступности, которое является тем, как ваша страница читается скрин-ридером. Комбинирование [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques) и [`accessible name`](https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_name) охватывает многие общие DOM-переходы в одном запросе.

```jsx
import { render, fireEvent, screen } from '@testing-library/preact';

test('should be able to sign in', async () => {
	render(<MyLoginForm />);

	// Находим input используя роль textbox и доступное имя,
	// которое стабильно независимо от того, используете ли вы элемент label, aria-label, или
	// отношение aria-labelledby
	const field = await screen.findByRole('textbox', { name: 'Sign In' });

	// вводим в поле
	fireEvent.change(field, { value: 'user123' });
});
```

Иногда использование текстового содержимого напрямую создает трение, когда контент меняется много, или если вы используете фреймворк интернационализации, который переводит текст на разные языки. Вы можете обойти это, обращаясь с текстом как с данными, которые вы snapshot, делая его легким обновлять, но сохраняя источник истины вне теста.

```jsx
test('should be able to sign in', async () => {
	render(<MyLoginForm />);

	// Что если мы рендерим приложение на другом языке, или изменяем текст? Тест падает.
	const field = await screen.findByRole('textbox', { name: 'Sign In' });
	fireEvent.change(field, { value: 'user123' });
});
```

Даже если вы не используете фреймворк перевода, вы можете держать ваши строки в отдельном файле и использовать ту же стратегию, как в примере ниже:

```jsx
test('should be able to sign in', async () => {
	render(<MyLoginForm />);

	// Мы можем использовать нашу функцию перевода напрямую в тесте
	const label = translate('signinpage.label', 'en-US');
	// Snapshot результат, чтобы знать, что происходит
	expect(label).toMatchInlineSnapshot(`Sign In`);

	const field = await screen.findByRole('textbox', { name: label });
	fireEvent.change(field, { value: 'user123' });
});
```

### Использование тестовых ID

Тестовые ID — это атрибуты данных, добавленные к DOM-элементам, чтобы помочь в случаях, когда выбор содержимого неоднозначен или непредсказуем, или для развязки от деталей реализации, таких как структура DOM. Они могут использоваться, когда ни один из других методов поиска элементов не имеет смысла.

```jsx
function Foo({ onClick }) {
	return (
		<button onClick={onClick} data-testid="foo">
			click here
		</button>
	);
}

// Работает только если текст остается тем же
fireEvent.click(screen.getByText('click here'));

// Работает если мы изменяем текст
fireEvent.click(screen.getByTestId('foo'));
```

## Отладка тестов

Для отладки текущего состояния DOM вы можете использовать функцию `debug()` для печати prettified версии DOM.

```jsx
const { debug } = render(<App />);

// Печатает prettified версию DOM
debug();
```

## Предоставление пользовательских провайдеров контекста

Довольно часто вы закончите компонентом, который зависит от общего состояния контекста. Общие провайдеры обычно варьируются от роутеров, состояния, до иногда тем и других, которые глобальны для вашего конкретного приложения. Это может стать утомительным для настройки для каждого тестового случая повторно, так что мы рекомендуем создать пользовательскую функцию `render`, оборачивающую ту, что из `@testing-library/preact`.

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

// Использование как обычно. Смотри ма, никаких провайдеров!
render(<MyComponent />);
```

## Тестирование хуков Preact

С `@testing-library/preact` мы также можем тестировать реализацию наших хуков!
Представьте, что мы хотим повторно использовать функциональность счётчика для нескольких компонентов (Я знаю, мы любим счётчики!) и извлекли её в хук. И теперь мы хотим протестировать его.

```jsx
import { useState, useCallback } from 'preact/hooks';

const useCounter = () => {
	const [count, setCount] = useState(0);
	const increment = useCallback(() => setCount(c => c + 1), []);
	return { count, increment };
};
```

Как и ранее, подход остаётся похожим: мы хотим убедиться, что можем увеличить наш счётчик. Для этого нам нужно как-то вызвать наш хук. Это можно сделать с помощью функции `renderHook()`, которая автоматически создаёт окружающий компонент внутри. Функция возвращает текущее значение хука в `result.current`, которое мы можем использовать для наших проверок:

```jsx
import { renderHook, act } from '@testing-library/preact';
import useCounter from './useCounter';

test('should increment counter', () => {
	const { result } = renderHook(() => useCounter());

	// Первоначально счётчик должен быть 0
	expect(result.current.count).toBe(0);

	// Давайте обновим счётчик, вызвав колбек хука
	act(() => {
		result.current.increment();
	});

	// Проверим, что значение возврата хука отражает новое состояние.
	expect(result.current.count).toBe(1);
});
```

Для дополнительной информации о `@testing-library/preact` проверьте https://github.com/testing-library/preact-testing-library.
