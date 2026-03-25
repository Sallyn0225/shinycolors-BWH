import { Suspense, lazy } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { StaggeredMenu } from './components/StaggeredMenu'
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

const navigationItems = [
  {
    label: '首页排行',
    description: '按当前指标浏览全员顺位',
    to: '/',
    ariaLabel: '切换到首页排行',
    end: true,
  },
  {
    label: '小组页',
    description: '按组合查看成员差异',
    to: '/units',
    ariaLabel: '切换到小组页',
    end: false,
  },
  {
    label: '双人对比',
    description: '选择两位偶像进行对照',
    to: '/compare',
    ariaLabel: '切换到双人对比页',
    end: false,
  },
] as const

export default function App() {
  const location = useLocation()
  const activeView =
    navigationItems.find((item) =>
      item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
    ) ?? navigationItems[0]

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
          <Link className="brand-mark" to="/">
            B/W/H VISUAL ARCHIVE
          </Link>
        </div>

        <div className="header-current" aria-live="polite">
          <p className="brand-kicker">Current Section</p>
          <strong>{activeView.label}</strong>
        </div>

        <div className="header-utility">
          <div className="header-edition" aria-label="当前刊次">
            <span>Issue</span>
            <strong>03</strong>
          </div>
          <StaggeredMenu items={[...navigationItems]} />
        </div>
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
