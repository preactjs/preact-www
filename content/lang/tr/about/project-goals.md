---
name: Proje Amaçları
permalink: '/about/project-goals'
---

# Preact'in Amaçları

## Amaçlar

Preact birkaç temel hedefe ulaşmayı hedefliyor:

- **Performans:** Çabuk & verimli Render
- **Boyut:** Küçük boyut, hafif _(yaklaşık 3.5kb)_
- **Verim:** Etkili bellek kullanımı _(recycling, avoiding GC thrash)_
- **Anlaşılabilirlik:** Codebase'i anlaması birkaç saatten fazla süre almamalı
- **Uyumluluk:** Preact, React API ile _büyük ölçüde uyumlu_ olmayı hedefliyor. [preact-compat] React ile olabildiğince uyumluluk elde etmeye çalışıyor.

## Proje Kapsamı Dışındaki unsurlar

Bazı React özellikleri kasıtlı olarak ihmal edilmiştir çünkü bu özellikler yukarıda listelenen proje
amaçlarını karşılamıyor ya da Preact'in core işlev setine uymuyor.

- [Farklı olan nedir?](/guide/differences-to-react#whats-missing) başlığındaki kısıtlı ögeler:
    - PropTypes, ayrı bir kütüphane olarak kolayca kullanılabilir
    - Children (alt component'ler), Preact children component'lere Array muamelesi yapıyor
    - Synthetic Events, Preact IE8 gibi eski tarayıcılardaki sorunları patch'lemeye çalışmıyor

[preact-compat]: https://github.com/developit/preact-compat/
