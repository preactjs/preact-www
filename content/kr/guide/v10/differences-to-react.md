---
name: React와의 차이점
permalink: '/guide/differences-to-react'
description: 'Preact와 React에는 어떤 차이점이 있을까요? 이 문서는 그 차이에 대해 자세히 다룹니다.'
---

# React와의 차이점

Preact는 React를 재구현하기 위해 만들어진 것이 아니며 차이점이 있습니다. 이 차이점의 대부분은 사소한 것이거나 혹은, preact/compat를 사용해 완벽히 제거할 수 있습니다. [preact/compat]는 React와 100% 호환을 목표로 Preact 위에 덧씌우는 얉은 레이어입니다.

Preact가 React의 모든 기능을 하나하나 포함하지 않으려는 이유는 **작고** **집중된** 상태를 유지하기 위해서입니다. 만약 그렇지 않다면, 이미 매우 복잡하고 잘 설계된 코드 베이스인 React 프로젝트를 최적화하는 것이 더 타당할 것입니다.

---

<div><toc></toc></div>

---

## 주요 차이점

Preact 앱과 React 앱을 비교할 때 주요 차이점은 Preact에서는 자체 이벤트 시스템을 제공하지 않는다는 점입니다. Preact는 내부에서 모든 이벤트를 핸들링할 때 브라우저에서 제공하는 `addEventListner`를 사용합니다. 모든 DOM 이벤트 핸들러에 대한 리스트를 보려면 [GlobalEventHandlers]를 보세요.

브라우저의 이벤트 시스템에서 우리가 필요로 하는 모든 기능을 지원합니다. 자체적인 커스텀 이벤트를 구현하는 건 유지보수 비용 증대와 API 영역의 확장을 의미합니다.

React의 합성 이벤트 시스템과 네이티브 브라우저 이벤트에는 다음과 같은 차이점이 있습니다.

- `<Portal>` 컴포넌트를 통해 이벤트 버블이 발생하지 않습니다.
- IE11에서 `<input type=”search”>`의 초기화 "x" 버튼에 대한 `input` 이벤트가 발생하지 않습니다. 대신 `onSearch`를 사용합니다.
- `<input>` 요소들에 `onChange` 대신 `onInput`을 사용합니다. (**`preact/compat`를 사용하지 않는 경우에만 해당**)

또 다른 차이점은 Preact가 DOM의 사양을 React보다 더 많이 따르고 있다는 점입니다. 예를 들어 `className` 대신 `class`를 사용할 수 있습니다.

## 버전 호환성

Preact와 [preact/compat]의 버전 호환성은 React의 _최신_ 메이저 버전 및 _그 이전_ 버전을 기준으로 합니다. React 팀에서 새로운 기능을 발표하고, 그 기능이 Preact의 Project Goals에 부합하는 기능이라면 Preact core에도 추가될 것입니다. 이 과정에서 민주적인 의사결정을 위해 공개 논의 및 의사결정을 수행하고 있으며, 그 과정에 Issue와 Pull Request를 활용하고 있습니다. 

> 따라서, 호환성과 비교를 논할 때 이 웹사이트와 문서는 React `16.x`와 `15.x`를 반영하고 있습니다.


## 디버그 메세지와 오류

