# Overview

## 목적

이 저장소는 `bssm-oss` GitHub organization을 소개하는 정적 프론트엔드 랜딩과, 앞으로 붙을 `AI Mode` / `Code Mode`의 셸 화면을 담고 있다.

현재 단계의 목표는 두 가지다.

1. `bssm-oss`가 어떤 실험을 공개하는 organization인지 한눈에 소개한다.
2. 이후 "말로 수정"과 "코드로 직접 수정" 경험이 어떻게 연결될지 UI 구조를 먼저 보여준다.

## 현재 제공 화면

### `/`

- organization 소개 랜딩
- 공개 저장소 스냅샷 통계
- 대표 프로젝트 카드
- 저장소 아틀라스
- 미래 모드 teaser

### `/ai`

- AI Mode 셸
- 페이지 선택
- 자연어 수정 요청 입력
- 에이전트 결과 검토 구조

### `/code`

- Code Mode 셸
- 수정할 영역 선택
- 연결된 코드 미리보기
- 변경 반영 흐름 설명

## 앱 구조

### 공통 셸

- `src/components/AppShell.tsx`
- 브랜드 링크, GitHub 링크, 상단 모드 토글을 포함한다.
- 모든 페이지는 동일한 shell 안에서 렌더링된다.

### 라우팅

- `src/App.tsx`
- `react-router-dom` 기반으로 `/`, `/ai`, `/code`, 그리고 fallback redirect를 정의한다.

### 페이지

- `src/routes/HomePage.tsx`
- `src/routes/AiModePage.tsx`
- `src/routes/CodeModePage.tsx`

### 데이터

- `src/data/orgSnapshot.ts`
- organization 메타데이터와 저장소 목록을 정적으로 관리한다.

### 공용 타입

- `src/types.ts`
- `OrgSnapshot`, `RepoSummary`, `ModeRoute`

## 디자인 방향

- 밝은 바탕 위에 전기감 있는 파란색, 신호용 오렌지, 라임 포인트를 사용한다.
- 실험실 같은 분위기를 유지하되, 정보 구조는 제품 랜딩처럼 읽히게 잡는다.
- 세부 토큰은 `.interface-design/system.md`에 정리되어 있다.

## 현재 범위 바깥

아래 항목은 아직 구현하지 않았다.

- 백엔드
- 저장소/페이지 실시간 동기화
- 에이전트 실행
- 코드 편집기와 실제 파일 반영
- PR 없이 직접 수정하는 런타임
