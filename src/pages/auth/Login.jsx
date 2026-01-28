import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { listUsers } from "../../services/usersService";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setErr("");

    const users = listUsers(); // ✅ يجيب من localStorage (inventory_users)
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password.trim()
    );

    if (!user) {
      setErr("اسم المستخدم أو كلمة المرور غير صحيحة");
      return;
    }

    if (user.active === false) {
      setErr("هذا الحساب موقوف. تواصل مع المدير.");
      return;
    }

    // ✅ نخزن المستخدم الحالي
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      })
    );

    navigate("/dashboard", { replace: true });
  };

  return (
    <div dir="rtl" style={styles.wrap}>
      <div style={styles.card}>
        <h2 style={{ marginTop: 0 }}>تسجيل الدخول</h2>

        {err ? <div style={styles.err}>{err}</div> : null}

        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>اسم المستخدم</label>
          <input
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            // placeholder="admin / manager / staff"
          />

          <label style={styles.label}>كلمة المرور</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // placeholder="1234"
          />

          <button style={styles.btn}>دخول</button>

          {/* <div style={styles.hint}>
            حسابات تجريبية: <b>admin</b> / <b>manager</b> / <b>staff</b> — كلمة المرور: <b>1234</b>
          </div> */}
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f5f5f5",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 14,
    padding: 16,
  },
  err: {
    background: "#ffe6e6",
    border: "1px solid #ffb3b3",
    color: "#b30000",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  form: { display: "grid", gap: 10 },
  label: { fontSize: 13, opacity: 0.85 },
  input: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
    outline: "none",
  },
  btn: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #111",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
  hint: { fontSize: 12, opacity: 0.7, marginTop: 6 },
};

export default Login;
