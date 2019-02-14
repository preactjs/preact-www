---
name: Unit Testing with Enzyme
permalink: '/guide/unit-testing-with-enzyme'
---

# 使用Enzyme来编写单元测试

React提供了`react-addons-test-utils`来测试组件，而Airbnb开发的`enzyme`则让这个更进一步，提供了多种渲染模式和其他有用的特性。多亏了`preact-compat-enzyme`这个模块，在`preact-compat`基础之上实现了必要的React的内部属性，这让使用`enzyme`来测试preact的组件成为可能。

## 安装

我们需要下面的两个包:

`preact-compat-enzyme`: 提供`enzyme`所需要的React的内部属性。

`preact-test-utils`: 提供了`enzyme`所需要的`react-addons-test-utils`中的部分功能

```sh
npm install --save-dev preact-compat-enzyme preact-test-utils
```

## 配置

使用karma来进行测试服务的启动。我们需要在`karma`的[`webpack aliases`](https://github.com/webpack-contrib/karma-webpack#usage)的加入下面的alias。

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

## 限制

1. 目前使用`enzyme`仅仅支持[`mount`](http://airbnb.io/enzyme/docs/api/mount.html)模式。
2. 在执行`React Wrapper`的`setProps`或者`setState`方法时候，需要使用`setTimeout`方法对断言进行包裹。

## 示例

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
