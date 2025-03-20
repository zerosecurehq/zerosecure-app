import { Bell, ChevronDown, Layers, Waves } from "lucide-react"
import { Link } from "react-router-dom"

const Header = ({ isConnected }: { isConnected: boolean }) => {
  return (
    <header className="bg-white shadow-md flex items-center justify-between fixed top-0 left-0 w-full h-16 z-20">
      <div className="text-3xl font-bold p-4">
        <Link to={'/'}>
          Safe (WALLET)
        </Link>
      </div>
      <div className="flex items-center h-full">
        <div className="h-full flex items-center justify-center border-r border-gray-200 p-5 cursor-pointer hover:bg-gray-200">
          <Bell />
        </div>

        <div className="h-full flex items-center justify-center border-r border-gray-200 p-5 cursor-pointer hover:bg-gray-200">
          <Layers />
        </div>

        {isConnected && (
          <div className="h-full flex items-center justify-center border-r border-gray-200 p-5 cursor-pointer hover:bg-gray-200">
            <Waves />
          </div>
        )}

        {isConnected && (
          <div className="h-full flex items-center justify-center border-r border-gray-200 p-5 cursor-pointer gap-3 hover:bg-gray-200">
            <div className="w-12 h-14 relative">
              <img src="https://avatar.iran.liara.run/public/34" alt="Avatar" />
            </div>
            <div className="text-sm flex-1">
              <div className="font-semibold">eth: 0x...</div>
              <div className="font-semibold">0 ETH</div>
            </div>
            <ChevronDown />
          </div>
        )}

        {isConnected && (
          <div className="h-full flex items-center justify-center border-r border-gray-200 p-5 cursor-pointer gap-3 hover:bg-gray-200">
            <div className="w-12 h-14 relative">
              <img src="https://avatar.iran.liara.run/public/34" alt="Avatar" />
            </div>
            <div className="text-sm flex-1">
              <div className="font-semibold">Polygon</div>
              <div className="font-semibold">$ 0</div>
            </div>
            <ChevronDown />
          </div>
        )}

        {!isConnected && (
          <div className="h-full flex items-center justify-center p-5">
            <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">Connect</button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header