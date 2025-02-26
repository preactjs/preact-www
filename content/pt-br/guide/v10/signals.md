---
name: Signals
description: 'Signals: estado reativo componível com renderização automática.'
---

# Signals

Signals são primitivas reativas para gerenciar o estado da aplicação.

O que torna os Signals únicos é que as mudanças de estado atualizam automaticamente os componentes e a UI da maneira mais eficiente possível. A vinculação automática do estado e o rastreamento de dependências permitem que os Signals ofereçam excelente ergonomia e produtividade, eliminando os erros mais comuns no gerenciamento de estado.

Os Signals são eficazes em aplicações de qualquer tamanho, combinando uma ergonomia que acelera o desenvolvimento de pequenos aplicativos com características de desempenho que garantem que apps de qualquer escala sejam rápidos por padrão

---

**Importante:**

Este guia abordará o uso de Signals no Preact e, embora isso seja amplamente aplicável tanto à biblioteca Core quanto à React, haverá algumas diferenças de uso. As melhores referências para seu uso estão em suas respectivas documentações: [`@preact/signals-core`](https://github.com/preactjs/signals), [`@preact/signals-react`](https://github.com/preactjs/signals/tree/main/packages/react)

---

<div><toc></toc></div>

---

## Introdução

Muito do problema do gerenciamento de estado em JavaScript é reagir às mudanças de um determinado valor, já que os valores não são diretamente observáveis. Soluções normalmente contornam essa limitação armazenando os valores em uma variável e verificando continuamente se houve alteração, o que é trabalhoso e não ideal em termos de desempenho. Idealmente, queremos uma forma de expressar um valor que indique quando ele muda. É isso que os Signals fazem.

No seu core, um signal é um objeto com uma propriedade `.value` que armazena um valor. Essa característica é importante: o valor de um signal pode mudar, mas o signal em si permanece o mesmo.

```js
// --repl
import { signal } from "@preact/signals";

const count = signal(0);

// Lê o valor de um signal acessando .value:
console.log(count.value);   // 0

// Atualiza o valor do signal:
count.value += 1;

// O valor do signal foi alterado:
console.log(count.value);  // 1
```

No Preact, ao passar um signal pela árvore como props ou contexto, estamos apenas transmitindo referências para o signal. O signal pode ser atualizado sem acionar a re-renderização dos componentes, pois estes recebem o signal e não o seu valor. Isso permite pular o trabalho dispendioso de renderização e ir diretamente para os componentes que realmente acessam a propriedade `.value` do signal.

Signals têm uma segunda característica importante, que é o rastreamento de quando seu valor é acessado e quando ele é atualizado. No Preact, acessar a propriedade `.value` de um signal dentro de um componente re-renderiza automaticamente o componente quando o valor desse signal muda.

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal } from "@preact/signals";

// Cria um signal que pode ser observado:
const count = signal(0);

