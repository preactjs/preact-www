---
isim: Bileşenler
açıklamalar: 'Bileşenler, herhangi bir React uygulamasının kalbidir. Bunları nasıl oluşturacağınızı ve birlikte kullanıcı arayüzleri oluşturmak için nasıl kullanacağınızı öğrenin.'
---

# Bileşenler

Bileşenler, Preact'teki temel yapı taşını temsil eder. Küçük yapı taşlarından karmaşık kullanıcı arayüzleri oluşturmayı kolaylaştırmada temeldirler. Ayrıca, işlenmiş çıktımıza durum eklemekten de sorumludurlar.

Bu kılavızda Preact'ten bahsedeceğimiz iki tür bileşen vardır.

---

<div><toc></toc></div>

---

## Fonksiyonel Bileşenler

Fonksiyonel bileşenler, ilk argüman olarak `props` alan düz işlevlerdir.JSX'te çalışabilmeleri için işlev adının **büyük harf** ile başlaması gerekir.

```jsx
// --repl
import { render } from 'preact';

// --repl-before
function MyComponent(props) {
  return <div>My name is {props.name}.</div>;
}

// Usage
const App = <MyComponent name="John Doe" />;

// Renders: <div>My name is John Doe.</div>
render(App, document.body);
```

> Daha önceki sürümlerde bunların `"Durumsuz Bileşenler"` olarak bilindiğini unutmayın. Bu, [hook eklentisiyle](/guide/v10/hooks) artık geçerli değil.


## Sınıf Bileşenleri

Sınıf bileşenleri durum ve yaşam döngüsü yöntemlerine sahip olabilir.Örneğin bir bileşen DOM'a eklendiğinde veya yok edildiğinde çağrılacak özel yöntemdir.

Burada, geçerli saati gösteren `<Clock>` adlı basit bir sınıf bileşenimiz var:

```jsx
// --repl
import { Component, render } from 'preact';

// --repl-before
class Clock extends Component {

  constructor() {
    super();
    this.state = { time: Date.now() };
  }

  // Lifecycle: Called whenever our component is created
  componentDidMount() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  // Lifecycle: Called just before our component will be destroyed
  componentWillUnmount() {
    // stop when not renderable
    clearInterval(this.timer);
  }

  render() {
    let time = new Date(this.state.time).toLocaleTimeString();
    return <span>{time}</span>;
  }
}
// --repl-after
render(<Clock />, document.getElementById('app'));
```

### Yaşam Döngüsü Methodları

Saatin her saniye güncellenmesi için, `<Clock>` un DOM'a ne zaman uygulandığını bilmemiz gerekir. _Eğer HTML5'e özel elementleri kullandıysanız, bu `attachedCallback` ve `detachedCallback` yaşam döngüsü methodlarına benzer._ Preact, bir Bileşen için tanımlanmışsa aşağıdaki yaşam döngüsü methodlarını çağırır:

| Lifecycle method            | When it gets called                              |
|-----------------------------|--------------------------------------------------|
| `componentWillMount()`        | (kullanımdan kaldırıldı) Bileşen DOM'a uygulanmadan önce
| `componentDidMount()`         | Bileşen DOM'a uygulandıktan sonra
| `componentWillUnmount()`      | DOM'dan kaldırılmadan önce
| `componentWillReceiveProps(nextProps, nextState)` | Yeni props'lar kabul edilmeden önce _(kullanımdan kaldırıldı)_
| `getDerivedStateFromProps(nextProps)` | `shouldComponentUpdate` den hemen önce.Dikkatli kullanın.
| `shouldComponentUpdate(nextProps, nextState)` | `render()` den hemen önce. Oluşturmayı atlamak için `false` döndürün.
| `componentWillUpdate(nextProps, nextState)` |  `render()` öncesi _(kullanımdan kaldırıldı)_
| `getSnapshotBeforeUpdate(prevProps, prevState)` | `render()` den heme önce çağırılır. Dönüş değeri `componentDidUpdate` öğesine bildirilir.
| `componentDidUpdate(prevProps, prevState, snapshot)` | `render()` işleminden sonra

> Birbirleriyle nasıl ilişki kurduklarına dair bakış açısı kazanmak için bu şemaya bakın.[Bu şemaya](https://twitter.com/dan_abramov/status/981712092611989509) ya bakın.


#### componentDidCatch

Özel bir takdiri hak eden bir yaşam döngüsü yöntemi vardır, o da  `componentDidCatch` dir. Özeldir, çünkü işleme sırasında meydana gelen hataları halletmenize olanak tanır. Bu, bir yaşam döngüsü kancasında meydana gelen hataları içerir, ancak bir `fetch()` çağrısından sonra olduğu gibi, eşzamansız olarak atılan hataları hariç tutar.

Bir hata yakalandığında, bu yaşam döngüsünü herhangi bir hataya tepki vermek ve güzel bir hata mesajı veya diğer herhangi bir geri dönüş içeriği görüntülemek için kullanabiliriz.

```jsx
// --repl
import { Component, render } from 'preact';
// --repl-before
class Catcher extends Component {
  
  constructor() {
    super();
    this.state = { errored: false };
  }

  componentDidCatch(error) {
    this.setState({ errored: true });
  }

  render(props, state) {
    if (state.errored) {
      return <p>Something went badly wrong</p>;
    }
    return props.children;
  }
}
// --repl-after
render(<Catcher />, document.getElementById('app'));
```

## Fragments

Bir `Fragment`, aynı anda birden çok öğe döndürmenize olanak tanır. Her "blok" un tek bir kök öğeye sahip olması gereken JSX sınırlamasını çözerler. Bunlarla, genellikle herhangi bir ara öğenin aksi takdirde stili etkileyebileceği listeler, tablolar veya CSS flexbox ile birlikte karşılaşırsınız.

```jsx
// --repl
import { Fragment, render } from 'preact';

function TodoItems() {
  return (
    <Fragment>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </Fragment>
  )
}

const App = (
  <ul>
    <TodoItems />
    <li>D</li>
  </ul>
);

render(App, container);
// Renders:
// <ul>
//   <li>A</li>
//   <li>B</li>
//   <li>C</li>
//   <li>D</li>
// </ul>
```

Çoğu modern aktarıcının `Fragments` için daha kısa bir sözdizimi kullanmanıza izin verdiğini unutmayın. Daha kısa olanı çok daha yaygındır ve genellikle karşılaşacağınızdır.

```jsx
// This:
const Foo = <Fragment>foo</Fragment>;
// ...is the same as this:
const Bar = <>foo</>;
```

Ayrıca bileşenlerinizde dizileri de döndürebilirsiniz:

```jsx
function Columns() {
  return [
    <td>Hello</td>,
    <td>World</td>
  ];
}
```

  Anahtarları bir döngü içinde oluşturuyorsanız, `Fragments` lere anahtar eklemeyi unutmayın:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without a key, Preact has to guess which elements have
        // changed when re-rendering.
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```
