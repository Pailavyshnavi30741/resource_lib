import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "../components/common/Navbar";
import ProtectedRoute from "./ProtectedRoute";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";

// User
import Home from "../pages/user/HomeLive";
import Search from "../pages/user/SearchLive";
import ResourceDetails from "../pages/user/ResourceDetailsLive";
import Profile from "../pages/user/Profile";
import Feedback from "../pages/user/FeedbackLive";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboardLive";
import UploadResource from "../pages/admin/UploadResource";
import ManageUsers from "../pages/admin/ManageUsersLive";
import FeedbackList from "../pages/admin/FeedbackListLive";

const Layout = () => {
  const location = useLocation();

  // Hide Navbar only on auth pages
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/verify-email";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* AUTH ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* USER ROUTES */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRole="user">
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRole="user">
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resource/:id"
          element={
            <ProtectedRoute allowedRole="user">
              <ResourceDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRole="user">
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute allowedRole="user">
              <Feedback />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/upload"
          element={
            <ProtectedRoute allowedRole="admin">
              <UploadResource />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/resources/:id/edit"
          element={
            <ProtectedRoute allowedRole="admin">
              <UploadResource />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute allowedRole="admin">
              <FeedbackList />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
};

const AppRoutes = () => {
  return <Layout />;
};

export default AppRoutes;
