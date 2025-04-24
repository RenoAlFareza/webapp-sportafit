// src/context/PaymentContext.jsx
import React, { createContext, useState } from "react";

export const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [methods] = useState([
    { id: "dana",  name: "DANA",   balance: 1850429, icon: "/icons/dana.png" },
    { id: "ovo",   name: "OVO",    balance:   95000, icon: "/icons/ovo.png" },
    { id: "gopay", name: "GoPay",  balance:  120000, icon: "/icons/gopay.png" },
  ]);

  return (
    <PaymentContext.Provider value={{ methods }}>
      {children}
    </PaymentContext.Provider>
  );
}
