import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  const storedUser =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    JSON.parse(storedUser);
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
