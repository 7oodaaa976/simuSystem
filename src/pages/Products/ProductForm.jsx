import { useEffect, useState } from "react";

const empty = {
  name: "",
  category: "",
  code: "",
  quantity: 0,
  location: "",
  status: "available",
};

const ProductForm = ({ initialValue, onSubmit, onCancel }) => {
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");

  useEffect(() => {
    setForm(initialValue ? { ...empty, ...initialValue } : empty);
  }, [initialValue]);

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    if (!form.name.trim()) return setErr("اسم المنتج مطلوب");
    if (!form.category.trim()) return setErr("التصنيف مطلوب");

    const qty = Number(form.quantity);
    if (Number.isNaN(qty) || qty < 0) return setErr("الكمية لازم تكون رقم (0 أو أكثر)");

    onSubmit({
      ...form,
      name: form.name.trim(),
      category: form.category.trim(),
      code: form.code.trim(),
      location: form.location.trim(),
      quantity: qty,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <h3 style={{ margin: "0 0 10px" }}>
        {initialValue ? "تعديل منتج" : "إضافة منتج"}
      </h3>

      {err ? <div style={styles.error}>{err}</div> : null}

      <div style={styles.grid}>
        <div>
          <label style={styles.label}>اسم المنتج *</label>
          <input
            style={styles.input}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="مثال: Driving Simulator"
          />
        </div>

        <div>
          <label style={styles.label}>التصنيف *</label>
          <input
            style={styles.input}
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Simulator / Electronics / Renewable ..."
          />
        </div>

        <div>
          <label style={styles.label}>كود داخلي</label>
          <input
            style={styles.input}
            value={form.code}
            onChange={(e) => set("code", e.target.value)}
            placeholder="مثال: SIM-DR-01"
          />
        </div>

        <div>
          <label style={styles.label}>الكمية</label>
          <input
            style={styles.input}
            type="number"
            value={form.quantity}
            onChange={(e) => set("quantity", e.target.value)}
            min={0}
          />
        </div>

        <div>
          <label style={styles.label}>المكان</label>
          <input
            style={styles.input}
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Main Store / Lab ..."
          />
        </div>

        <div>
          <label style={styles.label}>الحالة</label>
          <select
            style={styles.input}
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="available">متاح</option>
            <option value="in_use">قيد الاستخدام</option>
            <option value="out">خارج المخزن</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button type="submit" style={styles.primary}>
          حفظ
        </button>
        <button type="button" onClick={onCancel} style={styles.secondary}>
          إلغاء
        </button>
      </div>
    </form>
  );
};

const styles = {
  card: { border: "1px solid #ddd", borderRadius: 12, padding: 14, background: "#fff" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 },
  label: { display: "block", marginBottom: 6, fontSize: 13, opacity: 0.85 },
  input: { width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ccc", outline: "none" },
  error: { padding: 10, borderRadius: 10, background: "#ffe6e6", border: "1px solid #ffb3b3", color: "#b30000" },
  primary: { padding: "10px 12px", borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff", cursor: "pointer" },
  secondary: { padding: "10px 12px", borderRadius: 10, border: "1px solid #ccc", background: "#fff", cursor: "pointer" },
};

export default ProductForm;
