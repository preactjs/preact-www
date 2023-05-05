---
layout: home
title: Preact
show_title: false
toc: false
description: 'جایگزین 3kb برای React با همان API مدرن'
---

<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text inverted>Preact</logo>
    </h1>
    <p class="tagline dir-rtl">جایگزین 3kb برای React با همان API مدرن</p>
    <p class="intro-buttons dir-rtl">
        <a href="/guide/v10/getting-started" class="btn primary">شروع</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">عوض کرن به Preact</a>
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

<section class="sponsors dir-rtl">
  <p>با افتخار حمایت شده <a href="https://opencollective.com/preact">توسط:</a></p>
  <sponsors></sponsors>
</section>

<section class="home-top">
    <h1>یک کتابخانه کاملا متفاوت</h1>
</section>

<section class="home-section-rtl">
  <img src="/assets/home/metal.svg" alt="metal" loading="lazy" width="54" height="54">

  <div>
    <h2>نزدیک تر به DOM</h2>
    <p>
    Preact نازک ترین انتزاع مجازی DOM ممکن را در بالای DOM ارائه می دهد.
      این برنامه بر روی ویژگی‌های پلتفرم پایدار ساخته می‌شود، کنترل‌کننده‌های event واقعی را ثبت می‌کند و به خوبی با کتابخانه‌های دیگر سازگار است.
    </p>
    <p>
      Preact را می توان مستقیماً در مرورگر بدون هیچ مرحله کامپایل کردن استفاده کرد.
    </p>
  </div>
</section>

<section class="home-section-rtl">
  <img src="/assets/home/size.svg" alt="size" loading="lazy" width="54" height="54">

  <div>
    <h2>حجم کم</h2>
    <p>
      اکثر فریم ورک‌های رابط کاربری به اندازه‌ای حجیم هستند که شامل اکثریت اندازه جاوا اسکریپت یک برنامه می شوند.
      Preact متفاوت است: به اندازه ای کوچک است که <em>کد شما</em> بزرگترین بخش برنامه هست.
    </p>
    <p>
      این یعنی جاوا اسکریپت کمتری برای دانلود، parse و execute - زمان بیشتری برای کد شما باقی می‌ماند، بنابراین می‌توانید تجربه‌ای بسازید که بدون دردسر فریم ورک را تحت کنترل داشته باشید.
    </p>
  </div>
</section>

<section class="home-section-rtl">
  <img src="/assets/home/performance.svg" alt="performance" loading="lazy" width="54" height="54">

  <div>
    <h2>عملکرد بیشتر</h2>
    <p>
      Preact سریع است و نه فقط به دلیل اندازه آن. این یکی از سریع‌ترین کتابخانه‌های DOM مجازی است که به لطف اجرای تفاوت ساده و قابل پیش‌بینی بودن..
    </p>
    <p>
    ما به‌طور خودکار به‌روزرسانی‌های Preact را منتشر و در مورد عملکرد را تا حد زیادی تنظیم می‌کنیم. ما از نزدیک با مهندسان مرورگر کار می کنیم تا حداکثر عملکرد ممکن را از Preact بدست آوریم.
    </p>
  </div>
</section>

<section class="home-section-rtl">
  <img src="/assets/home/portable.svg" alt="portable" loading="lazy" width="54" height="54">

  <div>
    <h2>قابل حمل و نشاندن</h2>
    <p>
      ردپای کوچک Preact به این معنی است که می‌توانید پارادایم قدرتمند کامپوننت های DOM مجازی را به مکان‌های جدیدی ببرید که در غیر این صورت نمی‌توانست بروید.
     </p>
    <p>
      از Preact برای ساخت بخش هایی از یک برنامه بدون یکپارچگی پیچیده استفاده کنید. Preact را در یک ویجت جاسازی کنید و از همان ابزارها و تکنیک هایی استفاده کنید که برای ساختن یک برنامه کامل استفاده می کنید.
    </p>
  </div>
</section>

<section class="home-section-rtl">
  <img src="/assets/home/productive.svg" alt="productive" loading="lazy" width="54" height="54">

  <div>
    <h2>پروداکتیو بیشتر</h2>
    <p>
      کم حجم بودن بسیار سرگرم کننده تر است وقتی که لازم نیست پروداکتیویتی را برای رسیدن به آن فدا کنید. Preact فوراً شما را ‍پروداکتیو می کند. حتی دارای چند ویژگی عالی هم است:
    </p>
    <ul>
      <li><code>props</code>, <code>state</code> و <code>context</code> به <code>()render</code> منتقل می شوند</li>
      <li>از تگ های استاندارد HTML استفاده کنید مانند: <code>class</code> و <code>for</code></li>
    </ul>
  </div>
</section>

<section class="home-section-rtl">
  <img src="/assets/home/compatible.svg" alt="compatible" loading="lazy" width="54" height="54">

  <div>
    <h2>اکوسیستم سازگار</h2>
    <p>
      کامپوننت های DOM مجازی اشتراک گذاری چیزهای قابل استفاده مجدد را آسان می کند - همه چیز از دکمه ها گرفته تا ارائه دهندگان داده(providers).
طراحی Preact به این معنی است که شما می توانید به طور یکپارچه از هزاران کامپوننت موجود در اکوسیستم React استفاده کنید.
    </p>
    <p>
      افزودن یک alias ساده <a href="/guide/v10/switching-to-preact#how-to-alias-preact-compat">preact/compat</a> به bundler یک لایه سازگاری را فراهم می‌کند که حتی اکثر کامپوننت های پیچیده React را برای استفاده در برنامه شما فعال می‌کند.
    </p>
  </div>
</section>

<section class="home-top-rtl">
    <h1>امتحان کنید و ببینید!</h1>
</section>

<section class="home-split">
    <div>
        <h2>Todo List</h2>
        <pre><code class="lang-jsx">
export default class TodoList extends Component {
    state = { todos: [], text: '' };
    setText = e =&gt; {
        this.setState({ text: e.target.value });
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
        </code></pre>
    </div>
    <div>
        <h2>نمونه زنده</h2>
        <pre repl="false"><code class="lang-jsx">
import TodoList from './todo-list';

render(&lt;TodoList /&gt;, document.body);
        </code></pre>
        <div class="home-demo">
            <todo-list></todo-list>
        </div>
    </div>
</section>

<section class="home-split">
    <div>
        <h2>Fetch GitHub Stars</h2>
        <pre><code class="lang-jsx">
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
        </code></pre>
    </div>
    <div>
        <h2>نمونه زنده</h2>
        <pre repl="false"><code class="lang-jsx">
import Stars from './stars';

render(
    &lt;Stars repo="preactjs/preact" /&gt;,
    document.body
);
        </code></pre>
        <div class="home-demo">
            <github-stars simple user="preactjs" repo="preact"></github-stars>
        </div>
    </div>
</section>

<section class="home-top">
    <h1>آماده اید که شروع کنید؟</h1>
</section>

<section style="text-align:center;" class="dir-rtl">
    <p>
        ما برای افرادی که تجربه ای با React دارند یا نه راهنما های متفاوتی داریم.
        <br>
        راهنمایی که مناسب خودت هست رو انتخاب کن!
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">شروع</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">عوض کردن به Preact</a>
    </p>
</section>
