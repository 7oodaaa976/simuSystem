import { useEffect, useMemo, useState } from "react";
import { listProducts } from "../../services/productsService";
import { listTransactions } from "../../services/transactionsService";
import { exportToCSV } from "../../services/exportService";


const Reports = () => {
  // Products ثابتة
  const products = useMemo(() => listProducts(), []);

  // Transactions
  const [transactions, setTransactions] = useState([]);

  // Filters
  const [type, setType] = useState("all"); // all | in | out
  const [productId, setProductId] = useState("all");
  const [from, setFrom] = useState(""); // yyyy-mm-dd
  const [to, setTo] = useState(""); // yyyy-mm-dd

  useEffect(() => {
    setTransactions(listTransactions());
  }, []);

  const filtered = useMemo(() => {
    const fromDate = from ? new Date(from + "T00:00:00") : null;
    const toDate = to ? new Date(to + "T23:59:59") : null;

    return [...transactions]
      .filter((t) => (type === "all" ? true : t.type === type))
      .filter((t) => (productId === "all" ? true : t.productId === productId))
      .filter((t) => {
        const d = t.dateISO ? new Date(t.dateISO) : new Date(t.date);
        if (fromDate && d < fromDate) return false;
        if (toDate && d > toDate) return false;
        return true;
      })
      .reverse(); // الأحدث فوق
  }, [transactions, type, productId, from, to]);

  const totals = useMemo(() => {
    const inQty = filtered
      .filter((t) => t.type === "in")
      .reduce((s, t) => s + (Number(t.quantity) || 0), 0);

    const outQty = filtered
      .filter((t) => t.type === "out")
      .reduce((s, t) => s + (Number(t.quantity) || 0), 0);

    return { count: filtered.length, inQty, outQty };
  }, [filtered]);

  const buildTransactionsRows = () =>
    filtered.map((t) => ({
      التاريخ: t.date,
      النوع: t.type === "in" ? "دخول" : "خروج",
      المنتج: t.productName,
      الكمية: t.quantity,
      السبب: t.reason || "",
      المستلم: t.receiver || "",
      بواسطة: t.by || "",
      الدور: t.role || "",
    }));

  const buildProductsRows = () => {
    const list = listProducts();
    return list.map((p) => ({
      الاسم: p.name,
      التصنيف: p.category,
      الكود: p.code || "",
      الكمية: p.quantity ?? 0,
      المكان: p.location || "",
      الحالة: mapStatus(p.status),
    }));
  };

  // ✅ CSV
  const exportTransactionsCSV = () => {
    const rows = buildTransactionsRows();
    if (rows.length === 0) return alert("لا توجد بيانات للتصدير");
    exportToCSV(
      `transactions_report_${new Date().toISOString().slice(0, 10)}.csv`,
      rows
    );
  };

  const exportProductsCSV = () => {
    const rows = buildProductsRows();
    if (rows.length === 0) return alert("لا توجد بيانات للتصدير");
    exportToCSV(
      `products_report_${new Date().toISOString().slice(0, 10)}.csv`,
      rows
    );
  };

  

  const reset = () => {
    setType("all");
    setProductId("all");
    setFrom("");
    setTo("");
  };

  return (
    <div style={{ padding: 20 }} dir="rtl">
      <div style={header}>
        <div>
          <h1 style={{ margin: 0 }}>التقارير والتصدير</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.85 }}>
            نتائج الفلترة: <b>{totals.count}</b> — دخول: <b>{totals.inQty}</b> —
            خروج: <b>{totals.outQty}</b>
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={btnPrimary} onClick={exportTransactionsCSV}>
            تصدير الحركات CSV
          </button>
          <button style={btn} onClick={exportProductsCSV}>
            تصدير المنتجات CSV
          </button>

        
        </div>
      </div>

      <div style={filters}>
        <div>
          <label style={label}>نوع الحركة</label>
          <select
            style={input}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="in">دخول</option>
            <option value="out">خروج</option>
          </select>
        </div>

        <div>
          <label style={label}>المنتج</label>
          <select
            style={input}
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="all">كل المنتجات</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={label}>من تاريخ</label>
          <input
            style={input}
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>

        <div>
          <label style={label}>إلى تاريخ</label>
          <input
            style={input}
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "end" }}>
          <button style={btn} onClick={reset}>
            مسح الفلاتر
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={emptyBox}>لا توجد نتائج.</div>
        ) : (
          filtered.map((t) => (
            <div key={t.id} style={row}>
              <div style={{ minWidth: 260 }}>
                <div style={{ fontWeight: 900 }}>
                  {t.type === "in" ? "دخول" : "خروج"} — {t.productName}
                </div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  كمية: <b>{t.quantity}</b>
                  {t.reason ? ` — السبب: ${t.reason}` : ""}
                  {t.receiver ? ` — المستلم: ${t.receiver}` : ""}
                </div>
              </div>

              <div style={{ fontSize: 13, opacity: 0.85 }}>
                {t.date} — بواسطة <b>{t.by}</b> ({t.role})
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const mapStatus = (s) => {
  if (s === "available") return "متاح";
  if (s === "in_use") return "قيد الاستخدام";
  if (s === "out") return "خارج المخزن";
  return s || "-";
};

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const filters = {
  marginTop: 14,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 18,
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
};

const label = {
  display: "block",
  marginBottom: 6,
  fontSize: 13,
  opacity: 0.85,
};

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ccc",
  outline: "none",
  background: "#fff",
};

const btn = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
};

const btnPrimary = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const row = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const emptyBox = {
  border: "1px dashed #ccc",
  borderRadius: 12,
  padding: 16,
  background: "#fff",
  opacity: 0.9,
};

export default Reports;
