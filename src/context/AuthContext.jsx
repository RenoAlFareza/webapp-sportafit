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
        // Cek apakah ada data user di localStorage
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        // Untuk demo, selalu pastikan ada token dummy
        if (!token) {
          localStorage.setItem("token", "dummy-token-123");
        }

        if (storedUser) {
          // Jika ada user di localStorage, gunakan itu
          const userData = JSON.parse(storedUser);

          // Pastikan user memiliki token
          if (!userData.token) {
            userData.token = "dummy-token-123";
            localStorage.setItem("user", JSON.stringify(userData));
          }

          setUser(userData);
          setLoading(false);
          return;
        } else {
          // Jika tidak ada user di localStorage, buat user dummy
          const dummyUser = {
            id: "user123",
            name: "Fajar Nugros",
            email: "designgraphic.fernando@gmail.com",
            phone: "0812-1130-7064",
            token: "dummy-token-123",
            photoUrl: "" // Tambahkan properti photoUrl
          };

          localStorage.setItem("user", JSON.stringify(dummyUser));
          localStorage.setItem("token", "dummy-token-123");
          setUser(dummyUser);
          setLoading(false);
          return;
        }

        // Kode di bawah ini akan digunakan saat backend sudah siap
        /*
        // Verifikasi token dengan backend
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

            // Buat user dummy untuk demo
            const dummyUser = {
              id: "user123",
              name: "Fajar Nugros",
              email: "designgraphic.fernando@gmail.com",
              phone: "0812-1130-7064",
              token: "dummy-token-123"
            };

            localStorage.setItem("user", JSON.stringify(dummyUser));
            localStorage.setItem("token", "dummy-token-123");
            setUser(dummyUser);
          }
        }
        */
      } catch (err) {
        console.error("Error checking authentication:", err);
        setError(err.message);

        // Jika terjadi error, tetap buat user dummy untuk demo
        const dummyUser = {
          id: "user123",
          name: "Fajar Nugros",
          email: "designgraphic.fernando@gmail.com",
          phone: "0812-1130-7064",
          token: "dummy-token-123",
          photoUrl: "" // Tambahkan properti photoUrl
        };

        localStorage.setItem("user", JSON.stringify(dummyUser));
        localStorage.setItem("token", "dummy-token-123");
        setUser(dummyUser);
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
      const dummyUser = {
        id: "user123",
        name: "Fajar Nugros",
        email: email || "designgraphic.fernando@gmail.com",
        phone: "0812-1130-7064",
        token: "dummy-token-123",
        photoUrl: "" // Tambahkan properti photoUrl
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
    // Hapus data user dan token dari localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Reset state
    setUser(null);

    // Redirect ke halaman login
    navigate("/login");
  };

  // Fungsi untuk mengupdate data user
  const updateUserData = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      // Untuk demo, kita akan skip bagian ini karena backend belum siap
      /*
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update profil gagal");
      }

      // Update user di localStorage dan state
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      return updatedUser;
      */

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
