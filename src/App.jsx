// src/App.jsx

import { Routes, Route } from "react-router-dom";

import Login                   from "./pages/login_section/Login";
import Register                from "./pages/login_section/Register";
import Personaldata            from "./pages/login_section/Personaldata";
import ForgotPassword          from "./pages/login_section/ForgotPassword";
import Verification            from "./pages/login_section/Verification";
import NewPassword             from "./pages/login_section/NewPassword";
import Done                    from "./pages/login_section/Done";
import SocialAuthSuccess       from "./pages/login_section/SocialAuthSuccess";

// Auth pages with backend integration
import AuthLogin               from "./pages/auth/Login";
import DemoLogin               from "./pages/auth/DemoLogin";

import Home                    from "./pages/main_menu/Home";
import LocationSelector        from "./pages/main_menu/LocationSelector";

import Profil1                 from "./pages/profile/Profil1";
import EditProfil1             from "./pages/profile/EditProfil1";
import Voucher1                from "./pages/profile/Voucher1";
import Voucher2                from "./pages/profile/Voucher2";
import MyVoucher               from "./pages/profile/MyVoucher";
import Voucher_SK              from "./pages/profile/Voucher_SK";
import Voucher_CP              from "./pages/profile/Voucher_CP";
import Voucher_Info            from "./pages/profile/Voucher_Info";
import Pemberitahuan1          from "./pages/profile/Pemberitahuan1";
import NonAktifAkun1           from "./pages/profile/NonAktifAkun1";
import UbahPin1                from "./pages/profile/UbahPin1";
import KebijakanPrivasi1       from "./pages/profile/KebijakanPrivasi1";
import FAQ1                    from "./pages/profile/FAQ1";

import Arena                   from "./pages/pemesanan/arena";
import DetailArena             from "./pages/pemesanan/DetailArena";
import LapanganBooking         from "./pages/pemesanan/LapanganBooking";
import PaymentDetail           from "./pages/pemesanan/PaymentDetail";
import PaymentConfirmation     from "./pages/pemesanan/PaymentConfirmation";
import PaymentSuccess          from "./pages/pemesanan/PaymentSuccess";
import ListPemesanan           from "./pages/pemesanan/ListPemesanan";

import Transactions            from "./pages/transaksi/Transactions";
import DetailTransaction       from "./pages/transaksi/DetailTransactions";
import DetailTransactionFailed from "./pages/transaksi/DetailTransactionFailed";
import Invoice                 from "./pages/transaksi/Invoice";
import InvoiceFailed           from "./pages/transaksi/InvoiceFailed";

// Debug pages
import DebugTransactions       from "./pages/debug/DebugTransactions";

function App() {
  return (
    <Routes>
      {/* -------- Auth & Onboarding -------- */}
      <Route path="/"                element={<Home />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/auth/login"      element={<AuthLogin />} />
      <Route path="/demo-login"       element={<DemoLogin />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/personaldata"    element={<Personaldata />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verification"    element={<Verification />} />
      <Route path="/new-password"    element={<NewPassword />} />
      <Route path="/done"            element={<Done />} />
      <Route path="/home"            element={<Home />} />
      <Route path="/social-auth-success" element={<SocialAuthSuccess />} />

      {/* -------- Main Menu -------- */}
      <Route path="/lokasi" element={<LocationSelector />} />

      {/* -------- Profile -------- */}
      <Route path="/profil"            element={<Profil1 />} />
      <Route path="/profil1"           element={<Profil1 />} />
      <Route path="/edit-profil"       element={<EditProfil1 />} />
      <Route path="/voucher"           element={<Voucher1 />} />
      <Route path="/voucher/:id"       element={<Voucher2 />} />
      <Route path="/my-voucher"        element={<MyVoucher />} />
      <Route path="/voucher-sk"        element={<Voucher_SK />} />
      <Route path="/voucher-cp"        element={<Voucher_CP />} />
      <Route path="/voucher-info"      element={<Voucher_Info />} />
      <Route path="/pemberitahuan"     element={<Pemberitahuan1 />} />
      <Route path="/nonaktif-akun"     element={<NonAktifAkun1 />} />
      <Route path="/ubah-pin"          element={<UbahPin1 />} />
      <Route path="/kebijakan-privasi" element={<KebijakanPrivasi1 />} />
      <Route path="/faq"               element={<FAQ1 />} />

      {/* -------- Arena & Booking -------- */}
      <Route path="/arena"                element={<Arena />} />
      <Route path="/arena/:id"            element={<DetailArena />} />
      <Route path="/lapangan-booking/:id" element={<LapanganBooking />} />
      <Route path="/payment-detail/:id"   element={<PaymentDetail />} />
      <Route path="/konfirmasi-pembayaran" element={<PaymentConfirmation />} />
      <Route path="/pembayaran-sukses"     element={<PaymentSuccess />} />
      <Route path="/pemesanan"            element={<ListPemesanan />} />

      {/* -------- Transactions & Invoice -------- */}
      <Route path="/transaksi"             element={<Transactions />} />
      <Route path="/transaksi/success/:id" element={<DetailTransaction />} />
      <Route path="/transaksi/failed/:id"  element={<DetailTransactionFailed />} />
      <Route path="/invoice/:id"           element={<Invoice />} />
      <Route path="/invoice-failed/:id"    element={<InvoiceFailed />} />

      {/* -------- Debug Routes -------- */}
      <Route path="/debug/transactions"    element={<DebugTransactions />} />
    </Routes>
  );
}

export default App;
