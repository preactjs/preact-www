---
name: Enzyme ile Unit Test
permalink: '/guide/unit-testing-with-enzyme'
---

# Enzyme ile Unit Test

React bileşenleri test etmek için `react-addons-test-utils` modülünü sağlar ve Airbnb'nin `enzyme`'si bu konsepti daha da ileriye götürür - çoklu render ve diğer kullanışlı özellikleri içerir.
Preact bileşenlerini `enzyme` kullanarak test etmek, `preact-compat`'ın üzerinde gerekli React property'lerini uygulayan `preact-compat-enzyme` modülü sayesinde mümkün oluyor.

---

<toc></toc>

---

## Kurulum

İki modüle ihtiyacımız var:

- `preact-compat-enzyme`: dahili React property'lerini sağlamak için.
- `preact-test-utils`: `enzyme` kullanarak `react-addons-test-utils` API'sini sağlamak için.

```sh
npm install --save-dev preact-compat-enzyme preact-test-utils
```

## Yapılandırma

Karma'yı test runner olarak kullanarak, React ve birkaç başka modül için biraz [`webpack alias`](https://github.com/webpack-contrib/karma-webpack#usage)'ı eklememiz gerekecek:

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

## Şu Anki Sınırlılıklar

1. Şu anda, sadece [`mount`](http://airbnb.io/enzyme/docs/api/mount.html) modu destekleniyor.
2. `React Wrapper`'ın `setProps()` veya `setState()` methodlarını invoke ederken `setTimeout` içinde wrap assertions'lara ihtiyacınız olabilir.


## Örnek

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
