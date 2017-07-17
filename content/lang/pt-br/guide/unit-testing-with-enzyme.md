---
name: Teste Unitário com Enzyme
permalink: '/guide/unit-testing-with-enzyme'
---

# Teste Unitário com Enzyme

O `React` fornece um módulo `reag-addons-test-utils` para testar componentes, e o `enzyme` do Airbnb leva esse conceito um pouco mais além - Incorporando múltiplos modos de renderização e outros recursos úteis. Testar componentes do `Preact` com o `enzyme` é possível graças ao módulo `preact-compat-enzyme`, que implementa as propriedades internas necessárias do `React` em cima do `preact-compat`.

## Instalação

Precisamos de dois módulos:

- `Preact-compat-enzyme`: para fornecer propriedades internas adicionais do `React`.
- `Preact-test-utils`: para fornecer partes da API do `react-addons-test-utils` usadas pelo `enzyme`.

```sh
npm install --save-dev preact-compat-enzyme preact-test-utils
```

## Configuração

Usando `Karma` como test runner, precisaremos adicionar alguns [`webpack aliases`](https://github.com/webpack-contrib/karma-webpack#usage) para o `React` e alguns outros módulos:

```json
{
  "resolve": {
    "alias": {
        "react-dom/server": "preact-render-to-string",
        "react-addons-test-utils": "preact-test-utils",
        "react": "preact-compat-enzyme",
        "react-dom": "preact-compat-enzyme"
    }
  }
}
```

## Limitações atuais

1. No momento, apenas o módulo [`mount`](http://airbnb.io/enzyme/docs/api/mount.html)  é suportado.
2. Talvez seja necessário envolver as `assertions` em um` setTimeout` ao invocar os métodos `setProps ()` ou `setState ()` do `React Wrapper`.


## Exemplo

```js
let dataSource = [{ id: '1', name: 'test-content' }, { id: '2', name: 'test-content' }],
    table,
    wrapper;

    beforeEach(() => {
        table = <Table dataSource={dataSource}>
            <Table.Column dataIndex='id' />
            <Table.Column dataIndex='name' />
        </Table>
        wrapper = mount(table);å
    })

    afterEach(() => {
        table = null;
    })

    it('should render checkboxMode', (done) => {
        wrapper.setProps({
             rowSelection: {
                getProps: (record) => {
                    if (record.id === '1') {
                        return {
                            disabled: true
                        }
                    }
                }
            }
        });

        setTimeout(() => {
            expect(wrapper.find('.checkbox').length).to.be.equal(3);
            expect(wrapper.find('.checkbox.disabled').length).to.be.equal(1);
            done();
        }, 10);
    });
```
