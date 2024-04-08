---
layout: home
title: Preact
description: 'Fast 3kB alternative to React with the same modern API.'
---

<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text="true" inverted="true">Preact</logo>
    </h1>
    <p class="tagline">Fast 3kB alternative to React with the same modern API</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">시작하기</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Preact로 전환하기</a>
    </p>
</jumbotron>

```jsx
function Counter() {
  const [value, setValue] = useState(0);

  return (
    <>
      <div>Counter: {value}</div>
      <button onClick={() => setValue(value + 1)}>Increment</button>
      <button onClick={() => setValue(value - 1)}>Decrement</button>
    </>
  )
}
```

<section class="sponsors">
  <p>Proudly <a href="https://opencollective.com/preact">sponsored by:</a></p>
  <sponsors></sponsors>
</section>

<section class="home-top">
    <h2>다른 종류의 라이브러리</h2>
</section>

<section class="home-section">
  <img src="/home/metal.svg" alt="metal" loading="lazy" width="54" height="54">

  <div>
    <h3>DOM에 더 가까이</h3>
    <p>
    Preact는 DOM 위에 가능한 가장 얇은 가상 DOM 추상화를 제공합니다. 안정적인 플랫폼 기능을 기반으로 하며 실제 이벤트 핸들러를 등록할 수 있고, 다른 라이브러리들과 잘 어울립니다.
    </p>
    <p>
     Preact는 변환 단계 없이 브라우저에서 직접 사용할 수 있습니다.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/home/size.svg" alt="size" loading="lazy" width="54" height="54">

  <div>
    <h3>작은 크기</h3>
    <p>
      대부분의 UI 프레임워크는 프레임워크 자체의 JavaScript 크기가 애플리케이션의 대부분을 차지할 만큼 매우 큽니다. Preact는 다릅니다. 프레임워크 자체의 JavaScript 크기가 아닌, <em>여러분이 작성한 코드</em> 가 애플리케이션의 가장 큰 부분을 차지할 만큼 매우 가볍습니다.
    </p>
    <p>
      즉, JavaScript를 다운로드 하거나, 구문 분석 및 실행할 시간이 줄어들어 코드에 더 많은 시간을 할애할 수 있으므로 프레임워크를 제어하기 위해 많은 리소스를 할애하지 않고도 여러분이 원하는 사용자 경험을 실현할 수 있습니다.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/home/performance.svg" alt="performance" loading="lazy" width="54" height="54">

  <div>
    <h3>놀라운 성능</h3>
    <p>
      Preact가 빠른 이유는 단순히 크기 뿐만이 아닙니다 간단하고 예측 가능한 diff 구현 덕분에 세상에서 가장 빠른 Virtual DOM 라이브러리 중 하나입니다.
    </p>
    <p>
      우리는 상태의 업데이트를 자동으로 일괄적으로 정리하여 Preact 성능을 극한까지 튜닝하고 있습니다. 우리는 브라우저 엔지니어와 긴밀히 협력하여 Preact에서 가능한 최대 성능을 얻습니다.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/home/portable.svg" alt="portable" loading="lazy" width="54" height="54">

  <div>
    <h3>휴대 가능 &amp; 삽입 가능</h3>
    <p>
      Preact의 작은 설치 공간은 강력한 Virtual DOM 구성 요소 패러다임을 다른 방법으로는 갈 수 없는 새로운 장소로 가져갈 수 있음을 의미합니다.
    </p>
    <p>
     Preact를 사용하여 복잡한 통합 없이 앱의 일부를 빌드합니다. Preact를 위젯에 포함하고 전체 앱을 빌드하는 데 사용하는 것과 동일한 도구 및 기술을 적용합니다.
    </p>
  </div>
</section>

<section class="home-section">
  <img src="/home/productive.svg" alt="productive" loading="lazy" width="54" height="54">

  <div>
    <h3>즉각적인 생산성</h3>
    <p>
     경량화는 거기에 도달하기 위해 생산성을 희생할 필요가 없을 때 훨씬 더 재미있습니다. Preact는 즉시 생산성을 높여줍니다. 몇 가지 보너스 기능도 있습니다.
    </p>
    <ul>
      <li><code>props</code>, <code>state</code> 그리고 <code>context</code> 는 <code>render()</code> 로의 전달이 가능합니다.</li>
      <li><code>class</code> 와 <code>for</code> 같은 표준 HTML 속성을 사용하십시오.</li>
    </ul>
  </div>
