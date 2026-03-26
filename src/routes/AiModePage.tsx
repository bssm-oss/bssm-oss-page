const targetPages = [
  'Organization Intro',
  'Featured Projects',
  'Repository Atlas',
  'Future Modes Teaser',
]

const agentSteps = [
  '수정할 페이지나 섹션을 고릅니다.',
  '바꾸고 싶은 톤, 구조, 카피를 자연어로 입력합니다.',
  '에이전트가 적용 가능한 변경안과 영향 범위를 정리해 보여줍니다.',
]

const agentPreview = [
  'Hero headline을 더 직접적으로 바꾸고 CTA 순서를 재정렬',
  'Featured project 카드의 강조색을 더 실험적인 톤으로 조정',
  'Repo atlas를 category-first 레이아웃으로 재배치',
]

export function AiModePage() {
  return (
    <div className="page">
      <section className="section shell-hero">
        <span className="eyebrow">AI Mode shell</span>
        <h1 className="shell-hero__title">말로 바꾸는 작업공간</h1>
        <p className="shell-hero__description">
          이 페이지는 v1 셸입니다. 나중에는 원하는 페이지를 고른 뒤 자연어로 수정 요청을 보내면, 에이전트가 변경안과 적용 결과를 바로 보여주게 됩니다.
        </p>
      </section>

      <section className="shell-layout">
        <article className="shell-panel">
          <div>
            <p className="section-heading__label">01 / pick a page</p>
            <h2 className="shell-panel__title">수정 대상을 고르기</h2>
            <p className="shell-panel__description">
              지금은 소개 페이지의 주요 섹션을 예시로 보여줍니다.
            </p>
          </div>

          <div className="shell-list">
            {targetPages.map((page, index) => (
              <article className="shell-list__item" key={page}>
                <strong>
                  {index + 1}. {page}
                </strong>
                <span className="shell-meta">selectable node / future target</span>
              </article>
            ))}
          </div>
        </article>

        <article className="shell-panel">
          <div>
            <p className="section-heading__label">02 / prompt agent</p>
            <h2 className="shell-panel__title">바꿔달라고 말하기</h2>
            <p className="shell-panel__description">
              실서비스에서는 이 입력이 실제 agent task로 이어지게 됩니다.
            </p>
          </div>

          <div className="shell-wireframe">
            {agentSteps.map((step, index) => (
              <article className="shell-step" key={step}>
                <span className="shell-step__index">step {index + 1}</span>
                <strong>{step}</strong>
              </article>
            ))}
          </div>

          <label className="muted" htmlFor="ai-request">
            예시 요청
          </label>
          <textarea
            className="shell-input"
            id="ai-request"
            defaultValue="landing hero를 더 대담하게 만들고, Adaptive UI 계열 프로젝트를 더 앞에 보여줘."
            readOnly
          />

          <button className="shell-button" type="button">
            AI 사용
          </button>
        </article>

        <article className="shell-panel">
          <div>
            <p className="section-heading__label">03 / review output</p>
            <h2 className="shell-panel__title">에이전트가 돌려주는 결과</h2>
            <p className="shell-panel__description">
              변경 이유, 바뀌는 섹션, 적용 전후 차이를 한쪽에서 확인하는 구조입니다.
            </p>
          </div>

          <div className="shell-checklist">
            {agentPreview.map((item) => (
              <article className="shell-checklist__item" key={item}>
                <strong>{item}</strong>
                <span className="shell-meta">proposed by agent / review before apply</span>
              </article>
            ))}
          </div>

          <div className="shell-callout">
            현재 단계에서는 실제 수정 연결 없이 흐름과 정보 구조만 잡아 둔 상태입니다.
          </div>
        </article>
      </section>
    </div>
  )
}
