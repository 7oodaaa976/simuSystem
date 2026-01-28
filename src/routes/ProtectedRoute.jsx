import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  // currentUser محفوظ في LocalStorage بعد تسجيل الدخول
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // لو مش عامل Login يرجعه لصفحة login
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // لو عامل Login يكمل للصفحات الداخلية
  return <Outlet />;
};

export default ProtectedRoute;
