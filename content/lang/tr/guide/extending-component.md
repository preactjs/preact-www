---
name: Extending Component
permalink: '/guide/extending-component'
---

# Extending Component

Bazı projelerde component ek işlevsellik ile extend etmek istenebilir.

Javascript'te inheritance'ın değeri hakkında farklı görüşler vardır, ancak tüm component'lerin devralındığı kendi "base class" ınızı oluşturmak isterseniz, Preact ihtiyacınızı karşılar.

Belki Flux benzeri bir mimaride store/reductor'lara otomatik bağlantı yapmak istersiniz. Belki de daha fazla `React.createClass()` gibi hissettirmesi için property-based mixin'ler eklemek isteyebilirsiniz _(not: [`@bind` decorator](https://github.com/developit/decko#bind) tercih edilir)_.

Her durumda, Preact'ın `Component` class'ını extend etmek için ES2015 class inheritance'ını kullanın:

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
    <Link href="http://example.com">Bana Tıkla</Link>,
    document.body
);
```


İmkanlar sonsuzdur. İşte, temel olmayan mixin'leri destekleyen extend edilmiş bir `Component` sınıfı:

```js
class MixedComponent extends Component {
    constructor() {
        super();
        (this.mixins || []).forEach( m => Object.assign(this, m) );
    }
}
```

---

> **Dipnot:** Inheritance'ın sizi kırılgan parent-child ilişkilerine kilitleyebileceğini belirtmek gerekir. Çoğu zaman inheritance ile yeterince çözülebilen bir programlama göreviyle karşı karşıya kaldığınızda böyle bir ilişkiyi yaratmaktan kaçının. Aynı amaca ulaşmak için daha işlevsel bir yol mutlaka vardır.