---
name: Progressive Web Apps
permalink: '/guide/progressive-web-apps'
---

# Progressive Web Apps

## Genel Bakış

Preact, hızlı bir şekilde yüklenip etkileşimli hale gelmek isteyen [Progressive Web Apps](https://web.dev/learn/pwa/) için mükemmel bir seçimdir. [Preact CLI](https://github.com/preactjs/preact-cli/), size 100 [Lighthouse][LH] puanlı bir PWA yaratabileceğiniz bir araç sağlar.

[LH]: https://developers.google.com/web/tools/lighthouse/

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/load-less-script.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Daha az script yükler</h3>
          </div>
          <p class="_summary">Preact'in <a href="/about/project-goals">küçük boyutu</a>, kısıtlı bir yükleme performansı bütçeniz olduğunda değerlidir. Ortalama mobil donanımda, büyük JS paketlerini yüklemek, daha uzun yükleme, ayrıştırma ve değerlendirme sürelerine neden olur. Bu durum, kullanıcıların uygulamanızla etkileşim kurabilmeleri için uzun süre beklemelerine yol açabilir. Paketlerinizdeki kütüphane kodunun azalmasıyla, kullanıcılarınıza daha az kod göndererek daha hızlı yükleme sürelerine sahip olabilirsiniz. </p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/faster-tti.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>Etkileşim öncesi daha kısa süre</h3>
          </div>
          <p class="_summary">Eğer <a href="https://infrequently.org/2016/09/what-exactly-makes-something-a-progressive-web-app/">5 saniyenin altında etkileşimli olma</a>yı hedefliyorsanız, her KB önemlidir. Projelerinizde <a href="/guide/v8/switching-to-preact">React'den Preact'e geçmek</a> fazlaca KB düşüşüyle tek bir RTT'de etkileşime girmenizi sağlayabilir. Bu, her bir rota için mümkün olduğunca fazla kod kırpmaya çalışan PWAler için mükemmel bir seçenektir.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/building-block.svg);"></div>
        </div>
        <div class="list-detail">
          <div class="_title-block">
            <h3>React ekosistemi ile mükemmel çalışan bir yapı taşı</h3>
          </div>
          <p class="_summary">İster ekranda pikselleri hızlı bir şekilde almak için React'ın <a href="https://facebook.github.io/react/docs/react-dom-server.html">server-side rendering</a>ini kullanmanız gereksin, ister navigasyon için <a href="https://github.com/ReactTraining/react-router">React Router</a>ı... Preact ekosistemdeki birçok kütüphaneyle iyi çalışır.</p>
        </div>
    </li>
</ol>

## Bu site bir PWA

Aslında şu anda bulunduğunuz site bir Progressive Web App! Burada 3G ile internete bağlı Nexus 5X'inizi kullanarak 5 saniyeden daha kısa bir sürede interaktif hale gelilrsiniz:

<img src="/pwa-guide/timeline.jpg" alt="A DevTools Timeline trace of the preactjs.com site on a Nexus 5X"/>

Statik site içeriği (Servis Çalışanı) Önbellek Depolama API'sında depolanır ve tekrar eden ziyaretlerde anında yüklenebilir.

## Performans önerileri

Preact, PWA'iniz için iyi çalışması gereken bir kütüphane olsa da, bir dizi başka araç ve teknikle de kullanılabilir:

<ol class="list-view">
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/code-splitting.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://webpack.js.org/guides/code-splitting/">Code-splitting</a></strong> kodunuzu parçalara ayırarak sadece kullanıcının ihtiyacı olan parçaların aktarılmasını sağlar. Geri kalanı lazy-loading ile ihtiyaç duyulduğunda aktarmak, sayfanın yüklenme süresini hızlandırır. Webpack ile desteklenir.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/service-worker-caching.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/getting-started/primers/service-workers">Service Worker caching</a></strong> uygulamaya tekrar eden ziyaretlerde anında yüklemeyi etkinleştirerek statik ve dinamik kaynaklarınızı çevrimdışı önbelleğe almayı sağlar. Bunu <a href="https://github.com/GoogleChrome/sw-precache#wrappers-and-starter-kits">sw-precache</a> veya <a href="https://github.com/NekR/offline-plugin">offline-plugin</a> ile sağlayabilirsiniz.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/prpl.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://developers.google.com/web/fundamentals/performance/prpl-pattern/">PRPL</a></strong> varlıkları önceden tarayıcı sayfalarına aktarmaya veya ön yüklemeye teşvik eder ve sonraki sayfaların yüklenmesini hızlandırır. Kod bölme ve SW önbellekleme üzerine kurulmuştur.</p>
        </div>
    </li>
    <li class="list-item">
        <div class="list-header">
          <div class="_bubble" style="background-image: url(/pwa-guide/lighthouse.svg);"></div>
        </div>
        <div class="list-detail">
          <p class="_summary"><strong><a href="https://github.com/GoogleChrome/lighthouse/">Lighthouse</a></strong> PWAinizin performansını ve en iyi uygulamalarını denetlemenize olanak tanır, böylece uygulamanızın ne kadar iyi performans gösterdiğini bilirsiniz.</p>
        </div>
    </li>
</ol>

## Preact CLI (Komut Satırı Arayüzü)

[Preact CLI](https://github.com/preactjs/preact-cli/), Preact projeleri için resmi yapım aracıdır. Preact kodunuzu yüksek düzeyde optimize edilmiş bir PWA'e bağlayan single-dependency komut satırı araçcıdır. Yukarıdaki tavsiyelerin tümünü otomatik hale getirmeyi amaçlamaktadır. Böylece siz, mükemmel bileşenler yazmaya odaklanabilirsiniz.

İşte Preact CLI'nin yapacağı birkaç şey:

- URL rotalarınız için otomatik, sorunsuz kod bölme
- Otomatik olarak bir ServiceWorker oluşturur ve kurar
- URL'ye bağlı olarak HTTP2/Push headerları (veya meta tagleri) oluşturur
- Hızlı bir ilk görüntü için ön işlem uygular
- Gerekirse koşullu olarak polyfilller yükler

[Preact CLI](https://github.com/preactjs/preact-cli/) dahili olarak [Webpack](https://webpack.js.org) tarafından desteklendiğinden, bir `preact.config.js` tanımlayabilir ve oluşturma işlemini gereksinimlerinize göre özelleştirebilirsiniz. Bazı şeyleri özelleştirseniz bile, yine de harika varsayılan özelliklerden faydalanabilirsiniz ve yeni sürümler yayınlandıkça `preact-cli`'ı güncelleyebilirsiniz.
