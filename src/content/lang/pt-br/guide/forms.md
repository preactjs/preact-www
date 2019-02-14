---
name: Formulários
permalink: '/guide/forms'
---

# Formulários

Formulários no Preact funcionam de forma muito parecida ao React, exceto por não suportarem _props/attributes_ "estáticos" (valor inicial).

**[Documentação dos Formulários React ](https://facebook.github.io/react/docs/forms.html)**


## Componentes Controlados e Não-Controlados

A documentação do React sobre [Componentes "Controlados"](https://facebook.github.io/react/docs/forms.html#controlled-components) e [Componentes "Não-Controlados"](https://facebook.github.io/react/docs/forms.html#uncontrolled-components)
é imensamente útil para entender como tomar formulários HTML, que tem um fluxo de dados bidirecional, e fazer uso deles a partir do contexto de um renderizador Virtual DOM baseado em Componentes, que geralmente tem fluxo de dados unidirecional.

Geralmente, você deve tentar usar Componentes _Controlados_ o tempo todo. Contudo, quando criando Componentes _standalone_ ou fazendo _wrappers_ para bibliotecas externas pode ser útil utilizar seu Componente como um ponto de montagem para funcionalidades não-Preact. Nesses casos, Componentes "Não-Controlados" encaixam muito bem para tal propósito.

## Checkboxes & Radio Buttons

Checkboxes e radio buttons (`<input type="checkbox|radio">`) podem inicialmente causar confusão quando criando formulários controlados. Isto se deve a, num ambiente não controlado, tipicamente permitindo o navegador "alternar" ou "checar" um _checkbox_ ou um botão _radio_ para nós, esperando pela mudança e reagindo de acordo com o novo valor.
Contudo, tal técnica não transita bem para a visão de mundo onde a UI é sempre atualizada automáticamente em resposta a mudanças de estado e de _props_.


> **Guia:** Digamos que escutamos por uma mudança numa _checkbox_, que acontece quando a _checkbox_ é checada ou não pelo usuário. No nosso manipulador de evento da mudança, definimos um valor em `state` para o o novo valor recebido do checkbox. Tal ação irá engatilhar uma re-renderização do nosso componente, que irá re-designar o valor do _checkbox_ para o valor do estado. Isso é desnecessário, já que acabamos de pedir para o DOM por um valor e então pedimos que renderizar novamente com um valor qualquer que queríamos.

Então, ao invés de esperarmos por um evento de `mudança` deveríamos esperar por um evento de `click`, que é disparado a qualquer momento que o usuário clica na _checkbox_ ou _em uma `<label>` associada_. _Checkboxes_ apenas alternam entre Booleanos `true` e `false`, então clicar na _checkbox_ ou na _label) irá somente inverter qualquer valor que tivermos no estado, disparando uma re-renderização, e definindo o valor mostrado da _checkbox_ para o qual desejamos.

### Exemplo de Checkbox

```js
class MyForm extends Component {
    toggle(e) {
        let checked = !this.state.checked;
        this.setState({ checked });
    }
    render({ }, { checked }) {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onClick={::this.toggle} />
            </label>
        );
    }
}
```
