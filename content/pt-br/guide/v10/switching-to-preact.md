---
name: Mudando de React para Preact
permalink: '/guide/switching-to-preact'
description: 'Tudo o que você precisa saber para mudar de React para Preact.'
---

# Mudando para Preact (de React)

`preact/compat` é a nossa camada de compatibilidade que permite aproveitar as muitas bibliotecas do ecossistema React e usá-las com o Preact. Esta é a maneira recomendada de experimentar o Preact, se você já tiver um aplicativo React.

Isso permite que você continue escrevendo o código React / ReactDOM sem nenhuma alteração no fluxo de trabalho ou na base de código. O `preact / compat` adiciona algo em torno de 2kb ao tamanho do seu pacote, mas tem a vantagem de suportar a grande maioria dos módulos React existentes que você pode encontrar no npm. O pacote `preact / compat` fornece todos os ajustes necessários no topo do núcleo do Preact para fazê-lo funcionar como `react` e `react-dom`, em um único módulo.

---

<toc></toc>

---

## Configurando compat

Para configurar `preact/compat`, você precisa de um alias `react` e `react-dom` para `preact/compat`. A página [Introdução](/guide/v10/getting-started#aliasing-react-to-preact) detalha como o aliasing é configurado em vários empacotadores.

## PureComponent

A classe `PureComponent` funciona de maneira semelhante ao `Component`. A diferença é que o `PureComponent` pulará a renderização quando os novos adereços forem iguais aos antigos. Para fazer isso, comparamos os adereços antigos e novos por meio de uma comparação superficial, onde verificamos cada propriedade dos adereços quanto à igualdade referencial. Isso pode acelerar muito os aplicativos, evitando renderizações desnecessárias. Ele funciona adicionando um hook de ciclo de vida padrão `shouldComponentUpdate`.

```jsx
import { render } from 'preact';
import { PureComponent } from 'preact/compat';

class Foo extends PureComponent {
  render(props) {
    console.log("render")
    return <div />
  }
}

const dom = document.getElementById('root');
render(<Foo value="3" />, dom);
// Logs: "render"

// Renderiza uma segunda vez, não registra nada
render(<Foo value="3" />, dom);
```

> Observe que a vantagem do `PureComponent` somente compensa quando a renderização é cara. Para árvores de crianças simples, pode ser mais rápido executar o `render` comparado à sobrecarga de comparar adereços.

## memo

`memo` é equivalente a componentes funcionais, como` PureComponent` é para classes. Ele usa a mesma função de comparação sob o capô, mas permite especificar sua própria função especializada otimizada para o seu caso de uso.

```jsx
import { memo } from 'preact/compat';

function MyComponent(props) {
  return <div>Olá {props.name}</div>
}

// Uso com função de comparação padrão
const Memoed = memo(MyComponent);

// Uso com função de comparação personalizada
const Memoed2 = memo(MyComponent, (prevProps, nextProps) => {
  // Renderiza novamente somente quando o `nome 'muda
  return prevProps.name === nextProps.name;
})
```

> A função de comparação é diferente de `shouldComponentUpdate`, pois verifica se os dois objetos props são **iguais**, enquanto que `shouldComponentUpdate` verifica se são diferentes.

## forwardRef

Em alguns casos, ao escrever um componente, você deseja permitir que o usuário encontre uma referência específica mais abaixo na árvore. Com `forwardRef`, você pode classificar" forward "a propriedade `ref`:

```jsx
import { createRef, render } from 'preact';
import { forwardRef } from 'preact/compat';

const MyComponent = forwardRef((props, ref) => {
  return <div ref={ref}>Olá mundo</div>;
})

// Usage: `ref` will hold the reference to the inner `div` instead of
// `MyComponent`
const ref = createRef();
render(<MyComponent ref={ref} />, dom)
```

Este componente é mais útil para autores de bibliotecas.

## Portais

Em raras circunstâncias, convém continuar renderizando em um nó DOM diferente. O nó DOM de destino **deve** estar presente antes de tentar renderizar nele.

```html
<html>
  <body>
    <!--  O aplicativo é renderizado aqui -->
    <div id="app"></div>
    <!-- Os modais devem ser renderizados aqui -->
    <div id="modals"></div>
  </body>
</html>
```

```jsx
import { createPortal } from 'preact/compat';
import MyModal from './MyModal';

function App() {
  const container = document.getElementById('modals');
  return (
    <div>
      Eu sou um app
      {createPortal(<MyModal />, container)}
    </div>
  )
}
```

> Lembre-se de que, devido ao Preact reutilizar o sistema de eventos do navegador, os eventos não passam por um contêiner do Portal para a outra árvore.

## Suspense (experimental)

A principal idéia por trás do `Suspense` é permitir que seções da sua interface do usuário exibam algum tipo de conteúdo de espaço reservado enquanto os componentes mais abaixo na árvore ainda estão carregando. Um caso de uso comum para isso é a divisão de código, na qual você precisará carregar um componente da rede antes de poder renderizá-lo.

```jsx
import { Suspense, lazy } from `preact/compat`;

const SomeComponent = lazy(() => import('./SomeComponent'));

// Usage
<Suspense fallback={<div>loading...</div>}>
  <Foo>
    <SomeComponent />
  </Foo>
</Suspense>
```

Neste exemplo, a interface do usuário exibirá o texto `loading ...` até que 'SomeComponent` seja carregado e a promessa seja resolvida.

> Esse recurso é experimental e pode conter bugs. Nós o incluímos como uma prévia antecipada para aumentar a visibilidade dos testes. Não recomendamos o uso na produção.
