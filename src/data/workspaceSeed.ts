import { orgSnapshot } from './orgSnapshot'
import type { EditableNode, OrgSnapshot, RepoSummary, WorkspaceDoc } from '../types'

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
    accent: 'cyan',
  },
  {
    title: 'Adaptive UI',
    description:
      '설명 가능하고 제약된 방식으로 UI를 바꾸는 runtime과 transformation experiment.',
    accent: 'orange',
  },
  {
    title: 'Developer utilities',
    description:
      'Notion-to-PDF, terminal helper, code tooling처럼 개발자 일상을 다루는 작은 제품성 실험.',
    accent: 'lime',
  },
  {
    title: 'Open experiments',
    description:
      '정식 제품 이전의 sandbox, skill pack, packaging repo까지 공개적으로 쌓아가는 방식.',
    accent: 'blue',
  },
]

const modeCards = [
  {
    chip: 'AI Mode',
    title: '말로 바꾸는 수정 흐름',
    description:
      '선택한 블록의 현재 상태와 스레드를 보고 자연어로 바꾸라고 말하면, AI가 새로운 JSX를 제안합니다.',
    preview: 'click node → open thread → tell AI → review JSX → apply live',
  },
  {
    chip: 'Code Mode',
    title: '코드를 바로 만지는 수정 흐름',
    description:
      '선택한 블록에 연결된 런타임 JSX를 열고 수정해서, PR 없이 바로 페이지를 바꾸는 편집 흐름.',
    preview: 'click node → inspect source → edit → validate → apply live',
  },
]

function isoSeedTime() {
  return `${orgSnapshot.snapshotDate}T00:00:00.000Z`
}

