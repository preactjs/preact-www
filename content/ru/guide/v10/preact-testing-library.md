---
title: Тестирование с помощью библиотеки Preact Testing Library
description: 'Тестирование приложений Preact стало проще с помощью библиотеки testing-library'
---

# Тестирование с помощью библиотеки Preact Testing Library

[Preact Testing Library](https://github.com/testing-library/preact-testing-library) — это легкая обёртка `preact/test-utils`. Она предоставляет набор методов запроса для доступа к отображаемому DOM аналогично тому, как пользователь находит элементы на странице. Такой подход позволяет писать тесты, не зависящие от деталей реализации. Следовательно, это упрощает поддержку тестов и делает их более устойчивыми при рефакторинге тестируемого компонента.

В отличие от [Enzyme](/guide/v10/unit-testing-with-enzyme), библиотеку Preact Testing Library необходимо вызывать внутри среды DOM.

---

<div><toc></toc></div>

---

## Установка

Установите адаптер `testing-library` с помощью следующей команды:

```bash
npm install --save-dev @testing-library/preact
```

> Примечание. Эта библиотека зависит от наличия среды DOM. Если вы используете [Jest](https://github.com/facebook/jest), она уже включена по умолчанию. Если вы используете другой инструмент для запуска тестов, например [Mocha](https://github.com/mochajs/mocha) или [Jasmine](https://github.com/jasmine/jasmine), вы можете добавить среду DOM в Node, установив [jsdom](https://github.com/jsdom/jsdom).

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

Мы хотим убедиться, что наш счётчик отображает начальное значение и что нажатие кнопки увеличивает его. Используя выбранную вами программу запуска тестов, например [Jest](https://github.com/facebook/jest) или [Mocha](https://github.com/mochajs/mocha), мы можем реализовать эти два сценария таким образом:

```jsx
import { expect } from 'expect';
import { h } from 'preact';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';

import Counter from '../src/Counter';

describe('Counter', () => {
  test('должно отображаться начальное значение', () => {
    const { container } = render(<Counter initialCount={5} />);
    expect(container.textContent).toMatch('Текущее значение: 5');
  });

  test('значение должно увеличиваться после нажатия кнопки «Увеличить»', async () => {
    render(<Counter initialCount={5} />);

    fireEvent.click(screen.getByText('Увеличить'));
    await waitFor(() => {
      // .toBeInTheDocument() это утверждение, пришедшее из jest-dom.
      // В противном случае вы можете использовать .toBeDefined().
      expect(screen.getByText('Текущее значение: 6')).toBeInTheDocument();
    });
  });
});
```

Возможно, вы заметили там вызов `waitFor()`. Это нужно нам для того, чтобы у Preact было достаточно времени для рендеринга в DOM и сброса всех ожидающих эффектов.

```jsx
test('should increment counter", async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Увеличить'));
  // НЕПРАВИЛЬНО: Preact, скорее всего, не завершит рендеринг здесь
  expect(screen.getByText("Текущее значение: 6")).toBeInTheDocument();
});
```

Под капотом `waitFor` неоднократно вызывает переданную функцию обратного вызова, пока она больше не перестанет выдавать ошибку или пока не истечёт время ожидания (по умолчанию: 1000 мс). В приведённом выше примере мы знаем, что обновление завершено, когда счётчик увеличивается и новое значение отображается в DOM.

Мы также можем писать тесты асинхронно, используя версию запросов «findBy» вместо «getBy». Асинхронные запросы повторяют попытку, используя `waitFor`, и возвращают обещания, поэтому вам нужно их дождаться.

```jsx
test('should increment counter", async () => {
  render(<Counter initialCount={5}/>);

  fireEvent.click(screen.getByText('Увеличить'));

  await screen.findByText('Текущее значение: 6'); // ждет измененного элемента

  expect(screen.getByText("Текущее значение: 6")).toBeInTheDocument(); // проходит
});
```

## Поиск элементов

Имея полную среду DOM, мы можем напрямую проверять наши узлы DOM. Обычно тесты проверяют наличие атрибутов, таких как входное значение, или наличие/исчезновение элемента. Для этого нам нужно иметь возможность находить элементы в DOM.

### Использование содержимого

Философия библиотеки тестирования заключается в том, что «чем больше ваши тесты напоминают способ использования вашего программного обеспечения, тем больше уверенности они могут вам дать».

Рекомендуемый способ взаимодействия со страницей — поиск элементов так, как это делает пользователь, через текстовое содержимое.

Вы можете найти руководство по выбору правильного запроса на странице ['Какой запрос мне следует использовать'](https://testing-library.com/docs/guide-that-query) документации Testing Library. Самый простой запрос — `getByText`, который просматривает свойство `textContent` элементов. Существуют также запросы к тексту метки, заполнителю, атрибутам заголовка и т. д. Запрос `getByRole` является наиболее мощным, поскольку он абстрагируется от DOM и позволяет находить элементы в дереве доступности, именно так ваша страница читается программой чтения с экрана. Объединение [`роли`](https://developer.mozilla.org/ru/docs/Web/Accessibility/ARIA/ARIA_Techniques) и [`доступного имени`](https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_name) охватывает множество распространённых обходов DOM в одном запросе.

```jsx
import { render, fireEvent, screen } from '@testing-library/preact';

test('должна быть возможность войти в систему', async () => {
  render(<MyLoginForm />);

  // Находим ввод, используя роль текстового поля и доступное имя, которое стабильно независимо от того, используете ли вы элемент метки, aria-label или aria-labeledby
  const field = await screen.findByRole('textbox', { name: 'Войти' });

  // ввод в field
  fireEvent.change(field, { value: 'user123' });
});
```

Иногда использование текстового контента напрямую создает трудности, когда контент сильно меняется или если вы используете структуру интернационализации, которая переводит текст на разные языки. Вы можете обойти эту проблему, рассматривая текст как данные, которые вы делаете в виде моментального снимка, что упрощает обновление, но сохраняет источник истины вне теста.

```jsx
test('должна быть возможность войти в систему', async () => {
  render(<MyLoginForm />);

  // Что, если мы переведем приложение на другой язык или изменим текст? Тест не пройдёт.
  const field = await screen.findByRole('textbox', { name: 'Войти' });
  fireEvent.change(field, { value: 'user123' });
});
```

Даже если вы не используете платформу перевода, вы можете хранить строки в отдельном файле и использовать ту же стратегию, что и в примере ниже:

```jsx
test('должна быть возможность войти в систему', async () => {
  render(<MyLoginForm />);

  // Мы можем использовать нашу функцию перевода непосредственно в тесте.
  const label = translate('signinpage.label', 'ru-RU');
  // Сфотографируйте результат, чтобы мы знали, что происходит.
  expect(label).toMatchInlineSnapshot(`Войти`);

  const field = await screen.findByRole('textbox', { name: label });
  fireEvent.change(field, { value: 'user123' });
});
```

### Использование идентификаторов тестов

Идентификаторы тестов — это атрибуты данных, добавляемые к элементам DOM, которые помогают в случаях, когда выбор контента неоднозначен или непредсказуем, или для отделения от деталей реализации, таких как структура DOM. Их можно использовать, когда ни один из других методов поиска элементов не имеет смысла.

```jsx
function Foo({ onClick }) {
  return (
    <button onClick={onClick} data-testid='foo'>
      нажмите здесь
    </button>
  );
}

// Работает, только если текст остается прежним
fireEvent.click(screen.getByText('нажмите здесь'));

// Работает, если мы изменим текст
fireEvent.click(screen.getByTestId('foo'));
```

## Отладка тестов

Для отладки текущего состояния DOM вы можете использовать функцию `debug()` для распечатки предварительно настроенной версии DOM.

```jsx
const { debug } = render(<App />);

// Распечатывает предварительно настроенную версию DOM.
debug();
```

## Предоставление пользовательских поставщиков контекста

Довольно часто вы получаете компонент, который зависит от состояния общего контекста. Общие поставщики обычно варьируются от маршрутизаторов, состояний, иногда до тем и других, которые являются глобальными для вашего конкретного приложения. Повторная настройка для каждого тестового примера может оказаться утомительной, поэтому мы рекомендуем создать собственную функцию рендеринга `render`, импортировав её из `@testing-library/preact`.

```jsx
// helpers.js
import { render as originalRender } from '@testing-library/preact';
import { createMemoryHistory } from 'history';
import { FooContext } from './foo';

const history = createMemoryHistory();

export function render(vnode) {
  return originalRender(
    <FooContext.Provider value='foo'>
      <Router history={history}>{vnode}</Router>
    </FooContext.Provider>
  );
}

// Обычное использование. Смотри, мам, никаких провайдеров!
render(<MyComponent />);
```

## Тестирование хуков Preact

С помощью `@testing-library/preact` мы также можем протестировать реализацию наших хуков!
Представьте, что мы хотим повторно использовать функциональность счётчика для нескольких компонентов (я знаю, что мы любим счётчики!) и извлекли её в хук. И теперь мы хотим это проверить.

```jsx
import { useState, useCallback } from 'preact/hooks';

const useCounter = () => {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((c) => c + 1), []);
  return { count, increment };
};
```

Как и раньше, подход аналогичен: мы хотим убедиться, что можем увеличить наш счётчик. Итак, нам нужно как-то вызвать наш хук. Это можно сделать с помощью функции `renderHook()`, которая автоматически создает окружающий компонент внутри. Функция возвращает текущее возвращаемое значение хука в `result.current`, которое мы можем использовать для наших проверок:

```jsx
import { renderHook, act } from '@testing-library/preact';
import useCounter from './useCounter';

test('счётчик нужно увеличивать', () => {
  const { result } = renderHook(() => useCounter());

  // Изначально счётчик должен быть 0
  expect(result.current.count).toBe(0);

  // Давайте обновим счётчик, вызвав замыкание хука
  act(() => {
    result.current.increment();
  });

  // Убеждаемся, что возвращаемое значение хука отражает новое состояние
  expect(result.current.count).toBe(1);
});
```

Для получения дополнительной информации о `@testing-library/preact` посетите https://github.com/testing-library/preact-testing-library.
