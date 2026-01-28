import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }} dir="rtl">
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <div style={{ padding: 8 }}>
          <Outlet />
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default AppLayout;
