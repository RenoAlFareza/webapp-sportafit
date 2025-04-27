import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { LocationProvider } from './context/LocationContext'
import { PaymentProvider } from './context/PaymentContext'
import { AuthProvider } from './context/AuthContext'
import { VoucherProvider } from './context/VoucherContext'

// Clear localStorage if there's no valid user session
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    // Try to parse the user data to validate it
    const userData = JSON.parse(storedUser);
    if (!userData || !userData.token) {
      // Invalid user data, clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }
} catch (error) {
  // If there's an error parsing the user data, clear localStorage
  console.error("Error parsing user data:", error);
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LocationProvider>
        <PaymentProvider>
          <AuthProvider>
            <VoucherProvider>
              <App />
            </VoucherProvider>
          </AuthProvider>
        </PaymentProvider>
      </LocationProvider>
    </BrowserRouter>
  </React.StrictMode>
)
