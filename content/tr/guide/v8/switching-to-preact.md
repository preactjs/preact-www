---
name: Switching to Preact from React
permalink: '/guide/switching-to-preact'
---

# React'tan Preact'a geçiş

Preact'tan React'a geçişte iki türlü yaklaşım vardır:

1. `preact-compat` alias'ını yüklemek
2. import react kodunu preact a çevirmek ve uyumsuz kodları silmek

---

<div><toc></toc></div>

---

## Kolay olanı: `preact-compat`

Preact'a geçmek `preact-compat` i `react` ve `react-dom` için kısayol (alias) olarak göstermek kadar kolaydır.
Bu sizin çalışma şeklinizde ve ya projenizdeki kodlarda hiçbir değişiklik yapmadan React/ReactDOM kodu yazmaya devam etmenize olanak tanır.
preact-compat projenizde yaklaşık olarak 2 kb yük getirirken aynı zamanda npm üzerinden bulabileceğiniz birçok React modülünü kullanabilmenizi sağlar.
Tek bir modülün içerisinde Preact'ı `react` ve `react-dom` gibi çalışmasına yetecek şekilde ihtiyacınız olan tüm ayarlar...

Yükleme iki adımdan oluşur.
Öncelikle preact ve preact-compat'i indirmelisiniz (ikisi farklı paketlerdir):

```sh
npm i -S preact preact-compat
```

Bu gereksinimleri yükledikten sonra, build konfigürasyonunuzu React import dosyalarına alias olacak şekilde yapmalısınız ki Preact'a işaret edebilsin.

### preact-compat için Alias Oluşturmak

Şimdi gereken kütüphaneler/gereksinimler yüklendiğine göre, build sistem konfigürasyonunuzu `react` ve ya `react-dom` import eden ve çalışması için gereken tüm dosyaları `preact-compat` a yönlendirmelisiniz.

#### Webpack ile Alias Oluşturmak

