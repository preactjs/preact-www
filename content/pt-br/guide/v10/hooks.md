---
name: Hooks
description: 'Hooks no Preact permitem compor comportamentos juntos e reutilizar essa lógica em diferentes componentes.'
---

# Hooks

Hooks é um novo conceito que permite compor efeitos de estado e colaterais. Eles permitem reutilizar a lógica estável entre os componentes.

Se você trabalha com o Preact há algum tempo, pode estar familiarizado com padrões como `render-props` e `high-order-components` que tentam resolver o mesmo. Mas eles sempre tornaram o código mais difícil de seguir, enquanto que com hooks você pode extrair perfeitamente essa lógica e facilitar o teste de unidade de forma independente.

Devido à sua natureza funcional, eles podem ser usados em componentes funcionais e evitar muitas armadilhas da palavra-chave `this` presente nas classes. Em vez disso, eles dependem de fechamentos, o que os torna vinculados ao valor e elimina um monte de bugs quando se trata de atualizações de estado assíncronas.

Existem duas maneiras de importá-las, você pode importá-las de
`preact/hooks` ou `preact/compat`.

---

<div><toc></toc></div>

---

## Introdução

É mais fácil mostrar como eles são e comparar com os componentes da classe para ter uma idéia das vantagens deles. Pegue um aplicativo simples de contador, por exemplo:

```jsx
class Counter extends Component {
  state = { value: 0 };

  increment = () => this.setState(prev => ({ value: prev.value +1 }));

  render(_, { value }) {
    return (
      <div>
        Counter: {value}
        <button onClick={this.increment}>Incrementar</button>
      </div>
    );
  }
}
```

Tudo o que o componente faz é renderizar uma div e um botão para incrementar o contador. Vamos reescrevê-lo para ser baseado em hooks:

```jsx
function Counter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);

  return (
    <div>
      Counter: {value}
      <button onClick={increment}>Incrementar</button>
    </div>
  );
}
```

Neste ponto, eles parecem bastante semelhantes. Então, vamos dar um passo adiante. Agora podemos extrair a lógica do contador em um hook personalizado para torná-la reutilizável entre os componentes.

```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(() => setValue(value + 1), [value]);
  return { value, increment };
}

// Primeiro contador
function CounterA() {
  const { value, increment } = useCounter();
  return (
    <div>
      Contador A: {value}
      <button onClick={increment}>Incrementar</button>
    </div>
  );
}

// Segundo contador que gera uma saída diferente.
function CounterB() {
  const { value, increment } = useCounter();
  return (
    <div>
      <h1>Contador B: {value}</h1>
      <p>Eu sou um bom contador</p>
      <button onClick={increment}>Incrementar</button>
    </div>
  );
}
```

Observe como o `CounterA` e o `CounterB` são completamente independentes um do outro.

> Se você está pensando que eles podem parecer um pouco estranhos, então você não está sozinho. Todos levaram um tempo para repensar nossos hábitos aprendidos.

## O argumento de dependência

Muitos hooks apresentam um argumento que pode ser usado para limitar quando um hook deve ser atualizado. Preact irá percorrer a matriz de dependência e verificará a igualdade referencial. No exemplo anterior do contador, nós o usamos em `useCallback`:

```jsx
function useCounter() {
  const [value, setValue] = useState(0);
  const increment = useCallback(
    () => setValue(value + 1),
    // Esta é o  array de dependência
    [value]
  );
  return { value, increment };
}
```

Neste exemplo, sempre queremos atualizar a referência da função para o retorno de chamada sempre que o `valor` mudar. Isso é necessário porque, caso contrário, o retorno de chamada ainda faria referência à variável `value` da hora em que o retorno de chamada foi criado.

## Hooks com estado

Aqui veremos como podemos introduzir lógica de estado nesses
componentes funcionais.
Antes dos Hooks, tínhamos que fazer um componente de classe toda vez que precisávamos
Estado. Agora os tempos mudaram.

### useState

Este hook aceita um argumento, este será o estado inicial. Quando
invocar esse hook retorna uma matriz de duas variáveis. O primeiro ser
o estado atual e o segundo sendo o levantador do nosso estado.

Nosso levantador se comporta de maneira semelhante ao levantador de nosso estado clássico.
Ele aceita um valor ou uma função com o currentState como argumento.

Quando você liga para o setter e o estado é diferente, ele dispara
um renderizador a partir do componente em que esse useState foi usado.

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

