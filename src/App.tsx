import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AgentRoute from './routes/AgentRoute' // Certifique-se de que o caminho do import está correto

/* ===== PUBLIC ===== */
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
import TransactionDetails from "./pages/TransactionDetails"
import Gift from './pages/Gift'
import Security from './pages/Security'
import Password from './pages/Password'
import KYCPage from './pages/user/KYCPage'
import Settings from './pages/Settings'
import AgentLayout from "./pages/agent/AgentLayout";

import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentSubAgents from "./pages/agent/AgentSubAgents";
import CreateSubAgent from "./pages/agent/CreateSubAgent";
import EditSubAgent from "./pages/agent/EditSubAgent";
import SubAgentDetails from "./pages/agent/SubAgentDetails";
import AgentCommissions from "./pages/agent/AgentCommissions";
import AgentStatistics from "./pages/agent/AgentStatistics";
import AgentHistory from "./pages/agent/AgentHistory";

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

/* ===== AGENT PAGES ===== */
import AgentPending from "./pages/agent/AgentPending"
import AgentRejected from "./pages/agent/AgentRejected"
import AgentSuspended from "./pages/agent/AgentSuspended"

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
        <Route path="/login" element={<Login />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />

        {/* ================= AGENT STATUS (FORA DO APPLAYOUT) ================= */}
        <Route
          path="/agent/pending"
          element={
            <AgentRoute>
              <AgentPending />
            </AgentRoute>
          }
        />

        <Route
          path="/agent/rejected"
          element={
            <AgentRoute>
              <AgentRejected />
            </AgentRoute>
          }
        />

        <Route
          path="/agent/suspended"
          element={
            <AgentRoute>
              <AgentSuspended />
            </AgentRoute>
          }
        />

        {/* ================= PRIVATE (DENTRO DO APPLAYOUT) ================= */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={<Navigate to="/home" replace />}
          />

          {/* HOME */}
          <Route path="home" element={<Home />} />

          {/* HISTORY */}
          <Route path="history" element={<History />} />

          {/* PROFILE */}
          <Route path="profile" element={<Profile />} />
          <Route path="bank" element={<Bank />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="/transactions/:id" element={<TransactionDetails />} />
          <Route path="gift" element={<Gift />} />
          <Route path="security" element={<Security />} />
          <Route path="password" element={<Password />} />
          <Route path="kyc" element={<KYCPage />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/agent" element={<AgentLayout />}>

  <Route
    index
    element={<AgentDashboard />}
  />

  <Route
    path="dashboard"
    element={<AgentDashboard />}
  />

  <Route
    path="sub-agents"
    element={<AgentSubAgents />}
  />

  <Route
    path="sub-agents/new"
    element={<CreateSubAgent />}
  />

  <Route
    path="sub-agents/:id"
    element={<SubAgentDetails />}
  />

  <Route
    path="sub-agents/:id/edit"
    element={<EditSubAgent />}
  />

  <Route
    path="commissions"
    element={<AgentCommissions />}
  />

  <Route
    path="statistics"
    element={<AgentStatistics />}/>

  <Route
    path="history"
    element={<AgentHistory />}
  />

</Route>

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

          {/* RECHARGES */}
          <Route
            path="recharges"
            element={<RechargeServices />}
          />
           
          <Route
             path="recharges/:serviceId"
             element={<RechargeCategories />}
          />

          <Route
             path="recharges/:serviceId/categories/:categoryId"
             element={<RechargePlans />}
          />

          <Route
            path="recharges/:serviceId/categories/:categoryId/plans/:planId"
            element={<RechargeCheckout />}
          />

          {/* PAYMENTS */}
          <Route
            path="payments"
            element={<Payments />}
         />

          <Route
            path="payments/:paymentId"
            element={<PaymentCheckout />}
          />

          {/* DASHBOARD */}
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* MY RECHARGES */}
          <Route
            path="my-recharges"
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
          element={<Navigate to="/home" replace />}
        />

      </Routes>

    </AuthProvider>
  )
}

export default App