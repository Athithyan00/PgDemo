// src/pages/dashboards/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import managerBg from '../../assets/employee_login_bg.jpg';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Building2, 
  Users, 
  BedDouble, 
  UserCheck,
  AlertCircle,
  FileText,
  Clock,
  ClipboardList,
  Coffee,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Download,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ManagerDashboard() {
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
  const roleThemeColor = '#8b5cf6'; // purple for manager

  // Data States
  const { tenantsData, setTenantsData } = dataContext;
  const { roomsBedsData, setRoomsBedsData } = dataContext;
  const { bedAllocData, setBedAllocData } = dataContext;
  const { checkInOutData, setCheckInOutData } = dataContext;
  const { complaintsData, setComplaintsData } = dataContext;
  const { requestsData, setRequestsData } = dataContext;
  const { visitorsData, setVisitorsData } = dataContext;
  const { attendanceData, setAttendanceData } = dataContext;
  const { kitchenRequests, setKitchenRequests } = dataContext;
  const { staffData, setStaffData } = dataContext;
  const { menuCosting, inventory, setInventory, searchQuery } = dataContext;
  
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

  const kitchenMenu = { breakfast: 'Idli, Chutney', lunch: 'Rice, Dal, Paneer', dinner: 'Roti, Mixed Veg' };
  const kitchenStatus = 'Operational';

  // Modal States
  const [showTenantModal, setShowTenantModal] = useState(false); const [editingTenant, setEditingTenant] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false); const [editingRoom, setEditingRoom] = useState(null);
  const [showAllocModal, setShowAllocModal] = useState(false); const [editingAlloc, setEditingAlloc] = useState(null);
  const [showCheckInOutModal, setShowCheckInOutModal] = useState(false); const [editingCheckInOut, setEditingCheckInOut] = useState(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false); const [editingComplaint, setEditingComplaint] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false); const [editingRequest, setEditingRequest] = useState(null);
  const [showVisitorModal, setShowVisitorModal] = useState(false); const [editingVisitor, setEditingVisitor] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false); const [editingAttendance, setEditingAttendance] = useState(null);
  const [showStaffModal, setShowStaffModal] = useState(false); const [editingStaff, setEditingStaff] = useState(null);
  const [showKitchenReqModal, setShowKitchenReqModal] = useState(false); const [editingKitchenReq, setEditingKitchenReq] = useState(null);

  // Document & Profile Viewers
  const [viewingDocsTenant, setViewingDocsTenant] = useState(null);
  const [viewingProfileTenant, setViewingProfileTenant] = useState(null);

  const chartData = [
    { name: 'Mon', checkedIn: 12, checkedOut: 2 }, { name: 'Tue', checkedIn: 15, checkedOut: 1 }, { name: 'Wed', checkedIn: 10, checkedOut: 3 },
    { name: 'Thu', checkedIn: 18, checkedOut: 5 }, { name: 'Fri', checkedIn: 20, checkedOut: 2 }, { name: 'Sat', checkedIn: 25, checkedOut: 8 },
    { name: 'Sun', checkedIn: 30, checkedOut: 10 },
  ];

  const sidebarItems = [
    { icon: <Building2 size={18} />, label: 'Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <Users size={18} />, label: 'Tenants', active: activeTab === 'tenants', onClick: () => setActiveTab('tenants') },
    { icon: <BedDouble size={18} />, label: 'Rooms & Beds', active: activeTab === 'rooms', onClick: () => setActiveTab('rooms') },
    { icon: <ClipboardList size={18} />, label: 'Bed Allocation', active: activeTab === 'allocation', onClick: () => setActiveTab('allocation') },
    { icon: <Clock size={18} />, label: 'Check-in / Check-out', active: activeTab === 'checkinout', onClick: () => setActiveTab('checkinout') },
    { icon: <UserCheck size={18} />, label: 'Staff Directory', active: activeTab === 'staff', onClick: () => setActiveTab('staff') },
    { icon: <UserCheck size={18} />, label: 'Staff Attendance', active: activeTab === 'attendance', onClick: () => setActiveTab('attendance') },
    { icon: <AlertCircle size={18} />, label: 'Complaints', active: activeTab === 'complaints', onClick: () => setActiveTab('complaints') },
    { icon: <FileText size={18} />, label: 'Tenant Requests', active: activeTab === 'requests', onClick: () => setActiveTab('requests') },
    { icon: <Users size={18} />, label: 'Visitors', active: activeTab === 'visitors', onClick: () => setActiveTab('visitors') },
    { icon: <Coffee size={18} />, label: 'Kitchen & Food', active: activeTab === 'kitchen', onClick: () => setActiveTab('kitchen') }
  ];

  // Action Handlers
  const handleSave = (e, data, setData, editingItem, setShowModal) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const item = { id: editingItem ? editingItem.id : Date.now() };
    for (let [key, value] of fd.entries()) { item[key] = value; }
    if (editingItem) setData(data.map(x => x.id === editingItem.id ? item : x));
    else setData([...data, item]);
    setShowModal(false);
  };
  const handleDelete = (id, data, setData, msg) => { if (window.confirm(msg)) setData(data.filter(x => x.id !== id)); };

  const handleResolveComplaint = (id) => setComplaintsData(complaintsData.map(c => c.id === id ? {...c, status: 'Resolved'} : c));
  const handleApproveRequest = (id) => setRequestsData(requestsData.map(r => r.id === id ? {...r, status: 'Approved'} : r));
  const handleFulfillKitchen = (id) => setKitchenRequests(kitchenRequests.map(k => k.id === id ? {...k, status: 'Fulfilled'} : k));

  const handleRestock = (itemId) => {
    if (!setInventory) return;
    setInventory(inventory.map(item => 
      item.id === itemId 
        ? { ...item, quantity: (parseInt(item.quantity) || 0) + 20, stockStatus: 'Adequate' }
        : item
    ));
  };

  const handleExportCSV = (filename, rows) => {
    if (!rows || !rows.length) {
      alert('No data available to export.');
      return;
    }
    const headers = Object.keys(rows[0]).filter(k => k !== 'id');
    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout
      title="Manager Dashboard"
      subtitle="Operational controls and daily management"
      roleThemeColor={roleThemeColor}
      sidebarItems={sidebarItems}
      activeTabKey={activeTab}
      bgImage={managerBg}
      onBack={() => setActiveTab('overview')}
    >
      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          <div className="metrics-grid">
            <div className="metric-card"><div className="metric-icon-box" style={{color: roleThemeColor}}><Users size={28}/></div><div className="metric-details"><h4>Total Tenants</h4><div className="metric-value">{tenantsData.length}</div></div></div>
            <div className="metric-card"><div className="metric-icon-box" style={{color: '#10b981'}}><BedDouble size={28}/></div><div className="metric-details"><h4>Occupied Beds</h4><div className="metric-value">{roomsBedsData.filter(r=>r.status==='Occupied').length}</div></div></div>
            <div className="metric-card"><div className="metric-icon-box" style={{color: '#ef4444'}}><AlertCircle size={28}/></div><div className="metric-details"><h4>Complaints</h4><div className="metric-value">{complaintsData.filter(c=>c.status==='Pending').length}</div></div></div>
            <div className="metric-card"><div className="metric-icon-box" style={{color: '#f59e0b'}}><Clock size={28}/></div><div className="metric-details"><h4>Requests</h4><div className="metric-value">{requestsData.filter(r=>r.status!=='Approved').length}</div></div></div>
          </div>

          <div className="dashboard-section-card" style={{ padding: '2rem' }}>
             <div className="section-header"><h3>Weekly Entry/Exit Logs</h3></div>
             <div style={{ width: '100%', height: 300, marginTop: '1.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <Tooltip cursor={{fill: 'var(--dash-subcard-bg)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)', color: 'var(--dash-text)'}} />
                    <Bar dataKey="checkedIn" fill={roleThemeColor} radius={[6, 6, 0, 0]} name="Checked In" />
                    <Bar dataKey="checkedOut" fill="#ef4444" radius={[6, 6, 0, 0]} name="Checked Out" />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </>
      )}

      {/* REUSABLE TAB TEMPLATE GENERATOR FOR ALL MANAGER SECTIONS */}
      {activeTab === 'tenants' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Tenants ({filterList(tenantsData).length})</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleExportCSV('tenants_directory', tenantsData)} className="btn-secondary">
                <Download size={15} /> Export Tenants
              </button>
              <button onClick={() => { setEditingTenant(null); setShowTenantModal(true); }} className="btn-primary">
                <Plus size={16} /> Add Tenant
              </button>
            </div>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Name</th><th>Phone</th><th>Room</th><th>Bed</th><th>Docs</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filterList(tenantsData).map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.name}</td><td>{t.phone}</td><td>{t.room}</td><td>{t.bed}</td>
                  <td>
                    {t.hasDocs ? (
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', gap: '0.35rem' }} 
                        onClick={() => setViewingDocsTenant(t)}
                        title="View Verified Documents"
                      >
                        <FileCheck size={14} style={{ color: '#10b981' }} /> View Docs
                      </button>
                    ) : (
                      <span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>None</span>
                    )}
                  </td>
                  <td><span style={{ color: t.status === 'Active' ? '#10b981' : '#ef4444', fontWeight: 700 }}>{t.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="action-btn" title="View Profile" onClick={() => setViewingProfileTenant(t)}><Eye size={15} /></button>
                    <button className="action-btn" title="Edit" onClick={() => { setEditingTenant(t); setShowTenantModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(t.id, tenantsData, setTenantsData, 'Delete tenant?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Rooms & Beds ({filterList(roomsBedsData).length})</h3>
            <button onClick={() => { setEditingRoom(null); setShowRoomModal(true); }} className="btn-primary">
              <Plus size={16} /> Add Room
            </button>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Room Number</th><th>Bed Number</th><th>Tenant</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filterList(roomsBedsData).map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.roomNumber}</td><td>{r.bedNumber}</td><td>{r.tenant}</td>
                  <td><span style={{ color: '#0ea5e9', fontWeight: 700 }}>{r.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="action-btn" title="Edit" onClick={() => { setEditingRoom(r); setShowRoomModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(r.id, roomsBedsData, setRoomsBedsData, 'Delete room?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Staff Directory ({filterList(staffData).length})</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleExportCSV('staff_directory', staffData)} className="btn-secondary">
                <Download size={15} /> Export Staff
              </button>
              <button onClick={() => { setEditingStaff(null); setShowStaffModal(true); }} className="btn-primary">
                <Plus size={16} /> Add Staff
              </button>
            </div>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Staff Name</th><th>Role</th><th>Phone</th><th>Shift</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filterList(staffData).map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td><td>{s.role}</td><td>{s.phone}</td><td>{s.shift}</td>
                  <td><span style={{ color: '#10b981', fontWeight: 700 }}>{s.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="action-btn" title="Edit" onClick={() => { setEditingStaff(s); setShowStaffModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(s.id, staffData, setStaffData, 'Delete staff?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {activeTab === 'allocation' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Bed Allocation ({filterList(bedAllocData).length})</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleExportCSV('bed_allocations', bedAllocData)} className="btn-secondary">
                <Download size={15} /> Export
              </button>
              <button onClick={() => { setEditingAlloc(null); setShowAllocModal(true); }} className="btn-primary">
                <Plus size={16} /> Add Allocation
              </button>
            </div>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Tenant</th><th>Room</th><th>Bed</th><th>Joining Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filterList(bedAllocData).map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.tenant}</td><td>{b.room}</td><td>{b.bed}</td><td>{b.joiningDate}</td>
                  <td><span style={{ color: '#10b981', fontWeight: 700 }}>{b.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="action-btn" title="Edit" onClick={() => { setEditingAlloc(b); setShowAllocModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(b.id, bedAllocData, setBedAllocData, 'Delete allocation?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {activeTab === 'checkinout' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Check-in / Check-out ({filterList(checkInOutData).length})</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleExportCSV('checkin_checkout_logs', checkInOutData)} className="btn-secondary">
                <Download size={15} /> Export Logs
              </button>
              <button onClick={() => { setEditingCheckInOut(null); setShowCheckInOutModal(true); }} className="btn-primary">
                <Plus size={16} /> Add Log
              </button>
            </div>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Tenant</th><th>Room</th><th>Bed</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filterList(checkInOutData).map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.tenant}</td><td>{c.room}</td><td>{c.bed}</td><td>{c.date}</td>
                  <td><span style={{ color: '#10b981', fontWeight: 700 }}>{c.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="action-btn" title="Edit" onClick={() => { setEditingCheckInOut(c); setShowCheckInOutModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(c.id, checkInOutData, setCheckInOutData, 'Delete log?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Complaints ({filterList(complaintsData).length})</h3>
            <button onClick={() => { setEditingComplaint(null); setShowComplaintModal(true); }} className="btn-primary">
              <Plus size={16} /> Add Complaint
            </button>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Tenant</th><th>Category</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filterList(complaintsData).map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.tenant}</td><td>{c.category}</td><td>{c.description}</td>
                  <td><span style={{ color: c.status === 'Resolved' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{c.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    {c.status === 'Pending' && <button className="action-btn" title="Mark Resolved" onClick={() => handleResolveComplaint(c.id)} style={{ color: '#10b981' }}><CheckCircle2 size={15} /></button>}
                    <button className="action-btn" title="Edit" onClick={() => { setEditingComplaint(c); setShowComplaintModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(c.id, complaintsData, setComplaintsData, 'Delete complaint?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Tenant Requests ({filterList(requestsData).length})</h3>
            <button onClick={() => { setEditingRequest(null); setShowRequestModal(true); }} className="btn-primary">
              <Plus size={16} /> Add Request
            </button>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Tenant</th><th>Request Type</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filterList(requestsData).map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.tenant}</td><td>{r.requestType}</td><td>{r.description}</td>
                  <td><span style={{ color: r.status === 'Approved' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{r.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    {r.status !== 'Approved' && <button className="action-btn" title="Approve" onClick={() => handleApproveRequest(r.id)} style={{ color: '#10b981' }}><CheckCircle2 size={15} /></button>}
                    <button className="action-btn" title="Edit" onClick={() => { setEditingRequest(r); setShowRequestModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(r.id, requestsData, setRequestsData, 'Delete request?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {activeTab === 'visitors' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Visitors ({filterList(visitorsData).length})</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleExportCSV('visitors_log', visitorsData)} className="btn-secondary">
                <Download size={15} /> Export Logs
              </button>
              <button onClick={() => { setEditingVisitor(null); setShowVisitorModal(true); }} className="btn-primary">
                <Plus size={16} /> Add Visitor
              </button>
            </div>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Visitor Name</th><th>Tenant</th><th>Room</th><th>Entry Time</th><th>Exit Time</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filterList(visitorsData).map(v => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.visitorName}</td><td>{v.tenant}</td><td>{v.room}</td><td>{v.entryTime}</td><td>{v.exitTime}</td>
                  <td><span style={{ color: '#64748b', fontWeight: 700 }}>{v.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="action-btn" title="Edit" onClick={() => { setEditingVisitor(v); setShowVisitorModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(v.id, visitorsData, setVisitorsData, 'Delete visitor?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Staff Attendance ({filterList(attendanceData).length})</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => handleExportCSV('staff_attendance', attendanceData)} className="btn-secondary">
                <Download size={15} /> Export Attendance
              </button>
              <button onClick={() => { setEditingAttendance(null); setShowAttendanceModal(true); }} className="btn-primary">
                <Plus size={16} /> Add Record
              </button>
            </div>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Staff Name</th><th>Date</th><th>Check-in</th><th>Check-out</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filterList(attendanceData).map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.staffName}</td><td>{a.date}</td><td>{a.checkIn}</td><td>{a.checkOut}</td>
                  <td><span style={{ color: '#10b981', fontWeight: 700 }}>{a.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="action-btn" title="Edit" onClick={() => { setEditingAttendance(a); setShowAttendanceModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(a.id, attendanceData, setAttendanceData, 'Delete record?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {activeTab === 'kitchen' && (
        <div className="dashboard-section-card">
          <div className="section-header"><h3>Kitchen & Food Log</h3></div>
          
          <div style={{ marginBottom: '2rem' }}>
             <h4 style={{ marginBottom: '0.8rem' }}>Daily Menu Log ({filterList(menuCosting).length})</h4>
             <div className="table-responsive"><table>
               <thead><tr><th>Date</th><th>Meal</th><th>Menu Items</th><th>Prepared Count</th></tr></thead>
               <tbody>{filterList(menuCosting).map(m => (
                   <tr key={m.id}>
                     <td>{m.date}</td><td><span style={{ background: 'var(--dash-subcard-bg)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>{m.meal}</span></td>
                     <td style={{ fontWeight: 600 }}>{m.menu}</td><td>{m.mealCount}</td>
                   </tr>
                 ))}
               </tbody>
             </table></div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
               <h4>Kitchen Inventory Log ({filterList(inventory).length})</h4>
               <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>Auto-sync with Kitchen department</span>
             </div>
             <div className="table-responsive"><table>
               <thead><tr><th>Item Name</th><th>Quantity</th><th>Status</th><th>Action</th></tr></thead>
               <tbody>{filterList(inventory).map(inv => (
                   <tr key={inv.id}>
                     <td style={{ fontWeight: 600 }}>{inv.item}</td><td>{inv.quantity} {inv.unit}</td>
                     <td><span style={{ color: inv.stockStatus === 'Adequate' ? '#10b981' : '#ef4444', fontWeight: 700 }}>{inv.stockStatus}</span></td>
                     <td>
                       <button 
                         className="btn-secondary" 
                         style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} 
                         onClick={() => handleRestock(inv.id)}
                       >
                         Restock (+20)
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table></div>
          </div>

          <div className="section-header">
            <h4>Food Requests ({filterList(kitchenRequests).length})</h4>
            <button onClick={() => { setEditingKitchenReq(null); setShowKitchenReqModal(true); }} className="btn-primary">
              <Plus size={16} /> Add Request
            </button>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Tenant</th><th>Meal</th><th>Request</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{filterList(kitchenRequests).map(k => (
                <tr key={k.id}>
                  <td style={{ fontWeight: 600 }}>{k.tenant}</td><td>{k.meal}</td><td>{k.request}</td>
                  <td><span style={{ color: k.status === 'Fulfilled' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{k.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    {k.status === 'Pending' && <button className="action-btn" title="Mark Fulfilled" onClick={() => handleFulfillKitchen(k.id)} style={{ color: '#10b981' }}><CheckCircle2 size={15} /></button>}
                    <button className="action-btn" title="Edit" onClick={() => { setEditingKitchenReq(k); setShowKitchenReqModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(k.id, kitchenRequests, setKitchenRequests, 'Delete request?')}><Trash2 size={15} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {/* ALL MODALS (GENERATED DYNAMICALLY FOR REUSABILITY) */}
      
      {showTenantModal && (
        <div className="modal-backdrop" onClick={() => setShowTenantModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</h3></div>
            <form className="modal-form" onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const hasDocs = fd.get('idProof') || fd.get('agreement');
              const nt = { 
                id: editingTenant ? editingTenant.id : Date.now(), 
                name: fd.get('name'), phone: fd.get('phone'), room: fd.get('room'), bed: fd.get('bed'), status: fd.get('status'), hasDocs: hasDocs ? true : false 
              };
              if (editingTenant) setTenantsData(tenantsData.map(x => x.id === editingTenant.id ? nt : x));
              else setTenantsData([...tenantsData, nt]);
              setShowTenantModal(false);
            }}>
              <div className="form-group"><label>Name</label><input type="text" name="name" defaultValue={editingTenant?.name} required /></div>
              <div className="form-group"><label>Phone</label><input type="text" name="phone" defaultValue={editingTenant?.phone} required /></div>
              <div className="form-group"><label>Room</label><input type="text" name="room" defaultValue={editingTenant?.room} required /></div>
              <div className="form-group"><label>Bed</label><input type="text" name="bed" defaultValue={editingTenant?.bed} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '0.5rem' }}>
                <div className="form-group">
                   <label>ID Proof (Aadhar/PAN)</label>
                   <input type="file" name="idProof" accept=".pdf,.jpg,.png" />
                </div>
                <div className="form-group">
                   <label>Rental Agreement</label>
                   <input type="file" name="agreement" accept=".pdf" />
                </div>
              </div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingTenant?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowTenantModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showStaffModal && (
        <div className="modal-backdrop" onClick={() => setShowStaffModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingStaff ? 'Edit Staff' : 'Add Staff'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, staffData, setStaffData, editingStaff, setShowStaffModal)}>
              <div className="form-group"><label>Name</label><input type="text" name="name" defaultValue={editingStaff?.name} required /></div>
              <div className="form-group"><label>Role</label><input type="text" name="role" defaultValue={editingStaff?.role} required /></div>
              <div className="form-group"><label>Phone</label><input type="text" name="phone" defaultValue={editingStaff?.phone} required /></div>
              <div className="form-group"><label>Shift</label><input type="text" name="shift" defaultValue={editingStaff?.shift} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingStaff?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowStaffModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showRoomModal && (
        <div className="modal-backdrop" onClick={() => setShowRoomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingRoom ? 'Edit Room' : 'Add Room'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, roomsBedsData, setRoomsBedsData, editingRoom, setShowRoomModal)}>
              <div className="form-group"><label>Room Number</label><input type="text" name="roomNumber" defaultValue={editingRoom?.roomNumber} required /></div>
              <div className="form-group"><label>Bed Number</label><input type="text" name="bedNumber" defaultValue={editingRoom?.bedNumber} required /></div>
              <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingRoom?.tenant} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingRoom?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowRoomModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showAllocModal && (
        <div className="modal-backdrop" onClick={() => setShowAllocModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingAlloc ? 'Edit Allocation' : 'Add Allocation'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, bedAllocData, setBedAllocData, editingAlloc, setShowAllocModal)}>
              <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingAlloc?.tenant} required /></div>
              <div className="form-group"><label>Room</label><input type="text" name="room" defaultValue={editingAlloc?.room} required /></div>
              <div className="form-group"><label>Bed</label><input type="text" name="bed" defaultValue={editingAlloc?.bed} required /></div>
              <div className="form-group"><label>Joining Date</label><input type="text" name="joiningDate" defaultValue={editingAlloc?.joiningDate} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingAlloc?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowAllocModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showCheckInOutModal && (
        <div className="modal-backdrop" onClick={() => setShowCheckInOutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingCheckInOut ? 'Edit Record' : 'Add Record'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, checkInOutData, setCheckInOutData, editingCheckInOut, setShowCheckInOutModal)}>
              <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingCheckInOut?.tenant} required /></div>
              <div className="form-group"><label>Room</label><input type="text" name="room" defaultValue={editingCheckInOut?.room} required /></div>
              <div className="form-group"><label>Bed</label><input type="text" name="bed" defaultValue={editingCheckInOut?.bed} required /></div>
              <div className="form-group"><label>Date</label><input type="text" name="date" defaultValue={editingCheckInOut?.date} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingCheckInOut?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowCheckInOutModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showComplaintModal && (
        <div className="modal-backdrop" onClick={() => setShowComplaintModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingComplaint ? 'Edit Complaint' : 'Add Complaint'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, complaintsData, setComplaintsData, editingComplaint, setShowComplaintModal)}>
              <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingComplaint?.tenant} required /></div>
              <div className="form-group"><label>Category</label><input type="text" name="category" defaultValue={editingComplaint?.category} required /></div>
              <div className="form-group"><label>Description</label><input type="text" name="description" defaultValue={editingComplaint?.description} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingComplaint?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowComplaintModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showRequestModal && (
        <div className="modal-backdrop" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingRequest ? 'Edit Request' : 'Add Request'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, requestsData, setRequestsData, editingRequest, setShowRequestModal)}>
              <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingRequest?.tenant} required /></div>
              <div className="form-group"><label>Request Type</label><input type="text" name="requestType" defaultValue={editingRequest?.requestType} required /></div>
              <div className="form-group"><label>Description</label><input type="text" name="description" defaultValue={editingRequest?.description} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingRequest?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowRequestModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showVisitorModal && (
        <div className="modal-backdrop" onClick={() => setShowVisitorModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingVisitor ? 'Edit Visitor' : 'Add Visitor'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, visitorsData, setVisitorsData, editingVisitor, setShowVisitorModal)}>
              <div className="form-group"><label>Visitor Name</label><input type="text" name="visitorName" defaultValue={editingVisitor?.visitorName} required /></div>
              <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingVisitor?.tenant} required /></div>
              <div className="form-group"><label>Entry Time</label><input type="text" name="entryTime" defaultValue={editingVisitor?.entryTime} required /></div>
              <div className="form-group"><label>Exit Time</label><input type="text" name="exitTime" defaultValue={editingVisitor?.exitTime} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingVisitor?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowVisitorModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showAttendanceModal && (
        <div className="modal-backdrop" onClick={() => setShowAttendanceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingAttendance ? 'Edit Record' : 'Add Record'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, attendanceData, setAttendanceData, editingAttendance, setShowAttendanceModal)}>
              <div className="form-group"><label>Staff Name</label><input type="text" name="staffName" defaultValue={editingAttendance?.staffName} required /></div>
              <div className="form-group"><label>Date</label><input type="text" name="date" defaultValue={editingAttendance?.date} required /></div>
              <div className="form-group"><label>Check-In</label><input type="text" name="checkIn" defaultValue={editingAttendance?.checkIn} required /></div>
              <div className="form-group"><label>Check-Out</label><input type="text" name="checkOut" defaultValue={editingAttendance?.checkOut} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingAttendance?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowAttendanceModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showKitchenReqModal && (
        <div className="modal-backdrop" onClick={() => setShowKitchenReqModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingKitchenReq ? 'Edit Request' : 'Add Request'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, kitchenRequests, setKitchenRequests, editingKitchenReq, setShowKitchenReqModal)}>
              <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingKitchenReq?.tenant} required /></div>
              <div className="form-group"><label>Meal</label><input type="text" name="meal" defaultValue={editingKitchenReq?.meal} required /></div>
              <div className="form-group"><label>Request</label><input type="text" name="request" defaultValue={editingKitchenReq?.request} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingKitchenReq?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowKitchenReqModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT VIEWER MODAL */}
      {viewingDocsTenant && (
        <div className="modal-backdrop" onClick={() => setViewingDocsTenant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div>
                <h3>Verified KYC Documents</h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--dash-muted)' }}>
                  Tenant: <strong>{viewingDocsTenant.name}</strong> • Room {viewingDocsTenant.room} ({viewingDocsTenant.bed})
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
              <div style={{
                background: 'var(--dash-subcard-bg)',
                border: '1px solid var(--dash-border)',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#ecfdf5', color: '#10b981', padding: '0.75rem', borderRadius: '8px' }}>
                    <FileCheck size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>Government ID Proof</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>Aadhar Card / PAN (Verified on Onboarding)</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary"
                  style={{ gap: '0.4rem', fontSize: '0.8rem' }}
                  onClick={() => alert(`Downloading verified ID proof for ${viewingDocsTenant.name}...`)}
                >
                  <Download size={14} /> Download
                </button>
              </div>

              <div style={{
                background: 'var(--dash-subcard-bg)',
                border: '1px solid var(--dash-border)',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.75rem', borderRadius: '8px' }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>PG Rental Agreement</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>Digitally E-Signed Lease Agreement (11 Months)</span>
                  </div>
                </div>
                <button 
                  className="btn-secondary"
                  style={{ gap: '0.4rem', fontSize: '0.8rem' }}
                  onClick={() => alert(`Downloading signed lease agreement for ${viewingDocsTenant.name}...`)}
                >
                  <Download size={14} /> Download PDF
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={() => setViewingDocsTenant(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TENANT PROFILE MODAL */}
      {viewingProfileTenant && (
        <div className="modal-backdrop" onClick={() => setViewingProfileTenant(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3>Tenant Profile Details</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'var(--dash-subcard-bg)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>Full Name</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.25rem' }}>{viewingProfileTenant.name}</div>
                </div>
                <div style={{ background: 'var(--dash-subcard-bg)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>Phone</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.25rem' }}>{viewingProfileTenant.phone}</div>
                </div>
                <div style={{ background: 'var(--dash-subcard-bg)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>Assigned Room</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.25rem' }}>Room {viewingProfileTenant.room}</div>
                </div>
                <div style={{ background: 'var(--dash-subcard-bg)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>Bed Number</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.25rem' }}>{viewingProfileTenant.bed}</div>
                </div>
                <div style={{ background: 'var(--dash-subcard-bg)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>KYC Status</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#10b981', marginTop: '0.25rem' }}>
                    {viewingProfileTenant.hasDocs ? 'Verified & Onboarded' : 'Pending Documents'}
                  </div>
                </div>
                <div style={{ background: 'var(--dash-subcard-bg)', padding: '1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>Stay Status</span>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: viewingProfileTenant.status === 'Active' ? '#10b981' : '#ef4444', marginTop: '0.25rem' }}>
                    {viewingProfileTenant.status}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={() => setViewingProfileTenant(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