function makeNode(
  nodeId: string,
  kind: EditableNode['kind'],
  title: string,
  source: string,
  props: Record<string, unknown>,
  bindings: string[],
): EditableNode {
  return {
    nodeId,
    kind,
    title,
    source,
    props,
    bindings,
    commentPins: [],
    updatedAt: isoSeedTime(),
    updatedBy: 'seed',
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

function makeRepoNodeId(prefix: string, repo: RepoSummary) {
  return `${prefix}.${repo.name.toLowerCase()}`
}

export const workspaceLayout = {
  heroNodeId: 'hero.section',
  latestHeaderNodeId: 'latest-motion.section',
  latestCardNodeIds: latestRepos.map((repo) => makeRepoNodeId('latest-motion', repo)),
  statsNodeIds: stats.map((_, index) => `stats.card-${index + 1}`),
  featuredHeaderNodeId: 'featured.section',
  featuredCardNodeIds: featuredRepos.map((repo) => makeRepoNodeId('featured', repo)),
  themesHeaderNodeId: 'themes.section',
  themeCardNodeIds: themes.map((_, index) => `themes.card-${index + 1}`),
  atlasHeaderNodeId: 'atlas.section',
  atlasCardNodeIds: orgSnapshot.repos.map((repo) => makeRepoNodeId('atlas', repo)),
  futureHeaderNodeId: 'future.section',
  futureCardNodeIds: modeCards.map((_, index) => `future.card-${index + 1}`),
} as const

export function createSeedWorkspace(snapshot: OrgSnapshot = orgSnapshot): WorkspaceDoc {
  const nodes: EditableNode[] = [
    makeNode(
      workspaceLayout.heroNodeId,
      'section',
      'Hero',
      `<HeroCard eyebrow={eyebrow} title={title} description={description} href={href} snapshotLabel={snapshotLabel} blog={blog} email={email} />`,
      {
        eyebrow: 'BSSM Open Source',
        title: '오픈소스 실험이 쌓이는 조직, bssm-oss',
        description: `${snapshot.tagline}. 지금은 ${snapshot.intro}`,
        href: snapshot.href,
        snapshotLabel: 'Snapshot 기준일: 2026년 3월 26일',
        blog: 'Blog: justn.me',
        email: 'Email: justn.hyeok@gmail.com',
      },
      ['eyebrow', 'title', 'description', 'href', 'snapshotLabel', 'blog', 'email'],
    ),
    makeNode(
      workspaceLayout.latestHeaderNodeId,
      'section',
      'Latest motion heading',
      `<PanelHeading label={label} title={title} description={description} />`,
      {
        label: 'Latest motion',
        title: '최근 공개된 실험 흐름',
        description:
          '설명 없는 저장소도 있어서, 최신 업데이트와 README가 있는 대표 프로젝트 중심으로 읽히게 구성했습니다.',
      },
      ['label', 'title', 'description'],
    ),
    ...latestRepos.map((repo) =>
      makeNode(
        makeRepoNodeId('latest-motion', repo),
        'card',
        `Latest motion / ${repo.name}`,
        `<ActivityCard name={name} description={description} category={category} updatedLabel={updatedLabel} />`,
        {
          name: repo.name,
          description: repo.description,
          category: repo.category,
          updatedLabel: formatDate(repo.updatedAt),
        },
        ['name', 'description', 'category', 'updatedLabel'],
      ),
    ),
    ...stats.map((stat, index) =>
      makeNode(
        `stats.card-${index + 1}`,
        'card',
        `Snapshot stat / ${stat.label}`,
        `<StatCard label={label} value={value} />`,
        stat,
        ['label', 'value'],
      ),
    ),
    makeNode(
      workspaceLayout.featuredHeaderNodeId,
      'section',
      'Featured projects heading',
      `<SectionHeading label={label} title={title} description={description} />`,
      {
        label: 'Featured projects',
        title: '가장 먼저 훑어볼 만한 프로젝트',
        description:
          '조직 성격을 제일 잘 보여주는 저장소를 앞에 배치했습니다. AI runtime, adaptive UI, collaboration utility가 현재 축입니다.',
      },
      ['label', 'title', 'description'],
    ),
    ...featuredRepos.map((repo) =>
      makeNode(
        makeRepoNodeId('featured', repo),
        'card',
        `Featured / ${repo.name}`,
        `<RepoCard repo={repo} />`,
        { repo },
        ['repo'],
      ),
    ),
    makeNode(
      workspaceLayout.themesHeaderNodeId,
      'section',
      'Why this org heading',
      `<SectionHeading label={label} title={title} description={description} />`,
      {
        label: 'Why this org',
        title: '한 조직 안에 어떤 종류의 실험이 모여 있나',
        description:
          'bssm-oss는 한 가지 제품만 놓는 공간이 아니라, 비슷한 문제를 다른 형태로 계속 시도하는 실험실에 가깝습니다.',
      },
      ['label', 'title', 'description'],
    ),
    ...themes.map((theme, index) =>
      makeNode(
        `themes.card-${index + 1}`,
        'card',
        `Theme / ${theme.title}`,
        `<ThemeCard title={title} description={description} accent={accent} />`,
        theme,
        ['title', 'description', 'accent'],
      ),
    ),
    makeNode(
      workspaceLayout.atlasHeaderNodeId,
      'section',
      'Repo overview heading',
      `<SectionHeading label={label} title={title} description={description} />`,
      {
        label: 'Repo overview',
        title: '전체 저장소를 한 번에 보는 atlas',
        description:
          'README가 없거나 설명이 비어 있는 저장소는 현재 이름과 성격을 기준으로 짧은 보조 문구를 붙였습니다.',
      },
      ['label', 'title', 'description'],
    ),
    ...snapshot.repos.map((repo) =>
      makeNode(
        makeRepoNodeId('atlas', repo),
        'card',
        `Atlas / ${repo.name}`,
        `<RepoCard repo={repo} variant="atlas" />`,
        { repo },
        ['repo'],
      ),
    ),
    makeNode(
      workspaceLayout.futureHeaderNodeId,
      'section',
      'Future modes heading',
      `<SectionHeading label={label} title={title} description={description} />`,
      {
        label: 'Live editor',
        title: '이제 이 페이지 자체를 고치는 워크스페이스',
        description:
          '클릭한 블록의 코드와 AI 스레드를 오른쪽에서 바로 열고, 적용하면 모두가 같은 변경을 즉시 보게 됩니다.',
      },
      ['label', 'title', 'description'],
    ),
    ...modeCards.map((card, index) =>
      makeNode(
        `future.card-${index + 1}`,
        'card',
        `${card.chip}`,
        `<ModeCard chip={chip} title={title} description={description} preview={preview} />`,
        card,
        ['chip', 'title', 'description', 'preview'],
      ),
    ),
  ]

  return {
    version: 1,
    activeTheme: 'experimental-oss-editor',
    lastAppliedAt: isoSeedTime(),
    lastAppliedBy: 'seed',
    nodes,
  }
}

