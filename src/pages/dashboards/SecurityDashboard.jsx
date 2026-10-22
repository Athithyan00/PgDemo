// src/pages/dashboards/SecurityDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import managerBg from '../../assets/employee_login_bg.jpg';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Shield, 
  Users, 
  LogOut, 
  LogIn,
  Calendar,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SecurityDashboard() {
  const dataContext = useData();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const searchQuery = dataContext?.searchQuery || '';

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
  const roleThemeColor = '#dc2626'; // Red/Strong for security

  const { visitorLogs, setVisitorLogs } = dataContext;
  const { gateEntryExit, setGateEntryExit } = dataContext;
  const { visitorRequests, setVisitorRequests } = dataContext;
  const { emergencyAlerts, setEmergencyAlerts } = dataContext;

  const [showLogModal, setShowLogModal] = useState(false); const [editingLog, setEditingLog] = useState(null);
  const [showGateModal, setShowGateModal] = useState(false); const [editingGate, setEditingGate] = useState(null);
  const [showReqModal, setShowReqModal] = useState(false); const [editingReq, setEditingReq] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false); const [editingAlert, setEditingAlert] = useState(null);

  // Filtered lists
  const filteredVisitorLogs = visitorLogs.filter(v => {
    const q = searchQuery.toLowerCase();
    return !q || v.visitorName?.toLowerCase().includes(q) || v.tenant?.toLowerCase().includes(q) || v.room?.toLowerCase().includes(q) || v.status?.toLowerCase().includes(q);
  });

  const filteredGate = gateEntryExit.filter(g => {
    const q = searchQuery.toLowerCase();
    return !q || g.visitorName?.toLowerCase().includes(q) || g.tenant?.toLowerCase().includes(q) || g.room?.toLowerCase().includes(q) || g.status?.toLowerCase().includes(q);
  });

  const filteredRequests = visitorRequests.filter(r => {
    const q = searchQuery.toLowerCase();
    return !q || r.visitorName?.toLowerCase().includes(q) || r.tenant?.toLowerCase().includes(q) || r.status?.toLowerCase().includes(q);
  });

  const filteredAlerts = emergencyAlerts.filter(a => {
    const q = searchQuery.toLowerCase();
    return !q || a.alertType?.toLowerCase().includes(q) || a.location?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q) || a.status?.toLowerCase().includes(q);
  });

  const chartData = [
    { name: 'Mon', visitors: 15 },
    { name: 'Tue', visitors: 12 },
    { name: 'Wed', visitors: 20 },
    { name: 'Thu', visitors: 18 },
    { name: 'Fri', visitors: 25 },
    { name: 'Sat', visitors: 40 },
    { name: 'Sun', visitors: 45 },
  ];

  const sidebarItems = [
    { icon: <Shield size={18} />, label: 'Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <Users size={18} />, label: 'Visitor Logs', active: activeTab === 'logs', onClick: () => setActiveTab('logs') },
    { icon: <LogOut size={18} />, label: 'Gate Entry / Exit', active: activeTab === 'gate', onClick: () => setActiveTab('gate') },
    { icon: <Calendar size={18} />, label: 'Visitor Requests', active: activeTab === 'requests', onClick: () => setActiveTab('requests') },
    { icon: <AlertTriangle size={18} />, label: 'Emergency Alerts', active: activeTab === 'alerts', onClick: () => setActiveTab('alerts') }
  ];

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

  const handleCheckOut = (id) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setGateEntryExit(gateEntryExit.map(g => g.id === id ? { ...g, exitTime: timeNow, status: 'Checked Out' } : g));
  };

  const handleCheckInRequest = (req) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry = {
      id: Date.now(),
      visitorName: req.visitorName,
      tenant: req.tenant,
      room: '204',
      entryTime: timeNow,
      exitTime: '--',
      status: 'Inside'
    };
    setGateEntryExit([...gateEntryExit, newEntry]);
    setVisitorRequests(visitorRequests.map(r => r.id === req.id ? { ...r, status: 'Checked In' } : r));
    alert(`Checked in ${req.visitorName} at gate! Record added to Gate Entry/Exit.`);
  };

  const handleExportVisitors = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Visitor Name,Tenant,Room,Entry Time,Exit Time,Status", ...visitorLogs.map(v => `"${v.visitorName}","${v.tenant}","${v.room}","${v.entryTime}","${v.exitTime}","${v.status}"`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ArcNio_Visitor_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout
      title="Security Dashboard"
      subtitle="Monitor premises, gate passes, visitor check-ins, and emergency alerts"
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
            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('logs')}><div className="metric-icon-box" style={{color: roleThemeColor}}><Users size={28}/></div><div className="metric-details"><h4>Visitors Today</h4><div className="metric-value">24</div><div className="metric-change positive">100% ID Verified</div></div></div>
            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('requests')}><div className="metric-icon-box" style={{color: '#f59e0b'}}><Calendar size={28}/></div><div className="metric-details"><h4>Expected Visitors</h4><div className="metric-value">{visitorRequests.filter(r=>r.status!=='Checked In').length}</div><div className="metric-change neutral">Pending Gate Arrival</div></div></div>
            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('gate')}><div className="metric-icon-box" style={{color: '#3b82f6'}}><LogOut size={28}/></div><div className="metric-details"><h4>Currently Inside</h4><div className="metric-value">{gateEntryExit.filter(g=>g.status==='Inside').length}</div><div className="metric-change positive">In-Premises Guests</div></div></div>
            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('alerts')}><div className="metric-icon-box" style={{color: '#dc2626'}}><AlertTriangle size={28}/></div><div className="metric-details"><h4>Emergency Alerts</h4><div className="metric-value" style={{ color: '#dc2626' }}>{emergencyAlerts.filter(e=>e.status==='Active').length} Active</div><div className="metric-change neutral">Tap to review alert log</div></div></div>
          </div>
          
          <div className="dashboard-section-card" style={{ padding: '2rem' }}>
             <div className="section-header">
                <h3>Weekly Visitor Trends</h3>
                <button className="btn-primary" onClick={handleExportVisitors}><Download size={16} /> Export Logs</button>
             </div>
             <div style={{ width: '100%', height: 300, marginTop: '1.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <Tooltip cursor={{fill: 'var(--dash-subcard-bg)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)', color: 'var(--dash-text)'}} />
                    <Bar dataKey="visitors" fill={roleThemeColor} radius={[6, 6, 0, 0]} name="Visitor Count" />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </>
      )}

      {/* VISITOR LOGS */}
      {activeTab === 'logs' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Visitor Logs</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-secondary" onClick={handleExportVisitors}><Download size={16} /> Export CSV</button>
              <button onClick={() => { setEditingLog(null); setShowLogModal(true); }} className="btn-primary"><Plus size={16} /> Add Log</button>
            </div>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Visitor Name</th><th>Tenant</th><th>Room</th><th>Phone</th><th>Entry Time</th><th>Exit Time</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredVisitorLogs.map(v => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.visitorName}</td><td>{v.tenant}</td><td>{v.room}</td><td>{v.phone}</td><td>{v.entryTime}</td><td>{v.exitTime}</td>
                  <td>
                    <span style={{ 
                      color: v.status === 'Checked Out' ? '#10b981' : '#2563eb', 
                      fontWeight: 600,
                      background: v.status === 'Checked Out' ? 'rgba(16,185,129,0.1)' : 'rgba(37,99,235,0.1)',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      {v.status}
                    </span>
                  </td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="action-btn" title="Edit" onClick={() => { setEditingLog(v); setShowLogModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(v.id, visitorLogs, setVisitorLogs, 'Delete log?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {/* GATE ENTRY / EXIT */}
      {activeTab === 'gate' && (
        <div className="dashboard-section-card">
          <div className="section-header"><h3>Gate Entry / Exit Log</h3><button onClick={() => { setEditingGate(null); setShowGateModal(true); }} className="btn-primary"><Plus size={16} /> Add Entry</button></div>
          <div className="table-responsive"><table>
            <thead><tr><th>Visitor Name</th><th>Visiting Resident</th><th>Room</th><th>Gate Entry</th><th>Gate Exit</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredGate.map(g => (
                <tr key={g.id}>
                  <td style={{ fontWeight: 600 }}>{g.visitorName}</td><td>{g.tenant}</td><td>{g.room}</td><td>{g.entryTime}</td><td>{g.exitTime}</td>
                  <td>
                    <span style={{ 
                      color: g.status === 'Inside' ? '#2563eb' : '#10b981', 
                      fontWeight: 700,
                      background: g.status === 'Inside' ? 'rgba(37,99,235,0.1)' : 'rgba(16,185,129,0.1)',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      {g.status}
                    </span>
                  </td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    {g.status === 'Inside' && (
                      <button className="btn-secondary" style={{ padding: '3px 8px', fontSize: '0.75rem', color: '#f59e0b' }} title="Mark Checked Out" onClick={() => handleCheckOut(g.id)}>
                        <LogOut size={13} style={{ marginRight: '4px' }} /> Check Out
                      </button>
                    )}
                    <button className="action-btn" title="Edit" onClick={() => { setEditingGate(g); setShowGateModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(g.id, gateEntryExit, setGateEntryExit, 'Delete entry?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {/* VISITOR REQUESTS */}
      {activeTab === 'requests' && (
        <div className="dashboard-section-card">
          <div className="section-header"><h3>Visitor Requests & Invitations</h3><button onClick={() => { setEditingReq(null); setShowReqModal(true); }} className="btn-primary"><Plus size={16} /> Add Request</button></div>
          <div className="table-responsive"><table>
            <thead><tr><th>Visitor Name</th><th>Resident</th><th>Expected Visit Date</th><th>Visit Time</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredRequests.map(v => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 600 }}>{v.visitorName}</td><td>{v.tenant}</td><td>{v.visitDate}</td><td>{v.visitTime}</td>
                  <td>
                    <span style={{ 
                      color: v.status === 'Approved' ? '#10b981' : v.status === 'Checked In' ? '#2563eb' : '#f59e0b', 
                      fontWeight: 600,
                      background: v.status === 'Approved' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      {v.status}
                    </span>
                  </td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    {v.status === 'Approved' && (
                      <button className="btn-secondary" style={{ padding: '3px 8px', fontSize: '0.75rem', color: '#2563eb' }} title="Check in to gate" onClick={() => handleCheckInRequest(v)}>
                        <LogIn size={13} style={{ marginRight: '4px' }} /> Check In Gate
                      </button>
                    )}
                    {v.status === 'Pending' && <button className="action-btn" title="Approve" style={{ color: '#10b981' }} onClick={() => setVisitorRequests(visitorRequests.map(r => r.id === v.id ? {...r, status: 'Approved'} : r))}><CheckCircle2 size={15} /></button>}
                    <button className="action-btn" title="Edit" onClick={() => { setEditingReq(v); setShowReqModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(v.id, visitorRequests, setVisitorRequests, 'Delete request?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {/* EMERGENCY ALERTS */}
      {activeTab === 'alerts' && (
        <div className="dashboard-section-card" style={{ border: '1px solid #fca5a5' }}>
          <div className="section-header" style={{ color: '#dc2626' }}>
             <h3><AlertTriangle size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />Emergency Alerts</h3>
             <button onClick={() => { setEditingAlert(null); setShowAlertModal(true); }} className="btn-primary" style={{ background: '#dc2626' }}><Plus size={16} /> Trigger Alert</button>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Alert Type</th><th>Location</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredAlerts.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600, color: '#dc2626' }}>{e.alertType}</td><td>{e.location}</td><td>{e.description}</td>
                  <td>
                    <span style={{ 
                      color: e.status === 'Resolved' ? '#10b981' : '#dc2626', 
                      fontWeight: 700,
                      background: e.status === 'Resolved' ? 'rgba(16,185,129,0.1)' : 'rgba(220,38,38,0.1)',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      {e.status}
                    </span>
                  </td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    {e.status !== 'Resolved' && <button className="btn-secondary" style={{ padding: '3px 8px', fontSize: '0.75rem', color: '#10b981' }} title="Resolve" onClick={() => setEmergencyAlerts(emergencyAlerts.map(a => a.id === e.id ? {...a, status: 'Resolved'} : a))}><Check size={13} style={{ marginRight: '4px' }} /> Resolve</button>}
                    <button className="action-btn" title="Edit" onClick={() => { setEditingAlert(e); setShowAlertModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(e.id, emergencyAlerts, setEmergencyAlerts, 'Delete alert?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {/* MODALS */}
      {showLogModal && (
        <div className="modal-backdrop" onClick={() => setShowLogModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingLog ? 'Edit Log' : 'Add Log'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, visitorLogs, setVisitorLogs, editingLog, setShowLogModal)}>
              <div className="form-group"><label>Visitor Name</label><input type="text" name="visitorName" defaultValue={editingLog?.visitorName} required /></div>
              <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingLog?.tenant} required /></div>
              <div className="form-group"><label>Room</label><input type="text" name="room" defaultValue={editingLog?.room} required /></div>
              <div className="form-group"><label>Phone</label><input type="text" name="phone" defaultValue={editingLog?.phone} required /></div>
              <div className="form-group"><label>Entry Time</label><input type="text" name="entryTime" defaultValue={editingLog?.entryTime} required /></div>
              <div className="form-group"><label>Exit Time</label><input type="text" name="exitTime" defaultValue={editingLog?.exitTime} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingLog?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowLogModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showGateModal && (
        <div className="modal-backdrop" onClick={() => setShowGateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingGate ? 'Edit Gate Entry' : 'Add Gate Entry'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, gateEntryExit, setGateEntryExit, editingGate, setShowGateModal)}>
              <div className="form-group"><label>Visitor Name</label><input type="text" name="visitorName" defaultValue={editingGate?.visitorName} required /></div>
              <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingGate?.tenant} required /></div>
              <div className="form-group"><label>Room</label><input type="text" name="room" defaultValue={editingGate?.room} required /></div>
              <div className="form-group"><label>Entry Time</label><input type="text" name="entryTime" defaultValue={editingGate?.entryTime} required /></div>
              <div className="form-group"><label>Exit Time</label><input type="text" name="exitTime" defaultValue={editingGate?.exitTime} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingGate?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowGateModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showReqModal && (
        <div className="modal-backdrop" onClick={() => setShowReqModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingReq ? 'Edit Request' : 'Add Request'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, visitorRequests, setVisitorRequests, editingReq, setShowReqModal)}>
              <div className="form-group"><label>Visitor Name</label><input type="text" name="visitorName" defaultValue={editingReq?.visitorName} required /></div>
              <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingReq?.tenant} required /></div>
              <div className="form-group"><label>Visit Date</label><input type="text" name="visitDate" defaultValue={editingReq?.visitDate} required /></div>
              <div className="form-group"><label>Visit Time</label><input type="text" name="visitTime" defaultValue={editingReq?.visitTime} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingReq?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowReqModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showAlertModal && (
        <div className="modal-backdrop" onClick={() => setShowAlertModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingAlert ? 'Edit Alert' : 'Add Alert'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, emergencyAlerts, setEmergencyAlerts, editingAlert, setShowAlertModal)}>
              <div className="form-group"><label>Alert Type</label><input type="text" name="alertType" defaultValue={editingAlert?.alertType} required /></div>
              <div className="form-group"><label>Location</label><input type="text" name="location" defaultValue={editingAlert?.location} required /></div>
              <div className="form-group"><label>Description</label><input type="text" name="description" defaultValue={editingAlert?.description} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingAlert?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowAlertModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
