// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
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

// Lucide Icons
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
  MessageSquareWarning,
  Wrench,
  DollarSign,
  ShieldCheck,
  UtensilsCrossed,
  Calendar,
  ShoppingBag,
  Clock
} from 'lucide-react';

// Relevant PG Images
import { PG_IMAGES } from './assets/pgImages';

// Dedicated Login Configurations for Each Separate Role
const LOGIN_CONFIGS = {
  superadmin: {
    role: "Super Admin",
    badgeText: "Super Admin Portal",
    heading: "Super Admin System",
    subtitle: "Enterprise Control Hub for PG Networks",
    description: "Manage PGs, monitor tenant limits, track SaaS revenues, and automate system notifications across all properties.",
    primaryColor: "#0284c7",
    pgImage: PG_IMAGES.buildingGrand,
    sloganText: "Smart Management for Better Living",
    usernameLabel: "Super Admin Username or Email",
    loginDescription: "Sign in to access the Arcnio Super Admin control hub.",
    features: [
      { icon: <TrendingUp size={16} />, text: "Network Reports" },
      { icon: <Settings size={16} />, text: "System Tools" },
      { icon: <Sliders size={16} />, text: "Global Settings" },
      { icon: <ShieldCheck size={16} />, text: "Franchise Audits" }
    ]
  },

  admin: {
    role: "Admin",
    badgeText: "Admin Portal",
    heading: "Admin & Owner Portal",
    subtitle: "Complete Control. Total Visibility.",
    description: "Manage your PG with powerful operational insights and full control over rooms, tenants, staff, and finances.",
    primaryColor: "#d97706",
    pgImage: PG_IMAGES.buildingHitec,
    sloganText: "Your PG Our Priority",
    usernameLabel: "Admin Email or Phone",
    loginDescription: "Sign in to manage your PG operations.",
    features: [
      { icon: <LayoutGrid size={16} />, text: "All Modules" },
      { icon: <TrendingUp size={16} />, text: "Revenue & Occupancy" },
      { icon: <Settings size={16} />, text: "Configuration" },
      { icon: <Users size={16} />, text: "Tenants & Staff" }
    ]
  },

  manager: {
    role: "Manager",
    badgeText: "Manager Portal",
    heading: "Property Manager Portal",
    subtitle: "Daily PG Operations & Resident Care",
    description: "Supervise check-ins and check-outs, coordinate maintenance tasks, allocate beds, and manage day-to-day PG resident services.",
    primaryColor: "#2563eb",
    pgImage: PG_IMAGES.roomDouble,
    sloganText: "Operational Excellence Every Day",
    usernameLabel: "Manager Email or Phone",
    loginDescription: "Sign in to supervise daily PG operations.",
    features: [
      { icon: <Home size={16} />, text: "Room & Bed Allocations" },
      { icon: <Users size={16} />, text: "Resident Check-ins" },
      { icon: <Wrench size={16} />, text: "Maintenance Requests" },
      { icon: <FileText size={16} />, text: "Daily Mess Updates" }
    ]
  },

  accountant: {
    role: "Accountant",
    badgeText: "Accountant Portal",
    heading: "Accounts & Financial Portal",
    subtitle: "Rent Ledgers, Billing & Financial Tracking",
    description: "Manage monthly rent invoicing, track tenant fee arrears, record vendor expense disbursements, and generate financial reports.",
    primaryColor: "#059669",
    pgImage: PG_IMAGES.amenityLounge,
    sloganText: "Accurate Records & Transparent Finances",
    usernameLabel: "Accountant Email or Phone",
    loginDescription: "Sign in to manage rent billing and accounts.",
    features: [
      { icon: <CreditCard size={16} />, text: "Rent Fee Collection" },
      { icon: <TrendingUp size={16} />, text: "Arrears Tracking" },
      { icon: <DollarSign size={16} />, text: "Expense Ledgers" },
      { icon: <FileText size={16} />, text: "Financial Statements" }
    ]
  },

  security: {
    role: "Security",
    badgeText: "Security & Guard Portal",
    heading: "Security & Gate Management",
    subtitle: "Gate Passes, Visitor Logs & Safety",
    description: "Verify tenant night passes, monitor guest check-ins, record delivery entries, and ensure round-the-clock facility security.",
    primaryColor: "#dc2626",
    pgImage: PG_IMAGES.buildingVista,
    sloganText: "Safe & Secure Around the Clock",
    usernameLabel: "Security Officer ID or Email",
    loginDescription: "Sign in to verify gate passes and logs.",
    features: [
      { icon: <ShieldCheck size={16} />, text: "Digital Gate Passes" },
      { icon: <UserCheck size={16} />, text: "Visitor Check-in Log" },
      { icon: <Clock size={16} />, text: "Night-out Verification" },
      { icon: <Users size={16} />, text: "Entry Monitoring" }
    ]
  },

  kitchen: {
    role: "Kitchen Staff",
    badgeText: "Kitchen & Mess Portal",
    heading: "Kitchen & Dining Management",
    subtitle: "Daily Mess Menus & Meal Headcount",
    description: "Publish daily breakfast, lunch, and dinner menus, monitor resident meal headcounts, manage grocery inventory, and track dietary requests.",
    primaryColor: "#ea580c",
    pgImage: PG_IMAGES.messDining,
    sloganText: "Fresh, Nutritious & Delicious Meals",
    usernameLabel: "Kitchen Staff ID or Email",
    loginDescription: "Sign in to publish daily menus and manage groceries.",
    features: [
      { icon: <Calendar size={16} />, text: "Daily Menu Planning" },
      { icon: <Users size={16} />, text: "Meal Headcount Sync" },
      { icon: <ShoppingBag size={16} />, text: "Grocery Stock Control" },
      { icon: <UtensilsCrossed size={16} />, text: "Special Diet Requests" }
    ]
  },

  tenant: {
    role: "Tenant",
    badgeText: "Resident Portal",
    heading: "Resident & Tenant Living Hub",
    subtitle: "Your Stay. Your Comfort. Our Priority.",
    description: "Access your room details, pay rent online, view today's hot mess menu, request gate passes, and raise quick maintenance tickets.",
    primaryColor: "#7c3aed",
    pgImage: PG_IMAGES.roomSingle,
    sloganText: "Feel at Home with Arcnio",
    usernameLabel: "Tenant Email or Phone",
    loginDescription: "Sign in to access your personal tenant dashboard.",
    features: [
      { icon: <Home size={16} />, text: "Room & Bed Details" },
      { icon: <CreditCard size={16} />, text: "Rent & Online Payment" },
      { icon: <UtensilsCrossed size={16} />, text: "Daily Mess Menu" },
      { icon: <MessageSquareWarning size={16} />, text: "Quick Service Requests" }
    ]
  }
};

