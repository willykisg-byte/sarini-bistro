import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import StaffPage from './components/StaffPage.tsx'

const isStaffPage = window.location.pathname.replace(/\/$/, '') === '/staff'

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isStaffPage ? <StaffPage /> : <App />}</StrictMode>,
)
