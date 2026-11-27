import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(storedUser);

    if (user.role !== "admin") {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
