---
name: Forms
permalink: '/guide/forms'
---

# Forms

Preact'deki formlar React'deki ile aynı işi yaparlar, fakat "static" (başlangıç değeri) props/attributes için destek sağlamaz.
**[React Formları için Dokümanlar](https://facebook.github.io/react/docs/forms.html)**

---

<toc></toc>

---

## Kontrollü & Kontrolsüz Bileşenller


["Kontrollü" Bileşenler](https://facebook.github.io/react/docs/forms.html#controlled-components) ve ["Kontrolsüz" Bileşenler](https://facebook.github.io/react/docs/forms.html#uncontrolled-components) üzerine React dökümantasyonları iki yönlü veri akışı ve genellikle tek yönlü veri akışı olan bileşen-tabanlı Virtual DOM oluşturma bağlamında HTML formlarının nasıl kullanılacağı konusunda son derece yararlıdırlar.

Genellikle, her zaman _Kontrollü_ bileşenleri kullanmalısınız.Ancak bağımsız Bileşenler oluştururken veya 3.parti UI kütüphaneleri kullanırken, non-preact fonksiyonelliği için kendi bileşeninizi bir bağlama noktası olarak kullanmak daha kullanışlı ve basit olabilir.

## Checkboxe'lar & Radio Button'lar

Checkbox'lar ve radio button'lar (`<input type="checkbox|radio">`) kontrollü formlar oluştururken başlangıçta karışık gelebilir.Bunun sebebi kontrolsüz bir ortamda, tarayıcıya bir checkbox veya radio buton'u bizim için "değiştir" veya "kontrol et", gibi değişiklik olayını bizim için dinlemesi ve yeni değere tepki vermesi için izin veririz.Ancak, bu teknik kullanıcı arayüzünün state ve props değişikliklerine yanıt olarak her zaman otomatik olarak güncelleyeceği anlamına gelmez.
**Yöntem:** Diyelimki bir checkbox'in değişim olayının kullanıcı tarafından işaretlendiğini veya işaretlenmediğini dinliyoruz.Olay dinleyicimiz checkbox'dan gelen değer için `state` 'de bir yer ayırdık.Bu gereksiz bir durum, çünkü biz sadece bir değer için DOM'a sorduk ama o bizim istediğimiz değer her ne ise onu yeniden tekrar oluşturmamızı istedi.
So, instead of listening for a `change` event we should listen for a `click` event, which is fired any time the user clicks on the checkbox _or an associated `<label>`_.  Checkboxes just toggle between Boolean `true` and `false`, so clicking the checkbox or the label, we'll just invert whatever value we have in state, triggering a re-render, setting the checkbox's displayed value to the one we want.

### Checkbox Örnek

```js
class MyForm extends Component {
    toggle = e => {
        let checked = !this.state.checked;
        this.setState({ checked });
    };
    render({ }, { checked }) {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onClick={this.toggle} />
            </label>
        );
    }
}
```
