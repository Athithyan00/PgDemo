// src/components/LoginLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { validateIdentifier, validatePassword, authService } from '../services/authService';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  KeyRound, 
  CheckCircle, 
  Lock, 
  User, 
  X, 
  Building2, 
  ShieldCheck, 
  Home, 
  AlertTriangle,
  Server,
  Briefcase,
  Crown,
  Sun,
  Moon,
  DollarSign,
  Shield,
  Utensils
} from 'lucide-react';
import './LoginLayout.css';

export default function LoginLayout({
  role,
  badgeText,
  heading,
  subtitle,
  description,
  features,
  loginDescription,
  primaryColor,
  bgImage,
  sloganText,
  usernameLabel = "Email / Phone",
  rolesList = [],
  activeRoleKey,
  onSelectRole,
  demoCredentials = { email: "user@arcnio.com", pass: "password123" }
}) {
  const { login } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Employee Sub-Role State
  const [activeSubRole, setActiveSubRole] = useState('manager');
  
  // Validation & Error States
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Update demo credentials based on active role & sub-role
  const currentDemo = activeRoleKey === 'employee' ? {
    accountant: { email: "accountant@arcnio.com", pass: "accountant123" },
    manager: { email: "manager@arcnio.com", pass: "manager123" },
    security: { email: "security@arcnio.com", pass: "security123" },
    kitchen: { email: "kitchen@arcnio.com", pass: "kitchen123" }
  }[activeSubRole] : demoCredentials;

  // Restore remembered username on role switch
  useEffect(() => {
    const targetKey = activeRoleKey === 'employee' ? activeSubRole : activeRoleKey;
    const remembered = authService.getRememberedUser(targetKey);
    if (remembered) {
      setUsername(remembered);
      setRememberMe(true);
    } else {
      setUsername(currentDemo.email);
      setPassword(currentDemo.pass);
      setRememberMe(false);
    }
    setUsernameError('');
    setPasswordError('');
    setLoginError('');
  }, [activeRoleKey, activeSubRole]);

  const handleFillDemo = () => {
    setUsername(currentDemo.email);
    setPassword(currentDemo.pass);
    setUsernameError('');
    setPasswordError('');
    setLoginError('');
  };

  const handleUsernameChange = (e) => {
    const val = e.target.value;
    setUsername(val);
    if (usernameError) {
      const res = validateIdentifier(val);
      if (res.isValid) setUsernameError('');
    }
    if (loginError) setLoginError('');
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordError) {
      const res = validatePassword(val);
      if (res.isValid) setPasswordError('');
    }
    if (loginError) setLoginError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    const idRes = validateIdentifier(username);
    const passRes = validatePassword(password);

    if (!idRes.isValid) setUsernameError(idRes.message);
    else setUsernameError('');

    if (!passRes.isValid) setPasswordError(passRes.message);
    else setPasswordError('');

    if (!idRes.isValid || !passRes.isValid) return;

    setIsSubmitting(true);

    try {
      const res = await login({
        roleKey: activeRoleKey,
        subRoleKey: activeRoleKey === 'employee' ? activeSubRole : null,
        identifier: username,
        password,
        rememberMe
      });

      setIsSubmitting(false);

      if (res.success) {
        setLoginSuccessMessage(`Authenticated successfully! Redirecting...`);
        setTimeout(() => {
          navigate(res.redirectPath, { replace: true });
        }, 400);
      } else {
        setLoginError(res.error);
      }
    } catch {
      setIsSubmitting(false);
      setLoginError('An unexpected authentication error occurred. Please try again.');
    }
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    const valRes = validateIdentifier(forgotEmail);
    if (!valRes.isValid) {
      setForgotEmailError(valRes.message);
      return;
    }
    setForgotEmailError('');
    setForgotSubmitted(true);
    setTimeout(() => {
      setForgotSubmitted(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 2400);
  };

  const primaryRoleIcons = {
    superadmin: <Server size={15} />,
    admin: <Crown size={15} />,
    employee: <Briefcase size={15} />,
    tenant: <Home size={15} />
  };

  return (
    <div className="login-container" style={{ '--primary-color': primaryColor }}>
      {/* LEFT PANEL */}
      <div className="login-left-panel">
        <img src={bgImage} alt={`${role} Background`} className="login-bg-image" />
        <div className="login-overlay"></div>
        
        <div className="login-left-content">
          <div className="login-brand">
            <div className="brand-logo-badge">
              <div className="brand-icon-box" style={{ backgroundColor: primaryColor }}>
                <Building2 size={20} color="#ffffff" />
              </div>
              <div>
                <span className="brand-name">ArcNio</span>
                <span className="brand-subtitle">PG Management System</span>
              </div>
            </div>
          </div>
          
          <div className="login-role-info">
            <h2>{heading}</h2>
            {subtitle && <h3 className="login-tagline">{subtitle}</h3>}
            <p>{description}</p>
            
            <div className="login-features">
              {features.map((feature, index) => (
                <div key={index} className="login-feature-item">
                  <div className="feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <span className="feature-text">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="login-left-footer">
            {sloganText && <div className="handwritten-slogan">{sloganText}</div>}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right-panel">
        {/* THEME TOGGLE BUTTON AT TOP RIGHT CORNER */}
        <button 
          type="button" 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#0f172a" />}
        </button>

        <div className="login-form-container">
          
          {/* TOP LEFT ROLE SELECTOR TABS BAR */}
          <div className="top-left-roles-header">
            <span className="roles-nav-title">Select Portal:</span>
            <div className="role-selector-bar top-left-bar">
              {rolesList.map((r) => {
                const isActive = r.key === activeRoleKey;
                return (
                  <button
                    key={r.key}
                    type="button"
                    className={`role-tab ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (onSelectRole) onSelectRole(r.key);
                      navigate(`/login/${r.key}`);
                    }}
                    style={isActive ? { backgroundColor: primaryColor, color: '#ffffff' } : {}}
                  >
                    {primaryRoleIcons[r.key] || <ShieldCheck size={15} />}
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DE-CONGESTED EMPLOYEE DIVISION SUB-ROLE SELECTOR */}
          {activeRoleKey === 'employee' && (
            <div className="employee-subroles-bar">
              <span className="subrole-title">Employee Department:</span>
              <div className="subrole-pills">
                {[
                  { key: 'accountant', label: 'Accountant', icon: <DollarSign size={14} /> },
                  { key: 'manager', label: 'Manager', icon: <Briefcase size={14} /> },
                  { key: 'security', label: 'Security', icon: <Shield size={14} /> },
                  { key: 'kitchen', label: 'Kitchen Staff', icon: <Utensils size={14} /> }
                ].map((sub) => {
                  const isSelected = activeSubRole === sub.key;
                  return (
                    <button
                      key={sub.key}
                      type="button"
                      className={`subrole-pill ${isSelected ? 'selected' : ''}`}
                      onClick={() => setActiveSubRole(sub.key)}
                    >
                      {sub.icon}
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="login-role-badge-pill" style={{ color: primaryColor, backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}>
            {badgeText}
          </div>
          
          <div className="login-form-header">
            <h2>Welcome Back</h2>
            <p>{loginDescription}</p>
          </div>

          {/* ALERTS */}
          {loginError && (
            <div className="login-alert-banner error-banner">
              <AlertTriangle size={18} className="alert-icon" />
              <span>{loginError}</span>
            </div>
          )}

          {loginSuccessMessage && (
            <div className="login-alert-banner success-banner">
              <CheckCircle size={18} className="alert-icon" />
              <span>{loginSuccessMessage}</span>
            </div>
          )}

          {/* DEMO CREDENTIALS BANNER */}
          <div className="demo-credentials-banner">
            <div className="demo-info">
              <span className="demo-label">Demo Credentials:</span>
              <code>{currentDemo.email}</code> / <code>{currentDemo.pass}</code>
            </div>
            <button type="button" className="fill-demo-btn" onClick={handleFillDemo}>
              Autofill
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className={`form-group ${usernameError ? 'has-error' : ''}`}>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  id="username" 
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder={usernameLabel}
                  disabled={isSubmitting}
                  autoComplete="username"
                />
              </div>
              {usernameError && <span className="field-error-text">{usernameError}</span>}
            </div>
            
            <div className={`form-group ${passwordError ? 'has-error' : ''}`}>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Password"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && <span className="field-error-text">{passwordError}</span>}
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  disabled={isSubmitting}
                />
                Remember me
              </label>
              <button 
                type="button" 
                className="forgot-password" 
                style={{ color: primaryColor }}
                onClick={() => setShowForgotModal(true)}
                disabled={isSubmitting}
              >
                Forgot password?
              </button>
            </div>
            
            <button 
              type="submit" 
              className="login-submit-btn" 
              style={{ backgroundColor: primaryColor }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="btn-spinner"></span>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          
          <div className="login-form-footer">
            ArcNio PG Management System
          </div>

        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForgotModal(false)}>
              <X size={20} />
            </button>
            {forgotSubmitted ? (
              <div className="modal-success">
                <CheckCircle size={44} style={{ color: primaryColor, margin: '0 auto 1rem auto' }} />
                <h3>Reset Link Sent!</h3>
                <p>We sent a password recovery link to <strong>{forgotEmail}</strong>. Please check your inbox.</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <div className="modal-icon" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                    <KeyRound size={24} />
                  </div>
                  <h3>Reset Password</h3>
                  <p>Enter your registered email address or phone number to receive a recovery link.</p>
                </div>
                <form onSubmit={handleResetPasswordSubmit} className="modal-form" noValidate>
                  <div className={`form-group ${forgotEmailError ? 'has-error' : ''}`}>
                    <label>Email or Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="admin@arcnio.com or +91 9876543210" 
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (forgotEmailError) setForgotEmailError('');
                      }}
                    />
                    {forgotEmailError && <span className="field-error-text">{forgotEmailError}</span>}
                  </div>
                  <button type="submit" className="login-submit-btn" style={{ backgroundColor: primaryColor }}>
                    Send Recovery Link
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
