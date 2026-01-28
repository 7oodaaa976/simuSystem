import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login", { replace: true });
  };

  return (
    <aside style={styles.sidebar} dir="rtl">
      <div>
        <div style={styles.brand}>
          <div style={styles.brandTitle}>نظام الجرد</div>
          <div style={styles.brandSub}>Simulator Egypt</div>
          <img src="../../../public/simulator-logo.png" alt="" />
        </div>

        <nav style={styles.nav}>
          <NavLink to="/dashboard" style={linkStyle}>
            لوحة التحكم
          </NavLink>

          <NavLink to="/products" style={linkStyle}>
            المنتجات
          </NavLink>

          <NavLink to="/transactions" style={linkStyle}>
            الحركات (دخول / خروج)
          </NavLink>
          <NavLink to="/reports" style={linkStyle}>
            التقارير والتصدير
          </NavLink>


          {user?.role === "admin" && (
            <NavLink to="/users" style={linkStyle}>
              المستخدمين
            </NavLink>

          )}
        </nav>
      </div>

      <div style={styles.footer}>
        <div style={styles.userBox}>
          <div style={{ fontWeight: 700 }}>{user?.name || "مستخدم"}</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            {mapRole(user?.role)}
          </div>
        </div>

        <button onClick={handleLogout} style={styles.logout}>
          تسجيل خروج
        </button>
      </div>
    </aside>
  );
};

const linkStyle = ({ isActive }) => ({
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  color: isActive ? "#111" : "#f1f1f1",
  background: isActive ? "#fff" : "transparent",
  display: "block",
  border: isActive ? "1px solid #fff" : "1px solid transparent",
});

const mapRole = (role) => {
  if (role === "admin") return "مدير النظام";
  if (role === "store") return "مسؤول مخزن";
  if (role === "viewer") return "عرض فقط";
  return "غير معروف";
};

const styles = {
  sidebar: {
    width: 260,
    minHeight: "100vh",
    background: "#1e1e1e",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    borderLeft: "1px solid #2c2c2c",
  },
  brand: {
    padding: "6px 6px 14px",
    borderBottom: "1px solid #2c2c2c",
    marginBottom: 14,
  },
  brandTitle: { fontSize: 18, fontWeight: 800 },
  brandSub: { fontSize: 12, opacity: 0.75, marginTop: 4 },

  nav: { display: "grid", gap: 8 },

  footer: {
    borderTop: "1px solid #2c2c2c",
    paddingTop: 12,
    display: "grid",
    gap: 10,
  },
  userBox: {
    padding: 10,
    borderRadius: 12,
    background: "#151515",
    border: "1px solid #2c2c2c",
  },
  logout: {
    background: "#ff4d4f",
    border: "none",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default Sidebar;
