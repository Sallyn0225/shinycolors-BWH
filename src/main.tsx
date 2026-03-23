import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { RankingPreferencesProvider } from './state/ranking-preferences'
import './styles.css'

type AppErrorBoundaryProps = React.PropsWithChildren

type AppErrorBoundaryState = {
  hasError: boolean
}

class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page page-not-found" id="main-content" tabIndex={-1}>
          <section className="hero-panel compare-page-intro">
            <div className="hero-copy">
              <p className="eyebrow">Error</p>
              <h1>页面暂时无法显示</h1>
              <p className="hero-intro">发生了意外错误。你可以刷新页面，或先回到首页继续浏览。</p>
              <div className="hero-links">
                <a className="hero-link is-primary" href="/">
                  返回首页
                </a>
              </div>
            </div>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <RankingPreferencesProvider>
          <App />
        </RankingPreferencesProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
)
