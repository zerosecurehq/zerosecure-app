import { Link } from "react-router-dom";
import Header from "../../components/common/Header";

const Connect = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Header isConnected={false} />
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden gap-5">

        {/* Left */}
        <div className=" bg-gradient-to-br from-green-300 to-green-500 p-10 flex flex-col justify-center space-y-6 shadow-lg h-[calc(100vh-10rem)] rounded-lg">
          <h1 className="text-4xl font-bold text-black">Unlock a new way of ownership</h1>
          <p className="text-black text-lg">
            The most trusted decentralized custody protocol and collective asset management platform.
          </p>
          <ul className="space-y-3 text-black">
            <li className="flex items-start gap-2">
              ✅ <span>Stealth security with multiple signers</span>
            </li>
            <li className="flex items-start gap-2">
              ✅ <span>Make it yours with modules and guards</span>
            </li>
            <li className="flex items-start gap-2">
              ✅ <span>Access 130+ ecosystem apps</span>
            </li>
          </ul>
        </div>

        {/* Right */}
        <div className="bg-white p-10 flex flex-col items-center justify-center space-y-6 shadow-lg h-[calc(100vh-10rem)] rounded-lg overflow-hidden">
          <img src="https://avatars.githubusercontent.com/u/66339815?s=200&v=4" alt="Safe Logo" className="w-16 h-16" />
          <h2 className="text-2xl font-semibold">Get started</h2>
          <p className="text-center text-gray-600">Connect your wallet to create a new Safe Account or open an existing one</p>

          <Link to={"/"} className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition">Connect wallet</Link>

          <div className="w-full border-t border-gray-300 my-4"></div>

          <button className="text-black underline hover:text-blue-600">View my accounts</button>
        </div>
      </div>
    </main>
  );
}

export default Connect