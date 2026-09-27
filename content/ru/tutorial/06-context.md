---
title: Контекст
prev: /tutorial/05-refs
next: /tutorial/07-side-effects
solvable: true
---

# Контекст

По мере роста приложения его дерево Virtual DOM часто становится глубоко вложенным и состоит из множества различных компонентов. Компоненты, расположенные в разных местах дерева, иногда нуждаются в доступе к общим данным — как правило, это фрагменты состояния приложения, такие как аутентификация, информация о профиле пользователя, кэши, хранилища и т. д. Хотя можно передавать всю эту информацию вниз по дереву в виде параметров компонентов, это означает, что каждый компонент должен иметь некоторое осознание всего этого состояния — даже если всё, что оно делает, это передает его дальше по дереву.

Контекст — это функция, позволяющая нам передавать значения вниз по дереву _автоматически_, без необходимости информирования компонентов. Для этого используется подход «поставщик/потребитель»:

- `<Provider>` устанавливает значение контекста в <abbr title="Дерево Virtual DOM в пределах <Provider>...</Provider>, включая все дочерние элементы">поддереве</abbr>
- `<Consumer>` получает значение контекста, установленное ближайшим родительским провайдером

Для начала давайте рассмотрим простой пример только с одним компонентом. В этом случае мы предоставляем значение контекста «Имя пользователя» _и_ потребляем это значение:

```jsx
import { createContext } from 'preact';

const Username = createContext();

export default function App() {
	return (
		// предоставляем значение username нашему поддереву:
		<Username.Provider value="Вася">
			<div>
				<p>
					<Username.Consumer>
						{(username) => (
							// получаем доступ к текущему имени пользователя из контекста:
							<span>{username}</span>
						)}
					</Username.Consumer>
				</p>
			</div>
		</Username.Provider>
	);
}
```

В реальном использовании контекст редко предоставляется и потребляется в рамках одного компонента — состояние компонента обычно является лучшим решением для этого.

### Использование с хуками

Контекстный API `<Consumer>` достаточен для большинства случаев использования, но может быть несколько утомительным в написании, поскольку опирается на вложенные функции для определения области видимости. Функциональные компоненты могут вместо этого использовать хук Preact `useContext()`, который возвращает значение `Context` в месте расположения компонента в дереве Virtual DOM.

Приведем еще раз предыдущий пример, на этот раз разделенный на два компонента и использующий `useContext()` для получения текущего значения контекста:

```jsx
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

const Username = createContext();

export default function App() {
	return (
		<Username.Provider value="Вася">
			<div>
				<p>
					<User />
				</p>
			</div>
		</Username.Provider>
	);
}

function User() {
	// доступ к текущему имени пользователя из контекста:
	const username = useContext(Username); // "Вася"
	return <span>{username}</span>;
}
```

Если представить себе случай, когда `пользователю` необходимо получить доступ к значению нескольких контекстов, то более простой API `useContext()` является предпочтительным.

### Реалистичное использование

Более реалистичным вариантом использования контекста было бы хранение состояния аутентификации приложения (вошел ли пользователь в систему или нет).

Для этого мы можем создать контекст для хранения информации, который назовем `AuthContext`. Значением для AuthContext будет объект со свойством `user`, содержащим нашего зарегистрированного пользователя, а также метод `setUser` для изменения этого состояния.

```jsx
import { createContext } from 'preact';
import { useState, useMemo, useContext } from 'preact/hooks';

const AuthContext = createContext();

export default function App() {
	const [user, setUser] = useState(null);

	const auth = useMemo(() => {
		return { user, setUser };
	}, [user]);

	return (
		<AuthContext.Provider value={auth}>
			<div class="app">
				{auth.user && <p>Добро пожаловать, {auth.user.name}!</p>}
				<Login />
			</div>
		</AuthContext.Provider>
	);
}

function Login() {
	const { user, setUser } = useContext(AuthContext);

	if (user)
		return (
			<div class="logged-in">
				Вошли в систему как {user.name}.
				<button onClick={() => setUser(null)}>Выйти</button>
			</div>
		);

	return (
		<div class="logged-out">
			<button onClick={() => setUser({ name: 'Вася' })}>Войти</button>
		</div>
	);
}
```

### Вложенный контекст

Контекст обладает скрытой суперспособностью, которая становится весьма полезной в больших приложениях: провайдеры контекста могут быть вложены друг в друга для «переопределения» их значения в поддереве Virtual DOM. Представьте себе почтовое веб-приложение, в котором различные части пользовательского интерфейса отображаются на основе URL-путей:

> - `/inbox`: показать входящие сообщения
> - `/inbox/compose`: показать папку "Входящие" и новое сообщение
> - `/settings`: показать настройки
> - `/settings/forwarding`: показать настройки переадресации

Мы можем создать компонент `<Route path="...">`, который отображает дерево Virtual DOM только тогда, когда текущий путь совпадает с заданным сегментом пути. Для упрощения определения вложенных маршрутов каждый сопоставленный маршрут может переопределять «текущий путь» (значение контекста) в пределах своего поддерева, чтобы исключить ту часть пути, которая была сопоставлена.

