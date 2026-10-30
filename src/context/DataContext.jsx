// src/context/DataContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

const STORAGE_KEY = 'arcnio_pg_management_data_v2';

const DEFAULT_INITIAL_STATE = {
  // Tenants
  tenantsData: [
    { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.s@example.com', room: '204', bed: 'B', joiningDate: '01 Aug 2026', rent: '₹10,800', status: 'Active', hasDocs: true },
    { id: 2, name: 'Priya M', phone: '+91 91234 56789', email: 'priya.m@example.com', room: '302', bed: 'A', joiningDate: '15 Jul 2026', rent: '₹8,500', status: 'Inactive', hasDocs: true },
    { id: 3, name: 'Aman Verma', phone: '+91 98989 12345', email: 'aman.v@example.com', room: '105', bed: 'A', joiningDate: '10 Sep 2026', rent: '₹9,200', status: 'Active', hasDocs: false }
  ],

  // Rooms & Beds
  roomsData: [
    { id: 1, roomNumber: '204', floor: '2nd Floor', roomType: '2 Sharing', totalBeds: 2, availableBeds: 1, status: 'Available' },
    { id: 2, roomNumber: '302', floor: '3rd Floor', roomType: '1 Sharing', totalBeds: 1, availableBeds: 0, status: 'Full' },
    { id: 3, roomNumber: '105', floor: '1st Floor', roomType: '3 Sharing', totalBeds: 3, availableBeds: 2, status: 'Available' },
    { id: 4, roomNumber: '401', floor: '4th Floor', roomType: '2 Sharing', totalBeds: 2, availableBeds: 2, status: 'Available' }
  ],

  // Bed Allocations
  bedAllocData: [
    { id: 1, roomNumber: '204', room: '204', bed: 'A', tenant: 'Suresh Kumar', joiningDate: '01 Jun 2026', status: 'Occupied' },
    { id: 2, roomNumber: '204', room: '204', bed: 'B', tenant: 'Rahul Sharma', joiningDate: '01 Aug 2026', status: 'Occupied' },
    { id: 3, roomNumber: '302', room: '302', bed: 'A', tenant: 'Priya M', joiningDate: '15 Jul 2026', status: 'Occupied' },
    { id: 4, roomNumber: '105', room: '105', bed: 'A', tenant: 'Aman Verma', joiningDate: '10 Sep 2026', status: 'Occupied' },
    { id: 5, roomNumber: '105', room: '105', bed: 'B', tenant: 'Available', joiningDate: '--', status: 'Available' }
  ],

  // Staff
  staffData: [
    { id: 1, name: 'Ramesh Patel', role: 'Manager', phone: '+91 98111 22334', shift: 'Morning', status: 'Active' },
    { id: 2, name: 'Devendra Singh', role: 'Security', phone: '+91 98333 44556', shift: 'Night', status: 'Active' },
    { id: 3, name: 'Sanjay Kumar', role: 'Housekeeping', phone: '+91 98777 66554', shift: 'Full Day', status: 'Active' },
    { id: 4, name: 'Kiran Rao', role: 'Head Chef', phone: '+91 98222 33445', shift: 'Morning & Evening', status: 'Active' }
  ],

  // Staff Attendance
  attendanceData: [
    { id: 1, staffName: 'Ramesh Patel', date: '08 Oct 2026', checkIn: '08:00 AM', checkOut: '05:00 PM', status: 'Present' },
    { id: 2, staffName: 'Devendra Singh', date: '08 Oct 2026', checkIn: '08:00 PM', checkOut: '06:00 AM', status: 'Present' },
    { id: 3, staffName: 'Sanjay Kumar', date: '08 Oct 2026', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present' },
    { id: 4, staffName: 'Kiran Rao', date: '08 Oct 2026', checkIn: '06:30 AM', checkOut: '03:30 PM', status: 'Present' }
  ],

  // Check In / Out Clearance
  checkInOutData: [
    { id: 1, tenantName: 'Priya M', tenant: 'Priya M', room: '302', bed: 'A', type: 'Check-out', date: '30 Oct 2026', status: 'Pending Clearance' },
    { id: 2, tenantName: 'Rahul Sharma', tenant: 'Rahul Sharma', room: '204', bed: 'B', type: 'Check-in', date: '01 Aug 2026', status: 'Completed' }
  ],

  // Finances & Invoices
  invoiceData: [
    { id: 1, invoiceNumber: 'INV-1001', tenant: 'Rahul Sharma', month: 'October 2026', rent: '₹10,800', total: '₹10,800', amount: '₹10,800', dueDate: '05 Oct 2026', status: 'Paid' },
    { id: 2, invoiceNumber: 'INV-1002', tenant: 'Priya M', month: 'October 2026', rent: '₹8,500', total: '₹8,500', amount: '₹8,500', dueDate: '05 Oct 2026', status: 'Pending' },
    { id: 3, invoiceNumber: 'INV-1003', tenant: 'Aman Verma', month: 'October 2026', rent: '₹9,200', total: '₹9,200', amount: '₹9,200', dueDate: '07 Oct 2026', status: 'Pending' }
  ],
  paymentsData: [
    { id: 1, paymentId: 'PAY-8901', tenant: 'Rahul Sharma', amount: '₹10,800', mode: 'UPI', method: 'UPI', date: '01 Oct 2026', status: 'Successful' },
    { id: 2, paymentId: 'PAY-8902', tenant: 'Aman Verma', amount: '₹9,200', mode: 'Credit Card', method: 'Credit Card', date: '03 Oct 2026', status: 'Successful' }
  ],
  expensesData: [
    { id: 1, category: 'Maintenance', type: 'Maintenance', description: 'Plumbing fix Room 204 & replacement tap', amount: '₹1,500', date: '02 Oct 2026', status: 'Cleared' },
    { id: 2, category: 'Utilities', type: 'Electricity & Water', description: 'Monthly common utility bill', amount: '₹14,200', date: '03 Oct 2026', status: 'Cleared' },
    { id: 3, category: 'Internet', type: 'Fiber Wi-Fi', description: 'High-speed 1Gbps commercial fiber lease', amount: '₹3,500', date: '01 Oct 2026', status: 'Cleared' }
  ],
  depositsData: [
    { id: 1, tenant: 'Rahul Sharma', amount: '₹20,000', depositAmount: '₹20,000', refundAmount: '₹0 (Active Stay)', depositDate: '01 Aug 2026', refundStatus: 'Held', status: 'Held in Escrow' },
    { id: 2, tenant: 'Priya M', amount: '₹17,000', depositAmount: '₹17,000', refundAmount: '₹17,000', depositDate: '15 Jul 2026', refundStatus: 'Processing', status: 'Pending Clearance' }
  ],

  // Complaints / Maintenance (Shared across Tenant, Manager, Admin, Employee)
  complaintsData: [
    { id: 1, tenant: 'Rahul Sharma', room: '204', category: 'Maintenance', type: 'Maintenance', description: 'AC not cooling properly in room 204', date: '02 Oct 2026', status: 'In Progress' },
    { id: 2, tenant: 'Priya M', room: '302', category: 'Cleaning', type: 'Cleaning', description: 'Deep room sanitization requested', date: '01 Oct 2026', status: 'Resolved' },
    { id: 3, tenant: 'Aman Verma', room: '105', category: 'Internet', type: 'Internet', description: 'Wi-Fi disconnects frequently on 1st floor', date: '04 Oct 2026', status: 'Pending' }
  ],

  // Requests (Late entry, room change, etc. Shared across Tenant, Manager, Security)
  requestsData: [
    { id: 1, tenant: 'Rahul Sharma', requestType: 'Late Entry', type: 'Late Entry', description: 'Coming late due to office project sprint (10:30 PM)', date: '02 Oct 2026', status: 'Approved' },
    { id: 2, tenant: 'Aman Verma', requestType: 'Room Change', type: 'Room Change', description: 'Requesting room upgrade to 2 sharing', date: '03 Oct 2026', status: 'Pending' }
  ],

  // Visitor Passes & Gate Logs (Shared across Tenant, Security, Manager)
  visitorLogs: [
    { id: 1, visitorName: 'Suresh Kumar', tenant: 'Rahul Sharma', room: '204', phone: '+91 98765 00001', entryTime: '10:00 AM', exitTime: '12:00 PM', date: '02 Oct 2026', status: 'Checked Out' },
    { id: 2, visitorName: 'Neha Verma', tenant: 'Rahul Sharma', room: '204', phone: '+91 98765 00002', entryTime: '04:00 PM', exitTime: '--', date: '02 Oct 2026', status: 'Inside' },
    { id: 3, visitorName: 'Amit Saxena', tenant: 'Aman Verma', room: '105', phone: '+91 98765 00003', entryTime: '02:15 PM', exitTime: '--', date: '02 Oct 2026', status: 'Inside' }
  ],
  gateEntryExit: [
    { id: 1, visitorName: 'Ramesh Singh', tenant: 'Priya M', room: '302', entryTime: '01:30 PM', exitTime: '--', status: 'Inside' },
    { id: 2, visitorName: 'Neha Verma', tenant: 'Rahul Sharma', room: '204', entryTime: '04:00 PM', exitTime: '--', status: 'Inside' }
  ],
  visitorRequests: [
    { id: 1, visitorName: 'Neha Verma', tenant: 'Rahul Sharma', visitDate: '03 Oct 2026', visitTime: '04:00 PM', status: 'Approved' },
    { id: 2, visitorName: 'Kunal Kapoor', tenant: 'Aman Verma', visitDate: '04 Oct 2026', visitTime: '11:00 AM', status: 'Pending' }
  ],

  // Kitchen Menu & Costing (Shared across Kitchen, Manager, Tenant)
  menuCosting: [
    { id: 1, date: '02 Oct 2026', meal: 'Breakfast', menu: 'Idli, Medu Vada, Sambar, Fresh Coconut Chutney & Tea/Coffee', mealCount: 150 },
    { id: 2, date: '02 Oct 2026', meal: 'Lunch', menu: 'Basmati Jeera Rice, Dal Tadka, Paneer Butter Masala, Fresh Phulkas & Salad', mealCount: 135 },
    { id: 3, date: '02 Oct 2026', meal: 'Dinner', menu: 'Whole Wheat Roti, Mixed Vegetable Korma, Steamed Rice, Dal Makhani & Gulab Jamun', mealCount: 140 },
    { id: 4, date: '03 Oct 2026', meal: 'Breakfast', menu: 'Aloo Poha, Boiled Eggs / Sprouted Moong, Mint Chutney & Filter Coffee', mealCount: 145 },
    { id: 5, date: '03 Oct 2026', meal: 'Lunch', menu: 'Hyderabadi Veg Biryani, Mirchi Ka Salan, Onion Cucumber Raita & Papad', mealCount: 150 },
    { id: 6, date: '03 Oct 2026', meal: 'Dinner', menu: 'Butter Naan, Punjabi Chana Masala, Steamed Rice, Curd & Kheer', mealCount: 138 }
  ],

  // Special Dietary & Food Requests (Shared across Kitchen, Manager, Tenant)
  specialRequests: [
    { id: 1, tenant: 'Rahul Sharma', meal: 'Dinner', request: 'Pack meal in lunchbox due to late office shift', date: '02 Oct 2026', status: 'Pending' },
    { id: 2, tenant: 'Priya M', meal: 'Lunch', request: 'Jain food / No onion, no garlic meal', date: '02 Oct 2026', status: 'Fulfilled' },
    { id: 3, tenant: 'Aman Verma', meal: 'Breakfast', request: 'Extra double boiled eggs and warm almond milk', date: '03 Oct 2026', status: 'Fulfilled' }
  ],

  // Kitchen Cleaning & Hygiene (Shared with Manager)
  cleaningHygiene: [
    { id: 1, date: '02 Oct 2026', task: 'Deep clean exhaust chimney & grease filters', status: 'Completed' },
    { id: 2, date: '02 Oct 2026', task: 'Dining hall floor mopping and sanitization', status: 'Pending' },
    { id: 3, date: '02 Oct 2026', task: 'Kitchen counter surface bactericidal wipe down', status: 'Completed' }
  ],

  // Consumables / Grocery Inventory (Shared across Kitchen & Manager)
  inventory: [
    { id: 1, item: 'Basmati Rice', quantity: '50', unit: 'kg', stockStatus: 'Adequate' },
    { id: 2, item: 'Cooking Sunflower Oil', quantity: '25', unit: 'Liters', stockStatus: 'Adequate' },
    { id: 3, item: 'Toor Dal', quantity: '20', unit: 'kg', stockStatus: 'Adequate' },
    { id: 4, item: 'Wheat Flour (Atta)', quantity: '40', unit: 'kg', stockStatus: 'Adequate' },
    { id: 5, item: 'Dairy Milk & Curd', quantity: '18', unit: 'Liters', stockStatus: 'Adequate' }
  ],

  // Security Emergency Alerts
  emergencyAlerts: [
    { id: 1, alertType: 'Smoke Detector', location: 'Floor 2, Corridor A', description: 'Smoke triggered near laundry room', status: 'Resolved' },
    { id: 2, alertType: 'Water Pressure Loss', location: 'Block B Pump Room', description: 'Secondary water pump tripped', status: 'Active' }
  ],

  // PG Properties List (Admin, Super Admin)
  pgList: [
    { id: 1, name: 'Arcnio Cyber Towers', owner: 'Ramesh Gupta', phone: '+91 98765 43211', email: 'ramesh@cyber.com', address: 'HITEC City, Hyderabad', totalRooms: 80, totalBeds: 150, status: 'Active', imageKey: 'buildingHitec' },
    { id: 2, name: 'The Vista Co-Living Hub', owner: 'Alexander Vance', phone: '+91 98765 43210', email: 'alex@vista.com', address: 'Indiranagar, Bengaluru', totalRooms: 100, totalBeds: 200, status: 'Active', imageKey: 'buildingVista' },
    { id: 3, name: 'Arcnio Grand Co-Living', owner: 'Suresh Menon', phone: '+91 98112 44332', email: 'suresh@arcnio.com', address: 'Sector 62, Noida', totalRooms: 60, totalBeds: 120, status: 'Active', imageKey: 'buildingGrand' }
  ],

  // Invitations & Revenues
  invitations: [
    { id: 1, tenantName: 'Rahul Sharma', contact: 'rahul@example.com', pgName: 'The Vista Co-Living Hub', plan: '6 Months', status: 'Accepted' },
    { id: 2, tenantName: 'Deepak Rao', contact: 'deepak.rao@example.com', pgName: 'Arcnio Cyber Towers', plan: '12 Months', status: 'Pending' }
  ],
  revenues: [
    { id: 1, pgName: 'The Vista Co-Living Hub', plan: 'Enterprise SaaS', amount: '₹12,999', paymentDate: '01 Oct 2026', status: 'Completed' },
    { id: 2, pgName: 'Arcnio Cyber Towers', plan: 'Pro Multi-Property', amount: '₹9,499', paymentDate: '02 Oct 2026', status: 'Completed' },
    { id: 3, pgName: 'Arcnio Grand Co-Living', plan: 'Starter SaaS', amount: '₹4,999', paymentDate: '05 Oct 2026', status: 'Pending' }
  ],
  reminders: [
    { id: 1, type: 'Payment Due Reminder', triggerDate: '3 Days Before Due', message: 'Dear resident, your monthly rent invoice is due in 3 days. Kindly pay to avoid late fees.', status: 'Enabled' },
    { id: 2, type: 'Late Rent Overdue Notice', triggerDate: '1 Day After Due', message: 'Urgent: Your rent payment is past due. Please clear your dues immediately.', status: 'Enabled' },
    { id: 3, type: 'Kitchen Maintenance Notice', triggerDate: 'Weekly Sunday', message: 'Dining hall cleaning scheduled every Sunday 3 PM to 5 PM.', status: 'Disabled' }
  ],
  plans: [
    { id: 1, planName: 'Monthly Flex', duration: '1 Month', price: '₹2,499', status: 'Active' },
    { id: 2, planName: 'Semi-Annual Saver', duration: '6 Months', price: '₹12,999', status: 'Active' },
    { id: 3, planName: 'Annual Resident Pro', duration: '12 Months', price: '₹22,999', status: 'Active' }
  ],

  // Announcements (Shared across Admin, Manager, Tenant)
  announcements: [
    { id: 1, title: 'Lift Maintenance Schedule', description: 'Passenger elevator #2 will undergo routine servicing tomorrow from 2 PM to 4 PM.', date: '01 Oct 2026', status: 'Active' },
    { id: 2, title: 'High-Speed Wi-Fi Router Upgrade', description: 'All floor Wi-Fi routers will reboot tonight at 02:00 AM for firmware optimization.', date: '03 Oct 2026', status: 'Active' },
    { id: 3, title: 'Sunday Special Chef Dinner', description: 'Chef special Paneer Tikka and Dum Biryani this Sunday evening in the mess.', date: '04 Oct 2026', status: 'Active' }
  ]
};

// Helper to load persisted state or default
function getStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_INITIAL_STATE, ...parsed };
  } catch (err) {
    console.warn('Error reading from localStorage:', err);
    return DEFAULT_INITIAL_STATE;
  }
}

