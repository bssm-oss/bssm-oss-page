# Mode Roadmap

## 현재 상태

`AI Mode`와 `Code Mode`는 이제 설명용 셸이 아니라, 같은 랜딩 캔버스를 서로 다른 방식으로 편집하는 실제 워크스페이스다.

둘 다 같은 목적을 향한다.

- PR 설명보다 더 직접적인 수정 흐름
- 화면과 수정 요청의 거리를 줄이는 인터페이스

## AI Mode

### 지금 있는 것

- 선택 노드 기준 AI thread
- 핀 + 댓글 구조
- OpenAI / Anthropic 키 입력
- AI 결과를 `nextSource`로 정규화
- Apply 전 코드 검증

### 이후 붙을 것

1. 이미지/스크린샷 기반 컨텍스트 추가
2. 여러 노드 동시 변경 지원
3. 모델별 프롬프트 템플릿 개선
4. 더 강한 diff 시각화

## Code Mode

### 지금 있는 것

- 선택 노드 기준 런타임 JSX 편집기
- Apply live / Undo last apply
- 같은 캔버스 즉시 반영

### 이후 붙을 것

1. prettier-like formatting pass
2. 더 안전한 JSX linting
3. 여러 노드 묶음 편집
4. 실제 파일 단위 export flow

## 두 모드가 만나야 하는 지점

장기적으로는 아래 흐름이 중요하다.

- AI Mode가 만든 `nextSource`를 Code Mode에서 바로 이어서 수정
- Code Mode에서 바꾼 소스를 다시 AI가 설명하거나 개선
- 같은 핀과 같은 노드 기준으로 말과 코드가 연결

## 문서화 목적

이 문서는 현재 구현과 미래 목표를 구분하기 위해 둔다.

README에는 사용자 관점의 설명을 두고, 이 문서에는 제품 방향과 확장 포인트를 남긴다.
