import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute } from './routes/PrivateRoute'

/* ===== PUBLIC ===== */
import LoginUser from './pages/LoginUser'
import Login from './pages/Login'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'

/* ===== CORE ===== */
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
import RechargeServices from "./pages/recharges/RechargeServices";
import RechargeCategories from "./pages/recharges/RechargeCategories";
import RechargePlans from "./pages/recharges/RechargePlans";
import RechargeCheckout from "./pages/recharges/RechargeCheckout";
import Payments from "./pages/payments/Payments";
import PaymentCheckout from "./pages/payments/PaymentCheckout";
import Dashboard from "./pages/dashboard/Dashboard";
import MyRecharges from "./pages/recharges/MyRecharges";

/* ===== PROFILE ===== */
import Bank from './pages/Bank'
import Transactions from './pages/Transactions'
import Gift from './pages/Gift'
import Security from './pages/Security'
import Password from './pages/Password'
import KYCPage from './pages/user/KYCPage'
import Settings from './pages/Settings'

/* ===== SERVICES ===== */
import Services from './pages/services/Services'

/* ===== TRANSFER ===== */
import { Transfer } from './pages/Transfer'

/* ===== WITHDRAW ===== */
import WithdrawAOA from './pages/WithdrawAOA'

/* ===== LEGAL ===== */
import Terms from './pages/Terms'
import PrivacyPolicy from './pages/PrivacyPolicy'

/* ===== UI ===== */
import { Toaster } from 'react-hot-toast'

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
            padding: '16px 20px',
            borderRadius: '16px',
            fontSize: '15px',
            fontWeight: '500'
          }
        }}
      />

      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route path="/login-user" element={<LoginUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />

        {/* ================= PRIVATE ================= */}

        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >

          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* HOME */}
          <Route path="home" element={<Home />} />

          {/* HISTORY */}
          <Route path="history" element={<History />} />

          {/* PROFILE */}
          <Route path="profile" element={<Profile />} />
          <Route path="bank" element={<Bank />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="gift" element={<Gift />} />
          <Route path="security" element={<Security />} />
          <Route path="password" element={<Password />} />
          <Route path="kyc" element={<KYCPage />} />
          <Route path="settings" element={<Settings />} />

          {/* SERVICES */}
          <Route path="services" element={<Services />} />

          {/* TRANSFER */}
          <Route path="transfer" element={<Transfer />} />

          {/* WITHDRAW */}
          <Route path="withdraw/aoa" element={<WithdrawAOA />} />

          {/* FINANCIAL */}
          <Route path="deposit" element={<Deposit />} />
          <Route
            path="deposit/banks/:rechargeId"
            element={<DepositBanks />}
          />
          <Route
            path="recharge-history"
            element={<RechargeHistory />}
          />
          <Route path="withdraw" element={<Withdraw />} />
          <Route
            path="withdraw-history"
            element={<WithdrawHistory />}
          />

          <Route
            path="recharges"
            element={<RechargeServices />}
          />
           
           <Route
             path="/recharges/:serviceId"
             element={<RechargeCategories />}
          />

             <Route
               path="/recharges/:serviceId/categories/:categoryId"
               element={<RechargePlans />}
          />

          <Route
            path="/recharges/:serviceId/categories/:categoryId/plans/:planId"
            element={<RechargeCheckout />}
          />

          <Route
            path="/payments"
            element={<Payments />}
         />

          <Route
            path="/payments/:paymentId"
            element={<PaymentCheckout />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/my-recharges"
            element={<MyRecharges />}
           />

          {/* NOTIFICATIONS */}
          <Route
            path="notifications"
            element={<Notifications />}
          />

        </Route>

        {/* FALLBACK */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </AuthProvider>
  )
}

export default App