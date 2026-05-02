import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaQuestion(`${num1} + ${num2}`);
    setCaptchaAnswer((num1 + num2).toString());
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      alert(
        "Account created successfully. Please verify your email before signing in."
      );
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
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
          <h3>Welcome to EduNexus</h3>
          <p>Connect • Learn • Grow</p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="auth-form-container">
          <div className="auth-form">
            <div className="form-header">
              <h1>Create Account</h1>
              <p>Sign up to start your learning journey</p>
            </div>
            {errors.general && (
              <div className="error-text" style={{ textAlign: "center", marginBottom: "15px" }}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? "input-error" : ""}`}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
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
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
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
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="password-input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>

              {/* Role Selection */}
              <div className="form-group">
                <label>Register As</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
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
                Create Account
              </button>
            </form>

            {/* Sign In Link */}
            <div className="form-footer">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="link">
                  Sign In
                </Link>
              </p>
              <p className="secondary-footer-text">
                Need to verify your email?{" "}
                <Link
                  to={`/verify-email?email=${encodeURIComponent(formData.email || "")}`}
                  className="link"
                >
                  Open verification page
                </Link>
              </p>
            </div>


          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;
