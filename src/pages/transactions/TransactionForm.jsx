import { useEffect, useState } from "react";

const TransactionForm = ({ products = [], onSubmit, onCancel }) => {
  const [type, setType] = useState("out");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [receiver, setReceiver] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!productId && products.length) setProductId(products[0].id);
  }, [products, productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    if (!productId) return setErr("اختار منتج");
    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty <= 0) return setErr("الكمية لازم تكون رقم أكبر من 0");

    onSubmit({ type, productId, quantity: qty, reason, receiver });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <h3 style={{ margin: "0 0 10px" }}>تسجيل حركة</h3>

      {err ? <div style={styles.error}>{err}</div> : null}

      <div style={styles.grid}>
        <div>
          <label style={styles.label}>نوع الحركة</label>
          <select style={styles.input} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="in">دخول (IN)</option>
            <option value="out">خروج (OUT)</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>المنتج</label>
          <select style={styles.input} value={productId} onChange={(e) => setProductId(e.target.value)}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — (المتوفر: {p.quantity ?? 0})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>الكمية</label>
          <input
            style={styles.input}
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div>
          <label style={styles.label}>السبب (اختياري)</label>
          <input
            style={styles.input}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="تدريب / صيانة / شراء ..."
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label style={styles.label}>المستلم / الجهة (اختياري)</label>
          <input
            style={styles.input}
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="اسم الموظف / القسم / العميل"
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button type="submit" style={styles.primary}>حفظ</button>
        <button type="button" onClick={onCancel} style={styles.secondary}>إلغاء</button>
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

export default TransactionForm;
