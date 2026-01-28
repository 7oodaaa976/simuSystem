import { useMemo, useState } from "react";
import { listTransactionsByProduct } from "../../services/transactionsService";

const ProductTransactionsModal = ({ product, onClose }) => {
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const tx = listTransactionsByProduct(product.id);
    const q = query.trim().toLowerCase();

    const filtered = tx.filter((t) => {
      if (!q) return true;
      const hay = `${t.type} ${t.reason} ${t.receiver} ${t.by} ${t.date}`.toLowerCase();
      return hay.includes(q);
    });

    return filtered.reverse(); // الأحدث فوق
  }, [product.id, query]);

  return (
    <div style={backdrop} onClick={onClose}>
      <div style={body} onClick={(e) => e.stopPropagation()}>
        <div style={header}>
          <div>
            <h3 style={{ margin: 0 }}>سجل حركات المنتج</h3>
            <p style={{ margin: "6px 0 0", opacity: 0.85 }}>
              <b>{product.name}</b> — (الكود: {product.code || "-"})
            </p>
          </div>

          <button onClick={onClose} style={btn}>
            إغلاق
          </button>
        </div>

        <div style={toolbar}>
          <input
            style={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="بحث داخل السجل (سبب / مستلم / بواسطة...)"
          />
          <div style={{ opacity: 0.85, alignSelf: "center" }}>
            عدد الحركات: <b>{items.length}</b>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {items.length === 0 ? (
            <div style={emptyBox}>لا توجد حركات لهذا المنتج.</div>
          ) : (
            items.map((t) => (
              <div key={t.id} style={row}>
                <div style={{ minWidth: 260 }}>
                  <div style={{ fontWeight: 800 }}>
                    {t.type === "in" ? "دخول" : "خروج"} — كمية: {t.quantity}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    {t.reason ? `السبب: ${t.reason}` : "السبب: -"}
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
    </div>
  );
};

const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "grid",
  placeItems: "center",
  padding: 16,
  zIndex: 999,
};

const body = {
  width: "100%",
  maxWidth: 950,
  borderRadius: 14,
  border: "1px solid #ddd",
  background: "#fff",
  padding: 14,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const toolbar = {
  marginTop: 12,
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const input = {
  minWidth: 320,
  flex: 1,
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ccc",
  outline: "none",
};

const btn = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
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

export default ProductTransactionsModal;
