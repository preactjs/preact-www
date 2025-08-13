---
title: Preact
---


<jumbotron>
    <h1>
        <logo height="1.5em" title="Preact" text="true" inverted="true">Preact</logo>
    </h1>
    <p class="tagline">Aynı modern API ile React'e hızlı ve 3kB'lık alternatif</p>
    <p class="intro-buttons">
        <a href="/guide/v10/getting-started" class="btn primary">Başlangıç</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Preact'e Geçiş</a>
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

<div class="sponsors">
  <p><a href="https://opencollective.com/preact">Sponsorluğunda:</a></p>
  <sponsors></sponsors>
</div>

<section class="home-top">
    <h2>Başka bir tür kütüphane</h2>
</section>


<section class="home-section">
  <img src="/home/metal.svg" alt="metal" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Metal'e yakın</h3>
    <p>
        Preact, DOM'un üzerinde mümkün olabilecek en ince Sanal DOM soyutlamasını sağlar.
        Web stabil bir platform, emniyet adına sürekli yeniden icat etmeyi bırakmamızın zamanı geldi.
    </p>
    <p>
        Preact ayrıca web platformunun birinci sınıf bir vatandaşıdır.
        Sanal DOM'u, DOM'un kendisine karşı ayrıştırır, gerçek olay işleyicilerini kaydeder ve diğer kütüphanelerle düzgün çalışır.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/size.svg" alt="boyut" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Küçük Boyutlu</h3>
    <p>
        Çoğu UI framework'ü, uygulamanın Javascript boyutunun çoğunluğunu oluşturacak kadar büyüktür.
        Preact ise farklı: <em>sizin kodunuz</em> uygulamanın çoğunluğunu oluşturacak kadar büyük kalır.
    </p>
    <p>
        Bu, indirilecek, ayrıştırılacak ve çalıştırılacak daha az Javascript manasına geliyor - sizin kodunuza daha fazla zaman bırakıyor, böylece framework'ü kontrol altında tutmak için dövüşmeden bir deneyim inşa edebilirsiniz.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/performance.svg" alt="performans" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Büyük Performans</h3>
    <p>
        Preact hızlıdır, fakat sadece boyutu yüzünden değil.
        Basit ve öngörülebilir fark algoritması sayesinde en hızlı Sanal DOM kütüphanelerine sahipdir.
    </p>
    <p>
        Özelleştirilebilir toplu güncelleme, isteğe bağlı asenkron render, DOM geri dönüşümü ve optimize edilmiş olay işleyicisi gibi ekstra performans özellikleri bile içeriyor.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/portable.svg" alt="taşınabilir" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Taşınabilir &amp; Gömülebilir</h3>
    <p>
        Preact'in küçük boyutlu kod tabanı, güçlü bir Sanal DOM Bileşeni paradigmasını alıp erişilmez denizlere yelken açabileceğiniz manasına gelir.
    </p>
    <p>
        Karmaşık entegrasyon adımları olmadan bir uygulamanın parçalarını geliştirmek için Preact kullanın.
        Preact'i bir widget'ın içine yerleştirin ve tam bir uygulama geliştirmek için kullandığınız araçları ve teknikleri uygulayın.
    </p>
  </div>
</section>


<section class="home-section">
  <img src="/home/productive.svg" alt="üretken" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Anlık Üretkenlik</h3>
    <p>
        Hafiflik, üretkenlikten feda ederek oraya ulaşmak zorunda kalmadığınızda daha çok eğlencelidir.
        Preact sizi anlık üretken yapar.
        Hatta birkaç bonus özellik de var:
    </p>
    <ul>
        <li>`props`, `state` ve `context` zaten `render()`'a paslanmış durumda. </li>
        <li>`class` ve `for` gibi standart HTML attribute'larını kullanabilirsiniz.</li>
    </ul>
  </div>
</section>


<section class="home-section">
  <img src="/home/compatible.svg" alt="uyumlu" loading="lazy" decoding="async" width="54" height="54">

  <div>
    <h3>Ekosistem Uyumluluğu</h3>
    <p>
        Sanal DOM Component'leri, butonlardan data sağlayıcılarına kadar yeniden kullanılabilir şeyleri paylaşmayı kolaylaştırır.
        Preact'ın tasarımı, halihazırda React'ın ekosisteminde bulunan yüzlerce Component'i sorunsuz bir şekilde kullanabileceğiniz manasına gelir.
    </p>
    <p>
        Paketleyicinizde <a href="/guide/v10/switching-to-preact#how-to-alias-preact-compat">preact-compat</a>'ı eklemek, bir uyumluluk katmanı sunarak karmaşık React bileşenlerini dahi uygulamanızda kullanmanıza izin veriyor.
    </p>
  </div>
