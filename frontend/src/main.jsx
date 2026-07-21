import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'

import { TooltipProvider } from '@/components/ui/tooltip'


ReactDOM.createRoot(document.getElementById('root')).render(
  <TooltipProvider>
    <Router>
      <App />
    </Router>
  </TooltipProvider>
)