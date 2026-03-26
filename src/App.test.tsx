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

describe('bssm-oss landing app', () => {
  it('renders the home route with org intro content', () => {
    renderRoute('/')

    expect(
      screen.getByRole('heading', { name: '오픈소스 실험이 쌓이는 조직, bssm-oss' }),
    ).toBeInTheDocument()
    expect(screen.getByText('가장 먼저 훑어볼 만한 프로젝트')).toBeInTheDocument()
    expect(screen.getAllByText('CodeAgora')).toHaveLength(2)
  })

  it('navigates to AI mode from the header toggle', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    const toggle = screen.getByRole('navigation', { name: 'Mode switch' })
    await user.click(within(toggle).getByRole('link', { name: 'AI Mode' }))

    expect(screen.getByRole('heading', { name: '말로 바꾸는 작업공간' })).toBeInTheDocument()
  })

  it('returns home when the brand is clicked from code mode', async () => {
    const user = userEvent.setup()
    renderRoute('/code')

    expect(
      screen.getByRole('heading', { name: '코드를 바로 보고 수정하는 작업공간' }),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('link', { name: 'bssm-oss experimental open source lab' }),
    )

    expect(
      screen.getByRole('heading', { name: '오픈소스 실험이 쌓이는 조직, bssm-oss' }),
    ).toBeInTheDocument()
  })
})
