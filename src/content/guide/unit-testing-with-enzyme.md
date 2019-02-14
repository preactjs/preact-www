---
name: Unit Testing with Enzyme
permalink: '/guide/unit-testing-with-enzyme'
---

# Unit Testing with Enzyme

React provides a `react-addons-test-utils` module for testing components, and Airbnb's `enzyme` takes this concept further - incorporating multiple rendering modes and other useful features. Testing preact components using `enzyme` is possible thanks to the `preact-compat-enzyme` module, which implements the necessary internal React properties on top of `preact-compat`.

## Installation

We need two modules:

- `preact-compat-enzyme`: to provide additional internal React properties.
- `preact-test-utils`: to provide parts of the `react-addons-test-utils` API used by `enzyme`.

```sh
npm install --save-dev preact-compat-enzyme preact-test-utils
```

## Configuration

Using Karma as a test runner, we'll need to add some [`webpack aliases`](https://github.com/webpack-contrib/karma-webpack#usage) for React and a few other modules:

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

## Current Limitations

1. At present, only [`mount`](http://airbnb.io/enzyme/docs/api/mount.html) mode is supported.
2. You may need to wrap assertions in a `setTimeout` when invoking the `setProps()` or `setState()` methods of `React Wrapper`.


## Example

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
