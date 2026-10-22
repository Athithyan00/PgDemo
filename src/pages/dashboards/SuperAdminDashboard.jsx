// src/pages/dashboards/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import internalDeskBg from '../../assets/super_admin_login_bg.jpg';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Mail, 
  FileText,
  Plus, 
  CheckCircle2, 
  CreditCard,
  Download,
  Search,
  Eye,
  Send,
  XCircle,
  Edit2,
  UploadCloud,
  Trash2,
  Server,
  ShieldCheck,
  Activity,
  Database,
  Cpu,
  Terminal,
  AlertTriangle,
  RefreshCw,
  Pause,
  Play
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

export default function SuperAdminDashboard() {
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
  
  // Modals state
  const [showPgModal, setShowPgModal] = useState(false);
  const [editingPg, setEditingPg] = useState(null);
  const [viewingPg, setViewingPg] = useState(null);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingInvite, setEditingInvite] = useState(null);

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [showMigrationsModal, setShowMigrationsModal] = useState(false);
  const [showSuperUserModal, setShowSuperUserModal] = useState(false);

  // Cluster & sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Revenue filter states
  const [revenueDateFilter, setRevenueDateFilter] = useState('');
  const [revenueStatusFilter, setRevenueStatusFilter] = useState('');

  // Data states from context
  const { pgList, setPgList } = dataContext;
  const { invitations, setInvitations } = dataContext;
  const { revenues, setRevenues } = dataContext;
  const { reminders, setReminders } = dataContext;
  const { plans, setPlans } = dataContext;

  // Schemas state
  const [schemasList, setSchemasList] = useState([
    { id: 'ORG-001', name: 'Elite PGs & Co.', schema: 'tenant_elite_pgs', storage: '4.2 GB', rows: '1.2M', version: 'v18.4' },
    { id: 'ORG-002', name: 'Sunrise Stays', schema: 'tenant_sunrise', storage: '1.8 GB', rows: '450K', version: 'v18.4' },
    { id: 'ORG-003', name: 'Metro Co-living', schema: 'tenant_metro', storage: '8.5 GB', rows: '3.1M', version: 'v18.3' },
    { id: 'ORG-004', name: 'Student Nest', schema: 'tenant_student_nest', storage: '0.4 GB', rows: '120K', version: 'v18.4' }
  ]);

  // Super Users state
  const [superUsersList, setSuperUsersList] = useState([
    { id: 1, name: 'Alice Jenkins', email: 'alice.j@arcnio.com', role: 'Super Administrator', lastLogin: '10 mins ago', mfa: 'Enabled', active: true },
    { id: 2, name: 'Bob Smith', email: 'bob.s@arcnio.com', role: 'Support Engineer', lastLogin: '2 hours ago', mfa: 'Enabled', active: true },
    { id: 3, name: 'Charlie Davis', email: 'charlie.d@arcnio.com', role: 'Database Admin', lastLogin: '1 day ago', mfa: 'Enabled', active: true },
    { id: 4, name: 'Diana Prince', email: 'diana.p@arcnio.com', role: 'Security Analyst', lastLogin: '5 mins ago', mfa: 'Pending', active: true }
  ]);

  // Cluster nodes state
  const [clusterNodes, setClusterNodes] = useState([
    { id: 'ap-south-1a-prod-01', region: 'Mumbai (AWS)', role: 'Primary DB', cpu: '18%', mem: '42%', status: 'Healthy', uptime: '45d 12h' },
    { id: 'ap-south-1b-prod-02', region: 'Mumbai (AWS)', role: 'Replica DB', cpu: '12%', mem: '38%', status: 'Healthy', uptime: '45d 12h' },
    { id: 'ap-southeast-1a-prod-01', region: 'Singapore (AWS)', role: 'API Gateway', cpu: '34%', mem: '55%', status: 'Healthy', uptime: '12d 5h' },
    { id: 'eu-central-1a-prod-01', region: 'Frankfurt (AWS)', role: 'Redis Cache', cpu: '8%', mem: '22%', status: 'Healthy', uptime: '90d 2h' },
    { id: 'us-east-1a-prod-01', region: 'N. Virginia (AWS)', role: 'Background Jobs', cpu: '88%', mem: '78%', status: 'Warning', uptime: '5d 8h' }
  ]);

  // Audit stream state
  const [isStreamPaused, setIsStreamPaused] = useState(false);
  const [auditLogs, setAuditLogs] = useState([
    { time: '10:45:12', type: 'INFO', msg: 'User auth successful. Tenant: ORG-001, User: rahul.sharma', color: '#10b981' },
    { time: '10:45:14', type: 'DB_MIGRATION', msg: "Schema 'tenant_student_nest' updated to v18.4", color: '#0ea5e9' },
    { time: '10:45:22', type: 'WARN', msg: 'High CPU threshold exceeded on node us-east-1a-prod-01 (88%)', color: '#f59e0b' },
    { time: '10:45:30', type: 'INFO', msg: "Background job 'DailyReportSync' completed successfully.", color: '#10b981' },
    { time: '10:45:45', type: 'ERROR', msg: 'Failed to dispatch webhook for Event ID: EVT-992381 (Timeout)', color: '#ef4444' },
    { time: '10:46:01', type: 'INFO', msg: 'JWT Token issued for user ID: 88291', color: '#10b981' },
    { time: '10:46:12', type: 'INFO', msg: 'User auth successful. Tenant: ORG-002, User: admin.sunrise', color: '#10b981' },
    { time: '10:46:20', type: 'AUDIT', msg: "SuperAdmin 'Alice Jenkins' accessed 'Tenant Schemas' view.", color: '#8b5cf6' },
    { time: '10:46:35', type: 'SYSTEM', msg: "Scaling up 'API Gateway' deployment (Replicas: 24 -> 26)", color: '#0ea5e9' },
    { time: '10:47:00', type: 'INFO', msg: 'Redis cache HIT ratio stabilized at 94.2%', color: '#10b981' }
  ]);

  const chartData = [
    { name: 'Jan', revenue: 400000 },
    { name: 'Feb', revenue: 300000 },
    { name: 'Mar', revenue: 500000 },
    { name: 'Apr', revenue: 450000 },
    { name: 'May', revenue: 600000 },
    { name: 'Jun', revenue: 750000 },
    { name: 'Jul', revenue: 845000 },
  ];

  const cpuData = [
    { time: '10:00', load: 20 }, { time: '10:05', load: 25 }, { time: '10:10', load: 45 },
    { time: '10:15', load: 30 }, { time: '10:20', load: 50 }, { time: '10:25', load: 35 },
    { time: '10:30', load: 24 }
  ];

  const memData = [
    { time: '10:00', usage: 45 }, { time: '10:05', usage: 48 }, { time: '10:10', usage: 52 },
    { time: '10:15', usage: 50 }, { time: '10:20', usage: 60 }, { time: '10:25', usage: 55 },
    { time: '10:30', usage: 53 }
  ];

  const reqData = [
    { time: '10:00', reqs: 1200 }, { time: '10:05', reqs: 1350 }, { time: '10:10', reqs: 1800 },
    { time: '10:15', reqs: 1400 }, { time: '10:20', reqs: 2100 }, { time: '10:25', reqs: 1600 },
    { time: '10:30', reqs: 1250 }
  ];

  const sidebarItems = [
    { icon: <Building2 size={18} />, label: 'Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <Building2 size={18} />, label: 'PG Onboarding', active: activeTab === 'onboarding', onClick: () => setActiveTab('onboarding') },
    { icon: <Users size={18} />, label: 'Tenant Invitations & Plans', active: activeTab === 'invitations', onClick: () => setActiveTab('invitations') },
    { icon: <DollarSign size={18} />, label: 'System Revenue', active: activeTab === 'revenue', onClick: () => setActiveTab('revenue') },
    { icon: <Mail size={18} />, label: 'Automated Mail Reminders', active: activeTab === 'reminders', onClick: () => setActiveTab('reminders') },
    { icon: <FileText size={18} />, label: 'Tenant Enrollment Plans', active: activeTab === 'enrollment-plans', onClick: () => setActiveTab('enrollment-plans') },
    { icon: <Cpu size={18} />, label: 'System Telemetry', active: activeTab === 'telemetry', onClick: () => setActiveTab('telemetry') },
    { icon: <Server size={18} />, label: 'Cluster Health', active: activeTab === 'cluster', onClick: () => setActiveTab('cluster'), badge: 'Optimal' },
    { icon: <Database size={18} />, label: 'Tenant Schemas', active: activeTab === 'schemas', onClick: () => setActiveTab('schemas') },
    { icon: <Users size={18} />, label: 'Super Users', active: activeTab === 'users', onClick: () => setActiveTab('users') },
    { icon: <ShieldCheck size={18} />, label: 'Audit Log Stream', active: activeTab === 'audit', onClick: () => setActiveTab('audit') }
  ];

  const roleThemeColor = '#0ea5e9'; // Bright blue for Super Admin

  // Handlers for PG
  const handleSavePg = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPg = {
      id: editingPg ? editingPg.id : Date.now(),
      name: formData.get('name'),
      owner: formData.get('owner'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      totalRooms: parseInt(formData.get('totalRooms')) || 50,
      totalBeds: parseInt(formData.get('totalBeds')) || 100,
      address: formData.get('address'),
      status: editingPg ? editingPg.status : 'Active'
    };
    if (editingPg) {
      setPgList(pgList.map(pg => pg.id === editingPg.id ? newPg : pg));
    } else {
      setPgList([...pgList, newPg]);
    }
    setShowPgModal(false);
  };

  const handleDeletePg = (id) => {
    if(window.confirm("Are you sure you want to delete this PG?")) {
       setPgList(pgList.filter(pg => pg.id !== id));
    }
  };

  const handleTogglePgStatus = (id) => {
    setPgList(pgList.map(pg => pg.id === id ? { ...pg, status: pg.status === 'Active' ? 'Inactive' : 'Active' } : pg));
  };

  // Handlers for Invitations
  const handleSaveInvite = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newInv = {
      id: editingInvite ? editingInvite.id : Date.now(),
      tenantName: formData.get('tenantName'),
      contact: formData.get('contact'),
      pgName: formData.get('pgName'),
      plan: formData.get('plan'),
      status: editingInvite ? editingInvite.status : 'Pending'
    };
    if (editingInvite) {
      setInvitations(invitations.map(i => i.id === editingInvite.id ? newInv : i));
    } else {
      setInvitations([...invitations, newInv]);
    }
    setShowInviteModal(false);
  };

  const handleDeleteInvite = (id) => {
    if(window.confirm("Cancel this invitation?")) setInvitations(invitations.filter(i => i.id !== id));
  };

  // Handlers for Reminders
  const handleSaveReminder = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRem = {
      id: editingReminder ? editingReminder.id : Date.now(),
      type: formData.get('type'),
      triggerDate: formData.get('triggerDate'),
      message: formData.get('message'),
      status: editingReminder ? editingReminder.status : 'Enabled'
    };
    if (editingReminder) {
      setReminders(reminders.map(r => r.id === editingReminder.id ? newRem : r));
    } else {
      setReminders([...reminders, newRem]);
    }
    setShowReminderModal(false);
  };

  const handleToggleReminder = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, status: r.status === 'Enabled' ? 'Disabled' : 'Enabled' } : r));
  };

  const handleDeleteReminder = (id) => {
    if (window.confirm("Delete reminder?")) setReminders(reminders.filter(r => r.id !== id));
  };

  // Handlers for Plans
  const handleSavePlan = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPlan = {
      id: editingPlan ? editingPlan.id : Date.now(),
      planName: formData.get('planName'),
      duration: formData.get('duration'),
      price: formData.get('price'),
      status: editingPlan ? editingPlan.status : 'Active'
    };
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? newPlan : p));
    } else {
      setPlans([...plans, newPlan]);
    }
    setShowPlanModal(false);
  };

  const handleTogglePlan = (id) => {
    setPlans(plans.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p));
  };

  const handleDeletePlan = (id) => {
    if (window.confirm("Delete plan?")) setPlans(plans.filter(p => p.id !== id));
  };

  // Force Sync Cluster
  const handleForceSync = () => {
    setIsSyncing(true);
    setSyncMessage('Synchronizing cluster nodes across AWS multi-region...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage('✓ All 5 cluster nodes synchronized successfully at ' + new Date().toLocaleTimeString());
      setTimeout(() => setSyncMessage(''), 4000);
    }, 1200);
  };

  // Provision New Schema
  const handleProvisionSchema = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newSchema = {
      id: `ORG-00${schemasList.length + 1}`,
      name: fd.get('orgName'),
      schema: `tenant_${fd.get('orgName').toLowerCase().replace(/\s+/g, '_')}`,
      storage: '0.1 GB',
      rows: '0',
      version: 'v18.4'
    };
    setSchemasList([...schemasList, newSchema]);
    setShowProvisionModal(false);
  };

  // Super User Management
  const handleSaveSuperUser = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newU = {
      id: Date.now(),
      name: fd.get('name'),
      email: fd.get('email'),
      role: fd.get('role'),
      lastLogin: 'Never',
      mfa: 'Enabled',
      active: true
    };
    setSuperUsersList([...superUsersList, newU]);
    setShowSuperUserModal(false);
  };

  const handleToggleSuperUser = (id) => {
    setSuperUsersList(superUsersList.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  // Export CSV for Revenue
  const handleExportRevenue = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["PG Name,Plan,Amount,Payment Date,Status", ...revenues.map(r => `"${r.pgName}","${r.plan}","${r.amount}","${r.paymentDate}","${r.status}"`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ArcNio_Revenue_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Revenue List
  const filteredRevenues = revenues.filter(rev => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || rev.pgName?.toLowerCase().includes(q) || rev.plan?.toLowerCase().includes(q) || rev.amount?.toLowerCase().includes(q);
    const matchesStatus = !revenueStatusFilter || rev.status === revenueStatusFilter;
    const matchesDate = !revenueDateFilter || rev.paymentDate?.includes(revenueDateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Filtered PG List
  const filteredPgList = pgList.filter(pg => {
    const q = searchQuery.toLowerCase();
    return !q || pg.name?.toLowerCase().includes(q) || pg.owner?.toLowerCase().includes(q) || pg.phone?.includes(q) || pg.address?.toLowerCase().includes(q);
  });

  // Filtered Invitations
  const filteredInvitations = invitations.filter(inv => {
    const q = searchQuery.toLowerCase();
    return !q || inv.tenantName?.toLowerCase().includes(q) || inv.contact?.toLowerCase().includes(q) || inv.pgName?.toLowerCase().includes(q);
  });

  return (
    <DashboardLayout
      title="ArcNio Super Admin Command Hub"
      subtitle="Complete infrastructure oversight, SaaS billing, and multi-tenant PG control"
      roleThemeColor={roleThemeColor}
      sidebarItems={sidebarItems}
      activeTabKey={activeTab}
      bgImage={internalDeskBg}
      onBack={() => setActiveTab('overview')}
    >
      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          <div className="metrics-grid">
            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('onboarding')}>
              <div className="metric-icon-box" style={{ color: '#0ea5e9' }}>
                <Building2 size={28} />
              </div>
              <div className="metric-details">
                <h4>Total PGs</h4>
                <div className="metric-value">{pgList.length}</div>
                <div className="metric-change positive">✓ {pgList.filter(p => p.status === 'Active').length} Active Properties</div>
              </div>
            </div>
            
            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('revenue')}>
              <div className="metric-icon-box" style={{ color: '#10b981' }}>
                <DollarSign size={28} />
              </div>
              <div className="metric-details">
                <h4>Total SaaS Revenue</h4>
                <div className="metric-value">₹8,45,000</div>
                <div className="metric-change positive">+14.2% growth this month</div>
              </div>
            </div>

            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('cluster')}>
              <div className="metric-icon-box" style={{ color: '#0284c7' }}>
                <Server size={28} />
              </div>
              <div className="metric-details">
                <h4>Global API Gateways</h4>
                <div className="metric-value">99.99%</div>
                <div className="metric-change positive">✓ 5 Cluster Nodes Active</div>
              </div>
            </div>

            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('telemetry')}>
              <div className="metric-icon-box" style={{ color: '#f59e0b' }}>
                <Activity size={28} />
              </div>
              <div className="metric-details">
                <h4>Avg API Latency</h4>
                <div className="metric-value">18ms</div>
                <div className="metric-change positive">⚡ 4ms faster than SLA</div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="dashboard-section-card" style={{ padding: '2rem' }}>
               <div className="section-header">
                  <h3>SaaS Revenue Analytics</h3>
               </div>
               <div style={{ width: '100%', height: 260, marginTop: '1rem' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                      <Tooltip cursor={{fill: 'var(--dash-subcard-bg)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)', color: 'var(--dash-text)'}} />
                      <Bar dataKey="revenue" fill={roleThemeColor} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="dashboard-section-card" style={{ padding: '2rem' }}>
               <div className="section-header">
                  <h3>Live API Requests Per Minute (RPM)</h3>
               </div>
               <div style={{ width: '100%', height: 260, marginTop: '1rem' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reqData}>
                      <defs>
                        <linearGradient id="colorOverviewReqs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)'}} />
                      <Area type="monotone" dataKey="reqs" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOverviewReqs)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>

          <div className="dashboard-section-card">
            <div className="section-header">
              <h3>Internal Core Services Telemetry</h3>
              <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>LIVE WEBSOCKET STREAM</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {[
                { service: 'Authentication & JWT Provider', status: 'Healthy', ping: '12ms', version: 'v4.1.0' },
                { service: 'PostgreSQL Primary Cluster (Multi-Region)', status: 'Healthy', ping: '8ms', version: 'v16.2' },
                { service: 'Redis Distributed Cache', status: 'Healthy', ping: '2ms', version: 'v7.2' },
                { service: 'Kafka Event Dispatcher & Webhooks', status: 'Healthy', ping: '15ms', version: 'v3.5' }
              ].map((item, i) => (
                <div key={i} style={{
                  background: 'var(--dash-subcard-bg)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid var(--dash-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--dash-text)' }}>{item.service}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>Latency: {item.ping} • {item.version}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                    <CheckCircle2 size={16} />
                    <span>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* PG ONBOARDING TAB */}
      {activeTab === 'onboarding' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>PG Onboarding & Properties</h3>
            <button onClick={() => { setEditingPg(null); setShowPgModal(true); }} className="btn-primary">
              <Plus size={16} /> Add PG
            </button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>PG Name</th>
                  <th>Owner Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Rooms / Beds</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPgList.map(pg => (
                  <tr key={pg.id}>
                    <td style={{ fontWeight: 600 }}>{pg.name}</td>
                    <td>{pg.owner}</td>
                    <td>{pg.phone}</td>
                    <td>{pg.email}</td>
                    <td>{pg.address}</td>
                    <td><span style={{ fontWeight: 700 }}>{pg.totalRooms}</span> / {pg.totalBeds}</td>
                    <td>
                      <span style={{ color: pg.status === 'Active' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                        {pg.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" title="View Details" onClick={() => setViewingPg(pg)}><Eye size={15} /></button>
                        <button className="action-btn" title="Edit" onClick={() => { setEditingPg(pg); setShowPgModal(true); }}><Edit2 size={15} /></button>
                        <button className="action-btn" title="Toggle Status" onClick={() => handleTogglePgStatus(pg.id)}>
                           {pg.status === 'Active' ? <XCircle size={15} style={{color: '#f59e0b'}}/> : <CheckCircle2 size={15} style={{color: '#10b981'}}/>}
                        </button>
                        <button className="action-btn" style={{ color: '#ef4444' }} title="Delete" onClick={() => handleDeletePg(pg.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TENANT INVITATIONS & PLANS */}
      {activeTab === 'invitations' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Tenant Invitations & Subscriptions</h3>
            <button onClick={() => { setEditingInvite(null); setShowInviteModal(true); }} className="btn-primary">
              <Send size={16} /> Send Invitation
            </button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Tenant Name</th>
                  <th>Phone / Email</th>
                  <th>PG Name</th>
                  <th>Plan</th>
                  <th>Invitation Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvitations.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 600 }}>{inv.tenantName}</td>
                    <td>{inv.contact}</td>
                    <td>{inv.pgName}</td>
                    <td>{inv.plan}</td>
                    <td>
                       <span style={{ color: inv.status === 'Accepted' ? '#10b981' : '#f59e0b', fontWeight: 700, background: inv.status === 'Accepted' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" title="Edit" onClick={() => { setEditingInvite(inv); setShowInviteModal(true); }}><Edit2 size={15} /></button>
                        <button className="action-btn" style={{ color: '#ef4444' }} title="Cancel/Delete" onClick={() => handleDeleteInvite(inv.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SYSTEM REVENUE */}
      {activeTab === 'revenue' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>SaaS Platform Revenue & Subscriptions</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
               <input 
                 type="date" 
                 value={revenueDateFilter} 
                 onChange={(e) => setRevenueDateFilter(e.target.value)} 
                 style={{ background: 'var(--dash-input-bg)', border: '1px solid var(--dash-border)', color: 'var(--dash-text)', padding: '0.5rem 0.8rem', borderRadius: '8px' }}
               />
               <select 
                 value={revenueStatusFilter} 
                 onChange={(e) => setRevenueStatusFilter(e.target.value)}
                 style={{ background: 'var(--dash-input-bg)', border: '1px solid var(--dash-border)', color: 'var(--dash-text)', padding: '0.5rem 0.8rem', borderRadius: '8px' }}
               >
                 <option value="">All Statuses</option>
                 <option value="Completed">Completed</option>
                 <option value="Pending">Pending</option>
               </select>
               <button onClick={handleExportRevenue} className="btn-primary" style={{ padding: '0.55rem 1rem' }}>
                 <Download size={16} /> Export CSV
               </button>
            </div>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>PG Name</th>
                  <th>Subscription Plan</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRevenues.map(rev => (
                  <tr key={rev.id}>
                    <td style={{ fontWeight: 600 }}>{rev.pgName}</td>
                    <td><span style={{ background: 'var(--dash-subcard-bg)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>{rev.plan}</span></td>
                    <td style={{ fontWeight: 800, color: '#10b981' }}>{rev.amount}</td>
                    <td>{rev.paymentDate}</td>
                    <td>
                      <span style={{ 
                        color: rev.status === 'Completed' ? '#10b981' : '#f59e0b', 
                        fontWeight: 700,
                        background: rev.status === 'Completed' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {rev.status}
                      </span>
                    </td>
                    <td>
                      {rev.status === 'Pending' && (
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                          onClick={() => setRevenues(revenues.map(r => r.id === rev.id ? { ...r, status: 'Completed' } : r))}
                        >
                          Mark Paid
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

      {/* AUTOMATED MAIL REMINDERS */}
      {activeTab === 'reminders' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Automated Mail & Notification Reminders</h3>
            <button onClick={() => { setEditingReminder(null); setShowReminderModal(true); }} className="btn-primary">
              <Plus size={16} /> Add Reminder
            </button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Reminder Type</th>
                  <th>Trigger Schedule</th>
                  <th>Notification Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map(rem => (
                  <tr key={rem.id}>
                    <td style={{ fontWeight: 600 }}>{rem.type}</td>
                    <td>{rem.triggerDate}</td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rem.message}</td>
                    <td>
                       <span style={{ 
                         color: rem.status === 'Enabled' ? '#10b981' : '#64748b', 
                         fontWeight: 700,
                         background: rem.status === 'Enabled' ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
                         padding: '4px 8px',
                         borderRadius: '6px'
                       }}>
                        {rem.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" title="Edit" onClick={() => { setEditingReminder(rem); setShowReminderModal(true); }}><Edit2 size={15} /></button>
                        <button className="action-btn" style={{ color: rem.status === 'Enabled' ? '#f59e0b' : '#10b981' }} title="Toggle" onClick={() => handleToggleReminder(rem.id)}>
                           {rem.status === 'Enabled' ? <XCircle size={15}/> : <CheckCircle2 size={15}/>}
                        </button>
                        <button className="action-btn" style={{ color: '#ef4444' }} title="Delete" onClick={() => handleDeleteReminder(rem.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TENANT ENROLLMENT PLANS */}
      {activeTab === 'enrollment-plans' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Tenant Enrollment & Subscription Plans</h3>
            <button onClick={() => { setEditingPlan(null); setShowPlanModal(true); }} className="btn-primary">
              <Plus size={16} /> Add Plan
            </button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id}>
                    <td style={{ fontWeight: 700, fontSize: '1rem', color: roleThemeColor }}>{plan.planName}</td>
                    <td>{plan.duration}</td>
                    <td style={{ fontWeight: 800 }}>{plan.price}</td>
                    <td>
                      <span style={{ 
                        color: plan.status === 'Active' ? '#10b981' : '#64748b', 
                        fontWeight: 700,
                        background: plan.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {plan.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" title="Edit" onClick={() => { setEditingPlan(plan); setShowPlanModal(true); }}><Edit2 size={15} /></button>
                        <button className="action-btn" style={{ color: plan.status === 'Active' ? '#f59e0b' : '#10b981' }} title="Toggle" onClick={() => handleTogglePlan(plan.id)}>
                           {plan.status === 'Active' ? <XCircle size={15}/> : <CheckCircle2 size={15}/>}
                        </button>
                        <button className="action-btn" style={{ color: '#ef4444' }} title="Delete" onClick={() => handleDeletePlan(plan.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SYSTEM TELEMETRY TAB */}
      {activeTab === 'telemetry' && (
        <>
          <div className="metrics-grid">
            <div className="metric-card"><div className="metric-details"><h4>Current CPU Load</h4><div className="metric-value" style={{color: '#0284c7'}}>24.2%</div><div className="metric-change positive">Healthy load balance</div></div></div>
            <div className="metric-card"><div className="metric-details"><h4>Memory Allocation</h4><div className="metric-value" style={{color: '#7c3aed'}}>53%</div><div className="metric-change positive">8.4 GB / 16 GB</div></div></div>
            <div className="metric-card"><div className="metric-details"><h4>Network Throughput</h4><div className="metric-value" style={{color: '#10b981'}}>1.2 GB/s</div><div className="metric-change positive">Optimal peering</div></div></div>
            <div className="metric-card"><div className="metric-details"><h4>Active WebSocket Connections</h4><div className="metric-value" style={{color: '#f59e0b'}}>14,203</div><div className="metric-change positive">Live mobile/web clients</div></div></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="dashboard-section-card" style={{ padding: '2rem' }}>
              <div className="section-header"><h3>CPU Load History</h3></div>
              <div style={{ height: 250, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cpuData}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)'}} />
                    <Area type="monotone" dataKey="load" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-section-card" style={{ padding: '2rem' }}>
              <div className="section-header"><h3>Memory Usage History</h3></div>
              <div style={{ height: 250, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={memData}>
                    <defs>
                      <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)'}} />
                    <Area type="monotone" dataKey="usage" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorMem)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CLUSTER HEALTH TAB */}
      {activeTab === 'cluster' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <div>
              <h3>Global Cluster Nodes & Health</h3>
              {syncMessage && <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>{syncMessage}</span>}
            </div>
            <button 
              className="btn-primary" 
              style={{ background: '#0284c7' }}
              onClick={handleForceSync}
              disabled={isSyncing}
            >
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Force Sync'}
            </button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Node ID</th>
                  <th>Region</th>
                  <th>Role</th>
                  <th>CPU</th>
                  <th>Memory</th>
                  <th>Status</th>
                  <th>Uptime</th>
                </tr>
              </thead>
              <tbody>
                {clusterNodes.map((node, i) => (
                  <tr key={i}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{node.id}</td>
                    <td>{node.region}</td>
                    <td><span style={{ background: 'var(--dash-subcard-bg)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>{node.role}</span></td>
                    <td style={{ color: parseInt(node.cpu) > 80 ? '#ef4444' : 'inherit', fontWeight: parseInt(node.cpu) > 80 ? 700 : 400 }}>{node.cpu}</td>
                    <td>{node.mem}</td>
                    <td>
                      <span style={{ 
                        color: node.status === 'Healthy' ? '#10b981' : '#f59e0b', 
                        fontWeight: 700,
                        background: node.status === 'Healthy' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {node.status}
                      </span>
                    </td>
                    <td>{node.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TENANT SCHEMAS TAB */}
      {activeTab === 'schemas' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Tenant Schemas & Migrations</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-secondary" onClick={() => setShowMigrationsModal(true)}>View Migrations</button>
              <button className="btn-primary" style={{ background: '#7c3aed' }} onClick={() => setShowProvisionModal(true)}>
                <Database size={16} /> Provision New
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Tenant ID</th>
                  <th>Organization Name</th>
                  <th>DB Schema Name</th>
                  <th>Storage Used</th>
                  <th>Total Rows</th>
                  <th>Version</th>
                </tr>
              </thead>
              <tbody>
                {schemasList.map((org, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{org.id}</td>
                    <td style={{ fontWeight: 700 }}>{org.name}</td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--dash-muted)' }}>{org.schema}</td>
                    <td>{org.storage}</td>
                    <td>{org.rows}</td>
                    <td>
                      <span style={{ 
                        color: org.version === 'v18.4' ? '#10b981' : '#f59e0b',
                        fontWeight: 700 
                      }}>{org.version} {org.version !== 'v18.4' && '(Pending)'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUPER USERS TAB */}
      {activeTab === 'users' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Internal Support Staff & Super Users</h3>
            <button className="btn-primary" onClick={() => setShowSuperUserModal(true)}>
              <Plus size={16} /> Add Super User
            </button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th>MFA Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {superUsersList.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 700 }}>{u.name}</td>
                    <td style={{ color: 'var(--dash-muted)' }}>{u.email}</td>
                    <td><span style={{ background: 'var(--dash-subcard-bg)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>{u.role}</span></td>
                    <td>{u.lastLogin}</td>
                    <td>
                      <span style={{ 
                        color: u.mfa === 'Enabled' ? '#10b981' : '#ef4444', 
                        fontWeight: 700,
                        background: u.mfa === 'Enabled' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {u.mfa}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '4px 12px', fontSize: '0.8rem', color: u.active ? '#ef4444' : '#10b981' }}
                        onClick={() => handleToggleSuperUser(u.id)}
                      >
                        {u.active ? 'Revoke Access' : 'Grant Access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOG STREAM TAB */}
      {activeTab === 'audit' && (
        <div className="dashboard-section-card" style={{ background: '#0f172a', color: '#f8fafc', border: 'none' }}>
          <div className="section-header" style={{ borderBottomColor: '#334155' }}>
            <h3 style={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={20} /> Real-time Audit Stream
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                className="btn-secondary" 
                style={{ padding: '4px 10px', fontSize: '0.8rem', background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }}
                onClick={() => setIsStreamPaused(!isStreamPaused)}
              >
                {isStreamPaused ? <Play size={14} /> : <Pause size={14} />}
                {isStreamPaused ? 'Resume' : 'Pause'}
              </button>
              <button 
                className="btn-secondary" 
                style={{ padding: '4px 10px', fontSize: '0.8rem', background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' }}
                onClick={() => setAuditLogs([])}
              >
                Clear
              </button>
              <span style={{ fontSize: '0.8rem', color: isStreamPaused ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
                {isStreamPaused ? 'PAUSED' : 'LIVE'}
              </span>
            </div>
          </div>
          <div style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '400px', overflowY: 'auto' }}>
            {auditLogs.length === 0 ? (
              <div style={{ color: '#64748b', textAlign: 'center', margin: 'auto' }}>No logs recorded. Log buffer cleared.</div>
            ) : (
              auditLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.color }}>
                  [{new Date().toISOString().slice(0, 10)} {log.time}] {log.type}: {log.msg}
                </div>
              ))
            )}
            {!isStreamPaused && (
              <div style={{ animation: 'blink 1s step-end infinite', width: '8px', height: '16px', background: '#10b981', marginTop: '0.5rem' }}></div>
            )}
          </div>
          <style>{`
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* --- ALL WORKING MODALS --- */}

      {/* PG MODAL */}
      {showPgModal && (
        <div className="modal-backdrop" onClick={() => setShowPgModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPg ? 'Edit PG Details' : 'Add New PG'}</h3>
              <p>{editingPg ? 'Update PG information and credentials.' : 'Onboard a new PG to the system.'}</p>
            </div>
            <form className="modal-form" onSubmit={handleSavePg}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group"><label>PG Name</label><input type="text" name="name" defaultValue={editingPg?.name} required /></div>
                <div className="form-group"><label>Owner Name</label><input type="text" name="owner" defaultValue={editingPg?.owner} required /></div>
                <div className="form-group"><label>Phone</label><input type="text" name="phone" defaultValue={editingPg?.phone} required /></div>
                <div className="form-group"><label>Email</label><input type="email" name="email" defaultValue={editingPg?.email} required /></div>
                <div className="form-group"><label>Total Rooms</label><input type="number" name="totalRooms" defaultValue={editingPg?.totalRooms || 50} required /></div>
                <div className="form-group"><label>Total Beds</label><input type="number" name="totalBeds" defaultValue={editingPg?.totalBeds || 100} required /></div>
              </div>
              <div className="form-group"><label>Address</label><textarea name="address" rows="2" defaultValue={editingPg?.address} required></textarea></div>
              
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                 <label>PG Proofs & Documents (Optional)</label>
                 <div style={{ border: '2px dashed var(--dash-border)', padding: '1rem', borderRadius: '12px', textAlign: 'center', background: 'var(--dash-subcard-bg)', cursor: 'pointer' }}>
                    <UploadCloud size={20} style={{ color: 'var(--dash-muted)', margin: '0 auto 0.25rem' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)', fontWeight: 600 }}>Attach registration documents or ID proof</span>
                    <input type="file" multiple style={{ display: 'block', margin: '0.5rem auto 0', fontSize: '0.8rem' }} />
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowPgModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{editingPg ? 'Save Changes' : 'Save PG'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PG MODAL */}
      {viewingPg && (
        <div className="modal-backdrop" onClick={() => setViewingPg(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{viewingPg.name}</h3>
              <p>Property Profile & Infrastructure Summary</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }}>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Owner</span><div style={{ fontWeight: 700 }}>{viewingPg.owner}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Phone</span><div style={{ fontWeight: 700 }}>{viewingPg.phone}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Email</span><div style={{ fontWeight: 700 }}>{viewingPg.email}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Status</span><div><span style={{ color: '#10b981', fontWeight: 700 }}>{viewingPg.status}</span></div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Total Rooms</span><div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{viewingPg.totalRooms}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Total Capacity</span><div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0ea5e9' }}>{viewingPg.totalBeds} Beds</div></div>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Registered Address</span>
              <div style={{ fontWeight: 600, marginTop: '2px' }}>{viewingPg.address}</div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setViewingPg(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* INVITATION MODAL */}
      {showInviteModal && (
        <div className="modal-backdrop" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingInvite ? 'Edit Invitation' : 'Send Tenant Invitation'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveInvite}>
              <div className="form-group"><label>Tenant Name</label><input type="text" name="tenantName" defaultValue={editingInvite?.tenantName} required /></div>
              <div className="form-group"><label>Phone / Email</label><input type="text" name="contact" defaultValue={editingInvite?.contact} required /></div>
              <div className="form-group">
                <label>PG Property</label>
                <select name="pgName" defaultValue={editingInvite?.pgName || pgList[0]?.name}>
                  {pgList.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Plan</label>
                <select name="plan" defaultValue={editingInvite?.plan || '6 Months'}>
                  <option>1 Month</option>
                  <option>6 Months</option>
                  <option>12 Months</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowInviteModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}><Send size={16}/> {editingInvite ? 'Save' : 'Send Invite'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REMINDER MODAL */}
      {showReminderModal && (
        <div className="modal-backdrop" onClick={() => setShowReminderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingReminder ? 'Edit Reminder' : 'Add Automated Reminder'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveReminder}>
              <div className="form-group"><label>Reminder Type</label><input type="text" name="type" defaultValue={editingReminder?.type} placeholder="e.g. Rent Due Notice" required /></div>
              <div className="form-group"><label>Trigger Schedule</label><input type="text" name="triggerDate" defaultValue={editingReminder?.triggerDate} placeholder="e.g. 3 Days Before Due" required /></div>
              <div className="form-group"><label>Notification Template</label><textarea name="message" required rows="4" defaultValue={editingReminder?.message} placeholder="Dear resident, your rent payment is due..."></textarea></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowReminderModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Reminder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PLAN MODAL */}
      {showPlanModal && (
        <div className="modal-backdrop" onClick={() => setShowPlanModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPlan ? 'Edit Plan' : 'Add Enrollment Plan'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSavePlan}>
              <div className="form-group"><label>Plan Name</label><input type="text" name="planName" defaultValue={editingPlan?.planName} placeholder="e.g. Semi-Annual Saver" required /></div>
              <div className="form-group"><label>Duration</label><input type="text" name="duration" defaultValue={editingPlan?.duration} placeholder="e.g. 6 Months" required /></div>
              <div className="form-group"><label>Price (₹)</label><input type="text" name="price" defaultValue={editingPlan?.price} placeholder="e.g. ₹12,999" required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowPlanModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROVISION SCHEMA MODAL */}
      {showProvisionModal && (
        <div className="modal-backdrop" onClick={() => setShowProvisionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Provision New Tenant Schema</h3>
              <p>Creates an isolated PostgreSQL schema and database cluster role.</p>
            </div>
            <form className="modal-form" onSubmit={handleProvisionSchema}>
              <div className="form-group"><label>Organization Name</label><input type="text" name="orgName" placeholder="e.g. Prime Co-Living" required /></div>
              <div className="form-group">
                <label>Region</label>
                <select name="region">
                  <option>Mumbai (ap-south-1)</option>
                  <option>Singapore (ap-southeast-1)</option>
                  <option>Frankfurt (eu-central-1)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowProvisionModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, background: '#7c3aed' }}>Provision Schema</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MIGRATIONS MODAL */}
      {showMigrationsModal && (
        <div className="modal-backdrop" onClick={() => setShowMigrationsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Database Migrations Log</h3>
              <p>Latest migration scripts applied across tenant schemas.</p>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {[
                { version: 'v18.4', name: '20261001_add_amenity_booking_indices.sql', status: 'Applied to 4 Schemas', time: '1 Oct 2026' },
                { version: 'v18.3', name: '20260915_partition_audit_event_logs.sql', status: 'Applied to 4 Schemas', time: '15 Sep 2026' },
                { version: 'v18.2', name: '20260901_create_biometric_gate_entry.sql', status: 'Applied to 4 Schemas', time: '1 Sep 2026' }
              ].map((m, idx) => (
                <div key={idx} style={{ background: 'var(--dash-subcard-bg)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--dash-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#0ea5e9' }}>{m.version}</span>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>✓ {m.status}</span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '4px' }}>{m.name}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setShowMigrationsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SUPER USER MODAL */}
      {showSuperUserModal && (
        <div className="modal-backdrop" onClick={() => setShowSuperUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Grant Super Administrator Access</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveSuperUser}>
              <div className="form-group"><label>Full Name</label><input type="text" name="name" required /></div>
              <div className="form-group"><label>Staff Email</label><input type="email" name="email" required /></div>
              <div className="form-group">
                <label>System Role</label>
                <select name="role">
                  <option>Super Administrator</option>
                  <option>Support Engineer</option>
                  <option>Database Admin</option>
                  <option>Security Analyst</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowSuperUserModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Grant Access</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
