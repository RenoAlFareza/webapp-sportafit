// src/services/bookingHistoryService.js

// Fungsi untuk menyimpan pemesanan baru ke localStorage
export const saveBookingToHistory = (bookingData) => {
  try {
    // Generate ID transaksi
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const suffix = Math.floor(Math.random() * 90 + 10);

    const transactionId = `INV-${year}${month}${day}-${random}-${suffix}`;

    // Tambahkan ID transaksi dan status ke data booking
    const bookingWithId = {
      ...bookingData,
      id: transactionId,
      status: 'Menunggu',
      createdAt: new Date().toISOString(),
      expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 menit dari sekarang
      isPaid: false,
      // Tambahkan data pengguna default jika tidak ada
      user: bookingData.user || {
        name: "Reno Al Fareza",
        email: "renoalfareza@gmail.com",
        phone: "08123456789"
      }
    };

    // Ambil data booking yang sudah ada
    const existingBookings = getBookingHistory();

    // Tambahkan booking baru
    const updatedBookings = [bookingWithId, ...existingBookings];

    // Simpan kembali ke localStorage
    localStorage.setItem('bookingHistory', JSON.stringify(updatedBookings));

    return bookingWithId;
  } catch (error) {
    console.error('Error saving booking to history:', error);
    return null;
  }
};

// Fungsi untuk mengambil semua riwayat pemesanan
export const getBookingHistory = () => {
  try {
    const bookingHistory = localStorage.getItem('bookingHistory');
    return bookingHistory ? JSON.parse(bookingHistory) : [];
  } catch (error) {
    console.error('Error getting booking history:', error);
    return [];
  }
};

// Fungsi untuk mengambil detail pemesanan berdasarkan ID
export const getBookingById = (id) => {
  try {
    console.log('Getting booking by ID:', id);

    if (!id) {
      console.error('Invalid booking ID:', id);
      return null;
    }

    // Cek di booking history
    const bookings = getBookingHistory();
    console.log('Checking in booking history, found bookings:', bookings.length);

    if (Array.isArray(bookings) && bookings.length > 0) {
      const booking = bookings.find(booking => booking.id === id);
      if (booking) {
        console.log('Found booking in booking history:', booking);
        return booking;
      }
    }

    // Jika tidak ada di booking history, cek di transactions
    const transactions = getTransactions();
    console.log('Checking in transactions, found transactions:', transactions.length);

    if (Array.isArray(transactions) && transactions.length > 0) {
      const transaction = transactions.find(transaction => transaction.id === id);
      if (transaction) {
        console.log('Found transaction in transactions:', transaction);
        return transaction;
      }
    }

    console.log('Booking not found in either booking history or transactions');
    return null;
  } catch (error) {
    console.error('Error getting booking by ID:', error);
    return null;
  }
};

