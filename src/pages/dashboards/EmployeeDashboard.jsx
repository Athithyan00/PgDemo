// src/pages/dashboards/EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import managerBg from '../../assets/employee_login_bg.jpg';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Wrench, 
  CheckSquare, 
  ClipboardList,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Trash2,
  Download,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function EmployeeDashboard() {
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

  const { searchQuery, complaintsData, setComplaintsData, visitorLogs, setVisitorLogs } = dataContext;

  const [workOrders, setWorkOrders] = useState([
    { id: 'WO-891', room: 'Room 304 (B-Block)', category: 'AC Maintenance', priority: 'High', resident: 'Rohan Sharma', time: '10:30 AM Today', status: 'In Progress' },
    { id: 'WO-892', room: 'Room 102 (A-Block)', category: 'Plumbing / Tap Leak', priority: 'Medium', resident: 'Ananya Roy', time: '11:15 AM Today', status: 'Pending' },
    { id: 'WO-893', room: 'Dining Hall 2', category: 'Deep Cleaning & Sanitization', priority: 'Routine', resident: 'Staff Schedule', time: '02:00 PM Today', status: 'Pending' },
    { id: 'WO-894', room: 'Room 204 (B-Block)', category: 'Wi-Fi Router Reset', priority: 'High', resident: 'Amit Trivedi', time: '03:30 PM Today', status: 'Pending' },
    { id: 'WO-895', room: 'Recreation Area', category: 'Replace Fluorescent Tube', priority: 'Low', resident: 'Staff Schedule', time: '04:15 PM Today', status: 'Completed' }
  ]);

  const [inspections, setInspections] = useState([
    { id: 'INS-101', room: 'Room 204', date: '16 Oct 2026', inspector: 'Sandeep V.', cleanliness: 'Clean', electrical: 'Pass', plumbing: 'Pass', status: 'Approved' },
    { id: 'INS-102', room: 'Room 102', date: '15 Oct 2026', inspector: 'Sandeep V.', cleanliness: 'Needs Attention', electrical: 'Pass', plumbing: 'Minor Leak', status: 'Action Required' },
    { id: 'INS-103', room: 'Room 305', date: '14 Oct 2026', inspector: 'Vikram Singh', cleanliness: 'Spotless', electrical: 'Pass', plumbing: 'Pass', status: 'Approved' },
    { id: 'INS-104', room: 'Common Kitchen 1', date: '14 Oct 2026', inspector: 'Ramesh Patel', cleanliness: 'Clean', electrical: 'Pass', plumbing: 'Pass', status: 'Approved' }
  ]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);

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

  const handleToggleTaskStatus = (id) => {
    setWorkOrders(workOrders.map(wo => 
      wo.id === id 
        ? { ...wo, status: wo.status === 'Completed' ? 'Pending' : 'Completed' }
        : wo
    ));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newTask = {
      id: `WO-${Math.floor(100 + Math.random() * 900)}`,
      room: fd.get('room'),
      category: fd.get('category'),
      priority: fd.get('priority'),
      resident: fd.get('resident') || 'Staff Schedule',
      time: fd.get('time') || 'Today',
      status: 'Pending'
    };
    setWorkOrders([newTask, ...workOrders]);
    setShowTaskModal(false);
  };

  const handleAddInspection = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newIns = {
      id: `INS-${Math.floor(100 + Math.random() * 900)}`,
      room: fd.get('room'),
      date: new Date().toLocaleDateString('en-GB'),
      inspector: user?.name || 'Staff Member',
      cleanliness: fd.get('cleanliness'),
      electrical: fd.get('electrical'),
      plumbing: fd.get('plumbing'),
      status: fd.get('status')
    };
    setInspections([newIns, ...inspections]);
    setShowInspectionModal(false);
  };

  const handleResolveComplaint = (id) => {
    if (setComplaintsData) {
      setComplaintsData(complaintsData.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
    }
  };

  const pendingTasksCount = workOrders.filter(w => w.status !== 'Completed').length;

  const sidebarItems = [
    { icon: <ClipboardList size={18} />, label: 'Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <ClipboardList size={18} />, label: 'Daily Work Orders', active: activeTab === 'work-orders', onClick: () => setActiveTab('work-orders'), badge: `${pendingTasksCount} Pending` },
    { icon: <Wrench size={18} />, label: 'Maintenance Requests', active: activeTab === 'maintenance', onClick: () => setActiveTab('maintenance') },
    { icon: <UserCheck size={18} />, label: 'Visitor & Gate Pass', active: activeTab === 'visitors', onClick: () => setActiveTab('visitors') },
    { icon: <CheckSquare size={18} />, label: 'Room Inspection Logs', active: activeTab === 'inspection', onClick: () => setActiveTab('inspection') }
  ];

  return (
    <DashboardLayout
      title="Property Operations & Staff Portal"
      subtitle={`Assigned Property: ${user?.assignedProperty || 'ArcNio Grand Co-Living'} • ${user?.name || 'Staff'}`}
      roleThemeColor="#059669"
      sidebarItems={sidebarItems}
      activeTabKey={activeTab}
      bgImage={managerBg}
      onBack={() => setActiveTab('overview')}
    >
      {/* METRICS */}
      <div className="metrics-grid">
        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('work-orders')}>
          <div className="metric-icon-box" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <ClipboardList size={26} />
          </div>
          <div className="metric-details">
            <h4>Assigned Tasks</h4>
            <div className="metric-value">{workOrders.length} Tasks</div>
            <div className="metric-change positive">
              {workOrders.filter(w => w.status === 'Completed').length} Done • {pendingTasksCount} Pending
            </div>
          </div>
        </div>

        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('maintenance')}>
          <div className="metric-icon-box" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Wrench size={26} />
          </div>
          <div className="metric-details">
            <h4>Open Tickets</h4>
            <div className="metric-value">
              {complaintsData ? complaintsData.filter(c => c.status !== 'Resolved').length : 3} Active
            </div>
            <div className="metric-change neutral">Pending maintenance resolution</div>
          </div>
        </div>

        <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('visitors')}>
          <div className="metric-icon-box" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <UserCheck size={26} />
          </div>
          <div className="metric-details">
            <h4>Gate Check-Ins</h4>
            <div className="metric-value">{visitorLogs ? visitorLogs.length : 28} Logged</div>
            <div className="metric-change positive">100% Verified Entries</div>
          </div>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Assigned Maintenance & Housekeeping Queue</h3>
            <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
              <Plus size={16} /> New Work Order
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filterList(workOrders).map((item) => (
              <div key={item.id} style={{
                background: 'var(--dash-subcard-bg)',
                border: '1px solid var(--dash-border)',
                borderRadius: '12px',
                padding: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                opacity: item.status === 'Completed' ? 0.75 : 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    backgroundColor: item.status === 'Completed' ? '#ecfdf5' : item.priority === 'High' ? '#fef2f2' : '#f0fdf4',
                    color: item.status === 'Completed' ? '#059669' : item.priority === 'High' ? '#ef4444' : '#16a34a',
                    padding: '0.6rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.status === 'Completed' ? <CheckCircle2 size={22} /> : <Wrench size={22} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, textDecoration: item.status === 'Completed' ? 'line-through' : 'none' }}>
                      [{item.id}] {item.category} - <span style={{ color: '#059669' }}>{item.room}</span>
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>
                      Resident: {item.resident} • Scheduled: {item.time}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    backgroundColor: item.priority === 'High' ? '#fee2e2' : item.priority === 'Medium' ? '#fef3c7' : '#e0f2fe',
                    color: item.priority === 'High' ? '#991b1b' : item.priority === 'Medium' ? '#92400e' : '#0369a1',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {item.priority} Priority
                  </span>
                  <button 
                    onClick={() => handleToggleTaskStatus(item.id)}
                    style={{
                      backgroundColor: item.status === 'Completed' ? 'var(--dash-subcard-bg)' : '#059669',
                      color: item.status === 'Completed' ? 'var(--dash-text)' : '#ffffff',
                      border: item.status === 'Completed' ? '1px solid var(--dash-border)' : 'none',
                      padding: '0.5rem 0.9rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {item.status === 'Completed' ? <><Check size={14} /> Completed</> : 'Mark Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAILY WORK ORDERS TAB */}
      {activeTab === 'work-orders' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Daily Work Orders ({filterList(workOrders).length})</h3>
            <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
              <Plus size={16} /> Create Work Order
            </button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Resident</th>
                  <th>Scheduled Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filterList(workOrders).map((wo) => (
                  <tr key={wo.id}>
                    <td style={{ fontWeight: 700 }}>{wo.id}</td>
                    <td style={{ color: '#059669', fontWeight: 600 }}>{wo.room}</td>
                    <td>{wo.category}</td>
                    <td>
                      <span style={{
                        color: wo.priority === 'High' ? '#ef4444' : wo.priority === 'Medium' ? '#d97706' : '#0284c7',
                        fontWeight: 700
                      }}>
                        {wo.priority}
                      </span>
                    </td>
                    <td>{wo.resident}</td>
                    <td>{wo.time}</td>
                    <td>
                      <span style={{
                        color: wo.status === 'Completed' ? '#10b981' : '#f59e0b',
                        fontWeight: 700,
                        background: wo.status === 'Completed' ? '#ecfdf5' : '#fef3c7',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem'
                      }}>
                        {wo.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => handleToggleTaskStatus(wo.id)}
                      >
                        {wo.status === 'Completed' ? 'Reopen' : 'Mark Done'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MAINTENANCE REQUESTS TAB */}
      {activeTab === 'maintenance' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Tenant Maintenance Tickets ({filterList(complaintsData || []).length})</h3>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Tenant</th>
                  <th>Category</th>
                  <th>Issue Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterList(complaintsData || []).map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700 }}>#TKT-{c.id}</td>
                    <td style={{ fontWeight: 600 }}>{c.tenant}</td>
                    <td>{c.category}</td>
                    <td>{c.description}</td>
                    <td>
                      <span style={{
                        color: c.status === 'Resolved' ? '#10b981' : '#ef4444',
                        fontWeight: 700,
                        background: c.status === 'Resolved' ? '#ecfdf5' : '#fee2e2',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem'
                      }}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      {c.status !== 'Resolved' ? (
                        <button 
                          className="btn-primary" 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                          onClick={() => handleResolveComplaint(c.id)}
                        >
                          Resolve Ticket
                        </button>
                      ) : (
                        <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISITOR & GATE PASS TAB */}
      {activeTab === 'visitors' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Gate Check-In & Verified Logs ({filterList(visitorLogs || []).length})</h3>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Visitor Name</th>
                  <th>Tenant Visiting</th>
                  <th>Room</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Verification</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filterList(visitorLogs || []).map((v) => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 700 }}>{v.visitorName}</td>
                    <td>{v.tenant}</td>
                    <td>{v.room}</td>
                    <td>{v.entryTime}</td>
                    <td>{v.exitTime || 'Inside Campus'}</td>
                    <td>
                      <span style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ShieldCheck size={14} /> Phone OTP Verified
                      </span>
                    </td>
                    <td>
                      <span style={{
                        color: v.status === 'Checked In' ? '#10b981' : '#64748b',
                        fontWeight: 700,
                        background: v.status === 'Checked In' ? '#ecfdf5' : 'var(--dash-subcard-bg)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem'
                      }}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ROOM INSPECTION LOGS TAB */}
      {activeTab === 'inspection' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Room Inspection & Hygiene Logs ({filterList(inspections).length})</h3>
            <button className="btn-primary" onClick={() => setShowInspectionModal(true)}>
              <Plus size={16} /> Log New Inspection
            </button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Room</th>
                  <th>Date</th>
                  <th>Inspector</th>
                  <th>Cleanliness</th>
                  <th>Electrical</th>
                  <th>Plumbing</th>
                  <th>Audit Status</th>
                </tr>
              </thead>
              <tbody>
                {filterList(inspections).map((ins) => (
                  <tr key={ins.id}>
                    <td style={{ fontWeight: 700 }}>{ins.id}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>{ins.room}</td>
                    <td>{ins.date}</td>
                    <td>{ins.inspector}</td>
                    <td>{ins.cleanliness}</td>
                    <td>{ins.electrical}</td>
                    <td>{ins.plumbing}</td>
                    <td>
                      <span style={{
                        color: ins.status === 'Approved' ? '#10b981' : '#ef4444',
                        fontWeight: 700,
                        background: ins.status === 'Approved' ? '#ecfdf5' : '#fee2e2',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem'
                      }}>
                        {ins.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW WORK ORDER MODAL */}
      {showTaskModal && (
        <div className="modal-backdrop" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Work Order</h3>
            </div>
            <form className="modal-form" onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Target Location / Room</label>
                <input type="text" name="room" placeholder="e.g. Room 204 or Dining Hall 1" required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" required>
                  <option>AC Maintenance & Filter Cleaning</option>
                  <option>Plumbing / Leak Repair</option>
                  <option>Electrical / Appliance Fix</option>
                  <option>Housekeeping / Deep Clean</option>
                  <option>Carpentry / Door Lock Repair</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Routine</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Scheduled Slot</label>
                  <input type="text" name="time" defaultValue="02:30 PM Today" required />
                </div>
              </div>
              <div className="form-group">
                <label>Requested By / Resident</label>
                <input type="text" name="resident" placeholder="Resident Name or Staff Routine" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowTaskModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW INSPECTION MODAL */}
      {showInspectionModal && (
        <div className="modal-backdrop" onClick={() => setShowInspectionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Log Room Inspection</h3>
            </div>
            <form className="modal-form" onSubmit={handleAddInspection}>
              <div className="form-group">
                <label>Inspected Room / Area</label>
                <input type="text" name="room" placeholder="e.g. Room 302 (C-Block)" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label>Cleanliness</label>
                  <select name="cleanliness">
                    <option>Clean</option>
                    <option>Spotless</option>
                    <option>Needs Attention</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Electrical</label>
                  <select name="electrical">
                    <option>Pass</option>
                    <option>Issue Found</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Plumbing</label>
                  <select name="plumbing">
                    <option>Pass</option>
                    <option>Leak Detected</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Audit Conclusion</label>
                <select name="status">
                  <option>Approved</option>
                  <option>Action Required</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowInspectionModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Submit Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

