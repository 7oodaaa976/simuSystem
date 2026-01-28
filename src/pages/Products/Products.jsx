import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductForm from "./ProductForm";
import ProductTransactionsModal from "./ProductTransactionsModal";
import {
  createProduct,
  deleteProduct,
  listProducts,
  searchProducts,
  updateProduct,
} from "../../services/productsService";

const Products = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const canEdit = currentUser?.role === "admin" || currentUser?.role === "store";

  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ يبدأ من URL لو جاي من Topbar (q)
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState([]);

  const [mode, setMode] = useState(null); // "add" | "edit" | null
  const [editing, setEditing] = useState(null);

  // ✅ سجل الحركات
  const [txProduct, setTxProduct] = useState(null);

  const refresh = (q = query) => {
    setProducts(q.trim() ? searchProducts(q) : listProducts());
  };

  useEffect(() => {
    refresh(searchParams.get("q") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ كل ما query تتغير: نحدّث URL + نعمل refresh
  useEffect(() => {
    const q = query.trim();

    const sp = new URLSearchParams(searchParams);
    if (q) sp.set("q", q);
    else sp.delete("q");

    // نشيل open لو موجود (احتياطي)
    sp.delete("open");
    setSearchParams(sp, { replace: true });

    refresh(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // ✅ open=add يفتح مودال إضافة تلقائيًا
  useEffect(() => {
    const open = searchParams.get("open");
    if (open === "add" && canEdit) {
      openAdd();

      const sp = new URLSearchParams(searchParams);
      sp.delete("open");
      setSearchParams(sp, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canEdit]);

  const totals = useMemo(() => {
    const totalQty = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
    return { totalProducts: products.length, totalQty };
  }, [products]);

  const openAdd = () => {
    setEditing(null);
    setMode("add");
  };

  const openEdit = (p) => {
    setEditing(p);
    setMode("edit");
  };

  const closeForm = () => {
    setMode(null);
    setEditing(null);
  };

  const handleCreate = (data) => {
    const newProduct = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    createProduct(newProduct);
    closeForm();
    refresh();
  };

  const handleUpdate = (data) => {
    if (!editing) return;
    updateProduct(editing.id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    closeForm();
    refresh();
  };

  const handleDelete = (p) => {
    const ok = confirm(`متأكد تمسح المنتج: ${p.name} ؟`);
    if (!ok) return;
    deleteProduct(p.id);
    refresh();
  };

  const clearSearch = () => setQuery("");

  return (
    <div style={{ padding: 20 }}>
      <div style={headerWrap}>
        <div>
          <h1 style={{ margin: 0 }}>المنتجات</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.85 }}>
            عدد المنتجات: <b>{totals.totalProducts}</b> — إجمالي الكميات: <b>{totals.totalQty}</b>
          </p>
        </div>

        {canEdit ? (
          <button onClick={openAdd} style={btnPrimary}>+ إضافة منتج</button>
        ) : (
          <span style={{ fontSize: 13, opacity: 0.8 }}>صلاحية عرض فقط</span>
        )}
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          style={input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="بحث بالاسم / التصنيف / الكود / المكان ..."
        />
        <button style={btn} onClick={clearSearch}>مسح البحث</button>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {products.length === 0 ? (
          <div style={emptyBox}>لا توجد منتجات.</div>
        ) : (
          products.map((p) => (
            <div key={p.id} style={row}>
              <div style={{ minWidth: 250 }}>
                <div style={{ fontWeight: 800 }}>{p.name}</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>
                  التصنيف: {p.category || "-"} — الكود: {p.code || "-"}
                </div>
              </div>

              <div style={{ fontSize: 13, opacity: 0.85 }}>
                الكمية: <b>{p.quantity ?? 0}</b> — المكان: {p.location || "-"} — الحالة: <b>{mapStatus(p.status)}</b>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={btn} onClick={() => setTxProduct(p)}>سجل الحركات</button>

                {canEdit ? (
                  <>
                    <button style={btn} onClick={() => openEdit(p)}>تعديل</button>
                    <button style={btnDanger} onClick={() => handleDelete(p)}>حذف</button>
                  </>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {mode ? (
        <div style={modalBackdrop} onClick={closeForm}>
          <div style={modalBody} onClick={(e) => e.stopPropagation()}>
            <ProductForm
              initialValue={mode === "edit" ? editing : null}
              onCancel={closeForm}
              onSubmit={mode === "edit" ? handleUpdate : handleCreate}
            />
          </div>
        </div>
      ) : null}

      {/* Transactions Modal */}
      {txProduct ? (
        <ProductTransactionsModal
          product={txProduct}
          onClose={() => setTxProduct(null)}
        />
      ) : null}
    </div>
  );
};

const mapStatus = (s) => {
  if (s === "available") return "متاح";
  if (s === "in_use") return "قيد الاستخدام";
  if (s === "out") return "خارج المخزن";
  return s || "-";
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
};

const btnDanger = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ffb3b3",
  background: "#ffe6e6",
  color: "#b30000",
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

export default Products;