function RoleLoginRouteWrapper() {
  const { roleKey } = useParams();
  const normalizedKey = roleKey ? roleKey.toLowerCase() : 'tenant';
  const validKey = LOGIN_CONFIGS[normalizedKey] ? normalizedKey : 'tenant';
  const currentConfig = LOGIN_CONFIGS[validKey];

  return (
    <LoginLayout
      {...currentConfig}
      activeRoleKey={validKey}
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
              {/* DEFAULT ROOT REDIRECT */}
              <Route path="/" element={<Navigate to="/login/tenant" replace />} />
              <Route path="/login" element={<Navigate to="/login/tenant" replace />} />

              {/* SEPARATE DEDICATED LOGIN ROUTES FOR EACH ROLE */}
              <Route path="/login/superadmin" element={<RoleLoginRouteWrapper />} />
              <Route path="/login/admin" element={<RoleLoginRouteWrapper />} />
              <Route path="/login/manager" element={<RoleLoginRouteWrapper />} />
              <Route path="/login/accountant" element={<RoleLoginRouteWrapper />} />
              <Route path="/login/security" element={<RoleLoginRouteWrapper />} />
              <Route path="/login/kitchen" element={<RoleLoginRouteWrapper />} />
              <Route path="/login/tenant" element={<RoleLoginRouteWrapper />} />

              {/* ROLE ALIASES FOR BACKWARD COMPATIBILITY */}
              <Route path="/login/owner" element={<Navigate to="/login/admin" replace />} />
              <Route path="/login/employee" element={<Navigate to="/login/manager" replace />} />
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
                  <ProtectedRoute allowedRoles={['admin', 'owner']}>
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
              <Route path="*" element={<Navigate to="/login/tenant" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
