# bssm-oss opensource page

`bssm-oss` GitHub organization을 소개하는 프론트엔드 랜딩과 `AI Mode` / `Code Mode` 셸 페이지 저장소다.

현재는 백엔드 없이 동작하는 정적 프론트엔드 v1이며, 조직 소개와 미래 편집 경험의 방향을 먼저 보여주는 단계다.

## What this project includes

- `bssm-oss` organization 소개 랜딩
- 공개 저장소 스냅샷 기반 대표 프로젝트 섹션
- `AI Mode` 셸 페이지
- `Code Mode` 셸 페이지
- 실험적 OSS 랩 톤의 디자인 시스템 초안

## Current routes

- `/`
  organization 소개 랜딩
- `/ai`
  자연어 수정 흐름을 설명하는 AI Mode 셸
- `/code`
  코드 직접 수정 흐름을 설명하는 Code Mode 셸

## Stack

- React 19
- Vite
- TypeScript
- React Router
- Vitest + Testing Library

## Quick start

```bash
pnpm install
pnpm dev
```

브라우저에서 Vite 개발 서버 주소를 열면 된다.

## Validation

```bash
pnpm build
pnpm test
pnpm lint
```

`npm run build`, `npm run test`, `npm run lint`도 동작한다.  
다만 의존성 설치는 로컬 npm 버전 이슈 때문에 `pnpm install`을 기준으로 둔다.

## Project structure

```text
.
├── docs/
│   ├── overview.md
│   ├── content-snapshot.md
│   ├── mode-roadmap.md
│   └── development.md
├── src/
│   ├── components/
│   ├── data/
│   ├── routes/
│   ├── test/
│   ├── App.tsx
│   ├── App.test.tsx
│   └── index.css
└── .interface-design/system.md
```

## Data source

초기 콘텐츠는 아래 공개 정보를 기준으로 `2026-03-26` 스냅샷을 정적으로 반영했다.

- https://github.com/bssm-oss
- https://api.github.com/orgs/bssm-oss
- https://api.github.com/orgs/bssm-oss/repos?per_page=100

조직 설명이나 저장소 설명이 비어 있는 경우에는 랜딩 목적에 맞는 보조 설명을 수동으로 보강했다.

## Documentation

- [docs/overview.md](docs/overview.md)
  앱 목적, 라우트, 구조 요약
- [docs/content-snapshot.md](docs/content-snapshot.md)
  organization 스냅샷 기준과 대표 프로젝트 선정 기준
- [docs/mode-roadmap.md](docs/mode-roadmap.md)
  `AI Mode` / `Code Mode`의 현재 상태와 다음 단계
- [docs/development.md](docs/development.md)
  설치, 실행, 검증, 문서 수정 체크리스트
- [.interface-design/system.md](.interface-design/system.md)
  디자인 방향과 핵심 토큰 결정

## Scope notes

현재 구현 범위 밖의 항목:

- 백엔드
- 실시간 GitHub 동기화
- 실제 AI agent 실행
- 코드 편집기와 파일 직접 반영
- PR 없이 수정하는 런타임

즉, 지금은 “소개 랜딩 + 편집 모드 셸” 단계이고, 직접 수정 경험은 다음 단계 과제다.
