//import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // Don't enable strict mode, it messes up with how useEffect works (sometimes calls it twice when it should only run once)
  //<React.StrictMode>
    <App />
  //</React.StrictMode>,
)
