import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './index.css'

const apiBaseUrl = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3103' : '')).replace(/\/$/, '')

axios.defaults.baseURL = apiBaseUrl
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
