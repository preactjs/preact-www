---
name: プロジェクトの目的
permalink: '/about/project-goals'
description: "Preactプロジェクトの目的について詳しく知る"
---

# Preactの目的

## 目的

Preactは以下の目的を達成することを目指しています。

- **パフォーマンス** 高速で効率的なレンダリング
- **サイズ** 軽量で小さいサイズ _(約3.5kB)_
- **効率** 効率的なメモリの使用法 _(GCスラッシングの回避)_
- **分かりやすさ** 数時間以内にコードベースを理解することができる
- **互換性** PreactはReact APIとほとんど互換性があることを目指します。 [preact/compat]は可能な限りReactとの互換性を実現しようとしています。

## 目的に含まれない物

Reactの機能の一部は意図的にPreactでは提供されていません。
なぜなら、上記のプロジェクトの目的を達成する上で障害となる機能やPreactのコア機能の範囲に収まらないからです。

意図的な[Reactとの違い](/guide/v10/differences-to-react):
- `PropTypes`は、外部のライブラリを使用できるので、本体にはいれていません。
- `Children`は標準のArrayに置き換えることができます。
- `Synthetic Events`はPreactがIE8のような古いブラウザに対応しないのでサポートされません。

[preact/compat]: /guide/v10/switching-to-preact
