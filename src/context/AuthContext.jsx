// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Buat context
export const AuthContext = createContext();

// Custom hook untuk menggunakan AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cek apakah user sudah login saat aplikasi dimuat
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Reset user state to null first
        setUser(null);

        // Cek apakah ada data user di localStorage
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          try {
            // Jika ada user di localStorage, gunakan itu
            const userData = JSON.parse(storedUser);

            // Pastikan user data valid
            if (userData && userData.token) {
              setUser(userData);
            } else {
              // User data tidak valid, hapus dari localStorage
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              setUser(null);
            }
          } catch (parseError) {
            // Error parsing user data, hapus dari localStorage
            console.error("Error parsing user data:", parseError);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
          }
        } else {
          // Tidak ada user di localStorage
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
        }

        // Kode di bawah ini akan digunakan saat backend sudah siap
        /*
        // Verifikasi token dengan backend
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("/api/auth/me", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            // Token tidak valid, hapus dari localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
        */
      } catch (err) {
        console.error("Error checking authentication:", err);
        setError(err.message);
        setUser(null);

        // Hapus data user jika terjadi error
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Fungsi login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Untuk demo, kita akan skip bagian ini karena backend belum siap
      /*
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      // Simpan user dan token di localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.user.token);

      // Update state
      setUser(data.user);

      return data.user;
      */

      // Untuk demo, kita akan membuat user dummy
      // Gunakan email sebagai basis untuk nama user
      const userName = email ? email.split('@')[0] : "User";

      const dummyUser = {
        id: "user123",
        name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize first letter
        email: email || "user@example.com",
        phone: "0812-1130-7064",
        token: "dummy-token-123"
      };

      // Simpan user dan token di localStorage
      localStorage.setItem("user", JSON.stringify(dummyUser));
      localStorage.setItem("token", "dummy-token-123");

      // Update state
      setUser(dummyUser);

      return dummyUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fungsi logout
  const logout = () => {
    // Hapus semua data auth
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.clear(); // Untuk berjaga-jaga

    // Reset state
    setUser(null);

    // Redirect ke login
    navigate("/login");
  };

  // Fungsi untuk mengupdate data user
  const updateUserData = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Pastikan user sudah login
      if (!user) {
        throw new Error("User belum login");
      }

      // Untuk demo, kita akan update data di localStorage saja
      const updatedUser = { ...user, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Nilai yang akan disediakan oleh context
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
