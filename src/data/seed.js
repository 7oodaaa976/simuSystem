export const seedData = () => {
  const users = localStorage.getItem("users");

  if (!users) {
    const defaultUsers = [
      {
        id: "u1",
        name: "Admin",
        username: "admin",
        password: "1234",
        role: "admin",
      },
      {
        id: "u2",
        name: "Store Keeper",
        username: "store",
        password: "1234",
        role: "store",
      },
      {
        id: "u3",
        name: "Viewer",
        username: "viewer",
        password: "1234",
        role: "viewer",
      },
    ];

    localStorage.setItem("users", JSON.stringify(defaultUsers));
    console.log("✅ Users seeded successfully");
  }
};
