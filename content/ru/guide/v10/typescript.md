---
title: TypeScript
description: Preact имеет встроенную поддержку TypeScript. Узнайте, как его использовать!
---

# TypeScript

Preact поставляет определения типов TypeScript, которые используются самой библиотекой!

Когда вы используете Preact в редакторе, поддерживающем TypeScript (например, VSCode), вы можете извлечь выгоду из добавленной информации о типе при написании обычного JavaScript. Если вы хотите добавить информацию о типе в свои собственные приложения, вы можете использовать [аннотации JSDoc](https://fettblog.eu/typescript-jsdoc-superpowers/) или написать TypeScript и перенести его в обычный JavaScript. В этом разделе основное внимание будет уделено последнему.

---

<toc></toc>

---

## Конфигурация TypeScript

TypeScript включает в себя полноценный JSX-компилятор, который вы можете использовать вместо Babel. Добавьте следующую конфигурацию в ваш `tsconfig.json`, чтобы транспилировать JSX в Preact-совместимый JavaScript:

```json
// TypeScript < 4.1.1
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
    //...
  }
}
```

```json
// TypeScript >= 4.1.1
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
    //...
  }
}
```

Если вы используете TypeScript в цепочке инструментов Babel, установите для параметра `jsx` значение `preserve` и позвольте Babel выполнить транспиляцию. Для получения правильных типов по-прежнему необходимо указывать `jsxFactory` и `jsxFragmentFactory`.

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
    //...
  }
}
```

В вашем `.babelrc`:

```javascript
{
  presets: [
    "@babel/env",
    ["@babel/typescript", { jsxPragma: "h" }],
  ],
  plugins: [
    ["@babel/transform-react-jsx", { pragma: "h" }]
  ],
}
```

Переименуйте файлы `.jsx` в `.tsx`, чтобы TypeScript корректно разбирал JSX.

## Конфигурация TypeScript preact/compat

Вашему проекту может потребоваться поддержка более широкой экосистемы React. Для того чтобы приложение компилировалось, возможно, потребуется отключить проверку типов в `node_modules` и добавить пути к типам следующим образом. Таким образом, ваш псевдоним будет корректно работать при импорте библиотек React.

```json
{
  "compilerOptions": {
    ...
    "skipLibCheck": true,
    "baseUrl": "./",
    "paths": {
      "react": ["./node_modules/preact/compat/"],
      "react/jsx-runtime": ["./node_modules/preact/jsx-runtime"],
      "react-dom": ["./node_modules/preact/compat/"],
      "react-dom/*": ["./node_modules/preact/compat/*"]
    }
  }
}
```

## Типизация компонентов

В Preact существуют различные способы типизации компонентов. Компоненты класса имеют переменные общего типа для обеспечения безопасности типов. TypeScript рассматривает функцию как функциональный компонент до тех пор, пока она возвращает JSX. Существует множество решений для определения параметров функциональных компонентов.

### Функциональные компоненты

Типизация компонентов регулярных функций осуществляется просто — добавлением информации о типе к аргументам функции.

```tsx
interface MyComponentProps {
  name: string;
  age: number;
};

function MyComponent({ name, age }: MyComponentProps) {
  return (
    <div>
      Меня зовут {name}, мне {age.toString()} лет.
    </div>
  );
}
```

Параметры по умолчанию можно установить, задав в сигнатуре функции значение по умолчанию.

```tsx
interface GreetingProps {
  name?: string; // необязательный параметр!
};

function Greeting({ name = 'Вася' }: GreetingProps) {
  // name по умолчанию равно "Вася"
  return <div>Привет, {name}!</div>;
}
```

Для аннотирования анонимных функций в Preact также поставляется тип `FunctionComponent`. В `FunctionComponent` также добавлен тип для `children`:

```tsx
import { h, FunctionComponent } from 'preact';

const Card: FunctionComponent<{ title: string }> = ({ title, children }) => {
  return (
    <div class='card'>
      <h1>{title}</h1>
      {children}
    </div>
  );
};
```

`children` имеет тип `ComponentChildren`. С помощью этого типа можно самостоятельно указать дочерние элементы:

```tsx
import { h, ComponentChildren } from 'preact';