</section>

<section class="home-section">
  <img src="/home/compatible.svg" alt="compatible" loading="lazy" width="54" height="54">

  <div>
    <h3>생태계 호환</h3>
    <p>
      가상 DOM 구성 요소를 사용하면 버튼에서 데이터 공급자에 이르기까지 재사용 가능한 모든 것을 쉽게 공유할 수 있습니다. Preact의 디자인은 React 생태계에서 사용 가능한 수천 개의 구성 요소를 원활하게 사용할 수 있음을 의미합니다.
    </p>
    <p>
      간단한 <a href="/guide/v10/switching-to-preact#how-to-alias-preact-compat">preact/compat</a> 별칭을 번들러에 추가하면 가장 복잡한 React 구성 요소도 애플리케이션에서 사용할 수 있는 호환성 계층이 제공됩니다.
    </p>
  </div>
</section>

<section class="home-top">
    <h2>직접 확인하세요!</h2>
</section>

<section class="home-split">
    <div>
        <h3>Todo 리스트</h3>
        <pre><code class="lang-jsx">
// --repl
export default class TodoList extends Component {
    state = { todos: [], text: '' };
    setText = e =&gt; {
        this.setState({ text: e.currentTarget.value });
    };
    addTodo = () =&gt; {
        let { todos, text } = this.state;
        todos = todos.concat({ text });
        this.setState({ todos, text: '' });
    };
    render({ }, { todos, text }) {
        return (
            &lt;form onSubmit={this.addTodo} action="javascript:"&gt;
                &lt;label&gt;
                  &lt;span&gt;Add Todo&lt;/span&gt;
                  &lt;input value={text} onInput={this.setText} /&gt;
                &lt;/label&gt;
                &lt;button type="submit"&gt;Add&lt;/button&gt;
                &lt;ul&gt;
                    { todos.map( todo =&gt; (
                        &lt;li&gt;{todo.text}&lt;/li&gt;
                    )) }
                &lt;/ul&gt;
            &lt;/form&gt;
        );
    }
}
// --repl-after
render(&lt;TodoList /&gt;, document.getElementById("app"));
        </code></pre>
    </div>
    <div>
        <h3>실행 예시</h3>
        <pre repl="false"><code class="lang-jsx">
import TodoList from './todo-list';<br>
render(&lt;TodoList /&gt;, document.body);
        </code></pre>
        <div class="home-demo">
            <todo-list></todo-list>
        </div>
    </div>
</section>

<section class="home-split">
    <div>
        <h3>GitHub Star 가져오기</h3>
        <pre><code class="lang-jsx">
// --repl
export default class Stars extends Component {
    async componentDidMount() {
        let stars = await githubStars(this.props.repo);
        this.setState({ stars });
    }
    render({ repo }, { stars=0 }) {
        let url = `https://github.com/${repo}`;
        return (
            &lt;a href={url} class="stars"&gt;
                ⭐️ {stars} Stars
            &lt;/a&gt;
        );
    }
}
// --repl-after
render(&lt;Stars /&gt;, document.getElementById("app"));
        </code></pre>
    </div>
    <div>
        <h3>실행 예시</h3>
        <pre repl="false"><code class="lang-jsx">
import Stars from './stars';<br>
render(
    &lt;Stars repo="preactjs/preact" /&gt;,
    document.body
);
        </code></pre>
        <div class="home-demo">
            <github-stars simple="true" user="preactjs" repo="preact"></github-stars>
        </div>
    </div>
</section>

<section class="home-top">
    <h2>뛰어들 준비가 되셨나요?</h2>
</section>

<section style="text-align:center;">
    <p>
        React에 대한 경험이 있는지 여부에 따라 별도의 가이드가 있습니다.
        <br>
        가장 적합한 가이드를 선택하세요!
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">시작하기</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Preact로 전환하기</a>
    </p>
</section>
