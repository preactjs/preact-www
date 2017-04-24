---
name: Write unit test
permalink: '/guide/write-unit-test'
---

# Write unit test.

As we all known, React provide `react-addons-test-utils` to test your components and Airbnb release a package called `enzyme` for writing test better. If you want to test your preact components base on `enzyme`, you can use `preact-compat-enzyme` that implemented React internal properties.

## Install

We need two packages:

`preact-compat-enzyme` provide React internal properties.

`preact-test-utils` provide some api of `react-addons-test-utils` needed by `enzyme`.

```shell
npm install preact-compat-enzyme --save-dev
npm install preact-test-utils --save-dev
```

## Configuration

As common, We use karma to launch our test runner. Only add following [`webpack`](https://github.com/webpack-contrib/karma-webpack#usage) alias for react and others packages.

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

## Notice

1. Only support [`mount`](http://airbnb.io/enzyme/docs/api/mount.html) mode.
2. You should put your expect code in setTimeout when invoke `setProps` or `setState` method of `React Wrapper`.


## Example

```shell
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