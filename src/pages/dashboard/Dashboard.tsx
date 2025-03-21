import { Outlet } from "react-router-dom"
import Sidebar from "../../components/common/Sidebar"
import Header from "../../components/common/Header"

const Dashboard = () => {
  return (
    <section className="min-h-screen overflow-hidden">
      <Header isConnected={true} />
      <div className="flex h-full mt-16">
        <Sidebar />
        <Outlet />
      </div>
    </section>
  )
}

export default Dashboard