import Connect from "@/pages/connect/Connect";
import Apps from "@/pages/dashboard/Apps";
import Dashboard from "@/pages/dashboard/Dashboard";
import Governance from "@/pages/dashboard/Governance";
import Home from "@/pages/dashboard/Home";
import Token from "@/pages/dashboard/Token";
import Transactions from "@/pages/dashboard/Transactions";
import useAccount from "@/stores/useAccount";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { useEffect, useRef } from "react";
import { Route, Routes, Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { publicKey } = useWallet();
  const { selectedWallet } = useAccount();
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (
      publicKey &&
      selectedWallet &&
      location.pathname === "/connect" &&
      !hasRedirectedRef.current
    ) {
      hasRedirectedRef.current = true;
      navigate("/", { replace: true });
    }
  }, [publicKey, selectedWallet, location.pathname, navigate]);

  useEffect(() => {
    if ((!publicKey || !selectedWallet) && location.pathname !== "/connect") {
      navigate("/connect", { replace: true });
    }
  }, [publicKey, selectedWallet, location.pathname, navigate]);

  return <Outlet />;
};

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/connect" element={<Connect />} />
        <Route element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="app" element={<Apps />} />
          <Route path="governance" element={<Governance />} />
          <Route path="token" element={<Token />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Routers;
