interface SectionHeadingProps {
  label: string
  title: string
  description: string
}

export function SectionHeading({
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <p className="section-heading__label">{label}</p>
      <h2 className="section-heading__title">{title}</h2>
      <p className="section-heading__description">{description}</p>
    </div>
  )
}
