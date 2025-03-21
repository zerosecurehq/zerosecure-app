import { ArrowDown, ArrowUp } from "lucide-react"

const Home = () => {
  return (
    <section className="bg-gray-100 w-full overflow-auto">
      <div className="w-full bg-orange-100 p-5 text-lg">
        ALWAYS <span className="font-semibold">verify transactions </span>that you are approving onyour signer wallet. If you can't verify it, dont't sign it
      </div>
      <div className="p-6">
        <div className="py-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg text-gray-700 font-semibold">Total asset value</div>
              <div className="text-5xl font-bold">$ 0<span className="text-gray-400">.00</span></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-200 border-2 border-black px-4 py-1 rounded-md cursor-pointer hover:bg-gray-100 duration-300">
                <ArrowDown />
                <div className="font-semibold">Send</div>
              </div>
              <div className="flex items-center gap-1 bg-gray-200 border-2 border-black px-4 py-1 rounded-md cursor-pointer hover:bg-gray-100 duration-300">
                <ArrowUp />
                <div className="font-semibold">Receive</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h3 className="font-bold text-lg mb-5">Top assets</h3>
            <div className="p-7 bg-white rounded-md">
              <div className="font-bold text-xl mb-3">Add funds to get started</div>
              <p>Add funds directly from your bank account or copy your address to send tokens from a different account</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-5">Pending transactions</h3>
            <div className="p-7 bg-white rounded-md">
              <p>This safe Account has no reqeued transactions</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-5">Safe Apps</h3>
            <div className="p-7 bg-white rounded-md text-center">
              <div className="py-2 px-4 bg-black text-white rounded-md inline-block">
                Explore Safe Apps
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home