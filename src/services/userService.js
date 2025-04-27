// src/services/userService.js

const API_BASE_URL = "/api"; // Sesuaikan dengan base URL API Anda

export const UserService = {
  // Mendapatkan profil user
  getProfile: async () => {
    try {
      // Untuk demo, selalu pastikan ada token dummy
      let token = localStorage.getItem("token");
      if (!token) {
        token = "dummy-token-123";
        localStorage.setItem("token", token);
      }

      // Untuk demo, kita akan mengembalikan data dari localStorage
      // Dalam implementasi sebenarnya, ini akan mengambil data dari backend
      let storedUser = localStorage.getItem("user");

      if (storedUser) {
        // Pastikan user memiliki token
        const userData = JSON.parse(storedUser);
        if (!userData.token) {
          userData.token = token;
          localStorage.setItem("user", JSON.stringify(userData));
        }
        return { user: userData };
      } else {
        // Jika tidak ada user di localStorage, buat user dummy
        // Coba ambil email dari localStorage jika ada
        let email = "user@example.com";
        try {
          const storedEmail = localStorage.getItem("lastEmail");
          if (storedEmail) {
            email = storedEmail;
          }
        } catch (e) {
          console.error("Error getting email from localStorage:", e);
        }

        // Gunakan email sebagai basis untuk nama user
        const userName = email.split('@')[0];

        const dummyUser = {
          id: "user123",
          name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize first letter
          email: email,
          phone: "0812-1130-7064",
          token: token
        };

        localStorage.setItem("user", JSON.stringify(dummyUser));
        return { user: dummyUser };
      }

      // Kode di bawah ini akan digunakan saat backend sudah siap
      /*
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal mengambil data profil");
      }

      return await response.json();
      */
    } catch (error) {
      console.error("Error getting user profile:", error);

      // Untuk demo, jika terjadi error, tetap kembalikan user dummy
      // Coba ambil email dari localStorage jika ada
      let email = "user@example.com";
      try {
        const storedEmail = localStorage.getItem("lastEmail");
        if (storedEmail) {
          email = storedEmail;
        }
      } catch (e) {
        console.error("Error getting email from localStorage:", e);
      }

      // Gunakan email sebagai basis untuk nama user
      const userName = email.split('@')[0];

      const dummyUser = {
        id: "user123",
        name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize first letter
        email: email,
        phone: "0812-1130-7064",
        token: "dummy-token-123"
      };

      localStorage.setItem("user", JSON.stringify(dummyUser));
      localStorage.setItem("token", "dummy-token-123");

      return { user: dummyUser };
    }
  },

  // Mengupdate profil user
  updateProfile: async (userData) => {
    try {
      // Untuk demo, selalu pastikan ada token dummy
      let token = localStorage.getItem("token");
      if (!token) {
        token = "dummy-token-123";
        localStorage.setItem("token", token);
      }

      // Untuk demo, kita akan update data di localStorage
      // Dalam implementasi sebenarnya, ini akan mengirim data ke backend
      let storedUser = localStorage.getItem("user");

      if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        // Pastikan token tetap ada
        const updatedUser = {
          ...currentUser,
          ...userData,
          token: currentUser.token || token
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { user: updatedUser };
      } else {
        // Jika tidak ada user di localStorage, buat user dummy dengan data yang diberikan
        const dummyUser = {
          id: "user123",
          ...userData,
          token: token
        };

        localStorage.setItem("user", JSON.stringify(dummyUser));
        return { user: dummyUser };
      }

      // Kode di bawah ini akan digunakan saat backend sudah siap
      /*
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal mengupdate profil");
      }

      return await response.json();
      */
    } catch (error) {
      console.error("Error updating user profile:", error);

      // Untuk demo, jika terjadi error, tetap update data di localStorage
      try {
        let storedUser = localStorage.getItem("user");
        if (storedUser) {
          const currentUser = JSON.parse(storedUser);
          const updatedUser = { ...currentUser, ...userData };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          return { user: updatedUser };
        } else {
          // Jika tidak ada user di localStorage, buat user dummy dengan data yang diberikan
          const dummyUser = {
            id: "user123",
            ...userData,
            token: "dummy-token-123"
          };

          localStorage.setItem("user", JSON.stringify(dummyUser));
          localStorage.setItem("token", "dummy-token-123");
          return { user: dummyUser };
        }
      } catch (innerError) {
        console.error("Error in error handling:", innerError);
        throw error;
      }
    }
  },

  // Mengubah password
  changePassword: async (currentPassword, newPassword) => {
    try {
      // Untuk demo, selalu pastikan ada token dummy
      let token = localStorage.getItem("token");
      if (!token) {
        token = "dummy-token-123";
        localStorage.setItem("token", token);
      }

      // Untuk demo, kita akan mengembalikan respons sukses
      // Dalam implementasi sebenarnya, ini akan mengirim data ke backend
      return { success: true, message: "Password berhasil diubah" };

      // Kode di bawah ini akan digunakan saat backend sudah siap
      /*
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal mengubah password");
      }

      return await response.json();
      */
    } catch (error) {
      console.error("Error changing password:", error);

      // Untuk demo, jika terjadi error, tetap kembalikan respons sukses
      return { success: true, message: "Password berhasil diubah (demo mode)" };
    }
  }
};

export default UserService;
