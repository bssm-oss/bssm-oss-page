interface HeroCardProps {
  eyebrow: string
  title: string
  description: string
  href: string
  snapshotLabel: string
  blog: string
  email: string
}

interface ActivityCardProps {
  name: string
  description: string
  category: string
  updatedLabel: string
}

interface StatCardProps {
  label: string
  value: string
}

interface ThemeCardProps {
  title: string
  description: string
  accent?: string
}

interface ModeCardProps {
  chip: string
  title: string
  description: string
  preview: string
}

interface PanelHeadingProps {
  label: string
  title: string
  description: string
}

export function HeroCard({
  eyebrow,
  title,
  description,
  href,
  snapshotLabel,
  blog,
  email,
}: HeroCardProps) {
  return (
    <section className="hero-card">
      <span className="eyebrow">{eyebrow}</span>
      <div className="hero-card__stack">
        <h1 className="hero-card__title">{title}</h1>
        <p className="hero-card__description">{description}</p>
      </div>

      <div className="hero-card__actions">
        <a className="cta cta--primary" href={href} target="_blank" rel="noreferrer">
          Organization 열기
        </a>
        <span className="workspace-inline-badge">select a block to edit</span>
      </div>

      <div className="hero-card__meta">
        <span>{snapshotLabel}</span>
        <span>{blog}</span>
        <span>{email}</span>
      </div>
    </section>
  )
}

export function ActivityCard({
  name,
  description,
  category,
  updatedLabel,
}: ActivityCardProps) {
  return (
    <article className="activity-card">
      <strong>{name}</strong>
      <p className="activity-card__description">{description}</p>
      <div className="activity-card__meta">
        <span>{category}</span>
        <span>{updatedLabel}</span>
      </div>
    </article>
  )
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
    </article>
  )
}

export function ThemeCard({ title, description, accent = 'cyan' }: ThemeCardProps) {
  return (
    <article className={`theme-card theme-card--${accent}`}>
      <h3 className="theme-card__title">{title}</h3>
      <p className="theme-card__description">{description}</p>
    </article>
  )
}

export function ModeCard({ chip, title, description, preview }: ModeCardProps) {
  return (
    <article className="mode-card">
      <div className="mode-card__header">
        <div>
          <p className="chip">{chip}</p>
          <h3 className="mode-card__title">{title}</h3>
        </div>
      </div>
      <p className="mode-card__description">{description}</p>
      <div className="mode-card__preview">{preview}</div>
    </article>
  )
}

export function PanelHeading({ label, title, description }: PanelHeadingProps) {
  return (
    <div className="panel-heading">
      <p className="section-heading__label">{label}</p>
      <h2 className="panel-heading__title">{title}</h2>
      <p className="panel-heading__description">{description}</p>
    </div>
  )
}
