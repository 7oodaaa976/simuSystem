import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

const Dashboard = () => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const totalItems = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  const totalProducts = products.length;
  const totalTransactions = transactions.length;

  const last5 = [...transactions].reverse().slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>لوحة التحكم</h1>
          <p style={{ margin: "6px 0 0" }}>
            أهلاً {currentUser?.name} — <b>{currentUser?.role}</b>
          </p>
        </div>

        <button onClick={handleLogout} style={btn}>
          تسجيل خروج
        </button>
      </div>

      <div style={grid}>
        <div style={card}>
          <div style={cardTitle}>عدد المنتجات</div>
          <div style={cardValue}>{totalProducts}</div>
        </div>

        <div style={card}>
          <div style={cardTitle}>إجمالي الكميات</div>
          <div style={cardValue}>{totalItems}</div>
        </div>

        <div style={card}>
          <div style={cardTitle}>عدد الحركات</div>
          <div style={cardValue}>{totalTransactions}</div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/products" style={linkBtn}>المنتجات</Link>
        <Link to="/transactions" style={linkBtn}>الحركات (In/Out)</Link>
        {currentUser?.role === "admin" ? (
          <Link to="/users" style={linkBtn}>المستخدمين</Link>
        ) : null}
      </div>

      <div style={{ marginTop: 22 }}>
        <h3 style={{ marginBottom: 10 }}>آخر 5 حركات</h3>

        {last5.length === 0 ? (
          <p style={{ opacity: 0.8 }}>لا توجد حركات حتى الآن.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {last5.map((t) => (
              <div key={t.id} style={row}>
                <div>
                  <b>{t.type === "in" ? "دخول" : "خروج"}</b> — كمية: {t.quantity}
                  {t.reason ? ` — السبب: ${t.reason}` : ""}
                </div>
                <div style={{ opacity: 0.8, fontSize: 13 }}>
                  {t.date} — بواسطة {t.by}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const grid = {
  marginTop: 16,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const card = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
};

const cardTitle = { fontSize: 14, opacity: 0.8 };
const cardValue = { fontSize: 28, marginTop: 8 };

const row = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
};

const btn = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
};

const linkBtn = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ccc",
  textDecoration: "none",
  color: "#111",
};

export default Dashboard;
