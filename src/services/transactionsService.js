import { listProducts, updateProduct } from "./productsService";

const KEY = "transactions";

const read = () => JSON.parse(localStorage.getItem(KEY)) || [];
const write = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export const listTransactions = () => read();

export const listTransactionsByProduct = (productId) => {
  return read().filter((t) => t.productId === productId);
};

export const addTransaction = ({
  type,
  productId,
  quantity,
  reason = "",
  receiver = "",
}) => {
  const products = listProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return { ok: false, message: "المنتج غير موجود" };

  const qty = Number(quantity);
  if (Number.isNaN(qty) || qty <= 0)
    return { ok: false, message: "الكمية لازم تكون رقم أكبر من 0" };

  if (type === "out" && (Number(product.quantity) || 0) < qty) {
    return { ok: false, message: "الكمية في المخزن غير كافية" };
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const newQty =
    type === "in"
      ? (Number(product.quantity) || 0) + qty
      : (Number(product.quantity) || 0) - qty;

  updateProduct(productId, {
    quantity: newQty,
    status: newQty === 0 ? "out" : product.status || "available",
    updatedAt: new Date().toISOString(),
  });

  const tx = {
    id: crypto.randomUUID(),
    type, // "in" | "out"
    productId,
    productName: product.name,
    quantity: qty,
    reason: reason.trim(),
    receiver: receiver.trim(),
    by: currentUser?.name || "Unknown",
    role: currentUser?.role || "unknown",
    dateISO: new Date().toISOString(),
    date: new Date().toLocaleString(),
  };

  const transactions = read();
  transactions.push(tx);
  write(transactions);

  return { ok: true, transaction: tx };
};

export const deleteTransaction = (id) => {
  const transactions = read();
  write(transactions.filter((t) => t.id !== id));
};
