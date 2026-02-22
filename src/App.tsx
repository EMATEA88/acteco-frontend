import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute } from './routes/PrivateRoute'

/* ===== PUBLIC ===== */
import Login from './pages/Login'
import Register from './pages/Register'

/* ===== CORE APP ===== */
import Home from './pages/Home'
import History from './pages/History'
import Profile from './pages/Profile'
import About from './pages/About'
import Notifications from './pages/Notifications'

/* ===== FINANCE ===== */
import Deposit from './pages/Deposit'
import DepositBanks from './pages/DepositBanks'
import RechargeHistory from './pages/RechargeHistory'
import Withdraw from './pages/Withdraw'
import WithdrawHistory from './pages/WithdrawHistory'

/* ===== PROFILE MODULES ===== */
import Bank from './pages/Bank'
import Transactions from './pages/Transactions'
import Gift from './pages/Gift'
import Security from './pages/Security'
import Password from './pages/Password'
import Services from './pages/services/Services'
import PartnerPlans from './pages/PartnerPlans'
import KYCPage from './pages/user/KYCPage'
import Applications from './pages/user/Applications'

/* ===== OTC USER ===== */
import OtcPage from "./pages/otc/OtcPage"
import OtcDetail from "./pages/otc/OtcDetail"
import OtcChat from "./pages/otc/OtcChat"
import OtcOrder from "./pages/otc/OtcOrder"
import OtcMyOrders from "./pages/otc/OtcMyOrders"

import { Toaster } from "react-hot-toast"

/* ===== LAYOUT ===== */
import AppLayout from './layouts/AppLayout'

function App() {
  return (
    <AuthProvider>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            padding: "16px 20px",
            borderRadius: "16px",
            fontSize: "15px",
            fontWeight: "500"
          }
        }}
      />

      <Routes>

        {/* =====================
            PUBLIC ROUTES
        ===================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* =====================
            PRIVATE APP
        ===================== */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >

          <Route index element={<Navigate to="home" replace />} />

          {/* MAIN */}
          <Route path="home" element={<Home />} />
          <Route path="history" element={<History />} />
          <Route path="about" element={<About />} />

          {/* PROFILE */}
          <Route path="profile" element={<Profile />} />
          <Route path="bank" element={<Bank />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="gift" element={<Gift />} />
          <Route path="security" element={<Security />} />
          <Route path="password" element={<Password />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<PartnerPlans />} />
          <Route path="kyc" element={<KYCPage />} />

          {/* OTC */}
          <Route path="otc" element={<OtcPage />} />
          <Route path="otc/:assetId/:type" element={<OtcDetail />} />
          <Route path="otc/orders/:orderId" element={<OtcChat />} />
          <Route path="otc/order/:orderId" element={<OtcOrder />} />
          <Route path="otc/orders" element={<OtcMyOrders />} />

          {/* FINANCIAL */}
          <Route path="deposit" element={<Deposit />} />
          <Route path="deposit/banks/:rechargeId" element={<DepositBanks />} />
          <Route path="recharge-history" element={<RechargeHistory />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="withdraw-history" element={<WithdrawHistory />} />

          {/* APPLICATIONS */}
          <Route path="applications" element={<Applications />} />

          {/* NOTIFICATIONS */}
          <Route path="notifications" element={<Notifications />} />

        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </AuthProvider>
  )
}

export default App