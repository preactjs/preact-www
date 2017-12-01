---
name: Tests unitaires avec Enzym
permalink: '/guide/unit-testing-with-enzyme'
---

# Tests unitaires avec Enzym

React fournit un module `react-addons-test-utils` pour tester les composants, et le module `enzyme` de Airbnb améliore ce concept - en incorporant plusieurs modes de rendu et d'autres fonctionnalités utiles. Tester des composants preact avec `enzyme` est possible grâce au module `preact-compat-enzyme`, qui implémente les propriétés internes de React nécessaires, en s'appuyant sur `preact-compat`.

## Installation

Nous avons besoin de deux modules :

- `preact-compat-enzyme`: pour fournir les propriétés internes de React aditionnelles
- `preact-test-utils`: pour fournir les parties de l'API de `react-addons-test-utils` utilisées par `enzyme`

```sh
npm install --save-dev preact-compat-enzyme preact-test-utils
```

## Configuration

Utilisant Karma comme test runner, nous allons devoir ajouter quelques [`alias webpack`](https://github.com/webpack-contrib/karma-webpack#usage) pour React et quelques autres modules :

```json
{
  "resolve": {
    "alias": {
      "react-dom/server": "preact-render-to-string",
      "react-dom/test-utils": "preact-test-utils",
      "react-dom": "preact-compat-enzyme",
      "react-test-renderer/shallow": "preact-test-utils",
      "react-test-renderer": "preact-test-utils",
      "react-addons-test-utils": "preact-test-utils",
      "react-addons-transition-group": "preact-transition-group",
      "react": "preact-compat-enzyme"
    }
  }
}
```

## Limitations actuelles

1. Actuellement, seul le mode [`mount`](http://airbnb.io/enzyme/docs/api/mount.html) est supporté. 
2. Vous aurez peut-être besoin d'enrober vos assertions dans un `setTimeout` lorsque vous appelerez les méthodes `setProps()` ou `setState()` du `React Wrapper`.


## Exemple

```js
let dataSource = [{ id: '1', name: 'test-content' }, { id: '2', name: 'test-content' }],
    table,
    wrapper;

    beforeEach(() => {
        table = <Table dataSource={dataSource}>
            <Table.Column dataIndex='id' />
            <Table.Column dataIndex='name' />
        </Table>
        wrapper = mount(table);
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
