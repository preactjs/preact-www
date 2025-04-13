---
title: 이벤트
prev: /tutorial/01-vdom
next: /tutorial/03-components
solvable: true
---

# 이벤트

이벤트는 애플리케이션을 interactive 하게 만들고, 키보드와 마우스와 같은 입력에 응답하며, 이미지 로드와 같은 변화에 대응하는 방식입니다. 이벤트는 DOM에서와 동일한 방식으로 Preact에서 작동합니다. [MDN] 에서 찾을 수 있는 모든 이벤트 유형 또는 동작은 Preact에서 사용할 수 있습니다. 예를 들어, 다음은 일반적으로  DOM API를 사용하여 이벤트 핸들러를 등록하는 방법입니다.:

```js
function clicked() {
  console.log('clicked')
}
const myButton = document.getElementById('my-button')
myButton.addEventListener('click', clicked)
```

Preact가 DOM API와 다른 점은 이벤트 핸들러가 등록되는 방식입니다.
Preact에서 이벤트 핸들러는 element 에 대한 prop 으로 선언적으로 등록됩니다
`style` 이나 `class` 처럼. 일반적으로 이름이 시작되는 prop 은
"on"을 사용하는 것은 event handler 입니다. event handler 의 prop 값은 handler 입니다.
이벤트가 발생할 때 호출합니다.

그러나 Preact는 DOM API가 이벤트 핸들러를 등록하는 방식과 달리 `style` 이나 `class` 처럼 이벤트 핸들러를 element 의 prop 으로 전달합니다.일반적으로 'on'으로 시작하는 속성은 이벤트 핸들러이며 전달된 값은 실제 이벤트 핸들러 함수입니다.

예를 들어, `onClick` prop 을 추가하고 핸들러를 불러와 이벤트를 사용할 수 있습니다.

```jsx
function clicked() {
  console.log('clicked')
}
<button onClick={clicked}>
```

이벤트 핸들러의 이름은 prop 의 이름과 동일하며 대소문자를 구분합니다.그러나 Preact는 element에 대한 표준 이벤트 유형(click, change, touchmove 등)을 등록하고 있는지 여부를 감지하고 백그라운드에서 올바른 함수를 자동으로 선택합니다. `<button onClick={..}>` 를 사용하여 소문자 `"click"` 이벤트를 사용할 수 있습니다.

---

## 시도 해보세요!

마지막으로 오른쪽의 버튼 요소에 자체적인 이벤트 핸들러를 추가해보시기 바랍니다. 함수에서 로그 정보를 출력하려면 위의 예와 같이 `console.log()` 를 사용해야 합니다.

코드가 실행되면 버튼을 눌러 함수를 호출하고 다음 페이지로 넘어가세요!

<solution>
  <h4>🎉 Congratulations!</h4>
  <p>You just learned how to handle events in Preact.</p>
</solution>


```js:setup
useRealm(function (realm) {
  var win = realm.globalThis;
  var prevConsoleLog = win.console.log;
  win.console.log = function() {
    solutionCtx.setSolved(true);
    return prevConsoleLog.apply(win.console, arguments);
  };

  return function () {
    win.console.log = prevConsoleLog;
  };
}, []);
```


```jsx:repl-initial
import { render } from "preact";

function App() {
  return (
    <div>
      <p class="count">Count:</p>
      <button>Click Me!</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

```jsx:repl-final
import { render } from "preact";

function App() {
  const clicked = () => {
    console.log('hi')
  }

  return (
    <div>
      <p class="count">Count:</p>
      <button onClick={clicked}>Click Me!</button>
    </div>
  )
}

render(<App />, document.getElementById("app"));
```

[MDN]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events
