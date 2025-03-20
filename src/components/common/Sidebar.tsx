import { ArrowUpDown, ChevronLeft, ChevronRight, Coins, Contact, Copy, HelpCircle, Home, LayoutGrid, LogOut, Settings, Sparkles } from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const SIDEBAR_ITEMS = [
  { name: "Home", icon: Home, href: "/" },
  { name: "Assets", icon: Coins, href: "/assets" },
  { name: "Transactions", icon: ArrowUpDown, href: "/transactions" },
  { name: "Address book", icon: Contact, href: "/address-book" },
  { name: "App", icon: LayoutGrid, href: "/app" },
  { name: "Settings", icon: Settings, href: "/settings" }
]

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedTab, setSelectedTab] = useState("Home")

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-opacity-50 backdrop-blur-md flex flex-col border-r border-gray-300">
        <div className="">
          <div className="w-full h-8 bg-purple-700 text-white text-center p-1">Pylygon</div>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-14 relative">
                <img src="https://avatar.iran.liara.run/public/34" alt="Avatar" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-300 rounded-full text-sm flex items-center justify-center">
                  1/1
                </div>
              </div>
              {isSidebarOpen && (
                <div className="text-sm flex-1">
                  <h3>nkj</h3>
                  <div className="font-semibold">matic: 0x...</div>
                  <div className="font-semibold">0 $</div>
                </div>
              )}
            </div>
            <motion.button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute p-2 rounded-full transition-colors max-w-fit -right-2"
              >
                {isSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </motion.button>
            <div className={`flex items-center gap-2 mt-4 ${!isSidebarOpen && "flex-col"}`}>
              <div className="p-2 w-10 h-10 flex justify-center items-center bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
                <Copy size={18} />
              </div>
              <div className="p-2 w-10 h-10 flex justify-center items-center bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
                <Copy size={18} />
              </div>
              <div className="p-2 w-10 h-10 flex justify-center items-center bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
                <LogOut size={18} />
              </div>
            </div>

            <div className="mt-4">
              <button className={`px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition text-center w-full`}> {isSidebarOpen ? "New transaction" : "N..."}</button>
            </div>
          </div>
        </div>
        <nav className="mt-1 flex-grow">
          <div className="border-t border-gray-200 flex flex-col justify-between">
            <div className="p-1">
              {SIDEBAR_ITEMS?.map((item) => (
                <Link key={item?.href} to={item?.href} onClick={() => setSelectedTab(item.name)}>
                  <motion.div className={`flex items-center p-3 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors mb-1 ${selectedTab === item.name && "bg-gray-300"}`}
                    
                  >
                    <item.icon size={20} style={{ minWidth: '20px' }} />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-4 whitespace-nowrap"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          {item?.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-200">
              <div className="p-1">
                <Link to={'/what-new'}>
                  <motion.div className={`flex items-center p-3 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors mb-1 ${selectedTab === "whatNew" && "bg-gray-300"}`}
                    
                    onClick={() => setSelectedTab("whatNew")}
                  >
                    <Sparkles size={20} style={{ minWidth: '20px' }} />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-4 whitespace-nowrap"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          What's new
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>

                <Link to={'/need-help'} onClick={() => setSelectedTab("needHelp")}>
                  <motion.div className={`flex items-center p-3 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors mb-1 ${selectedTab === "needHelp"}`}
                    
                  >
                    <HelpCircle size={20} style={{ minWidth: '20px' }} />
                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-4 whitespace-nowrap"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, delay: 0.3 }}
                        >
                          What's new
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </motion.div>
  )
}

export default Sidebar