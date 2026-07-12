import type { ReactNode } from 'react'
import { colorSourceUrl, officialIndexUrl, type Theme } from '../data'
import { serializeState, type AppState } from '../urlState'

interface AppShellProps {
  state: AppState
  onNavigate: (state: AppState, replace?: boolean) => void
  children: ReactNode
}

const navigation = [
  { route: 'overall' as const, label: '总榜', description: '成员排名' },
  { route: 'units' as const, label: '组合榜', description: '组合平均值' },
  { route: 'compare' as const, label: '双人对比', description: '两名成员' },
]

export function AppShell({ state, onNavigate, children }: AppShellProps) {
  const overallHref = serializeState({
    route: 'overall',
    metric: 'bust',
    query: '',
    direction: 'desc',
    theme: state.theme,
  })
  const unitsHref = serializeState({ route: 'units', metric: 'bust', direction: 'desc', theme: state.theme })
  const compareHref = serializeState({ route: 'compare', theme: state.theme })

  const hrefs = { overall: overallHref, units: unitsHref, compare: compareHref }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href={overallHref} aria-label="闪耀色彩三围资料首页">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="brand-copy">
              <strong>闪耀色彩</strong>
              <small>三围资料</small>
            </span>
          </a>

          <nav className="primary-nav" aria-label="主要页面">
            {navigation.map((item) => (
              <a
                key={item.route}
                href={hrefs[item.route]}
                className={state.route === item.route ? 'nav-link is-active' : 'nav-link'}
                aria-current={state.route === item.route ? 'page' : undefined}
              >
                <span>{item.label}</span>
                <small>{item.description}</small>
              </a>
            ))}
          </nav>

          <label className="theme-control">
            <span>主题</span>
            <select
              value={state.theme}
              aria-label="选择主题"
              onChange={(event) => {
                const theme = event.target.value as Theme
                try {
                  window.localStorage.setItem('shiny-colors-theme', theme)
                } catch {
                  // URL state remains the fallback when storage is unavailable.
                }
                onNavigate({ ...state, theme })
              }}
            >
              <option value="system">跟随系统</option>
              <option value="light">浅色</option>
              <option value="dark">深色</option>
            </select>
          </label>
        </div>
      </header>

      <main className="shell main-content">{children}</main>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div>
            <p className="footer-title">闪耀色彩三围资料</p>
            <p className="footer-note">面向粉丝的静态资料工具，页面只呈现原始厘米数值，不生成评价或综合指数。</p>
          </div>
          <div className="footer-meta">
            <span>单位：cm</span>
            <span>最后核验：2026-07-12</span>
            <a href={officialIndexUrl} target="_blank" rel="noreferrer">
              官方偶像索引
            </a>
            <a href={colorSourceUrl} target="_blank" rel="noreferrer">
              代表色来源
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface PageIntroProps {
  title: string
  description: string
  meta?: string
}

export function PageIntro({ title, description, meta }: PageIntroProps) {
  return (
    <section className="page-intro" aria-labelledby="page-title">
      <div>
        <h1 id="page-title">{title}</h1>
        <p>{description}</p>
      </div>
      {meta ? <p className="page-meta">{meta}</p> : null}
    </section>
  )
}
