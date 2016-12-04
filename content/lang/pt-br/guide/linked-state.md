---
name: Estado Associado
permalink: '/guide/linked-state'
---

# Estado Associado

Uma área que o Preact leva um pouco mais além do que o React é na otimização de mudanças de estado. Um padrão comum no React ES2015 é utilizar _Arrow functions_ dentro de método render de modo a atualizar o estado em responsta a eventos. Criar funções enclausuradas num escopo em cada renderização é ineficiente e força o _garbage collector_ a fazer mais trabalho que necessário. 

## A Maneira Manual Melhor
Uma solução é declarar métodos de componentes _bound_ usando propriedade de classe ES7 ([campos de instância de classe](https://github.com/jeffmo/es-class-fields-and-static-properties)):

```js
class Foo extends Component {
	updateText = e => {
		this.setState({ text: e.target.value });
	};
	render({ }, { text }) {
		return <input value={text} onInput={this.updateText} />;
	}
}
```

Apesar de alcançar performance muito melhor em _runtime_, é ainda muito código desnecessário para conectar estado a UI.

> Outra solução é vincular os métodos de componente _declarativamente_, utilizando decoradores ES7, como [`@bind` do decko](http://git.io/decko):


## Estado Associado ao Resgate

Felizmente, há uma solução no Preact na forma de `linkState()`, disponível como um método na classe `Component`.

Chamar `.linkState('text')` retorna uma função _handler_ que, quando passada um Evento, usa seus valores associados para atualizar a propriedade nomeada no estado do componente. Múltiplas chamadas para `linkState(name)` com o mesmo `name` são cacheadas, então há essencialmente nenhuma penalidade de performance.

Aqui está o exemplo anterior reescrito utilizando **Estado Associado**:

```js
class Foo extends Component {
	render({ }, { text }) {
		return <input value={text} onInput={this.linkState('text')} />;
	}
}
```

Isso é conciso, fácil de compreender e efetivo. Manipula o estado associado pra qualquer tipo de entrada. Um argumento opcional `'path'` pode ser utilizado para prover um caminho (em notação de pontos) para o novo valor de estado para vínculos personalizados (como um vínculo a o valor componente externo).

## Caminhos de Evento Personalizados 

Por padrão, `linkState()` irá tentar derivar o valor apropriado a partir de um evento automaticamente. Por exemplo, um elemento `<input>` irá definir o valor de uma propriedade para `event.target.value` ou `event.target.checked` dependendo do tipo do _input_. Para manipuladores de evento customizados, passar valores escalares para o manipulador gerado pelo `linkState()` irá simplesmente usar o valor escalar. Na maioria do tempo, esse comportamento é desejável.


Contudo, há casos onde isso é indesejável - eventos customizados e botôes _radio_ agrupados são dois exemplos de tal ocorrência. Nesses casos, um segundo arumento pode ser passao para `linkState()` para específicar o caminho dentro do evento onde o valor pode ser encontrado.


Para entender tal característica, pode ser útil entender como `linkState()` funciona por trás das cortinas. O exemplo a seguir ilustra um _event handler_ criado manualmente que persiste um valor, a partir de um objeto Evento, no estado. É funcionalmente equivalente a versão do `linkState()`, não encluindo no entanto a otimização de _memoização_ que torna o `linkState()` valioso.


```js
// Esse handler returnado do linkState:
handler = this.linkState('thing', 'foo.bar');

// ...é funcionalmente equivalente a:
handler = event => {
  this.setState({
    thing: event.foo.bar
  });
}
```


### Ilustração: Botões _Radio_ Agrupados

O seguinte códio não funciona como esperado. Se o usuário clicar em "no", `noChecked` se torna `true` mas `uesChecked` mantém-se `true`, visto que `onChance` não é disparado sobre o outro botão _radio_:

```js
class Foo extends Component {
  render({ }, { yes, no }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={yes}
          onChange={this.linkState('yes')}
        />
        <input type="radio" name="demo"
          value="no" checked={no}
          onChange={this.linkState('no')}
        />
      </div>
    );
  }
}
```

O segundo argumento do `linkState` nos ajuda aqui. Ele te deixa prover um caminho do objeto de evento para ser usado como o valor associado. Revisitando o exemplo anterior, vamos explicitamente mostrar ao `linkState` onde ele irá buscar seu novo valor de estado, a partir da propriedade `value` em `event.target`

```js
class Foo extends Component {
  render({ }, { answer }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={answer == 'yes'}
          onChange={this.linkState('answer', 'target.value')}
        />
        <input type="radio" name="demo"
          value="no" checked={answer == 'no'}
          onChange={this.linkState('answer', 'target.value')}
        />
      </div>
    );
  }
}
```
Agora o exemplo funciona como esperado!
