---
name: Prueba unitaria con Enzyme
permalink: '/guide/unit-testing-with-enzyme'
---

# Prueba unitaria con Enzyme

`React` proporciona un módulo `reac-addons-test-utils` para probar componentes, y el `enzyme` del Airbnb lleva este concepto un poco más allá - Incorporando múltiples modos de renderizado y otros recursos útiles. La prueba de componentes de `Preact` con` Enzyme` es posible gracias al módulo `preact-compat-enzyme`, que implementa las propiedades internas necesarias del `React` sobre el `preact-compat`.

## Instalación

Necesitamos dos módulos:

- `Preact-compat-enzyme`: Para proporcionar propiedades internas adicionales de `React`.
- `Preact-test-utils`: Para proporcionar partes de la API del `react-addons-test-utils` usadas por el `enzyme`.

```sh
npm install --save-dev preact-compat-enzyme preact-test-utils
```

## Configuración

Usando `Karma` como test runner, necesitaremos añadir algunos [`webpack aliases`](https://github.com/webpack-contrib/karma-webpack#usage) Para el `React` y algunos otros módulos:

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

## Limitaciones actuales

1. En la actualidad, sólo se admite el módulo [`mount`](http://airbnb.io/enzyme/docs/api/mount.html).
2. Es posible que tenga que implicar las `assertions` en un ` setTimeout`  al invocar los métodos `setProps ()` o `setState ()` del `React Wrapper`.

## Ejemplo

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
