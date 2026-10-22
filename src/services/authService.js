// src/services/authService.js

/**
 * Robust Authentication Service supporting Super Admin, Admin, Employee Sub-Roles (Accountant, Manager, Security, Kitchen Staff), and Tenant.
 */

const STORAGE_KEYS = {
  CURRENT_USER: 'arcnio_current_user',
  AUTH_TOKEN: 'arcnio_auth_token',
  REMEMBERED_USERS: 'arcnio_remembered_users',
};

const MOCK_USERS_ALL = [
  {
    id: 'usr_super_01',
    username: 'superadmin@arcnio.com',
    name: 'Victoria Vance',
    role: 'superadmin',
    roleTitle: 'Super System Administrator',
    password: 'admin123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'superadmin@arcnio.com',
    phone: '+1 (555) 019-9999',
    permissions: ['SUPER_ALL', 'PG_ONBOARDING', 'SUBSCRIPTION_PLANS', 'SYSTEM_REVENUE', 'AUTOMATED_MAILS']
  },
  {
    id: 'usr_admin_01',
    username: 'admin@arcnio.com',
    name: 'Alexander Vance',
    role: 'admin',
    roleTitle: 'PG Admin / Owner',
    password: 'owner123',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    email: 'admin@arcnio.com',
    phone: '+91 98112 33445',
    propertiesCount: 4,
    totalRooms: 52,
    totalBeds: 200,
    occupiedBeds: 172,
    permissions: ['ADMIN_FULL', 'PROPERTY_MANAGEMENT', 'STAFF_CONTROL']
  },
  {
    id: 'usr_owner_01',
    username: 'owner@arcnio.com',
    name: 'Alexander Vance',
    role: 'admin',
    roleTitle: 'PG Admin / Owner',
    password: 'owner123',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    email: 'owner@arcnio.com',
    phone: '+91 98112 33445',
    propertiesCount: 4,
    totalRooms: 52,
    totalBeds: 200,
    occupiedBeds: 172,
    permissions: ['ADMIN_FULL', 'PROPERTY_MANAGEMENT', 'STAFF_CONTROL']
  },
  {
    id: 'usr_acc_01',
    username: 'accountant@arcnio.com',
    name: 'Priya Sundaram',
    role: 'accountant',
    roleTitle: 'Accountant / Finance Lead',
    password: 'accountant123',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    email: 'accountant@arcnio.com',
    phone: '+91 98111 22334',
    permissions: ['FINANCE_READ_WRITE', 'INVOICING', 'REFUNDS', 'EXPENSES']
  },
  {
    id: 'usr_mgr_01',
    username: 'manager@arcnio.com',
    name: 'Vikram Malhotra',
    role: 'manager',
    roleTitle: 'Property Manager / Warden',
    password: 'manager123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'manager@arcnio.com',
    phone: '+91 98765 11223',
    assignedProperty: 'ArcNio Grand Co-Living, Sector 62',
    permissions: ['ROOM_OPS', 'TICKET_RESOLUTION', 'VISITOR_LOG']
  },
  {
    id: 'usr_sec_01',
    username: 'security@arcnio.com',
    name: 'Rajesh Kumar',
    role: 'security',
    roleTitle: 'Security Desk Officer',
    password: 'security123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'security@arcnio.com',
    phone: '+91 98999 11122',
    permissions: ['GATE_PASS', 'VISITOR_CHECKIN']
  },
  {
    id: 'usr_kit_01',
    username: 'kitchen@arcnio.com',
    name: 'Chef Ramesh',
    role: 'kitchen',
    roleTitle: 'Kitchen & Catering Manager',
    password: 'kitchen123',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
    email: 'kitchen@arcnio.com',
    phone: '+91 98333 44455',
    permissions: ['MEAL_COUNT', 'MENU_UPDATE', 'CLEANING_CHECKLIST']
  },
  {
    id: 'usr_emp_01',
    username: 'employee@arcnio.com',
    name: 'David Miller',
    role: 'manager',
    roleTitle: 'Operations Lead',
    password: 'employee123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'employee@arcnio.com',
    phone: '+91 98765 11223',
    permissions: ['ROOM_OPS', 'TICKET_RESOLUTION']
  },
  {
    id: 'usr_tenant_01',
    username: 'tenant@arcnio.com',
    altUsername: '+91 98765 43210',
    name: 'Rahul S',
    role: 'tenant',
    roleTitle: 'Resident Tenant',
    password: 'tenant123',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    email: 'tenant@arcnio.com',
    phone: '+91 98765 43210',
    roomNumber: 'B-204 (Bed B)',
    property: 'The Vista Co-Living Hub',
    dueRent: 10800,
    dueDate: '5th Oct 2026',
    permissions: ['PAY_RENT', 'RAISE_TICKET', 'MEAL_OPT']
  }
];

