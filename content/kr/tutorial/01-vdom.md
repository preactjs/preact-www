---
prev: /tutorial
next: /tutorial/02-events
solvable: true
---

# 가상 DOM

사람들이 "가상 DOM"을 언급하는 것을 듣고 "가상"으로 만드는 것이 무엇인지 궁금했을 것입니다. 브라우저용으로 프로그래밍할 때 사용하는 실제 DOM과 "가상" DOM은 어떻게 다릅니까?

가상 DOM 의 객체를 사용하는 트리 구조에 대한 간단한 설명입니다 :

```js
let vdom = {
  type: 'p',         // a <p> element
  props: {
    class: 'big',    // with class="big"
    children: [
      'Hello World!' // and the text "Hello World!"
    ]
  }
}
```

Preact와 같은 라이브러리는 이러한 설명을 구성하는 방법을 제공하여 브라우저의 DOM 트리와 비교할 수 있습니다. 트리의 각 부분이 비교되고 브라우저의 DOM 트리가 가상 DOM 트리에서 설명하는 구조와 일치하도록 업데이트됩니다.

_명령형_ 이 아닌 _선언형_ 으로 사용자 인터페이스를 구성할 수 있기 때문에 유용합니다. 키보드나 마우스 입력 등에 응답하여 DOM을 업데이트 하는 _방법_ 을 설명하는 대신 해당 입력이 수신된 후 DOM이 _어떻게_ 표시되어야 하는지 설명하면 됩니다. 즉, 트리 구조에 대한 Preact 설명을 반복적으로 제공할 수 있으며 현재 구조에 관계없이 각각의 새로운 description 과 일치하도록 브라우저의 DOM 트리를 업데이트합니다.

이 페이지에서는 가상 DOM 의 트리를 생성하는 방법과 해당 트리와 일치하도록 DOM을 업데이트하도록 Preact에 지시하는 방법을 배웁니다.

### 가상 DOM 트리 만들기

가상 DOM 트리를 생성하는 몇 가지 방법이 있습니다.:

- `createElement()`: Preact에서 제공하는 기능
- [JSX]: JavaScript 로 컴파일할 수 있는 HTML과 유사한 구문
- [HTM]: JavaScript 에서 직접 작성할 수 있는 HTML과 유사한 구문

Preact의 `createElement()` 함수를 직접 호출하는, 가장 간단한 접근 방식으로 작업을 시작하는 것이 유용합니다.



```jsx
import { createElement, render } from 'preact';

let vdom = createElement(
  'p',              // a <p> element
  { class: 'big' }, // with class="big"
  'Hello World!'    // and the text "Hello World!"
);

render(vdom, document.body);
```

위의 코드는 단락 elements 의 가상 DOM "description"을 작성합니다. createElement 의 첫 번째 argument 는 HTML elements 이름입니다. 두 번째 argument 는 elements 의 "props"로, elements 에 설정할 속성(또는 속성)을 포함하는 객체입니다. 모든 추가 argument 는 elements 의 하위이며, 문자열(예: `'Hello World!'`) 또는 추가 `createElement()` 호출의 가상 DOM elements 일 수 있습니다.

마지막 줄은 Preact 에게 가상 DOM "description" 과 일치하는 실제 DOM 트리를 만들고 해당 DOM 트리를 웹 페이지의 `<body>` 에 삽입하라는 것을 뜻합니다.

### 이제 더 많은 JSX가 있습니다!

기능을 변경하지 않고 JSX 를 사용하여 이전 예제를 다시 작성할 수 있습니다 . [JSX] 를 사용하면 HTML과 같은 구문을 사용하여 단락 요소를 설명할 수 있으므로 더 복잡한 트리를 설명할 때 가독성을 유지할 수 있습니다. JSX의 단점은 코드가 더 이상 JavaScript로 작성되지 않으며 [Babel] 과 같은 도구로 컴파일해야 한다는 것 입니다. `createElement()` 컴파일러는 아래의 JSX 예제 를 이전 예제에서 본 정확한 코드 로 변환하는 작업을 수행합니다 .




```jsx
import { createElement, render } from 'preact';

let vdom = <p class="big">Hello World!</p>;

render(vdom, document.body);
```

이제 훨씬 더 HTML처럼 보입니다!

JSX에 대해 마지막으로 명심해야 할 것이 하나 있는데, JSX 요소 내부의 코드(각 괄호 안)는 자바스크립트가 아닌 특수 구문입니다. 숫자나 변수와 같은 JavaScript 구문을 사용하려면 먼저 템플릿의 필드와 유사한 `{expression}` 을(를) 사용하여 JSX에서 다시 "점프"해야 합니다. 아래 예제에서는 `class` 를 랜덤화된 문자열로 설정하는 식과 숫자를 계산하는 식의 두 가지 식을 보여 줍니다.

