---
layout: home
title: Preact | الرئيسية
show_title: false
toc: false
---


<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text>Preact</logo>
    </h1>

    <p>بديل سريع لمكتبة React بخصائص برمجية مطابقة تماماً و حجم ٣ كيلوبايت فقط</p>

    <p>
        <a href="/guide/getting-started" class="home-button">ابدأ هنا</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">التحويل إلى Preact</a>
    </p>
    <p>
        <github-stars user="developit" repo="preact">5,000+</github-stars>
    </p>
</jumbotron>


<section class="home-top">
    <h1>إنها مكتبة من نوع مختلف</h1>
</section>


<section class="home-section">
    <img src="/assets/home/metal.svg" alt="metal">

    <h2>أقرب إلى المعدن الأساسي</h2>
    <p>
        تزوّد Preact أسرع و أرق طبقة مجرّدة من Virtual DOM فوق DOM.
تقنيات الويب مستقرّة بما يكفي, و حان الوقت للتوقف عن أعادة بناء خصائص مستقرة في المتصفحات أساساً تحت مسمّى الأمان.
    </p>

    <p>
        Preact هي صنف أوّل مشتق من منصّة الويب. تقارن الاختلاف بين Virtual DOM و الـ DOM التقليدي نفسه, تسجل جميع الـ events و تعمل بشكل جيد جداً في حال كنت تستخدم أية مكاتب أخرى
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/size.svg" alt="size">

    <h2>حجم صغير جداً</h2>
    
    <p>
        معظم المكاتب المستخدمة لبناء صفحات الويب حجمها كبير إلى حد يجعلها الجزء الأكبر من تطبيقك.
على عكس الآخرين, Preact صغيرة جداً حتى أنها الجزء الأصغر من تطبيقك و أكوادك الخاصة هي الجزء الكبير.
    </p>
    
    <p>
        هذا كله يعني, وقت أقل لتحميل الجافاسكريبت الخاصة بتطبيق الويب خاصتك و وقت أقل أيضاً لتحويله و تشغيله - معطية حيزاً و وقت أكثر للأكواد البرمجية خاصتك, فعملياً بإمكانك بناء ما ترغب به من دون التفكير في كيفية محاربة الحجم الكبير للمكاتب المستخدمة.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/performance.svg" alt="performance">

    <h2>أداء عظيم</h2>
    
    <p>
        Preact سريعة جداً, ليس فقط لأنها صغيرة الحجم. إنها واحدة من أسرع مكاتب الـ Virtual DOM, الشكر كله لخوارزمية إيجاد الفرق بين DOM و virtual DOM الدقيقة و البسيطة.
    </p>
    
    <p>
        كما و أن هذه المكتبة تتضمن خصائص سرعة و أداء إضافية مثل تجميع التحديثات, توليد العناصر بشكل غير متزامن, إعادة تكرير DOM بالاضافة إلى تحسين أداء تحمّل الـ events أو الأحداث البرمجية عن طريق ربط حالة خصائص العنصر البرمجي الواحد و يسمى مفهوم  [Linked State](/guide/linked-state).
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/portable.svg" alt="portable">

    <h2>محمولة و يكمن تضمينها</h2>
    
    <p>
        Preact صغيرة جداً و هذا يخولك من أخذ مكونات الـ Virtual DOM التي صنعتها إلى أماكن و صفحات لن تستطيع بسهولة أخذها باستخدام مكاتب أخرى.
    </p>
    
    <p>
        استخدم Preact لصناعة أجزاء من صفحات الويب و توصيل المكون أو الجزء خاصتك بالصفحة الأم خالي من الصعوبة والتعقيد.
اصنع قطعة من الواجهة و استخدم جميع المعدات و الإضافات التي كنت لتستخدم لو أنك بدأت صناعة موقع كامل باستخدام Preact.
    </p>
</section>


<section class="home-section">
    <img src="/assets/home/productive.svg" alt="productive">

    <h2>إنتاج سريع بشكل فوري</h2>
    
    <p>
        صغر الحجم يعطي كثيراً من المرح عندما يخلو من التعقيد وبالتالي لن يؤثر على إنتاجيّتك.
Preact تضمن لك أن تكون منج بعملك فوراً, كما و توفر لك الخصائص التالية.
    </p>
    
    <ul>
        <li>نمرر لك `props`, `state` and `context` إلى `render()`</li>
        <li>استخدم سمات من لغة HTML بشكل طبيعي مثل `for` & `class`</li>
        <li>تعمل بشكل تلقائي مع React DevTools</li>
    </ul>
</section>


<section class="home-section">
    <img src="/assets/home/compatible.svg" alt="compatible">

    <h2>Ecosystem Compatible</h2>
    
    <p>
        Virtual DOM Components make it easy to share reusable things - everything from buttons to data providers.
        Preact's design means you can seamlessly use thousands of Components available in the React ecosystem.
    </p>
    
    <p>
        Adding a simple <a href="/guide/switching-to-preact#how-to-alias-preact-compat">preact-compat</a> alias to your bundler provides a compatibility layer
        that enables even the most complex React components to be used in your application.
    </p>
</section>


<section class="home-top">
    <h1>See it in action.</h1>
</section>


<section class="home-split">
    <div>
        <h2>Todo List Component</h2>
        <pre><code class="lang-js">
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
                &lt;input value={text} onInput={this.setText} /&gt;
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
        <h2>Running Example</h2>
        <pre repl="false"><code class="lang-js">
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
        <h2>Fetch Github Stars</h2>
        <pre><code class="lang-js">
export default class Stars extends Component {
    async componentDidMount() {
        let stars = await githubStars(this.props.repo);
        this.setState({ stars });
    }
    render({ repo }, { stars=0 }) {
        let url = \`//github.com/${repo}\`;
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
        <h2>Running Example</h2>
        
        <pre repl="false"><code class="lang-js">
import Stars from './stars';

render(
    &lt;Stars repo="developit/preact" /&gt;,
    document.body
);
        </code></pre>
       
        <div class="home-demo">
            <github-stars simple user="developit" repo="preact"></github-stars>
        </div>
    </div>
</section>


<section class="home-top">
    <h1>Ready to dive in?</h1>
</section>


<section style="text-align:center;">
    <p>
        We've got separate guides based on whether you have experience with React.
        <br>
        Pick the guide that works best for you!
    </p>
    <p>
        <a href="/guide/getting-started" class="home-button">Get Started</a>
        <span class="home-button-sep">&nbsp; • &nbsp;</span>
        <a href="/guide/switching-to-preact" class="home-button">Switch to Preact</a>
    </p>
</section>
