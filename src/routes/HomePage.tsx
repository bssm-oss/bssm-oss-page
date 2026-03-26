import { Link } from 'react-router-dom'
import { RepoCard } from '../components/RepoCard'
import { SectionHeading } from '../components/SectionHeading'
import { orgSnapshot } from '../data/orgSnapshot'

const featuredRepos = orgSnapshot.repos.filter((repo) => repo.featured)
const latestRepos = [...orgSnapshot.repos]
  .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
  .slice(0, 4)

const stats = [
  { label: 'Public repos', value: orgSnapshot.publicRepos.toString() },
  { label: 'Followers', value: orgSnapshot.followers.toString() },
  { label: 'Featured projects', value: featuredRepos.length.toString() },
  { label: 'Snapshot date', value: '2026.03.26' },
]

const themes = [
  {
    title: 'AI tooling',
    description:
      'Code review, workflow orchestration, agent runtime처럼 AI를 바로 작업 흐름에 붙이는 프로젝트들.',
  },
  {
    title: 'Adaptive UI',
    description:
      '설명 가능하고 제약된 방식으로 UI를 바꾸는 runtime과 transformation experiment.',
  },
  {
    title: 'Developer utilities',
    description:
      'Notion-to-PDF, terminal helper, code tooling처럼 개발자 일상을 다루는 작은 제품성 실험.',
  },
  {
    title: 'Open experiments',
    description:
      '정식 제품 이전의 sandbox, skill pack, packaging repo까지 공개적으로 쌓아가는 방식.',
  },
]

const recentFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'short',
  day: 'numeric',
})

export function HomePage() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero__copy">
          <span className="eyebrow">BSSM Open Source</span>
          <div>
            <h1 className="hero__title">오픈소스 실험이 쌓이는 조직, bssm-oss</h1>
            <p className="hero__lede">
              {orgSnapshot.tagline}. 지금은 {orgSnapshot.intro}
            </p>
          </div>

          <div className="hero__actions">
            <a
              className="cta cta--primary"
              href={orgSnapshot.href}
              target="_blank"
              rel="noreferrer"
            >
              Organization 열기
            </a>
            <Link className="cta cta--secondary" to="/ai">
              AI Mode 보기
            </Link>
            <Link className="cta cta--secondary" to="/code">
              Code Mode 보기
            </Link>
          </div>

          <div className="hero__note">
            <span>Snapshot 기준일: 2026년 3월 26일</span>
            <span>Blog: justn.me</span>
            <span>Email: justn.hyeok@gmail.com</span>
          </div>
        </div>

        <aside className="hero__panel">
          <div>
            <p className="section-heading__label">Latest motion</p>
            <h2 className="hero__panel-title">최근 공개된 실험 흐름</h2>
            <p className="hero__lede">
              설명이 없는 저장소도 많기 때문에, 최신 업데이트와 README가 있는 대표 프로젝트 중심으로 읽히게 구성했습니다.
            </p>
          </div>

          <div className="hero__activity-list">
            {latestRepos.map((repo) => (
              <article className="hero__activity-item" key={repo.name}>
                <strong>{repo.name}</strong>
                <span className="muted">{repo.description}</span>
                <div className="hero__activity-meta">
                  <span>{repo.category}</span>
                  <span>{recentFormatter.format(new Date(repo.updatedAt))}</span>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="stat-grid" aria-label="Organization snapshot stats">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div className="stat-card__label">{stat.label}</div>
            <div className="stat-card__value">{stat.value}</div>
          </article>
        ))}
      </section>

      <section className="section">
        <SectionHeading
          label="Featured projects"
          title="가장 먼저 훑어볼 만한 프로젝트"
          description="조직 성격을 제일 잘 보여주는 저장소를 앞에 배치했습니다. AI runtime, adaptive UI, collaboration utility가 현재 축입니다."
        />

        <div className="featured-grid">
          {featuredRepos.map((repo) => (
            <RepoCard key={repo.name} repo={repo} />
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading
          label="Why this org"
          title="한 조직 안에 어떤 종류의 실험이 모여 있나"
          description="bssm-oss는 한 가지 제품만 놓는 공간이 아니라, 비슷한 문제를 다른 형태로 계속 시도하는 실험실에 가깝습니다."
        />

        <div className="theme-grid">
          {themes.map((theme) => (
            <article className="theme-card" key={theme.title}>
              <h3 className="theme-card__title">{theme.title}</h3>
              <p className="theme-card__description">{theme.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading
          label="Repo overview"
          title="전체 저장소를 한 번에 보는 atlas"
          description="README가 없거나 설명이 비어 있는 저장소는 현재 이름과 성격을 기준으로 짧은 보조 문구를 붙였습니다."
        />

        <div className="atlas-grid">
          {orgSnapshot.repos.map((repo) => (
            <RepoCard key={repo.name} repo={repo} variant="atlas" />
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading
          label="Future modes"
          title="이 랜딩 다음에 붙을 작업 모드"
          description="지금은 셸만 만들었지만, 목표는 PR 없이 화면과 코드를 직접 손대는 경험입니다."
        />

        <div className="mode-grid">
          <article className="mode-card">
            <div className="mode-card__header">
              <div>
                <p className="chip">AI Mode</p>
                <h3 className="mode-card__title">말로 바꾸는 수정 흐름</h3>
              </div>
            </div>
            <p className="mode-card__description">
              페이지를 선택하고 “어떻게 바꿔달라”를 적으면, 에이전트가 그 부분을 해석해서 바뀐 방향을 알려주는 흐름.
            </p>
            <div className="mode-card__preview">
              page select → prompt → agent changes → apply
            </div>
            <Link className="mode-card__link" to="/ai">
              AI Mode 셸 열기
            </Link>
          </article>

          <article className="mode-card">
            <div className="mode-card__header">
              <div>
                <p className="chip">Code Mode</p>
                <h3 className="mode-card__title">코드를 바로 만지는 수정 흐름</h3>
              </div>
            </div>
            <p className="mode-card__description">
              화면의 특정 영역에 해당하는 코드를 바로 보고 수정해서, PR 대신 직접 변경하는 편집 흐름.
            </p>
            <div className="mode-card__preview">
              section select → code inspect → edit → instant reflect
            </div>
            <Link className="mode-card__link" to="/code">
              Code Mode 셸 열기
            </Link>
          </article>
        </div>
      </section>
    </div>
  )
}
