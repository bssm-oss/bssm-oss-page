# Content Snapshot

## 데이터 기준

현재 랜딩에 표시되는 organization 정보는 `2026-03-26` 공개 GitHub 정보 기준의 정적 스냅샷이다.

원본 기준:

- `https://github.com/bssm-oss`
- `https://api.github.com/orgs/bssm-oss`
- `https://api.github.com/orgs/bssm-oss/repos?per_page=100`

## 스냅샷 방식

- organization 설명이 비어 있는 부분은 랜딩 목적에 맞게 보조 카피를 작성했다.
- 저장소 설명이 없는 항목은 이름과 성격을 기준으로 짧은 서술을 수동으로 채웠다.
- 대표 프로젝트와 전체 아틀라스는 같은 데이터 소스를 공유한다.

## 랜딩에서 강조하는 프로젝트

현재 `featured`로 처리한 저장소는 아래 6개다.

- `CodeAgora`
- `cotor`
- `syncingsh`
- `AdaptiveUIRuntime`
- `MorphUI`
- `better-notion2pdf`

이 조합은 organization의 현재 색을 가장 잘 보여주는 축을 기준으로 선택했다.

- AI tooling
- AI orchestration
- collaboration
- adaptive UI
- developer utility

## 카테고리 규칙

`RepoSummary.category`는 UI 설명용 분류이며 GitHub 원본 값이 아니다.

대표적으로 아래 분류를 사용한다.

- `AI tooling`
- `AI orchestration`
- `Collaboration`
- `Adaptive UI`
- `Developer utility`
- `Skill pack`
- `Knowledge tooling`
- `Sandbox`
- `Packaging`

## 다음 업데이트 시 주의점

스냅샷을 갱신할 때는 아래를 함께 맞춘다.

1. `src/data/orgSnapshot.ts`의 organization 수치
2. 대표 프로젝트 선정 기준
3. 저장소 설명 보정 문구
4. README와 관련 docs의 날짜
