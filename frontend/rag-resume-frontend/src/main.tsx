import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ParentContainer from './components/ParentContainer.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ParentContainer/>
  </StrictMode>,
)
