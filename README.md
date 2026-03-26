# bssm-oss opensource page

`bssm-oss` organization을 소개하는 프론트엔드 랜딩과 `AI Mode` / `Code Mode` 셸 페이지입니다.

## Stack

- React 19
- Vite
- TypeScript
- React Router
- Vitest + Testing Library

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
```

`npm run build` 와 `npm run test` 도 동작합니다. 패키지 설치는 로컬 npm 버전 이슈 때문에 `pnpm` 기준으로 맞춰 두었습니다.

## Data source

초기 콘텐츠는 아래 공개 정보를 기준으로 `2026-03-26` 스냅샷을 정적으로 반영했습니다.

- https://github.com/bssm-oss
- https://api.github.com/orgs/bssm-oss
- https://api.github.com/orgs/bssm-oss/repos?per_page=100

## Routes

- `/`: organization 소개 랜딩
- `/ai`: AI Mode 셸
- `/code`: Code Mode 셸