</section>


<section class="home-top">
    <h2>Örneğe gözatın!</h2>
</section>


<section class="home-split">
    <div>
        <h3>TodoList (yapılacaklar listesi) Component'i</h3>
        <pre><code class="language-jsx">
            // --repl
            import { Component, render } from "preact";
            // --repl-before
            export default class TodoList extends Component {
            	state = { todos: [], text: "" };<br>
            	setText = (e) => {
            		this.setState({ text: e.currentTarget.value });
            	};<br>
            	addTodo = () => {
            		let { todos, text } = this.state;
            		todos = todos.concat({ text });
            		this.setState({ todos, text: "" });
            	};<br>
            	render({}, { todos, text }) {
            		return (
            			<form onSubmit={this.addTodo} action="javascript:">
            				<label>
            					<span>Add Todo</span>
            					<input value={text} onInput={this.setText} />
            				</label>
            				<button type="submit">Add</button>
            				<ul>
            					{todos.map((todo) => (
            						<li>{todo.text}</li>
            					))}
            				</ul>
            			</form>
            		);
            	}
            }
            // --repl-after
            render(<TodoList />, document.getElementById("app"));
        </code></pre>
    </div>
    <div>
        <h3>Çalışan Örnek</h3>
        <pre repl="false"><code class="language-jsx">
            import TodoList from './todo-list';<br>
            render(<TodoList />, document.body);
        </code></pre>
        <div class="home-demo">
            <todo-list></todo-list>
        </div>
    </div>
</section>


<section class="home-split">
    <div>
        <h3>Github Yıldız Sayısını Çekmek</h3>
        <pre><code class="language-jsx">
            // --repl
            import { render } from "preact";
            import { useState, useEffect } from "preact/hooks";
            // --repl-before
            const compare = (a, b) =>
            	(a.stargazers_count < b.stargazers_count ? 1 : -1);<br>
            export default function GitHubRepos({ org }) {
            	const [items, setItems] = useState([]);<br>
            	useEffect(() => {
            		fetch(`https://api.github.com/orgs/${org}/repos?per_page=50`)
            			.then((res) => res.json())
            			.then((repos) =>
            				setItems(repos.sort(compare).slice(0, 5))
            			);
            	}, []);<br>
            	return (
            		<div>
            			<h1 class="repo-list-header">
            				Preact Repositories
            			</h1>
            			<div>
            				{items.map((result) => (
            					<Result {...result} />
            				))}
            			</div>
            		</div>
            	);
            }<br>
            function Result(result) {
            	return (
            		<div class="repo-list-item">
            			<div>
            				<a
            					href={result.html_url}
            					target="_blank"
            					rel="noopener noreferrer"
            				>
            					{result.full_name}
            				</a>
            				{" - "}
            				<strong>
            					⭐️{result.stargazers_count.toLocaleString()}
            				</strong>
            			</div>
            			<p>{result.description}</p>
            		</div>
            	);
            }
            // --repl-after
            render(<GitHubRepos org="preactjs" />, document.getElementById("app"));
        </code></pre>
    </div>
    <div>
        <h3>Çalışan Örnek</h3>
        <pre repl="false"><code class="language-jsx">
            import GitHubRepos from './github-repos';<br>
            render(
                <GitHubRepos org="preactjs" />,
                document.body
            );
        </code></pre>
        <div class="home-demo">
            <github-repos org="preactjs"></github-repos>
        </div>
    </div>
</section>


<section class="home-top">
    <h2>Kolları sıvamaya hazır mısın?</h2>
</section>


<section style="text-align:center;">
    <p>
        React ile ilgili deneyime sahip olup olmadığınıza dayalı olarak farklı kılavuzlarımız var.
        <br>
        Size uygun olan kılavuzu seçin!
    </p>
    <p>
        <a href="/guide/v10/getting-started" class="btn primary">Başlangıç</a>
        <a href="/guide/v10/switching-to-preact" class="btn secondary">Preact'e Geçiş</a>
    </p>
</section>
