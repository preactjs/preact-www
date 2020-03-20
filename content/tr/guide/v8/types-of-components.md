---
name: Types of Components
permalink: '/guide/types-of-components'
---

# Bileşen Türleri

Preact'de 2 tür bileşen vardır:

- Klasik bileşenler ile [yaşam döngüsü yöntemleri] ve durum.
- Stateless fonksiyonel bileşenler, probs kabul eden ve jsx döndüren fonksiyonlardır.

Bu iki tür bileşeni uygulamak için birkaç farklı yöntem vardır.

---

<div><toc></toc></div>

---

## Örnek

Hadi Bir örnek yapalım: Basit bir `<Link>` bileşeni bir HTML `<a> ` elemanı yaratır:

```js
class Link extends Component {
	render(props, state) {
		return <a href={props.href}>{ props.children }</a>;
	}
}
```

Bu bileşeni aşağıdaki gibi örneklendirelir/oluşturabiliriz.
```xml
<Link href="http://example.com">örnek link yazısı</Link>
```


### Destructure Props & State

ES6/ES2015'de `<Link>` bileşenimizi [destructuring](https://github.com/lukehoban/es6features#destructuring) kullanarak lokal değişkenlerimizi `props` lar (ilk argüman `render()`) ile eşleyersek daha da basitleştirebiliriz.
```js
class Link extends Component {
	render({ href, children }) {
		return <a {...{ href, children }} />;
	}
}
```

Eğer `<Link>` bileşeninin _tüm_ propsları kopyalayıp `<a>` elemanına vermek istersek, [spread operatörünü](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) kullanabiliriz:

```js
class Link extends Component {
	render(props) {
		return <a {...props} />;
	}
}
```


### Stateless Fonksiyonel Bileşenler

Son olarak, bu bileşenlerin bir durum tutmadığını görebiliriz - bileşenleri aynı props ile oluşturabilir ve her seferinde aynı sonucu alabiliriz.Böyle durumlarda, çoğu zaman Stateless Fonksiyonel Bileşenlerini kullanmak en iyi yoldur.Bunlar sadece propsları bir argüman olarak kabul eden ve JSX döndüren fonksiyonlardır.

```js
const Link = ({ children, ...props }) => (
	<a {...props}>{ children }</a>
);
```

> *ES2015 Not:* yukarıdaki örnekte Arrow Foksiyonunda parantezler içerisinde süslü parantezler kullandık.Çünkü parantez içerisindeki değeri otomatik olarak döndürür.Hakkında daha fazla bilgiye [buradan](https://github.com/lukehoban/es6features#arrows) ulaşabilirsiniz.
