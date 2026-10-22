import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Shared
  const [tenantsData, setTenantsData] = useState([
    { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul.s@example.com', room: '204', bed: 'B', joiningDate: '01 Aug 2026', rent: '₹10,800', status: 'Active', hasDocs: true },
    { id: 2, name: 'Priya M', phone: '+91 91234 56789', email: 'priya.m@example.com', room: '302', bed: 'A', joiningDate: '15 Jul 2026', rent: '₹8,500', status: 'Inactive', hasDocs: true },
    { id: 3, name: 'Aman Verma', phone: '+91 98989 12345', email: 'aman.v@example.com', room: '105', bed: 'A', joiningDate: '10 Sep 2026', rent: '₹9,200', status: 'Active', hasDocs: false }
  ]);
  const [roomsData, setRoomsData] = useState([
    { id: 1, roomNumber: '204', floor: '2nd Floor', roomType: '2 Sharing', totalBeds: 2, availableBeds: 1, status: 'Available' },
    { id: 2, roomNumber: '302', floor: '3rd Floor', roomType: '1 Sharing', totalBeds: 1, availableBeds: 0, status: 'Full' },
    { id: 3, roomNumber: '105', floor: '1st Floor', roomType: '3 Sharing', totalBeds: 3, availableBeds: 2, status: 'Available' }
  ]);
  const [staffData, setStaffData] = useState([
    { id: 1, name: 'Ramesh Patel', role: 'Manager', phone: '+91 98111 22334', shift: 'Morning', status: 'Active' },
    { id: 2, name: 'Devendra Singh', role: 'Security', phone: '+91 98333 44556', shift: 'Night', status: 'Active' },
    { id: 3, name: 'Sanjay Kumar', role: 'Housekeeping', phone: '+91 98777 66554', shift: 'Full Day', status: 'Active' }
  ]);
  const [financeData, setFinanceData] = useState([
    { id: 1, tenant: 'Rahul Sharma', amount: '₹10,800', paymentType: 'UPI', paymentDate: '01 Oct 2026', status: 'Paid' },
    { id: 2, tenant: 'Priya M', amount: '₹8,500', paymentType: 'Bank Transfer', paymentDate: '28 Sep 2026', status: 'Pending' },
    { id: 3, tenant: 'Aman Verma', amount: '₹9,200', paymentType: 'Credit Card', paymentDate: '03 Oct 2026', status: 'Paid' }
  ]);
  const [complaintsData, setComplaintsData] = useState([
    { id: 1, tenant: 'Rahul Sharma', room: '204', category: 'Maintenance', type: 'Maintenance', description: 'AC not cooling properly in room 204', date: '02 Oct 2026', status: 'Pending' },
    { id: 2, tenant: 'Priya M', room: '302', category: 'Cleaning', type: 'Cleaning', description: 'Deep room sanitization requested', date: '01 Oct 2026', status: 'Resolved' },
    { id: 3, tenant: 'Aman Verma', room: '105', category: 'Internet', type: 'Internet', description: 'Wi-Fi disconnects frequently on 1st floor', date: '04 Oct 2026', status: 'Pending' }
  ]);
  const [requestsData, setRequestsData] = useState([
    { id: 1, tenant: 'Rahul Sharma', requestType: 'Late Entry', type: 'Late Entry', description: 'Coming late due to office project sprint', date: '02 Oct 2026', status: 'Approved' },
    { id: 2, tenant: 'Aman Verma', requestType: 'Room Change', type: 'Room Change', description: 'Requesting room upgrade to 2 sharing', date: '03 Oct 2026', status: 'Pending' }
  ]);
  const [visitorLogs, setVisitorLogs] = useState([
    { id: 1, visitorName: 'Suresh Kumar', tenant: 'Rahul Sharma', room: '204', phone: '+91 98765 00001', entryTime: '10:00 AM', exitTime: '12:00 PM', date: '02 Oct 2026', status: 'Checked Out' },
    { id: 2, visitorName: 'Neha Verma', tenant: 'Rahul Sharma', room: '204', phone: '+91 98765 00002', entryTime: '04:00 PM', exitTime: '--', date: '02 Oct 2026', status: 'Inside' },
    { id: 3, visitorName: 'Amit Saxena', tenant: 'Aman Verma', room: '105', phone: '+91 98765 00003', entryTime: '02:15 PM', exitTime: '--', date: '02 Oct 2026', status: 'Inside' }
  ]);
  
  // Kitchen
  const [menuCosting, setMenuCosting] = useState([
    { id: 1, date: '02 Oct 2026', meal: 'Breakfast', menu: 'Idli, Sambar, Coconut Chutney', mealCount: 150 },
    { id: 2, date: '02 Oct 2026', meal: 'Lunch', menu: 'Basmati Rice, Dal Tadka, Paneer Butter Masala, Roti', mealCount: 135 },
    { id: 3, date: '02 Oct 2026', meal: 'Dinner', menu: 'Wheat Roti, Mixed Vegetable Korma, Jeera Rice', mealCount: 140 }
  ]);
  const [specialRequests, setSpecialRequests] = useState([
    { id: 1, tenant: 'Rahul Sharma', meal: 'Dinner', request: 'Pack meal in lunchbox due to late office shift', date: '02 Oct 2026', status: 'Pending' },
    { id: 2, tenant: 'Priya M', meal: 'Lunch', request: 'Jain food / No onion, no garlic', date: '02 Oct 2026', status: 'Fulfilled' }
  ]);
  const [cleaningHygiene, setCleaningHygiene] = useState([
    { id: 1, date: '02 Oct 2026', task: 'Deep clean exhaust chimney & grease filters', status: 'Completed' },
    { id: 2, date: '02 Oct 2026', task: 'Dining hall floor mopping and sanitization', status: 'Pending' },
    { id: 3, date: '02 Oct 2026', task: 'Kitchen counter surface bactericidal wipe down', status: 'Completed' }
  ]);
  const [inventory, setInventory] = useState([
    { id: 1, item: 'Basmati Rice', quantity: '50', unit: 'kg', stockStatus: 'Adequate' },
    { id: 2, item: 'Cooking Sunflower Oil', quantity: '5', unit: 'Liters', stockStatus: 'Low Stock' },
    { id: 3, item: 'Toor Dal', quantity: '20', unit: 'kg', stockStatus: 'Adequate' },
    { id: 4, item: 'Wheat Flour (Atta)', quantity: '40', unit: 'kg', stockStatus: 'Adequate' },
    { id: 5, item: 'Dairy Milk & Curd', quantity: '4', unit: 'Liters', stockStatus: 'Low Stock' }
  ]);
  
  // Security
  const [gateEntryExit, setGateEntryExit] = useState([
    { id: 1, visitorName: 'Ramesh Singh', tenant: 'Priya M', room: '302', entryTime: '01:30 PM', exitTime: '--', status: 'Inside' },
    { id: 2, visitorName: 'Neha Verma', tenant: 'Rahul Sharma', room: '204', entryTime: '04:00 PM', exitTime: '--', status: 'Inside' }
  ]);
  const [visitorRequests, setVisitorRequests] = useState([
    { id: 1, visitorName: 'Neha Verma', tenant: 'Rahul Sharma', visitDate: '03 Oct 2026', visitTime: '04:00 PM', status: 'Approved' },
    { id: 2, visitorName: 'Kunal Kapoor', tenant: 'Aman Verma', visitDate: '04 Oct 2026', visitTime: '11:00 AM', status: 'Pending' }
  ]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([
    { id: 1, alertType: 'Smoke Detector', location: 'Floor 2, Corridor A', description: 'Smoke triggered near laundry room', status: 'Resolved' },
    { id: 2, alertType: 'Water Pressure Loss', location: 'Block B Pump Room', description: 'Secondary water pump tripped', status: 'Active' }
  ]);

  // Admin / Super Admin
  const [pgList, setPgList] = useState([
    { id: 1, name: 'ArcNio Cyber Towers', owner: 'Ramesh Gupta', phone: '+91 98765 43211', email: 'ramesh@cyber.com', address: 'HITEC City, Hyderabad', totalRooms: 80, totalBeds: 150, status: 'Active' },
    { id: 2, name: 'The Vista Co-Living Hub', owner: 'Alexander Vance', phone: '+91 98765 43210', email: 'alex@vista.com', address: 'Indiranagar, Bengaluru', totalRooms: 100, totalBeds: 200, status: 'Active' },
    { id: 3, name: 'ArcNio Grand Co-Living', owner: 'Suresh Menon', phone: '+91 98112 44332', email: 'suresh@arcnio.com', address: 'Sector 62, Noida', totalRooms: 60, totalBeds: 120, status: 'Active' }
  ]);
  const [invitations, setInvitations] = useState([
    { id: 1, tenantName: 'Rahul Sharma', contact: 'rahul@example.com', pgName: 'The Vista Co-Living Hub', plan: '6 Months', status: 'Accepted' },
    { id: 2, tenantName: 'Deepak Rao', contact: 'deepak.rao@example.com', pgName: 'ArcNio Cyber Towers', plan: '12 Months', status: 'Pending' }
  ]);
  const [revenues, setRevenues] = useState([
    { id: 1, pgName: 'The Vista Co-Living Hub', plan: 'Enterprise SaaS', amount: '₹12,999', paymentDate: '01 Oct 2026', status: 'Completed' },
    { id: 2, pgName: 'ArcNio Cyber Towers', plan: 'Pro Multi-Property', amount: '₹9,499', paymentDate: '02 Oct 2026', status: 'Completed' },
    { id: 3, pgName: 'ArcNio Grand Co-Living', plan: 'Starter SaaS', amount: '₹4,999', paymentDate: '05 Oct 2026', status: 'Pending' }
  ]);
  const [reminders, setReminders] = useState([
    { id: 1, type: 'Payment Due Reminder', triggerDate: '3 Days Before Due', message: 'Dear tenant, your monthly rent invoice is due in 3 days. Kindly pay to avoid late fees.', status: 'Enabled' },
    { id: 2, type: 'Late Rent Overdue Notice', triggerDate: '1 Day After Due', message: 'Urgent: Your rent payment is past due. Please clear your dues immediately.', status: 'Enabled' },
    { id: 3, type: 'Kitchen Maintenance Notice', triggerDate: 'Weekly Sunday', message: 'Dining hall cleaning scheduled every Sunday 3 PM to 5 PM.', status: 'Disabled' }
  ]);
  const [plans, setPlans] = useState([
    { id: 1, planName: 'Monthly Flex', duration: '1 Month', price: '₹2,499', status: 'Active' },
    { id: 2, planName: 'Semi-Annual Saver', duration: '6 Months', price: '₹12,999', status: 'Active' },
    { id: 3, planName: 'Annual Resident Pro', duration: '12 Months', price: '₹22,999', status: 'Active' }
  ]);

  // Manager
  const [bedAllocData, setBedAllocData] = useState([
    { id: 1, roomNumber: '204', room: '204', bed: 'A', tenant: 'Suresh Kumar', joiningDate: '01 Jun 2026', status: 'Occupied' },
    { id: 2, roomNumber: '204', room: '204', bed: 'B', tenant: 'Rahul Sharma', joiningDate: '01 Aug 2026', status: 'Occupied' },
    { id: 3, roomNumber: '302', room: '302', bed: 'A', tenant: 'Priya M', joiningDate: '15 Jul 2026', status: 'Occupied' },
    { id: 4, roomNumber: '105', room: '105', bed: 'A', tenant: 'Aman Verma', joiningDate: '10 Sep 2026', status: 'Occupied' },
    { id: 5, roomNumber: '105', room: '105', bed: 'B', tenant: 'Available', joiningDate: '--', status: 'Available' }
  ]);
  const [checkInOutData, setCheckInOutData] = useState([
    { id: 1, tenantName: 'Priya M', tenant: 'Priya M', room: '302', bed: 'A', type: 'Check-out', date: '30 Oct 2026', status: 'Pending Clearance' },
    { id: 2, tenantName: 'Rahul Sharma', tenant: 'Rahul Sharma', room: '204', bed: 'B', type: 'Check-in', date: '01 Aug 2026', status: 'Completed' }
  ]);
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, staffName: 'Ramesh Patel', date: '08 Oct 2026', checkIn: '08:00 AM', checkOut: '05:00 PM', status: 'Present' },
    { id: 2, staffName: 'Devendra Singh', date: '08 Oct 2026', checkIn: '08:00 PM', checkOut: '06:00 AM', status: 'Present' },
    { id: 3, staffName: 'Sanjay Kumar', date: '08 Oct 2026', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present' }
  ]);
  const [kitchenRequests, setKitchenRequests] = useState([
    { id: 1, tenant: 'Rahul Sharma', meal: 'Dinner', requestedBy: 'Manager', mealType: 'Dinner', request: 'Extra 5 plates for corporate visitors', description: 'Extra 5 plates for corporate visitors', status: 'Pending' }
  ]);

  // Accountant
  const [invoiceData, setInvoiceData] = useState([
    { id: 1, invoiceNumber: 'INV-1001', tenant: 'Rahul Sharma', month: 'October 2026', rent: '₹10,800', total: '₹10,800', amount: '₹10,800', dueDate: '05 Oct 2026', status: 'Paid' },
    { id: 2, invoiceNumber: 'INV-1002', tenant: 'Priya M', month: 'October 2026', rent: '₹8,500', total: '₹8,500', amount: '₹8,500', dueDate: '05 Oct 2026', status: 'Pending' },
    { id: 3, invoiceNumber: 'INV-1003', tenant: 'Aman Verma', month: 'October 2026', rent: '₹9,200', total: '₹9,200', amount: '₹9,200', dueDate: '07 Oct 2026', status: 'Pending' }
  ]);
  const [paymentsData, setPaymentsData] = useState([
    { id: 1, paymentId: 'PAY-8901', tenant: 'Rahul Sharma', amount: '₹10,800', mode: 'UPI', method: 'UPI', date: '01 Oct 2026', status: 'Successful' },
    { id: 2, paymentId: 'PAY-8902', tenant: 'Aman Verma', amount: '₹9,200', mode: 'Credit Card', method: 'Credit Card', date: '03 Oct 2026', status: 'Successful' }
  ]);
  const [expensesData, setExpensesData] = useState([
    { id: 1, category: 'Maintenance', type: 'Maintenance', description: 'Plumbing fix Room 204 & replacement tap', amount: '₹1,500', date: '02 Oct 2026', status: 'Cleared' },
    { id: 2, category: 'Utilities', type: 'Electricity & Water', description: 'Monthly common utility bill', amount: '₹14,200', date: '03 Oct 2026', status: 'Cleared' },
    { id: 3, category: 'Internet', type: 'Fiber Wi-Fi', description: 'High-speed 1Gbps commercial fiber lease', amount: '₹3,500', date: '01 Oct 2026', status: 'Cleared' }
  ]);
  const [depositsData, setDepositsData] = useState([
    { id: 1, tenant: 'Rahul Sharma', amount: '₹20,000', depositAmount: '₹20,000', refundAmount: '₹0 (Active Stay)', depositDate: '01 Aug 2026', refundStatus: 'Held', status: 'Held in Escrow' },
    { id: 2, tenant: 'Priya M', amount: '₹17,000', depositAmount: '₹17,000', refundAmount: '₹17,000', depositDate: '15 Jul 2026', refundStatus: 'Processing', status: 'Pending Clearance' }
  ]);

  const value = {
    searchQuery, setSearchQuery,
    tenantsData, setTenantsData,
    roomsData, setRoomsData,
    staffData, setStaffData,
    financeData, setFinanceData,
    complaintsData, setComplaintsData,
    myComplaints: complaintsData, setMyComplaints: setComplaintsData, 
    requestsData, setRequestsData,
    myRequests: requestsData, setMyRequests: setRequestsData, 
    visitorLogs, setVisitorLogs,
    visitorPasses: visitorLogs, setVisitorPasses: setVisitorLogs, 
    visitorsData: visitorLogs, setVisitorsData: setVisitorLogs, 
    menuCosting, setMenuCosting,
    specialRequests, setSpecialRequests,
    cleaningHygiene, setCleaningHygiene,
    inventory, setInventory,
    gateEntryExit, setGateEntryExit,
    visitorRequests, setVisitorRequests,
    emergencyAlerts, setEmergencyAlerts,
    pgList, setPgList,
    pgData: pgList, setPgData: setPgList, 
    invitations, setInvitations,
    revenues, setRevenues,
    reminders, setReminders,
    plans, setPlans,
    roomsBedsData: roomsData, setRoomsBedsData: setRoomsData, 
    bedAllocData, setBedAllocData,
    checkInOutData, setCheckInOutData,
    attendanceData, setAttendanceData,
    kitchenRequests, setKitchenRequests,
    invoiceData, setInvoiceData,
    paymentsData, setPaymentsData,
    expensesData, setExpensesData,
    depositsData, setDepositsData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
