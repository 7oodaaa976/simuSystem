import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const canEdit = user?.role === "admin" || user?.role === "store";

  const [q, setQ] = useState("");

  const title = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith("/dashboard")) return "لوحة التحكم";
    if (p.startsWith("/products")) return "المنتجات";
    if (p.startsWith("/transactions")) return "الحركات";
    if (p.startsWith("/users")) return "المستخدمين";
    return "نظام الجرد";
  }, [location.pathname]);

  const onSearch = (e) => {
    e.preventDefault();
    const query = q.trim();
    // نوديه للمنتجات ومعاه query في URL
    navigate(`/products${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <header style={styles.bar} dir="rtl">
      <div style={styles.left}>
        <div style={styles.pageTitle}>{title}</div>
        <div style={styles.user}>
          {user?.name || "مستخدم"} — <span style={{ opacity: 0.75 }}>{mapRole(user?.role)}</span>
        </div>
      </div>

      <form onSubmit={onSearch} style={styles.searchWrap}>
        <input
          style={styles.search}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="بحث سريع في المنتجات..."
        />
        <button type="submit" style={styles.searchBtn}>بحث</button>
      </form>

      <div style={styles.actions}>
        {canEdit ? (
          <>
            <button
              style={styles.primary}
              onClick={() => navigate("/products?open=add")}
            >
              + إضافة منتج
            </button>
            <button
              style={styles.secondary}
              onClick={() => navigate("/transactions?open=add")}
            >
              + تسجيل حركة
            </button>
          </>
        ) : (
          <span style={{ fontSize: 13, opacity: 0.8 }}>عرض فقط</span>
        )}
      </div>
    </header>
  );
};

const mapRole = (role) => {
  if (role === "admin") return "مدير النظام";
  if (role === "store") return "مسؤول مخزن";
  if (role === "viewer") return "عرض فقط";
  return "غير معروف";
};

const styles = {
  bar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "#fff",
    borderBottom: "1px solid #e6e6e6",
    padding: "12px 16px",
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  left: { display: "grid", gap: 4 },
  pageTitle: { fontSize: 18, fontWeight: 900 },
  user: { fontSize: 13, opacity: 0.9 },

  searchWrap: { display: "flex", gap: 8, alignItems: "center", flex: 1, minWidth: 260, maxWidth: 520 },
  search: { flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ccc", outline: "none" },
  searchBtn: { padding: "10px 12px", borderRadius: 10, border: "1px solid #ccc", background: "#fff", cursor: "pointer" },

  actions: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  primary: { padding: "10px 12px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer", fontWeight: 700 },
  secondary: { padding: "10px 12px", borderRadius: 10, border: "1px solid #ccc", background: "#fff", cursor: "pointer", fontWeight: 700 },
};

export default Topbar;
