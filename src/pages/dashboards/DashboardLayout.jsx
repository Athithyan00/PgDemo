// src/pages/dashboards/DashboardLayout.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Shield, 
  Building, 
  Bell, 
  Search,
  Sun,
  Moon,
  ArrowLeft,
  X,
  Check,
  Info,
  AlertTriangle,
  CheckCircle2,
  Users,
  BedDouble,
  FileText,
  DollarSign,
  Coffee,
  Calendar,
  Building2,
  ChevronRight,
  Layers
} from 'lucide-react';
import './DashboardLayout.css';

export default function DashboardLayout({
  title,
  subtitle,
  roleThemeColor = '#2563eb',
  sidebarItems = [],
  activeTabKey = 'overview',
  bgImage,
  onBack,
  children
}) {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const dataContext = useData();
  const navigate = useNavigate();

  const searchQuery = dataContext?.searchQuery || '';
  const setSearchQuery = dataContext?.setSearchQuery || (() => {});

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const notifWrapperRef = useRef(null);

  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Tenant Enrolled', desc: 'Rahul S has checked in to Room 204-B.', time: '10 mins ago', read: false, type: 'info' },
    { id: 2, title: 'Rent Payment Received', desc: 'Received ₹10,800 via UPI payment.', time: '1 hour ago', read: false, type: 'success' },
    { id: 3, title: 'Maintenance Complaint', desc: 'Water tap leak reported in Room 302.', time: '3 hours ago', read: false, type: 'warning' },
    { id: 4, title: 'Visitor Arrived', desc: 'Guest Suresh K arrived at main gate.', time: '4 hours ago', read: true, type: 'info' }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (notifWrapperRef.current && !notifWrapperRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Keyboard shortcuts: '/' or 'Ctrl+K' for search, 'Backspace' for onBack
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
      
      // Ctrl+K or '/' to focus search
      if ((e.key === '/' && !isInput) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }

      // Escape to close search
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }

      // Backspace navigation only when user is not typing
      if (e.key === 'Backspace' && !isInput && activeTabKey !== 'overview') {
        if (onBack) {
          onBack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabKey, onBack]);

  const handleLogout = () => {
    logout();
    navigate('/login/superadmin');
  };

  // Search indexing and filtering across current context
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    // 1. Navigation Modules matching
    const matchingModules = sidebarItems
      .filter(item => item.label.toLowerCase().includes(q))
      .map(item => ({
        type: 'module',
        title: item.label,
        subtitle: 'Navigation Module',
        icon: item.icon || <Layers size={16} />,
        action: () => {
          item.onClick();
          setIsSearchOpen(false);
        }
      }));

    // Helper to find navigation tab for an entity
    const findTabAction = (keywords, fallbackSearch) => {
      const match = sidebarItems.find(item => 
        keywords.some(k => item.label.toLowerCase().includes(k))
      );
      if (match) {
        return () => {
          match.onClick();
          setIsSearchOpen(false);
        };
      }
      return () => {
        setIsSearchOpen(false);
      };
    };

    // 2. Tenants matching
    const matchingTenants = (dataContext?.tenantsData || [])
      .filter(t => 
        t.name?.toLowerCase().includes(q) || 
        t.room?.toLowerCase().includes(q) ||
        t.phone?.includes(q) ||
        t.status?.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map(t => ({
        type: 'tenant',
        title: t.name,
        subtitle: `Room ${t.room} (Bed ${t.bed || 'A'}) • ${t.phone || ''} • Status: ${t.status}`,
        icon: <Users size={16} color="#2563eb" />,
        action: () => {
          findTabAction(['tenant', 'tenants', 'resident'])();
        }
      }));

    // 3. Rooms matching
    const matchingRooms = (dataContext?.roomsData || [])
      .filter(r => 
        r.roomNumber?.toString().toLowerCase().includes(q) || 
        r.roomType?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q) ||
        r.floor?.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map(r => ({
        type: 'room',
        title: `Room ${r.roomNumber}`,
        subtitle: `${r.floor || ''} • ${r.roomType || ''} • Available Beds: ${r.availableBeds ?? r.available ?? 0} • Status: ${r.status}`,
        icon: <BedDouble size={16} color="#10b981" />,
        action: () => {
          findTabAction(['room', 'bed'])();
        }
      }));

    // 4. Complaints & Requests matching
    const matchingComplaints = (dataContext?.complaintsData || [])
      .filter(c => 
        c.description?.toLowerCase().includes(q) || 
        c.category?.toLowerCase().includes(q) ||
        c.tenant?.toLowerCase().includes(q) ||
        c.status?.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map(c => ({
        type: 'complaint',
        title: `${c.category || 'Complaint'}: ${c.description}`,
        subtitle: `Tenant: ${c.tenant || 'Resident'} • Room ${c.room || ''} • Status: ${c.status}`,
        icon: <AlertTriangle size={16} color="#ef4444" />,
        action: () => {
          findTabAction(['complaint', 'ticket'])();
        }
      }));

    // 5. Invoices & Finance matching
    const matchingFinance = (dataContext?.invoiceData || dataContext?.financeData || [])
      .filter(f => 
        f.tenant?.toLowerCase().includes(q) || 
        f.invoiceNumber?.toLowerCase().includes(q) ||
        f.amount?.toString().toLowerCase().includes(q) ||
        f.status?.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map(f => ({
        type: 'finance',
        title: `${f.invoiceNumber ? f.invoiceNumber + ' - ' : ''}${f.tenant || 'Payment'}`,
        subtitle: `Amount: ${f.amount || f.total} • Due: ${f.dueDate || f.paymentDate || ''} • Status: ${f.status}`,
        icon: <DollarSign size={16} color="#10b981" />,
        action: () => {
          findTabAction(['finance', 'invoice', 'billing', 'revenue', 'rent'])();
        }
      }));

    // 6. Staff matching
    const matchingStaff = (dataContext?.staffData || [])
      .filter(s => 
        s.name?.toLowerCase().includes(q) || 
        s.role?.toLowerCase().includes(q) ||
        s.shift?.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map(s => ({
        type: 'staff',
        title: s.name,
        subtitle: `Role: ${s.role} • Shift: ${s.shift} • Phone: ${s.phone}`,
        icon: <Users size={16} color="#8b5cf6" />,
        action: () => {
          findTabAction(['staff', 'directory', 'employee'])();
        }
      }));

    // 7. PG Onboarding matching
    const matchingPGs = (dataContext?.pgList || [])
      .filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.owner?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map(p => ({
        type: 'pg',
        title: p.name,
        subtitle: `Owner: ${p.owner} • ${p.address} • ${p.totalRooms || 0} Rooms`,
        icon: <Building2 size={16} color="#0284c7" />,
        action: () => {
          findTabAction(['pg', 'onboarding'])();
        }
      }));

    // 8. Inventory / Food matching
    const matchingInventory = (dataContext?.inventory || [])
      .filter(i => 
        i.item?.toLowerCase().includes(q) || 
        i.stockStatus?.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map(i => ({
        type: 'inventory',
        title: i.item,
        subtitle: `Quantity: ${i.quantity} ${i.unit} • Stock Status: ${i.stockStatus}`,
        icon: <Coffee size={16} color="#f59e0b" />,
        action: () => {
          findTabAction(['kitchen', 'inventory', 'food', 'mess'])();
        }
      }));

    return {
      modules: matchingModules,
      tenants: matchingTenants,
      rooms: matchingRooms,
      complaints: matchingComplaints,
      finance: matchingFinance,
      staff: matchingStaff,
      pgs: matchingPGs,
      inventory: matchingInventory,
      totalCount: (
        matchingModules.length +
        matchingTenants.length +
        matchingRooms.length +
        matchingComplaints.length +
        matchingFinance.length +
        matchingStaff.length +
        matchingPGs.length +
        matchingInventory.length
      )
    };
  }, [searchQuery, sidebarItems, dataContext]);

  return (
    <div className="dashboard-container" style={{ '--theme-color': roleThemeColor }}>
      {bgImage && (
        <div 
          className="dashboard-bg-overlay"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="brand-badge-icon" style={{ backgroundColor: roleThemeColor }}>
            <Building size={20} color="#ffffff" />
          </div>
          <div>
            <h3>ArcNio</h3>
            <span className="brand-role-tag">{user?.roleTitle || user?.role?.toUpperCase()}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation Modules</div>
          {sidebarItems.map((item, idx) => (
            <button
              key={idx}
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={item.onClick || (() => {})}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && <span className="nav-item-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-user-footer">
          <div className="user-avatar-box">
            <img src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={user?.name} />
            <div className="online-indicator"></div>
          </div>
          <div className="user-info-text">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email || user?.username}</span>
          </div>
          <button className="logout-icon-btn" onClick={handleLogout} title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        {/* HEADER BAR */}
        <header className="dashboard-header">
          <div className="header-titles">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {activeTabKey !== 'overview' && onBack && (
                <button 
                  type="button" 
                  className="back-nav-btn"
                  onClick={onBack}
                  title="Back to Overview (or press Backspace)"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div>
                <h1>{title}</h1>
                <p>{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="header-actions">
            {/* INTERACTIVE WORKING SEARCH BAR & SPOTLIGHT DROPDOWN */}
            <div className="header-search-wrapper" ref={searchWrapperRef}>
              <div className={`header-search ${isSearchOpen ? 'active' : ''}`}>
                <Search size={16} />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!isSearchOpen) setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search modules, records (Ctrl+K)..." 
                />
                {searchQuery ? (
                  <button 
                    type="button"
                    className="search-clear-btn"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <span className="search-shortcut-badge">/</span>
                )}
              </div>

              {/* LIVE SEARCH DROPDOWN RESULTS */}
              {isSearchOpen && searchQuery.trim() && searchResults && (
                <div className="search-spotlight-dropdown">
                  <div className="search-spotlight-header">
                    <span>Search results for <strong>"{searchQuery}"</strong></span>
                    <span className="search-match-count">{searchResults.totalCount} found</span>
                  </div>

                  <div className="search-spotlight-body">
                    {searchResults.totalCount === 0 ? (
                      <div className="search-spotlight-empty">
                        <AlertTriangle size={24} style={{ color: 'var(--dash-muted)', margin: '0 auto 0.5rem' }} />
                        <p>No matching modules or records found</p>
                        <span>Try searching for tenant names, room numbers, or modules</span>
                      </div>
                    ) : (
                      <>
                        {/* Modules Category */}
                        {searchResults.modules.length > 0 && (
                          <div className="search-group">
                            <div className="search-group-title">Navigation Modules</div>
                            {searchResults.modules.map((res, i) => (
                              <div key={i} className="search-result-item" onClick={res.action}>
                                <div className="result-icon-box">{res.icon}</div>
                                <div className="result-info">
                                  <div className="result-title">{res.title}</div>
                                  <div className="result-sub">{res.subtitle}</div>
                                </div>
                                <span className="jump-tag">Jump <ChevronRight size={12} /></span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tenants Category */}
                        {searchResults.tenants.length > 0 && (
                          <div className="search-group">
                            <div className="search-group-title">Tenants</div>
                            {searchResults.tenants.map((res, i) => (
                              <div key={i} className="search-result-item" onClick={res.action}>
                                <div className="result-icon-box">{res.icon}</div>
                                <div className="result-info">
                                  <div className="result-title">{res.title}</div>
                                  <div className="result-sub">{res.subtitle}</div>
                                </div>
                                <span className="jump-tag">View <ChevronRight size={12} /></span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Rooms Category */}
                        {searchResults.rooms.length > 0 && (
                          <div className="search-group">
                            <div className="search-group-title">Rooms & Beds</div>
                            {searchResults.rooms.map((res, i) => (
                              <div key={i} className="search-result-item" onClick={res.action}>
                                <div className="result-icon-box">{res.icon}</div>
                                <div className="result-info">
                                  <div className="result-title">{res.title}</div>
                                  <div className="result-sub">{res.subtitle}</div>
                                </div>
                                <span className="jump-tag">View <ChevronRight size={12} /></span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Complaints Category */}
                        {searchResults.complaints.length > 0 && (
                          <div className="search-group">
                            <div className="search-group-title">Complaints & Requests</div>
                            {searchResults.complaints.map((res, i) => (
                              <div key={i} className="search-result-item" onClick={res.action}>
                                <div className="result-icon-box">{res.icon}</div>
                                <div className="result-info">
                                  <div className="result-title">{res.title}</div>
                                  <div className="result-sub">{res.subtitle}</div>
                                </div>
                                <span className="jump-tag">View <ChevronRight size={12} /></span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Finance Category */}
                        {searchResults.finance.length > 0 && (
                          <div className="search-group">
                            <div className="search-group-title">Finance & Invoices</div>
                            {searchResults.finance.map((res, i) => (
                              <div key={i} className="search-result-item" onClick={res.action}>
                                <div className="result-icon-box">{res.icon}</div>
                                <div className="result-info">
                                  <div className="result-title">{res.title}</div>
                                  <div className="result-sub">{res.subtitle}</div>
                                </div>
                                <span className="jump-tag">View <ChevronRight size={12} /></span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Staff Category */}
                        {searchResults.staff.length > 0 && (
                          <div className="search-group">
                            <div className="search-group-title">Staff & Directory</div>
                            {searchResults.staff.map((res, i) => (
                              <div key={i} className="search-result-item" onClick={res.action}>
                                <div className="result-icon-box">{res.icon}</div>
                                <div className="result-info">
                                  <div className="result-title">{res.title}</div>
                                  <div className="result-sub">{res.subtitle}</div>
                                </div>
                                <span className="jump-tag">View <ChevronRight size={12} /></span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* PGs Category */}
                        {searchResults.pgs.length > 0 && (
                          <div className="search-group">
                            <div className="search-group-title">Properties & PGs</div>
                            {searchResults.pgs.map((res, i) => (
                              <div key={i} className="search-result-item" onClick={res.action}>
                                <div className="result-icon-box">{res.icon}</div>
                                <div className="result-info">
                                  <div className="result-title">{res.title}</div>
                                  <div className="result-sub">{res.subtitle}</div>
                                </div>
                                <span className="jump-tag">View <ChevronRight size={12} /></span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Inventory Category */}
                        {searchResults.inventory.length > 0 && (
                          <div className="search-group">
                            <div className="search-group-title">Kitchen & Consumables</div>
                            {searchResults.inventory.map((res, i) => (
                              <div key={i} className="search-result-item" onClick={res.action}>
                                <div className="result-icon-box">{res.icon}</div>
                                <div className="result-info">
                                  <div className="result-title">{res.title}</div>
                                  <div className="result-sub">{res.subtitle}</div>
                                </div>
                                <span className="jump-tag">View <ChevronRight size={12} /></span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="search-spotlight-footer">
                    <span>Press <kbd>Esc</kbd> to exit • Click result to navigate directly</span>
                  </div>
                </div>
              )}
            </div>

            {/* NOTIFICATION BELL WITH DROPDOWN PANEL */}
            <div className="notification-wrapper" ref={notifWrapperRef}>
              <button 
                className="header-btn notifications-btn" 
                title="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="notif-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Bell size={16} style={{ color: roleThemeColor }} />
                      <span className="notif-title">System Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button className="mark-read-btn" onClick={markAllRead}>
                        <Check size={14} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">No unread notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                          <div className="notif-icon">
                            {n.type === 'success' && <CheckCircle2 size={16} color="#16a34a" />}
                            {n.type === 'warning' && <AlertTriangle size={16} color="#d97706" />}
                            {n.type === 'info' && <Info size={16} color="#2563eb" />}
                          </div>
                          <div className="notif-body">
                            <div className="notif-item-title">{n.title}</div>
                            <div className="notif-item-desc">{n.desc}</div>
                            <div className="notif-item-time">{n.time}</div>
                          </div>
                          <button className="notif-close" onClick={() => removeNotification(n.id)}>
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* DARK / LIGHT THEME TOGGLE BUTTON */}
            <button 
              className="header-btn theme-header-btn" 
              onClick={toggleTheme} 
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#0f172a" />}
            </button>

            <div className="role-status-chip" style={{ backgroundColor: `${roleThemeColor}15`, color: roleThemeColor, border: `1px solid ${roleThemeColor}30` }}>
              <Shield size={14} />
              <span>{user?.role?.toUpperCase()} ACTIVE</span>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="dashboard-body">
          {children}
        </div>
      </main>
    </div>
  );
}

