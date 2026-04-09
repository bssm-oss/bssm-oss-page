# bssm-oss opensource page

`bssm-oss` GitHub organization 소개 랜딩을 실시간 편집 캔버스로 바꾼 React 앱 저장소다.

지금 버전은 같은 랜딩 캔버스를 두고, 상단 토글로 `AI Mode`와 `Code Mode`를 오가며 선택한 섹션/카드를 오른쪽 인스펙터에서 직접 수정하는 구조다.

## What this project includes

- `bssm-oss` 소개 랜딩을 그대로 쓰는 live editor canvas
- 섹션 + 카드 단위 editable node registry
- 오른쪽 `AI Mode` 스레드 패널
- 오른쪽 `Code Mode` 런타임 JSX 편집기
- 핀 + 스레드 형태의 Figma-like comment UX
- Firebase Firestore 기반 실시간 상태 동기화
- 실험적 OSS 편집 툴 톤의 디자인 시스템

## Current routes

- `/`
  같은 캔버스, 마지막 사용 모드 또는 기본 `AI`
- `/ai`
  같은 캔버스, AI inspector 기본 오픈
- `/code`
  같은 캔버스, Code inspector 기본 오픈

## Stack

- React 19
- Vite
- TypeScript
- React Router
- Firebase Firestore
- Monaco Editor
- Babel Standalone
- Vitest + Testing Library

## Quick start

```bash
pnpm install
pnpm dev
```

브라우저에서 Vite 개발 서버 주소를 열면 된다.

## Environment

실시간 공유와 편집 잠금은 아래 환경 변수를 사용한다.

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_EDITOR_PASSPHRASE_SHA256=
```

환경 변수가 없으면 앱은 `demo / local` 모드로 동작하고, `localStorage` 기반 로컬 동기화만 사용한다.

AI 키는 환경 변수로 두지 않고 각 사용자 브라우저에서 직접 입력해 `localStorage`에 저장한다.

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

- 강한 서버 측 권한 검증
- 실제 리포지토리 파일 직접 수정
- 멀티파일 코드 생성
- 배포용 Firebase security rules 자동 구성

즉, 지금은 “같은 랜딩을 클릭해서 JSX/AI로 바로 바꾸는 live canvas” 단계이고, 편집 권한은 의도적으로 soft gate 수준으로만 막아 둔 상태다.