interface ChildrenProps {
  title: string;
  children: ComponentChildren;
};

function Card({ title, children }: ChildrenProps) {
  return (
    <div class='card'>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### Классовые компоненты

Класс `Component` в Preact типизирован как generic с двумя переменными типа generic: Props и State. Оба типа по умолчанию соответствуют пустому объекту, и вы можете задать их в соответствии с вашими потребностями.

```tsx
// Типы для props
interface ExpandableProps {
  title: string;
};

// Типы для state
interface ExpandableState {
  toggled: boolean;
};

// Привязка дженериков к ExpandableProps и ExpandableState
class Expandable extends Component<ExpandableProps, ExpandableState> {
  constructor(props: ExpandableProps) {
    super(props);
    // this.state — это объект с логическим полем `toggle` из-за ExpandableState.
    this.state = {
      toggled: false,
    };
  }
  // `this.props.title` является строкой из-за использования ExpandableProps
  render() {
    return (
      <div class='expandable'>
        <h2>
          {this.props.title}{' '}
          <button onClick={() => this.setState({ toggled: !this.state.toggled })}>
            Переключить
          </button>
        </h2>
        <div hidden={this.state.toggled}>{this.props.children}</div>
      </div>
    );
  }
}
```

Классовые компоненты по умолчанию включают дочерние элементы, типизированные как `ComponentChildren`.

## Типизация дочерних элементов

`ComponentChildren` — это тип, представляющий все допустимые дочерние элементы в Preact. Он включает примитивные типы, такие как `string`, `number` и `boolean`, а также элементы Preact, значения `null`/`undefined` и массивы из всего вышеперечисленного. Для тех, кто знаком с React, он работает очень похоже на `ReactNode`.

```tsx
import { h, ComponentChildren } from 'preact';

interface MyHeadingComponentProps {
  children: ComponentChildren;
}

function MyHeadingComponent({ children }: MyHeadingComponentProps) {
  return <h1>{children}</h1>;
}

<MyHeadingComponent>
  {/* Примеры валидных дочерних элементов */}
  Привет, мир!
  <strong>Жирный текст</strong>
  {42}
  {true}
  {['Массив', '', 'строк']}
  <OtherComponent />
</MyHeadingComponent>
```

## Наследование свойств HTML

Когда мы пишем компоненты, такие как `<Input />`, которые оборачивают HTML-элемент `<input>`, чаще всего мы хотим унаследовать свойства, которые могут быть использованы на нативном HTML-элементе input. Для этого мы можем сделать следующее:

```tsx
import { InputHTMLAttributes } from 'preact';

interface InputProperties extends InputHTMLAttributes {
  mySpecialProp: any
}

const Input = (props: InputProperties) => <input {...props} />
```

Теперь, когда мы используем `Input`, он будет знать о таких свойствах, как `value` и т. д.

## Типизация событий

Preact генерирует регулярные события DOM. Пока ваш проект TypeScript включает библиотеку `dom` (установите её в `tsconfig.json`), у вас есть доступ ко всем типам событий, которые доступны в вашей текущей конфигурации.

```tsx
import type { TargetedMouseEvent } from "preact";

export class Button extends Component {
  handleClick(event: TargetedMouseEvent<HTMLButtonElement>) {
    alert(event.currentTarget.tagName); // Оповещение BUTTON
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }
}
```

Если вы предпочитаете встроенные функции, можно обойтись без явного указания текущей цели события, так как она выводится из элемента JSX.

```tsx
export class Button extends Component {
  render() {
    return (
      <button onClick={(event) => alert(event.currentTarget.tagName)}>
        {this.props.children}
      </button>
    );
  }
}
```

## Типизация ссылок

Функция `createRef` также является универсальной и позволяет привязывать ссылки к типам элементов. В этом примере мы гарантируем, что ссылка может быть привязана только к `HTMLAnchorElement`. Использование `ref` с любым другим элементом может привести к тому, что TypeScript выдаст ошибку:

```tsx
import { h, Component, createRef } from 'preact';

class Foo extends Component {
  ref = createRef<HTMLAnchorElement>();

  componentDidMount() {
    // current имеет тип HTMLAnchorElement
    console.log(this.ref.current);
  }

  render() {
    return <div ref={this.ref}>Foo</div>;
    //          ~~~
    //       💥 Ошибка! Для HTMLAnchorElement можно использовать только ссылку `ref`
  }
}
```

Это очень помогает, если вы хотите убедиться, что элементы, на которые вы ссылаетесь (`ref`), являются входными элементами, которые могут, например, получить фокус.

## Типизация контекста

`createContext` пытается получить как можно больше выводов из исходных значений, которые вы передаете:

```tsx
import { h, createContext } from 'preact';

const AppContext = createContext({
  authenticated: true,
  lang: 'en',
  theme: 'dark',
});
// AppContext имеет тип preact.Context<{
//   authenticated: boolean;
//   lang: string;
//   theme: string;
// }>
```

Также требуется передать все свойства, которые вы определили в исходном значении:

```tsx
function App() {
  // Здесь ошибка 💥, так как мы не определили `theme`
  return (
    <AppContext.Provider
      value={{
        //    ~~~~~
        // 💥 Ошибка: `theme` не определена
        lang: 'de',
        authenticated: true,
      }}
    >
      {}
      <ComponentThatUsesAppContext />
    </AppContext.Provider>
  );
}
```

Если вы не хотите указывать все свойства, вы можете объединить значения по умолчанию с переопределениями:

```tsx
const AppContext = createContext(appContextDefault);

function App() {
  return (
    <AppContext.Provider
      value={{
        lang: 'de',
        ...appContextDefault,
      }}
    >
      <ComponentThatUsesAppContext />
    </AppContext.Provider>
  );
}
```

Или вы работаете без значений по умолчанию и используете привязку переменной универсального типа для привязки контекста к определённому типу:

```tsx
interface AppContextValues {
  authenticated: boolean;
  lang: string;
  theme: string;
}

const AppContext = createContext<Partial<AppContextValues>>({});

function App() {
  return (
    <AppContext.Provider
      value={{
        lang: "de"
      }}
    >
      <ComponentThatUsesAppContext />
    </AppContext.Provider>
  );
```

Все значения становятся необязательными, поэтому при их использовании необходимо выполнять проверки на ноль.

## Типизация хуков

Большинству хуков не требуется никакой специальной информации о типизации, но они могут определять типы на основе использования.

### useState, useEffect, useContext

`useState`, `useEffect` и `useContext` имеют общие типы, поэтому вам не нужно добавлять дополнительные аннотации. Ниже приведен минимальный компонент, использующий `useState` со всеми типами, выведенными из значений по умолчанию сигнатуры функции.

```tsx
const Counter = ({ initial = 0 }) => {
  // поскольку начальное значение — это число (значение по умолчанию!), clicks — это число.
  // setClicks — это функция, которая принимает
  // — число
  // — функция возвращает число
  const [clicks, setClicks] = useState(initial);
  return (
    <>
      <p>Клики: {clicks}</p>
      <button onClick={() => setClicks(clicks + 1)}>+</button>
      <button onClick={() => setClicks(clicks - 1)}>-</button>
    </>
  );
};
```

`useEffect` выполняет дополнительные проверки, поэтому вы возвращаете только функции очистки.

```typescript
useEffect(() => {
  const handler = () => {
    document.title = window.innerWidth.toString();
  };
  window.addEventListener('resize', handler);

  // ✅ если вы возвращаете что-то из обратного вызова эффекта, это ДОЛЖНО быть функцией без аргументов
  return () => {
    window.removeEventListener('resize', handler);
  };
});
```

`useContext` получает информацию о типе из объекта по умолчанию, который вы передаете в `createContext`.

```tsx
const LanguageContext = createContext({ lang: 'en' });

const Display = () => {
  // lang будет иметь тип строки
  const { lang } = useContext(LanguageContext);
  return (
    <>
      <p>Выбранный вами язык: {lang}</p>
    </>
  );
};
```

### useRef

Как и `createRef`, `useRef` выигрывает от привязки переменной универсального типа к подтипу `HTMLElement`. В приведенном ниже примере мы гарантируем, что в `HTMLInputElement` можно передать только `inputRef`. `useRef` обычно инициализируется с `null`, при включенном флаге `strictNullChecks` нам нужно проверить, действительно ли `inputRef` доступен.

```tsx
import { h } from 'preact';
import { useRef } from 'preact/hooks';

function TextInputWithFocusButton() {
  // инициализировать с нулевым значением, но сообщить TypeScript, что мы ищем HTMLInputElement
  const inputRef = useRef<HTMLInputElement>(null);
  const focusElement = () => {
    // строгие проверки на ноль требуют, чтобы мы проверили, существуют ли inputEl и current.
    // но если current существует, он имеет тип HTMLInputElement, значит у него есть и метод focus! ✅
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <>
      {/* кроме того, inputEl можно использовать только с элементами ввода */}
      <input ref={inputRef} type='text' />
      <button onClick={focusElement}>Передать фокус элементу input</button>
    </>
  );
}
```

### useReducer

Для хука `useReducer` TypeScript пытается вывести как можно больше типов из функции редуктора. См., например, редуктор для счётчика.

```typescript
// Тип состояния для функции редуктора
interface StateType {
  count: number;
};

// Тип действия, где `type` может быть любым
// "reset", "decrement", "increment"
interface ActionType {
  type: 'reset' | 'decrement' | 'increment';
};

// Исходное состояние. Нет необходимости комментировать
const initialState = { count: 0 };

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    // TypeScript гарантирует, что мы обрабатываем все возможные типы действий,
    // и обеспечивает автоматическое заполнение строк типов.
    case 'reset':
      return initialState;
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}
```

Когда мы используем функцию редуктора в `useReducer`, мы выводим несколько типов и выполняем проверки типов для переданных аргументов.

```tsx
function Counter({ initialCount = 0 }) {
  // TypeScript гарантирует, что редуктор имеет максимум два аргумента и что начальное состояние имеет тип Statetype.
  // Более того:
  // — state имеет тип StateType
  // — dispatch это функция для отправки ActionType
  const [state, dispatch] = useReducer(reducer, { count: initialCount });

  return (
    <>
      Счётчик: {state.count}
      {/* TypeScript гарантирует, что отправленные действия имеют тип ActionType. */}
      <button onClick={() => dispatch({ type: 'reset' })}>Сброс</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

Единственная необходимая аннотация находится в самой функции редуктора. Типы `useReducer` также гарантируют, что возвращаемое значение функции редуктора имеет тип `StateType`.

## Расширение встроенных типов JSX

У вас могут быть [пользовательские элементы](/guide/v10/web-components), которые вы хотели бы использовать в JSX, или вы можете добавить дополнительные атрибуты ко всем элементам HTML для работы с определённой библиотекой. Для этого вам нужно расширить интерфейсы `IntrinsicElements` или `HTMLAttributes` соответственно, чтобы TypeScript знал об этом и мог предоставить корректную информацию о типе.

### Расширение `IntrinsicElements`

```tsx
function MyComponent() {
  return <loading-bar showing={true}></loading-bar>;
  //      ~~~~~~~~~~~
  //   💥 Ошибка! Свойство 'loading-bar' не существует для типа 'JSX.IntrinsicElements'.
}
```

```tsx
// global.d.ts

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      'loading-bar': { showing: boolean };
    }
  }
}

// Этот пустой экспорт очень важен! Это говорит TS, что нужно рассматривать это как модуль
export {}
```

### Расширение `HTMLAttributes`

```tsx
function MyComponent() {
  return <div custom="foo"></div>;
  //          ~~~~~~
  //       💥 Ошибка! Тип '{ custom: string; }' не может быть присвоен типу 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.
  //                   Свойство 'custom' не существует для типа 'DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>'.
}
```

```tsx
// global.d.ts

declare global {
  namespace preact.JSX {
    interface HTMLAttributes {
      custom?: string | undefined;
    }
  }
}

// Этот пустой экспорт очень важен! Это говорит TS, что нужно рассматривать это как модуль
export {}
```
