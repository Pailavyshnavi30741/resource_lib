import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};

    if (!token.trim()) {
      nextErrors.token = "Reset token is required";
    }
    if (!password.trim()) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }
    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await resetPassword({ token, password });
      setStatus(response?.message || "Password reset successful.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setErrors({ general: err.message || "Unable to reset password." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="page-header">
        <h1>Resource Library</h1>
      </div>
      <div className="auth-container">
        <div className="auth-illustration">
          <div className="book-symbol">🔐</div>
          <h3>Create New Password</h3>
          <p>Use a strong password to secure your account</p>
        </div>
        <div className="auth-form-container">
          <div className="auth-form">
            <div className="form-header">
              <h1>Reset Password</h1>
              <p>Enter your reset token and choose a new password</p>
            </div>

            {errors.general && (
              <div className="error-text auth-message-error">{errors.general}</div>
            )}
            {status && <div className="auth-message-success">{status}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Reset Token</label>
                <input
                  type="text"
                  value={token}
                  placeholder="Paste token from email"
                  onChange={(e) => setToken(e.target.value)}
                  className={`form-input ${errors.token ? "input-error" : ""}`}
                />
                {errors.token && <span className="error-text">{errors.token}</span>}
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={`form-input ${errors.password ? "input-error" : ""}`}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm new password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`form-input ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? "Updating..." : "Update Password"}
              </button>
            </form>

            <div className="form-footer">
              <p>
                Back to{" "}
                <Link to="/login" className="link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
