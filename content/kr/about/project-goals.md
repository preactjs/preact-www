---
name: 프로젝트 목표
permalink: '/about/project-goals'
description: "Preact의 프로젝트 목표에 대해 자세히 알아보기"
---

# Preact의 목표

## 목표

Preact는 몇 가지 주요 목표를 달성하려 합니다.

- **성능:** 빠르고 효율적인 렌더링
- **크기:** 작고 가벼움 _(약 3.5 kB 정도)_
- **효율성:** 효과적인 메모리 사용 _(GC Thrash 회피)_
- **이해성:** 코드베이스를 이해하는 데 몇 시간 이상 소요되지 않아야 함
- **호환성:** Preact는 React API와 _대부분 호환_ 되도록 하는 목표를 설정했습니다. [preact/compat]은 React와 가능한 한 많은 호환성을 달성하려고 노력합니다.

## 비목표

React의 일부 기능은 Preact에서 의도적으로 제외되었습니다. 이는 위에 나열된 주요 프로젝트 목표를 충족하면서 얻을 수 없거나 Preact의 핵심 기능 범위 내에 맞지 않기 때문입니다.

의도적으로 [React와 다른 부분](/guide/v10/differences-to-react)에 속하는 항목:

- `PropTypes`, 별도의 라이브러리로 쉽게 사용 가능
- `Children`, 원시 배열로 대체 가능
- `Synthetic Events`, Preact는 IE8과 같은 이전 브라우저의 문제를 해결하지 않음

[preact/compat]: /guide/v10/switching-to-preact
