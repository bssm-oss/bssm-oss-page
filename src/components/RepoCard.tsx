import type { RepoSummary } from '../types'

interface RepoCardProps {
  repo: RepoSummary
  variant?: 'featured' | 'atlas'
}

const fullDate = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function RepoCard({ repo, variant = 'featured' }: RepoCardProps) {
  const updatedLabel = fullDate.format(new Date(repo.updatedAt))

  if (variant === 'atlas') {
    return (
      <article className="atlas-card">
        <div className="atlas-card__header">
          <div>
            <p className="chip">{repo.category}</p>
            <h3 className="atlas-card__title">{repo.name}</h3>
          </div>
          <span className="chip">{repo.language}</span>
        </div>

        <p className="atlas-card__description">{repo.description}</p>

        <div className="atlas-card__footer">
          <div className="atlas-card__meta">
            <span>{repo.stars} stars</span>
            <span>{updatedLabel}</span>
          </div>
          <a
            className="repo-card__link"
            href={repo.href}
            target="_blank"
            rel="noreferrer"
          >
            저장소 열기
          </a>
        </div>
      </article>
    )
  }

  return (
    <article className="repo-card">
      <div className="repo-card__header">
        <div>
          <p className="chip">{repo.category}</p>
          <h3 className="repo-card__title">{repo.name}</h3>
        </div>
        <span className="chip">{repo.language}</span>
      </div>

      <p className="repo-card__description">{repo.description}</p>

      <div className="repo-card__footer">
        <div className="repo-card__meta">
          <span>{repo.stars} stars</span>
          <span>{updatedLabel}</span>
        </div>
        <a
          className="repo-card__link"
          href={repo.href}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </article>
  )
}