```jsx
let maybeBig = Math.random() > .5 ? 'big' : 'small';

let vdom = <p class={maybeBig}>Hello {40 + 2}!</p>;
                 // ^---JS---^       ^--JS--^
```

`render(vdom, document.body)` 을(를) 실행할 경우 "Hello 42!" 라는 텍스트가 표시됩니다.

### HTM 으로 한번 더

[HTM] 은 표준 JavaScript 태그 템플릿을 사용하는 JSX의 대안으로 컴파일러가 필요하지 않습니다. 태그가 지정된 템플릿을 본 적이 없다면 `${expression}` 필드를 포함할 수 있는 특수 유형의 문자열 리터럴입니다.

```js
let str = `Quantity: ${40 + 2} units`;  // "Quantity: 42 units"
```

HTM은 JSX의 `${expression}` 구문 대신 `{expression}` 을 사용하므로 코드의 어떤 부분이 HTM/JSX 요소이고 어떤 부분이 일반 자바스크립트인지 더 명확하게 알 수 있습니다.

```js
import { html } from 'htm/preact';

let maybeBig = Math.random() > .5 ? 'big' : 'small';

let vdom = html`<p class=${maybeBig}>Hello ${40 + 2}!</p>`;
                        // ^--JS--^          ^-JS-^
```

이러한 모든 예는 동일한 결과를 생성합니다. 즉, 기존 DOM 트리를 만들거나 업데이트하기 위해 Preact에 제공할 수 있는 가상 DOM 트리입니다.

---

### Detour: Components

이 튜토리얼의 뒷부분에서 구성 요소에 대해 훨씬 더 자세히 설명하겠지만, 지금은 `<p>` 와 같은 HTML 요소가 가상 DOM 요소의 _두 가지 유형_ 중 하나에 불과하다는 것을 알아야 합니다. 다른 유형은 가상 DOM 요소인 구성 요소로, `p` 와 같은 문자열 대신 함수 형식입니다.

구성 요소는 가상 DOM 애플리케이션의 구성 요소입니다.
JSX를 함수로 이동하여 매우 간단한 구성 요소를 만듭니다.
우리를 위해 렌더링되므로 우리는 더 이상 마지막 "`render()`" 행을 쓸 필요가 없습니다.

```jsx
import { createElement } from 'preact';

export default function App() {
	return (
		<p class="big">Hello World!</p>
	)
}
```

## 시도 해보세요!

이 페이지의 오른쪽 상단에는 이전 예제의 코드가 표시됩니다. 그 아래에는 그 코드를 실행한 결과가 표시된 Box 가 있습니다. 코드를 편집하여 변경 내용이 결과에 어떤 영향을 미치는지 확인할 수 있습니다.

이 페이지에서 배운 내용을 테스트하려면 텍스트를 멋지게 만들어보세요! HTML 태그: `<em>` 과 `</em>` 으로 감싸서 텍스트를 돋보이게 합니다.

그런 다음 스타일 props 를 추가하여 모든 텍스트를 <span style="color:purple">보라색</span> 으로 만듭니다. 스타일 props 는 특별하며, 하나 이상의 CSS 속성을 가진 객체 값을 element에 설정할 수 있게 해줍니다. 객체를 prop 값으로 전달하려면 `{expression}`, 과 같은 `style={{ property: 'value' }}`. 를 사용해야 합니다.

<solution>
  <h4>🎉 Congratulations!</h4>
  <p>We've made things appear on the screen. Next we'll make them interactive.</p>
</solution>


```js:setup
useResult(function(result) {
  var hasEm = result.output.innerHTML.match(/<em>World\!?<\/em>/gi);
  var p = result.output.querySelector('p');
  var hasColor = p && p.style && p.style.color === 'purple';
  if (hasEm && hasColor) {
    store.setState({ solved: true });
  }
}, []);
```


```jsx:repl-initial
import { render } from 'preact';

function App() {
  return (
    <p class="big">Hello World!</p>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from 'preact';

function App() {
  return (
    <p class="big" style={{ color: 'purple' }}>
      Hello <em>World</em>!
    </p>
  )
}

render(<App />, document.getElementById("app"));
```

[JSX]: https://en.wikipedia.org/wiki/JSX_(JavaScript)
[HTM]: https://github.com/developit/htm
[Babel]: https://babeljs.io
