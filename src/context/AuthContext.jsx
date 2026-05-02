import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const AUTH_API_BASE_URL = "https://resourcelibrary-backend-production.up.railway.app/api/auth";
const normalizeEmail = (email = "") => email.trim().toLowerCase();
const normalizeRole = (role = "user") => role.trim().toLowerCase();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  const request = async (path, payload, method = "POST") => {
    const response = await fetch(`${AUTH_API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Authentication request failed.");
    }

    return response.json();
  };

  const login = async ({ email, password, role }) => {
    const normalizedEmail = normalizeEmail(email);
    const selectedRole = normalizeRole(role);
    const user = await request("/login", {
      email: normalizedEmail,
      password,
      role: selectedRole,
    });
    const normalizedUser = { ...user, email: normalizedEmail, role: normalizeRole(user.role || selectedRole) };
    localStorage.setItem("currentUser", JSON.stringify(normalizedUser));
    setCurrentUser(normalizedUser);
    return normalizedUser;
  };

  const register = async ({ name, email, password, role }) => {
    const normalizedEmail = normalizeEmail(email);
    const normalizedRole = normalizeRole(role);
    return request("/register", {
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: normalizedRole,
    });
  };

  const forgotPassword = async ({ email }) => {
    return request("/forgot-password", { email: normalizeEmail(email) });
  };

  const resetPassword = async ({ token, password }) => {
    return request("/reset-password", { token, password });
  };

  const verifyEmail = async ({ token }) => {
    return request("/verify-email", { token });
  };

  const resendVerification = async ({ email }) => {
    return request("/resend-verification", { email: normalizeEmail(email) });
  };

  const updateProfile = (updates) => {
    if (!currentUser) {
      throw new Error("No active user session.");
    }
    const mergedUser = { ...currentUser, ...updates };
    localStorage.setItem("currentUser", JSON.stringify(mergedUser));
    setCurrentUser(mergedUser);
    return mergedUser;
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
