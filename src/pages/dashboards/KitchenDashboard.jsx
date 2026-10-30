// src/pages/dashboards/KitchenDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { PG_IMAGES } from '../../assets/pgImages';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Coffee, 
  Utensils, 
  List, 
  Sparkles,
  Archive,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Download,
  RefreshCw,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function KitchenDashboard() {
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
  const roleThemeColor = '#f59e0b'; // Amber/Orange for Kitchen

  const { menuCosting, setMenuCosting, specialRequests, setSpecialRequests, cleaningHygiene, setCleaningHygiene, inventory, setInventory, searchQuery } = dataContext;

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

  const [showMenuModal, setShowMenuModal] = useState(false); const [editingMenu, setEditingMenu] = useState(null);
  const [showReqModal, setShowReqModal] = useState(false); const [editingReq, setEditingReq] = useState(null);
  const [showCleanModal, setShowCleanModal] = useState(false); const [editingClean, setEditingClean] = useState(null);
  const [showInvModal, setShowInvModal] = useState(false); const [editingInv, setEditingInv] = useState(null);

  const chartData = [
    { name: 'Mon', count: 320 },
    { name: 'Tue', count: 340 },
    { name: 'Wed', count: 330 },
    { name: 'Thu', count: 350 },
    { name: 'Fri', count: 380 },
    { name: 'Sat', count: 400 },
    { name: 'Sun', count: 420 },
  ];

  const sidebarItems = [
    { icon: <Coffee size={18} />, label: 'Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <Utensils size={18} />, label: 'Daily Food Menu', active: activeTab === 'menu', onClick: () => setActiveTab('menu') },
    { icon: <List size={18} />, label: 'Special Food Requests', active: activeTab === 'requests', onClick: () => setActiveTab('requests') },
    { icon: <Sparkles size={18} />, label: 'Kitchen Cleaning', active: activeTab === 'cleaning', onClick: () => setActiveTab('cleaning') },
    { icon: <Archive size={18} />, label: 'Consumables / Inventory', active: activeTab === 'inventory', onClick: () => setActiveTab('inventory') }
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

  const handleRestock = (id) => {
    setInventory(inventory.map(item => 
      item.id === id 
        ? { ...item, quantity: (parseInt(item.quantity) || 0) + 25, stockStatus: 'Adequate' } 
        : item
    ));
  };

  const handleExportMenuCSV = () => {
    if (!menuCosting.length) {
      alert('No menu data to export.');
      return;
    }
    const headers = ['Date', 'Meal', 'Menu', 'Meal Count'];
    const csvContent = [
      headers.join(','),
      ...menuCosting.map(m => `"${m.date}","${m.meal}","${m.menu}","${m.mealCount}"`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kitchen_daily_menu_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout
      title="Kitchen Staff Dashboard"
      subtitle="Manage meals, inventory, and kitchen hygiene"
      roleThemeColor={roleThemeColor}
      sidebarItems={sidebarItems}
      activeTabKey={activeTab}
      onBack={() => setActiveTab('overview')}
    >
      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          <div className="metrics-grid">
            <div className="metric-card"><div className="metric-icon-box" style={{color: roleThemeColor}}><Utensils size={28}/></div><div className="metric-details"><h4>Today's Meals</h4><div className="metric-value">420</div></div></div>
            <div className="metric-card"><div className="metric-icon-box" style={{color: '#3b82f6'}}><List size={28}/></div><div className="metric-details"><h4>Food Requests</h4><div className="metric-value">{specialRequests.filter(r=>r.status==='Pending').length} Pending</div></div></div>
            <div className="metric-card"><div className="metric-icon-box" style={{color: '#ef4444'}}><Archive size={28}/></div><div className="metric-details"><h4>Low Stock Items</h4><div className="metric-value" style={{ color: '#ef4444' }}>{inventory.filter(i=>i.stockStatus==='Low Stock').length}</div></div></div>
          </div>

          {/* PG DINING & MESS SHOWCASE */}
          <div className="dashboard-section-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ borderRadius: '14px', overflow: 'hidden', height: '200px', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <img src={PG_IMAGES.messDining} alt="PG Dining Hall" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={14} color="#34d399" /> Arcnio Certified Mess
                </div>
                <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>
                  FSSAI Hygiene: Grade A+
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--dash-text)' }}>
                  Centralized Mess & Kitchen Operations
                </h3>
                <p style={{ color: 'var(--dash-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Menu updates published here are instantly broadcasted live to Manager oversight logs and Tenant resident dashboards. All special dietary requests from residents sync automatically.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={() => setActiveTab('menu')} className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                    <Utensils size={15} /> Update Daily Menu
                  </button>
                  <button onClick={() => setActiveTab('requests')} className="btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                    <List size={15} /> View Resident Requests ({specialRequests.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-section-card" style={{ padding: '2rem' }}>
             <div className="section-header"><h3>Weekly Meal Consumption</h3></div>
             <div style={{ width: '100%', height: 300, marginTop: '1.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <Tooltip cursor={{fill: 'var(--dash-subcard-bg)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)', color: 'var(--dash-text)'}} />
                    <Bar dataKey="count" fill={roleThemeColor} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </>
      )}

      {/* DAILY FOOD MENU & COSTING */}
      {activeTab === 'menu' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Daily Food Menu & Costing ({filterList(menuCosting).length})</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleExportMenuCSV} className="btn-secondary">
                <Download size={15} /> Export Menu
              </button>
              <button onClick={() => { setEditingMenu(null); setShowMenuModal(true); }} className="btn-primary">
                <Plus size={16} /> Add Menu
              </button>
            </div>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Date</th><th>Meal</th><th>Menu</th><th>Meal Count</th><th>Actions</th></tr></thead>
            <tbody>
              {filterList(menuCosting).map(m => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.date}</td>
                  <td><span style={{ background: 'var(--dash-subcard-bg)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>{m.meal}</span></td>
                  <td>{m.menu}</td>
                  <td>{m.mealCount}</td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="action-btn" title="Edit" onClick={() => { setEditingMenu(m); setShowMenuModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(m.id, menuCosting, setMenuCosting, 'Delete menu?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {/* SPECIAL FOOD REQUESTS */}
      {activeTab === 'requests' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Special Food Requests ({filterList(specialRequests).length})</h3>
            <button onClick={() => { setEditingReq(null); setShowReqModal(true); }} className="btn-primary">
              <Plus size={16} /> Add Request
            </button>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Tenant</th><th>Meal</th><th>Request</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filterList(specialRequests).map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.tenant}</td>
                  <td><span style={{ background: 'var(--dash-subcard-bg)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>{r.meal}</span></td>
                  <td>{r.request}</td><td>{r.date}</td>
                  <td><span style={{ color: r.status === 'Fulfilled' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{r.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    {r.status !== 'Fulfilled' && <button className="action-btn" title="Mark Fulfilled" style={{ color: '#10b981' }} onClick={() => setSpecialRequests(specialRequests.map(x => x.id === r.id ? {...x, status: 'Fulfilled'} : x))}><CheckCircle2 size={15} /></button>}
                    <button className="action-btn" title="Edit" onClick={() => { setEditingReq(r); setShowReqModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(r.id, specialRequests, setSpecialRequests, 'Delete request?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {/* KITCHEN CLEANING & HYGIENE */}
      {activeTab === 'cleaning' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Kitchen Cleaning & Hygiene ({filterList(cleaningHygiene).length})</h3>
            <button onClick={() => { setEditingClean(null); setShowCleanModal(true); }} className="btn-primary">
              <Plus size={16} /> Add Task
            </button>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Date</th><th>Cleaning Task</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filterList(cleaningHygiene).map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.date}</td><td>{c.task}</td>
                  <td><span style={{ color: c.status === 'Completed' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{c.status}</span></td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    {c.status !== 'Completed' && <button className="action-btn" title="Mark Completed" style={{ color: '#10b981' }} onClick={() => setCleaningHygiene(cleaningHygiene.map(x => x.id === c.id ? {...x, status: 'Completed'} : x))}><CheckCircle2 size={15} /></button>}
                    <button className="action-btn" title="Edit" onClick={() => { setEditingClean(c); setShowCleanModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(c.id, cleaningHygiene, setCleaningHygiene, 'Delete task?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {/* CONSUMABLES / INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Consumables / Inventory ({filterList(inventory).length})</h3>
            <button onClick={() => { setEditingInv(null); setShowInvModal(true); }} className="btn-primary">
              <Plus size={16} /> Add Item
            </button>
          </div>
          <div className="table-responsive"><table>
            <thead><tr><th>Item</th><th>Quantity</th><th>Unit</th><th>Stock Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filterList(inventory).map(i => (
                <tr key={i.id}>
                  <td style={{ fontWeight: 600 }}>{i.item}</td><td>{i.quantity}</td><td>{i.unit}</td>
                  <td>
                    <span style={{ 
                      color: i.stockStatus === 'Low Stock' ? '#ef4444' : '#10b981', 
                      fontWeight: 700,
                      background: i.stockStatus === 'Low Stock' ? '#fee2e2' : '#ecfdf5',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem'
                    }}>
                      {i.stockStatus}
                    </span>
                  </td>
                  <td><div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', gap: '0.35rem' }} 
                      title="Quick Restock" 
                      onClick={() => handleRestock(i.id)}
                    >
                      <RefreshCw size={12} /> Restock
                    </button>
                    <button className="action-btn" title="Edit" onClick={() => { setEditingInv(i); setShowInvModal(true); }}><Edit2 size={15} /></button>
                    <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDelete(i.id, inventory, setInventory, 'Delete item?')}><Trash2 size={15}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}

      {/* MODALS */}
      {showMenuModal && (
        <div className="modal-backdrop" onClick={() => setShowMenuModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingMenu ? 'Edit Menu' : 'Add Menu'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, menuCosting, setMenuCosting, editingMenu, setShowMenuModal)}>
              <div className="form-group"><label>Date</label><input type="text" name="date" defaultValue={editingMenu?.date || '02 Oct 2026'} placeholder="e.g. 02 Oct 2026" required /></div>
              <div className="form-group">
                <label>Meal Category</label>
                <select name="meal" defaultValue={editingMenu?.meal || 'Breakfast'} required>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              <div className="form-group"><label>Menu Items</label><input type="text" name="menu" defaultValue={editingMenu?.menu} placeholder="e.g. Idli, Sambar, Coconut Chutney" required /></div>
              <div className="form-group"><label>Estimated Meal Count</label><input type="number" name="mealCount" defaultValue={editingMenu?.mealCount || 150} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowMenuModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showReqModal && (
        <div className="modal-backdrop" onClick={() => setShowReqModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingReq ? 'Edit Request' : 'Add Request'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, specialRequests, setSpecialRequests, editingReq, setShowReqModal)}>
              <div className="form-group"><label>Tenant</label><input type="text" name="tenant" defaultValue={editingReq?.tenant} required /></div>
              <div className="form-group"><label>Meal</label><input type="text" name="meal" defaultValue={editingReq?.meal} required /></div>
              <div className="form-group"><label>Request</label><input type="text" name="request" defaultValue={editingReq?.request} required /></div>
              <div className="form-group"><label>Date</label><input type="text" name="date" defaultValue={editingReq?.date} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingReq?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowReqModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showCleanModal && (
        <div className="modal-backdrop" onClick={() => setShowCleanModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingClean ? 'Edit Task' : 'Add Task'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, cleaningHygiene, setCleaningHygiene, editingClean, setShowCleanModal)}>
              <div className="form-group"><label>Date</label><input type="text" name="date" defaultValue={editingClean?.date} required /></div>
              <div className="form-group"><label>Cleaning Task</label><input type="text" name="task" defaultValue={editingClean?.task} required /></div>
              <div className="form-group"><label>Status</label><input type="text" name="status" defaultValue={editingClean?.status} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowCleanModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}

      {showInvModal && (
        <div className="modal-backdrop" onClick={() => setShowInvModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h3>{editingInv ? 'Edit Item' : 'Add Item'}</h3></div>
            <form className="modal-form" onSubmit={(e) => handleSave(e, inventory, setInventory, editingInv, setShowInvModal)}>
              <div className="form-group"><label>Item</label><input type="text" name="item" defaultValue={editingInv?.item} required /></div>
              <div className="form-group"><label>Quantity</label><input type="number" name="quantity" defaultValue={editingInv?.quantity} required /></div>
              <div className="form-group"><label>Unit</label><input type="text" name="unit" defaultValue={editingInv?.unit} required /></div>
              <div className="form-group"><label>Stock Status</label><input type="text" name="stockStatus" defaultValue={editingInv?.stockStatus} required /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}><button type="button" className="btn-secondary" onClick={() => setShowInvModal(false)} style={{ flex: 1 }}>Cancel</button><button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button></div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