Sadece aşağıdaki konfigürasyonu `webpack.config.js` dosyanıza ekleyin [resolve.alias](https://webpack.github.io/docs/configuration.html#resolve-alias)

```json
{
  "resolve": {
    "alias": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### Browserify ile Alias Oluşturmak

Eğer Browserify kullanıyorsanız, [aliasify](https://www.npmjs.com/package/aliasify) değişimini ekleyerek alias tanımlayabilirsiniz.

Önce, değişim paketini yükleyiniz: `npm i -D aliasify`

Sonra, `package.json` dosyanızda aliasfy'ı react import dosyalarını preact'a yönlendiriniz.

```json
{
  "aliasify": {
    "aliases": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  }
}
```

#### Manuel Olarak Alias Oluşturmak

Eğer bir build sistemi kullanmıyorsanız ve ya kalıcı olarak `preact-compat` e geçmek istiyorsanız, projenizdeki tüm import ve require'ları bulup değiştirerek alias'ın üstenlendiği görevi kendiniz de yapabilirsiniz:

> **bul:** `(['"])react(-dom)?\1`
>
> **yerine-koy** `$1preact-compat$1`

Bu durumda, direkt olarak `preact`'a geçmek, `preact-compat`'e bağlı geçişten daha zorlayıcı olabilir.

Preact'ın core kısmı olukça gelişmiştir ve pek çok React projesi az bir uğraşla `preact`'a geçirilebilir.
Bu yaklaşımı sonraki bölümde göreceksiniz.

#### Module-alias kullanarak Node içerisinde Alias oluşturmak

SSR için, eğer sunucu taraflı projenizde webpack gibi bir bundler kullanmıyorsanız, [module-alias](https://www.npmjs.com/package/module-alias) kullanarak react'ı preact ile değiştirebilirsiniz.

```sh
npm i -S module-alias
```

`patchPreact.js`:
```js
var path = require('path')
var moduleAlias = require('module-alias')

moduleAlias.addAliases({
  'react': 'preact-compat/dist/preact-compat.min',
  'react-dom': 'preact-compat/dist/preact-compat.min',
  'create-react-class': path.resolve(__dirname, './create-preact-class')
})
```

`create-preact-class.js`:
```js
import { createClass } from 'preact-compat/dist/preact-compat.min'
export default createClass
```
Eğer sunucu tarafında yeni `import` söz dizimini Babel ile kullanıyorsanız, bu satırları diğer import ettiklerinizin üstüne koymak işe yaramayacaktır, çünkü Babel tüm import edilen dosyaları modülün en tepesine taşır. Bu durumda yukarıdaki kodu `patchPreact.js` olarak kaydedin, sonrasında kodunuzun ilk satırında import edin (`import './patchPreact'`). module-alias hakkında daha fazla bilgi için [burayı](https://www.npmjs.com/package/module-alias) ziyaret edin.

`module-alias` kullanmadan da node içerisinde alias oluşturmak mümkün. Bu Node'un modül sisteminin özelliklerinin üzerine kuruludur, o yüzden dikkatli olmanız gerekir. Manüel olarak alias oluşturmak:

```js
// patchPreact.js
var React = require('react')
var ReactDOM = require('react-dom')
var ReactDOMServer = require('react-dom/server')
var CreateReactClass = require('create-react-class')
var Preact = require('preact-compat/dist/preact-compat.min')
var Module = module.constructor
Module._cache[require.resolve('react')].exports = Preact
Module._cache[require.resolve('react-dom')].exports = Preact
Module._cache[require.resolve('create-react-class')].exports.default = Preact.createClass
```

### Build & Test

**İşlem tamam!**
Build edilen projeyi çalıştırdığınızda, tüm React importlarınız aslında `preact-compat` import edecek ve proje boyutunuz oldukça düşecektir.
Testlerinizi yapmak ve uygulamanızı açıp nasıl çalıştığına bakmak daima iyi bir alışkanlıktır.


---


## En ideali: Preact'a Geçiş

React'tan Preact'a geçmek için `preact-compat`'i projenizde kullanmak zorunda değilsiniz.
Preact'ın API'ı neredeyse React'ınki ile aynıdır, ve birçok React kodları ya ufak değişikliler ile ya da ona bile gerek kalmadan geçirilebilir.

Genelde, Preact'a geçiş birkaç adımdan oluşur.

### 1. Preact'ı Yükleme

Oldukça basit, kütüphaneyi kullanabilmeniz için yüklemeniz gerekir!

```sh
npm install --save preact  # ya da: npm i -S preact
```

### 2. JSX Pragması: `h()`'e transpile etmek

> **Hikayenin tamamı:** JSX dil uzantısı React'tan bağımsız olsa da, [Babel] ve [Bublé] gibi popüler transpiler'lar `React.createElement()` fonksiyonunu fonksiyonunu otomatik olarak çağırmaya çalışır.
> Bunun tarihsel nedenleri vardır, ama JSX fonksiyonları aslında önceden var olan bir teknoloji olan [hyperscript] ile mümkün olmuştur.
> Preact daha JSX'in sadeliğini ön plana çıkarmak
> ve bu teknolojiye atıfta bulunarak `h()` fonksiyonunu JSX pragması olarak kullanmayı hedefler.
>
> **Özet:** `React.createElement()` i preact'ın `h()` fonksiyonuna çevirmeniz gerekir.

JSX'te, "pragma" her bir elementi oluşturma işini üstlenen fonksiyonun adıdır.

> `<div />` temelde `h('div')` fonksiyonuna dönüşür.
>
> `<Foo />` temelde `h(Foo)` fonksiyonuna dönüşür.
>
> `<a href="/">Hello</a>` elementi `h('a', { href:'/' }, 'Hello')` şeklinde dönüşür.

Yukardaki her bir örnekte `h`, JSX pragması olarak deklare ettiğimiz fonksiyounun adıdır.

#### Babel Yoluyla

Eğer Babel kullanıyorsanız, JSX pragmasını `.babelrc` ve ya `package.json` dosylarında belirtebilirsiniz. (hangisini tercih ederseniz)


```json
{
  "plugins": [
    ["transform-react-jsx", { "pragma": "h" }]
  ]
}
```

#### Yorum Satırlarıyla

Eğer Babel'i baz alarak çalışan bir online editörde iseniz (JSFiddle veya Codepen gibi), JSX pragmasını aşağıdaki kod satırını dosyanızın ilk satırlarına koyarak belirtebilirsiniz.

`/** @jsx h */`

#### Bublé Yoluyla

[Bublé] JSX desteği ile gelir, tek yapmanız gereken `jsx` ayarıdır.

`buble({ jsx: 'h' })`

### 3. Zaman Aşımına Uğrayan Her Kodu Yenileyebilirsiniz

Her ne kadar Preact React ile API-uyumlu olmaya çalışsa da, bazı bölümler bilinçli olarak Preact'a katılmamıştır.
Bunlardan en çok dikkat çeken `createClass()` fonksiyonudur. Nesne yönelimli programla ve sınıflar hakkında fikirler arasında uçurum olsa da, anlamak gerekir ki JavaScript'te sınıflar virtual-dom kütüphaneleri içinde komponent tipini belirtmek için kullanılır, bu da komponentin yaşam döngüsündeki ince ayrıntılarda önemli rol oynar.

Eğer projeniz, büyük oranda `createClass()` fonksiyonuna bağlıysa, hala iyi bir seçeneğiniz var: Laurance Dorman [bağımsız `createClass()` kütüphanesi sağlamaktadır](https://github.com/ld0rman/preact-classless-component)
bu kütüphane direkt olarak preact ile çalışır ve yalnızca birkaç yüz byte'tan oluşmaktadır.
Buna alternatif olarak, tüm `createClass()` fonksiyon çağırmalarınızı ES sınıflarına Vu Tran tafından geliştirilen [preact-codemod](https://github.com/vutran/preact-codemod)kullanarak çevirebilirsiniz.

Bir başka dikkat etmeniz şey de, Preact'ın sadece 'Function Ref'leri destekliyor olması.
String ref'ler React içinde modası geçmiştir (deprecated) ve yakında kaldırılacaktır, çünkü ufak bir kazanım karşılığında şaşırtıcı derecede karmaşa sunarlar.
Eğer hala String ref'leri kullanmak isterseniz, [bu küçük linkedRef fonksiyonu](https://gist.github.com/developit/63e7a81a507c368f7fc0898076f64d8d) hala `this.refs.$$` kullanarak String Ref'ler gibi uzun ömürlü bir versiyon sunar.
Bu küçük kapsayıcının (wrapper) basitliği Function Ref ler aynı zamanda Function Ref lerin neden popüler olduğunu açıklamaktadır.


### 4. Kök (Root) Render'ı Basitleştirmek

React 0.13 versiyonundan beri `render()` fonksiyonu `react-dom` tarafından sağlanıyor
Preact ayrı bir modülü DOM render etmek için kullanmaz, çünkü harika bir DOM render etme üzerine odaklanmıştır.
Bu da demek oluyor ki, React'tan Preact'a geçişteki son adımınız, `ReactDOM.render()`'ı Preact'ın `render()` fonksiyonuna çevirmek:

```diff
- ReactDOM.render(<App />, document.getElementById('app'));
+ render(<App />, document.body);
```
Başka dikkat edilmesi nokta ise, Preact'ın `render()` fonksiyonu yıkıcı (destructive) bir fonksiyon değildir. Bundan dolayı, `<body>` içinde render etmek sorun arz etmez (hatta önerilir).
Bu Preact'a verdiğinizi argümanların tüm kök (root) elemanlarını kontrol ettiğini varsaymayışından dolayı mümkündür. `render()` a verilen ikinci argüman
aslında `kapsayıcı/ebeveyn` (parent) dir - demek oluyor ki _içine_ render edilmesi gereken DOM elementidir. Eğer uygulamayı kökten yeniden render etmek isterseniz, (Çalışır durumda yapılan modül değişikliği gibi / Hot Module Replacement), `render()` ikinci argümanı 3. argüman ile yer değiştirmek üzere alır.

```js
// başlangıçtaki render:
render(<App />, document.body);

// yerinde güncelleme:
render(<App />, document.body, document.body.lastElementChild);
```
Yukardaki örnekte, son elementin (3. argüman) ilk önce render edilen kökü olduğunu varsayıyoruz.
Bu çoğu durumda işe yarasa da (jsfiddles, codepens vb.), daha kontrollü olmakta fayda var.
`render()` fonksiyonunun neden kök (root) döndürdüğünü açıklar: 3. argümanı yerinde güncelleme için kullanırsınız.
Aşağıdaki örnekte Webpack'in Hot Module Replacement güncellemelerine cevap olarak nasıl yeniden render edebileceğinizi gösterir.

```js
// kök uygulamanın kök DOM elemanını tutuyor:
let root;

function init() {
  root = render(<App />, document.body, root);
}
init();

// örnek: Webpack HMR güncellemesinde re-render:
if (module.hot) module.hot.accept('./app', init);
```

Tüm tekniği [preact-boilerplate](https://github.com/developit/preact-boilerplate/blob/master/src/index.js#L6-L18) adresinden görebilirsiniz.


[babel]: https://babeljs.io
[bublé]: https://buble.surge.sh
[JSX]: https://facebook.github.io/jsx/
[JSX Pragma]: http://www.jasonformat.com/wtf-is-jsx/
[preact-boilerplate]: https://github.com/developit/preact-boilerplate
[hyperscript]: https://github.com/dominictarr/hyperscript
