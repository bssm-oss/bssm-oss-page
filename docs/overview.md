# Overview

## 목적

이 저장소는 `bssm-oss` GitHub organization 소개 랜딩을 그대로 실시간 편집 캔버스로 쓰는 React 앱을 담고 있다.

현재 단계의 목표는 두 가지다.

1. `bssm-oss`가 어떤 실험을 공개하는 organization인지 한눈에 보여준다.
2. 같은 화면 안에서 "말로 수정"과 "코드로 직접 수정"을 실제로 수행하게 만든다.

## 현재 제공 화면

### `/`

- 같은 편집 캔버스
- 마지막 사용 모드 복원 또는 기본 `AI`

### `/ai`

- 같은 편집 캔버스
- AI 스레드 패널 기본 오픈
- 핀, 댓글, AI 프롬프트, AI 결과 검토

### `/code`

- 같은 편집 캔버스
- Code 패널 기본 오픈
- 선택 노드 런타임 JSX 편집

## 앱 구조

### 공통 셸

- `src/components/AppShell.tsx`
- 브랜드 링크, GitHub 링크, 상단 모드 토글을 포함한다.
- 모든 페이지는 동일한 shell 안에서 렌더링된다.

### 라우팅

- `src/App.tsx`
- `react-router-dom` 기반으로 `/`, `/ai`, `/code`, 그리고 fallback redirect를 정의한다.

### 페이지

- `src/routes/EditorWorkspacePage.tsx`
- 라우트는 다르지만 모두 같은 워크스페이스를 렌더링한다.

### 데이터

- `src/data/orgSnapshot.ts`
- organization 메타데이터와 저장소 목록을 정적으로 관리한다.
- `src/data/workspaceSeed.ts`
- 스냅샷 데이터를 editable node registry와 초기 workspace 상태로 변환한다.

### 실시간 상태

- `src/services/workspaceStore.ts`
- Firestore가 있으면 live sync, 없으면 local demo transport로 동작한다.

### 공용 타입

- `src/types.ts`
- `OrgSnapshot`, `RepoSummary`, `EditableNode`, `CommentThread`, `WorkspaceDoc`, `AiResult`

## 디자인 방향

- 밝은 바탕 위에 전기감 있는 파란색, 신호용 오렌지, 라임 포인트를 사용한다.
- 실험실 같은 분위기를 유지하되, 정보 구조는 제품 랜딩처럼 읽히게 잡는다.
- 세부 토큰은 `.interface-design/system.md`에 정리되어 있다.

## 현재 범위 바깥

아래 항목은 아직 구현하지 않았다.

- 강한 서버 측 권한 검증
- 실제 리포지토리 파일 직접 수정
- 멀티파일 코드 생성
- Firebase 보안 규칙 자동 구성