```jsx
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

const Path = createContext(location.pathname);

function Route(props) {
	const path = useContext(Path); // текущий путь
	const isMatch = path.startsWith(props.path);
	const innerPath = path.substring(props.path.length);
	return (
		isMatch && <Path.Provider value={innerPath}>{props.children}</Path.Provider>
	);
}
```

Теперь мы можем использовать этот новый компонент `Route` для определения интерфейса почтового приложения. Обратите внимание, что компоненту `Inbox` не нужно знать свой собственный путь, чтобы определить соответствие `<Route path="...">` для своих дочерних компонентов:

```jsx
export default function App() {
	return (
		<div class="app">
			<Route path="/inbox">
				<Inbox />
			</Route>
			<Route path="/settings">
				<Settings />
			</Route>
		</div>
	);
}

function Inbox() {
	return (
		<div class="inbox">
			<div class="messages"> ... </div>
			<Route path="/compose">
				<Compose />
			</Route>
		</div>
	);
}

function Settings() {
	return (
		<div class="settings">
			<h1>Settings</h1>
			<Route path="/forwarding">
				<Forwarding />
			</Route>
		</div>
	);
}
```

### Значение контекста по умолчанию

Вложенный контекст — это мощная функция, которую мы часто используем, не осознавая этого. Например, в самом первом иллюстративном примере этой главы мы использовали `<Provider value="Вася">` для определения контекстного значения `Username` в дереве.

Однако это фактически переопределяло значение по умолчанию контекста `Username`. Все контексты имеют значение по умолчанию, которое равно значению, переданному в качестве первого аргумента в `createContext()`. В примере мы не передавали никаких аргументов в `createContext`, поэтому значение по умолчанию было `undefined`.

Вот как выглядел бы первый пример, если бы вместо Provider использовалось значение контекста по умолчанию:

```jsx
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

const Username = createContext('Вася');

export default function App() {
	const username = useContext(Username); // возвращает "Вася"

	return <span>{username}</span>;
}
```

## Попробуйте!

В качестве упражнения создадим _синхронизированную_ версию счётчика, который мы реализовали в предыдущей главе. Для этого необходимо использовать технику `useMemo()` из примера аутентификации в этой главе. В качестве альтернативы можно также определить _два_ контекста: один для совместного использования значения `count`, а другой — для совместного использования функции `increment`, обновляющей это значение.

<solution>
  <h4>🎉 Поздравляем!</h4>
  <p>Вы узнали, как использовать контекст в Preact.</p>
</solution>

```js:setup
var output = useRef();

function getCounts() {
  var counts = [];
  var text = output.current.innerText;
  var r = /Счётчик:\s*([\w.-]*)/gi;
  while (t = r.exec(text)) {
    var num = Number(t[1]);
    counts.push(isNaN(num) ? t[1] : num);
  }
  return counts;
}

useResult(function (result) {
  output.current = result.output;

  if (getCounts().length !== 3) {
    console.warn('Похоже, что вы не инициализировали значение `count` в 0.');
  }

  var timer;
  var count = 0;
  var options = require('preact').options;

  var oe = options.event;
  options.event = function(e) {
    if (e.currentTarget.localName !== 'button') return;
    clearTimeout(timer);
    timer = setTimeout(function() {
      var counts = getCounts();
      if (counts.length !== 3) {
        return console.warn('Похоже, нам не хватает одного из счетчиков..');
      }
      if (counts[0] !== counts[2] || counts[0] !== counts[1]) {
        return console.warn('Похоже, что счетчики не синхронизированы.');
      }
      var solved = counts[0] === ++count;
      solutionCtx.setSolved(solved);
    }, 10);
    if (oe) return oe.apply(this, arguments);
  }

  return function () {
    options.event = oe;
  };
}, []);
```

```jsx:repl-initial
import { render, createContext } from 'preact';
import { useState, useContext, useMemo } from 'preact/hooks';

const CounterContext = createContext(null);

function Counter() {
  return (
    <div style={{ background: '#eee', padding: '10px' }}>
      <p>Счётчик: {'MISSING'}</p>
      <button>Добавить</button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <Counter />
      <Counter />
      <Counter />
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render, createContext } from 'preact';
import { useState, useContext, useMemo } from 'preact/hooks';

const CounterContext = createContext(null);

function Counter() {
  const { count, increment } = useContext(CounterContext);

  return (
    <div style={{ background: '#eee', padding: '10px' }}>
      <p>Счётчик: {count}</p>
      <button onClick={increment}>Добавить</button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  function increment() {
    setCount(count + 1);
  }

  const counter = useMemo(() => {
    return { count, increment };
  }, [count]);

  return (
    <CounterContext.Provider value={counter}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Counter />
        <Counter />
        <Counter />
      </div>
    </CounterContext.Provider>
  )
}

render(<App />, document.getElementById("app"));
```
