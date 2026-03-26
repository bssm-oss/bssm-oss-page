import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './App'

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('bssm-oss live editor', () => {
  it('renders the shared landing canvas on the home route', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', {
        name: '하나의 랜딩을 클릭하고, 오른쪽에서 코드나 AI로 바로 바꾸는 캔버스',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: '오픈소스 실험이 쌓이는 조직, bssm-oss',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI Mode' })).toBeInTheDocument()
  })

  it('switches modes while keeping the same canvas mounted', async () => {
    const user = userEvent.setup()
    renderRoute('/code')

    expect(screen.getByRole('heading', { name: 'Code Mode' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: '오픈소스 실험이 쌓이는 조직, bssm-oss',
      }),
    ).toBeInTheDocument()

    const toggle = screen.getByRole('navigation', { name: 'Mode switch' })
    await user.click(within(toggle).getByRole('link', { name: 'AI Mode' }))

    expect(screen.getByRole('heading', { name: 'AI Mode' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: '오픈소스 실험이 쌓이는 조직, bssm-oss',
      }),
    ).toBeInTheDocument()
  })

  it('opens the selected node source in code mode', async () => {
    const user = userEvent.setup()
    renderRoute('/code')

    await user.click(
      screen.getByRole('button', { name: 'Featured / CodeAgora editable block' }),
    )

    expect(screen.getAllByText('Featured / CodeAgora').length).toBeGreaterThan(0)
    expect(screen.getByDisplayValue('<RepoCard repo={repo} />')).toBeInTheDocument()
  })
})
