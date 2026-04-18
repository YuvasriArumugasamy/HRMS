import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, ShieldCheck, Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError, setError } from "@/modules/auth/authSlice";
import type { RootState, AppDispatch } from "@/app/store";
import "./Login.css";

// Default App Code for initial load
const DEFAULT_APP_CODE = "INFYCARE";

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [AppCode, setAppCode] = useState(DEFAULT_APP_CODE);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect logic is currently handled by AppRoutes or disabled for testing
  /*
  useEffect(() => {
    // If you need auto-redirect, uncomment isAuthenticated from selector and use it here
  }, [navigate]);
  */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    // Validation with error messages
    if (!email.trim()) {
      dispatch(setError("Please enter your email address"));
      return;
    }
    if (!password.trim()) {
      dispatch(setError("Please enter your password"));
      return;
    }

    // Dispatch the login action
    const result = await dispatch(
      loginUser({
        email: email.trim(),
        password: password.trim(),
        appCode: AppCode.trim(),
      })
    );

    // Handle successful login
    if (result.type === loginUser.fulfilled.type) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      // Manual redirect since auto-redirect is disabled
      navigate("/home");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content-wrapper">

        {/* Top Header / Logo Section */}
        <div className="login-logo-section">
          <div className="logo-box">
            <Shield className="logo-icon" size={34} strokeWidth={2.2} />
          </div>
          <h1 className="login-title">HRMS Portal</h1>
          <p className="login-subtitle">Secure Human Resource Management</p>
        </div>

        <div className="login-card">
          <header className="card-header">
            <h2>Welcome Back</h2>
            <p>Enter your credentials to sign in</p>
          </header>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) dispatch(clearError());
                  }}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input-field input-field-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) dispatch(clearError());
                  }}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* App Code Field */}
            <div className="form-group">
              <label htmlFor="AppCode">AppCode</label>
              <div className="input-wrapper">
                <ShieldCheck className="input-icon" size={20} />
                <input
                  id="AppCode"
                  type="text"
                  className="input-field"
                  placeholder="Organization Code"
                  value={AppCode}
                  onChange={(e) => {
                    setAppCode(e.target.value);
                    if (error) dispatch(clearError());
                  }}
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && <div key={Date.now()} className="error-message">{error}</div>}

            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'submit-btn-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner-small" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="security-badge">
            <ShieldCheck size={18} />
            <span>Secured with 256-bit encryption</span>
          </div>
        </div>

        {/* Footer Section */}
        <div className="login-footer">
          <p className="footer-title">Protected by advanced security protocols</p>
          <div className="footer-links">
            <span>© 2026 HRMS</span>
            <span className="dot">•</span>
            <a href="#">Privacy Policy</a>
            <span className="dot">•</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>

      </div>
    </div>
  );
}
