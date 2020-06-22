---
name: Differences to React
permalink: '/guide/differences-to-react'
---

# React’tan Farklılıkları

Preact’ın kendisi React’ın yeniden tasarlanmış hali olmayı amaçlamamıştır. Aralarında farklılıklar vardır. Bu farklılıkların bir çoğu önemsiz ya da [preact-compat] kullanılarak tamamen kaldırılabilir. Preact-compat ise preact üzerinde bulunan, React ile %100 uyumluluğu sağlamaya çalışan bir katmandır.

Preact’ın React’ın her bir özelliğini içermemesinin nedeni, **küçük** ve **odaklanmış** kalmak istemesidir. Aksi takdirde çok karmaşık ve iyi tasarlanmış kod tabanına sahip olan React projesinde iyileştirmeler yapmak çok daha mantıklı olur.

---

<div><toc></toc></div>

---

## Sürüm Uyumluluğu

Hem Preact hem [preact-compat] için versiyon uyuyumluğu, React’ın mevcut ve önceki ana sürümlerine göre ölçülür. React takımın tarafından yeni özellikler duyurulduğu zaman, [proje hedefleri] göz önüne alınarak mantıklı bulunan özellikler Preact’ın çekirdeğine eklenir.Bu süreç, `issue` ve `pull request`'ler kullanılarak devamlı tartışma ve açıkça alınan kararlar vasıtasıyla demokratik bir şekilde yürütülür.

> Dolayısıyla, uyumluk tartışılırken ya da karşılaştırma yapılırken, web sitesi ve dokümantasyon React `0.14.x` ve `15.x`‘i baz alır.

## Neler Dahil Edilir?

*   [ES6 Class Components]
    *   _`class`'lar, state tutan olan component'leri tanımlamak için tanımlayıcı bir yol sunar_
*   [High-Order Components]
    *   bunlar _`render()`’da başka component'leri döndüren component'lerdir -- teknik olarak `wrapper` olarak adlandırabiliriz._
*   [Stateless Pure Functional Components]
    *   _bunlar `props` olarak argümanlar alıp JSX/VDOM döndüren fonksiyonlardır._
*   [Contexts]: Preact [3.0]'da `context` desteği eklenmiştir.
    *   _Context deneysel bir React özelliğidir, fakat bazı kütüphaneler tarafından benimsenmiştir._
*   [Refs]: Preact 4.0'da refs için destek gelmiştir. String referansları `preact-compat`'da desteklenir.
    *   _Referanslar, render edilmiş alt componentlere ve öğelere atıfta bulunmanın yolunu sağlar._
*   Virtual DOM Diffing
    *   _Preact’ın farkı basit fakat etkili ve **[sonderece](http://developit.github.io/js-repaint-perfs/) [hızlı](https://localvoid.github.io/uibench/)** olması._
*   `h()`, `React.createElement`’in daha geneleştirilmiş bir versiyonudur.
    *   _Bu fikir başlangıçta [hyperscript] olarak adlandırılırdı ve React ekosistemin çok ötesinde bir değere sahip. Bu nedenle Preact ilk ortaya koyulan standardı geliştiriyor. ([Oku: Neden `h()`?](http://jasonformat.com/wtf-is-jsx))_
    *   _Ayrıca biraz daha okunabilir: `h('a', { href:'/' }, h('span', null, 'Home'))`_

## Neler Eklendi?

Preact, React topluluğunun çalışmasından esinlenerek bir kaç pratik özelliği ekliyor:

*   `this.props` ve `this.state`, `render()`'a otomatik olarak yollanır.
    *   _Hala manuel olarak erişebilirsiniz. Fakat böylesi daha temiz, özellikle [destructuring] yaparken_
*   Dom güncellemelerinin toplu işlenmesi, debounced/collated using `setTimeout(1)` (can also use requestAnimationFrame)\_
*   Css sınıfları için yalnızca `class` kullanabilirsiniz. `className` hala destekleniyor fakat `class` tercih edilmeli.
*   Component and öğe geri dönüştürmesi / havuzda tutulması.

## Ne Yok?

*   [PropType] Validation: Herkes PropTypes kullanmadığı için Preact’ın çekirdeğinde yer almıyorlar.
    *   _**PropTypes tamamen desteklerni** [preact-compat]'da, yada manuel olarak kullanabilirsiniz._
*   [Children]: `props.children` _her zaman bir dize olduğu_ için Preact’da gerekli değildir.
    *   _`React.Children` [preact-compat]'da tamamen desteklenmektedir._
*   Synthetic Events: Preact'ın tarayıcı destek hedefi bu ekstra yükü gerektirmez.
    *   _Preact olayı işlemek için tarayıcın ana `addEventListener`’ını kullanır. DOM olay işleyicilerin tam listesini görmek için [GlobalEventHandlers]’a bakabilirsiniz._
    *   _Tam bir etkinlik uygulaması, daha fazla bakım, performans kaygısı ve daha büyük API anlamına gelir._

## Farklı olan nedir?

Preact ve React arasında ince farkları vardır:

*   `render()` değiştirilecek kök node olan üçün bir argümanı kabul eder, aksi takdirde ekler. Bu gelecekteki bir sürümde biraz _değişebilir_, belki de kök node incelenerek yerine getirme işleminin uygun olup olmadığı otomatik olarak tespit edilebilir.
*   Component'ler `contextTypes` veya `childContextTypes` implement etmiyor. Alt componentler, `getChildContext()` fonksiyonundan çekilen tüm `context`’leri kullanır.

[Proje Hedefleri]: /about/project-goals
[hyperscript]: https://github.com/dominictarr/hyperscript
[3.0]: https://github.com/developit/preact/milestones/3.0
[4.0]: https://github.com/developit/preact/milestones/4.0
[preact-compat]: https://github.com/developit/preact-compat
[PropType]: https://github.com/developit/proptypes
[Contexts]: https://facebook.github.io/react/docs/context.html
[Refs]: https://facebook.github.io/react/docs/more-about-refs.html
[Children]: https://facebook.github.io/react/docs/top-level-api.html#reactchildren
[GlobalEventHandlers]: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
[ES6 Class Components]: https://facebook.github.io/react/docs/reusable-components.html#es6-classes
[High-Order Components]: https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
[Stateless Pure Functional Components]: https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
[destructuring]: http://www.2ality.com/2015/01/es6-destructuring.html
[Linked State]: /guide/linked-state

