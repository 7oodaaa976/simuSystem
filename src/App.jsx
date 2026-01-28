import { useEffect } from "react";
import { seedData } from "./data/seed";
import AppRoutes from "./routes/AppRoutes";

function App() {
  useEffect(() => {
    seedData();
  }, []);

  return <AppRoutes />;
}

export default App;