Preact의 유연한 구조는 개발 경험을 향상시키기 위한 애드온을 어떤 방식으로든 허용합니다. 이런 애드온 중 하나가 `preact/debug`입니다. 만약 설치되어있다면 [유용한 경고와 오류](https://preactjs.com/guide/v10/debugging)를 추가하고 브라우저 확장 프로그램 [Preact Developer Tools](https://preactjs.github.io/preact-devtools/)를 연결해줍니다. 이는 Preact 애플리케이션을 개발할 때 도움을 주고 무슨 일이 일어나고 있는지 조사하는 것을 매우 쉽게 해줄 것입니다. preact/debug는 다음의 import 문을 통해 추가할 수 있습니다.

```js
import "preact/debug"; // <-- 이 문장을 메인 엔트리 파일의 최상단에 추가하세요
```

`NODE_ENV != “production”`을 확인해 빌드시 디버깅 메세지를 제거하는 번들러가 필요한 React와 다른 점입니다.

## Preact 고유 기능

사실 Preact는 (P)React 커뮤니티 활동에서 영향을 받은 몇 가지 편리한 기능을 추가했습니다.

### ES Modules 기본 지원

Preact는 처음부터 ES Modules를 염두에 두고 만들어진, 최초로 ES Modules를 지원하는 프레임워크입니다. 번들러를 거칠 필요 없이 `import` 키워드로 브라우저에 바로 Preact를 로드할 수 있습니다. 

### `Component.render()`에 대한 논쟁

편의를 위해 class 컴포넌트의 `this.props`와 `this.state`를 `render()`에 전달합니다. prop 과 state 프로퍼티를 사용하는 이 컴포넌트를 살펴봅시다.

```jsx
// Preact와 React 모두에서 작동함
class Foo extends Component {
  state = { age: 1 };

  render() {
    return <div>Name: {this.props.name}, Age: {this.state.age}</div>;
  }
}
```

Preact에서는 이렇게도 사용할 수 있습니다.

```jsx
// Preact에서만 작동함
class Foo extends Component {
  state = { age: 1 };

  render({ name }, { age }) {
    return <div>Name: {name}, Age: {age}</div>;
  }
}
```

두 코드 모두 완전히 똑같은 것을 render합니다. 선호하는 스타일로 작성하세요.

### Raw HTML 어트리뷰트/프로퍼티 이름

Preact는 모든 메이저 브라우저에서 지원하는 DOM 사양을 React보다 더 많이 따르고 있습니다. 중요한 차이는 `className` 대신 표준 `class` 어트리뷰트를 사용할 수 있다는 점입니다.

```jsx
// 이것은:
<div class="foo" />

// ...이것과 동일합니다:
<div className="foo" />
```

대부분의 Preact 개발자들은 `class`를 사용하기를 선호합니다. `className`보다 작성하기 짧지만, `className`과 `class`를 모두 지원하기 때문입니다. 

### JSX 안의 SVG

SVG의 프로퍼티와 어트리뷰트의 이름들은 꽤 흥미롭습니다. SVG object의 몇몇 프로퍼티(그리고 어트리뷰트)는 카멜케이스(camel-case) (e.g. [clipPathUnits on a clipPath element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath#Attributes))로 되어있고, 몇몇 속성들은 케밥케이스(kebab-case)로 (e.g. [clip-path on many SVG elements](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation)), 또 다른 어트리뷰트는 (주로 `oninput`처럼 DOM에서 상속된 것들)은 모두 소문자로 작성되어있습니다. 

Preact는 SVG-Arrtibutes를 있는 그대로 전달합니다. 수정되지 않은 SVG 조각을 코드에 곧바로 붙여넣을 수 있고 박스 밖에서 작동될 수 있게 합니다. 이것은 아이콘이나 SVG 일러스트레이션을 만드는 툴 디자이너들과의 상호운용성을 향상시킵니다. 

React를 사용했던 사람이라면 모든 속성을 카멜케이스로 명시하는 것이 익숙할 것입니다. 카멜케이스로 작성된 속성을 계속해서 사용하길 바란다면 [preact/compat] 호환 레이어를 사용하면 됩니다. React API를 반영하고 어트리뷰트를 표준화해줄 것입니다.

```jsx
// React
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle fill="none" strokeWidth="2" strokeLinejoin="round" cx="24" cy="24" r="20" />
</svg>
// Preact (note stroke-width and stroke-linejoin)
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <circle fill="none" stroke-width="2" stroke-linejoin="round" cx="24" cy="24" r="20" />
</svg>
```

### `onChange` 대신 `onInput` 사용

대개 역사적 이유로, 사실 React에서 `onChange` 이벤트의 의미는 모든 브라우저에서 지원하는 `onInput` 이벤트와 같습니다. `input` 이벤트는 폼 컨트롤이 수정되었을 때 반응할 주된 경우들에 있어 최적의 이벤트입니다. Preact core에서 `onChange`는 표준 [DOM 변경 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)로, 요소의 값이 사용자에 의해 _변경될 때_ 실행됩니다.

```jsx
// React
<input onChange={e => console.log(e.target.value)} />

// Preact
<input onInput={e => console.log(e.target.value)} />
```

[preact/compat]를 사용하는 경우, 대부분의 `onChange` 이벤트가 내부적으로 `onInput`으로 변환되어 React의 동작을 모방합니다. 이것은 React의 생태계와 최대한의 호환성을 보장하기 위해 사용하는 Preact의 트릭 중 하나입니다. 

### JSX Constructor

JSX는 JavaScript의 구문 확장자로, 이는 중첩 함수 호출로 변환됩니다. 이런 중첩 호출을 이용해 트리 구조를 만들려는 아이디어는 JSX 이전부터 존재했으며, [hyperscript] 프로젝트를 통해 대중화되었습니다. 이런 접근은 React의 생태계 범위 이상의 가치를 가지고 있습니다. 따라서 Preact는 일반화된 커뮤니티 표준을 권장합니다. JSX가 어떻게 동작하고 Hyperscript와의 관계에 대해 더 깊은 논의를 하고 싶다면 [이 글을 읽어보세요](http://jasonformat.com/wtf-is-jsx).

**Source:** (JSX)

```jsx
<a href="/">
  <span>Home</span>
</a>
```

**Output:**

```js
// Preact:
h(
  'a',
  { href:'/' },
  h('span', null, 'Home')
);

// React:
React.createElement(
  'a',
  { href:'/' },
  React.createElement('span', null, 'Home')
);
```

최종적으로 생성된 Preact 애플리케이션 출력 코드를 살펴보면, 이름이 없는 짧은 “JSX pragma”가 더 읽기 쉽고 minification과 같은 최적화에 더 적합하다는 것을 명확하게 알 수 있습니다. 대부분의 Preact 앱에서 `h()`를 마주치지만, `createElement` 별칭 내보내기도 제공하기 때문에 어떤 이름을 사용하는지는 중요하지 않습니다.

### contextTypes가 필요하지 않습니다

레거시 `Context` API는 컴포넌트가 해당 값을 받기 위해 React의 `contextTypes`나 `childContextTypes`를 사용해 특정 프로퍼티를 선언해야 합니다. 하지만 Preact는 그럴 필요가 없습니다. 모든 컴포넌트는 기본적으로 `getChildContext()`를 통해 만들어진 모든 `context` 프로퍼티를 전달받습니다.

## `preact/compat` 전용 기능

`preact/compat` 는 React 코드를 Preact로 번역해주는 Preact의 호환성 레이어(**compat**ibility layer)입니다. React 사용자가 코드를 수정하지 않고 Preact를 시도해볼 수 있는 쉬운 방법입니다. 번들러 환경 설정에 [몇가지 별칭을 세팅](https://preactjs.com/guide/v10/getting-started#aliasing-react-to-preact)하면 됩니다. 

### Children API

`Children` API는 `props.children`의 값을 사용하기 위해 전문화된 메소드의 집합입니다. Preact에서는 일반적으로 불필요하며, 대신 내장 배열 메소드를 사용하기를 권장합니다. Preact에서 `props.children`은 Virtual DOM 노드나 `null`과 같은 빈값 또는 Virtual DOM node 배열입니다. 아래 두 경우는 `children`을 있는 그대로 사용하거나 리턴할 수 있기 때문에 가장 간단하고 흔한 경우입니다.

```jsx
// React:
function App(props) {
  return <Modal content={Children.only(props.children)} />
}

// Preact : props.children 바로 사용:
function App(props) {
  return <Modal content={props.children} />
}
```

컴포넌트에 전달된 children을 반복해야 하는 특수한 경우를 위해 Preact는 `toChildArray()` 메소드를 제공합니다. `toChildArray()`는 어떠한 `props.children` 값이라도 전달받고 또한 평평하고(Flatten) 정규화된 Virtual DOM 노드 배열을 리턴합니다. 

```jsx
// React
function App(props) {
  const cols = Children.count(props.children);
  return <div data-columns={cols}>{props.children}</div>
}

// Preact
function App(props) {
  const cols = toChildArray(props.children).length;
  return <div data-columns={cols}>{props.children}</div>
}
```

React와 호환되는 `Children` API는 `preact/compat`에서 제공되며 기존의 컴포넌트 라이브러리와 원활하게 통합할 수 있습니다.

### 특수한 목적의 컴포넌트

[preact/compat]는 모든 앱에서 필요하지는 않은 특수한 컴포넌트들도 포함하여 제공합니다. 

- [PureComponent](/guide/v10/switching-to-preact#purecomponent): `props`나 `state`가 변경되었을 때만 업데이트합니다.
- [memo](/guide/v10/switching-to-preact#memo): `PureComponent`와 유사하지만, 사용자 정의 비교 함수를 사용할 수 있습니다.
- [forwardRef](/guide/v10/switching-to-preact#forwardRef): 명시된 자식 컴포넌트에 `ref`를 전달할 수 있습니다.
- [Portals](/guide/v10/switching-to-preact#portals): 다른 DOM 컨테이너에 현재 트리를 계속해서 렌더링합니다.
- [Suspense](/guide/v10/switching-to-preact#suspense): **실험 단계** 트리가 준비되지 않은 경우 fallback 컨텐츠를 보여줍니다.
- [lazy](/guide/v10/switching-to-preact#suspense): **실험 단계** 비동기 코드를 느리게(Lazy) 로드하고 트리를 준비됨/준비되지 않음 상태로 표시합니다.

[Project Goals]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[preact/compat]: /guide/v10/switching-to-preact
[GlobalEventHandlers]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
