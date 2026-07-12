import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { ComparePage } from './pages/ComparePage'
import { OverallPage } from './pages/OverallPage'
import { UnitsPage } from './pages/UnitsPage'
import { parseHash, saveTheme, serializeState, type AppState } from './urlState'

function applyTheme(theme: AppState['theme']) {
  document.documentElement.dataset.theme = theme
}

export function App() {
  const initial = parseHash(window.location.hash || '#/overall')
  const [state, setState] = useState<AppState>(initial.state)

  useEffect(() => {
    const syncFromUrl = () => {
      const parsed = parseHash(window.location.hash || '#/overall')
      if (window.location.hash !== parsed.canonicalHash) {
        window.history.replaceState(null, '', parsed.canonicalHash)
      }
      applyTheme(parsed.state.theme)
      setState(parsed.state)
    }

    syncFromUrl()
    window.addEventListener('hashchange', syncFromUrl)
    window.addEventListener('popstate', syncFromUrl)
    return () => {
      window.removeEventListener('hashchange', syncFromUrl)
      window.removeEventListener('popstate', syncFromUrl)
    }
  }, [])

  const navigate = (nextState: AppState, replace = false) => {
    const nextHash = serializeState(nextState)
    const currentHash = window.location.hash || '#/overall'
    if (nextHash === currentHash) return
    if (replace) {
      window.history.replaceState(null, '', nextHash)
    } else {
      window.history.pushState(null, '', nextHash)
    }
    saveTheme(nextState.theme)
    applyTheme(nextState.theme)
    setState(nextState)
  }

  return (
    <AppShell state={state} onNavigate={navigate}>
      {state.route === 'overall' ? <OverallPage state={state} onNavigate={navigate} /> : null}
      {state.route === 'units' ? <UnitsPage state={state} onNavigate={navigate} /> : null}
      {state.route === 'compare' ? <ComparePage state={state} onNavigate={navigate} /> : null}
    </AppShell>
  )
}
