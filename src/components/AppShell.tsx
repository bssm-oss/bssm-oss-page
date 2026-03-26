import type { PropsWithChildren } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { orgSnapshot } from '../data/orgSnapshot'
import type { ModeRoute } from '../types'

interface AppShellProps extends PropsWithChildren {
  activeMode?: ModeRoute
}

const modes = [
  { key: 'ai', label: 'AI Mode', href: '/ai' },
  { key: 'code', label: 'Code Mode', href: '/code' },
] as const

export function AppShell({ activeMode, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>

      <header className="app-shell__header">
        <Link
          aria-label="bssm-oss experimental open source lab"
          className="brand"
          to="/"
        >
          <span className="brand__name">bssm-oss</span>
          <span className="brand__caption">experimental open source lab</span>
        </Link>

        <nav aria-label="Mode switch" className="mode-toggle">
          {modes.map((mode) => (
            <NavLink
              key={mode.key}
              className={({ isActive }) =>
                `mode-toggle__link ${
                  isActive || activeMode === mode.key
                    ? 'mode-toggle__link--active'
                    : ''
                }`.trim()
              }
              to={mode.href}
            >
              {mode.label}
            </NavLink>
          ))}
        </nav>

        <div className="app-shell__actions">
          <span className="chip">frontend-only prototype</span>
          <a
            className="external-link"
            href={orgSnapshot.href}
            target="_blank"
            rel="noreferrer"
          >
            Open GitHub
          </a>
        </div>
      </header>

      <main id="main-content">{children}</main>
    </div>
  )
}
