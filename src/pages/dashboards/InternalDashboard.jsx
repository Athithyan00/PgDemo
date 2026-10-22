// src/pages/dashboards/InternalDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import internalDeskBg from '../../assets/super_admin_login_bg.jpg';
import { useAuth } from '../../context/AuthContext';
import { 
  Server, 
  ShieldCheck, 
  Activity, 
  Users, 
  Database, 
  Cpu,
  CheckCircle2,
  Terminal,
  AlertTriangle,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';

export default function InternalDashboard() {
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

  const sidebarItems = [
    { icon: <Activity size={18} />, label: 'Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <Cpu size={18} />, label: 'System Telemetry', active: activeTab === 'telemetry', onClick: () => setActiveTab('telemetry') },
    { icon: <Server size={18} />, label: 'Cluster Health', active: activeTab === 'cluster', onClick: () => setActiveTab('cluster'), badge: 'Optimal' },
    { icon: <Database size={18} />, label: 'Tenant Schemas', active: activeTab === 'schemas', onClick: () => setActiveTab('schemas') },
    { icon: <Users size={18} />, label: 'Super Users', active: activeTab === 'users', onClick: () => setActiveTab('users') },
    { icon: <ShieldCheck size={18} />, label: 'Audit Log Stream', active: activeTab === 'audit', onClick: () => setActiveTab('audit') }
  ];

  // Dummy data for charts
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

  return (
    <DashboardLayout
      title="ArcNio System Command Hub"
      subtitle={`Internal Infrastructure Admin • ${user?.name || 'Super Administrator'}`}
      roleThemeColor="#0284c7"
      sidebarItems={sidebarItems}
      activeTabKey={activeTab}
      bgImage={internalDeskBg}
      onBack={() => setActiveTab('overview')}
    >
      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          <div className="metrics-grid">
            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('cluster')}>
              <div className="metric-icon-box" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                <Server size={26} />
              </div>
              <div className="metric-details">
                <h4>Global API Gateways</h4>
                <div className="metric-value">99.99%</div>
                <div className="metric-change positive">✓ 24 Nodes Active</div>
              </div>
            </div>

            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('telemetry')}>
              <div className="metric-icon-box" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                <Activity size={26} />
              </div>
              <div className="metric-details">
                <h4>Avg Response Time</h4>
                <div className="metric-value">18ms</div>
                <div className="metric-change positive">⚡ 4ms faster than SLA</div>
              </div>
            </div>

            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('telemetry')}>
              <div className="metric-icon-box" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                <Cpu size={26} />
              </div>
              <div className="metric-details">
                <h4>System CPU Load</h4>
                <div className="metric-value">24.2%</div>
                <div className="metric-change neutral">Normal operating temp</div>
              </div>
            </div>

            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('schemas')}>
              <div className="metric-icon-box" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}>
                <Database size={26} />
              </div>
              <div className="metric-details">
                <h4>Tenant Organizations</h4>
                <div className="metric-value">342</div>
                <div className="metric-change positive">+14 this week</div>
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

      {/* TELEMETRY TAB */}
      {activeTab === 'telemetry' && (
        <>
          <div className="metrics-grid">
            <div className="metric-card"><div className="metric-details"><h4>Current CPU</h4><div className="metric-value" style={{color: '#0284c7'}}>24.2%</div></div></div>
            <div className="metric-card"><div className="metric-details"><h4>Memory Allocation</h4><div className="metric-value" style={{color: '#7c3aed'}}>53%</div></div></div>
            <div className="metric-card"><div className="metric-details"><h4>Network I/O</h4><div className="metric-value" style={{color: '#10b981'}}>1.2 GB/s</div></div></div>
            <div className="metric-card"><div className="metric-details"><h4>Active Connections</h4><div className="metric-value" style={{color: '#f59e0b'}}>14,203</div></div></div>
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
                    <RechartsTooltip contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)'}} />
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
                    <RechartsTooltip contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)'}} />
                    <Area type="monotone" dataKey="usage" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorMem)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-section-card" style={{ gridColumn: '1 / -1', padding: '2rem' }}>
              <div className="section-header"><h3>API Requests Per Minute (RPM)</h3></div>
              <div style={{ height: 300, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reqData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <RechartsTooltip cursor={{fill: 'var(--dash-subcard-bg)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)'}} />
                    <Bar dataKey="reqs" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
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
            <h3>Global Cluster Nodes</h3>
            <button className="btn-primary" style={{ background: '#0284c7' }}><RefreshCw size={16} /> Force Sync</button>
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
                {[
                  { id: 'ap-south-1a-prod-01', region: 'Mumbai (AWS)', role: 'Primary DB', cpu: '18%', mem: '42%', status: 'Healthy', uptime: '45d 12h' },
                  { id: 'ap-south-1b-prod-02', region: 'Mumbai (AWS)', role: 'Replica DB', cpu: '12%', mem: '38%', status: 'Healthy', uptime: '45d 12h' },
                  { id: 'ap-southeast-1a-prod-01', region: 'Singapore (AWS)', role: 'API Gateway', cpu: '34%', mem: '55%', status: 'Healthy', uptime: '12d 5h' },
                  { id: 'eu-central-1a-prod-01', region: 'Frankfurt (AWS)', role: 'Redis Cache', cpu: '8%', mem: '22%', status: 'Healthy', uptime: '90d 2h' },
                  { id: 'us-east-1a-prod-01', region: 'N. Virginia (AWS)', role: 'Background Jobs', cpu: '88%', mem: '78%', status: 'Warning', uptime: '5d 8h' }
                ].map((node, i) => (
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
              <button className="btn-secondary">View Migrations</button>
              <button className="btn-primary" style={{ background: '#7c3aed' }}><Database size={16} /> Provision New</button>
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
                {[
                  { id: 'ORG-001', name: 'Elite PGs & Co.', schema: 'tenant_elite_pgs', storage: '4.2 GB', rows: '1.2M', version: 'v18.4' },
                  { id: 'ORG-002', name: 'Sunrise Stays', schema: 'tenant_sunrise', storage: '1.8 GB', rows: '450K', version: 'v18.4' },
                  { id: 'ORG-003', name: 'Metro Co-living', schema: 'tenant_metro', storage: '8.5 GB', rows: '3.1M', version: 'v18.3' },
                  { id: 'ORG-004', name: 'Student Nest', schema: 'tenant_student_nest', storage: '0.4 GB', rows: '120K', version: 'v18.4' }
                ].map((org, i) => (
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
                {[
                  { name: 'Alice Jenkins', email: 'alice.j@arcnio.com', role: 'Super Administrator', lastLogin: '10 mins ago', mfa: 'Enabled' },
                  { name: 'Bob Smith', email: 'bob.s@arcnio.com', role: 'Support Engineer', lastLogin: '2 hours ago', mfa: 'Enabled' },
                  { name: 'Charlie Davis', email: 'charlie.d@arcnio.com', role: 'Database Admin', lastLogin: '1 day ago', mfa: 'Enabled' },
                  { name: 'Diana Prince', email: 'diana.p@arcnio.com', role: 'Security Analyst', lastLogin: '5 mins ago', mfa: 'Pending' }
                ].map((u, i) => (
                  <tr key={i}>
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
                    <td><button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Revoke Access</button></td>
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
            <h3 style={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Terminal size={20} /> Real-time Audit Stream</h3>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>LIVE</span>
          </div>
          <div style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '400px', overflowY: 'auto' }}>
            <div style={{ color: '#10b981' }}>[2026-10-08 10:45:12] INFO: User auth successful. Tenant: ORG-001, User: rahul.sharma</div>
            <div style={{ color: '#0ea5e9' }}>[2026-10-08 10:45:14] DB_MIGRATION: Schema 'tenant_student_nest' updated to v18.4</div>
            <div style={{ color: '#f59e0b' }}>[2026-10-08 10:45:22] WARN: High CPU threshold exceeded on node us-east-1a-prod-01 (88%)</div>
            <div style={{ color: '#10b981' }}>[2026-10-08 10:45:30] INFO: Background job 'DailyReportSync' completed successfully.</div>
            <div style={{ color: '#ef4444' }}>[2026-10-08 10:45:45] ERROR: Failed to dispatch webhook for Event ID: EVT-992381 (Timeout)</div>
            <div style={{ color: '#10b981' }}>[2026-10-08 10:46:01] INFO: JWT Token issued for user ID: 88291</div>
            <div style={{ color: '#10b981' }}>[2026-10-08 10:46:12] INFO: User auth successful. Tenant: ORG-002, User: admin.sunrise</div>
            <div style={{ color: '#8b5cf6' }}>[2026-10-08 10:46:20] AUDIT: SuperAdmin 'Alice Jenkins' accessed 'Tenant Schemas' view.</div>
            <div style={{ color: '#0ea5e9' }}>[2026-10-08 10:46:35] SYSTEM: Scaling up 'API Gateway' deployment (Replicas: 24 -&gt; 26)</div>
            <div style={{ color: '#10b981' }}>[2026-10-08 10:47:00] INFO: Redis cache HIT ratio stabilized at 94.2%</div>
            {/* Blinking cursor effect */}
            <div style={{ animation: 'blink 1s step-end infinite', width: '8px', height: '16px', background: '#10b981', marginTop: '0.5rem' }}></div>
          </div>
          <style>{`
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </DashboardLayout>
  );
}