// Fungsi untuk memperbarui status pemesanan
export const updateBookingStatus = (id, status, isPaid = false) => {
  try {
    const bookings = getBookingHistory();
    const updatedBookings = bookings.map(booking => {
      if (booking.id === id) {
        return { ...booking, status, isPaid };
      }
      return booking;
    });

    localStorage.setItem('bookingHistory', JSON.stringify(updatedBookings));
    return true;
  } catch (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
};

// Fungsi untuk menghapus pemesanan yang sudah kadaluarsa dan memindahkannya ke transaksi
export const removeExpiredBookings = () => {
  try {
    const bookings = getBookingHistory();
    const now = new Date();
    const expiredBookings = [];

    const validBookings = bookings.filter(booking => {
      // Jika sudah dibayar, tetap simpan
      if (booking.isPaid) return true;

      // Jika belum dibayar, cek apakah sudah kadaluarsa
      const expiryTime = new Date(booking.expiryTime);
      const isValid = now < expiryTime;

      // Jika sudah kadaluarsa, tambahkan ke daftar expired
      if (!isValid) {
        expiredBookings.push({
          ...booking,
          status: 'Kadaluarsa',
          isPaid: false,
          completedAt: now.toISOString()
        });
      }

      return isValid;
    });

    // Simpan booking yang masih valid
    localStorage.setItem('bookingHistory', JSON.stringify(validBookings));

    // Pindahkan booking yang kadaluarsa ke transaksi
    if (expiredBookings.length > 0) {
      addTransactions(expiredBookings);
    }

    return validBookings;
  } catch (error) {
    console.error('Error removing expired bookings:', error);
    return getBookingHistory();
  }
};

// Fungsi untuk memindahkan booking ke transaksi
export const moveBookingToTransaction = (id, status = 'Berhasil', additionalData = {}) => {
  try {
    console.log('Moving booking to transaction:', id, status);

    if (!id) {
      console.error('Invalid booking ID:', id);
      return false;
    }

    // Ambil booking dari history
    const bookings = getBookingHistory();
    console.log('Current bookings:', bookings);

    if (!Array.isArray(bookings)) {
      console.error('Bookings is not an array:', bookings);
      return false;
    }

    const bookingIndex = bookings.findIndex(booking => booking.id === id);
    console.log('Booking index:', bookingIndex);

    if (bookingIndex === -1) {
      console.error('Booking not found:', id);
      return false;
    }

    // Ambil booking dan hapus dari history
    const booking = bookings[bookingIndex];
    console.log('Found booking:', booking);

    bookings.splice(bookingIndex, 1);

    // Simpan history yang sudah diupdate
    localStorage.setItem('bookingHistory', JSON.stringify(bookings));
    console.log('Updated booking history:', bookings);

    // Tambahkan ke transaksi
    const transaction = {
      ...booking,
      ...additionalData,
      status,
      isPaid: status === 'Berhasil',
      completedAt: new Date().toISOString(),
      // Tambahkan data pengguna default jika tidak ada
      user: booking.user || {
        name: "Pengguna",
        email: "user@example.com",
        phone: "08123456789"
      }
    };
    console.log('New transaction:', transaction);

    // Tambahkan transaksi baru
    const result = addTransactions([transaction]);
    console.log('Add transaction result:', result);

    if (!result) {
      console.error('Failed to add transaction');
      // Kembalikan booking ke history jika gagal menambahkan transaksi
      const updatedBookings = getBookingHistory();
      localStorage.setItem('bookingHistory', JSON.stringify([booking, ...updatedBookings]));
      return false;
    }

    // Verifikasi transaksi sudah ditambahkan
    const updatedTransactions = getTransactions();
    console.log('Updated transactions:', updatedTransactions);
    console.log('Transaction count after update:', updatedTransactions.length);

    // Verifikasi transaksi baru ada di daftar transaksi
    const transactionAdded = updatedTransactions.some(t => t.id === id);
    console.log('Transaction added successfully:', transactionAdded);

    return true;
  } catch (error) {
    console.error('Error moving booking to transaction:', error);
    return false;
  }
};

// Fungsi untuk mengambil semua transaksi
export const getTransactions = () => {
  try {
    console.log('Attempting to get transactions from localStorage');
    const transactions = localStorage.getItem('transactions');
    console.log('Raw transactions from localStorage:', transactions);

    if (!transactions) {
      console.log('No transactions found in localStorage');
      return [];
    }

    const parsedTransactions = JSON.parse(transactions);
    console.log('Parsed transactions:', parsedTransactions);

    if (!Array.isArray(parsedTransactions)) {
      console.error('Parsed transactions is not an array:', parsedTransactions);
      return [];
    }

    return parsedTransactions;
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

// Fungsi untuk menambahkan transaksi baru
export const addTransactions = (newTransactions) => {
  try {
    console.log('Adding new transactions:', newTransactions);

    if (!newTransactions || !Array.isArray(newTransactions) || newTransactions.length === 0) {
      console.error('Invalid newTransactions:', newTransactions);
      return false;
    }

    const existingTransactions = getTransactions();
    console.log('Existing transactions before adding:', existingTransactions);

    // Pastikan existingTransactions adalah array
    const safeExistingTransactions = Array.isArray(existingTransactions) ? existingTransactions : [];

    const updatedTransactions = [...newTransactions, ...safeExistingTransactions];
    console.log('Updated transactions to save:', updatedTransactions);

    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    // Verifikasi data tersimpan
    const verifyTransactions = localStorage.getItem('transactions');
    console.log('Verified raw transactions after save:', verifyTransactions);

    try {
      const parsedVerify = JSON.parse(verifyTransactions);
      console.log('Parsed verified transactions:', parsedVerify);
      console.log('Transactions count after save:', parsedVerify.length);
    } catch (parseError) {
      console.error('Error parsing verified transactions:', parseError);
    }

    return true;
  } catch (error) {
    console.error('Error adding transactions:', error);
    return false;
  }
};

// Fungsi untuk menghitung sisa waktu dalam detik
export const getRemainingTime = (expiryTimeString) => {
  try {
    const now = new Date();
    const expiryTime = new Date(expiryTimeString);

    const diffInSeconds = Math.floor((expiryTime - now) / 1000);
    return diffInSeconds > 0 ? diffInSeconds : 0;
  } catch (error) {
    console.error('Error calculating remaining time:', error);
    return 0;
  }
};

// Fungsi untuk memformat waktu (mm:ss)
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// Fungsi untuk menghapus semua transaksi (untuk debugging)
export const clearAllTransactions = () => {
  try {
    localStorage.removeItem('transactions');
    console.log('All transactions cleared');
    return true;
  } catch (error) {
    console.error('Error clearing transactions:', error);
    return false;
  }
};

// Fungsi untuk menghapus semua booking history (untuk debugging)
export const clearAllBookingHistory = () => {
  try {
    localStorage.removeItem('bookingHistory');
    console.log('All booking history cleared');
    return true;
  } catch (error) {
    console.error('Error clearing booking history:', error);
    return false;
  }
};

export default {
  saveBookingToHistory,
  getBookingHistory,
  getBookingById,
  updateBookingStatus,
  removeExpiredBookings,
  moveBookingToTransaction,
  getTransactions,
  addTransactions,
  getRemainingTime,
  formatTime,
  clearAllTransactions,
  clearAllBookingHistory
};
