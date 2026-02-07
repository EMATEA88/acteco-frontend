import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute } from './routes/PrivateRoute'

/* ===== PUBLIC ===== */
import Login from './pages/Login'
import Register from './pages/Register'

/* ===== CORE APP ===== */
import Home from './pages/Home'
import Products from './pages/Products'
import Shop from './pages/Shop'
import Task from './pages/Tasks'
import Team from './pages/Team'
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
import Invoice from './pages/Invoice'
import Gift from './pages/Gift'
import Security from './pages/Security'
import Password from './pages/Password'

/* ===== LAYOUT ===== */
import AppLayout from './layouts/AppLayout'

function App() {
  return (
    <AuthProvider>
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
              <>

                {/* 🔹 APP */}
                <AppLayout />
              </>
            </PrivateRoute>
          }
        >
          {/* DEFAULT */}
          <Route path="/" element={<Navigate to="/home" />} />

          {/* MAIN */}
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/tasks" element={<Task />} />
          <Route path="/team" element={<Team />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />

          {/* PROFILE */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/bank" element={<Bank />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/gift" element={<Gift />} />
          <Route path="/security" element={<Security />} />
          <Route path="/password" element={<Password />} />

          {/* FINANCIAL */}
          <Route path="/deposit" element={<Deposit />} />
          <Route
            path="/deposit/banks/:rechargeId"
            element={<DepositBanks />}
          />
          <Route
            path="/recharge-history"
            element={<RechargeHistory />}
          />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route
            path="/withdraw-history"
            element={<WithdrawHistory />}
          />

          {/* NOTIFICATIONS */}
          <Route
            path="/notifications"
            element={<Notifications />}
          />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
