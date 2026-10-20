import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import '@fontsource-variable/inter'
import './index.css'
import './styles/dark.css'
import './styles/polish.css'
import App from '@/App'
import { AuthProvider } from '@/context/AuthContext'
import { initTheme } from '@/lib/theme'
import { PERSIST_MAX_AGE, initOfflineCleanup, persistOptions } from '@/lib/offline'
import { initInstallCapture } from '@/lib/install'

initTheme()
initInstallCapture()

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false, gcTime: PERSIST_MAX_AGE } },
})

initOfflineCleanup(queryClient)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster position="top-center" richColors closeButton />
        </AuthProvider>
      </BrowserRouter>
    </PersistQueryClientProvider>
  </StrictMode>,
)