const KEY = "products";

const read = () => JSON.parse(localStorage.getItem(KEY)) || [];
const write = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export const listProducts = () => read();

export const createProduct = (product) => {
  const products = read();
  products.push(product);
  write(products);
};

export const updateProduct = (id, patch) => {
  const products = read();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;

  products[idx] = { ...products[idx], ...patch };
  write(products);
  return true;
};

export const deleteProduct = (id) => {
  const products = read();
  const next = products.filter((p) => p.id !== id);
  write(next);
};

export const searchProducts = (q) => {
  const products = read();
  const query = (q || "").trim().toLowerCase();
  if (!query) return products;

  return products.filter((p) => {
    const hay = `${p.name} ${p.category} ${p.code} ${p.location} ${p.status}`.toLowerCase();
    return hay.includes(query);
  });
};