export const validateIdentifier = (value) => {
  if (!value || !value.trim()) {
    return { isValid: false, message: 'Email, phone, or username is required.' };
  }
  const clean = value.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
  const isPhone = /^[+\d\s()-]{8,15}$/.test(clean);
  const isUsername = /^[a-zA-Z0-9_.-]{3,30}$/.test(clean);

  if (!isEmail && !isPhone && !isUsername) {
    return { isValid: false, message: 'Please enter a valid email, phone number, or username.' };
  }
  return { isValid: true, message: '' };
};

export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required.' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true, message: '' };
};

export const authService = {
  async login({ roleKey, subRoleKey, identifier, password, rememberMe }) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const idRes = validateIdentifier(identifier);
    if (!idRes.isValid) return { success: false, error: idRes.message };

    const passRes = validatePassword(password);
    if (!passRes.isValid) return { success: false, error: passRes.message };

    const cleanId = identifier.trim().toLowerCase();

    // 1. Try finding exact user match across all accounts first
    let matchedUser = MOCK_USERS_ALL.find(
      (u) =>
        u.username.toLowerCase() === cleanId ||
        (u.email && u.email.toLowerCase() === cleanId) ||
        (u.phone && u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')) ||
        (u.altUsername && u.altUsername.replace(/\s+/g, '') === cleanId.replace(/\s+/g, ''))
    );

    // 2. Fallback to default user for the requested role if demo input is used
    if (!matchedUser) {
      let targetRole = subRoleKey || roleKey;
      if (targetRole === 'internal') targetRole = 'superadmin';
      if (targetRole === 'owner') targetRole = 'admin';

      matchedUser = MOCK_USERS_ALL.find(u => u.role === targetRole) || MOCK_USERS_ALL[0];
    }

    if (matchedUser.password !== password && password !== 'admin123' && password !== 'owner123' && password !== 'manager123' && password !== 'accountant123' && password !== 'security123' && password !== 'kitchen123' && password !== 'tenant123' && password !== 'password123') {
      return {
        success: false,
        error: 'Incorrect password. Please try again or click "Forgot password?".'
      };
    }

    const token = `mock_jwt_token_${matchedUser.id}_${Date.now()}`;
    const userPayload = { ...matchedUser };
    delete userPayload.password;

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userPayload));
    storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

    const activeKey = subRoleKey || roleKey;
    if (rememberMe) {
      this.saveRememberedUser(activeKey, identifier);
    } else {
      this.clearRememberedUser(activeKey);
    }

    // Determine dashboard redirect path
    const redirectRole = matchedUser.role;
    const redirectPath = `/${redirectRole}/dashboard`;

    return {
      success: true,
      user: userPayload,
      token,
      redirectPath
    };
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  getCurrentUser() {
    try {
      const userRaw =
        localStorage.getItem(STORAGE_KEYS.CURRENT_USER) ||
        sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userRaw ? JSON.parse(userRaw) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return (
      localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    );
  },

  saveRememberedUser(roleKey, identifier) {
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEYS.REMEMBERED_USERS);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      existing[roleKey] = identifier;
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_USERS, JSON.stringify(existing));
    } catch (err) {
      console.warn('Failed to save remembered user', err);
    }
  },

  getRememberedUser(roleKey) {
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEYS.REMEMBERED_USERS);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      return existing[roleKey] || '';
    } catch {
      return '';
    }
  },

  clearRememberedUser(roleKey) {
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEYS.REMEMBERED_USERS);
      if (existingRaw) {
        const existing = JSON.parse(existingRaw);
        delete existing[roleKey];
        localStorage.setItem(STORAGE_KEYS.REMEMBERED_USERS, JSON.stringify(existing));
      }
    } catch (err) {
      console.warn('Failed to clear remembered user', err);
    }
  }
};
