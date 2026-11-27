import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import SubmitComplaint from "./pages/SubmitComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageComplaints from "./pages/admin/ManageComplaints";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Passenger Protected Routes */}
        <Route
          path="/submit-complaint"
          element={
            <ProtectedRoute>
              <SubmitComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-complaint"
          element={
            <ProtectedRoute>
              <TrackComplaint />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <AdminRoute>
              <ManageComplaints />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
