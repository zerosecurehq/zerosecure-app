import { Link, Outlet } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import SidebarProvider from "./../../components/common/SidebarProvider";
import useAccount from "@/stores/useAccount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const { selectedWallet } = useAccount();
  return (
    <section className="min-h-screen w-full mt-16">
      <Header />
      <div className="flex min-h-screen">
        {/* <SidebarProvider>
          <Sidebar />
        </SidebarProvider> */}
        <div className="flex-1 overflow-y-auto bg-gray-100 mx-auto">
          {selectedWallet ? (
            <Outlet />
          ) : (
            <div className="flex items-center justify-center h-screen">
              <Card className="max-w-sm text-center">
                <CardHeader>
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                  <CardTitle className="text-xl font-semibold mt-4">
                    Access Denied
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    You do not have permission to access this page.
                  </p>
                  <Link to={"/connect"} className="hover:bg-gray-200 p-2 rounded-md">Return to Home</Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
