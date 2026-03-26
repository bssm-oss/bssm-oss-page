# Development

## 설치

이 저장소는 `pnpm` 기준으로 관리한다.

```bash
pnpm install
```

로컬 환경에서 npm arborist 관련 버그가 있었기 때문에, 의존성 설치는 `pnpm` 사용을 기본으로 둔다.

## 실행

```bash
pnpm dev
```

기본 개발 서버는 Vite를 사용한다.

## 검증

```bash
pnpm build
pnpm test
pnpm lint
```

동일한 스크립트는 `npm run ...` 형태로도 실행 가능하다.

## 테스트 범위

현재 테스트는 아래를 검증한다.

- 홈 랜딩 렌더링
- 헤더 토글을 통한 AI Mode 이동
- Code Mode에서 브랜드 클릭 후 홈 복귀

테스트 파일:

- `src/App.test.tsx`
- `src/test/setup.ts`

## 문서 수정 시 체크리스트

README 또는 `docs/`를 바꿀 때는 아래를 같이 확인한다.

1. 라우트 설명이 현재 구현과 맞는지
2. 데이터 기준 날짜가 최신 스냅샷과 맞는지
3. `AI Mode` / `Code Mode` 설명이 실제 구현 범위를 넘지 않는지
4. 설치/검증 명령이 현재 lockfile과 맞는지

## 배포 전 최소 확인

문서만 바뀌는 PR이라도 아래는 유지하는 편이 좋다.

- `git diff --check`
- `pnpm test`

코드가 함께 바뀌면 아래도 같이 확인한다.

- `pnpm build`
- `pnpm lint`
