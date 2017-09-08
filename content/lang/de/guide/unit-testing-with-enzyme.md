---
name: Unit-Prüfung mit Enzyme
permalink: '/guide/unit-testing-with-enzyme'
---

# Unit-Prüfung mit Enzyme

React bietet ein `react-addons-test-utils`-Modul zum Testen von Komponenten an. Airbnbs `enzyme` geht tiefer auf dieses Konzept ein - es vereinigt mehrere Rendermodi und andere nützliche Funktionen. Das Testen von Preact-Komponenten mithilfe von `enzyme` ist dank dem `preact-compat-enzyme`-Modul möglich. Dieses implementiert die benötigten internen React-Properties auf `preact-compat`drauf.

## Installation

Wir benötigen zwei Module:

- `preact-compat-enzyme`: Um weitere interne React-Properties bereitzustellen.
- `preact-test-utils`: Um Teile der `react-addons-test-utils`-API, die von `enzyme` genutzt werden, bereitzustellen.

```sh
npm install --save-dev preact-compat-enzyme preact-test-utils
```

## Konfiguration

Karma wird als Testeinheit benutzt. Man muss einige [`Webpack-Aliase`](https://github.com/webpack-contrib/karma-webpack#usage) für React und einige andere Module hinzufügen:

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

## Aktuelle Limitationen

1. Momentan wird lediglich der [`mount`](http://airbnb.io/enzyme/docs/api/mount.html) Modus unterstützt.
2. Man muss eventuell Aussagen in `setTimeout` verpacken, wenn `React Wrapper`s `setProps()` und `serState()`-Methoden aufgerufen werden.


## Beispiel

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
