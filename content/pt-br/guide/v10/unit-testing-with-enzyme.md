---
name: Teste unitario com Enzyme
permalink: '/guide/unit-testing-with-enzyme'
description: 'Teste de aplicações Preact com Enzyme'
---

# Teste unitario com Enzyme

O [Enzyme](https://airbnb.io/enzyme/) do Airbnb é uma biblioteca para escrever
testes para componentes do React. Ele suporta diferentes versões do React e
Bibliotecas do tipo reagir usando "adaptadores". Há um adaptador para Preact,
mantido pela equipe Preact.

'Enzyme' suporta testes executados em um navegador normal ou sem cabeça, usando uma ferramenta
como [Karma](http://karma-runner.github.io/latest/index.html) ou testes que
execute no Node usando [jsdom](https://github.com/jsdom/jsdom) como uma falsa
implementação de APIs do navegador.

Para obter uma introdução detalhada ao uso de Enzyme e uma referência de API, consulte o
[Documentação do Enzyme](https://airbnb.io/enzyme/). O restante deste guia
explica como configurar Enzyme com Preact, bem como maneiras pelas quais Enzyme com
O Preact difere da Enzyme com o React.

---

<div><toc></toc></div>

---

## Installation

Instale o Enzyme e o adaptador Preact usando:

```sh
npm install --save-dev enzyme enzyme-adapter-preact-pure
```

## Configuração

No código de configuração do teste, você precisará configurar o Enzyme para usar o Preact
adaptador:

```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

configure({ adapter: new Adapter });
```

Para obter orientação sobre o uso de Enzyme com diferentes test-drives, consulte o
Seção [Guias](https://airbnb.io/enzyme/docs/guides.html) da documentação do Enzyme.

## Exemplo

Suponha que tenhamos um simples componente `Counter 'que exibe um valor inicial,
com um botão para atualizá-lo:

```jsx
import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount);
  const increment = () => setCount(count + 1);

  return (
    <div>
      Current value: {count}
      <button onClick={increment}>Incrementar</button>
    </div>
  );
}
```

Usando um corredor de teste como mocha ou Jest, você pode escrever um teste para verificar se
funciona como esperado:

```jsx
import { expect } from 'chai';
import { h } from 'preact';
import { mount } from 'enzyme';

import Counter from '../src/Counter';

describe('Counter', () => {
  it('deve exibir a contagem inicial', () => {
    const wrapper = mount(<Counter initialCount={5}/>);
    expect(wrapper.text()).to.include('Valor Atual: 5');
  });

  it('deve incrementar após clicar no botão "Incrementar"', () => {
    const wrapper = mount(<Counter initialCount={5}/>);

    wrapper.find('button').simulate('click');

    expect(wrapper.text()).to.include('Valor Atual: 6');
  });
});
```

Para uma versão executável deste projeto e outros exemplos, consulte o
[examples/](https://github.com/preactjs/enzyme-adapter-preact-pure/blob/master/README.md#example-projects)
diretório no repositório do adaptador Preact.

## Como o Enzyme funciona

O Enzyme usa a biblioteca do adaptador com a qual foi configurada para renderizar um
componente e seus filhos. O adaptador então converte a saída em um
representação interna padronizada (uma "React Standard Tree"). Enzyme então envolve
isso com um objeto que possui métodos para consultar a saída e acionar atualizações.
A API do objeto wrapper usa CSS-like
[seletores](https://airbnb.io/enzyme/docs/api/selector.html) para localizar partes do
a saída.

## Renderização completa, rasa e em sequência

A Enzyme possui três "modos" de renderização:

```jsx
import { mount, shallow, render } from 'enzyme';

// Renderiza a árvore de componentes completa:
const wrapper = mount(<MyComponent prop="value"/>);

// Renderiza apenas a saída direta do `MyComponent` (ou seja, componentes filho" mock "
// para renderizar apenas como espaços reservados):
const wrapper = shallow(<MyComponent prop="value"/>);

// Renderize a árvore de componentes completa em uma string HTML e analise o resultado:
const wrapper = render(<MyComponent prop="value"/>);
```

- A função `mount` renderiza o componente e todos os seus descendentes no
    da mesma maneira que eles seriam renderizados no navegador.

- A função `shallow` renderiza apenas os nós DOM que são diretamente enviados
    pelo componente. Qualquer componente filho é substituído por espaços reservados que
    saída apenas seus filhos.

    A vantagem desse modo é que você pode escrever testes para componentes sem
    dependendo dos detalhes dos componentes filhos e da necessidade de construir todos
    de suas dependências.

    O modo de renderização `superficial 'funciona de maneira diferente internamente com o Preact
    adaptador em comparação com o React. Veja a seção Diferenças abaixo para detalhes.

- A função `render` (não deve ser confundida com a função `render` do Preact!)
    renderiza um componente em uma string HTML. Isso é útil para testar a saída
    renderização no servidor ou renderização de um componente sem acionar nenhuma
    dos seus efeitos.

## Acionando atualizações e efeitos de estado com `act`

No exemplo anterior, `.simulate ('click')` foi usado para clicar em um botão.

O Enzyme sabe que as chamadas para "simular" provavelmente mudarão o estado de um
efeitos de componente ou gatilho, para aplicar quaisquer atualizações ou efeitos
imediatamente antes de `simular` retorna. O Enzyme faz o mesmo quando o componente
é renderizado inicialmente usando `mount` ou `shallow` e quando um componente é atualizado
usando `setProps`.

No entanto, se um evento ocorrer fora de uma chamada de método do Enzyme, como diretamente
chamando um manipulador de eventos (por exemplo, o botão `onClick` prop), O Enzyme não
esteja ciente da mudança. Nesse caso, seu teste precisará acionar a execução
atualizações e efeitos do estado e, em seguida, peça à Enzyme para atualizar sua visão do
resultado.

- Para executar atualizações e efeitos de estado de forma síncrona, use a função `act`
  de `preact / test-utils 'para quebrar o código que aciona as atualizações
- Para atualizar a visão do Enzyme da saída renderizada, use o `.update ()` do wrapper
  método

Por exemplo, aqui está uma versão diferente do teste para incrementar o
, modificado para chamar o botão `onClick` diretamente, em vez de ir
através do método `simulate`:

```js
import { act } from 'preact/test-utils';
```

```jsx
it("deve incrementar após clicar no botão 'Incrementar'", () => {
    const wrapper = mount(<Counter initialCount={5}/>);
    const onClick = wrapper.find('button').props().onClick;

    act(() => {
      // Invoque o manipulador de cliques do botão, mas desta vez diretamente, em vez de
       // por meio de uma API do Enzyme
      onClick();
    });
    // Atualiza o output de saida do Enzyme
    wrapper.update();

    expect(wrapper.text()).to.include('Valor atual: 6');
});
```

## Diferenças do Enzyme com React

A intenção geral é que os testes escritos usando Enzyme + React possam ser facilmente realizados
para trabalhar com Enzyme + Preact ou vice-versa. Isso evita a necessidade de reescrever todos
de seus testes se você precisar alternar um componente inicialmente escrito para Preact
para trabalhar com o React ou vice-versa.

No entanto, existem algumas diferenças no comportamento entre este adaptador e as enzimas
Reagir os adaptadores para estar ciente de:

- O modo de renderização "superficial" funciona de maneira diferente sob o capô. Isto é
  consistente com o React ao renderizar apenas um componente com "um nível de profundidade", mas,
  ao contrário do React, ele cria nós DOM reais. Ele também executa todo o normal
  ganchos e efeitos do ciclo de vida.
- O método `simulate` despacha eventos DOM reais, enquanto no React
  adaptadores, `simulate` chama apenas o `on <EventName>` prop
- Em Preact, atualizações de estado (por exemplo, após uma chamada para `setState`) são agrupadas em lotes
  e aplicado de forma assíncrona. No estado React, as atualizações podem ser aplicadas imediatamente
  ou em lote, dependendo do contexto. Para facilitar os testes de escrita, o
  O adaptador de pré-reator libera atualizações e efeitos de estado após renderizações e
  atualizações acionadas por chamadas `setProps` ou `simulate` em um adaptador. Quando atualizações de estado ou
  efeitos são acionados por outros meios, seu código de teste pode precisar
  desencadeie a liberação de efeitos e atualizações de estado usando `act` de
  o pacote `preact / test-utils`.

Para mais detalhes, consulte [as instruções do adaptador Preact
[README](https://github.com/preactjs/enzyme-adapter-preact-pure#differences-compared-to-enzyme--react).
