// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginLayout from './components/LoginLayout';

// All Role Dashboards
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
import OwnerDashboard from './pages/dashboards/OwnerDashboard';
import ManagerDashboard from './pages/dashboards/ManagerDashboard';
import AccountantDashboard from './pages/dashboards/AccountantDashboard';
import SecurityDashboard from './pages/dashboards/SecurityDashboard';
import KitchenDashboard from './pages/dashboards/KitchenDashboard';
import TenantDashboard from './pages/dashboards/TenantDashboard';
import InternalDashboard from './pages/dashboards/InternalDashboard';

// Icons
import { 
  FileText, 
  Settings, 
  Sliders, 
  LayoutGrid, 
  TrendingUp, 
  Users, 
  Home, 
  UserCheck, 
  CreditCard, 
  MessageSquareWarning
} from 'lucide-react';

// Background Images
import internalDeskBg from './assets/super_admin_login_bg.jpg';
import ownerBg from './assets/admin_login_bg.jpg';
import managerBg from './assets/employee_login_bg.jpg';
import residentBg from './assets/tenant_login_bg.jpg';

// 4 Main Login Portals: Super Admin, Admin, Employee, Tenant
const LOGIN_CONFIGS = {
  superadmin: {
    role: "Super Admin",
    badgeText: "Super Admin",
    heading: "Super Admin System",
    subtitle: "Secure Access for ArcNio Super Team",
    description: "Manage PGs, monitor tenant limitations, track SaaS revenues, and automate system notifications.",
    primaryColor: "#0284c7",
    bgImage: internalDeskBg,
    sloganText: "Better Management for Better Living",
    usernameLabel: "Super Admin Username",
    loginDescription: "Login to access the ArcNio Super Admin control hub.",
    features: [
      { icon: <TrendingUp size={16} />, text: "Reports" },
      { icon: <Settings size={16} />, text: "System Tools" },
      { icon: <Sliders size={16} />, text: "Settings" }
    ],
    demoCredentials: {
      email: "superadmin@arcnio.com",
      pass: "admin123"
    },
    bottomTextRight: "🛡️ Authorized Access Only • ArcNio PG Management System"
  },

  admin: {
    role: "Admin",
    badgeText: "Admin",
    heading: "Admin Portal",
    subtitle: "Complete Control. Total Visibility.",
    description: "Manage your PG with powerful insights and full access to all operational modules.",
    primaryColor: "#d97706",
    bgImage: ownerBg,
    sloganText: "Your PG Our Priority",
    usernameLabel: "Email / Phone",
    loginDescription: "Sign in to manage your PG operations.",
    features: [
      { icon: <LayoutGrid size={16} />, text: "All Modules" },
      { icon: <TrendingUp size={16} />, text: "Reports" },
      { icon: <Settings size={16} />, text: "Settings" },
      { icon: <Users size={16} />, text: "Users" }
    ],
    demoCredentials: {
      email: "admin@arcnio.com",
      pass: "owner123"
    },
    bottomTextRight: "🛡️ Admin Access • Full control • All modules • All data"
  },

  employee: {
    role: "Employee",
    badgeText: "Employee",
    heading: "Employee Login",
    subtitle: "Manage. Serve. Support.",
    description: "Select your employee sub-role (Accountant, Manager, Security, Kitchen Staff) to sign in.",
    primaryColor: "#2563eb",
    bgImage: managerBg,
    sloganText: "Together for a Better PG Experience",
    usernameLabel: "Email / Phone",
    loginDescription: "Login to continue with your assigned staff role.",
    features: [
      { icon: <Home size={16} />, text: "Rooms" },
      { icon: <Users size={16} />, text: "Tenants" },
      { icon: <FileText size={16} />, text: "Complaints" },
      { icon: <UserCheck size={16} />, text: "Visitors" }
    ],
    demoCredentials: {
      email: "manager@arcnio.com",
      pass: "manager123"
    },
    bottomTextRight: "👥 Accountant • Manager • Security • Kitchen Staff"
  },

  tenant: {
    role: "Tenant",
    badgeText: "Tenant",
    heading: "Tenant Login",
    subtitle: "Your Stay. Our Priority.",
    description: "Access your room details, payments, requests and more — all in one place.",
    primaryColor: "#059669",
    bgImage: residentBg,
    sloganText: "Feel at Home",
    usernameLabel: "Email / Phone",
    loginDescription: "Login to access your tenant dashboard.",
    features: [
      { icon: <Home size={16} />, text: "Room Info" },
      { icon: <CreditCard size={16} />, text: "Payments" },
      { icon: <MessageSquareWarning size={16} />, text: "Complaints" },
      { icon: <FileText size={16} />, text: "Requests" }
    ],
    demoCredentials: {
      email: "tenant@arcnio.com",
      pass: "tenant123"
    },
    bottomTextRight: "🛡️ Safe • Comfortable • ArcNio"
  }
};

const ROLES_LIST = [
  { key: 'superadmin', label: 'Super Admin' },
  { key: 'admin', label: 'Admin' },
  { key: 'employee', label: 'Employee' },
  { key: 'tenant', label: 'Tenant' }
];

import { DataProvider } from './context/DataContext';

function RoleLoginRouteWrapper() {
  const { roleKey } = useParams();
  const currentRole = roleKey && LOGIN_CONFIGS[roleKey] ? roleKey : 'superadmin';
  const currentConfig = LOGIN_CONFIGS[currentRole];

  return (
    <LoginLayout
      {...currentConfig}
      rolesList={ROLES_LIST}
      activeRoleKey={currentRole}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* LOGIN ROUTES */}
              <Route path="/" element={<Navigate to="/login/superadmin" replace />} />
              <Route path="/login" element={<Navigate to="/login/superadmin" replace />} />
              <Route path="/login/:roleKey" element={<RoleLoginRouteWrapper />} />

              {/* SUPER ADMIN DASHBOARD */}
              <Route
                path="/superadmin/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/internal/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ADMIN / OWNER DASHBOARD */}
              <Route
                path="/admin/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* EMPLOYEE SUBROLE DASHBOARDS */}
              <Route
                path="/accountant/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={['accountant']}>
                    <AccountantDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/manager/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={['manager', 'employee']}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/employee/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={['manager', 'employee']}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/security/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={['security']}>
                    <SecurityDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/kitchen/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={['kitchen']}>
                    <KitchenDashboard />
                  </ProtectedRoute>
                }
              />

              {/* TENANT DASHBOARD */}
              <Route
                path="/tenant/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={['tenant']}>
                    <TenantDashboard />
                  </ProtectedRoute>
                }
              />

              {/* FALLBACK REDIRECT */}
              <Route path="*" element={<Navigate to="/login/superadmin" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
