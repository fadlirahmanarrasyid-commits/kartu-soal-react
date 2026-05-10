import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import KaTeX CSS and extensions
import 'katex/dist/katex.min.css';
import 'katex/dist/contrib/mhchem'; // Chemistry support

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
