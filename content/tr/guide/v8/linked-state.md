---
name: Linked State
permalink: '/guide/linked-state'
---

# Linked State

State değişikliklerini optimize etmede, React’tan biraz daha kolaylık sağlar. React kodunda ES2015 de populer olan Arrow fonksiyolarını `render()` methodu içinde event’lere yanıt olarak state güncellemek için kullanır. Her bir render’a ait scope içinde fonksiyonların oluşturulması verimsizdir ve garbage collector’lara gereğinden fazla iş yapmaya zorlar.

---

<div><toc></toc></div>

---

## Güzel Manuel Yöntem

Tek çözüm, ES7 class özelliklerinin kullanan bağlı component methodlarını bildirmektir. ([class instance fields](https://github.com/jeffmo/es-class-fields-and-static-properties)):

```js
class Foo extends Component {
	updateText = e => {
		this.setState({ text: e.target.value });
	};
	render({ }, { text }) {
		return <input value={text} onInput={this.updateText} />;
	}
}
```

Çok daha iyi çalışma performansı sağlarken, state kullanıcı arayüzüne enjecte etmek için gereksiz bir koddur.

>Bir diğer çözüm, ES7 dekaratörü kullanarak  component methodlarını _bildirimli_ olarak bind etmesidir. [decko's](http://git.io/decko) `@bind` gibi:


## Linked State'i Kurtarmak İçin

Neyse ki, preact’ın [`linkState`](https://github.com/developit/linkstate) modülü biçiminde bir çözümü vardır.

>Preact’ın önceki sürümlerinde yerleşik `linkState()` fonksiyonu sahipti. Ancak o zamandan buyana farklı modüllere ayrıldılar. Eğer eski davranışı geri yüklemek isterseniz, pollyfil’in kullanımı hakkında bilgiye [şu sayfaya](https://github.com/developit/linkstate#usage) bakabilirsin.

Calling `linkState(this, 'text')` returns a handler function that, when passed an Event, uses its associated value to update the named property in your component's state.  Multiple calls to `linkState(component, name)` with the same `component` and `name` are cached, so there is essentially no performance penalty.

**Linked State** kullanarak bir önceki örneği tekrardan yazılmışı:

```js
import linkState from 'linkstate';

class Foo extends Component {
	render({ }, { text }) {
		return <input value={text} onInput={linkState(this, 'text')} />;
	}
}
```

Bu kısa, anlaşılması kolay ve efektif. It handles linking state from any input type. An optional third argument `'path'` can be used to explicitly provide a dot-notated keypath to the new state value for more custom bindings (such as binding to a third party component's value).


## Özel Event Paths

Varsayılan olarak, `linkstate()` otomatik olarak bir event’ten uygun değeri elde etmeye çalışacaktır. Örneğin, `<input>` elementi verilen state özelleğini input type bağlı olarak `event.target.value` ya da `event.target.checked` olarak ayarlayacaktır. Özel event handlers için, sayısal değerlerin `linkstate()` tarafından oluşturulan handlers’a aktarılmasında yalnızca sayısal değerler kullanılır. Çoğu zaman bu davranış beğenilir.

Bunun istenmediği durumlar da vardır.  Özel event’ler ve gruplanmış radio butonları bu duruma verilecek iki örnektir. In these cases, a third argument can be passed to `linkState()` to specify the dot-notated key path within the event where a value can be found.

Bu özelliği anlamak için `linkState()`’in içeriğine bakmak faydalı olabilir. Aşağıda bir değerin, bir event objesi içinden bir state devam eden manuel olarak oluşturulmuş bir event handler’ı gösterir. `linkState()`’i değerli kılan belleğe alma optimizasyonunu içermese de, `linkState()`’e işlevsel olarak eşdeğerdir.

```js
// this handler returned from linkState:
handler = linkState(this, 'thing', 'foo.bar');

// ...is functionally equivalent to:
handler = event => {
  this.setState({
    thing: event.foo.bar
  });
}
```


### Örnekler ile Açıklama: Gruplanmış Radio Butonları

Aşağıda bulanan kod beklendiği gibi çalışmıyor. Kullanıcı “no”’ya tıklarsa, `noChecked` `true` olur fakat `yesChecked` `true` olarak kalır as onChange is not fired on the other radio button:

```js
import linkState from 'linkstate';

class Foo extends Component {
  render({ }, { yes, no }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={yes}
          onChange={linkState(this, 'yes')}
        />
        <input type="radio" name="demo"
          value="no" checked={no}
          onChange={linkState(this, 'no')}
        />
      </div>
    );
  }
}
```

`linkState`’tin üçün argumanı burada yardımcı olur. Önceki örneğe tekrardan bakalım, linkState’e yeni state değerini `event.target` üzerinde `value` özelliğinden almasını açıkça bildirelim:

```js
import linkState from 'linkstate';

class Foo extends Component {
  render({ }, { answer }) {
    return (
      <div>
        <input type="radio" name="demo"
          value="yes" checked={answer == 'yes'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
        <input type="radio" name="demo"
          value="no" checked={answer == 'no'}
          onChange={linkState(this, 'answer', 'target.value')}
        />
      </div>
    );
  }
}
```

Şimdi örnek açıklandığı gibi çalışıyor.
