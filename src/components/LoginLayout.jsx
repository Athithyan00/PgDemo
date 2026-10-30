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
  Lock, 
  User, 
  X, 
  Building2, 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle,
  Sun,
  Moon,
  KeyRound
} from 'lucide-react';
import './LoginLayout.css';

export default function LoginLayout({
  role = "User",
  badgeText = "Portal",
  heading = "Sign In",
  subtitle = "Arcnio Smart PG System",
  description = "Access your dedicated PG management dashboard.",
  features = [],
  loginDescription = "Please enter your registered credentials to continue.",
  primaryColor = "#2563eb",
  pgImage,
  sloganText,
  usernameLabel = "Email, Phone or Username",
  activeRoleKey = "tenant"
}) {
  const { login } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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

  // Restore remembered username on role switch or reset fields clean
  useEffect(() => {
    const remembered = authService.getRememberedUser(activeRoleKey);
    if (remembered) {
      setUsername(remembered);
      setRememberMe(true);
    } else {
      setUsername('');
      setRememberMe(false);
    }
    setPassword('');
    setUsernameError('');
    setPasswordError('');
    setLoginError('');
  }, [activeRoleKey]);

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
        identifier: username,
        password,
        rememberMe
      });

      setIsSubmitting(false);

      if (res.success) {
        setLoginSuccessMessage('Authenticated successfully! Redirecting to your dashboard...');
        setTimeout(() => {
          navigate(res.redirectPath, { replace: true });
        }, 350);
      } else {
        setLoginError(res.error || 'Authentication failed. Please verify your credentials.');
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
    }, 2200);
  };

  return (
    <div className="login-container" style={{ '--primary-color': primaryColor }}>
      {/* LEFT BRANDING & PG SHOWCASE PANEL */}
      <div className="login-left-panel">
        <div className="login-left-content">
          <div className="login-brand">
            <div className="brand-logo-badge">
              <div className="brand-icon-box" style={{ backgroundColor: primaryColor }}>
                <Building2 size={22} color="#ffffff" />
              </div>
              <div>
                <span className="brand-name">Arcnio</span>
                <span className="brand-subtitle">PG Management System</span>
              </div>
            </div>
          </div>
          
          <div className="login-role-info">
            <h2>{heading}</h2>
            {subtitle && <h3 className="login-tagline">{subtitle}</h3>}
            <p>{description}</p>
            
            {/* PG RELEVANT IMAGE SHOWCASE */}
            {pgImage && (
              <div className="login-pg-showcase-card">
                <div className="pg-card-image-wrap">
                  <img 
                    src={pgImage} 
                    alt={`${role} PG Accommodation`} 
                    className="pg-showcase-img" 
                  />
                  <div className="pg-card-badge-top">
                    <ShieldCheck size={14} color="#34d399" />
                    <span>Arcnio Verified PG</span>
                  </div>
                  <div className="pg-card-badge-bottom">
                    <span>★ 4.9 • 3 Meals • Wi-Fi • Security</span>
                  </div>
                </div>
                <div className="pg-card-meta">
                  <span className="pg-card-title">
                    {role === 'Tenant' ? 'Deluxe Resident Living & Dining' : 'Arcnio Smart PG Residency Network'}
                  </span>
                  <span className="pg-card-sub">
                    Clean, comfortable rooms with 24/7 power backup, high-speed Wi-Fi & mess
                  </span>
                </div>
              </div>
            )}

            {features.length > 0 && (
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
            )}
          </div>
          
          <div className="login-left-footer">
            {sloganText && <div className="handwritten-slogan">{sloganText}</div>}
          </div>
        </div>
      </div>

      {/* RIGHT DEDICATED LOGIN FORM PANEL */}
      <div className="login-right-panel">
        {/* TOP BAR WITH THEME TOGGLE */}
        <div className="login-top-bar">
          <button 
            type="button" 
            className="theme-toggle-pill"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? (
              <>
                <Sun size={15} className="theme-toggle-icon sun-icon" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={15} className="theme-toggle-icon moon-icon" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        <div className="login-form-container">
          <div className="login-form-header">
            <div className="login-form-header-top">
              <h2>Welcome Back</h2>
              <div 
                className="login-role-badge-pill" 
                style={{ 
                  color: primaryColor, 
                  backgroundColor: `${primaryColor}15`, 
                  borderColor: `${primaryColor}30` 
                }}
              >
                {badgeText}
              </div>
            </div>
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
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          
          <div className="login-form-footer">
            Arcnio PG Management System • Secure Role Login
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
                      placeholder="e.g. user@arcnio.com or +91 98765 43210" 
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
