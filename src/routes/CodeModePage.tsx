const editableSections = [
  'Hero copy',
  'Snapshot stats',
  'Featured project cards',
  'Repository atlas',
]

const codeSample = `const featuredProjects = repos
  .filter((repo) => repo.featured)
  .map((repo) => ({
    title: repo.name,
    category: repo.category,
    summary: repo.description,
  }))`

export function CodeModePage() {
  return (
    <div className="page">
      <section className="section shell-hero">
        <span className="eyebrow">Code Mode shell</span>
        <h1 className="shell-hero__title">코드를 바로 보고 수정하는 작업공간</h1>
        <p className="shell-hero__description">
          이후 단계에서는 화면의 한 부분을 선택하면 해당 코드가 오른쪽에 뜨고, 직접 수정한 내용이 바로 렌더 결과에 반영되는 흐름으로 확장됩니다.
        </p>
      </section>

      <section className="shell-layout">
        <article className="shell-panel">
          <div>
            <p className="section-heading__label">01 / select section</p>
            <h2 className="shell-panel__title">수정할 화면 영역</h2>
            <p className="shell-panel__description">
              소개 페이지 기준으로 어떤 영역의 코드가 노출될지 미리 보여줍니다.
            </p>
          </div>

          <div className="shell-list">
            {editableSections.map((item, index) => (
              <article className="shell-list__item" key={item}>
                <strong>
                  {index + 1}. {item}
                </strong>
                <span className="shell-meta">linked source / target region</span>
              </article>
            ))}
          </div>
        </article>

        <article className="shell-panel">
          <div>
            <p className="section-heading__label">02 / inspect code</p>
            <h2 className="shell-panel__title">선택된 영역의 코드</h2>
            <p className="shell-panel__description">
              실제 구현에서는 파일 위치와 JSX 범위를 함께 연결해 보여주는 편집기로 바뀝니다.
            </p>
          </div>

          <pre className="shell-codeblock">
            <code>{codeSample}</code>
          </pre>

          <div className="shell-callout">
            v1에서는 읽기 전용 예시지만, 목표는 여기서 직접 수정하고 미리보기가 즉시 따라오는 구조입니다.
          </div>
        </article>

        <article className="shell-panel">
          <div>
            <p className="section-heading__label">03 / reflect changes</p>
            <h2 className="shell-panel__title">화면과 코드의 직접 연결</h2>
            <p className="shell-panel__description">
              PR 설명을 거치지 않고, 선택한 화면 조각과 코드 조각이 1:1로 이어지는 경험을 가정합니다.
            </p>
          </div>

          <div className="shell-checklist">
            <article className="shell-checklist__item">
              <strong>Section-aware mapping</strong>
              <span className="shell-meta">어느 카드가 어느 코드에 연결되는지 명확히 표시</span>
            </article>
            <article className="shell-checklist__item">
              <strong>Direct patching</strong>
              <span className="shell-meta">선택한 부분만 바로 고치고 전체 화면에 반영</span>
            </article>
            <article className="shell-checklist__item">
              <strong>Safe iteration</strong>
              <span className="shell-meta">필요하면 이전 상태와 비교 가능한 변경 내역 제공</span>
            </article>
          </div>
        </article>
      </section>
    </div>
  )
}
