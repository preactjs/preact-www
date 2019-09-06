---
name: Contexto
description: 'O contexto permite que você passe adereços pelos componentes intermediários. Este documento descreve a API nova e a antiga'
---

# Contexto

O contexto permite que você transmita um valor para uma criança no fundo da árvore, sem ter que passar por todos os componentes intermediários via adereços. Um caso de uso muito popular para isso é o tema. Em resumo, pode-se pensar em um meio de fazer atualizações de estilo sub-estilo no Preact.

Existem duas maneiras diferentes de usar o contexto: Através da API `createContext` mais nova e da API de contexto herdada. A diferença entre os dois é que o legado não pode atualizar um filho quando um componente interrompe a renderização via `shouldComponentUpdate`. É por isso que é altamente recomendável usar sempre o `createContext`.

---

<toc></toc>

---

## createContext

Primeiro, precisamos criar um objeto de contexto que possamos transmitir. Isso é feito através da função `createContext (initialValue)`. Ele retorna um componente `Provider` que é usado para definir o valor do contexto e um componente `Consumer` que recupera o valor do contexto.

```jsx
const Theme = createContext('light');

function ThemedButton(props) {
  return (
    <Theme.Consumer>
      {theme => {
        return <button {...props} class={'btn ' + theme}>Themed Button</button>;
      }}
    </Theme.Consumer>
  );
}

function App() {
  return (
    <Theme.Provider value="dark">
      <SomeComponent>
        <ThemedButton />
      </SomeComponent>
    <Theme.Provider />
  );
}
```

> Uma maneira mais fácil de usar o contexto é através do [useContext](/guide/v10/hooks#context) hook.

## API de contexto herdado

Incluímos a API herdada principalmente por motivos de compatibilidade com versões anteriores. Foi substituída pela API `createContext`. A API herdada tem problemas conhecidos, como bloquear atualizações, se houver componentes intermediários que retornem `false` em `shouldComponentUpdate`. Se você ainda precisar usá-lo, continue lendo.

Para passar uma variável personalizada pelo contexto, um componente precisa ter o método `getChildContext`. Lá, você retorna os novos valores que deseja armazenar no contexto. O contexto pode ser acessado através do segundo argumento nos componentes de função ou `this.context` em um componente baseado em classe.

```jsx
function ThemedButton(props, context) {
  return (
    <button {...props} class={'btn ' + context.theme}>
      Themed Button
    </button>;
  );
}

class App extends Component {
  getChildContext() {
    return {
      theme: 'light'
    }
  }

  render() {
    return (
      <div>
        <SomeOtherComponent>
          <ThemedButton />
        </SomeOtherComponent>
      </div>
    );
  }
}
```
