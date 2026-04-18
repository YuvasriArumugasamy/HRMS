import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, CheckCircle2, Shield } from "lucide-react";
import "./OTPVerification.css";

export function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email || "user@example.com";

  useEffect(() => {
    if (!location.state?.email) {
      navigate("/login", { replace: true });
    }
  }, [navigate, location.state]);

  const handleResend = () => {
    setIsResending(true);
    setError("");
    setTimeout(() => {
      setIsResending(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }, 1500);
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    setError("");

    const newOtp = [...otp];
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split("");
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const focusIndex = pastedData.length < 6 ? pastedData.length : 5;
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter the complete OTP");
      return;
    }
    setError("");

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/home");
    }, 1500);
  };

  return (
    <div className="otp-container">
      <div className="login-content-wrapper">
        
        {/* Top Header / Logo Section identical to Login */}
        <div className="login-logo-section">
          <div className="logo-box">
            <Shield className="logo-icon" size={34} strokeWidth={2.2} />
          </div>
          <h1 className="login-title">HRMS Portal</h1>
          <p className="login-subtitle">Secure Human Resource Management</p>
        </div>

        <div className="otp-card">
          <div className="otp-icon-container">
            <div className="otp-icon-box">
              <Lock className="otp-lock-icon" size={24} strokeWidth={2.2} />
            </div>
          </div>

          <header className="otp-header">
            <h2>Enter OTP</h2>
            <p>We've sent a 6-digit code to</p>
            <strong>{email}</strong>
          </header>

          <form className="otp-form" onSubmit={handleSubmit}>
            <div className="otp-input-group">
              <label>One-Time Password</label>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={(e) => {
                      e.preventDefault();
                      handleChange(0, e.clipboardData.getData("text"));
                    }}
                    className={`otp-digit-box ${digit ? 'filled' : ''}`}
                    disabled={isLoading || isResending}
                  />
                ))}
              </div>
            </div>

            {error && <div key={Date.now()} className="error-message" style={{ marginBottom: '1.25rem', marginTop: '0' }}>{error}</div>}

            <button 
              type="submit" 
              className={`otp-submit-btn ${(isLoading || isResending) ? 'otp-loading' : ''}`} 
              disabled={isLoading || isResending}
            >
              {(isLoading || isResending) ? (
                <>
                  <div className="loading-spinner-small" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Verify & Login</span>
                </>
              )}
            </button>
          </form>

          <div className="otp-links">
            <button 
              type="button" 
              className={`resend-link ${isResending ? 'resend-disabled' : ''}`}
              onClick={handleResend}
              disabled={isResending || isLoading}
            >
              Didn't receive the code? Resend
            </button>
            <button 
              type="button" 
              className="back-link"
              onClick={() => navigate("/login")}
              disabled={isLoading || isResending}
            >
              — Back to email
            </button>
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