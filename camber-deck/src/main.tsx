import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SessionProvider } from './lib/auth/components/SessionProvider'
import { AuthGate } from './components/AuthGate'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionProvider>
      <AuthGate>
        <App />
      </AuthGate>
    </SessionProvider>
  </StrictMode>,
)
