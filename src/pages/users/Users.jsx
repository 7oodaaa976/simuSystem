import { useEffect, useState } from "react";
import {
  listUsers,
  addUser,
  updateUser,
  toggleUser,
  deleteUser,
} from "../../services/usersService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "staff",
  });
  const [editId, setEditId] = useState(null);

  const load = () => setUsers(listUsers());

  useEffect(() => {
    load();
  }, []);

  const submit = () => {
    if (!form.name || !form.username || !form.password) return;

    if (editId) {
      updateUser(editId, form);
      setEditId(null);
    } else {
      addUser(form);
    }

    setForm({ name: "", username: "", password: "", role: "staff" });
    load();
  };

  const startEdit = (u) => {
    setEditId(u.id);
    setForm({
      name: u.name,
      username: u.username,
      password: u.password,
      role: u.role,
    });
  };

  return (
    <div dir="rtl" style={{ padding: 20 }}>
      <h1>إدارة المستخدمين</h1>

      {/* Form */}
      <div style={box}>
        <input
          placeholder="الاسم"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="اسم المستخدم"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="كلمة المرور"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>

        <button onClick={submit}>
          {editId ? "تعديل المستخدم" : "إضافة مستخدم"}
        </button>
      </div>

      {/* Table */}
      <table style={table}>
        <thead>
          <tr>
            <th>الاسم</th>
            <th>Username</th>
            <th>Role</th>
            <th>الحالة</th>
            <th>تحكم</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.active ? "نشط" : "موقوف"}</td>
              <td>
                <button onClick={() => startEdit(u)}>✏️</button>
                <button onClick={() => toggleUser(u.id)}>🔁</button>
                <button onClick={() => deleteUser(u.id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const box = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: 8,
  marginBottom: 16,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

export default Users;