function Counter() {
  // Acessar .value em um componente re-renderiza-o quando ele muda:
  const value = count.value;

  const increment = () => {
    // Atualiza o signal atribuindo a .value:
    count.value++;
  };

  return (
    <div>
      <p>Contador: {value}</p>
      <button onClick={increment}>clique aqui</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

Finalmente, os Signals estão profundamente integrados ao Preact para proporcionar o melhor desempenho e ergonomia possíveis. No exemplo acima, acessamos `count.value` para recuperar o valor atual do signal `count`, mas isso é desnecessário. Em vez disso, podemos deixar que o Preact faça todo o trabalho para nós usando o signal `count` diretamente no JSX:

```jsx
// --repl
import { render } from "preact";
// --repl-before
import { signal } from "@preact/signals";

const count = signal(0);

function Counter() {
  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={() => count.value++}>clique aqui</button>
    </div>
  );
}
// --repl-after
render(<Counter />, document.getElementById("app"));
```

## Instalação

Signals podem ser instalados adicionando o pacote `@preact/signals` ao seu projeto:

```bash
npm install @preact/signals
```

Após a instalação com seu gerenciador de pacotes preferido, você já pode importá-lo em sua aplicação.

## Exemplo de Uso

Vamos usar signals em um cenário do mundo real. Vamos construir um app de lista de tarefas, onde é possível adicionar e remover itens. Para começar, vamos modelar o estado. Precisamos de um signal que contenha uma lista de tarefas, representada por um `Array`:

```jsx
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Comprar mantimentos" },
  { text: "Passear com o cachorro" },
]);
```

Para permitir que o usuário insira texto para um novo item da lista de tarefas, precisaremos de mais uma signal, que em breve conectaremos a um elemento `<input>`. Por enquanto, já podemos usar essa signal para criar uma função que adiciona um item à nossa lista. Lembre-se de que podemos atualizar o valor de uma signal atribuindo à sua propriedade `.value`.

```jsx
// Vamos usar isto para nosso input mais tarde
const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = ""; // Limpa o valor do input ao adicionar
}
```

> :bulb: Dica: Um signal só será atualizado se você atribuir um novo valor a ele. Se o valor que você atribuir a um signal for igual ao valor atual, ele não será atualizado.
> 
> ```js
> const count = signal(0);
>
> count.value = 0; // não atualiza - valor é o mesmo
>
> count.value = 1; // atualiza - valor é diferente
> ```

Vamos verificar se nossa lógica está correta até agora. Ao atualizar o signal `text` e chamar `addTodo()`, devemos ver um novo item sendo adicionado ao signal `todos`. Podemos simular esse cenário chamando essas funções diretamente - ainda não precisamos de uma interface de usuário!

```jsx
// --repl
import { signal } from "@preact/signals";

const todos = signal([
  { text: "Buy groceries" },
  { text: "Walk the dog" },
]);

const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = ""; // Reseta o valor do input ao adicionar
}

// Verifica se nossa lógica funciona
console.log(todos.value);
// Exibe: [{text: "Buy groceries"}, {text: "Walk the dog"}]


// Simula adicionar um novo todo
text.value = "Tidy up";
addTodo();

// Verifica que o novo item foi adicionado e que o signal `text` foi limpo:
console.log(todos.value);
// Exibe: [{text: "Buy groceries"}, {text: "Walk the dog"}, {text: "Tidy up"}]

console.log(text.value);  // Exibe: ""
```

A última funcionalidade que gostaríamos de adicionar é a capacidade de remover um item da lista de tarefas. Para isso, vamos adicionar uma função que exclui um determinado todo do array de todos:

```jsx
function removeTodo(todo) {
  todos.value = todos.value.filter(t => t !== todo);
}
```

## Construindo a UI

Agora que modelamos o estado da nossa aplicação, é hora de conectá-lo a uma interface agradável com a qual os usuários possam interagir.

```jsx
function TodoList() {
  const onInput = event => (text.value = event.currentTarget.value);

  return (
    <>
      <input value={text.value} onInput={onInput} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.value.map(todo => (
          <li>
            {todo.text}{' '}
            <button onClick={() => removeTodo(todo)}>❌</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

E com isso, temos um aplicativo de tarefas totalmente funcional! Você pode testar o aplicativo completo [aqui](/repl?example=todo-signals) 🎉

## Derivando estado com signals computadas  

Vamos adicionar mais um recurso ao nosso aplicativo de tarefas: cada item poderá ser marcado como concluído, e exibiremos para o usuário a quantidade de itens concluídos. Para isso, importaremos a função [`computed(fn)`](#computedfn), que nos permite criar uma nova signal computada com base nos valores de outras signals. A signal computada retornada é somente leitura e seu valor é atualizado automaticamente sempre que qualquer signal acessada dentro da função de callback for alterada.

```jsx
// --repl
import { signal, computed } from "@preact/signals";

const todos = signal([
  { text: "Buy groceries", completed: true },
  { text: "Walk the dog", completed: false },
]);

// Cria um signal computado a partir de outros signals
const completed = computed(() => {
  // Quando `todos` mudar, isso re-executa automaticamente:
  return todos.value.filter(todo => todo.completed).length;
});

// Exibe: 1, pois um todo está marcado como concluído
console.log(completed.value);
```

Nosso simples aplicativo de lista de tarefas não precisa de muitas signals computadas, mas aplicativos mais complexos costumam depender de `computed()` para evitar a duplicação de estado em vários lugares.  

> :bulb: Dica: Derivar o máximo de estado possível garante que seu estado sempre tenha uma única fonte de verdade. Esse é um princípio fundamental das signals. Isso facilita muito a depuração caso haja algum erro na lógica da aplicação no futuro, pois há menos pontos de preocupação.

## Gerenciando o estado global da aplicação  

Até agora, criamos signals apenas fora da árvore de componentes. Isso funciona bem para um aplicativo pequeno, como uma lista de tarefas, mas em aplicativos maiores e mais complexos, isso pode dificultar os testes. Os testes geralmente envolvem a alteração de valores no estado da aplicação para reproduzir um determinado cenário, passando esse estado para os componentes e verificando o HTML renderizado. Para facilitar esse processo, podemos extrair o estado da nossa lista de tarefas para uma função:

```jsx
function createAppState() {
  const todos = signal([]);

  const completed = computed(() => {
    return todos.value.filter(todo => todo.completed).length
  });

  return { todos, completed }
}
```

> :bulb: Dica: Perceba que estamos conscientemente não incluindo as funções `addTodo()` e `removeTodo(todo)` aqui. Separar os dados das funções que os modificam frequentemente ajuda a simplificar a arquitetura da aplicação. Para mais detalhes, confira [design orientado a dados](https://en.wikipedia.org/wiki/Data-oriented_design).

Agora podemos passar o estado da nossa aplicação de tarefas como uma prop ao renderizar:

```jsx
const state = createAppState();

// ...depois:
<TodoList state={state} />
```

Isso funciona no nosso aplicativo de lista de tarefas porque o estado é global. No entanto, aplicativos maiores geralmente acabam com vários componentes que precisam acessar as mesmas partes do estado. Isso normalmente envolve "elevar o estado" para um componente ancestral comum. Para evitar passar o estado manualmente através de cada componente via props, o estado pode ser colocado em [Contexto](/guide/v10/context), de modo que qualquer componente na árvore possa acessá-lo. Aqui está um exemplo rápido de como isso normalmente funciona:

```jsx
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { createAppState } from "./my-app-state";

const AppState = createContext();

render(
  <AppState.Provider value={createAppState()}>
    <App />
  </AppState.Provider>
);

 // ...mais tarde, quando você precisar acessar o estado da sua aplicação
function App() {
  const state = useContext(AppState);
  return <p>{state.completed}</p>;
}
```

Se você quiser aprender mais sobre como o contexto funciona, confira a [documentação sobre Contexto](/guide/v10/context).

## Estado local com signals

A maior parte do estado da aplicação acaba sendo passada através de props e contexto. No entanto, existem muitos cenários em que os componentes possuem seu próprio estado interno, que é específico para aquele componente. Como não há razão para que esse estado faça parte da lógica de negócios global da aplicação, ele deve ser restrito ao componente que precisa dele. Nesses cenários, podemos criar signals, assim como signals computadas, diretamente dentro dos componentes utilizando os hooks `useSignal()` e `useComputed()`:

```jsx
import { useSignal, useComputed } from "@preact/signals";

function Counter() {
  const count = useSignal(0);
  const double = useComputed(() => count.value * 2);

  return (
    <div>
      <p>{count} x 2 = {double}</p>
      <button onClick={() => count.value++}>click me</button>
    </div>
  );
}
```

Esses dois hooks são envoltórios simples em torno de [`signal()`](#signalinitialvalue) e [`computed()`](#computedfn) que constroem uma signal na primeira vez que um componente é executado, e simplesmente utilizam essa mesma signal nas renderizações subsequentes.

> 💡 Nos bastidores, esta é a implementação:
>
> ```js
> function useSignal(value) {
>  return useMemo(() => signal(value), []);
> }
> ```

## Uso avançado de signals

Os tópicos que cobrimos até agora são tudo o que você precisa para começar. A seção a seguir é voltada para leitores que querem se beneficiar ainda mais ao modelar o estado de sua aplicação inteiramente usando signals.

### Reagindo a signals fora dos componentes

Ao trabalhar com signals fora da árvore de componentes, você pode ter notado que as signals computadas não se recomputam a menos que você acesse ativamente seu valor. Isso ocorre porque as signals são preguiçosas por padrão: elas só computam novos valores quando seu valor é acessado.

```js
const count = signal(0);
const double = computed(() => count.value * 2);

// Apesar de atualizar o sinal `count` do qual o sinal `double` depende,
// `double` ainda não é atualizado porque ninguém utilizou seu valor.
count.value = 1;

// Ler o valor de `double` aciona sua re-computação:
console.log(double.value); // Exibe: 2
```

Isso levanta uma pergunta: como podemos nos inscrever em signals fora da árvore de componentes? Talvez queiramos registrar algo no console sempre que o valor de uma signal mudar, ou persistir o estado no [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

Para executar código arbitrário em resposta a mudanças de signals, podemos usar [`effect(fn)`](#effectfn). Semelhante às signals computadas, os efeitos monitoram quais signals são acessadas e reexecutam seu callback quando essas signals mudam. Ao contrário das signals computadas, [`effect()`](#effectfn) não retorna uma signal - é o final de uma sequência de mudanças.

```js
import { signal, computed, effect } from "@preact/signals";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => `${name.value} ${surname.value}`);

// Registra o nome sempre que ele muda:
effect(() => console.log(fullName.value));
// Registra: "Jane Doe"

// Atualizar `name` atualiza `fullName`, o que aciona novamente o effect:
name.value = "John";
// Registra: "John Doe"
```

Opcionalmente, você pode retornar uma função de limpeza do callback fornecido para [`effect()`](#effectfn), que será executada antes da próxima atualização ocorrer. Isso permite "limpar" o efeito colateral e, potencialmente, redefinir qualquer estado para o próximo acionamento do callback.

```js
effect(() => {
  Chat.connect(username.value)

  return () => Chat.disconnect(username.value)
})
```

Você pode destruir um efeito e cancelar a inscrição de todas as signals que ele acessou chamando a função retornada.

```js
import { signal, effect } from "@preact/signals";

const name = signal("Jane");
const surname = signal("Doe");
const fullName = computed(() => name.value + " " + surname.value);

const dispose = effect(() => console.log(fullName.value));
// Registra: "Jane Doe"

// Destroi o efeito e as inscrições:
dispose();

// Atualizar `name` não executa o efeito pois ele foi destruído.
// Também não re-computa `fullName` agora que nada o está observando.
name.value = "John";
```

> 💡 **Dica:** Não se esqueça de limpar os efeitos se estiver usando-os extensivamente. Caso contrário, sua aplicação consumirá mais memória do que o necessário.


## Lendo signals sem se inscrever nelas

Na rara ocasião em que você precisa escrever em uma signal dentro de [`effect(fn)`](#effectfn), mas não quer que o efeito seja reexecutado quando essa signal mudar, você pode usar `.peek()` para obter o valor atual da signal sem se inscrever nela.

```js
const delta = signal(0);
const count = signal(0);

effect(() => {
  // Atualiza `count` sem se inscrever em `count`:
  count.value = count.peek() + delta.value;
});

// Definir `delta` reexecuta o efeito:
delta.value = 1;

// Isso não reexecutará o efeito porque não acessou `.value`:
count.value = 10;
```

> 💡 **Dica:** Os cenários em que você não quer se inscrever em uma signal são raros. Na maioria dos casos, você quer que seu efeito se inscreva em todas as signals. Use `.peek()` apenas quando realmente necessário.

Como alternativa ao `.peek()`, temos a função `untracked`, que recebe uma função como argumento e retorna o resultado dessa função. Dentro de `untracked`, você pode referenciar qualquer signal com `.value` sem criar uma inscrição. Isso pode ser útil quando você tem uma função reutilizável que acessa `.value` ou precisa acessar mais de uma signal.

```js
const delta = signal(0);
const count = signal(0);

effect(() => {
  // Atualize `count` sem se inscrever em `count` ou `delta`:
  count.value = untracked(() => {
    return count.value + delta.value;
  });
});
```

## Combinando várias atualizações em uma

Lembra da função `addTodo()` que usamos anteriormente no nosso aplicativo de tarefas? Aqui está um lembrete de como ela se parecia:

```js
const todos = signal([]);
const text = signal("");

function addTodo() {
  todos.value = [...todos.value, { text: text.value }];
  text.value = "";
}
```

Perceba que a função aciona duas atualizações separadas: uma ao definir `todos.value` e a outra ao definir o valor de `text`. Isso pode ser indesejável às vezes e justificar a combinação de ambas as atualizações em uma única, por motivos de desempenho ou outros. A função [`batch(fn)`](#batchfn) pode ser usada para combinar várias atualizações de valor em um único "commit" no final do callback:

```js
function addTodo() {
  batch(() => {
    todos.value = [...todos.value, { text: text.value }];
    text.value = "";
  });
}
```

Acessar uma signal que foi modificada dentro de um batch refletirá seu valor atualizado. Acessar uma signal computada que foi invalidada por outra signal dentro de um batch recomputará apenas as dependências necessárias para retornar um valor atualizado para essa signal computada. Quaisquer outras signals invalidadas permanecem inalteradas e são atualizadas apenas no final do callback do batch.

```js
// --repl
import { signal, computed, effect, batch } from "@preact/signals";

const count = signal(0);
const double = computed(() => count.value * 2);
const triple = computed(() => count.value * 3);

effect(() => console.log(double.value, triple.value));

batch(() => {
  // define `count`, invalidando `double` e `triple`:
  count.value = 1;

  // Apesar de estar em lote, `double` reflete o novo valor computado.
  // Porém, `triple` será atualizado somente após a conclusão da callback.
  console.log(double.value); // Logs: 2
});
```

> 💡 **Dica:** Batches também podem ser aninhados, e nesse caso, as atualizações em batch são aplicadas somente após o callback do batch mais externo ser concluído.

### Otimizações de renderização

Com signals, podemos contornar a renderização do Virtual DOM e vincular as mudanças das signals diretamente às mutações do DOM. Se você passar uma signal para JSX em uma posição de texto, ela será renderizada como texto e será atualizada automaticamente no local, sem a necessidade de diffs do Virtual DOM:

```jsx
const count = signal(0);

function Unoptimized() {
  // Renderiza o componente novamente quando `count` muda:
  return <p>{count.value}</p>;
}

function Optimized() {
  // O texto é atualizado automaticamente sem re-renderizar o componente:
  return <p>{count}</p>;
}
```

Para habilitar essa otimização, passe a signal diretamente para o JSX em vez de acessar sua propriedade `.value`.

Uma otimização de renderização semelhante também é suportada ao passar signals como props para elementos DOM.

## API

Esta seção é uma visão geral da API das signals. Ela é voltada para ser uma referência rápida para quem já sabe como usar signals e precisa de um lembrete do que está disponível.

### signal(initialValue)

Cria uma nova signal com o argumento fornecido como seu valor inicial:

```js
const count = signal(0);
```

Ao criar signals dentro de um componente, use a variante do hook: `useSignal(initialValue)`.

A signal retornada possui uma propriedade `.value` que pode ser lida ou definida para ler e escrever seu valor. Para ler de uma signal sem se inscrever nela, use `signal.peek()`.

### computed(fn)

Cria uma nova signal que é computada com base nos valores de outras signals. A signal computada retornada é somente leitura, e seu valor é automaticamente atualizado quando qualquer signal acessada dentro da função de callback mudar.

```js
const name = signal("Jane");
const surname = signal("Doe");

const fullName = computed(() => `${name.value} ${surname.value}`);
```

Ao criar signals computadas dentro de um componente, use a variante do hook: `useComputed(fn)`.

### effect(fn)

Para executar código arbitrário em resposta a mudanças de signals, podemos usar `effect(fn)`. Semelhante às signals computadas, os efeitos monitoram quais signals são acessadas e reexecutam seu callback quando essas signals mudam. Se o callback retornar uma função, essa função será executada antes da próxima atualização de valor. Ao contrário das signals computadas, `effect()` não retorna uma signal - é o final de uma sequência de mudanças.

```js
const name = signal("Jane");

// Loga no console quando `name` muda:
effect(() => console.log('Hello', name.value));
// Exibe: "Hello Jane"

name.value = "John";
// Exibe: "Hello John"
```

Ao responder a mudanças de signals dentro de um componente, use a variante do hook: `useSignalEffect(fn)`.

### batch(fn)

A função `batch(fn)` pode ser usada para combinar várias atualizações de valor em um único "commit" no final do callback fornecido. Batches podem ser aninhados e as mudanças são aplicadas somente quando o callback do batch mais externo é concluído. Acessar uma signal que foi modificada dentro de um batch refletirá seu valor atualizado.

```js
const name = signal("Jane");
const surname = signal("Doe");

// Combine both writes into one update
batch(() => {
  name.value = "John";
  surname.value = "Smith";
});
```

### untracked(fn)

A função `untracked(fn)` pode ser usada para acessar o valor de várias signals sem se inscrever nelas.

```js
const name = signal("Jane");
const surname = signal("Doe");

effect(() => {
  untracked(() => {
    console.log(`${name.value} ${surname.value}`)
  })
})
```
