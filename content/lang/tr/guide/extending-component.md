---
name: Extending Component
permalink: '/guide/extending-component'
---

# Bileşen Genişletme

Bazı projelerde bileşeni ek işlevsellik ile genişletmek istenebilir.

Javascript'te mirasın değeri hakkında farklı görüşler vardır, ancak tüm bileşenlerin devralındığı kendi "temel sınıfınızı" oluşturmak isterseniz, Preact ihtiyacınızı karşılar.

Belki Flux benzeri bir mimaride store/reductor'lara otomatik bağlantı yapmak istersiniz. Belki de daha fazla `React.createClass()` gibi hissettirmesi için özellik-bazlı karışımlar eklemek isteyebilirsiniz _(not: [`@bind` dekoratörü](https://github.com/developit/decko#bind) tercih edilir)_.

Her durumda, Preact'ın `Bileşen` sınıfını genişletmek için ES2015 sınıf mirasını kullanın:

```js
class BoundComponent extends Component {
    // example: get bound methods
    binds() {
        let list = this.bind || [],
            binds = this._binds;
        if (!binds) {
            binds = this._binds = {};
            for (let i=list.length; i--; ) {
                binds[list[i]] = this[list[i]].bind(this);
            }
        }
        return binds;
    }
}
```

Örnek Kullanım:

```js
class Link extends BoundComponent {
    bind = ['click'];
    click() {
        open(this.props.href);
    }
    render({ children }) {
        let { click } = this.binds();
        return <span onClick={ click }>{ children }</span>;
    }
}

render(
    <Link href="http://example.com">Click Me</Link>,
    document.body
);
```


İmkanlar sonsuzdur. İşte, temel olmayan karışımları destekleyen genişletilmiş bir `Bileşen` sınıfı:

```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---

> **Dipnot:** Mirasın sizi kırılgan ebeveyn-çocuk ilişkilerine kilitleyebileceğini belirtmek gerekir. Çoğu zaman kalıtımla yeterince çözülebilen bir programlama göreviyle karşı karşıya kaldığınızda böyle bir ilişkiyi yaratmaktan kaçının. Aynı amaca ulaşmak için daha işlevsel bir yol mutlaka vardır.