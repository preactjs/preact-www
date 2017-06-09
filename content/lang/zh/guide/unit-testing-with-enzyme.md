---
name: Unit Testing with Enzyme
permalink: '/guide/unit-testing-with-enzyme'
---

# 使用Enzyme来编写单元测试

众所周知，React提供了`react-addons-test-utils`来支持测试你的React组件，并且Airbnb基于此开发了一个名为`enzyme`的包，它的API更为易用。 如果我们想基于`enzyme`来测试Preact的Component的话，可以使用`preact-compat-enzyme`的包来模拟React内部的属性，以便`enzyme`可以基于此拿到它所需要的组件元数据。

## 安装

我们需要下面的两个包:

`preact-compat-enzyme`提供`enzyme`所需要的React的内部属性。

`preact-test-utils`则提供了`enzyme`所需要的`react-addons-test-utils`中的部分功能，最核心的部分是类型判断和事件模拟，这样`webpack`就不会因为`enzyme`加载额外的React的代码。

```shell
npm install preact-compat-enzyme --save-dev
npm install preact-test-utils --save-dev
```

## 配置webpack和karma

一般情况下我们使用karma来进行测试服务的启动。在`karma`的[`webpack`](https://github.com/webpack-contrib/karma-webpack#usage)的配置部分加入下面的alias即可。

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

## 编写用例注意事项

1. preact目前并未提供`shallow render`的实现, 所以目前使用`enzyme`仅仅支持[`mount`](http://airbnb.io/enzyme/docs/api/mount.html)模式。
2. preact在reRender的时候是异步执行，所以在执行`React Wrapper`的`setProps`或者`setState`方法时候，下一步断言的时候需要使用`setTimeout`方法。

## 示例

下面的代码作为一个使用enzyme的简单示例

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
