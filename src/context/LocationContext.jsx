import { createContext, useState, useContext } from "react";

// 1. Buat context
const LocationContext = createContext();

// 2. Buat provider
export function LocationProvider({ children }) {
  const [location, setLocation] = useState("SURABAYA");

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

// 3. Buat hook custom agar gampang dipakai
export function useLocation() {
  return useContext(LocationContext);
}
