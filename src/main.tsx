import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MockProvider } from './context/MockContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MockProvider forceMock={true}>
      <App />
    </MockProvider>
  </StrictMode>,
)
