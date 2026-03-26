import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { AiModePage } from './routes/AiModePage'
import { CodeModePage } from './routes/CodeModePage'
import { HomePage } from './routes/HomePage'

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell>
            <HomePage />
          </AppShell>
        }
      />
      <Route
        path="/ai"
        element={
          <AppShell activeMode="ai">
            <AiModePage />
          </AppShell>
        }
      />
      <Route
        path="/code"
        element={
          <AppShell activeMode="code">
            <CodeModePage />
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
