import { useState } from "react"
import Queue from "../../components/dashboard/Queue"
import History from "../../components/dashboard/History"
import Messages from "../../components/dashboard/Messages"

const Transactions = () => {
  const [tab, setTab] = useState("queue")

  return (
    <section className="bg-gray-100 w-full overflow-scroll">
      <div className="w-full bg-orange-100 p-5 text-lg">
        ALWAYS <span className="font-semibold">verify transactions </span>that you are approving onyour signer wallet. If you can't verify it, dont't sign it
      </div>
      <div className="pt-6 pl-6 pr-6 border-b border-gray-300">
        <h2 className="font-bold text-4xl">Transactions</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center">
            <div className="text-gray-700 p-4 relative font-semibold cursor-pointer hover:text-gray-600" onClick={() => setTab("queue")}>
              Queue
              {tab === "queue" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />}
            </div>
            <div className="text-gray-700 p-4 relative font-semibold cursor-pointer hover:text-gray-600" onClick={() => setTab("history")}>
              History
              {tab === "history" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />}
            </div>
            <div className="text-gray-700 p-4 relative font-semibold cursor-pointer hover:text-gray-600" onClick={() => setTab("messages")}>
              Messages
              {tab === "messages" && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />}
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <input type="checkbox" className="toggle toggle-success" defaultChecked />
            <div>Hide suspicious</div>
            <select className="select select-bordered select-sm max-w-xs">
              <option disabled selected>
                Filter
              </option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 2</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-10 px-6">
        {tab === "queue" && <Queue />}
        {tab === "history" && <History />}
        {tab === "messages" && <Messages />}
      </div>
    </section>
  )
}

export default Transactions