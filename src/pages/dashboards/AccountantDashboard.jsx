// src/pages/dashboards/AccountantDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import managerBg from '../../assets/employee_login_bg.jpg';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  DollarSign, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Receipt, 
  PieChart, 
  Plus, 
  Eye, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Download,
  Check,
  ShieldCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AccountantDashboard() {
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
  const roleThemeColor = '#10b981'; // green for accountant

  // Modal States
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Data States
  const { invoiceData, setInvoiceData } = dataContext;
  const { paymentsData, setPaymentsData } = dataContext;
  const { expensesData, setExpensesData } = dataContext;
  const { depositsData, setDepositsData } = dataContext;

  // Filtered Data according to searchQuery
  const filteredInvoices = invoiceData.filter(i => {
    const q = searchQuery.toLowerCase();
    return !q || i.tenant?.toLowerCase().includes(q) || i.invoiceNumber?.toLowerCase().includes(q) || i.status?.toLowerCase().includes(q) || i.month?.toLowerCase().includes(q) || i.total?.toLowerCase().includes(q);
  });

  const filteredPayments = paymentsData.filter(p => {
    const q = searchQuery.toLowerCase();
    return !q || p.tenant?.toLowerCase().includes(q) || p.amount?.toLowerCase().includes(q) || p.method?.toLowerCase().includes(q) || p.mode?.toLowerCase().includes(q) || p.status?.toLowerCase().includes(q);
  });

  const filteredExpenses = expensesData.filter(e => {
    const q = searchQuery.toLowerCase();
    return !q || e.type?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q) || e.amount?.toLowerCase().includes(q);
  });

  const filteredDeposits = depositsData.filter(d => {
    const q = searchQuery.toLowerCase();
    return !q || d.tenant?.toLowerCase().includes(q) || d.depositAmount?.toLowerCase().includes(q) || d.status?.toLowerCase().includes(q);
  });

  const chartData = [
    { name: 'Mon', revenue: 4000, expenses: 2400 },
    { name: 'Tue', revenue: 3000, expenses: 1398 },
    { name: 'Wed', revenue: 2000, expenses: 9800 },
    { name: 'Thu', revenue: 2780, expenses: 3908 },
    { name: 'Fri', revenue: 1890, expenses: 4800 },
    { name: 'Sat', revenue: 2390, expenses: 3800 },
    { name: 'Sun', revenue: 3490, expenses: 4300 },
  ];

  const sidebarItems = [
    { icon: <PieChart size={18} />, label: 'Overview', active: activeTab === 'overview', onClick: () => setActiveTab('overview') },
    { icon: <FileText size={18} />, label: 'Invoice & Billing', active: activeTab === 'invoices', onClick: () => setActiveTab('invoices') },
    { icon: <CreditCard size={18} />, label: 'Payments & Revenue', active: activeTab === 'payments', onClick: () => setActiveTab('payments') },
    { icon: <Receipt size={18} />, label: 'Operating Expenses', active: activeTab === 'expenses', onClick: () => setActiveTab('expenses') },
    { icon: <DollarSign size={18} />, label: 'Security Deposit & Refunds', active: activeTab === 'deposits', onClick: () => setActiveTab('deposits') },
    { icon: <TrendingUp size={18} />, label: 'Financial Profit & Loss', active: activeTab === 'pnl', onClick: () => setActiveTab('pnl') }
  ];

  const openAddInvoice = () => { setEditingInvoice(null); setShowInvoiceModal(true); };
  const openEditInvoice = (inv) => { setEditingInvoice(inv); setShowInvoiceModal(true); };
  const handleSaveInvoice = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const item = {
      id: editingInvoice ? editingInvoice.id : Date.now(),
      invoiceNumber: editingInvoice ? editingInvoice.invoiceNumber : `INV-${1000 + invoiceData.length + 1}`,
      tenant: fd.get('tenant'), 
      month: fd.get('month'), 
      rent: fd.get('rent'), 
      total: fd.get('total'), 
      amount: fd.get('total'), 
      dueDate: fd.get('dueDate'), 
      status: fd.get('status')
    };
    if (editingInvoice) setInvoiceData(invoiceData.map(x => x.id === editingInvoice.id ? item : x));
    else setInvoiceData([...invoiceData, item]);
    setShowInvoiceModal(false);
  };
  const handleDeleteInvoice = (id) => { if (window.confirm("Delete invoice?")) setInvoiceData(invoiceData.filter(x => x.id !== id)); };

  const handleMarkInvoicePaid = (id) => {
    setInvoiceData(invoiceData.map(x => x.id === id ? { ...x, status: 'Paid' } : x));
  };

  const openAddExpense = () => { setEditingExpense(null); setShowExpenseModal(true); };
  const openEditExpense = (exp) => { setEditingExpense(exp); setShowExpenseModal(true); };
  const handleSaveExpense = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const item = {
      id: editingExpense ? editingExpense.id : Date.now(),
      type: fd.get('type'), 
      category: fd.get('type'), 
      amount: fd.get('amount'), 
      date: fd.get('date'), 
      description: fd.get('description'),
      status: 'Cleared'
    };
    if (editingExpense) setExpensesData(expensesData.map(x => x.id === editingExpense.id ? item : x));
    else setExpensesData([...expensesData, item]);
    setShowExpenseModal(false);
  };
  const handleDeleteExpense = (id) => { if (window.confirm("Delete expense?")) setExpensesData(expensesData.filter(x => x.id !== id)); };

  const handleProcessDepositRefund = (id) => {
    if (window.confirm("Process full security deposit refund for this resident?")) {
      setDepositsData(depositsData.map(d => d.id === id ? { ...d, status: 'Refund Cleared', refundAmount: d.depositAmount, refundStatus: 'Processed' } : d));
    }
  };

  const handleExportFinancials = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Report Type,Metric,Amount", 
         "P&L,Total Invoiced Revenue,₹845000", 
         "P&L,Operating Expenses,₹230000", 
         "P&L,Net Operating Profit,₹615000",
         ...invoiceData.map(i => `Invoice,"${i.tenant} - ${i.invoiceNumber}",${i.total}`)
        ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ArcNio_Financial_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout
      title="Accountant Dashboard"
      subtitle="Financial overview, invoicing, receivables, and profit/loss management"
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
            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('payments')}>
              <div className="metric-icon-box" style={{color: roleThemeColor}}><DollarSign size={28}/></div>
              <div className="metric-details"><h4>Today's Collection</h4><div className="metric-value">₹12,500</div><div className="metric-change positive">100% on schedule</div></div>
            </div>
            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('invoices')}>
              <div className="metric-icon-box" style={{color: '#f59e0b'}}><FileText size={28}/></div>
              <div className="metric-details"><h4>Pending Rent</h4><div className="metric-value">₹17,700</div><div className="metric-change neutral">2 Invoices Pending</div></div>
            </div>
            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('expenses')}>
              <div className="metric-icon-box" style={{color: '#ef4444'}}><Receipt size={28}/></div>
              <div className="metric-details"><h4>Monthly Expenses</h4><div className="metric-value">₹19,200</div><div className="metric-change positive">Within operating budget</div></div>
            </div>
            <div className="metric-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('pnl')}>
              <div className="metric-icon-box" style={{color: '#2563eb'}}><TrendingUp size={28}/></div>
              <div className="metric-details"><h4>Net Operating Revenue</h4><div className="metric-value">₹8,45,000</div><div className="metric-change positive">+14% vs last quarter</div></div>
            </div>
          </div>

          <div className="dashboard-section-card" style={{ padding: '2rem' }}>
             <div className="section-header">
                <h3>Weekly Revenue vs Expenses</h3>
                <button className="btn-primary" onClick={handleExportFinancials}><Download size={16} /> Export Statement</button>
             </div>
             <div style={{ width: '100%', height: 300, marginTop: '1.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--dash-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--dash-muted)'}} />
                    <Tooltip cursor={{fill: 'var(--dash-subcard-bg)'}} contentStyle={{borderRadius: '8px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-bg)', color: 'var(--dash-text)'}} />
                    <Bar dataKey="revenue" fill={roleThemeColor} radius={[6, 6, 0, 0]} name="Collections" />
                    <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="Operating Costs" />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </>
      )}

      {/* INVOICE & BILLING */}
      {activeTab === 'invoices' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Invoice & Billing</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleExportFinancials} className="btn-secondary"><Download size={16} /> Export Invoices</button>
              <button onClick={openAddInvoice} className="btn-primary"><Plus size={16} /> Create Invoice</button>
            </div>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Invoice #</th><th>Tenant</th><th>Billing Month</th><th>Base Rent</th><th>Total Due</th><th>Due Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredInvoices.map(i => (
                  <tr key={i.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{i.invoiceNumber || `INV-100${i.id}`}</td>
                    <td style={{ fontWeight: 600 }}>{i.tenant}</td>
                    <td>{i.month || 'October 2026'}</td>
                    <td>{i.rent || i.amount}</td>
                    <td style={{ fontWeight: 800 }}>{i.total || i.amount}</td>
                    <td>{i.dueDate}</td>
                    <td>
                      <span style={{ 
                        color: i.status === 'Paid' ? '#10b981' : '#f59e0b', 
                        fontWeight: 700, 
                        background: i.status === 'Paid' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', 
                        padding: '4px 8px', 
                        borderRadius: '6px' 
                      }}>
                        {i.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" title="View Receipt" onClick={() => setViewingInvoice(i)}><Eye size={15} /></button>
                        {i.status !== 'Paid' && (
                          <button className="action-btn" title="Mark as Paid" style={{ color: '#10b981' }} onClick={() => handleMarkInvoicePaid(i.id)}>
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                        <button className="action-btn" title="Edit" onClick={() => openEditInvoice(i)}><Edit2 size={15} /></button>
                        <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDeleteInvoice(i.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAYMENTS & REVENUE */}
      {activeTab === 'payments' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Payments & Received Transactions</h3>
            <button className="btn-primary" onClick={handleExportFinancials}><Download size={16} /> Export Records</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Transaction ID</th><th>Tenant</th><th>Amount</th><th>Payment Method</th><th>Payment Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filteredPayments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.paymentId || `PAY-${p.id}82`}</td>
                    <td style={{ fontWeight: 600 }}>{p.tenant}</td>
                    <td style={{ fontWeight: 800, color: '#10b981' }}>{p.amount}</td>
                    <td><span style={{ background: 'var(--dash-subcard-bg)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>{p.method || p.mode || 'UPI'}</span></td>
                    <td>{p.date}</td>
                    <td><span style={{ color: '#10b981', fontWeight: 700 }}>✓ {p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OPERATING EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="dashboard-section-card">
          <div className="section-header">
             <h3>Operating Expenses & Disbursements</h3>
             <button onClick={openAddExpense} className="btn-primary"><Plus size={16} /> Record Expense</button>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Expense Category</th><th>Amount</th><th>Date</th><th>Description</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredExpenses.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 600 }}>{e.type || e.category}</td>
                    <td style={{ fontWeight: 800, color: '#ef4444' }}>{e.amount}</td>
                    <td>{e.date}</td>
                    <td>{e.description}</td>
                    <td><span style={{ color: '#10b981', fontWeight: 700 }}>{e.status || 'Cleared'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" title="Edit" onClick={() => openEditExpense(e)}><Edit2 size={15} /></button>
                        <button className="action-btn" title="Delete" style={{ color: '#ef4444' }} onClick={() => handleDeleteExpense(e.id)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECURITY DEPOSIT & REFUNDS */}
      {activeTab === 'deposits' && (
        <div className="dashboard-section-card">
          <div className="section-header"><h3>Security Deposits & Escrow Ledger</h3></div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr><th>Tenant</th><th>Deposit Held</th><th>Refunded Amount</th><th>Deposit Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredDeposits.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.tenant}</td>
                    <td style={{ fontWeight: 800 }}>{d.depositAmount || d.amount}</td>
                    <td>{d.refundAmount || '₹0'}</td>
                    <td>{d.depositDate || '01 Aug 2026'}</td>
                    <td>
                      <span style={{ 
                        color: d.status?.includes('Cleared') || d.status?.includes('Refunded') ? '#10b981' : '#0ea5e9', 
                        fontWeight: 700,
                        background: 'var(--dash-subcard-bg)',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        {d.status || d.refundStatus || 'Held'}
                      </span>
                    </td>
                    <td>
                      {d.status !== 'Refund Cleared' && (
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                          onClick={() => handleProcessDepositRefund(d.id)}
                        >
                          Process Refund
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

      {/* FINANCIAL PROFIT & LOSS */}
      {activeTab === 'pnl' && (
        <div className="dashboard-section-card">
          <div className="section-header">
            <h3>Financial Profit & Loss Statement</h3>
            <button className="btn-primary" onClick={handleExportFinancials}><Download size={16} /> Export Statement</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'var(--dash-subcard-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--dash-border)' }}>
              <div style={{ color: 'var(--dash-muted)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase' }}>Gross Operating Revenue</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: '#10b981' }}>₹8,45,000</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>From room rents, amenities, and meal plans</span>
            </div>
            <div style={{ background: 'var(--dash-subcard-bg)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--dash-border)' }}>
              <div style={{ color: 'var(--dash-muted)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase' }}>Total Operating Expenses</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: '#ef4444' }}>₹2,30,000</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--dash-muted)' }}>Staff payroll, utilities, repairs & groceries</span>
            </div>
            <div style={{ background: 'var(--dash-subcard-bg)', padding: '2rem', borderRadius: '16px', border: '2px solid #10b981', boxShadow: '0 10px 20px rgba(16,185,129,0.1)' }}>
              <div style={{ color: 'var(--dash-muted)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase' }}>Net Operating Profit</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.5rem', color: '#10b981' }}>₹6,15,000</div>
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>+72.8% Net Margin</span>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="modal-backdrop" onClick={() => setShowInvoiceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveInvoice}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group"><label>Tenant Name</label><input type="text" name="tenant" defaultValue={editingInvoice?.tenant} required /></div>
                <div className="form-group"><label>Billing Month</label><input type="text" name="month" defaultValue={editingInvoice?.month || 'October 2026'} required /></div>
                <div className="form-group"><label>Base Rent</label><input type="text" name="rent" defaultValue={editingInvoice?.rent || '₹10,800'} required /></div>
                <div className="form-group"><label>Total Amount Due</label><input type="text" name="total" defaultValue={editingInvoice?.total || '₹10,800'} required /></div>
                <div className="form-group"><label>Due Date</label><input type="date" name="dueDate" defaultValue={editingInvoice?.dueDate ? '2026-10-05' : '2026-10-05'} required /></div>
                <div className="form-group">
                   <label>Payment Status</label>
                   <select name="status" defaultValue={editingInvoice?.status || 'Pending'}>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                   </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowInvoiceModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{editingInvoice ? 'Save Changes' : 'Issue Invoice'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="modal-backdrop" onClick={() => setShowExpenseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
               <h3>{editingExpense ? 'Edit Expense Record' : 'Record Operating Expense'}</h3>
            </div>
            <form className="modal-form" onSubmit={handleSaveExpense}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group"><label>Expense Category</label><input type="text" name="type" defaultValue={editingExpense?.type || editingExpense?.category} placeholder="e.g. Utilities, Maintenance" required /></div>
                <div className="form-group"><label>Amount (₹)</label><input type="text" name="amount" defaultValue={editingExpense?.amount} placeholder="e.g. ₹2,500" required /></div>
                <div className="form-group"><label>Date</label><input type="date" name="date" defaultValue={editingExpense?.date ? '2026-10-02' : '2026-10-02'} required /></div>
              </div>
              <div className="form-group"><label>Description / Vendor Details</label><textarea name="description" defaultValue={editingExpense?.description} rows="3" required></textarea></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowExpenseModal(false)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{editingExpense ? 'Save Changes' : 'Record Expense'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW INVOICE RECEIPT MODAL */}
      {viewingInvoice && (
        <div className="modal-backdrop" onClick={() => setViewingInvoice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invoice Receipt</h3>
              <p>{viewingInvoice.invoiceNumber || `INV-100${viewingInvoice.id}`} • ArcNio PG Management</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }}>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Tenant Name</span><div style={{ fontWeight: 700 }}>{viewingInvoice.tenant}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Billing Month</span><div style={{ fontWeight: 700 }}>{viewingInvoice.month || 'October 2026'}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Due Date</span><div style={{ fontWeight: 600 }}>{viewingInvoice.dueDate}</div></div>
              <div><span style={{ color: 'var(--dash-muted)', fontSize: '0.8rem' }}>Payment Status</span><div><span style={{ color: viewingInvoice.status === 'Paid' ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{viewingInvoice.status}</span></div></div>
            </div>
            <div style={{ marginTop: '1.5rem', background: 'var(--dash-subcard-bg)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--dash-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--dash-border)' }}>
                <span>Monthly Rent & Accommodation</span>
                <span style={{ fontWeight: 700 }}>{viewingInvoice.rent || viewingInvoice.amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', fontWeight: 800, fontSize: '1.1rem' }}>
                <span>Total Amount Due</span>
                <span style={{ color: '#10b981' }}>{viewingInvoice.total || viewingInvoice.amount}</span>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="btn-secondary" onClick={() => alert(`Downloading invoice PDF for ${viewingInvoice.tenant}...`)}>
                <Download size={16} /> Download PDF
              </button>
              <button className="btn-primary" onClick={() => setViewingInvoice(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
