---
name: API Reference
permalink: '/guide/api-reference'
---

# API Referansı

---

<div><toc></toc></div>

---

## `Preact.Component`

`Component` durum bilgisi olan Preact bileşenlerini oluşturmak için genellikle alt sınıfı kullanacağınız bir temel sınıftır.

### `Component.render(props, state)`

Tüm bileşenler için `render ()` fonksiyonu gereklidir. Bileşenlerin sahne ve durumlarını inceleyebilir ve bir Preact öğesi veya `null` döndürmelidir.

```jsx
import { Component } from 'preact';

class MyComponent extends Component {
	render(props, state) {
		// props === this.props
		// state === this.state

		return <h1>Hello, {props.name}!</h1>;
	}
}
```

### Lifecycle metodları

> _**Öneri:** Eğer HTML5 Custom Elements kullandıysanız, bu metodlar `attachedCallback` ve `detachedCallback` lifecycle metodlarına çok benzerdir._

Preact, bir bileşen için tanımlanmışsa aşağıdaki lifecycle metodlarını çağırır:

| Lifecycle metodu            | Ne zaman çağrılacağı                                  |
|-----------------------------|-------------------------------------------------------|
| `componentWillMount`        | bileşen DOMa yüklenmeden önce                         |
| `componentDidMount`         | bileşen DOMa yüklendikten sonra                       |
| `componentWillUnmount`      | DOM'dan kaldırılmadan önce                            |
| `componentWillReceiveProps` | yeni proplar kabul edilmeden önce                     |
| `shouldComponentUpdate`     | `render()`dan önce. Renderı atlamak için`false` döndür|
| `componentWillUpdate`       | `render()`dan önce                                    |
| `componentDidUpdate`        | `render()`dan sonra                                   |

Tüm lifecycle metodları ve parametreleri aşağıdaki örnek bileşende gösterilmiştir:

```js
import { Component } from 'preact';

class MyComponent extends Component {
	shouldComponentUpdate(nextProps, nextState) {}
	componentWillReceiveProps(nextProps, nextState) {
		this.props // Previous props
		this.state // Previous state
	}
	componentWillMount() {}
	componentWillUpdate(nextProps, nextState) {
		this.props // Previous props
		this.state // Previous state
	}
	componentDidMount() {}
	componentDidUpdate() {}
	componentWillUnmount() {
		this.props // Current props
		this.state // Current state
	}
}
```

## `Preact.render()`

`render(component, containerNode, [replaceNode])`

Bir Preact bileşenini containerNode DOM nodeuna yerleştirin. İşlenen DOM nodeu için bir referans döndürür.

İsteğe bağlı `replaceNode` DOM nodeu sağlanırsa ve `containerNode`'un bir alt öğesi ise Preact, bu öğeyi fark bulma algoritmasını kullanarak günceller veya değiştirir. Aksi takdirde, Preact işlenen öğeyi `containerNode`'a ekler.

```js
import { render } from 'preact';

// These examples show how render() behaves in a page with the following markup:
// <div id="container">
//   <h1>My App</h1>
// </div>

const container = document.getElementById('container');

render(MyComponent, container);
// Append MyComponent to container
//
// <div id="container">
//   <h1>My App</h1>
//   <MyComponent />
// </div>

const existingNode = container.querySelector('h1');

render(MyComponent, container, existingNode);
// Diff MyComponent against <h1>My App</h1>
//
// <div id="container">
//   <MyComponent />
// </div>
```

## `Preact.h()` / `Preact.createElement()`

`h(nodeName, attributes, [...children])`

Verilen `attributes`a sahip bir Preact Sanal DOM öğesi döndürür.

Geriye kalan tüm argümanlar `children` Array içine toplanır ve aşağıdakilerden biri olabilir:
- Scalar values (string, number, boolean, null, undefined, etc)
- More Virtual DOM elements
- Infinitely nested Arrays of the above

- Skaler değerler (string, number, boolean, null, undefined, vb.)
- Daha fazla sanal DOM öğesi
- Yukarıdakilerin 2 seçeneğin iç içe geçmiş arrayi

```js
import { h } from 'preact';

h('div', { id: 'foo' }, 'Hello!');
// <div id="foo">Hello!</div>

h('div', { id: 'foo' }, 'Hello', null, ['Preact!']);
// <div id="foo">Hello Preact!</div>

h(
	'div',
	{ id: 'foo' },
	h('span', null, 'Hello!')
);
// <div id="foo"><span>Hello!</span></div>
```
