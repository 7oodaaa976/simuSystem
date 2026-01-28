import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import TransactionForm from "./TransactionForm";
import { listProducts } from "../../services/productsService";
import { addTransaction, listTransactions } from "../../services/transactionsService";

const Transactions = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const canEdit = currentUser?.role === "admin" || currentUser?.role === "store";

  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // (اختياري) دعم بحث/فلتر من URL
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");

  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");

  const refresh = () => {
    setProducts(listProducts());
    setTransactions(listTransactions());
  };

  useEffect(() => {
    refresh();
  }, []);

  // ✅ open=add يفتح مودال تسجيل حركة تلقائيًا
  useEffect(() => {
    const openParam = searchParams.get("open");
    if (openParam === "add" && canEdit) {
      setOpen(true);

      const sp = new URLSearchParams(searchParams);
      sp.delete("open");
      setSearchParams(sp, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEdit]);

  // ✅ تحديث URL عند تغيير query/type (مفيد لو جيت تعمل share)
  useEffect(() => {
    const sp = new URLSearchParams(searchParams);

    const q = query.trim();
    if (q) sp.set("q", q);
    else sp.delete("q");

    if (typeFilter && typeFilter !== "all") sp.set("type", typeFilter);
    else sp.delete("type");

    sp.delete("open");
    setSearchParams(sp, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, typeFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return [...transactions]
      .filter((t) => (typeFilter === "all" ? true : t.type === typeFilter))
      .filter((t) => {
        if (!q) return true;
        const hay = `${t.productName} ${t.reason} ${t.receiver} ${t.by} ${t.date}`.toLowerCase();
        return hay.includes(q);
      })
      .reverse();
  }, [transactions, query, typeFilter]);

  const handleAdd = (payload) => {
    setErr("");
    const res = addTransaction(payload);
    if (!res.ok) {
      setErr(res.message || "حصل خطأ");
      return;
    }
    setOpen(false);
    refresh();
  };

  const clearFilters = () => {
    setQuery("");
    setTypeFilter("all");
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={headerWrap}>
        <div>
          <h1 style={{ margin: 0 }}>الحركات (دخول / خروج)</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.85 }}>
            إجمالي الحركات: <b>{transactions.length}</b>
          </p>
        </div>

        {canEdit ? (
          <button onClick={() => setOpen(true)} style={btnPrimary}>+ تسجيل حركة</button>
        ) : (
          <span style={{ fontSize: 13, opacity: 0.8 }}>صلاحية عرض فقط</span>
        )}
      </div>

      {err ? (
        <div style={{ ...box, borderColor: "#ffb3b3", background: "#ffe6e6", color: "#b30000" }}>
          {err}
        </div>
      ) : null}

      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          style={input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث بالمنتج / السبب / المستلم / بواسطة ..."
        />

        <select style={select} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">الكل</option>
          <option value="in">دخول (IN)</option>
          <option value="out">خروج (OUT)</option>
        </select>

        <button style={btn} onClick={clearFilters}>مسح الفلاتر</button>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={emptyBox}>لا توجد حركات.</div>
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

      {/* Modal */}
      {open ? (
        <div style={modalBackdrop} onClick={() => setOpen(false)}>
          <div style={modalBody} onClick={(e) => e.stopPropagation()}>
            <TransactionForm
              products={products}
              onCancel={() => setOpen(false)}
              onSubmit={handleAdd}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const headerWrap = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
};

const input = {
  minWidth: 320,
  flex: 1,
  padding: 10,
  borderRadius: 10,
  border: "1px solid #ccc",
  outline: "none",
};

const select = {
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

const box = {
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ddd",
  background: "#fff",
};

const modalBackdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "grid",
  placeItems: "center",
  padding: 16,
  zIndex: 999,
};

const modalBody = { width: "100%", maxWidth: 820 };

export default Transactions;
