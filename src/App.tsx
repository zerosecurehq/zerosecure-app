import { Route, Routes } from "react-router-dom"
import Home from "./pages/dashboard/Home"
import Connect from "./pages/connect/Connect"
import Dashboard from "./pages/dashboard/Dashboard"
import Transactions from "./pages/dashboard/Transactions"
import Assets from "./pages/dashboard/Assets"
import AddressBook from "./pages/dashboard/AddressBook"
import Apps from "./pages/dashboard/Apps"
import Settings from "./pages/dashboard/Settings"
import WhatNew from "./pages/dashboard/WhatNew"
import NeedHelp from "./pages/dashboard/NeedHelp"

const App = () => {
  return (
    <main className="min-h-screen">
      <Routes>
      <Route path="/connect" element={<Connect />} />

      <Route path="/*" element={<Dashboard />} >
        <Route index element={<Home />} />
        <Route path="assets" element={<Assets />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="address-book" element={<AddressBook />} />
        <Route path="app" element={<Apps />} />
        <Route path="settings" element={<Settings />} />
        <Route path="what-new" element={<WhatNew />} />
        <Route path="need-help" element={<NeedHelp />} />
      </Route>
    </Routes>
    </main>
  )
}

export default App