export function DataProvider({ children }) {
  const [appData, setAppData] = useState(getStoredState);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage whenever appData updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    } catch (err) {
      console.warn('Error saving to localStorage:', err);
    }
  }, [appData]);

  // Listen to cross-tab updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const freshData = JSON.parse(e.newValue);
          setAppData(prev => ({ ...prev, ...freshData }));
        } catch (err) {
          console.warn('Failed parsing cross-tab storage:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update helper creator for a state slice
  const createUpdater = (key) => (actionOrValue) => {
    setAppData(prev => {
      const current = prev[key] || [];
      const nextVal = typeof actionOrValue === 'function' ? actionOrValue(current) : actionOrValue;
      return { ...prev, [key]: nextVal };
    });
  };

  // State bindings
  const tenantsData = appData.tenantsData;
  const setTenantsData = createUpdater('tenantsData');

  const roomsData = appData.roomsData;
  const setRoomsData = createUpdater('roomsData');

  const bedAllocData = appData.bedAllocData;
  const setBedAllocData = createUpdater('bedAllocData');

  const staffData = appData.staffData;
  const setStaffData = createUpdater('staffData');

  const attendanceData = appData.attendanceData;
  const setAttendanceData = createUpdater('attendanceData');

  const checkInOutData = appData.checkInOutData;
  const setCheckInOutData = createUpdater('checkInOutData');

  const invoiceData = appData.invoiceData;
  const setInvoiceData = createUpdater('invoiceData');

  const paymentsData = appData.paymentsData;
  const setPaymentsData = createUpdater('paymentsData');

  const expensesData = appData.expensesData;
  const setExpensesData = createUpdater('expensesData');

  const depositsData = appData.depositsData;
  const setDepositsData = createUpdater('depositsData');

  const complaintsData = appData.complaintsData;
  const setComplaintsData = createUpdater('complaintsData');

  const requestsData = appData.requestsData;
  const setRequestsData = createUpdater('requestsData');

  const visitorLogs = appData.visitorLogs;
  const setVisitorLogs = createUpdater('visitorLogs');

  const gateEntryExit = appData.gateEntryExit;
  const setGateEntryExit = createUpdater('gateEntryExit');

  const visitorRequests = appData.visitorRequests;
  const setVisitorRequests = createUpdater('visitorRequests');

  // Kitchen Menu
  const menuCosting = appData.menuCosting;
  const setMenuCosting = createUpdater('menuCosting');

  // Special Food Requests (Unified across Kitchen, Manager & Tenant)
  const specialRequests = appData.specialRequests;
  const setSpecialRequests = createUpdater('specialRequests');

  const cleaningHygiene = appData.cleaningHygiene;
  const setCleaningHygiene = createUpdater('cleaningHygiene');

  const inventory = appData.inventory;
  const setInventory = createUpdater('inventory');

  const emergencyAlerts = appData.emergencyAlerts;
  const setEmergencyAlerts = createUpdater('emergencyAlerts');

  const pgList = appData.pgList;
  const setPgList = createUpdater('pgList');

  const invitations = appData.invitations;
  const setInvitations = createUpdater('invitations');

  const revenues = appData.revenues;
  const setRevenues = createUpdater('revenues');

  const reminders = appData.reminders;
  const setReminders = createUpdater('reminders');

  const plans = appData.plans;
  const setPlans = createUpdater('plans');

  const announcements = appData.announcements;
  const setAnnouncements = createUpdater('announcements');

  // Cross-module convenience helper: derives grouped mess menu by date
  // e.g. for Tenant and Manager views: { id, date, breakfast, lunch, dinner }
  const getDailyMessMenu = () => {
    const dates = [...new Set(menuCosting.map(m => m.date))];
    return dates.map((date, idx) => {
      const bFast = menuCosting.find(m => m.date === date && m.meal?.toLowerCase() === 'breakfast')?.menu || 'Poha, Boiled Eggs / Milk & Tea';
      const lunch = menuCosting.find(m => m.date === date && m.meal?.toLowerCase() === 'lunch')?.menu || 'Steamed Rice, Dal, Veg Curry & Roti';
      const dinner = menuCosting.find(m => m.date === date && m.meal?.toLowerCase() === 'dinner')?.menu || 'Phulkas, Sabzi, Rice & Dal';
      return {
        id: idx + 1,
        date,
        breakfast: bFast,
        lunch: lunch,
        dinner: dinner
      };
    });
  };

  const value = {
    searchQuery, setSearchQuery,
    
    // Tenants & Rooms
    tenantsData, setTenantsData,
    roomsData, setRoomsData,
    roomsBedsData: roomsData, setRoomsBedsData: setRoomsData,
    bedAllocData, setBedAllocData,
    checkInOutData, setCheckInOutData,
    
    // Staff & Attendance
    staffData, setStaffData,
    attendanceData, setAttendanceData,

    // Finances
    financeData: invoiceData, setFinanceData: setInvoiceData,
    invoiceData, setInvoiceData,
    paymentsData, setPaymentsData,
    expensesData, setExpensesData,
    depositsData, setDepositsData,

    // Complaints & Requests (Unified)
    complaintsData, setComplaintsData,
    myComplaints: complaintsData, setMyComplaints: setComplaintsData,
    requestsData, setRequestsData,
    myRequests: requestsData, setMyRequests: setRequestsData,

    // Visitors & Gate (Unified)
    visitorLogs, setVisitorLogs,
    visitorPasses: visitorLogs, setVisitorPasses: setVisitorLogs,
    visitorsData: visitorLogs, setVisitorsData: setVisitorLogs,
    gateEntryExit, setGateEntryExit,
    visitorRequests, setVisitorRequests,

    // Kitchen & Food (Unified across Kitchen, Manager & Tenant)
    menuCosting, setMenuCosting,
    getDailyMessMenu,
    specialRequests, setSpecialRequests,
    kitchenRequests: specialRequests, setKitchenRequests: setSpecialRequests, // Synchronized!
    cleaningHygiene, setCleaningHygiene,
    inventory, setInventory,

    // Security & Emergency
    emergencyAlerts, setEmergencyAlerts,

    // Super Admin & Owner
    pgList, setPgList,
    pgData: pgList, setPgData: setPgList,
    invitations, setInvitations,
    revenues, setRevenues,
    reminders, setReminders,
    plans, setPlans,

    // Announcements
    announcements, setAnnouncements
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
