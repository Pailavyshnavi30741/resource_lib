import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaQuestion(`${num1} + ${num2}`);
    setCaptchaAnswer((num1 + num2).toString());
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!userAnswer.trim()) {
      newErrors.captcha = "CAPTCHA is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (userAnswer !== captchaAnswer) {
      setErrors({ ...errors, captcha: "Incorrect CAPTCHA! Try again." });
      generateCaptcha();
      setUserAnswer("");
      return;
    }

    // attempt login
    try {
      const user = await login({ email, password, role });
      // success
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      setErrors({ ...errors, general: err.message });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="page-header">
        <h1>Resource Library</h1>
      </div>
      <div className="auth-container">
        {/* LEFT SIDE - ILLUSTRATION */}
        <div className="auth-illustration">
          <div className="book-symbol">📖</div>
          <div className="resources-grid">
            <span className="resource-icon">📚</span>
            <span className="resource-icon">📄</span>
            <span className="resource-icon">📰</span>
            <span className="resource-icon">❓</span>
            <span className="resource-icon">✏️</span>
            <span className="resource-icon">📑</span>
          </div>
          <h3>EduNexus</h3>
          <p>Connect • Learn • Grow</p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="auth-form-container">
          <div className="auth-form">
            <div className="form-header">
              <h1>Sign In</h1>
              <p>Welcome back! Please login to your account</p>
            </div>
            {errors.general && (
              <div className="error-text" style={{ textAlign: "center", marginBottom: "15px" }}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="form-group">
                <label>Login As</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-input"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label>Password</label>
                <div className="password-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: "" });
                    }}
                    className={`form-input ${errors.password ? "input-error" : ""}`}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
                <div className="inline-auth-action">
                  <Link to="/forgot-password" className="link">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* CAPTCHA */}
              <div className="form-group">
                <label>Security Verification</label>
                <div className="captcha-section">
                  <div className="captcha-question">
                    <span>What is: {captchaQuestion} ?</span>
                    <button 
                      type="button" 
                      onClick={generateCaptcha}
                      className="captcha-refresh"
                    >
                      🔄
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter answer"
                    value={userAnswer}
                    onChange={(e) => {
                      setUserAnswer(e.target.value);
                      if (errors.captcha) setErrors({ ...errors, captcha: "" });
                    }}
                    className={`form-input ${errors.captcha ? "input-error" : ""}`}
                  />
                  {errors.captcha && <span className="error-text">{errors.captcha}</span>}
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn">
                Sign In
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="form-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="link">
                  Sign Up
                </Link>
              </p>
              <p className="secondary-footer-text">
                Didn't get verification email?{" "}
                <Link to="/verify-email" className="link">
                  Verify now
                </Link>
              </p>
            </div>


          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
