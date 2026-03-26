import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { getStoredMode } from './lib/editorAccess'
import { EditorWorkspacePage } from './routes/EditorWorkspacePage'

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell activeMode={getStoredMode('ai')}>
            <EditorWorkspacePage />
          </AppShell>
        }
      />
      <Route
        path="/ai"
        element={
          <AppShell activeMode="ai">
            <EditorWorkspacePage initialMode="ai" />
          </AppShell>
        }
      />
      <Route
        path="/code"
        element={
          <AppShell activeMode="code">
            <EditorWorkspacePage initialMode="code" />
          </AppShell>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
