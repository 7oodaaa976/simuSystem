const KEY = "inventory_users";

const seed = [
  {
    id: "u1",
    name: "Admin",
    username: "admin",
    password: "1234",
    role: "admin",
    active: true,
  },
  {
    id: "u2",
    name: "Manager",
    username: "manager",
    password: "1234",
    role: "manager",
    active: true,
  },
  {
    id: "u3",
    name: "Staff",
    username: "staff",
    password: "1234",
    role: "staff",
    active: true,
  },
];

const read = () => {
  const data = localStorage.getItem(KEY);
  if (!data) {
    localStorage.setItem(KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(data);
};

const write = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const listUsers = () => read();

export const addUser = (user) => {
  const users = read();
  users.push({ ...user, id: crypto.randomUUID(), active: true });
  write(users);
};

export const updateUser = (id, updates) => {
  const users = read().map((u) =>
    u.id === id ? { ...u, ...updates } : u
  );
  write(users);
};

export const toggleUser = (id) => {
  const users = read().map((u) =>
    u.id === id ? { ...u, active: !u.active } : u
  );
  write(users);
};

export const deleteUser = (id) => {
  const users = read().filter((u) => u.id !== id);
  write(users);
};