const Counter = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  // Você também pode passar um retorno de chamada para o setter
  const decrement = () => setCount((currentCount) => currentCount - 1);

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  )
}
```

> Quando nosso estado inicial é caro, é melhor passar uma função em vez de um valor.

### useReducer

O hook `useReducer` tem uma grande semelhança com [redux](https://redux.js.org/). Comparado a [useState](#usestateinitialstate), é mais fácil de usar quando você tem uma lógica de estado complexa, na qual o próximo estado depende do anterior.

```jsx
const initialState = 0;
const reducer = (state, action) => {
  switch (action) {
    case 'incrementar': return state + 1;
    case 'decrementar': return state - 1;
    case 'resetar': return 0;
    default: throw new Error('Ação não esperada);
  }
};

function Counter() {
  // Retorna o estado atual e uma função de despacho para
  // aciona uma ação
  const [count, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      {count}
      <button onClick={() => dispatch('incrementar')}>+1</button>
      <button onClick={() => dispatch('decrementar')}>-1</button>
      <button onClick={() => dispatch('resetar')}>resetar</button>
    </div>
  );
}
```

## Memoization

Na programação da interface do usuário, geralmente há algum estado ou resultado que é caro de calcular. A memorização pode armazenar em cache os resultados desse cálculo, permitindo que seja reutilizado quando a mesma entrada for usada.

### useMemo

Com o hook `useMemo`, podemos memorizar os resultados desse cálculo e apenas recalculá-lo quando uma das dependências mudar.

```jsx
const memoized = useMemo(
  () => expensive(a, b),
  // Execute novamente a função cara apenas quando alguma dessas
  // dependências mudem
  [a, b]
);
```

> Não execute nenhum código com efeitos colaterais dentro do `useMemo`. Os efeitos colaterais pertencem ao `useEffect`.

### useCallback

O hook `useCallback` pode ser usado para garantir que a função retornada permaneça referencialmente igual durante o tempo em que nenhuma dependência for alterada. Isso pode ser usado para otimizar atualizações de componentes filhos quando eles contam com igualdade referencial para ignorar atualizações (por exemplo, `shouldComponentUpdate`).

```jsx
const onClick = useCallback(
  () => console.log(a, b);
  [a, b],
);
```

> Curiosidade: `useCallback (fn, deps)` é equivalente a `useMemo (() => fn, deps)`.

## useRef

Para obter uma referência a um nó DOM dentro de um componente funcional, existe o hook `useRef`. Funciona de maneira semelhante a [createRef](/guide/v10/refs#createrefs).

```jsx
function Foo() {
  // Inicialize useRef com um valor inicial de `null`
  const input = useRef(null);
  const onClick = () => input.current && input.current.focus();

  return (
    <>
      <input ref={input} />
      <button onClick={onClick}>Entrada de foco</button>
    </>
  );
}
```

> Cuidado para não confundir `useRef` com `createRef`.

## useContext

Para acessar o contexto em um componente funcional, podemos usar o hook `useContext`, sem nenhum componente de ordem superior ou wrapper. O primeiro argumento deve ser o objeto de contexto criado a partir de uma chamada `createContext`.

```jsx
const Tema = createContext('light');

function DisplayTheme() {
  const tema = useContext(Tema);
  return <p>Tema ativo: {tema}</p>;
}

// ...depois
function App() {
  return (
    <Theme.Provider value="light">
      <OtherComponent>
        <DisplayTheme />
      </OtherComponent>
    </Theme.Provider>
  )
}
```

## Efeitos colaterais

Os efeitos colaterais estão no coração de muitos aplicativos modernos. Se você deseja buscar alguns dados de uma API ou acionar um efeito no documento, verá que o `useEffect` atende a quase todas as suas necessidades. É uma das principais vantagens da API hooks, que transforma sua mente em pensar em efeitos, em vez do ciclo de vida de um componente.

### useEffect

Como o nome indica, `useEffect` é a principal maneira de desencadear vários efeitos colaterais. Você pode até retornar uma função de limpeza do seu efeito, se necessário.

```jsx
useEffect(() => {
  // Dispara seu efeito
  return () => {
    // Opcional: qualquer código de limpeza
  };
}, []);
```

Começaremos com um componente "Título" que deve refletir o título do documento, para que possamos vê-lo na barra de endereços da nossa guia no navegador.

```jsx
function PageTitle(props) {
  useEffect(() => {
    document.title = props.title;
  }, [props.title]);

  return <h1>{props.title}</h1>;
}
```

O primeiro argumento para `useEffect` é um retorno de chamada sem argumento que aciona o efeito. No nosso caso, só queremos acioná-lo, quando o título realmente mudou. Não faria sentido atualizá-lo quando permanecesse o mesmo. É por isso que estamos usando o segundo argumento para especificar nosso [array-de-dependências](#the-dependency-argument).

Mas, às vezes, temos um caso de uso mais complexo. Pense em um componente que precisa assinar alguns dados quando ele monta e precisa cancelar a assinatura quando desmontar. Isso também pode ser realizado com o `useEffect`. Para executar qualquer código de limpeza, basta retornar uma função em nosso retorno de chamada.

```jsx
// Componente que sempre exibirá a largura atual da janela
function WindowWidth(props) {
  const [width, setWidth] = useState(0);

  function onResize() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return <div>Window width: {width}</div>;
}
```

> A função de limpeza é opcional. Se você não precisar executar nenhum código de limpeza, não precisará retornar nada no retorno de chamada passado para `useEffect`.

### useLayoutEffect

A assinatura é idêntica a [useEffect](#useeffect), mas será acionada assim que o componente for diferido e o navegador tiver a chance de pintar.
