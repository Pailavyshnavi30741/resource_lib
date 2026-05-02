import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

const VerifyEmail = () => {
  const { verifyEmail, resendVerification } = useAuth();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) return;

      setSubmitting(true);
      setError("");
      try {
        const response = await verifyEmail({ token });
        setVerified(true);
        setStatus(response?.message || "Email verified successfully.");
      } catch (err) {
        setError(err.message || "Unable to verify email.");
      } finally {
        setSubmitting(false);
      }
    };

    verify();
  }, [token, verifyEmail]);

  const handleResend = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!email.trim()) {
      setError("Email is required to resend verification link.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await resendVerification({ email });
      setStatus(
        response?.message || "Verification email sent. Please check your inbox."
      );
    } catch (err) {
      setError(err.message || "Unable to resend verification email.");
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
          <div className="book-symbol">✉️</div>
          <h3>Verify Your Email</h3>
          <p>Complete verification to activate your account</p>
        </div>
        <div className="auth-form-container">
          <div className="auth-form">
            <div className="form-header">
              <h1>Email Verification</h1>
              <p>Use the link from your inbox or request a new one below</p>
            </div>

            {status && <div className="auth-message-success">{status}</div>}
            {error && <div className="error-text auth-message-error">{error}</div>}

            {!verified && (
              <form onSubmit={handleResend}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    placeholder="Enter your registered email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? "Please wait..." : "Resend Verification Email"}
                </button>
              </form>
            )}

            <div className="form-footer">
              <p>
                Continue to{" "}
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

export default VerifyEmail;
