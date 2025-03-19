import { Link } from "lucide-react";
import Earth from "../../components/connect/Earth";

const Connect = () => {
  return (
    <div>
      <div className="fixed inset-0 -z-10">
        <img src="./bg.jpeg" alt="bg" className="w-full h-full object-cover" style={{ imageRendering: 'crisp-edges' }} />
      </div>

      <section className="h-[calc(100vh-10rem)] w-[calc(100vw-10rem)]">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-5">
          <Earth />
          <div className="w-full h-full flex flex-col items-center justify-between order-1 lg:order-2 mt-16 lg:mt-0 space-y-32">
            <div className="text-center px-4 space-y-4 mb-16">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white">Get started</h1>
              <p className="text-gray-300 text-base sm:text-lg md:text-xl">
                Connect your wallet to create a new Safe Account or open an existing one
              </p>
            </div>
            <div className="px-4 py-4 relative rounded-xl bg-gradient-to-r from-[#090979] to-[#00308F] text-white font-semibold cursor-pointer flex gap-1 items-center text-lg active:scale-95 transition-transform group overflow-hidden">
              <span className="absolute top-0 left-[-75%] w-[50%] h-full bg-white blur-md opacity-30 transform skew-x-[-20deg] group-hover:left-[125%] transition-all duration-700" />
              <Link className="group-hover:-translate-x-1 transition-transform duration-500" />
              <span className="group-hover:translate-x-1 transition-transform duration-500">Connect Wallet</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Connect