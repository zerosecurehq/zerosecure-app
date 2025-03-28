import { Outlet } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import SidebarProvider from "./../../components/common/SidebarProvider";

const Dashboard = () => {
  return (
    <section className="min-h-screen w-full mt-16">
      <Header isConnected={true} />
      <div className="flex min-h-screen">
        {/* <SidebarProvider>
          <Sidebar />
        </SidebarProvider> */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
