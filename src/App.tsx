import { Suspense, lazy } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

const UnitsPage = lazy(async () => {
  const module = await import('./pages/UnitsPage')
  return { default: module.UnitsPage }
})

const ComparePage = lazy(async () => {
  const module = await import('./pages/ComparePage')
  return { default: module.ComparePage }
})

function NotFoundPage() {
  return (
    <main className="page page-not-found" id="main-content" tabIndex={-1}>
      <section className="hero-panel compare-page-intro">
        <div className="hero-copy">
          <p className="eyebrow">404</p>
          <h1>页面不存在</h1>
          <p className="hero-intro">这个地址没有对应内容，可以回到首页继续浏览，或前往其他页面。</p>
          <div className="hero-links">
            <Link className="hero-link is-primary" to="/">
              返回首页
            </Link>
            <Link className="hero-link" to="/units">
              查看小组页
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>

      <div className="app-backdrop" aria-hidden="true">
        <div className="backdrop-blur backdrop-a" />
        <div className="backdrop-blur backdrop-b" />
        <div className="backdrop-blur backdrop-c" />
      </div>

      <header className="site-header">
        <div className="brand-block">
          <p className="brand-kicker">283 PRODUCTION</p>
          <span className="brand-mark">B/W/H VISUALIZER</span>
        </div>

        <nav className="site-nav" aria-label="主导航">
          <NavLink to="/" end>
            首页排行
          </NavLink>
          <NavLink to="/units">小组页</NavLink>
          <NavLink to="/compare">双人对比</NavLink>
        </nav>
      </header>

      <Suspense
        fallback={
          <main className="page" id="main-content" tabIndex={-1}>
            <section className="hero-panel compare-page-intro">
              <div className="hero-copy">
                <p className="eyebrow">Loading</p>
                <h1>正在载入页面</h1>
                <p className="hero-intro">请稍候，内容正在准备中。</p>
              </div>
            </section>
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  )
}
