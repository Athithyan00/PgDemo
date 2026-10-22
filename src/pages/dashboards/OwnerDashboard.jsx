// src/pages/dashboards/OwnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import ownerBg from '../../assets/admin_login_bg.jpg';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Building2, 
  Users, 
  BedDouble, 
  UserCheck,
  DollarSign,
  AlertCircle,
  FileText,
  Plus, 
  Eye,
  TrendingUp,
  Download,
  Edit2,
  CheckCircle2,
  XCircle,
  Trash2,
  Coffee,
  Archive
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OwnerDashboard() {
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
  const roleThemeColor = '#d97706';

  // Modal States
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [viewingTenant, setViewingTenant] = useState(null);
  const [viewingDocTenant, setViewingDocTenant] = useState(null);

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [editingFinance, setEditingFinance] = useState(null);

  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState(null);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);

  // Data States
  const { pgData, setPgData } = dataContext;
  const { tenantsData, setTenantsData } = dataContext;
  const { roomsData, setRoomsData } = dataContext;
  const { staffData, setStaffData } = dataContext;
  const { financeData, setFinanceData } = dataContext;
  const { complaintsData, setComplaintsData } = dataContext;
  const { requestsData, setRequestsData } = dataContext;
  const { visitorLogs, setVisitorLogs } = dataContext;
  const { inventory, menuCosting } = dataContext;

  const searchQuery = dataContext?.searchQuery || '';

  // Filtered Lists
  const filteredTenants = tenantsData.filter(t => !searchQuery || t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || t.phone?.includes(searchQuery) || t.room?.toLowerCase().includes(searchQuery.toLowerCase()) || t.status?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRooms = roomsData.filter(r => !searchQuery || r.roomNumber?.toString().includes(searchQuery) || r.floor?.toLowerCase().includes(searchQuery.toLowerCase()) || r.roomType?.toLowerCase().includes(searchQuery.toLowerCase()) || r.status?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredStaff = staffData.filter(s => !searchQuery || s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.role?.toLowerCase().includes(searchQuery.toLowerCase()) || s.phone?.includes(searchQuery) || s.shift?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFinance = financeData.filter(f => !searchQuery || f.tenant?.toLowerCase().includes(searchQuery.toLowerCase()) || f.amount?.toString().includes(searchQuery) || f.paymentType?.toLowerCase().includes(searchQuery.toLowerCase()) || f.status?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredComplaints = complaintsData.filter(c => !searchQuery || c.tenant?.toLowerCase().includes(searchQuery.toLowerCase()) || c.room?.toLowerCase().includes(searchQuery.toLowerCase()) || c.category?.toLowerCase().includes(searchQuery.toLowerCase()) || c.description?.toLowerCase().includes(searchQuery.toLowerCase()) || c.status?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRequests = requestsData.filter(r => !searchQuery || r.tenant?.toLowerCase().includes(searchQuery.toLowerCase()) || r.requestType?.toLowerCase().includes(searchQuery.toLowerCase()) || r.description?.toLowerCase().includes(searchQuery.toLowerCase()) || r.status?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredVisitors = visitorLogs.filter(v => !searchQuery || v.visitorName?.toLowerCase().includes(searchQuery.toLowerCase()) || v.tenant?.toLowerCase().includes(searchQuery.toLowerCase()) || v.room?.toLowerCase().includes(searchQuery.toLowerCase()) || v.status?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPgData = pgData.filter(p => !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.owner?.toLowerCase().includes(searchQuery.toLowerCase()) || p.phone?.includes(searchQuery) || p.address?.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Metric,Value", `Total Tenants,${tenantsData.length}`, `Total Rooms,${roomsData.length}`, `Active Complaints,${complaintsData.filter(c => c.status === 'Pending').length}`, `Occupied Beds,172`, `Revenue Total,₹19,300`].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ArcNio_Operations_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = [
    { name: 'Mon', occupancy: 85 },
    { name: 'Tue', occupancy: 86 },
    { name: 'Wed', occupancy: 86 },
    { name: 'Thu', occupancy: 88 },
    { name: 'Fri', occupancy: 90 },
    { name: 'Sat', occupancy: 92 },
    { name: 'Sun', occupancy: 95 },
  ];

  const sidebarItems = [
    { icon: <Building2 size={18} />, label: 'Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <Building2 size={18} />, label: 'PG Management', active: activeTab === 'pg-management', onClick: () => setActiveTab('pg-management') },
    { icon: <Users size={18} />, label: 'Tenants', active: activeTab === 'tenants', onClick: () => setActiveTab('tenants') },
    { icon: <BedDouble size={18} />, label: 'Rooms & Beds', active: activeTab === 'rooms', onClick: () => setActiveTab('rooms') },
    { icon: <UserCheck size={18} />, label: 'Staff Directory', active: activeTab === 'staff', onClick: () => setActiveTab('staff') },
    { icon: <DollarSign size={18} />, label: 'Finance & Revenue', active: activeTab === 'finance', onClick: () => setActiveTab('finance') },
    { icon: <AlertCircle size={18} />, label: 'Complaints', active: activeTab === 'complaints', onClick: () => setActiveTab('complaints') },
    { icon: <FileText size={18} />, label: 'Tenant Requests', active: activeTab === 'requests', onClick: () => setActiveTab('requests') },
    { icon: <Users size={18} />, label: 'Visitor Logs', active: activeTab === 'visitors', onClick: () => setActiveTab('visitors') },
    { icon: <Coffee size={18} />, label: 'Kitchen & Inventory', active: activeTab === 'kitchen', onClick: () => setActiveTab('kitchen') },
    { icon: <TrendingUp size={18} />, label: 'Reports & Analytics', active: activeTab === 'reports', onClick: () => setActiveTab('reports') }
  ];

  // Action Handlers
  const handleSaveTenant = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const hasDocs = fd.get('idProof') || fd.get('agreement');
    const nt = { id: editingTenant ? editingTenant.id : Date.now(), name: fd.get('name'), phone: fd.get('phone'), room: fd.get('room'), bed: fd.get('bed'), joiningDate: fd.get('joiningDate'), rent: fd.get('rent'), status: fd.get('status'), hasDocs: hasDocs ? true : false };
    if (editingTenant) setTenantsData(tenantsData.map(x => x.id === editingTenant.id ? nt : x));
    else setTenantsData([...tenantsData, nt]);
    setShowTenantModal(false);
  };
  const handleDeleteTenant = (id) => { if(window.confirm('Delete tenant?')) setTenantsData(tenantsData.filter(x => x.id !== id)); };
  const handleToggleTenant = (id) => setTenantsData(tenantsData.map(x => x.id === id ? {...x, status: x.status === 'Active' ? 'Inactive' : 'Active'} : x));

  const handleSaveRoom = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const nr = { id: editingRoom ? editingRoom.id : Date.now(), roomNumber: fd.get('roomNumber'), floor: fd.get('floor'), roomType: fd.get('roomType'), totalBeds: fd.get('totalBeds'), availableBeds: fd.get('availableBeds'), status: fd.get('status') };
    if (editingRoom) setRoomsData(roomsData.map(x => x.id === editingRoom.id ? nr : x));
    else setRoomsData([...roomsData, nr]);
    setShowRoomModal(false);
  };
  const handleDeleteRoom = (id) => { if(window.confirm('Delete room?')) setRoomsData(roomsData.filter(x => x.id !== id)); };

  const handleSaveStaff = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const ns = { id: editingStaff ? editingStaff.id : Date.now(), name: fd.get('name'), role: fd.get('role'), phone: fd.get('phone'), shift: fd.get('shift'), status: fd.get('status') };
    if (editingStaff) setStaffData(staffData.map(x => x.id === editingStaff.id ? ns : x));
    else setStaffData([...staffData, ns]);
    setShowStaffModal(false);
  };
  const handleDeleteStaff = (id) => { if(window.confirm('Delete staff?')) setStaffData(staffData.filter(x => x.id !== id)); };

  const handleSaveFinance = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const nf = { id: editingFinance ? editingFinance.id : Date.now(), tenant: fd.get('tenant'), amount: fd.get('amount'), paymentType: fd.get('paymentType'), paymentDate: fd.get('paymentDate'), status: fd.get('status') };
    if (editingFinance) setFinanceData(financeData.map(x => x.id === editingFinance.id ? nf : x));
    else setFinanceData([...financeData, nf]);
    setShowFinanceModal(false);
  };
  const handleDeleteFinance = (id) => { if(window.confirm('Delete record?')) setFinanceData(financeData.filter(x => x.id !== id)); };

  const handleSaveComplaint = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const nc = { id: editingComplaint ? editingComplaint.id : Date.now(), tenant: fd.get('tenant'), room: fd.get('room'), category: fd.get('category'), description: fd.get('description'), status: fd.get('status') };
    if (editingComplaint) setComplaintsData(complaintsData.map(x => x.id === editingComplaint.id ? nc : x));
    else setComplaintsData([...complaintsData, nc]);
    setShowComplaintModal(false);
  };
  const handleResolveComplaint = (id) => setComplaintsData(complaintsData.map(c => c.id === id ? {...c, status: 'Resolved'} : c));
  const handleDeleteComplaint = (id) => { if(window.confirm('Delete complaint?')) setComplaintsData(complaintsData.filter(c => c.id !== id)); };

  const handleSaveRequest = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const nr = { id: editingRequest ? editingRequest.id : Date.now(), tenant: fd.get('tenant'), requestType: fd.get('requestType'), description: fd.get('description'), status: fd.get('status') };
    if (editingRequest) setRequestsData(requestsData.map(x => x.id === editingRequest.id ? nr : x));
    else setRequestsData([...requestsData, nr]);
    setShowRequestModal(false);
  };
  const handleDeleteRequest = (id) => { if(window.confirm('Delete request?')) setRequestsData(requestsData.filter(c => c.id !== id)); };

  const handleSaveVisitor = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const nv = { id: editingVisitor ? editingVisitor.id : Date.now(), visitorName: fd.get('visitorName'), tenant: fd.get('tenant'), room: fd.get('room'), entryTime: fd.get('entryTime'), exitTime: fd.get('exitTime'), status: fd.get('status') };
    if (editingVisitor) setVisitorLogs(visitorLogs.map(x => x.id === editingVisitor.id ? nv : x));
    else setVisitorLogs([...visitorLogs, nv]);
    setShowVisitorModal(false);
  };
  const handleDeleteVisitor = (id) => { if(window.confirm('Delete log?')) setVisitorLogs(visitorLogs.filter(c => c.id !== id)); };

  return (
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Complete control over your PG operations"
      roleThemeColor={roleThemeColor}
      sidebarItems={sidebarItems}
      activeTabKey={activeTab}
      bgImage={ownerBg}
      onBack={() => setActiveTab('overview')}
    >
      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          <div className="metrics-grid">
            <div className="metric-card"><div className="metric-icon-box" style={{color: roleThemeColor}}><Users size={28}/></div><div className="metric-details"><h4>Total Tenants</h4><div className="metric-value">{tenantsData.length}</div></div></div>
            <div className="metric-card"><div className="metric-icon-box" style={{color: '#2563eb'}}><Building2 size={28}/></div><div className="metric-details"><h4>Total Rooms</h4><div className="metric-value">{roomsData.length}</div></div></div>
            <div className="metric-card"><div className="metric-icon-box" style={{color: '#10b981'}}><BedDouble size={28}/></div><div className="metric-details"><h4>Occupied Beds</h4><div className="metric-value">172</div></div></div>
            <div className="metric-card"><div className="metric-icon-box" style={{color: '#ef4444'}}><AlertCircle size={28}/></div><div className="metric-details"><h4>Complaints</h4><div className="metric-value">{complaintsData.filter(c => c.status === 'Pending').length}</div></div></div>
          </div>
          
          <div className="dashboard-section-card" style={{ padding: '2rem' }}>
             <div className="section-header">
                <h3>Weekly Occupancy Trend</h3>
             </div>
             <div style={{ width: '100%', height: 300, marginTop: '1.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <Tooltip cursor={{fill: 'var(--dash-subcard-bg)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)', color: 'var(--dash-text)'}} />
                    <Bar dataKey="occupancy" fill={roleThemeColor} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </>
      )}

      {/* PG MANAGEMENT */}
      {activeTab === 'pg-management' && (
        <div className="dashboard-section-card">
          <div className="section-header"><h3>PG Management</h3></div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>PG Name</th><th>Owner Name</th><th>Phone</th><th>Address</th><th>Total Rooms</th><th>Total Beds</th></tr>
              </thead>
              <tbody>
                {filteredPgData.map(pg => (
                  <tr key={pg.id}>
                    <td style={{ fontWeight: 600 }}>{pg.name}</td><td>{pg.owner}</td><td>{pg.phone}</td><td>{pg.address}</td><td>{pg.totalRooms}</td><td>{pg.totalBeds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TENANTS */}
      {activeTab === 'tenants' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Tenants</h3>
            <button onClick={() => { setEditingTenant(null); setShowTenantModal(true); }} className="btn-primary"><Plus size={16} /> Add Tenant</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Name</th><th>Phone</th><th>Room</th><th>Bed</th><th>Joining Date</th><th>Rent</th><th>Docs</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredTenants.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.name}</td><td>{t.phone}</td><td>{t.room}</td><td>{t.bed}</td><td>{t.joiningDate}</td><td style={{ fontWeight: 700 }}>{t.rent}</td>
                    <td>
                      {t.hasDocs ? (
                        <FileText 
                          size={16} 
                          style={{ color: '#2563eb', cursor: 'pointer' }} 
                          title="View Verified Documents" 
                          onClick={() => setViewingDocTenant(t)}
                        />
                      ) : (
                        <span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>None</span>
                      )}
                    </td>
                    <td>
                      <span style={{ color: t.status === 'Active' ? '#10b981' : '#ef4444', fontWeight: 700, background: t.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: '6px' }}>{t.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                         <button className="action-btn" title="View Profile" onClick={() => setViewingTenant(t)}><Eye size={15} /></button>
                         <button className="action-btn" title="Edit" onClick={() => { setEditingTenant(t); setShowTenantModal(true); }}><Edit2 size={15} /></button>
                         <button className="action-btn" style={{ color: t.status === 'Active' ? '#f59e0b' : '#10b981' }} title="Toggle Status" onClick={() => handleToggleTenant(t.id)}>
                            {t.status === 'Active' ? <XCircle size={15}/> : <CheckCircle2 size={15}/>}
                         </button>
                         <button className="action-btn" style={{ color: '#ef4444' }} title="Delete" onClick={() => handleDeleteTenant(t.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROOMS & BEDS */}
      {activeTab === 'rooms' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Rooms & Beds</h3>
            <button onClick={() => { setEditingRoom(null); setShowRoomModal(true); }} className="btn-primary"><Plus size={16} /> Add Room</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Room Number</th><th>Floor</th><th>Room Type</th><th>Total Beds</th><th>Available Beds</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredRooms.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.roomNumber}</td><td>{r.floor}</td><td>{r.roomType}</td><td>{r.totalBeds}</td><td style={{ fontWeight: 800, color: r.availableBeds > 0 ? '#10b981' : '#ef4444' }}>{r.availableBeds}</td>
                    <td>
                       <span style={{ color: r.status === 'Available' ? '#10b981' : '#ef4444', fontWeight: 700, background: r.status === 'Available' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: '6px' }}>{r.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" title="Edit" onClick={() => { setEditingRoom(r); setShowRoomModal(true); }}><Edit2 size={15} /></button>
                        <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDeleteRoom(r.id)}><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STAFF DIRECTORY */}
      {activeTab === 'staff' && (
        <div className="dashboard-section-card">
          <div className="section-header">
             <h3>Staff Directory</h3>
             <button onClick={() => { setEditingStaff(null); setShowStaffModal(true); }} className="btn-primary"><Plus size={16} /> Add Staff</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Staff Name</th><th>Role</th><th>Phone</th><th>Shift</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredStaff.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td><td>{s.role}</td><td>{s.phone}</td><td>{s.shift}</td>
                    <td><span style={{ color: '#10b981', fontWeight: 700 }}>{s.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" title="Edit" onClick={() => { setEditingStaff(s); setShowStaffModal(true); }}><Edit2 size={15} /></button>
                        <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDeleteStaff(s.id)}><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FINANCE & REVENUE */}
      {activeTab === 'finance' && (
        <div className="dashboard-section-card">
          <div className="section-header">
             <h3>Finance & Revenue</h3>
             <button onClick={() => { setEditingFinance(null); setShowFinanceModal(true); }} className="btn-primary"><Plus size={16} /> Add Record</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Tenant</th><th>Amount</th><th>Payment Type</th><th>Payment Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredFinance.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600 }}>{f.tenant}</td><td style={{ fontWeight: 800 }}>{f.amount}</td><td>{f.paymentType}</td><td>{f.paymentDate}</td>
                    <td><span style={{ color: f.status === 'Paid' ? '#10b981' : '#d97706', fontWeight: 700 }}>{f.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" title="Edit" onClick={() => { setEditingFinance(f); setShowFinanceModal(true); }}><Edit2 size={15} /></button>
                        <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDeleteFinance(f.id)}><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="dashboard-section-card">
          <div className="section-header">
             <h3>Complaints</h3>
             <button onClick={() => { setEditingComplaint(null); setShowComplaintModal(true); }} className="btn-primary"><Plus size={16} /> Add Complaint</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Tenant</th><th>Room</th><th>Category</th><th>Description</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredComplaints.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.tenant}</td><td>{c.room}</td><td>{c.category}</td><td>{c.description}</td>
                    <td><span style={{ color: c.status === 'Resolved' ? '#10b981' : '#ef4444', fontWeight: 700 }}>{c.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                         {c.status === 'Pending' && <button className="action-btn" title="Mark Resolved" style={{ color: '#10b981' }} onClick={() => handleResolveComplaint(c.id)}><CheckCircle2 size={15} /></button>}
                         <button className="action-btn" title="Edit" onClick={() => { setEditingComplaint(c); setShowComplaintModal(true); }}><Edit2 size={15} /></button>
                         <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDeleteComplaint(c.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TENANT REQUESTS */}
      {activeTab === 'requests' && (
        <div className="dashboard-section-card">
          <div className="section-header">
             <h3>Tenant Requests</h3>
             <button onClick={() => { setEditingRequest(null); setShowRequestModal(true); }} className="btn-primary"><Plus size={16} /> Add Request</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Tenant</th><th>Request Type</th><th>Description</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredRequests.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.tenant}</td><td>{r.requestType}</td><td>{r.description}</td>
                    <td><span style={{ color: '#10b981', fontWeight: 700 }}>{r.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" title="Edit" onClick={() => { setEditingRequest(r); setShowRequestModal(true); }}><Edit2 size={15} /></button>
                        <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDeleteRequest(r.id)}><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISITOR LOGS */}
      {activeTab === 'visitors' && (
        <div className="dashboard-section-card">
          <div className="section-header">
             <h3>Visitor Logs</h3>
             <button onClick={() => { setEditingVisitor(null); setShowVisitorModal(true); }} className="btn-primary"><Plus size={16} /> Add Visitor Log</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Visitor Name</th><th>Tenant</th><th>Room</th><th>Entry Time</th><th>Exit Time</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredVisitors.map(v => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>{v.visitorName}</td><td>{v.tenant}</td><td>{v.room}</td><td>{v.entryTime}</td><td>{v.exitTime}</td>
                    <td><span style={{ color: '#64748b', fontWeight: 700 }}>{v.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" title="Edit" onClick={() => { setEditingVisitor(v); setShowVisitorModal(true); }}><Edit2 size={15} /></button>
                        <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDeleteVisitor(v.id)}><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KITCHEN & INVENTORY LOG */}
      {activeTab === 'kitchen' && (
        <div className="dashboard-section-card">
          <div className="section-header"><h3>Kitchen & Inventory Log</h3></div>
          
          <div style={{ marginBottom: '2rem' }}>
             <h4 style={{ marginBottom: '0.8rem' }}>Daily Menu Log</h4>
             <div className="table-responsive"><table>
               <thead><tr><th>Date</th><th>Meal</th><th>Menu Items</th><th>Prepared Count</th></tr></thead>
               <tbody>{menuCosting.map(m => (
                   <tr key={m.id}>
                     <td>{m.date}</td><td><span style={{ background: 'var(--dash-subcard-bg)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>{m.meal}</span></td>
                     <td style={{ fontWeight: 600 }}>{m.menu}</td><td>{m.mealCount}</td>
                   </tr>
                 ))}
               </tbody>
             </table></div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
             <h4 style={{ marginBottom: '0.8rem' }}>Kitchen Inventory Log</h4>
             <div className="table-responsive"><table>
               <thead><tr><th>Item Name</th><th>Quantity</th><th>Status</th></tr></thead>
               <tbody>{inventory.map(inv => (
                   <tr key={inv.id}>
                     <td style={{ fontWeight: 600 }}>{inv.item}</td><td>{inv.quantity} {inv.unit}</td>
                     <td><span style={{ color: inv.stockStatus === 'Adequate' ? '#10b981' : '#ef4444', fontWeight: 700 }}>{inv.stockStatus}</span></td>
                   </tr>
                 ))}
               </tbody>
             </table></div>
          </div>
        </div>
      )}

      {/* REPORTS & ANALYTICS */}
      {activeTab === 'reports' && (
        <div className="dashboard-section-card">
          <div className="section-header">
             <h3>Reports & Analytics</h3>
             <button className="btn-primary" onClick={handleExportReport}><Download size={16} /> Export Report</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="report-card" style={{ background: 'var(--dash-subcard-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--dash-border)' }}>
              <h4 style={{ marginBottom: '1.5rem', color: 'var(--dash-muted)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 800 }}>Revenue Over Time</h4>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Jan', rev: 4000 }, { name: 'Feb', rev: 3000 }, { name: 'Mar', rev: 5000 },
                    { name: 'Apr', rev: 4500 }, { name: 'May', rev: 6000 }, { name: 'Jun', rev: 5500 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <Tooltip cursor={{fill: 'var(--dash-card-bg)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)', color: 'var(--dash-text)'}} />
                    <Bar dataKey="rev" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="report-card" style={{ background: 'var(--dash-subcard-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--dash-border)' }}>
              <h4 style={{ marginBottom: '1.5rem', color: 'var(--dash-muted)', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 800 }}>Occupancy Rate</h4>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Week 1', occ: 80 }, { name: 'Week 2', occ: 85 }, { name: 'Week 3', occ: 90 }, { name: 'Week 4', occ: 95 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <Tooltip cursor={{fill: 'var(--dash-card-bg)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)', color: 'var(--dash-text)'}} />
                    <Bar dataKey="occ" fill={roleThemeColor} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--dash-text)', fontSize: '1.1rem', fontWeight: 700 }}>Summary Highlights</h4>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr><th>Metric</th><th>Current Value</th><th>Previous Month</th><th>Growth</th></tr>
                </thead>
                <tbody>
                  <tr><td style={{fontWeight:600}}>Total Revenue</td><td>₹19,300</td><td>₹18,000</td><td style={{color:'#10b981', fontWeight: 800}}>+7.2%</td></tr>
                  <tr><td style={{fontWeight:600}}>Occupancy Rate</td><td>95%</td><td>92%</td><td style={{color:'#10b981', fontWeight: 800}}>+3.0%</td></tr>
                  <tr><td style={{fontWeight:600}}>New Tenants</td><td>4</td><td>2</td><td style={{color:'#10b981', fontWeight: 800}}>+100%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* Tenant Modal */}
      {showTenantModal && (
        <div className="modal-backdrop" onClick={() => setShowTenantModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveTenant}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group"><label>Name</label><input type="text" name="name" defaultValue={editingTenant?.name} required /></div>
                <div className="form-group"><label>Phone</label><input type="text" name="phone" defaultValue={editingTenant?.phone} required /></div>
                <div className="form-group"><label>Room</label><input type="text" name="room" defaultValue={editingTenant?.room} required /></div>
                <div className="form-group"><label>Bed</label><input type="text" name="bed" defaultValue={editingTenant?.bed} required /></div>
                <div className="form-group"><label>Joining Date</label><input type="date" name="joiningDate" defaultValue={editingTenant?.joiningDate ? '2026-08-01' : ''} required /></div>
                <div className="form-group"><label>Rent</label><input type="text" name="rent" defaultValue={editingTenant?.rent} required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.25rem' }}>
                <div className="form-group">
                   <label>ID Proof (Aadhar/PAN)</label>
                   <input type="file" name="idProof" accept=".pdf,.jpg,.png" />
                </div>
                <div className="form-group">
                   <label>Rental Agreement</label>
                   <input type="file" name="agreement" accept=".pdf" />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                 <label>Status</label>
                 <select name="status" defaultValue={editingTenant?.status || 'Active'}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                 </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowTenantModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="modal-backdrop" onClick={() => setShowRoomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>{editingRoom ? 'Edit Room' : 'Add Room'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveRoom}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group"><label>Room Number</label><input type="text" name="roomNumber" defaultValue={editingRoom?.roomNumber} required /></div>
                <div className="form-group"><label>Floor</label><input type="text" name="floor" defaultValue={editingRoom?.floor} required /></div>
                <div className="form-group"><label>Room Type</label><input type="text" name="roomType" defaultValue={editingRoom?.roomType} required /></div>
                <div className="form-group"><label>Total Beds</label><input type="number" name="totalBeds" defaultValue={editingRoom?.totalBeds} required /></div>
              </div>
              <div className="form-group"><label>Available Beds</label><input type="number" name="availableBeds" defaultValue={editingRoom?.availableBeds} required /></div>
              <div className="form-group">
                 <label>Status</label>
                 <select name="status" defaultValue={editingRoom?.status || 'Available'}>
                    <option value="Available">Available</option>
                    <option value="Full">Full</option>
                 </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRoomModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="modal-backdrop" onClick={() => setShowStaffModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>{editingStaff ? 'Edit Staff' : 'Add Staff'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveStaff}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group"><label>Name</label><input type="text" name="name" defaultValue={editingStaff?.name} required /></div>
                <div className="form-group"><label>Role</label><input type="text" name="role" defaultValue={editingStaff?.role} required /></div>
                <div className="form-group"><label>Phone</label><input type="text" name="phone" defaultValue={editingStaff?.phone} required /></div>
                <div className="form-group"><label>Shift</label><input type="text" name="shift" defaultValue={editingStaff?.shift} required /></div>
              </div>
              <div className="form-group">
                 <label>Status</label>
                 <select name="status" defaultValue={editingStaff?.status || 'Active'}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                 </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowStaffModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Finance Modal */}
      {showFinanceModal && (
        <div className="modal-backdrop" onClick={() => setShowFinanceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>{editingFinance ? 'Edit Record' : 'Add Record'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveFinance}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingFinance?.tenant} required /></div>
                <div className="form-group"><label>Amount</label><input type="text" name="amount" defaultValue={editingFinance?.amount} required /></div>
                <div className="form-group"><label>Payment Type</label><input type="text" name="paymentType" defaultValue={editingFinance?.paymentType} required /></div>
                <div className="form-group"><label>Payment Date</label><input type="date" name="paymentDate" defaultValue={editingFinance?.paymentDate ? '2026-10-01' : ''} required /></div>
              </div>
              <div className="form-group">
                 <label>Status</label>
                 <select name="status" defaultValue={editingFinance?.status || 'Paid'}>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                 </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowFinanceModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="modal-backdrop" onClick={() => setShowComplaintModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>{editingComplaint ? 'Edit Complaint' : 'Add Complaint'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveComplaint}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingComplaint?.tenant} required /></div>
                <div className="form-group"><label>Room</label><input type="text" name="room" defaultValue={editingComplaint?.room} required /></div>
                <div className="form-group"><label>Category</label><input type="text" name="category" defaultValue={editingComplaint?.category} required /></div>
                <div className="form-group"><label>Status</label><select name="status" defaultValue={editingComplaint?.status || 'Pending'}><option>Pending</option><option>Resolved</option></select></div>
              </div>
              <div className="form-group"><label>Description</label><textarea name="description" defaultValue={editingComplaint?.description} rows="3" required></textarea></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowComplaintModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <div className="modal-backdrop" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>{editingRequest ? 'Edit Request' : 'Add Request'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveRequest}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingRequest?.tenant} required /></div>
                <div className="form-group"><label>Request Type</label><input type="text" name="requestType" defaultValue={editingRequest?.requestType} required /></div>
                <div className="form-group"><label>Status</label><select name="status" defaultValue={editingRequest?.status || 'Pending'}><option>Pending</option><option>Approved</option></select></div>
              </div>
              <div className="form-group"><label>Description</label><textarea name="description" defaultValue={editingRequest?.description} rows="3" required></textarea></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowRequestModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Visitor Modal */}
      {showVisitorModal && (
        <div className="modal-backdrop" onClick={() => setShowVisitorModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>{editingVisitor ? 'Edit Visitor Log' : 'Add Visitor Log'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveVisitor}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group"><label>Visitor Name</label><input type="text" name="visitorName" defaultValue={editingVisitor?.visitorName} required /></div>
                <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingVisitor?.tenant} required /></div>
                <div className="form-group"><label>Room</label><input type="text" name="room" defaultValue={editingVisitor?.room} required /></div>
                <div className="form-group"><label>Entry Time</label><input type="text" name="entryTime" defaultValue={editingVisitor?.entryTime} required /></div>
                <div className="form-group"><label>Exit Time</label><input type="text" name="exitTime" defaultValue={editingVisitor?.exitTime} required /></div>
                <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingVisitor?.status} required /></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowVisitorModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW TENANT MODAL */}
      {viewingTenant && (
        <div className="modal-backdrop" onClick={() => setViewingTenant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>Resident Tenant Profile</h3>
               <p>{viewingTenant.name} • Room {viewingTenant.room} (Bed {viewingTenant.bed})</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }}>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Full Name</span><div style={{ fontWeight: 700 }}>{viewingTenant.name}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Phone Number</span><div style={{ fontWeight: 700 }}>{viewingTenant.phone}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Allocated Room</span><div style={{ fontWeight: 800, color: roleThemeColor }}>Room {viewingTenant.room} - Bed {viewingTenant.bed}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Monthly Rent</span><div style={{ fontWeight: 800, color: '#10b981' }}>{viewingTenant.rent}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Joining Date</span><div style={{ fontWeight: 600 }}>{viewingTenant.joiningDate}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Account Status</span><div><span style={{ color: viewingTenant.status === 'Active' ? '#10b981' : '#ef4444', fontWeight: 700 }}>{viewingTenant.status}</span></div></div>
            </div>
            <div style={{ marginTop: '1.25rem', background: 'var(--dash-subcard-bg)', padding: '1rem', borderRadius: '10px' }}>
              <span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem', fontWeight: 700 }}>VERIFICATION STATUS</span>
              <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: viewingTenant.hasDocs ? '#10b981' : '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                <CheckCircle2 size={16} />
                <span>{viewingTenant.hasDocs ? 'KYC Verified (Government ID Proof & Rental Agreement On File)' : 'Pending Documentation Upload'}</span>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              {viewingTenant.hasDocs && (
                <button className="btn-secondary" onClick={() => { setViewingDocTenant(viewingTenant); setViewingTenant(null); }}>
                  <FileText size={16} /> View Documents
                </button>
              )}
              <button className="btn-primary" onClick={() => setViewingTenant(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DOCUMENTS MODAL */}
      {viewingDocTenant && (
        <div className="modal-backdrop" onClick={() => setViewingDocTenant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>Verified Resident Documents</h3>
               <p>Documents registered for {viewingDocTenant.name}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--dash-subcard-bg)', borderRadius: '12px', border: '1px solid var(--dash-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={22} style={{ color: '#2563eb' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>Government Photo ID (Aadhar Card)</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--dash-muted)' }}>Verified • PDF • 1.4 MB</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  onClick={() => alert(`Downloading Aadhar Card for ${viewingDocTenant.name}...`)}
                >
                  <Download size={14} /> Download
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--dash-subcard-bg)', borderRadius: '12px', border: '1px solid var(--dash-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={22} style={{ color: '#10b981' }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>Signed Rental Lease Agreement</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--dash-muted)' }}>Signed on {viewingDocTenant.joiningDate} • PDF • 2.8 MB</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  onClick={() => alert(`Downloading Rental Agreement for ${viewingDocTenant.name}...`)}
                >
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setViewingDocTenant(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
