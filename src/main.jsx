import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { LocationProvider } from './context/LocationContext' // 
import { PaymentProvider } from './context/PaymentContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocationProvider> 
      <PaymentProvider>
        <BrowserRouter>   
          <App />
        </BrowserRouter>
      </PaymentProvider>
    </LocationProvider>
  </React.StrictMode>
)
