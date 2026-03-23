import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { MetricToggle } from './components/MetricToggle'
import { HomePage } from './pages/HomePage'
import { UnitsPage } from './pages/UnitsPage'
import { ComparePage } from './pages/ComparePage'

export default function App() {
  const location = useLocation()
  const showDirection = location.pathname !== '/compare'

  return (
    <div className="app-shell">
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

        <div className="site-header-controls">
          <MetricToggle showDirection={showDirection} />
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/units" element={<UnitsPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </div>
  )
}
