import { Navigate } from "react-router-dom";

const RoleRoute = ({ roles = [], children }) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) return <Navigate to="/login" replace />;

  const userRole = String(user.role || "").toLowerCase();
  const allowed = roles.map((r) => String(r).toLowerCase());

  if (allowed.length > 0 && !allowed.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
