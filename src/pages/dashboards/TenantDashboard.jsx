// src/pages/dashboards/TenantDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import residentBg from '../../assets/tenant_login_bg.jpg';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Home, 
  Bed, 
  CreditCard, 
  AlertCircle,
  FileText,
  UserCheck,
  Coffee,
  Calendar,
  Bell,
  FileBadge,
  Download,
  Eye,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TenantDashboard() {
  const dataContext = useData();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  const activeTab = lastPart === 'dashboard' ? 'overview' : lastPart;

  useEffect(() => {
    if (lastPart === 'dashboard') {
      navigate('overview', { replace: true });
    }
  }, [lastPart, navigate]);

  const setActiveTab = (tab) => {
    const basePath = location.pathname.split('/dashboard')[0] + '/dashboard';
    navigate(`${basePath}/${tab}`);
  };
  const roleThemeColor = '#059669'; // Emerald/Green for tenant

  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showAmenityModal, setShowAmenityModal] = useState(false);

  // Interactive Payment Gateway State
  const [payingRentItem, setPayingRentItem] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState(null);

  // Document Viewer State
  const [viewingDoc, setViewingDoc] = useState(null);

  const roomDetails = { roomNumber: '204', bedNumber: 'B', roomType: '2 Sharing', roommates: 'Suresh Kumar (Bed A)' };
  
  const [rentPayments, setRentPayments] = useState([
    { id: 1, month: 'Oct 2026', rentAmount: '₹10,800', dueDate: '05 Oct 2026', status: 'Pending' },
    { id: 2, month: 'Sep 2026', rentAmount: '₹10,800', dueDate: '05 Sep 2026', status: 'Paid', paidOn: '04 Sep 2026' },
  ]);
  
  const { myComplaints, setMyComplaints } = dataContext;
  const { myRequests, setMyRequests } = dataContext;
  const { visitorPasses, setVisitorPasses, searchQuery } = dataContext;

  const filterList = (items) => {
    if (!items) return [];
    if (!searchQuery || !searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter(item =>
      Object.values(item).some(val =>
        val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      )
    );
  };
  
  const messMenu = [
    { id: 1, date: '02 Oct 2026', breakfast: 'Idli, Sambar', lunch: 'Rice, Dal, Paneer', dinner: 'Roti, Sabzi' },
    { id: 2, date: '03 Oct 2026', breakfast: 'Poha, Boiled Eggs', lunch: 'Veg Biryani, Raita', dinner: 'Chapati, Chana Masala' }
  ];

  const [amenityBookings, setAmenityBookings] = useState([
    { id: 1, amenity: 'Gym (Evening Slot)', date: '02 Oct 2026', time: '06:00 PM', status: 'Confirmed' },
    { id: 2, amenity: 'Study Room Cubicle 4', date: '04 Oct 2026', time: '10:00 AM', status: 'Confirmed' }
  ]);

  const announcements = [
    { id: 1, title: 'Lift Maintenance', description: 'Lift will be under maintenance tomorrow from 2 PM to 4 PM.', date: '01 Oct 2026', status: 'Active' },
    { id: 2, title: 'Wi-Fi Speed Upgrade', description: 'Broadband routers will reboot tonight at 02:00 AM.', date: '03 Oct 2026', status: 'Active' }
  ];

  const documents = [
    { id: 1, documentName: 'Rental Agreement', date: '01 Aug 2026', status: 'Signed', size: '1.4 MB' },
    { id: 2, documentName: 'PG House Rules & Code of Conduct', date: '01 Aug 2026', status: 'Acknowledged', size: '420 KB' },
    { id: 3, documentName: 'Security Deposit Receipt', date: '01 Aug 2026', status: 'Verified', size: '210 KB' }
  ];

  const chartData = [
    { name: 'May', expenses: 10800 },
    { name: 'Jun', expenses: 10800 },
    { name: 'Jul', expenses: 10800 },
    { name: 'Aug', expenses: 11200 },
    { name: 'Sep', expenses: 10800 },
    { name: 'Oct', expenses: rentPayments.find(r => r.month === 'Oct 2026' && r.status === 'Paid') ? 10800 : 0 },
  ];

  const sidebarItems = [
    { icon: <Home size={18} />, label: 'Dashboard / Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <Bed size={18} />, label: 'My Room Details', active: activeTab === 'room', onClick: () => setActiveTab('room') },
    { icon: <CreditCard size={18} />, label: 'Rent & Payments', active: activeTab === 'rent', onClick: () => setActiveTab('rent') },
    { icon: <AlertCircle size={18} />, label: 'My Complaints', active: activeTab === 'complaints', onClick: () => setActiveTab('complaints') },
    { icon: <FileText size={18} />, label: 'My Requests', active: activeTab === 'requests', onClick: () => setActiveTab('requests') },
    { icon: <UserCheck size={18} />, label: 'Visitor Pass Requests', active: activeTab === 'visitors', onClick: () => setActiveTab('visitors') },
    { icon: <Coffee size={18} />, label: 'Mess & Food Menu', active: activeTab === 'mess', onClick: () => setActiveTab('mess') },
    { icon: <Calendar size={18} />, label: 'Amenity Bookings', active: activeTab === 'amenities', onClick: () => setActiveTab('amenities') },
    { icon: <Bell size={18} />, label: 'Announcements & Notices', active: activeTab === 'announcements', onClick: () => setActiveTab('announcements') },
    { icon: <FileBadge size={18} />, label: 'Rental Agreement & Documents', active: activeTab === 'documents', onClick: () => setActiveTab('documents') }
  ];

  const handleSaveComplaint = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const item = {
      id: editingComplaint ? editingComplaint.id : Date.now(),
      type: fd.get('type'), description: fd.get('description'), date: new Date().toLocaleDateString('en-GB'), status: 'Pending'
    };
    if (editingComplaint) setMyComplaints(myComplaints.map(x => x.id === editingComplaint.id ? item : x));
    else setMyComplaints([...myComplaints, item]);
    setShowComplaintModal(false);
  };
  const handleDeleteComplaint = (id) => { if(window.confirm('Delete complaint?')) setMyComplaints(myComplaints.filter(x => x.id !== id)); };

  const handleSaveRequest = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const item = {
      id: editingRequest ? editingRequest.id : Date.now(),
      type: fd.get('type'), description: fd.get('description'), date: new Date().toLocaleDateString('en-GB'), status: 'Pending'
    };
    if (editingRequest) setMyRequests(myRequests.map(x => x.id === editingRequest.id ? item : x));
    else setMyRequests([...myRequests, item]);
    setShowRequestModal(false);
  };
  const handleDeleteRequest = (id) => { if(window.confirm('Delete request?')) setMyRequests(myRequests.filter(x => x.id !== id)); };

  const handleSaveVisitor = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const item = {
      id: Date.now(),
      visitorName: fd.get('visitorName'), phone: fd.get('phone'), date: fd.get('date'), time: fd.get('time'), status: 'Pending'
    };
    setVisitorPasses([...visitorPasses, item]);
    setShowVisitorModal(false);
  };

  const handleCancelVisitor = (id) => {
    if (window.confirm('Cancel this visitor pass request?')) {
      setVisitorPasses(visitorPasses.filter(v => v.id !== id));
    }
  };

  const handleSaveAmenity = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newBooking = {
      id: Date.now(),
      amenity: fd.get('amenity'),
      date: fd.get('date'),
      time: fd.get('time'),
      status: 'Confirmed'
    };
    setAmenityBookings([...amenityBookings, newBooking]);
    setShowAmenityModal(false);
  };

  const handleCancelAmenity = (id) => {
    if (window.confirm('Cancel this amenity slot booking?')) {
      setAmenityBookings(amenityBookings.filter(a => a.id !== id));
    }
  };

  const handleConfirmRentPayment = () => {
    if (!payingRentItem) return;
    setPaymentProcessing(true);
    setTimeout(() => {
      const updated = rentPayments.map(p => 
        p.id === payingRentItem.id 
          ? { ...p, status: 'Paid', paidOn: new Date().toLocaleDateString('en-GB') } 
          : p
      );
      setRentPayments(updated);
      setPaymentProcessing(false);
      setPaidReceipt({
        ...payingRentItem,
        receiptNo: `RCP-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-GB'),
        method: paymentMethod.toUpperCase()
      });
      setPayingRentItem(null);
    }, 1200);
  };

  return (
    <DashboardLayout
      title="Tenant Dashboard"
      subtitle="Your stay, your space, all in one place."
      roleThemeColor={roleThemeColor}
      sidebarItems={sidebarItems}
      activeTabKey={activeTab}
      bgImage={residentBg}
      onBack={() => setActiveTab('overview')}
    >
      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          <div className="metrics-grid">
            <div className="metric-card"><div className="metric-icon-box" style={{color: roleThemeColor}}><Bed size={28}/></div><div className="metric-details"><h4>Room & Bed</h4><div className="metric-value">204 (B)</div></div></div>
            <div className="metric-card"><div className="metric-icon-box" style={{color: '#ef4444'}}><CreditCard size={28}/></div><div className="metric-details"><h4>Rent Due</h4><div className="metric-value" style={{ color: '#ef4444' }}>₹10,800</div></div></div>
            <div className="metric-card"><div className="metric-icon-box" style={{color: '#f59e0b'}}><AlertCircle size={28}/></div><div className="metric-details"><h4>Pending Complaints</h4><div className="metric-value">{myComplaints.length}</div></div></div>
            <div className="metric-card"><div className="metric-icon-box" style={{color: '#10b981'}}><FileText size={28}/></div><div className="metric-details"><h4>Pending Requests</h4><div className="metric-value">{myRequests.length}</div></div></div>
          </div>
          
          <div className="dashboard-section-card">
            <div className="section-header"><h3>Quick Actions</h3></div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
               <button onClick={() => setActiveTab('rent')} className="btn-primary">Pay Rent</button>
               <button onClick={() => { setEditingComplaint(null); setShowComplaintModal(true); }} className="btn-secondary">Raise Complaint</button>
               <button onClick={() => { setEditingRequest(null); setShowRequestModal(true); }} className="btn-secondary">Make Request</button>
               <button onClick={() => setShowVisitorModal(true)} className="btn-secondary">Request Visitor Pass</button>
            </div>
          </div>

          <div className="dashboard-section-card" style={{ padding: '2rem' }}>
             <div className="section-header">
                <h3>My Rent Payment History</h3>
             </div>
             <div style={{ width: '100%', height: 250, marginTop: '1.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <Tooltip cursor={{fill: 'var(--dash-subcard-bg)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)', color: 'var(--dash-text)'}} />
                    <Bar dataKey="expenses" fill={roleThemeColor} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </>
      )}

      {/* MY ROOM DETAILS */}
      {activeTab === 'room' && (
        <div className="dashboard-section-card">
          <div className="section-header"><h3>My Room Details</h3></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'var(--dash-subcard-bg)', padding: '1.5rem', borderRadius: '12px' }}><label style={{ fontSize: '0.85rem', color: 'var(--dash-muted)', fontWeight: 700 }}>Room Number</label><div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem' }}>{roomDetails.roomNumber}</div></div>
            <div style={{ background: 'var(--dash-subcard-bg)', padding: '1.5rem', borderRadius: '12px' }}><label style={{ fontSize: '0.85rem', color: 'var(--dash-muted)', fontWeight: 700 }}>Bed Number</label><div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem' }}>{roomDetails.bedNumber}</div></div>
            <div style={{ background: 'var(--dash-subcard-bg)', padding: '1.5rem', borderRadius: '12px' }}><label style={{ fontSize: '0.85rem', color: 'var(--dash-muted)', fontWeight: 700 }}>Room Type</label><div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.5rem' }}>{roomDetails.roomType}</div></div>
            <div style={{ background: 'var(--dash-subcard-bg)', padding: '1.5rem', borderRadius: '12px' }}><label style={{ fontSize: '0.85rem', color: 'var(--dash-muted)', fontWeight: 700 }}>Roommates</label><div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.5rem' }}>{roomDetails.roommates}</div></div>
          </div>
        </div>
      )}

      {/* RENT & PAYMENTS */}
      {activeTab === 'rent' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Rent & Payments ({filterList(rentPayments).length})</h3>
          </div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Billing Month</th><th>Rent Amount</th><th>Due Date</th><th>Payment Status</th><th>Action</th></tr></thead>
              <tbody>
                {filterList(rentPayments).map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.month}</td>
                    <td style={{ fontWeight: 800 }}>{r.rentAmount}</td>
                    <td>{r.dueDate}</td>
                    <td>
                      <span style={{ 
                        color: r.status === 'Pending' ? '#ef4444' : '#10b981', 
                        fontWeight: 700,
                        background: r.status === 'Pending' ? '#fee2e2' : '#ecfdf5',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem'
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === 'Pending' ? (
                        <button 
                          className="btn-primary" 
                          style={{ padding: '0.45rem 1rem' }}
                          onClick={() => setPayingRentItem(r)}
                        >
                          Pay Now
                        </button>
                      ) : (
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => setPaidReceipt({
                            ...r,
                            receiptNo: `RCP-839201`,
                            date: r.paidOn || '04 Sep 2026',
                            method: 'ONLINE UPI'
                          })}
                        >
                          View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MY COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="dashboard-section-card">
          <div className="section-header">
             <h3>My Complaints ({filterList(myComplaints).length})</h3>
             <button onClick={() => { setEditingComplaint(null); setShowComplaintModal(true); }} className="btn-primary"><Plus size={16} /> Raise Complaint</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Complaint Type</th><th>Description</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filterList(myComplaints).map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.type}</td><td>{c.description}</td><td>{c.date}</td>
                    <td><span style={{ color: '#f59e0b', fontWeight: 700 }}>{c.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                         <button className="action-btn" title="Edit" onClick={() => { setEditingComplaint(c); setShowComplaintModal(true); }}><Edit2 size={15} /></button>
                         <button className="action-btn" style={{ color: '#ef4444' }} title="Delete" onClick={() => handleDeleteComplaint(c.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MY REQUESTS */}
      {activeTab === 'requests' && (
        <div className="dashboard-section-card">
          <div className="section-header">
             <h3>My Requests ({filterList(myRequests).length})</h3>
             <button onClick={() => { setEditingRequest(null); setShowRequestModal(true); }} className="btn-primary"><Plus size={16} /> Make Request</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Request Type</th><th>Description</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filterList(myRequests).map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.type}</td><td>{r.description}</td><td>{r.date}</td>
                    <td><span style={{ color: '#10b981', fontWeight: 700 }}>{r.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                         <button className="action-btn" title="Edit" onClick={() => { setEditingRequest(r); setShowRequestModal(true); }}><Edit2 size={15} /></button>
                         <button className="action-btn" style={{ color: '#ef4444' }} title="Delete" onClick={() => handleDeleteRequest(r.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISITOR PASS REQUESTS */}
      {activeTab === 'visitors' && (
        <div className="dashboard-section-card">
          <div className="section-header">
             <h3>Visitor Pass Requests ({filterList(visitorPasses).length})</h3>
             <button onClick={() => setShowVisitorModal(true)} className="btn-primary"><Plus size={16} /> Request Visitor Pass</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Visitor Name</th><th>Phone</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filterList(visitorPasses).map(v => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>{v.visitorName}</td><td>{v.phone}</td><td>{v.date}</td><td>{v.time}</td>
                    <td><span style={{ color: '#f59e0b', fontWeight: 700 }}>{v.status}</span></td>
                    <td>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#ef4444' }}
                        onClick={() => handleCancelVisitor(v.id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OTHER READ-ONLY SECTIONS (Mess, Amenities, Announcements, Documents) */}
      {activeTab === 'mess' && (
        <div className="dashboard-section-card">
          <div className="section-header"><h3>Mess & Food Menu ({filterList(messMenu).length})</h3></div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Date</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr></thead>
              <tbody>
                {filterList(messMenu).map(m => (
                  <tr key={m.id}><td style={{ fontWeight: 600 }}>{m.date}</td><td>{m.breakfast}</td><td>{m.lunch}</td><td>{m.dinner}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'amenities' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Amenity Bookings ({filterList(amenityBookings).length})</h3>
            <button onClick={() => setShowAmenityModal(true)} className="btn-primary">
              <Plus size={16} /> Book Amenity Slot
            </button>
          </div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Amenity</th><th>Date</th><th>Time</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filterList(amenityBookings).map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.amenity}</td>
                    <td>{a.date}</td>
                    <td>{a.time}</td>
                    <td><span style={{ color: '#10b981', fontWeight: 700 }}>{a.status}</span></td>
                    <td>
                      <button 
                        className="action-btn" 
                        style={{ color: '#ef4444' }} 
                        title="Cancel Slot" 
                        onClick={() => handleCancelAmenity(a.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="dashboard-section-card">
          <div className="section-header"><h3>Announcements & Notices ({filterList(announcements).length})</h3></div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Title</th><th>Description</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {filterList(announcements).map(a => (
                  <tr key={a.id}><td style={{ fontWeight: 600 }}>{a.title}</td><td>{a.description}</td><td>{a.date}</td><td><span style={{ color: '#0ea5e9', fontWeight: 700 }}>{a.status}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="dashboard-section-card">
          <div className="section-header"><h3>Rental Agreement & Documents ({filterList(documents).length})</h3></div>
          <div className="table-responsive">
            <table>
              <thead><tr><th>Document Name</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filterList(documents).map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.documentName}</td><td>{d.date}</td><td><span style={{ color: '#10b981', fontWeight: 700 }}>{d.status}</span></td>
                    <td>
                       <button className="action-btn" title="View Document" onClick={() => setViewingDoc(d)}><Eye size={15} /></button>
                       <button className="action-btn" title="Download Document" style={{ marginLeft: '0.5rem' }} onClick={() => alert(`Downloading verified copy of ${d.documentName}...`)}><Download size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showComplaintModal && (
        <div className="modal-backdrop" onClick={() => setShowComplaintModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>{editingComplaint ? 'Edit Complaint' : 'Raise Complaint'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveComplaint}>
              <div className="form-group">
                 <label>Complaint Type</label>
                 <select name="type" defaultValue={editingComplaint?.type || 'Maintenance'}>
                    <option>Maintenance</option><option>Cleaning</option><option>Internet</option><option>Other</option>
                 </select>
              </div>
              <div className="form-group"><label>Description</label><textarea name="description" defaultValue={editingComplaint?.description} rows="4" required></textarea></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowComplaintModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{editingComplaint ? 'Save Changes' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRequestModal && (
        <div className="modal-backdrop" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>{editingRequest ? 'Edit Request' : 'Make Request'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveRequest}>
              <div className="form-group">
                 <label>Request Type</label>
                 <select name="type" defaultValue={editingRequest?.type || 'Late Entry'}>
                    <option>Late Entry</option><option>Room Change</option><option>Other</option>
                 </select>
              </div>
              <div className="form-group"><label>Description</label><textarea name="description" defaultValue={editingRequest?.description} rows="4" required></textarea></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRequestModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{editingRequest ? 'Save Changes' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVisitorModal && (
        <div className="modal-backdrop" onClick={() => setShowVisitorModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>Request Visitor Pass</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveVisitor}>
              <div className="form-group"><label>Visitor Name</label><input type="text" name="visitorName" required /></div>
              <div className="form-group"><label>Phone</label><input type="text" name="phone" required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                 <div className="form-group"><label>Date</label><input type="date" name="date" required /></div>
                 <div className="form-group"><label>Time</label><input type="time" name="time" required /></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowVisitorModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AMENITY BOOKING MODAL */}
      {showAmenityModal && (
        <div className="modal-backdrop" onClick={() => setShowAmenityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>Book Amenity Slot</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveAmenity}>
              <div className="form-group">
                 <label>Select Amenity</label>
                 <select name="amenity" defaultValue="Gym (Evening Slot)" required>
                    <option>Gym (Morning Slot: 06:00 AM - 08:00 AM)</option>
                    <option>Gym (Evening Slot: 06:00 PM - 09:00 PM)</option>
                    <option>Study Room (Quiet Zone Cubicle)</option>
                    <option>Games Lounge (Pool / Table Tennis)</option>
                    <option>Laundry / Washing Machine Slot</option>
                 </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                 <div className="form-group"><label>Date</label><input type="date" name="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></div>
                 <div className="form-group"><label>Time Slot</label><input type="text" name="time" defaultValue="06:00 PM" required /></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAmenityModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT GATEWAY MODAL */}
      {payingRentItem && (
        <div className="modal-backdrop" onClick={() => !paymentProcessing && setPayingRentItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div>
                <h3>Pay Rent Securely</h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--dash-muted)' }}>
                  Month: <strong>{payingRentItem.month}</strong> • Due: {payingRentItem.dueDate}
                </p>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                {payingRentItem.rentAmount}
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--dash-muted)' }}>Choose Payment Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                {[
                  { id: 'upi', label: 'UPI / QR' },
                  { id: 'card', label: 'Debit / Card' },
                  { id: 'netbanking', label: 'Net Banking' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMethod(mode.id)}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: '8px',
                      border: paymentMethod === mode.id ? '2px solid #10b981' : '1px solid var(--dash-border)',
                      background: paymentMethod === mode.id ? '#ecfdf5' : 'var(--dash-subcard-bg)',
                      color: paymentMethod === mode.id ? '#059669' : 'var(--dash-text)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {paymentMethod === 'upi' && (
                <div style={{
                  marginTop: '1.25rem',
                  padding: '1.25rem',
                  background: 'var(--dash-subcard-bg)',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid var(--dash-border)'
                }}>
                  <div style={{ display: 'inline-block', background: '#ffffff', padding: '0.75rem', borderRadius: '12px' }}>
                    <QrCode size={110} style={{ color: '#0f172a' }} />
                  </div>
                  <div style={{ marginTop: '0.65rem', fontWeight: 700, fontSize: '0.9rem' }}>Scan using GPay, PhonePe, Paytm</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--dash-muted)', marginTop: '0.2rem' }}>UPI ID: <strong>arcniopg@okhdfcbank</strong></div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div className="form-group"><label>Card Number</label><input type="text" placeholder="4532 •••• •••• 8912" defaultValue="4532 8921 7842 1092" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group"><label>Expiry</label><input type="text" placeholder="MM/YY" defaultValue="08/28" /></div>
                    <div className="form-group"><label>CVV</label><input type="password" placeholder="•••" defaultValue="481" /></div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div style={{ marginTop: '1rem' }}>
                  <div className="form-group">
                    <label>Select Bank</label>
                    <select defaultValue="HDFC Bank">
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                    </select>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: '#10b981', fontSize: '0.8rem' }}>
                <ShieldCheck size={16} /> 256-bit Bank Grade SSL Encryption
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                disabled={paymentProcessing}
                onClick={() => setPayingRentItem(null)} 
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                disabled={paymentProcessing}
                onClick={handleConfirmRentPayment}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {paymentProcessing ? 'Processing Payment...' : `Pay ${payingRentItem.rentAmount}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT RECEIPT MODAL */}
      {paidReceipt && (
        <div className="modal-backdrop" onClick={() => setPaidReceipt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ textAlign: 'center', padding: '1rem 0 0.5rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: '#ecfdf5', 
                color: '#10b981', 
                borderRadius: '50%', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '0.75rem'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Payment Successful!</h3>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--dash-muted)', fontSize: '0.85rem' }}>
                Transaction Receipt generated and emailed to your registered ID.
              </p>
            </div>

            <div style={{
              background: 'var(--dash-subcard-bg)',
              border: '1px solid var(--dash-border)',
              borderRadius: '10px',
              padding: '1.25rem',
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--dash-muted)' }}>Receipt Number:</span>
                <span style={{ fontWeight: 700 }}>{paidReceipt.receiptNo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--dash-muted)' }}>Tenant:</span>
                <span style={{ fontWeight: 700 }}>{user?.name || 'Resident'} (Room 204-B)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--dash-muted)' }}>Billing Cycle:</span>
                <span style={{ fontWeight: 700 }}>{paidReceipt.month}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--dash-muted)' }}>Payment Mode:</span>
                <span style={{ fontWeight: 700 }}>{paidReceipt.method || 'ONLINE'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--dash-muted)' }}>Date & Time:</span>
                <span style={{ fontWeight: 700 }}>{paidReceipt.date}</span>
              </div>
              <div style={{ borderTop: '1px dashed var(--dash-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800 }}>Total Amount Paid:</span>
                <span style={{ fontWeight: 800, color: '#10b981', fontSize: '1.15rem' }}>{paidReceipt.rentAmount}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => alert(`Downloading PDF receipt for ${paidReceipt.receiptNo}...`)}
              >
                <Download size={15} /> Download PDF
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setPaidReceipt(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {viewingDoc && (
        <div className="modal-backdrop" onClick={() => setViewingDoc(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div>
                <h3>{viewingDoc.documentName}</h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--dash-muted)' }}>
                  Uploaded on {viewingDoc.date} • Status: <strong style={{ color: '#10b981' }}>{viewingDoc.status}</strong>
                </p>
              </div>
            </div>

            <div style={{
              background: 'var(--dash-subcard-bg)',
              border: '1px solid var(--dash-border)',
              borderRadius: '10px',
              padding: '1.5rem',
              marginTop: '1rem',
              fontSize: '0.85rem',
              lineHeight: 1.6
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: roleThemeColor }}>Document Verification Summary</h4>
              <p style={{ margin: '0 0 0.75rem 0' }}>
                This is a certified digital copy of the PG Resident Agreement entered between <strong>ArcNio Co-Living Management</strong> and the tenant.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'var(--dash-card-bg)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--dash-border)' }}>
                <div><strong>Digital Signature:</strong> Verified (Aadhar e-Sign)</div>
                <div><strong>Validity:</strong> 11 Months</div>
                <div><strong>Deposit Recorded:</strong> ₹20,000</div>
                <div><strong>Notice Period:</strong> 30 Days</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                className="btn-secondary" 
                onClick={() => alert(`Downloading ${viewingDoc.documentName}...`)}
              >
                <Download size={15} /> Download Document
              </button>
              <button className="btn-primary" onClick={() => setViewingDoc(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
