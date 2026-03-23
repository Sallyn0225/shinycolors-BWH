import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { RankingPreferencesProvider } from './state/ranking-preferences'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RankingPreferencesProvider>
        <App />
      </RankingPreferencesProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
